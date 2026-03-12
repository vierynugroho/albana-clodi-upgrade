import { BarChart3, Zap } from "lucide-react";
import { Button, GradientCard } from "../ui";
import { memo } from "react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useAuth";

export const WelcomeCard = memo(function WelcomeCard() {

  const {data} = useCurrentUser() 

  return (
    <GradientCard gradient="primary" className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 animate-pulse-subtle" />
            <span className="text-sm font-medium text-white/80">
              Dashboard Overview
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Selamat Datang, {data?.responseObject?.role?.toLocaleUpperCase()}! 👋
          </h2>
          <p className="text-white/80 max-w-md">
            Ini adalah ringkasan performa bisnis Anda hari ini. Semua metrik
            berjalan dengan baik.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="bg-white/20 text-white hover:bg-white/30 border-0"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            <Link href={`/report`}>Lihat Laporan</Link>
          </Button>
        </div>
      </div>
    </GradientCard>
  );
});