"use client";

import { useEffect, useState } from "react";
import { ItemCard } from "@/app/item_card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/app/auctions/empty_state";
import { page_title_styles } from "@/styles";
import { useSession } from "next-auth/react";

import { ItemWithCategory } from "@/data_access/items";

export default function MyAuctionPage() {
    const { data: session, status } = useSession();
    const [items, setItems] = useState<ItemWithCategory[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );

    const user_id = session?.user?.id;

    useEffect(() => {
        async function fetchData() {
            if (!user_id) return;

            try {
                const response = await fetch("/api/items");
                const data = await response.json();

                setCategories(data.categories);
                setItems(
                    data.items.filter(
                        (item: { item: { userId: string } }) =>
                            item.item.userId === user_id
                    )
                ); // Filter items by user ID
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [user_id]);

    const filteredItems = selectedCategory
        ? items.filter((item) => item.category?.name === selectedCategory)
        : items;

    const has_items = filteredItems.length > 0;

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (!session?.user) {
        return <p>Please log in to view your auctions.</p>;
    }

    return (
        <main className="space-y-4">
            <h1 className={page_title_styles}>Your Current Auctions</h1>

            <div className="flex gap-4">
                <Button
                    onClick={() => setSelectedCategory(null)}
                    variant="outline"
                >
                    All
                </Button>
                {categories.map((category) => (
                    <Button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        variant="outline"
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {has_items ? (
                <div className="grid grid-cols-4 gap-8">
                    {filteredItems.map((result) => {
                        const { item, category } = result;
                        const category_info = category
                            ? category
                            : { name: "uncategorized" };

                        return (
                            <ItemCard
                                key={item.id}
                                item={{
                                    item,
                                    category: category_info,
                                }}
                                userId={user_id ? user_id : "unauthorized"}
                            />
                        );
                    })}
                </div>
            ) : (
                <EmptyState />
            )}
        </main>
    );
}
