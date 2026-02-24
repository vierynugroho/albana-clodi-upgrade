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
  X,
  Sparkles,
} from "lucide-react";
import { useState, useCallback, memo } from "react";
import Image from "next/image";

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  submenu?: { title: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "text-primary",
  },
  { title: "Order", href: "/orders", icon: ShoppingCart, color: "text-info" },
  { title: "Product", href: "/products", icon: Package, color: "text-success" },
  { title: "Customers", href: "/customers", icon: Users, color: "text-pink" },
  { title: "Report", href: "/report", icon: FileText, color: "text-purple" },
  { title: "Expenses", href: "/expenses", icon: Wallet, color: "text-orange" },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    color: "text-muted-foreground",
    submenu: [
      { title: "General", href: "/settings" },
      { title: "Payment Accounts", href: "/settings/payment-accounts" },
      { title: "Shipping Origin", href: "/settings/shipping-origins" },
      { title: "Sales Channel", href: "/settings/sales-channels" },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItemComponentProps {
  item: MenuItem;
  pathname: string;
  expandedMenu: string | null;
  onToggleExpand: (href: string) => void;
  onClose: () => void;
}

const MenuItemComponent = memo(function MenuItemComponent({
  item,
  pathname,
  expandedMenu,
  onToggleExpand,
  onClose,
}: MenuItemComponentProps) {
  const Icon = item.icon;
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);
  const isExpanded = expandedMenu === item.href;

  if (item.submenu) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => onToggleExpand(item.href)}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out hover:bg-accent/80",
            isActive
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
              isActive ? "bg-primary/10" : "bg-muted/50"
            )}
          >
            <Icon
              className={cn("h-4 w-4", isActive ? "text-primary" : item.color)}
            />
          </div>
          <span className="flex-1 text-left">{item.title}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        </button>
        <div
          className={cn(
            "overflow-hidden transition-all duration-200",
            isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="ml-13 space-y-1 py-1">
            {item.submenu.map((sub) => {
              const isSubActive = pathname === sub.href;
              return (
                <Link
                  key={sub.href}
                  href={sub.href}
                  onClick={onClose}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm transition-all duration-200 relative",
                    isSubActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent/80 hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-colors",
                      isSubActive ? "bg-primary" : "bg-border"
                    )}
                  />
                  <span className="ml-3">{sub.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out hover:bg-accent/80 group",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <div
        className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
          isActive
            ? "bg-primary/10 scale-105"
            : "bg-muted/50 group-hover:scale-105"
        )}
      >
        <Icon
          className={cn("h-4 w-4", isActive ? "text-primary" : item.color)}
        />
      </div>
      <span>{item.title}</span>
      {isActive && (
        <span className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse-subtle" />
      )}
    </Link>
  );
});

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(
    pathname.startsWith("/settings") ? "/settings" : null
  );

  const handleToggleExpand = useCallback((href: string) => {
    setExpandedMenu((prev) => (prev === href ? null : href));
  }, []);

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 flex flex-col border-r bg-card/95 backdrop-blur-sm transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-5">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              {/* <div className="h-10 w-10 rounded-xl gradient-primary shadow-lg shadow-primary/25 flex items-center justify-center"> */}
                {/* <span className="text-lg font-bold text-white">A</span> */}
                <Image src={'https://albana-grosir.my.id/images/logo/albana-clodi-logo.svg'} height={45} width={45} alt="logo"/>
              {/* </div> */}
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-warning animate-pulse-subtle" />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight gradient-text">
                AlbanaGrosir
              </p>
              <p className="text-[11px] text-muted-foreground">
                Stock Management
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent md:hidden transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground px-3 mb-2">
            MENU UTAMA
          </p>
          {menuItems.slice(0, 4).map((item) => (
            <MenuItemComponent
              key={item.href}
              item={item}
              pathname={pathname}
              expandedMenu={expandedMenu}
              onToggleExpand={handleToggleExpand}
              onClose={onClose}
            />
          ))}
          <div className="pt-4 pb-2">
            <p className="text-xs font-medium text-muted-foreground px-3 mb-2">
              ANALITIK
            </p>
          </div>
          {menuItems.slice(4, 6).map((item) => (
            <MenuItemComponent
              key={item.href}
              item={item}
              pathname={pathname}
              expandedMenu={expandedMenu}
              onToggleExpand={handleToggleExpand}
              onClose={onClose}
            />
          ))}
          <div className="pt-4 pb-2">
            <p className="text-xs font-medium text-muted-foreground px-3 mb-2">
              PENGATURAN
            </p>
          </div>
          {menuItems.slice(6).map((item) => (
            <MenuItemComponent
              key={item.href}
              item={item}
              pathname={pathname}
              expandedMenu={expandedMenu}
              onToggleExpand={handleToggleExpand}
              onClose={onClose}
            />
          ))}
        </nav>

        
      </aside>
    </>
  );
}
