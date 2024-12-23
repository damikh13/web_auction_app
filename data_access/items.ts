import { database } from "@/app/db/database";
import { eq } from "drizzle-orm";
import { items, categories } from "@/app/db/schema";

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
        winner_id: string | null;
    };
    category: {
        name: string;
    } | null;
};

// Fetch a single item by ID, with category
export async function get_item(
    item_id: number
): Promise<ItemWithCategory | null> {
    const item = await database
        .select()
        .from(items)
        .leftJoin(categories, eq(categories.id, items.category_id))
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
                winner_id: result.au_items.winner_id,
            },
            category: result.au_categories
                ? { name: result.au_categories.name }
                : null,
        };

        return item_with_category;
    } else {
        console.log("Item not found");
        return null;
    }
}

export async function get_categories() {
    const result = await database.select().from(categories).execute();
    return result.map((cat) => cat.name); // return category names
}

export async function get_items(category: string | null = null) {
    const query = database
        .select()
        .from(items)
        .leftJoin(categories, eq(categories.id, items.category_id));

    if (category) {
        query.where(eq(categories.name, category)); // filter by category if provided
    }

    const result = await query.execute();

    return result.map((row) => ({
        item: {
            id: row.au_items.id,
            userId: row.au_items.userId,
            name: row.au_items.name,
            file_key: row.au_items.file_key,
            current_bid: row.au_items.current_bid,
            starting_price: row.au_items.starting_price,
            bid_interval: row.au_items.bid_interval,
            end_date: row.au_items.end_date,
            category_id: row.au_items.category_id,
        },
        category: row.au_categories ? { name: row.au_categories.name } : null,
    }));
}
