// types/unions.ts
// Union types dan type aliases yang digunakan di berbagai tempatt

// Print type union — digunakan oleh PrintManager, PrintSettings, PrintPreview
export type PrintType =
  | "shipping_label"
  | "invoice_a4"
  | "invoice_thermal_58";

// Chart types — digunakan oleh useCharts hooks dan ChartPlaceholder component
export type ChartItem = {
  month: string;
  total: number;
};

export type ChartDataItem = {
  name: string;
  value: number;
};
