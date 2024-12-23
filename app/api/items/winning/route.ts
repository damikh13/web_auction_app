import { database } from "@/app/db/database";
import { items } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const user_id = url.searchParams.get("user_id");

    if (!user_id) {
        return new Response("user ID required", { status: 400 });
    }

    try {
        const winningItems = await database.query.items.findMany({
            where: eq(items.winner_id, user_id),
            with: {
                category: true,
            },
        });

        const formattedItems = winningItems.map((item) => ({
            item,
            category: item.category ? { name: item.category.name } : null,
        }));

        return new Response(JSON.stringify({ items: formattedItems }));
    } catch (error) {
        console.error("Error fetching winning auctions:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
