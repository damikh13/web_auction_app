import { Button } from "@/components/ui/button";
import { page_title_styles } from "@/styles";
import Link from "next/link";
import Image from "next/image";
import { get_image_url } from "@/util/files";
import { formatDistance, subDays } from "date-fns";
import { format_to_dollar } from "@/util/currency";
import { create_bid_action } from "./actions";
import { get_bids_for_item } from "@/data_access/bids";
import { get_item } from "@/data_access/items";

function format_timestamp(timestamp: Date) {
    return formatDistance(timestamp, new Date(), {
        addSuffix: true,
    });
}

export default async function ItemPage({
    params: { item_id },
}: {
    params: { item_id: string };
}) {
    const item = await get_item(parseInt(item_id));

    if (!item) {
        return (
            <div className="space-y-8 flex flex-col items-center mt-12">
                <h1 className={page_title_styles}>item not found</h1>
                <p className="text-center">
                    the item you're trying to view is invalid.
                    <br />
                    place go back and search for a diffirent auction item
                </p>

                <Image
                    src="/no_data.svg"
                    width="200"
                    height="200"
                    alt="No data"
                ></Image>

                <Button asChild>
                    <Link href="/auctions">view auctions</Link>
                </Button>
            </div>
        );
    }

    const all_bids = await get_bids_for_item(item.id);
    const has_bids = all_bids.length > 0;

    return (
        <main className="space-y-4">
            <div className="flex gap-8">
                <div className="flex flex-col gap-6">
                    <h1 className={page_title_styles}>
                        <span className="font-normal">auction for</span>{" "}
                        {item.name}
                    </h1>
                    <Image
                        className="rounded-xl"
                        src={get_image_url(item.file_key)}
                        alt={item.name}
                        width={400}
                        height={400}
                    ></Image>
                    <div className="text-xl space-y-4">
                        <div>
                            current bid{" "}
                            <span className="font-bold">
                                ${format_to_dollar(item.current_bid)}
                            </span>
                        </div>
                        <div>
                            starting price of{" "}
                            <span className="font-bold">
                                ${format_to_dollar(item.starting_price)}
                            </span>
                        </div>
                        <div>
                            bid interval of{" "}
                            <span className="font-bold">
                                ${format_to_dollar(item.bid_interval)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 flex-1">
                    <div className="flex justify-between">
                        <h2 className="text-2xl font-bold">current bids</h2>
                        <form action={create_bid_action.bind(null, item.id)}>
                            <Button>place a bid</Button>
                        </form>
                    </div>

                    {has_bids ? (
                        <ul className="space-y-4">
                            {all_bids.map((bid) => (
                                <li className="bg-gray-100 rounded-xl p-4">
                                    <div className="flex gap-4">
                                        <div>
                                            <span className="font-bold">
                                                ${format_to_dollar(bid.amount)}
                                            </span>{" "}
                                            by{" "}
                                            <span className="font-bold">
                                                {bid.user.name}
                                            </span>{" "}
                                        </div>
                                        <div>
                                            {format_timestamp(bid.timestamp)}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center gap-4 bg-gray-100 rounded-xl p-12">
                            <h2 className="text-2xl font-bold">no bids yet</h2>
                            <Image
                                src="/no_data.svg"
                                width="200"
                                height="200"
                                alt="No data"
                            ></Image>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
