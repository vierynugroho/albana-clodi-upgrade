"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useState, useCallback, memo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoadingState } from "@/components/shared/LoadingState";

const Footer = memo(function Footer() {
  return (
    <footer className="border-t py-4 px-6 mt-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} AlbanaGrosir. All rights reserved.
        </p>
        <p>Version 1.0.0</p>
      </div>
    </footer>
  );
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const auth = isAuthenticated();
    if (!auth) {
      router.replace("/login");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  const handleOpenSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), []);

  if (isChecking) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/20">
        <LoadingState />
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      <div className="flex-1 flex flex-col md:ml-72 min-w-0">
        <Header onMenuClick={handleOpenSidebar} />
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full animate-fade-in">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
