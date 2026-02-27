"use client";

import { useState } from "react";
import { useOrdersByIds } from "@/hooks/useOrders";
import { PrintSettings } from "@/components/print/PrintSettings";
import { PrintPreview } from "@/components/print/PrintPreview";
import { PrintType, PrintSetting } from "@/types";
import { Loader2, Printer } from "lucide-react";
import { LoadingState } from "@/components/shared/LoadingState";
import { printDocument } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useAuth";

interface Props {
  orderIds: string[];
  initialType?: PrintType;
}

export function PrintManager({
  orderIds,
  initialType = "shipping_label",
}: Props) {
  const { orders, isLoading, isError } = useOrdersByIds(orderIds);
  const { data: userData } = useCurrentUser();
  const adminName = userData?.responseObject?.fullname || undefined;

  const [type, setType] = useState<PrintType>(initialType);

  const [setting, setSetting] = useState<PrintSetting>({
    showLogo: true,
    showShopInfo: true,
    showCustomerAddress: true,
    showWarehouse: false,
    showSKU: false,
    showBarcodeResi: true,
    showWeight: true,
    showInsurance: false,
    showAdminName: false,
    showNote: true,
    showNoOrder: true,
    showSalesChannel: true,
    showDate: true,
    showFragile: false,
    // showOrderStatus: true,
    showPaymentStatus: false,
    showInstallmentAmount: false,
  });

  if (isLoading) return (
    <LoadingState 
      className="min-h-[400px] h-auto flex-col gap-4" 
      iconClassName="h-8 w-8 text-primary" 
      message="Memuat data orders..."
      textClassName="text-base"
    />
  );
  if (isError) return <p>Gagal memuat data order</p>;
  if (!orders.length) return <p>Order tidak ditemukan</p>;

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* SETTINGS */}
      <div className="col-span-4 flex flex-col gap-4">
        <PrintSettings
          type={type}
          onTypeChange={setType}
          setting={setting}
          onSettingChange={setSetting}
        />
        
        <div className="w-full max-w-md">
          <Button 
            className="w-full h-12 text-lg font-semibold gap-2 shadow-lg hover:shadow-xl transition-all" 
            onClick={printDocument}
          >
            <Printer className="h-5 w-5" />
            Cetak Dokumen
          </Button>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="col-span-8">
        <PrintPreview
          orders={orders}
          type={type}
          setting={setting}
          adminName={adminName}
        />
      </div>
    </div>
  );
}
