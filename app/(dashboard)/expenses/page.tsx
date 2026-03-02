"use client";

import { ExpenseTable } from "@/components/expenses/ExpensesTable";
import { Button } from "@/components/ui/button";
import type { Expense } from "@/types";
import { Plus, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useExpenses, useExpenseStats, useDeleteExpense } from "@/hooks/useExpenses";
import { useToast } from "@/hooks/use-toast";
import { ExpenseStats } from "@/components/expenses/ExpensesStats";

export default function ExpensePage() {
  const router = useRouter();
  const { toast } = useToast();

  // Fetch expenses from API
  const { data: expenseData, isLoading: isLoadingExpenses } = useExpenses();
  const { data: stats, isLoading: isLoadingStats } = useExpenseStats();
  const deleteExpense = useDeleteExpense();

  // Map API expenses to frontend Expense type
  const expenses: Expense[] = (expenseData?.data || []).map((expense) => ({
    id: expense.id,
    itemName: expense.itemName,
    itemPrice: expense.itemPrice,
    expenseDate: expense.expenseDate,
    qty: expense.qty,
    totalPrice: expense.totalPrice,
    personResponsible: expense.personResponsible,
    note: expense.note,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
  }));

  const handleEdit = (expense: Expense) => {
    router.push(`/expenses/${expense.id}`);
  };

  const handleDelete = async (expenseId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengeluaran ini?")) {
      return;
    }

    try {
      await deleteExpense.mutateAsync(expenseId);
      toast({
        title: "Berhasil!",
        description: "Data pengeluaran berhasil dihapus",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menghapus data",
        variant: "destructive",
      });
    }
  };

  const handleView = (expense: Expense) => {
    router.push(`/expenses/${expense.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Wallet className="h-7 w-7 text-orange" />
            Expenses
          </h1>
          <p className="page-description">
            Kelola semua data pengeluaran Anda
            {expenseData?.totalData && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({expenseData.totalData} total data)
              </span>
            )}
          </p>
        </div>

        <Button onClick={() => router.push("/expenses/add")} variant="gradient">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Data
        </Button>
      </div>

      {/* Stats */}
      <ExpenseStats
        totalExpenses={stats?.totalExpenses || 0}
        thisMonthTotal={stats?.thisMonthTotal || 0}
        monthTrend={stats?.monthTrend || 0}
        averagePerMonth={stats?.averagePerMonth || 0}
        largestCategory={stats?.largestCategory || "-"}
        largestPercentage={stats?.largestPercentage || "0%"}
        isLoading={isLoadingStats}
      />

      {/* Table */}
      <ExpenseTable
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        isLoading={isLoadingExpenses}
      />
    </div>
  );
}
