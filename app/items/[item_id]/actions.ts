"use server";

import { auth } from "@/auth";
import { database } from "@/app/db/database";
import { bids, items } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Knock } from "@knocklabs/node";
import { env } from "@/env";

const knock = new Knock(env.KNOCK_SECRET_KEY);

export async function create_bid_action(item_id: number) {
    const session = await auth();

    const user_id = session?.user?.id;

    if (!session || !session.user || !session.user.id) {
        throw new Error("you must be logged in to place a bid");
    }

    const item = await database.query.items.findFirst({
        where: eq(items.id, item_id),
    });

    if (!item) {
        throw new Error("item not found");
    }

    const latest_bid_value = item.current_bid + item.bid_interval;

    await database.insert(bids).values({
        amount: latest_bid_value,
        item_id,
        user_id: session.user.id,
        timestamp: new Date(),
    });

    await database
        .update(items)
        .set({
            current_bid: latest_bid_value,
        })
        .where(eq(items.id, item_id));

    const current_bids = await database.query.bids.findMany({
        where: eq(bids.item_id, item_id),
        with: {
            user: true,
        },
    });

    const recipients: {
        id: string;
        name: string;
        email: string;
    }[] = [];

    for (const bid of current_bids) {
        if (
            bid.user_id !== user_id &&
            !recipients.find((recipient) => recipient.id === bid.user_id)
        ) {
            recipients.push({
                id: bid.user_id + "",
                name: bid.user.name ?? "Anonymous",
                email: bid.user.email ?? "Anonymous",
            });
        }
    }

    if (recipients.length > 0) {
        await knock.workflows.trigger("user-placed-bid", {
            actor: {
                id: user_id ?? "Anonymous id?",
                name: session.user.name ?? "Anonymous",
                email: session.user.email,
                collection: "users",
            },
            recipients,
            data: {
                item_id,
                bid_amount: latest_bid_value,
                item_name: item.name,
            },
        });
    }

    revalidatePath(`/items/${item_id}`);
}
