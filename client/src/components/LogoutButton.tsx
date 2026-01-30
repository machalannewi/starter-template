"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface LogoutButtonProps {
    variant?: "default" | "outline" | "ghost" | "destructive";
    className?: string;
}

export default function LogoutButton({
    variant = "outline",
    className,
}: LogoutButtonProps) {
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

    return (
        <Button
            onClick={handleLogout}
            disabled={isLoading}
            variant={variant}
            className={className}
        >
            {isLoading ? <Spinner /> : "Logout"}
        </Button>
    );
}
