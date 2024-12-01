import { revalidatePath } from "next/cache";
import { database } from "./db/database";
import { bids as bids_schema } from "./db/schema";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default async function HomePage() {
    const bids = await database.query.bids.findMany(); // fetch all the bids from 'au_bids' table

    return <main className="container mx-auto py-12">
        {
            // mx-auto for ctrl +- (zomming in and out) positioning
            // py-12 for padding for top and bottom
        }
        <form action={async (formData: FormData) => {
            "use server";
            await database.insert(bids_schema).values({});
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