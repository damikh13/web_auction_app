import { database } from "@/app/db/database";
import { categories } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
    const result = await database.select().from(categories);
    return NextResponse.json(result);
}
