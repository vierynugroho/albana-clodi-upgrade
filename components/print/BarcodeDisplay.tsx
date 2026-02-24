"use client";

import Barcode from "react-barcode";

type BarcodeFormat =
  | "CODE128" | "CODE128A" | "CODE128B" | "CODE128C"
  | "CODE39" | "EAN13" | "EAN8" | "EAN5" | "EAN2"
  | "UPC" | "UPCE" | "ITF14" | "ITF"
  | "MSI" | "MSI10" | "MSI11" | "MSI1010" | "MSI1110"
  | "pharmacode" | "codabar" | "GenericBarcode";

interface BarcodeDisplayProps {
  value: string;
  height?: number;
  width?: number;
  format?: BarcodeFormat;
}

export function BarcodeDisplay({
  value,
  height = 40,
  width = 1.5,
  format = "CODE128",
}: BarcodeDisplayProps) {
  if (!value) {
    return (
      <p className="text-[10px] text-gray-400 italic">
        Barcode tidak tersedia
      </p>
    );
  }

  return (
    <Barcode
      value={value}
      format={format}
      width={width}
      height={height}
      displayValue={true}
      fontSize={10}
      margin={0}
      background="transparent"
    />
  );
}
