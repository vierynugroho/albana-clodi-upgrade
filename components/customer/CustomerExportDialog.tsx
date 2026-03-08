"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";

import { MONTH_OPTIONS, YEAR_OPTIONS } from "@/lib/constants";
import { getISOWeek } from "@/lib/utils";

interface CustomerExportDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onExport: (params: { startDate?: string; endDate?: string; month?: string; year?: string; week?: string }) => void;
    isExporting: boolean;
}

export function CustomerExportDialog({
    isOpen,
    onOpenChange,
    onExport,
    isExporting,
}: CustomerExportDialogProps) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [weekDate, setWeekDate] = useState("");

    const handleExport = () => {
        onExport({
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            month: month || undefined,
            year: year || undefined,
            week: weekDate ? getISOWeek(weekDate) : undefined,
        });
        onOpenChange(false);
    };

    const handleReset = () => {
        setStartDate("");
        setEndDate("");
        setMonth("");
        setYear("");
        setWeekDate("");
    };

    const inputClassName = "w-full h-10 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Export Data Customer</DialogTitle>
                    <DialogDescription>
                        Pilih kriteria tanggal untuk menentukan customer yang akan diexport. Jika dikosongkan, semua customer akan diexport.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Tanggal Mulai
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className={inputClassName}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Tanggal Akhir
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className={inputClassName}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">
                                Bulan
                            </label>
                            <select
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className={inputClassName}
                            >
                                {MONTH_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">
                                Tahun
                            </label>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className={inputClassName}
                            >
                                {YEAR_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Week filter */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Filter Minggu
                        </label>
                        <input
                            type="date"
                            value={weekDate}
                            onChange={(e) => setWeekDate(e.target.value)}
                            className={inputClassName}
                        />
                        {weekDate && (() => {
                            const d = new Date(weekDate);
                            const day = d.getDay() || 7;
                            const monday = new Date(d);
                            monday.setDate(d.getDate() - day + 1);
                            const sunday = new Date(monday);
                            sunday.setDate(monday.getDate() + 6);
                            const fmt = (dt: Date) =>
                                dt.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
                            return (
                                <div className="text-xs text-muted-foreground space-y-0.5">
                                    <p className="font-medium">
                                        Minggu ke-{getISOWeek(weekDate)}
                                    </p>
                                    <p>
                                        {fmt(monday)} — {fmt(sunday)}
                                    </p>
                                </div>
                            );
                        })()}
                    </div>
                </div>

                <DialogFooter className="flex sm:justify-between items-center w-full">
                    <Button variant="ghost" type="button" onClick={handleReset}>
                        Reset Info
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>
                        <Button type="button" onClick={handleExport} disabled={isExporting}>
                            {isExporting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="mr-2 h-4 w-4" />
                            )}
                            {isExporting ? "Mengexport..." : "Export"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
