import { database } from "@/app/db/database";
import { eq } from "drizzle-orm";
import { items } from "@/app/db/schema";

export async function get_item(item_id: number) {
    const item = await database.query.items.findFirst({
        where: eq(items.id, item_id),
    });

    return item;
}
