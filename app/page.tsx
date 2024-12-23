"use client";

import { useEffect, useState } from "react";
import { ItemCard } from "@/app/item_card";
import { Button } from "@/components/ui/button";

import { ItemWithCategory } from "@/data_access/items";
import { useSession } from "next-auth/react";

export default function HomePage() {
    const [items, set_items] = useState<ItemWithCategory[]>([]);
    const [categories, set_categories] = useState<string[]>([]);
    const [selected_category, set_selected_category] = useState<string | null>(
        null
    );

    const session = useSession();
    const user_id = session?.data?.user?.id;

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/api/items");
                const data = await response.json();

                set_categories(data.categories);
                set_items(data.items);
            } catch (error) {
                console.error("error fetching data:", error);
            }
        }

        fetchData();
    }, []);

    const filteredItems = selected_category
        ? items.filter((item) => item.category?.name === selected_category)
        : items;

    return (
        <main className="space-y-4">
            <h2 className="text-4xl font-bold">Items for Sale</h2>

            <div className="flex gap-4">
                <Button
                    onClick={() => set_selected_category(null)}
                    variant="outline"
                >
                    All
                </Button>
                {categories.map((category) => (
                    <Button
                        key={category}
                        onClick={() => set_selected_category(category)}
                        variant="outline"
                    >
                        {category}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-4 gap-4">
                {filteredItems.length > 0 ? (
                    filteredItems.map((result) => {
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
                    })
                ) : (
                    <p>no items available</p>
                )}
            </div>
        </main>
    );
}
