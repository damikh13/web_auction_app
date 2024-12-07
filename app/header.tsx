import { auth } from "@/auth";
import SignIn from "@/components/sign-in";
import { SignOut } from "@/components/signout-button";
import Image from "next/image";
import Link from "next/link";

export async function Header() {
    const session = await auth();

    return (
        <div className="bg-gray-200 py-2">
            <div className="container flex justify-between items-center">
                <Link
                    href="/"
                    className="flex items-center gap-1 hover:underline"
                >
                    <Image src="/logo.png" width="50" height="50" alt="Logo" />
                    WebAuctionApp.com
                </Link>

                <div>{session ? <SignOut /> : <SignIn />}</div>
            </div>
        </div>
    );
}
