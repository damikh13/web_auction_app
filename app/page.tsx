import { database } from "@/app/db/database";
import { bids as bids_schema, items } from "@/app/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SignIn from "@/components/sign-in";
import { revalidatePath } from "next/cache";
import { SignOut } from "@/components/signout-button";
import { auth } from "@/auth";
import Image from "next/image";
import { it } from "node:test";

function get_image_url(file_key: string) {
    return `https://pub-ae637999cfca425ba6af10a9b6fbef1e.r2.dev/${file_key}`;
}

export default async function HomePage() {
    const session = await auth();

    const all_items = await database.query.items.findMany(); // fetch all the bids from 'au_bids' table

    if (!session) return null;
    const user = session.user;
    if (!user) return null;

    return (
        <main className="container mx-auto py-12 space-y-4">
            {
                // mx-auto for ctrl +- (zomming in and out) positioning
                // py-12 for padding for top and bottom
            }

            <h2 className="text-2xl font-bold">items for sale</h2>

            <div className="grid grid-cols-4 gap-4">
                {all_items.map((item) => (
                    <div key={item.id} className="border p-8 rounded-xl">
                        <Image
                            src={get_image_url(item.file_key)}
                            alt={item.name}
                            width={200}
                            height={200}
                        ></Image>
                        {item.name}
                        starting price: ${item.starting_price / 100}
                    </div>
                ))}
            </div>
        </main>
    );
}
