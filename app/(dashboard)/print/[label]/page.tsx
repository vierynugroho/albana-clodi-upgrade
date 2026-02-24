import { PrintManager } from "@/components/print/PrintManager";
import { PrintType } from "@/types";

interface PageProps {
  params: Promise<{ label: string }>;
  searchParams: Promise<{ ids?: string }>;
}

const labelMap: Record<string, PrintType> = {
  label: "shipping_label",
  invoice: "invoice_a4",
  "invoice-thermal": "invoice_thermal_58",
};

export default async function PrintPage({
  params,
  searchParams,
}: PageProps) {
  const [{ label }, { ids }] = await Promise.all([
    params,
    searchParams,
  ]);

  const orderIds = ids ? ids.split(",") : [];

  const initialType =
    labelMap[label] ?? "shipping_label";

  return (
    <div className="space-y-6">
      <PrintManager
        orderIds={orderIds}
        initialType={initialType}
      />
    </div>
  );
}

