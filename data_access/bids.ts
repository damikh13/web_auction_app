import { database } from "@/app/db/database";
import { desc, eq } from "drizzle-orm";
import { bids } from "@/app/db/schema";

export async function get_bids_for_item(item_id: number) {
    const all_bids = await database.query.bids.findMany({
        where: eq(bids.item_id, item_id),
        orderBy: desc(bids.id),
        with: {
            user: {
                columns: {
                    image: true,
                    name: true,
                },
            },
        },
    });

    return all_bids;
}
