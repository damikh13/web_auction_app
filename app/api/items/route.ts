import { get_items, get_categories } from "@/data_access/items";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categories = (await get_categories()) || [];
        const items = await get_items();

        return NextResponse.json({ items, categories });
    } catch (error) {
        console.error("Error fetching data:", error);

        return NextResponse.error();
    }
}
