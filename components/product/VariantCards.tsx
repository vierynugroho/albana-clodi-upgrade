"use client";

import { Plus, Trash2, Upload } from "lucide-react";
import { Button } from "../ui";
import Image from "next/image";
import { memo, useCallback, useRef } from "react";

interface ImageUploadProps {
  imagePreview: string | null;
  onImageChange: (file: File) => void;
  onImageDelete: () => void;
}

const ImageUpload = memo(function ImageUpload({
  imagePreview,
  onImageChange,
  onImageDelete,
}: ImageUploadProps) {
  const imageRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    imageRef.current?.click();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onImageChange(file);
    },
    [onImageChange]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="relative group">
        <div
          onClick={handleClick}
          className="relative aspect-square w-20 cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30 transition-all hover:border-primary hover:bg-muted/50"
        >
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Preview Produk"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
              <Upload className="h-5 w-5" />
              <span className="text-[9px] text-center px-1">Upload</span>
            </div>
          )}
        </div>
        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </div>
      {imagePreview && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-20 h-6 text-[10px] text-destructive hover:text-destructive"
          onClick={onImageDelete}
        >
          <Trash2 className="mr-1 h-3 w-3" />
          Hapus
        </Button>
      )}
    </div>
  );
});

import { Card, CardContent, FormFieldWrapper, Input } from "../ui";
import { Controller, Control, UseFormRegister, UseFormSetValue, FieldArrayWithId } from "react-hook-form";
import type { ProductFormValues } from "@/schemas/zod.schemas";

interface VariantCardsProps {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  showVariantToggle: boolean;
  variantImages: (string | null)[];
  setVariantImages: React.Dispatch<React.SetStateAction<(string | null)[]>>;
  fields: FieldArrayWithId<ProductFormValues, "productVariants", "id">[];
  append: (value: ProductFormValues["productVariants"][0]) => void;
  remove: (index: number) => void;
}

const defaultVariant = () => ({
  sku: "",
  stock: 0,
  size: "",
  color: "",
  barcode: "",
  imageUrl: null,
  productPrices: {
    buy: 0,
    agent: 0,
    reseller: 0,
    member: 0,
    normal: 0,
  },
  productWholesalers: [],
});

const VariantCards = ({
  control,
  register,
  setValue,
  showVariantToggle,
  variantImages,
  setVariantImages,
  fields,
  append,
  remove,
}: VariantCardsProps) => {
  const handleAddVariant = useCallback(() => {
    append(defaultVariant());
    setVariantImages(prev => [...prev, null]);
  }, [append, setVariantImages]);

  const handleRemoveVariant = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
        setVariantImages(prev => prev.filter((_, i) => i !== index));
      }
    },
    [fields.length, remove, setVariantImages]
  );

  const handleVariantImageChange = useCallback(
    (index: number, file: File) => {
      setValue(`productVariants.${index}.imageUrl`, file);
      setVariantImages(prev => {
        const updated = [...prev];
        updated[index] = URL.createObjectURL(file);
        return updated;
      });
    },
    [setValue, setVariantImages]
  );

  const handleVariantImageDelete = useCallback(
    (index: number) => {
      setValue(`productVariants.${index}.imageUrl`, null);
      setVariantImages(prev => {
        const updated = [...prev];
        updated[index] = null;
        return updated;
      });
    },
    [setValue, setVariantImages]
  );

  // @debug — commented for production
  // console.log(variantImages)

  return (
    <div className="flex flex-col gap-4 overflow-x-auto">
      {fields.map((field, index) => (
        <Card key={field.id} className="w-full">
          <CardContent className="pt-6 flex flex-col sm:flex-row gap-4 relative">
            {/* Image Upload */}
            <ImageUpload
              imagePreview={variantImages[index]}
              onImageChange={file => handleVariantImageChange(index, file)}
              onImageDelete={() => handleVariantImageDelete(index)}
            />

            {/* Variant Details */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
              {/* Column 1: SKU */}
              <div>
                <FormFieldWrapper label="SKU" required>
                  <Input
                    placeholder="T003"
                    {...register(`productVariants.${index}.sku`)}
                  />
                </FormFieldWrapper>
              </div>

              {/* Column 2: Prices */}
              <div className="space-y-2">
                {(["buy", "agent", "reseller", "member", "normal"] as const).map(priceKey => (
                  <FormFieldWrapper
                    key={priceKey}
                    label={`Harga ${priceKey.charAt(0).toUpperCase() + priceKey.slice(1)}`}
                  >
                    <Controller
                      name={`productVariants.${index}.productPrices.${priceKey}`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="0"
                          value={field.value as number}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      )}
                    />
                  </FormFieldWrapper>
                ))}
              </div>

              {/* Column 3: Size & Color */}
              <div className="space-y-2">
                <FormFieldWrapper label="Ukuran">
                  <Input
                    placeholder="XL"
                    {...register(`productVariants.${index}.size`)}
                  />
                </FormFieldWrapper>
                <FormFieldWrapper label="Warna">
                  <Input
                    placeholder="Merah"
                    {...register(`productVariants.${index}.color`)}
                  />
                </FormFieldWrapper>
              </div>

              {/* Column 4: Stock */}
              <div>
                <FormFieldWrapper label="Stok">
                  <Input
                    type="number"
                    placeholder="0"
                    min={0}
                    {...register(`productVariants.${index}.stock`, {
                      valueAsNumber: true,
                    })}
                  />
                </FormFieldWrapper>
              </div>
            </div>

            {/* Delete Variant Button */}
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                onClick={() => handleRemoveVariant(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      {showVariantToggle && (
        <Button
          type="button"
          variant="default"
          onClick={handleAddVariant}
          className="mt-4 w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Varian
        </Button>
      )}
    </div>
  );
};

export default VariantCards;
