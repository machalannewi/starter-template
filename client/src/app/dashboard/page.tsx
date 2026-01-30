"use client";

import { useUser } from "@clerk/nextjs";
import LogoutButton from "@/components/LogoutButton";

export default function DashboardPage() {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Not authenticated</div>;
    }

    return (
        <div className="min-h-screen bg-neutral-900 text-white">
            <nav className="border-b border-white/10 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span>Welcome, {user.firstName || user.username}!</span>
                        <LogoutButton
                            variant="outline"
                            className="outline outline-1 outline-lime-500 hover:bg-lime-500 hover:text-black"
                        />
                    </div>
                </div>
            </nav>

            <main className="container mx-auto p-8">
                <h2 className="text-2xl font-bold mb-4">Your Dashboard</h2>
                {/* Your dashboard content */}
            </main>
        </div>
    );
}
