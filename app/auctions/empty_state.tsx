import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function EmptyState() {
    return (
        <div className="space-y-8 flex flex-col items-center justify-center">
            <Image
                src="/no_data.svg"
                width="200"
                height="200"
                alt="No data"
            ></Image>
            <h2 className="text-2xl font-bold">you have no auctions yet</h2>
            <Button asChild>
                <Link href="/items/create">create auction</Link>
            </Button>
        </div>
    );
}
