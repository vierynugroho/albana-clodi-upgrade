import { ShippingLabel } from "@/components/print/templates/ShippingLabel";
import { InvoiceA4 } from "@/components/print/templates/InvoiceA4";
import { InvoiceThermal58 } from "@/components/print/templates/InvoiceThermal58";
import { PrintPayload } from "@/types";

export function PrintPreview({ orders, type, setting, adminName }: PrintPayload) {
  return (
    <div id="print-area">
      {orders.map((order) => {
        switch (type) {
          case "shipping_label":
            return (
              <ShippingLabel
                key={order.id}
                order={order}
                setting={setting}
                adminName={adminName}
              />
            );

          case "invoice_thermal_58":
            return (
              <InvoiceThermal58
                key={order.id}
                order={order}
                setting={setting}
                adminName={adminName}
              />
            );

          default:
            return (
              <InvoiceA4
                key={order.id}
                order={order}
                setting={setting}
                adminName={adminName}
              />
            );
        }
      })}
    </div>
  );
}
