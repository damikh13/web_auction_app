import { database } from "./db/database";
import { bids as bids_schema, items } from "./db/schema";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SignIn from "@/components/sign-in";
import { revalidatePath } from "next/cache";
import { SignOut } from "@/components/signout-button";
import { auth } from "@/auth";

export default async function HomePage() {
    const session = await auth();

    const all_items = await database.query.items.findMany(); // fetch all the bids from 'au_bids' table

    if (!session) return null;
    const user = session.user;
    if (!user) return null;

    return <main className="container mx-auto py-12">
        {
            // mx-auto for ctrl +- (zomming in and out) positioning
            // py-12 for padding for top and bottom
        }

        {
            session?.user?.name
        }

        {
            session ? <SignOut/> : <SignIn/>
        }


        <form action={async (formData: FormData) => {
            "use server";
            await database.insert(items).values({
                name: formData.get("name") as string,
                userId: session?.user?.id!,
            });
            revalidatePath("/"); // re-run whole component
        }}>
            <Input name="name" placeholder="enter item name:" />
            <Button type="submit">post item</Button>
        </form>

        {
            all_items.map(
                (item) => (
                    <div key={item.id}>{item.name}</div>
                )
            )
        }
    </main>;
}
