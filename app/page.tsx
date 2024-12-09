import { database } from "@/app/db/database";
import { ItemCard } from "@/app/item_card";
import { page_title_styles } from "@/styles";

export default async function HomePage() {
    const all_items = await database.query.items.findMany(); // fetch all the items from 'au_items' table

    return (
        <main className="space-y-4">
            {/* <h2 className={page_title_styles}>items for sale</h2> */}
            <h2 className="text-4xl font-bold">items for sale</h2>

            <div className="grid grid-cols-4 gap-4">
                {all_items.map((item) => (
                    <ItemCard key={item.id} item={item} />
                ))}
            </div>
        </main>
    );
}
