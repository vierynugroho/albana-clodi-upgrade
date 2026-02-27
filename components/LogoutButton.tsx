"use client";

import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";
import { LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface LogoutButtonProps {
    variant?: "default" | "icon" | "menu";
    className?: string;
}

export default function LogoutButton({ variant = "default", className = "" }: LogoutButtonProps) {
    const router = useRouter();
    const queryClient = useQueryClient();

    function handleLogout() {
        removeToken();
        queryClient.clear();
        router.replace("/login");
    }

    if (variant === "icon") {
        return (
            <button
                onClick={handleLogout}
                className={`p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors ${className}`}
                title="Logout"
            >
                <LogOut className="h-5 w-5" />
            </button>
        );
    }

    if (variant === "menu") {
        return (
            <button
                onClick={handleLogout}
                className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-destructive hover:bg-destructive/10 transition-colors ${className}`}
            >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors text-sm font-medium ${className}`}
        >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
        </button>
    );
}
