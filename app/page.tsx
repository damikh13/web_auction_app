"use client";

import { useEffect, useState } from "react";
import { ItemCard } from "@/app/item_card";
import { Button } from "@/components/ui/button";

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

export default function HomePage() {
    const [items, setItems] = useState<ItemWithCategory[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/api/items");
                const data = await response.json();

                console.log("Fetched data:", data);

                setCategories(data.categories);
                setItems(data.items);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, []);

    const filteredItems = selectedCategory
        ? items.filter((item) => item.category?.name === selectedCategory)
        : items;

    return (
        <main className="space-y-4">
            <h2 className="text-4xl font-bold">Items for Sale</h2>

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
                            />
                        );
                    })
                ) : (
                    <p>No items available</p>
                )}
            </div>
        </main>
    );
}
