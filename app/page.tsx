import { database } from "@/app/db/database";
import { ItemCard } from "@/app/item_card";
import { items, categories } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export default async function HomePage() {
    const all_items = await database
        .select({
            item: items,
            category: categories,
        })
        .from(items)
        .leftJoin(categories, eq(categories.id, items.category_id))
        .execute();

    return (
        <main className="space-y-4">
            <h2 className="text-4xl font-bold">items for sale</h2>
            <div className="grid grid-cols-4 gap-4">
                {all_items.map((result) => {
                    const { item, category } = result;

                    const category_info = category
                        ? category
                        : { name: "uncategorized" };

                    return (
                        <ItemCard
                            key={item.id}
                            item={{ ...item, category: category_info }}
                        />
                    );
                })}
            </div>
        </main>
    );
}
