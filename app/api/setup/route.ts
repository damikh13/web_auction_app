import { NextResponse } from "next/server";
import { add_categories } from "@/data_access/categories";

export async function GET() {
    try {
        await add_categories();
        return NextResponse.json({ message: "categories added successfully!" });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "failed to add categories" },
            { status: 500 }
        );
    }
}
