import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { UseOrderFormReturn } from "../../hooks/useOrderStateForm";

type OrderFormActionsProps = Pick<
    UseOrderFormReturn,
    | "mode"
    | "router"
    | "isSubmitting"
    | "handleSubmit"
>;

export function OrderFormActions({
    mode,
    router,
    isSubmitting,
    handleSubmit,
}: OrderFormActionsProps) {
    return (
        <div className="flex justify-end gap-4">
            <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/orders")}
                disabled={isSubmitting}
            >
                Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                    </>
                ) : (
                    mode === "edit" ? "Perbarui Order" : "Simpan Order"
                )}
            </Button>
        </div>
    );
}
