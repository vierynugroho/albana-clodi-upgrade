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
import { Download } from "lucide-react";

interface FilterOption {
    value: string;
    label: string;
}

const MONTH_OPTIONS: FilterOption[] = [
    { value: "", label: "Semua Bulan" },
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
];

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS: FilterOption[] = [
    { value: "", label: "Semua Tahun" },
    { value: String(currentYear), label: String(currentYear) },
    { value: String(currentYear - 1), label: String(currentYear - 1) },
    { value: String(currentYear - 2), label: String(currentYear - 2) },
];

interface OrderExportDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function OrderExportDialog({
    isOpen,
    onOpenChange,
}: OrderExportDialogProps) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    const handleExport = () => {
        const params = new URLSearchParams();
        params.set("type", "orders");
        if (startDate) params.set("startDate", startDate);
        if (endDate) params.set("endDate", endDate);
        if (month) params.set("month", month);
        if (year) params.set("year", year);

        window.open(`/export?${params.toString()}`, "_blank");
        onOpenChange(false);
    };

    const handleReset = () => {
        setStartDate("");
        setEndDate("");
        setMonth("");
        setYear("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Export Data Order</DialogTitle>
                    <DialogDescription>
                        Pilih kriteria untuk menentukan data order yang akan diexport.
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
                            className="w-full h-10 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                            className="w-full h-10 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                                className="w-full h-10 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                                className="w-full h-10 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {YEAR_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                        <Button type="button" onClick={handleExport}>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
