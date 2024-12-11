"use client";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
    NotificationFeedPopover,
    NotificationIconButton,
} from "@knocklabs/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export function Header() {
    const [isVisible, setIsVisible] = useState(false);
    const notifButtonRef = useRef(null);
    const session = useSession();
    const user_id = session?.data?.user?.id;

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

                    <div className="flex items-center gap-8">
                        <Link
                            href="/"
                            className="flex items-center gap-1 hover:underline"
                        >
                            all auctions
                        </Link>
                        {user_id && (
                            <>
                                <Link
                                    href="/items/create"
                                    className="flex items-center gap-1 hover:underline"
                                >
                                    create auction
                                </Link>

                                <Link
                                    href="/auctions"
                                    className="flex items-center gap-1 hover:underline"
                                >
                                    my auctions
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <NotificationIconButton
                        ref={notifButtonRef}
                        onClick={(e) => setIsVisible(!isVisible)}
                    />
                    <NotificationFeedPopover
                        buttonRef={notifButtonRef}
                        isVisible={isVisible}
                        onClose={() => setIsVisible(false)}
                    />
                    {session?.data?.user?.image && (
                        <Image
                            className="rounded-xl"
                            src={session?.data?.user?.image}
                            width="40"
                            height="40"
                            alt="user avatar"
                        />
                    )}
                    <div>
                        {session?.data?.user?.name && (
                            <span className="text-center">
                                {session.data.user.name}
                            </span>
                        )}
                    </div>
                    <div>
                        {user_id ? (
                            <Button
                                type="submit"
                                onClick={() =>
                                    signOut({
                                        callbackUrl: "/",
                                    })
                                }
                            >
                                sign out
                            </Button>
                        ) : (
                            <Button type="submit" onClick={() => signIn()}>
                                sign in
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
