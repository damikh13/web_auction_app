import { get_image_url } from "@/util/files";
import Image from "next/image";
import { ItemWithCategory } from "@/data_access/items"; // Import the correct type
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format_to_dollar } from "@/util/currency";
import { format } from "date-fns";
import { is_bid_over } from "@/util/bids";
import { Badge } from "@/components/ui/badge";

export function ItemCard({ item }: { item: ItemWithCategory }) {
    return (
        <div key={item.item.id} className="border p-8 rounded-xl space-y-2">
            <Image
                src={get_image_url(item.item.file_key)}
                alt={item.item.name}
                width={200}
                height={200}
            ></Image>
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
        </div>
    );
}
