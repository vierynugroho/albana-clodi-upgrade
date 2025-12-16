"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useState } from "react";

const stats = [
  {
    title: "Item Terjual",
    value: "1,234",
    icon: Package,
    trend: "+12.5%",
    color: "text-blue-600",
  },
  {
    title: "Item Belum Diproses",
    value: "45",
    icon: ShoppingCart,
    trend: "-5.2%",
    color: "text-orange-600",
  },
  {
    title: "Order Hari Ini",
    value: "89",
    icon: TrendingUp,
    trend: "+8.1%",
    color: "text-green-600",
  },
  {
    title: "Order Belum Lunas",
    value: "23",
    icon: DollarSign,
    trend: "+3.2%",
    color: "text-yellow-600",
  },
  {
    title: "Order Belum Diproses",
    value: "12",
    icon: Calendar,
    trend: "-2.4%",
    color: "text-red-600",
  },
  {
    title: "Cart Penjualan Hari Ini",
    value: "Rp 45.2M",
    icon: DollarSign,
    trend: "+15.3%",
    color: "text-purple-600",
  },
];

export default function DashboardPage() {
  const [filter, setFilter] = useState("hari");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Ringkasan performa bisnis Anda
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "hari" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("hari")}
          >
            Hari
          </Button>
          <Button
            variant={filter === "minggu" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("minggu")}
          >
            Minggu
          </Button>
          <Button
            variant={filter === "bulan" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("bulan")}
          >
            Bulan
          </Button>
          <Button
            variant={filter === "tahun" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("tahun")}
          >
            Tahun
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    stat.trend.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {stat.trend}
                </span>{" "}
                dari periode sebelumnya
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Grafik Penjualan</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
            Chart akan ditampilkan di sini
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Produk Terlaris</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
            Daftar produk terlaris
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
