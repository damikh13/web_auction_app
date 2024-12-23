"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectContent,
} from "@/components/ui/select";
import {
    create_item_action,
    create_upload_url_action,
} from "@/app/items/create/actions";
import { page_title_styles } from "@/styles";
import { DatePickerDemo } from "@/components/date_picker";

export default function CreatePage() {
    const searchParams = useSearchParams();
    const [categories, set_categories] = useState<
        { id: number; name: string }[]
    >([]);
    const [selected_category, set_selected_category] = useState<
        number | undefined
    >();
    const [name, set_name] = useState<string>("");
    const [starting_price, set_starting_price] = useState<number>(0);
    const [bid_interval, set_bid_interval] = useState<number>(0);
    const [end_date, set_end_date] = useState<Date | undefined>();

    useEffect(() => {
        async function fetch_categories() {
            const response = await fetch("/api/categories");
            const categories = await response.json();
            set_categories(categories);
        }
        fetch_categories();

        if (searchParams) {
            const name = searchParams.get("name");
            const starting_price = searchParams.get("starting_price");
            const bid_interval = searchParams.get("bid_interval");

            if (name) set_name(name);
            if (starting_price) set_starting_price(parseFloat(starting_price));
            if (bid_interval) set_bid_interval(parseFloat(bid_interval));
        }
    }, [searchParams]);

    return (
        <main className="space-y-4">
            <h1 className={page_title_styles}>Post an Item</h1>

            <form
                className="flex flex-col border p-8 rounded-xl space-y-4 max-w-lg"
                onSubmit={async (e) => {
                    e.preventDefault();

                    if (!end_date || !selected_category) {
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

                    await create_item_action({
                        name,
                        starting_price: Math.floor(starting_price * 100),
                        bid_interval: Math.floor(bid_interval * 100),
                        filename: file.name,
                        end_date: end_date,
                        category_id: selected_category,
                    });
                }}
            >
                <Input
                    required
                    className="max-w-lg"
                    name="name"
                    placeholder="Item name"
                    value={name}
                    onChange={(e) => set_name(e.target.value)}
                />
                <Input
                    required
                    className="max-w-lg"
                    name="starting_price"
                    type="number"
                    step="0.01"
                    placeholder="Starting price ($)"
                    value={starting_price}
                    onChange={(e) =>
                        set_starting_price(parseFloat(e.target.value))
                    }
                />
                <Input
                    required
                    className="max-w-lg"
                    name="bid_interval"
                    type="number"
                    step="0.01"
                    placeholder="Bid interval ($)"
                    value={bid_interval}
                    onChange={(e) =>
                        set_bid_interval(parseFloat(e.target.value))
                    }
                />
                <Input type="file" name="file" />
                <Select
                    required
                    onValueChange={(value) =>
                        set_selected_category(parseInt(value))
                    }
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                            >
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <DatePickerDemo date={end_date} set_date={set_end_date} />
                <Button className="self-end" type="submit">
                    Post Item
                </Button>
            </form>
        </main>
    );
}
