"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function UserMenu() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);

        try {
            await signOut();
            router.push("/");
        } catch (error) {
            console.error("Error signing out:", error);
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-lime-500 flex items-center justify-center text-black font-bold">
                        {user.firstName?.charAt(0) ||
                            user.username?.charAt(0) ||
                            "U"}
                    </div>
                    <span>{user.firstName || user.username}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-56 bg-neutral-900 border border-white/10 text-white"
            >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
                    Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="cursor-pointer hover:bg-red-500/10 text-red-500"
                >
                    {isLoading ? <Spinner /> : "Logout"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
