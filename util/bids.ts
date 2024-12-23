import { ItemWithCategory } from "@/data_access/items";

export function is_bid_over(item: ItemWithCategory["item"]) {
    const current_date = new Date();
    const auction_end_date = new Date(item.end_date);

    return auction_end_date < current_date;
}
