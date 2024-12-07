"use server";

import { revalidatePath } from "next/cache";
import { database } from "@/app/db/database";
import { items } from "@/app/db/schema";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function create_item_action(form_data: FormData) {
    const session = await auth();

    if (!session) {
        throw new Error("unauthorized.");
    }

    const user = session.user;

    if (!user || !user.id) {
        throw new Error("somehow session was defined but user/user_id wasn't.");
    }

    await database.insert(items).values({
        name: form_data.get("name") as string,
        starting_price: Number(form_data.get("starting_price")),
        userId: user.id,
    });
    redirect("/");
}
