"use client";

import { useEffect, useState } from "react";
import { ItemCard } from "@/app/item_card";
import { useSession } from "next-auth/react";

interface ItemWithCategory {
    item: {
        id: number;
        userId: string;
        name: string;
        file_key: string;
        current_bid: number;
        starting_price: number;
        bid_interval: number;
        end_date: Date;
        category_id: number;
    };
    category: {
        name: string;
    } | null;
}

export default function WinningAuctionsPage() {
    const { data: session, status } = useSession();
    const [winning_items, set_winning_items] = useState<ItemWithCategory[]>([]);

    useEffect(() => {
        async function fetchWinningAuctions() {
            if (!session?.user?.id) return;

            try {
                const response = await fetch(
                    `/api/items/winning?user_id=${session.user.id}`
                );
                const data = await response.json();

                set_winning_items(data.items || []);
            } catch (error) {
                console.error("error fetching winning auctions:", error);
            }
        }

        fetchWinningAuctions();
    }, [session]);

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (!session?.user) {
        return <p>please log in to view your winning auctions.</p>;
    }

    return (
        <main className="space-y-4">
            <h1 className="text-4xl font-bold">Your Winning Auctions</h1>
            <div className="grid grid-cols-4 gap-4">
                {winning_items.length > 0 ? (
                    winning_items.map(({ item, category }) => {
                        const category_info = category || {
                            name: "uncategorized",
                        };

                        return (
                            <ItemCard
                                key={item.id}
                                item={{
                                    item,
                                    category: category_info,
                                }}
                            />
                        );
                    })
                ) : (
                    <p>no winning auctions yet.</p>
                )}
            </div>
        </main>
    );
}
