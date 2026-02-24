"use client";

import ExpensesForm from "@/components/expenses/ExpensesForm";
import { useRouter } from "next/navigation";

export default function AddExpensesPage() {
    const router = useRouter();

    return (
        <div className="max-w-3xl mx-auto">
            <ExpensesForm onSuccess={() => router.push("/expenses")} />
        </div>
    );
}