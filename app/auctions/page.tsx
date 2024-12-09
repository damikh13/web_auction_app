import { database } from "@/app/db/database";
import { ItemCard } from "@/app/item_card";
import { items } from "@/app/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { EmptyState } from "@/app/auctions/empty_state";
import { page_title_styles } from "@/styles";

export default async function MyAuctionPage() {
    const session = await auth();

    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const all_items = await database.query.items.findMany({
        where: eq(items.userId, session.user.id!),
    }); // fetch all the bids from 'au_bids' table

    const has_items = all_items.length > 0;

    return (
        <main className="space-y-4">
            <h1 className={page_title_styles}>your current auctions</h1>
            {has_items ? (
                <div className="grid grid-cols-4 gap-8">
                    {all_items.map((item) => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <EmptyState />
            )}
        </main>
    );
}
