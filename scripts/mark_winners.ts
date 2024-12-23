import schedule from "node-schedule";
import { database } from "@/app/db/database";
import { bids, items } from "@/app/db/schema";
import { eq, and, gt, desc, isNull, sql, lt } from "drizzle-orm";

async function mark_auction_winners() {
    try {
        console.log("Starting the process of marking auction winners...");

        const now = sql`NOW()`;
        console.log("Current time:", now);

        // find expired auctions that haven't been marked with a winner
        const expired_auctions = await database.query.items.findMany({
            where: and(lt(items.end_date, now), isNull(items.winner_id)),
        });

        console.log("Found expired auctions:", expired_auctions.length);

        for (const auction of expired_auctions) {
            console.log(`Processing auction ID: ${auction.id}...`);

            // find the highest bid for each auction
            const highest_bid = await database.query.bids.findFirst({
                where: eq(bids.item_id, auction.id),
                orderBy: desc(bids.amount), // Get the highest bid first
            });

            if (highest_bid) {
                console.log(
                    `Auction ID: ${auction.id} has a winner. User ID: ${highest_bid.user_id}, Bid amount: ${highest_bid.amount}`
                );

                // mark the auction as won
                await database
                    .update(items)
                    .set({ winner_id: highest_bid.user_id })
                    .where(eq(items.id, auction.id));

                console.log(
                    `Auction ID: ${auction.id} winner marked successfully.`
                );
            } else {
                console.log(`No bids found for Auction ID: ${auction.id}`);
            }
        }

        console.log("Auctions processed:", expired_auctions.length);
    } catch (error) {
        console.error("Error marking auction winners:", error);
    }
}

// schedule the function to run every second (for testing purposes)
schedule.scheduleJob("* * * * * *", function () {
    console.log("Cron job triggered...");
    mark_auction_winners();
});
