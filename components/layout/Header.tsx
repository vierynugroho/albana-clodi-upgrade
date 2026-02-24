"use client";

import { Moon, Sun, Bell, User, Menu, Search, Sparkles, LogOut, Settings, UserCircle, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountBadge } from "@/components/ui/badge";
import { memo, useCallback, useState, useEffect, useRef } from "react";
import { useCurrentUser } from "@/hooks/useAuth";
import { removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface HeaderProps {
  onMenuClick: () => void;
}

const ThemeToggle = memo(function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="relative rounded-xl">
        <div className="h-5 w-5 bg-muted animate-pulse rounded" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden rounded-xl hover:bg-warning/10"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <Sun
        className={`h-5 w-5 text-warning transition-all duration-300 ${theme === "dark"
            ? "-rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
          }`}
      />
      <Moon
        className={`absolute h-5 w-5 text-purple transition-all duration-300 ${theme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
          }`}
      />
    </Button>
  );
});

const NotificationButton = memo(function NotificationButton() {
  const [notificationCount] = useState(3);
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-xl hover:bg-info/10"
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5 text-info" />
      <div className="absolute -top-0.5 -right-0.5">
        <CountBadge count={notificationCount} color="destructive" />
      </div>
    </Button>
  );
});

const UserMenu = memo(function UserMenu() {
  const { data, isLoading, error } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Get user info from response
  const user = data?.responseObject;
  const displayName = user?.fullname || "User";
  const role = user?.role || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = useCallback(() => {
    removeToken();
    setIsOpen(false);
    router.push("/login");
  }, [router]);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 pl-4 border-l border-border/50">
        <div className="hidden sm:block text-right">
          <div className="h-4 w-20 bg-muted animate-pulse rounded mb-1" />
          <div className="h-3 w-16 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }

  // Error state - show fallback
  if (error) {
    console.error("Error loading user:", error);
  }

  return (
    <div
      className="relative flex items-center gap-3 pl-4 border-l border-border/50"
      ref={dropdownRef}
    >
      {/* User Info */}
      <div className="hidden sm:block text-right">
        <div className="flex items-center gap-1.5 justify-end">
          <p className="text-sm font-semibold leading-tight">{displayName}</p>
          <Sparkles className="h-3 w-3 text-warning" />
        </div>
        <p className="text-[11px] text-muted-foreground capitalize">{role}</p>
      </div>

      {/* User Avatar Button */}
      <button
        className="relative group flex items-center gap-1"
        onClick={toggleDropdown}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-sm shadow-primary/25 transition-all group-hover:shadow-md group-hover:shadow-primary/30 group-hover:scale-105">
          {user ? (
            <span className="text-sm font-semibold text-white">{initials}</span>
          ) : (
            <User className="h-5 w-5 text-white" />
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
        <span className="absolute bottom-0 right-4 h-3 w-3 rounded-full bg-success border-2 border-card" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border bg-card shadow-lg ring-1 ring-black/5 z-50 animate-fade-in overflow-hidden">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
            <p className="text-sm font-semibold truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || "No email"}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link href="/profile" onClick={closeDropdown}>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-muted/50 transition-colors">
                <UserCircle className="h-4 w-4 text-primary" />
                <span>Profil Saya</span>
              </button>
            </Link>
            <Link href="/settings" onClick={closeDropdown}>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-muted/50 transition-colors">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>Pengaturan</span>
              </button>
            </Link>
          </div>

          {/* Logout */}
          <div className="py-1 border-t border-border/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 backdrop-blur-md px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden shrink-0 rounded-xl"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        {/* <div className="hidden sm:block relative">
          <Input
            placeholder="Search anything..."
            className="w-64 lg:w-80 h-10 rounded-xl bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-primary/50"
            leftIcon={<Search className="h-4 w-4 text-muted-foreground" />}
          />
          <kbd className="hidden lg:inline-flex absolute right-3 top-1/2 -translate-y-1/2 h-5 px-1.5 items-center gap-0.5 rounded border bg-muted text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div> */}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden rounded-xl"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>
        <ThemeToggle />
        {/* <NotificationButton /> */}
        <UserMenu/>
      </div>
    </header>
  );
}
