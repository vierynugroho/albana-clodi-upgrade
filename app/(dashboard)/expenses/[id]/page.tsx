"use client";

import { useParams, useRouter } from "next/navigation";
import ExpensesForm from "@/components/expenses/ExpensesForm";
import { useExpense } from "@/hooks/useExpenses";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingState } from "@/components/shared/LoadingState";

export default function EditExpensesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: expense, isLoading, error } = useExpense(id);

  if (isLoading) {
    return (
      <LoadingState />
    );
  }

  if (error || !expense) {
    return (
      <Card className="max-w-md mx-auto mt-12 p-8 text-center">
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-lg font-semibold mb-2">Data Tidak Ditemukan</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Pengeluaran dengan ID ini tidak ditemukan atau telah dihapus.
        </p>
        <Button onClick={() => router.push("/expenses")} variant="outline">
          Kembali ke Daftar
        </Button>
      </Card>
    );
  }

  const initialData = {
    id: expense.id,
    itemName: expense.itemName,
    itemPrice: expense.itemPrice,
    expenseDate: expense.expenseDate.split("T")[0],
    qty: expense.qty,
    personResponsible: expense.personResponsible || "",
    note: expense.note || "",
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ExpensesForm
        initialData={initialData}
        isEditMode={true}
        onSuccess={() => router.push("/expenses")}
      />
    </div>
  );
}
