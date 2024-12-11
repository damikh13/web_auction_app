import { Item } from "@/app/db/schema";

export function is_bid_over(item: Item) {
    return item.end_date < new Date();
}
