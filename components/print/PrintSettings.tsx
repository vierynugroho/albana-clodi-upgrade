"use client";

import { PrintSetting } from "@/types";
import { PrintType } from "@/types";
import { useTheme } from "next-themes";

interface Props {
  type: PrintType;
  setting: PrintSetting;
  onTypeChange: (v: PrintType) => void;
  onSettingChange: (v: PrintSetting) => void;
}

export function PrintSettings({
  type,
  setting,
  onTypeChange,
  onSettingChange,
}: Props) {
  const { theme } = useTheme();

  // Tentukan warna background dan text sesuai tema
  const bgClass =
    theme === "dark"
      ? "bg-gray-900 border-gray-700 text-gray-100"
      : theme === "light"
      ? "bg-white border-gray-300 text-gray-900"
      : "bg-gray-50 border-gray-200 text-gray-900"; // fallback netral

  return (
    <div
      className={`w-full max-w-md rounded-xl border p-6 shadow-lg transition-colors ${bgClass}`}
    >
      <h3 className="mb-5 text-lg font-semibold">Pengaturan Cetak</h3>

      {/* Print Type */}
      <div className="space-y-3">
        {[
          { label: "Shipping Label", value: "shipping_label" },
          { label: "Invoice", value: "invoice_a4" },
          { label: "Invoice Thermal (58mm)", value: "invoice_thermal_58" },
        ].map((item) => (
          <label
            key={item.value}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition
              ${
                type === item.value
                  ? "border-blue-600 bg-blue-600/10 text-blue-400"
                  : "border-gray-400 dark:border-gray-600 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
              }`}
          >
            <input
              type="radio"
              checked={type === item.value}
              onChange={() => onTypeChange(item.value as PrintType)}
              className="hidden"
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>

      <hr className="my-6 border-gray-300 dark:border-gray-600" />

      {/* Settings */}
      <div className="space-y-3">
        {Object.entries(setting).map(([key, value]) => (
          <label
            key={key}
            className="flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
          >
            <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
            <input
              type="checkbox"
              checked={value}
              onChange={() =>
                onSettingChange({
                  ...setting,
                  [key]: !value,
                })
              }
              className="h-4 w-4 accent-blue-600"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
