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

export async function create_item_action(form_data: FormData) {
    const session = await auth();

    if (!session) {
        throw new Error("unauthorized.");
    }

    const user = session.user;

    if (!user || !user.id) {
        throw new Error("somehow session was defined but user/user_id wasn't.");
    }

    const file = form_data.get("file") as File;
    console.log(file);

    const starting_price_str = form_data.get("starting_price") as string;
    const starting_price_as_cents = Math.floor(
        parseFloat(starting_price_str) * 100
    );

    await database.insert(items).values({
        name: form_data.get("name") as string,
        starting_price: starting_price_as_cents,
        userId: user.id,
    });
    redirect("/");
}
