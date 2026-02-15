"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Car, User } from "lucide-react";

export default function BottomNavigation() {
    const pathname = usePathname();

    const bottomNav = [
        { href: "/dashboard", name: "Home", icon: Home },
        { href: "/rides", name: "Rides", icon: Car },
        { href: "/account", name: "Account", icon: User },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-white/10 z-30">
            <div className="container mx-auto flex justify-around items-center py-3">
                {bottomNav.map((nav) => {
                    const isActive = pathname === nav.href;
                    const Icon = nav.icon;

                    return (
                        <Link
                            key={nav.name}
                            href={nav.href}
                            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                                isActive
                                    ? "text-lime-500"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            <Icon size={24} />
                            <span className="text-xs">{nav.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
