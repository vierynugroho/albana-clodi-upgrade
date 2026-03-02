"use client";

import { useState, memo, useCallback, useMemo } from "react";
import { Button, IconButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Receipt,
  Download,
  Upload,
  Loader2,
  FileSpreadsheet,
} from "lucide-react";
import type { Expense } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useExportExpenses, useImportExpenses } from "@/hooks/useExpenses";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/shared/LoadingState";

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
  onView: (expense: Expense) => void;
  isLoading?: boolean;
}

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterPeriod: string;
  onFilterChange: (value: string) => void;
}

const Toolbar = memo(function Toolbar({
  searchQuery,
  onSearchChange,
  filterPeriod,
  onFilterChange,
}: ToolbarProps) {
  const { toast } = useToast();
  const exportExpenses = useExportExpenses();
  const importExpenses = useImportExpenses();

  // --- Old handleExport (inline download) ---
  // const handleExport = async () => {
  //   try {
  //     await exportExpenses.mutateAsync({});
  //     toast({ title: "Berhasil!", description: "Data pengeluaran berhasil diekspor" });
  //   } catch (error) {
  //     console.error("Export error:", error);
  //     toast({ title: "Error", description: error instanceof Error ? error.message : "Gagal mengekspor data.", variant: "destructive" });
  //   }
  // };
  // --- End old handleExport ---

  const handleExport = () => {
    const params = new URLSearchParams();
    params.set("type", "expenses");
    window.open(`/export?${params.toString()}`, "_blank");
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
      toast({
        title: "Error",
        description: "File harus berformat Excel (.xlsx atau .xls)",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    try {
      const result = await importExpenses.mutateAsync(file);
      toast({
        title: "Berhasil!",
        description: result.message || "Data pengeluaran berhasil diimpor",
        variant: "success",
      });
      // React Query will auto-refresh data after successful mutation
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal mengimpor data. Pastikan format file sesuai.",
        variant: "destructive",
      });
    }

    // Reset file input
    event.target.value = "";
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <Input
          placeholder="Cari pengeluaran..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs"
          leftIcon={<Search className="h-4 w-4" />}
        />

        <select
          value={filterPeriod}
          onChange={(e) => onFilterChange(e.target.value)}
          className="h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Semua Periode</option>
          <option value="today">Hari Ini</option>
          <option value="week">Minggu Ini</option>
          <option value="month">Bulan Ini</option>
          <option value="year">Tahun Ini</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleImport}
            disabled={importExpenses.isPending}
          />
          <span
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3 ${importExpenses.isPending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {importExpenses.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Import
          </span>
        </label>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={exportExpenses.isPending}
        >
          {exportExpenses.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export
        </Button>
      </div>
    </div>
  );
});

interface ExpenseRowProps {
  expense: Expense;
  index: number;
  onView: (expense: Expense) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
}

const ExpenseRow = memo(function ExpenseRow({
  expense,
  index,
  onView,
  onEdit,
  onDelete,
}: ExpenseRowProps) {
  return (
    <tr
      className="border-b transition-colors hover:bg-muted/50 group animate-fade-in"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange/10 flex items-center justify-center">
            <Receipt className="h-5 w-5 text-orange" />
          </div>
          <div>
            <p className="font-semibold text-sm">{expense.itemName}</p>
            <p className="text-xs text-muted-foreground">
              Qty: {expense.qty || 1}
            </p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-info" />
          <span>{formatDate(expense.expenseDate)}</span>
        </div>
      </td>
      <td className="p-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            @{formatCurrency(expense.itemPrice)}
          </p>
          <p className="text-sm font-bold gradient-text-warm">
            {formatCurrency(expense.totalPrice)}
          </p>
        </div>
      </td>
      <td className="p-4">
        {expense.personResponsible ? (
          <Badge variant="purple" dot>
            {expense.personResponsible}
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )}
      </td>
      <td className="p-4">
        <p className="text-sm text-muted-foreground max-w-[200px] truncate">
          {expense.note || "-"}
        </p>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-1  transition-opacity">
          <IconButton color="info" size="sm" onClick={() => onView(expense)}>
            <Eye className="h-4 w-4" />
          </IconButton>
          <IconButton color="warning" size="sm" onClick={() => onEdit(expense)}>
            <Edit className="h-4 w-4" />
          </IconButton>
          <IconButton
            color="destructive"
            size="sm"
            onClick={() => onDelete(expense.id)}
          >
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      </td>
    </tr>
  );
});

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
}: PaginationProps) {
  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border-t bg-muted/20">
      <p className="text-sm text-muted-foreground">
        Menampilkan{" "}
        <span className="font-semibold text-foreground">
          {startIndex + 1} - {Math.min(endIndex, totalItems)}
        </span>{" "}
        dari <span className="font-semibold text-foreground">{totalItems}</span>{" "}
        pengeluaran
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPageNumbers().map((page, idx) => (
          typeof page === "number" ? (
            <Button
              key={idx}
              variant={page === currentPage ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ) : (
            <span key={idx} className="px-2 text-muted-foreground">...</span>
          )
        ))}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

// Helper function to filter by period
function filterByPeriod(expenses: Expense[], period: string): Expense[] {
  if (period === "all") return expenses;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.expenseDate);
    const expenseDateOnly = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), expenseDate.getDate());

    switch (period) {
      case "today":
        return expenseDateOnly.getTime() === today.getTime();

      case "week": {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return expenseDateOnly >= weekStart && expenseDateOnly <= weekEnd;
      }

      case "month":
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );

      case "year":
        return expenseDate.getFullYear() === now.getFullYear();

      default:
        return true;
    }
  });
}

export function ExpenseTable({
  expenses,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
}: ExpenseTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter by period first
  const periodFilteredExpenses = useMemo(() => {
    return filterByPeriod(expenses, filterPeriod);
  }, [expenses, filterPeriod]);

  // Then filter by search
  const filteredExpenses = useMemo(() => {
    if (!searchQuery) return periodFilteredExpenses;

    const query = searchQuery.toLowerCase();
    return periodFilteredExpenses.filter((expense) => {
      return (
        expense.itemName.toLowerCase().includes(query) ||
        expense.expenseDate.includes(query) ||
        expense.personResponsible?.toLowerCase().includes(query) ||
        expense.note?.toLowerCase().includes(query)
      );
    });
  }, [periodFilteredExpenses, searchQuery]);

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, endIndex);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Reset to page 1 when filter changes
  const handleFilterChange = useCallback((value: string) => {
    setFilterPeriod(value);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  return (
    <div className="space-y-4">
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filterPeriod={filterPeriod}
        onFilterChange={handleFilterChange}
      />

      {/* Filter info */}
      {filterPeriod !== "all" && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileSpreadsheet className="h-4 w-4" />
          <span>
            Menampilkan {filteredExpenses.length} data untuk periode:{" "}
            <span className="font-medium text-foreground">
              {filterPeriod === "today" && "Hari Ini"}
              {filterPeriod === "week" && "Minggu Ini"}
              {filterPeriod === "month" && "Bulan Ini"}
              {filterPeriod === "year" && "Tahun Ini"}
            </span>
          </span>
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Item
                </th>
                <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Tanggal
                </th>
                <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Biaya
                </th>
                <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Responsible
                </th>
                <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Catatan
                </th>
                <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-32">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <LoadingState
                      className="py-12 h-auto"
                      iconClassName="h-8 w-8 text-orange mb-4"
                      message="Memuat data pengeluaran..."
                      textClassName="text-sm"
                    />
                  </td>
                </tr>
              ) : paginatedExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="py-12">
                      <div className="h-16 w-16 rounded-2xl bg-orange/10 flex items-center justify-center mx-auto mb-4">
                        <Wallet className="h-8 w-8 text-orange" />
                      </div>
                      <p className="text-base font-semibold">
                        Tidak ada pengeluaran
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {searchQuery
                          ? "Coba ubah kata kunci pencarian"
                          : filterPeriod !== "all"
                            ? "Tidak ada data untuk periode ini"
                            : "Belum ada data pengeluaran"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedExpenses.map((expense, index) => (
                  <ExpenseRow
                    key={expense.id}
                    expense={expense}
                    index={index}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredExpenses.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={filteredExpenses.length}
            onPageChange={handlePageChange}
          />
        )}
      </Card>
    </div>
  );
}
