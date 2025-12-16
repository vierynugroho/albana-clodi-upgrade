"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Wallet,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

interface MenuItem {
  title: string;
  href: string;
  icon: any;
  submenu?: { title: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Order",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Product",
    href: "/products",
    icon: Package,
  },
  {
    title: "Data Customer",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Report",
    href: "/report",
    icon: FileText,
  },
  {
    title: "Expenses",
    href: "/expenses",
    icon: Wallet,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    submenu: [
      { title: "General", href: "/settings" },
      { title: "Accounts", href: "/settings/payment-accounts" },
      { title: "Shipping Origin", href: "/settings/shipping-origins" },
      { title: "Sales Channel", href: "/settings/sales-channels" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card transition-transform">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold">AlbanaGrosir</span>
            <span className="text-xs text-muted-foreground">
              Stock Management
            </span>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => (
            <div key={item.href}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() =>
                      setExpandedMenu(
                        expandedMenu === item.href ? null : item.href
                      )
                    }
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                      pathname.startsWith(item.href)
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        expandedMenu === item.href && "rotate-180"
                      )}
                    />
                  </button>
                  {expandedMenu === item.href && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                            pathname === subItem.href
                              ? "bg-accent font-medium text-accent-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                    pathname === item.href ||
                      pathname.startsWith(`${item.href}/`)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}