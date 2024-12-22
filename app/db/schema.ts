import {
    serial,
    boolean,
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
} from "drizzle-orm/pg-core";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { AdapterAccountType } from "next-auth/adapters";
import { relations } from "drizzle-orm";

const connectionString = "postgres://postgres:postgres@localhost:5432/drizzle";
const pool = postgres(connectionString, { max: 1 });

export const db = drizzle(pool);

export const users = pgTable("au_user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
});

export const accounts = pgTable(
    "au_account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
);

export const sessions = pgTable("au_session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
    "au_verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    })
);

export const authenticators = pgTable(
    "au_authenticator",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
    },
    (authenticator) => ({
        compositePK: primaryKey({
            columns: [authenticator.credentialID, authenticator.userId],
        }),
    })
);

export const categories = pgTable("au_categories", {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
});

export const items = pgTable("au_items", {
    id: serial("id").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    file_key: text("file_key").notNull(),
    current_bid: integer("current_bid").notNull().default(0),
    starting_price: integer("starting_price").notNull().default(0),
    bid_interval: integer("bid_interval").notNull().default(100),
    end_date: timestamp("end_date", { mode: "date" }).notNull(),
    category_id: integer("category_id")
        .notNull()
        .references(() => categories.id, { onDelete: "restrict" }),
});

export type Item = typeof items.$inferSelect & { category: { name: string } };

export const bids = pgTable("au_bids", {
    id: serial("id").primaryKey(),
    amount: integer("amount").notNull(),
    item_id: serial("item_id")
        .notNull()
        .references(() => items.id, { onDelete: "cascade" }),
    user_id: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    timestamp: timestamp("timestamp", { mode: "date" }).notNull(),
});

export const users_relations = relations(bids, ({ one }) => ({
    user: one(users, {
        fields: [bids.user_id],
        references: [users.id],
    }),
}));

export const categories_relations = relations(categories, ({ many }) => ({
    items: many(items), // Link items to categories without specifying `fields`
}));

export const items_relations = relations(items, ({ one }) => ({
    category: one(categories, {
        fields: [items.category_id],
        references: [categories.id],
    }),
}));
