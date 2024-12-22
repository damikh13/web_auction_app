import { NextApiRequest, NextApiResponse } from "next";
import { get_items, get_categories } from "@/data_access/items"; // Server-side logic to fetch items and categories
import { NextResponse } from "next/server";

// Handle GET requests to fetch items and categories
export async function GET(req: NextApiRequest) {
    try {
        // Fetch categories and items from the data access layer
        const categories = (await get_categories()) || [];
        const items = await get_items();

        // Log the fetched data to verify the structure (useful for debugging)
        console.log("Categories:", categories);
        console.log("Items:", items);

        // Return both items and categories as JSON response
        return NextResponse.json({ items, categories }); // Include both items and categories in the response
    } catch (error) {
        // Handle any errors that occur during the fetch operation
        console.error("Error fetching data:", error);

        // Return an error message directly
        return NextResponse.error(); // Returning an error response
    }
}
