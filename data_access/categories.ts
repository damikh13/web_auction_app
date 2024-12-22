import { database } from "@/app/db/database";
import { categories } from "@/app/db/schema";

export async function add_categories() {
    const categoryNames = [
        "clothing",
        "electronics",
        "books",
        "furniture",
        "other",
    ];

    for (const name of categoryNames) {
        await database
            .insert(categories)
            .values({ name })
            .onConflictDoNothing(); // skip if category already exists
    }
}

add_categories().catch(console.error);

export async function get_categories() {
    const response = await fetch("/api/categories");
    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }
    return response.json();
}
