"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    create_item_action,
    create_upload_url_action,
} from "@/app/items/create/actions";
import { page_title_styles } from "@/styles";
import { DatePickerDemo } from "@/components/date_picker";
import { useState } from "react";

export default function CreatePage() {
    const [date, set_date] = useState<Date | undefined>();
    return (
        <main className="space-y-4">
            <h1 className={page_title_styles}>post an item</h1>

            <form
                className="flex flex-col border p-8 rounded-xl space-y-4 max-w-lg"
                onSubmit={async (e) => {
                    e.preventDefault();

                    if (!date) {
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
                    await create_item_action({
                        name,
                        starting_price: starting_price_in_cents,
                        filename: file.name,
                        end_date: date,
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
                    placeholder="what to start your auction at"
                />
                <Input type="file" name="file"></Input>
                <DatePickerDemo date={date} set_date={set_date} />
                <Button className="self-end" type="submit">
                    post item
                </Button>
            </form>
        </main>
    );
}
