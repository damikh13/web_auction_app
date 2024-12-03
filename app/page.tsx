import { database } from "./db/database";
import { bids as bids_schema } from "./db/schema";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SignIn from "@/components/sign-in";
import { revalidatePath } from "next/cache";
import { SignOut } from "@/components/signout-button";
import { auth } from "@/auth";

export default async function HomePage() {
    const session = await auth();

    const bids = await database.query.bids.findMany(); // fetch all the bids from 'au_bids' table

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
            await database.insert(bids_schema).values({});
            revalidatePath("/"); // re-run whole component
        }}>
            <Input name="bid" placeholder="Bid" />
            <Button type="submit">Place Bid</Button>
        </form>

        {
            bids.map(
                (bid) => (
                    <div key={bid.id}>{bid.id}</div>
                )
            )
        }
    </main>;
}