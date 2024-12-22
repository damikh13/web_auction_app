import { database } from "@/app/db/database";
import { eq } from "drizzle-orm";
import { items, categories } from "@/app/db/schema";

// Define the ItemWithCategory type
export type ItemWithCategory = {
    item: {
        id: number;
        userId: string;
        name: string;
        file_key: string;
        current_bid: number;
        starting_price: number;
        bid_interval: number;
        end_date: Date;
        category_id: number;
    };
    category: {
        name: string;
    } | null;
};

export async function get_item(item_id: number): Promise<ItemWithCategory | null> {
    const item = await database
        .select()
        .from(items)
        .leftJoin(categories, eq(categories.id, items.category_id)) // join categories table
        .where(eq(items.id, item_id))
        .execute();

    if (item.length > 0) {
        const result = item[0];

        const item_with_category: ItemWithCategory = {
            item: {
                id: result.au_items.id,
                userId: result.au_items.userId,
                name: result.au_items.name,
                file_key: result.au_items.file_key,
                current_bid: result.au_items.current_bid,
                starting_price: result.au_items.starting_price,
                bid_interval: result.au_items.bid_interval,
                end_date: result.au_items.end_date,
                category_id: result.au_items.category_id,
            },
            category: result.au_categories ? { name: result.au_categories.name } : null, // If category exists, return its name, otherwise null
        };

        return item_with_category;
    } else {
        console.log("Item not found");
        return null;
    }
}
