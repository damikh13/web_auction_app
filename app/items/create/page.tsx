"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    create_item_action,
    create_upload_url_action,
} from "@/app/items/create/actions";

export default async function CreatePage() {
    return (
        <main className="container mx-auto py-12 space-y-4">
            {
                // mx-auto for ctrl +- (zomming in and out) positioning
                // py-12 for padding for top and bottom
            }

            <h1 className="text-4xl font-bold mb-8">post an item</h1>

            <form
                className="flex flex-col border p-8 rounded-xl space-y-4 max-w-lg"
                onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget as HTMLFormElement;
                    const form_data = new FormData(form);
                    const file = form_data.get("file") as File;

                    const upload_url = await create_upload_url_action(
                        file.name,
                        file.type
                    );
                    const upload_form_data = new FormData();
                    upload_form_data.append("file", file);

                    await fetch(upload_url, {
                        method: "PUT",
                        body: upload_form_data,
                        headers: { "Content-Type": file.type },
                    });

                    // await create_item_action(form_data);
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
                <Button className="self-end" type="submit">
                    post item
                </Button>
            </form>
        </main>
    );
}
