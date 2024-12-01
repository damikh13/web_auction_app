import { pgTable, serial } from "drizzle-orm/pg-core";

export const bids = pgTable('au_bids', {
    id: serial("id").primaryKey(),
}
);