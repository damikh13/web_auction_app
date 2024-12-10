import { database } from "@/app/db/database";
import { items } from "@/app/db/schema";
import { Button } from "@/components/ui/button";
import { page_title_styles } from "@/styles";
import { eq } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { get_image_url } from "@/util/files";
import { formatDistance, subDays } from "date-fns";
import { format_to_dollar } from "@/util/currency";

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
    const item = await database.query.items.findFirst({
        where: eq(items.id, parseInt(item_id)),
    });

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

    // const bids = [
    //     {
    //         id: 1,
    //         amount: 100,
    //         user_name: "Alice",
    //         timestamp: new Date(),
    //     },
    //     {
    //         id: 2,
    //         amount: 200,
    //         user_name: "Bob",
    //         timestamp: new Date(),
    //     },
    //     {
    //         id: 3,
    //         amount: 300,
    //         user_name: "Clarlie",
    //         timestamp: new Date(),
    //     },
    // ];
    const bids = [];

    const has_bids = bids.length > 0;

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
                    <div className="text-xl">
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
                    <h2 className="text-2xl font-bold">current bids</h2>

                    {has_bids ? (
                        <ul className="space-y-4">
                            {bids.map((bid) => (
                                <li className="bg-gray-100 rounded-xl p-4">
                                    <div className="flex gap-4">
                                        <div>
                                            <span className="font-bold">
                                                ${bid.amount}
                                            </span>{" "}
                                            by{" "}
                                            <span className="font-bold">
                                                {bid.user_name}
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
                            <Button>place a bid</Button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
