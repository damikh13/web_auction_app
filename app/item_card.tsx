import { get_image_url } from "@/util/files";
import Image from "next/image";
import { ItemWithCategory } from "@/data_access/items";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format_to_dollar } from "@/util/currency";
import { format } from "date-fns";
import { is_bid_over } from "@/util/bids";
import { Badge } from "@/components/ui/badge";

function is_winner(item: ItemWithCategory["item"], userId: string): boolean {
    return item.winner_id === userId;
}

export function ItemCard({
    item,
    userId,
}: {
    item: ItemWithCategory;
    userId: string;
}) {
    const is_won = is_winner(item.item, userId);

    return (
        <div key={item.item.id} className="border p-8 rounded-xl space-y-2">
            <div className="relative w-full h-48">
                <Image
                    src={get_image_url(item.item.file_key)}
                    alt={item.item.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                />
            </div>
            <h2 className="text-xl font-bold">{item.item.name}</h2>

            {item.category && item.category.name && (
                <Badge className="w-fit">{item.category.name}</Badge>
            )}

            <p className="text-lg">
                starting price: ${format_to_dollar(item.item.starting_price)}
            </p>

            {is_bid_over(item.item) ? (
                <p className="text-lg">auction is over</p>
            ) : (
                <p className="text-lg">
                    ends on: {format(item.item.end_date, "eeee dd/M/yy")}
                </p>
            )}

            <Button
                asChild
                variant={is_bid_over(item.item) ? "outline" : "default"}
            >
                <Link href={`/items/${item.item.id}`}>
                    {is_bid_over(item.item) ? "view bids history" : "place bid"}
                </Link>
            </Button>

            {is_won && (
                <Button asChild variant="outline" className="mt-2">
                    <Link
                        href={{
                            pathname: "/items/create",
                            query: {
                                name: item.item.name,
                                starting_price: item.item.starting_price / 100,
                                bid_interval: item.item.bid_interval / 100,
                                category_id: item.item.category_id,
                            },
                        }}
                    >
                        Resell
                    </Link>
                </Button>
            )}
        </div>
    );
}
