import { database } from "@/app/db/database";
import { ItemCard } from "@/app/item_card";
import { items, categories } from "@/app/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { EmptyState } from "@/app/auctions/empty_state";
import { page_title_styles } from "@/styles";

export default async function MyAuctionPage() {
    const session = await auth();

    if (!session || !session.user) {
        throw new Error("unauthorized");
    }

    const all_items = await database
        .select({
            item: items,
            category: categories,
        })
        .from(items)
        .leftJoin(categories, eq(categories.id, items.category_id))
        .where(eq(items.userId, session.user.id!))
        .execute();

    const has_items = all_items.length > 0;

    return (
        <main className="space-y-4">
            <h1 className={page_title_styles}>your current auctions</h1>
            {has_items ? (
                <div className="grid grid-cols-4 gap-8">
                    {all_items.map((result) => {
                        const { item, category } = result;

                        const categoryInfo = category
                            ? category
                            : { name: "uncategorized" };

                        return (
                            <ItemCard
                                key={item.id}
                                item={{ ...item, category: categoryInfo }}
                            />
                        );
                    })}
                </div>
            ) : (
                <EmptyState />
            )}
        </main>
    );
}
