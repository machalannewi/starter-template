"use client";

import { useUser } from "@clerk/nextjs";
import LogoutButton from "@/components/LogoutButton";
import Image from "next/image";
import logoImage from "@/assets/images/logo.svg";

export default function DashboardPage() {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Not authenticated</div>;
    }
    return (
        <>
            <nav className="border-b border-white/10 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Image src={logoImage} alt="logo" />
                    <div className="flex items-center gap-4">
                        <span>Welcome, {user.firstName || user.username}!</span>
                        <LogoutButton
                            variant="outline"
                            className="bg-lime-500 text-black outline outline-1 outline-lime-500"
                        />
                    </div>
                </div>
            </nav>
        </>
    );
}
