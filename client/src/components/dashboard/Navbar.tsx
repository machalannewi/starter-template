"use client";
import { useUser } from "@clerk/nextjs";
import LogoutButton from "@/components/LogoutButton";
import Image from "next/image";
import logoImage from "@/assets/images/logo.svg";
import { TextAlignEnd, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const menuItems = [
    { href: "/my-rides", label: "My Rides" },
    { href: "/support", label: "Support" },
    { href: "/payment", label: "Payment" },
    { href: "/about", label: "About" },
];

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

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

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                        className="z-50 relative"
                    >
                        {<TextAlignEnd />}
                    </button>
                </div>
            </nav>

            {/* Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Sliding Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
                } w-1/2 md:w-1/3 shadow-2xl`}
            >
                <div className="p-6 flex flex-col h-full">
                    {/* Close button */}
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="self-end mb-6"
                        aria-label="Close menu"
                    >
                        <X size={24} />
                    </button>

                    {/* Profile Section */}
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                        <Image
                            src={user.imageUrl}
                            alt="Profile"
                            width={60}
                            height={60}
                            className="rounded-full"
                        />
                        <div>
                            <p>{user.firstName || user.username}</p>
                            <Link
                                href="/profile"
                                className="text-lime-500 hover:underline"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                View Profile
                            </Link>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex flex-col gap-4 flex-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-lg hover:text-lime-500 transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Logout Button */}
                    <div className="mt-auto pt-6 border-t border-white/10">
                        <LogoutButton
                            variant="outline"
                            className="w-full bg-lime-500 text-black outline outline-1 outline-lime-500"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
