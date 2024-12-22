import { ItemWithCategory } from "@/data_access/items";

export function is_bid_over(item: ItemWithCategory["item"]) {
    return item.end_date < new Date();
}
