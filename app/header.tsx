"use client";

import { Button } from "@/components/ui/button";
import {
    NotificationCell,
    NotificationFeedPopover,
    NotificationIconButton,
} from "@knocklabs/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { format_to_dollar } from "@/util/currency";

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

                                <Link
                                    href="/auctions/winning"
                                    className="flex items-center gap-1 hover:underline"
                                >
                                    won auctions
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
                        renderItem={({ item, ...props }) => (
                            <NotificationCell {...props} item={item}>
                                <div className="rounded-xl">
                                    <Link
                                        className="text-blue-400 hover:text=blue-500"
                                        onClick={() => {
                                            setIsVisible(false);
                                        }}
                                        href={`/items/${item?.data?.item_id}`}
                                    >
                                        Someone outbidded you on{" "}
                                        <span className="font-bold">
                                            {item?.data?.item_name}
                                        </span>{" "}
                                        by $
                                        {format_to_dollar(
                                            item?.data?.bid_amount
                                        )}
                                    </Link>
                                </div>
                            </NotificationCell>
                        )}
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
