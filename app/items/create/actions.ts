"use server";

import { revalidatePath } from "next/cache";
import { database } from "@/app/db/database";
import { items } from "@/app/db/schema";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { get_signed_url_for_s3_obj } from "@/lib/s3";

export async function create_upload_url_action(key: string, type: string) {
    return await get_signed_url_for_s3_obj(key, type);
}

export async function create_item_action({
    filename,
    name,
    starting_price,
    bid_interval,
    end_date,
    category_id,
}: {
    filename: string;
    name: string;
    starting_price: number;
    bid_interval: number;
    end_date: Date;
    category_id: number;
}) {
    const session = await auth();

    if (!session) {
        throw new Error("unauthorized.");
    }

    const user = session.user;

    if (!user || !user.id) {
        throw new Error("somehow session was defined but user/user_id wasn't.");
    }

    await database.insert(items).values({
        userId: user.id,
        name,
        file_key: filename,
        current_bid: starting_price,
        starting_price,
        bid_interval,
        end_date,
        category_id,
    });
    redirect("/");
}
