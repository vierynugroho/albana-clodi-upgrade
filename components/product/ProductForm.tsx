"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm, useFieldArray, Controller, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input, Textarea, FormFieldWrapper } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RefreshCw,
  Loader2,
  Percent,
  Scale,
  ChevronLeft,
} from "lucide-react";
import { useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { ProductCreatePayload } from "@/types/api";
import { generateSKUFromName, getApiErrorMessage } from "@/lib/utils";
import { productFormSchema, ProductFormValues } from "@/schemas/zod.schemas";
import { ToggleSwitch } from "./ToggleSwitchProduct";
import VariantCards from "./VariantCards";

// Product type options matching API
const PRODUCT_TYPE_OPTIONS = [
  { value: "BARANG_STOK_SENDIRI", label: "Barang Stock Sendiri" },
  { value: "BARANG_SUPPLIER_LAIN", label: "Barang Suplier Lain" },
  { value: "BARANG_PRE_ORDER", label: "Barang Pre-Order" },
] as const;

// upload imagenya masih belom bisa

interface ProductFormProps {
  initialData?: ProductFormValues & { id?: string };
  isEditMode?: boolean;
  onSuccess?: () => void;
}

// Default variant template
const defaultVariant = (): ProductFormValues["productVariants"][0] => ({
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

export function ProductForm({
  initialData,
  isEditMode = false,
  onSuccess,
}: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const existingSkus = useRef(new Set<string>());

  // Mutation hooks
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  // Fetch categories for dropdown
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCategories();

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  // Toggle states for "Atur Produk"
  const [showVariantToggle, setShowVariantToggle] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);

  // Toggle states for "Atur Privor & Storefront"
  const [isPublish, setIsPublish] = useState(true);
  const [showStock, setShowStock] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData || {
      name: "",
      categoryId: "",
      type: "BARANG_STOK_SENDIRI",
      description: "",
      weight: 0,
      isPublish: true,
      showStock: true,
      productDiscount: {
        type: "PERCENTAGE",
        value: 0,
      },
      productVariants: [defaultVariant()],
    },
  });

  // Field array for variants
  const { fields, append, remove } = useFieldArray({
    control,
    name: "productVariants",
  });

  const productName = watch("name");
  const selectedType = watch("type");

  const [variantImages, setVariantImages] = useState<(string | null)[]>(
    fields.map(() => null)
  );

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
      // Initialize variant images from existing data
      const images = initialData.productVariants.map((v) =>
        typeof v.imageUrl === "string" && v.imageUrl ? v.imageUrl : null,
      );
      setVariantImages(images);

      const discountValue = Number(initialData.productDiscount?.value) || 0;
      if (discountValue > 0) {
        setShowDiscount(true);
      }

      if (initialData.productVariants.length > 1) {
        setShowVariantToggle(true);
      }
    }
  }, [initialData, reset]);

  // Auto-generate SKUs when product name changes
  const handleGenerateSKUs = useCallback(() => {
    if (!productName) return;
    const skus = generateSKUFromName(
      productName,
      fields.length,
      existingSkus.current,
    );
    skus.forEach((sku, index) => {
      setValue(`productVariants.${index}.sku`, sku);
    });
  }, [productName, fields.length, setValue]);


  // Handle product type change
  const handleTypeChange = useCallback(
    (value: string) => {
      setValue("type", value);
    },
    [setValue],
  );

  // Transform form data to API payload
  const transformToPayload = (
    data: ProductFormValues,
  ): ProductCreatePayload => {
    return {
      product: {
        categoryId: data.categoryId,
        name: data.name,
        type: data.type as
          | "BARANG_STOK_SENDIRI"
          | "BARANG_SUPPLIER_LAIN"
          | "BARANG_PRE_ORDER",
        description: data.description || "",
        weight: data.weight,
        isPublish: isPublish,
      },
      productDiscount: {
        id: data.productDiscount?.id,
        type: data.productDiscount?.type || "PERCENTAGE",
        value: Number(data.productDiscount?.value) || 0,
      },
      productVariants: data.productVariants.map((v) => ({
        id: v.id,
        sku: v.sku,
        stock: v.stock,
        size: v.size || "",
        color: v.color || "",
        barcode: v.barcode || "",
        images: v.imageUrl,
        productPrices: {
          id: v.productPrices.id,
          productVariantId: v.productPrices.productVariantId,
          buy: v.productPrices.buy,
          agent: v.productPrices.agent,
          reseller: v.productPrices.reseller,
          member: v.productPrices.member,
          normal: v.productPrices.normal,
          createdAt: v.productPrices.createdAt,
          updatedAt: v.productPrices.updatedAt,
        },
        productWholesalers: [], // Empty array as per requirement
      })),
    };
  };

  const onSubmit = async (data: ProductFormValues) => {
    // @debug — commented for production
    // console.log("=== onSubmit called ===");
    // console.log("Form data:", data);
    try {
      const payload = transformToPayload(data);

      if (isEditMode && initialData?.id) {
        await updateProduct.mutateAsync({ id: initialData.id, payload });
        toast({
          title: "Berhasil",
          description: "Produk berhasil diperbarui",
          variant: "success",
        });
      } else {
        await createProduct.mutateAsync(payload);
        toast({
          title: "Berhasil",
          description: "Produk berhasil ditambahkan",
          variant: "success",
        });
      }

      onSuccess?.();
      router.push("/products");
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Terjadi kesalahan saat menyimpan produk"
      );
      toast({
        title: "Gagal",
        description: message,
        variant: "destructive",
      });
    }
  }; 

  const onFormError = (formErrors: FieldErrors<ProductFormValues>) => {
    // Get current form values for debugging
    const currentValues = watch();

    const errorMessages: string[] = [];

    // Price label mapping for readable names
    const priceLabels: Record<string, string> = {
      buy: "Beli",
      agent: "Agent",
      reseller: "Reseller",
      member: "Member",
      normal: "Normal",
    };

    if (formErrors.name) errorMessages.push(`Nama Produk: ${formErrors.name.message}`);
    if (formErrors.categoryId)
      errorMessages.push(`Kategori: ${formErrors.categoryId.message}`);
    if (formErrors.type)
      errorMessages.push(`Jenis Produk: ${formErrors.type.message}`);
    if (formErrors.weight)
      errorMessages.push(`Berat: ${formErrors.weight.message}`);
    if (formErrors.description)
      errorMessages.push(`Deskripsi: ${formErrors.description.message}`);

    if (formErrors.productVariants) {
      if (Array.isArray(formErrors.productVariants)) {
        formErrors.productVariants.forEach((v: FieldErrors<ProductFormValues["productVariants"][0]> | undefined, i: number) => {
          if (!v) return;
          const label = `Varian ${i + 1}`;
          if (v.sku)
            errorMessages.push(`${label} SKU: ${v.sku.message}`);
          if (v.stock)
            errorMessages.push(`${label} Stok: ${v.stock.message}`);
          if (v.size)
            errorMessages.push(`${label} Ukuran: ${v.size.message}`);
          if (v.color)
            errorMessages.push(`${label} Warna: ${v.color.message}`);
          if (v.barcode)
            errorMessages.push(`${label} Barcode: ${v.barcode.message}`);
          if (v.imageUrl)
            errorMessages.push(`${label} Gambar: ${v.imageUrl.message}`);
          if (v.productPrices) {
            // Handle individual price field errors
            const priceKeys = ["buy", "agent", "reseller", "member", "normal"] as const;
            priceKeys.forEach((key) => {
              const priceError = v.productPrices?.[key];
              if (priceError?.message) {
                errorMessages.push(
                  `${label} Harga ${priceLabels[key] || key}: ${priceError.message}`,
                );
              }
            });
            // Handle root-level superRefine errors (e.g., buy > normal/reseller)
            if (v.productPrices.root?.message) {
              errorMessages.push(`${label}: ${v.productPrices.root.message}`);
            }
          }
        });
      } else if (formErrors.productVariants.message) {
        errorMessages.push(`Varian: ${formErrors.productVariants.message}`);
      }
    }

    if (formErrors.productDiscount) {
      if (formErrors.productDiscount.value?.message) {
        errorMessages.push(`Diskon: ${formErrors.productDiscount.value.message}`);
      } else if (formErrors.productDiscount.message) {
        errorMessages.push(`Diskon: ${formErrors.productDiscount.message}`);
      }
    }

    // If no specific errors found, list the field names
    if (errorMessages.length === 0 && Object.keys(formErrors).length > 0) {
      errorMessages.push(
        `Terdapat error pada: ${Object.keys(formErrors).join(", ")}`,
      );
    }

    toast({
      title: "Validasi Gagal",
      description:
        errorMessages.length > 0
          ? errorMessages.join(" | ")
          : "Periksa kembali form. Lihat console untuk detail.",
      variant: "destructive",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-6">
      {/* Header with Back Button and Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">
            {isEditMode ? "Edit Produk" : "Tambah Produk"}
          </h1>
        </div>
        <div className="text-sm text-muted-foreground hidden sm:block">
          Home &gt; Halaman Produk &gt;{" "}
          <span className="text-primary font-medium">
            {isEditMode ? "Edit Produk" : "Tambah Produk"}
          </span>
        </div>
      </div>

      {/* Main Layout - Two Columns */}
      <div className="grid gap-6 xl:grid-cols-[1fr,320px]">
        {/* Left Column - Informasi Produk */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Informasi Produk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product Name */}
            <FormFieldWrapper
              label="Nama Produk"
              required
              error={errors.name?.message}
            >
              <div className="flex gap-2">
                <Input
                  placeholder="Baju Anak"
                  error={!!errors.name}
                  {...register("name")}
                  onChange={(e) => {
                    register("name").onChange(e);
                    if (!isEditMode) {
                      // Auto generate SKU when name changes in create mode
                      setTimeout(handleGenerateSKUs, 100);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateSKUs}
                  title="Generate SKU otomatis"
                  className="shrink-0"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              {/* {errors.name && (
                <p className="text-destructive text-sm mt-1">
                  {errors.name.message}
                </p>
              )} */}
            </FormFieldWrapper>

            {/* Category */}
            <FormFieldWrapper label="Kategori">
              <div className="relative">
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <select
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                      disabled={isCategoriesLoading}
                    >
                      <option value="">
                        {isCategoriesLoading
                          ? "Memuat..."
                          : "Pilih Kategori Produk"}
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {isCategoriesLoading && (
                  <Loader2 className="absolute right-8 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
            </FormFieldWrapper>

            {/* Product Type - Radio Buttons in Card Style */}
            <FormFieldWrapper
              label="Jenis Produk"
              required
              error={errors.type?.message}
            >
              <div className="flex flex-wrap gap-4">
                {PRODUCT_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleTypeChange(opt.value)}
                    className={`flex-1 min-w-40 p-4 rounded-xl border-2 transition-all text-sm font-medium ${selectedType === opt.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-muted/50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedType === opt.value
                          ? "border-primary"
                          : "border-muted-foreground"
                          }`}
                      >
                        {selectedType === opt.value && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <span>{opt.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </FormFieldWrapper>

            {/* Description */}
            <FormFieldWrapper
              label="Deskripsi Produk"
              required
              error={errors.description?.message}
            >
              <Textarea
                placeholder="Tulis deskripsi produk di sini..."
                className="min-h-30 resize-none"
                {...register("description")}
              />
              {!watch("description") && (
                <p className="text-destructive text-sm mt-1">
                  Deskripsi Produk wajib diisi.
                </p>
              )}
            </FormFieldWrapper>

            {/* Weight and Discount */}
            <div className="flex gap-4">
              <FormFieldWrapper
                label="Berat (gram)"
                required
                error={errors.weight?.message}
                className="flex-1 max-w-50"
              >
                <Input
                  type="number"
                  min={1}
                  placeholder="500"
                  leftIcon={<Scale className="h-4 w-4" />}
                  error={!!errors.weight}
                  {...register("weight", { valueAsNumber: true })}
                />
              </FormFieldWrapper>

              {showDiscount && (
                <FormFieldWrapper
                  label="Diskon"
                  className="flex-1 max-w-50"
                >
                  <Input
                    type="number"
                    placeholder="0"
                    min={1}
                    leftIcon={<Percent className="h-4 w-4" />}
                    {...register("productDiscount.value", {
                      valueAsNumber: true,
                    })}
                  />
                </FormFieldWrapper>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Atur Produk & Storefront */}
        <div className="space-y-6">
          {/* Atur Produk */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Atur Produk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ToggleSwitch
                label="Varian"
                checked={showVariantToggle}
                onChange={setShowVariantToggle}
              />
              <ToggleSwitch
                label="Diskon"
                checked={showDiscount}
                onChange={setShowDiscount}
              />
            </CardContent>
          </Card>

          {/* Atur Privor & Storefront */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Atur Privor & Storefront
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ToggleSwitch 
                label="Publish"
                checked={isPublish}
                onChange={setIsPublish}
              />
              <ToggleSwitch
                label="Tampilkan Stock"
                checked={showStock}
                onChange={setShowStock}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Variant Section Header */}
      <div className="overflow-x-auto">
        <div className="p-4 bg-primary rounded-2xl min-w-200">
          <div className="grid grid-cols-5 text-primary-foreground font-medium text-sm ml-24">
            <span>Gambar</span>
            <span>Spesifikasi</span>
            <span>Harga</span>
            <span>Variant</span>
            <span>Stok</span>
          </div>
        </div>
      </div>

      {/* Variant Section */}
      <VariantCards
        control={control}
        register={register}
        setValue={setValue}
        showVariantToggle={showVariantToggle}
        variantImages={variantImages}
        setVariantImages={setVariantImages}
        fields={fields}
        append={append}
        remove={remove}
      />


      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
        size="lg"
      >
        {isEditMode ? "Simpan Perubahan" : "Tambah Produk"}
      </Button>
    </form>
  );
}
