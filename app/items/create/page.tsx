"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import {
    create_item_action,
    create_upload_url_action,
} from "@/app/items/create/actions";
import { page_title_styles } from "@/styles";
import { DatePickerDemo } from "@/components/date_picker";
import { useEffect, useState } from "react";
import { get_categories } from "@/data_access/categories";

export default function CreatePage() {
    const [categories, set_categories] = useState<
        { id: number; name: string }[]
    >([]);
    const [selected_category, set_selected_category] = useState<
        number | undefined
    >();
    const [date, set_date] = useState<Date | undefined>();

    useEffect(() => {
        async function fetch_categories() {
            const response = await fetch("/api/categories");
            const categories = await response.json();
            set_categories(categories);
        }
        fetch_categories();
    }, []);

    return (
        <main className="space-y-4">
            <h1 className={page_title_styles}>post an item</h1>

            <form
                className="flex flex-col border p-8 rounded-xl space-y-4 max-w-lg"
                onSubmit={async (e) => {
                    e.preventDefault();

                    if (!date || !selected_category) {
                        return;
                    }

                    const form = e.currentTarget as HTMLFormElement;
                    const form_data = new FormData(form);
                    const file = form_data.get("file") as File;

                    const upload_url = await create_upload_url_action(
                        file.name,
                        file.type
                    );

                    await fetch(upload_url, {
                        method: "PUT",
                        body: file,
                    });

                    const name = form_data.get("name") as string;
                    const starting_price = parseFloat(
                        form_data.get("starting_price") as string
                    );
                    const starting_price_in_cents = Math.floor(
                        starting_price * 100
                    );
                    const bid_interval = parseFloat(
                        form_data.get("bid_interval") as string
                    );
                    if (isNaN(bid_interval)) {
                        throw new Error("Invalid bid interval");
                    }
                    const bid_interval_in_cents = bid_interval * 100;
                    await create_item_action({
                        name,
                        starting_price: starting_price_in_cents,
                        bid_interval: bid_interval_in_cents,
                        filename: file.name,
                        end_date: date,
                        category_id: selected_category,
                    });
                }}
            >
                <Input
                    required
                    className="max-w-lg"
                    name="name"
                    placeholder="item name"
                />
                <Input
                    required
                    className="max-w-lg"
                    name="starting_price"
                    type="number"
                    step="0.01"
                    placeholder="what to start your auction at ($)"
                />
                <Input
                    required
                    className="max-w-lg"
                    name="bid_interval"
                    type="number"
                    step="0.01"
                    placeholder="bid interval ($)"
                />
                <Input type="file" name="file"></Input>
                <Select
                    required
                    onValueChange={(value) => set_selected_category(parseInt(value))}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <DatePickerDemo date={date} set_date={set_date} />
                <Button className="self-end" type="submit">
                    post item
                </Button>
            </form>
        </main>
    );
}
