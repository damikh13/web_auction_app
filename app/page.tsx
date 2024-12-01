import { database } from "./db/database";
import { bids as bids_schema } from "./db/schema";

export default async function HomePage() {
    const bids = await database.query.bids.findMany(); // fetch all the bids from 'au_bids' table

    return <main className="">
        <form action={async (formData: FormData) => {
            "use server";
            await database.insert(bids_schema).values({});
        }}>
            <input name="bid" placeholder="Bid" />
            <button type="submit">Place Bid</button>
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