import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { create_item_action } from "@/app/items/create/actions";

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
                action={create_item_action}
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
                    placeholder="what to start your auction at"
                />
                <Button className="self-end" type="submit">
                    post item
                </Button>
            </form>
        </main>
    );
}
