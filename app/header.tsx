import { auth } from "@/auth";
import SignIn from "@/components/sign-in";
import { SignOut } from "@/components/signout-button";
import Image from "next/image";
import Link from "next/link";

export async function Header() {
    const session = await auth();

    return (
        <div className="bg-gray-200 py-2">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-12">
                    <Link
                        href="/"
                        className="flex items-center gap-1 hover:underline"
                    >
                        <Image
                            src="/logo.png"
                            width="50"
                            height="50"
                            alt="Logo"
                        />
                        WebAuctionApp.com
                    </Link>

                    <div>
                        <Link
                            href="items/create"
                            className="flex items-center gap-1 hover:underline"
                        >
                            auction your item
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {session?.user?.name && (
                        <span className="text-center">{session.user.name}</span>
                    )}
                    {session ? <SignOut /> : <SignIn />}
                </div>
            </div>
        </div>
    );
}
