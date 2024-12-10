"use server";

import { auth } from "@/auth";
import { database } from "@/app/db/database";
import { bids, items } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function create_bid_action(item_id: number) {
    const session = await auth();

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

    revalidatePath(`/items/${item_id}`);
}
