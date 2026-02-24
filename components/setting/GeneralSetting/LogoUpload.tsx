import { Button } from "@/components/ui";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { memo, useRef } from "react";

export const LogoUpload = memo(function LogoUpload({
  logo,
  onChange,
  onDelete,
}: {
  logo: string;
  onChange: (file: File) => void;
  onDelete: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        onClick={() => inputRef.current?.click()}
        className="relative h-32 w-32 cursor-pointer overflow-hidden rounded-xl border-2 border-dashed"
      >
        {logo ? (
          <Image src={logo} alt="Logo" fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Upload />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files && onChange(e.target.files[0])}
      />

      {logo && (
        <Button variant="outline" size="sm" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus
        </Button>
      )}
    </div>
  );
});