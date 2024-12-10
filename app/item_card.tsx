import { get_image_url } from "@/util/files";
import Image from "next/image";
import { Item } from "@/app/db/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format_to_dollar } from "@/util/currency";

export function ItemCard({ item }: { item: Item }) {
    return (
        <div key={item.id} className="border p-8 rounded-xl space-y-2">
            <Image
                src={get_image_url(item.file_key)}
                alt={item.name}
                width={200}
                height={200}
            ></Image>
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p className="text-lg">
                {/* starting price: ${item.starting_price / 100} */}
                starting price: ${format_to_dollar(item.starting_price)}
            </p>
            <Button asChild>
                <Link href={`/items/${item.id}`}>place bid</Link>
            </Button>
        </div>
    );
}
