"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema, CustomerFormValues } from "@/schemas/zod.schemas";
import { FormField } from "../field/FormField";
import { Loader2, ChevronDown, Search } from "lucide-react";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/useCustomers";
import { useProvinces, useCities, useDistricts, useVillages } from "@/hooks/useRegions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { CustomerCreatePayload } from "@/types/api";
import { getApiErrorMessage } from "@/lib/utils";

const CustomerLabelCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Card className="p-4">
    <h2 className="text-xl font-bold">{title}</h2>
    <p className="text-sm text-muted-foreground mt-1">{description}</p>
  </Card>
);

interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string, label: string) => void;
  placeholder: string;
  disabled?: boolean;
  isLoading?: boolean;
  error?: string;
}

const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  isLoading = false,
  error,
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled || isLoading}
        className={`
          w-full h-10 px-3 py-2 text-left text-sm rounded-xl border
          flex items-center justify-between
          ${disabled ? "bg-muted cursor-not-allowed opacity-50" : "bg-background cursor-pointer"}
          ${error ? "border-red-500" : "border-input"}
          focus:outline-none focus:ring-2 focus:ring-ring
        `}
      >
        <span className={selectedLabel ? "text-foreground" : "text-muted-foreground"}>
          {isLoading ? "Memuat..." : selectedLabel || placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-xl shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari..."
                className="w-full h-8 pl-8 pr-3 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground text-center">
                Tidak ditemukan
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value, opt.label);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`
                    w-full px-3 py-2 text-left text-sm hover:bg-accent
                    ${opt.value === value ? "bg-accent font-medium" : ""}
                  `}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsOpen(false);
            setSearch("");
          }}
        />
      )}
    </div>
  );
};

interface CustomerFormProps {
  initialData?: CustomerFormValues & { id?: string };
  isEditMode?: boolean;
  onSuccess?: () => void;
}

const CustomerForm = ({
  initialData,
  isEditMode = false,
  onSuccess,
}: CustomerFormProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");
  const { data: provinces = [], isLoading: loadingProvinces } = useProvinces();
  const { data: cities = [], isLoading: loadingCities } = useCities(selectedProvinceId);
  const { data: districts = [], isLoading: loadingDistricts } = useDistricts(selectedCityId);
  const { data: villages = [], isLoading: loadingVillages } = useVillages(selectedDistrictId);

  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const isSubmitting = createCustomer.isPending || updateCustomer.isPending;

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData || {
      kategori: "",
      namaLengkap: "",
      provinsiId: "",
      kotaId: "",
      kecamatanId: "",
      desaId: "",
      provinsi: "",
      kota: "",
      kecamatan: "",
      desa: "",
      kodePos: "",
      email: "",
      noTelepon: "",
      alamat: "",
    },
  });

  const watchedKecamatanId = watch("kecamatanId");

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (!isEditMode || !initialData?.provinsi || provinces.length === 0) return;
    if (selectedProvinceId) return;
    const match = provinces.find(
      (p) => p.name.toLowerCase() === initialData.provinsi.toLowerCase()
    );
    if (match) {
      setSelectedProvinceId(match.id);
      setValue("provinsiId", match.id);
    }
  }, [isEditMode, initialData?.provinsi, provinces, selectedProvinceId, setValue]);

  useEffect(() => {
    if (!isEditMode || !initialData?.kota || cities.length === 0) return;
    if (selectedCityId) return;
    const match = cities.find(
      (c) => c.name.toLowerCase() === initialData.kota.toLowerCase()
    );
    if (match) {
      setSelectedCityId(match.id);
      setValue("kotaId", match.id);
    }
  }, [isEditMode, initialData?.kota, cities, selectedCityId, setValue]);

  useEffect(() => {
    if (!isEditMode || !initialData?.kecamatan || districts.length === 0) return;
    if (selectedDistrictId) return;
    const match = districts.find(
      (d) => d.name.toLowerCase() === initialData.kecamatan.toLowerCase()
    );
    if (match) {
      setSelectedDistrictId(match.id);
      setValue("kecamatanId", match.id);
    }
  }, [isEditMode, initialData?.kecamatan, districts, selectedDistrictId, setValue]);

  useEffect(() => {
    if (!isEditMode || !initialData?.desa || villages.length === 0) return;
    const currentDesaId = watch("desaId");
    if (currentDesaId) return;
    const match = villages.find(
      (v) => v.name.toLowerCase() === initialData.desa?.toLowerCase()
    );
    if (match) {
      setValue("desaId", match.id);
    }
  }, [isEditMode, initialData?.desa, villages, watch, setValue]);

  useEffect(() => {
    if (watchedKecamatanId) {
      setValue("destinationId", parseInt(watchedKecamatanId, 10));
    }
  }, [watchedKecamatanId, setValue]);

  const transformToPayload = (data: CustomerFormValues): CustomerCreatePayload => {
    const categoryMap: Record<string, CustomerCreatePayload["category"]> = {
      customer: "CUSTOMER",
      reseller: "RESELLER",
      agen: "AGENT",
      member: "MEMBER",
      dropshipper: "DROPSHIPPER",
    };

    return {
      name: data.namaLengkap,
      category: categoryMap[data.kategori.toLowerCase()] || "CUSTOMER",
      address: data.alamat,
      province: data.provinsi || "",
      city: data.kota || "",
      district: data.kecamatan || "",
      village: data.desa || "",
      postalCode: data.kodePos || "",
      phoneNumber: data.noTelepon,
      email: data.email,
      status: "ACTIVE",
      destinationId: data.destinationId || null,
    };
  };

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      const payload = transformToPayload(data);

      if (isEditMode && initialData?.id) {
        await updateCustomer.mutateAsync({ id: initialData.id, payload });
        toast({
          title: "Berhasil",
          description: "Customer berhasil diperbarui",
          variant: "success",
        });
      } else {
        await createCustomer.mutateAsync(payload);
        toast({
          title: "Berhasil",
          description: "Customer berhasil ditambahkan",
          variant: "success",
        });
      }

      onSuccess?.();
      router.push("/customers");
    } catch (error) {
      toast({
        title: "Gagal",
        description: getApiErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleProvinceChange = (id: string, name: string) => {
    setSelectedProvinceId(id);
    setSelectedCityId("");
    setSelectedDistrictId("");
    setValue("provinsiId", id);
    setValue("provinsi", name);
    setValue("kotaId", "");
    setValue("kota", "");
    setValue("kecamatanId", "");
    setValue("kecamatan", "");
    setValue("desaId", "");
    setValue("desa", "");
    setValue("kodePos", "");
  };

  const handleCityChange = (id: string, name: string) => {
    setSelectedCityId(id);
    setSelectedDistrictId("");
    setValue("kotaId", id);
    setValue("kota", name);
    setValue("kecamatanId", "");
    setValue("kecamatan", "");
    setValue("desaId", "");
    setValue("desa", "");
    setValue("kodePos", "");
  };

  const handleDistrictChange = (id: string, name: string) => {
    setSelectedDistrictId(id);
    setValue("kecamatanId", id);
    setValue("kecamatan", name);
    setValue("desaId", "");
    setValue("desa", "");
    setValue("kodePos", "");
  };

  const handleVillageChange = (id: string, name: string) => {
    setValue("desaId", id);
    setValue("desa", name);
    const selectedVillage = villages.find((v) => v.id === id);
    if (selectedVillage) {
      setValue("kodePos", selectedVillage.postalCode.toString());
    }
  };

  const provinceOptions = provinces.map((p) => ({ value: p.id, label: p.name }));
  const cityOptions = cities.map((c) => ({ value: c.id, label: c.name }));
  const districtOptions = districts.map((d) => ({ value: d.id, label: d.name }));
  const villageOptions = villages.map((v) => ({ value: v.id, label: v.name }));

  return (
    <Card className="space-y-6 border-0">
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border p-4 rounded-xl space-y-4"
        >
          <h3 className="font-bold text-base">Informasi Customer</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Kategori *</label>
              <select
                {...register("kategori")}
                className="h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Pilih Kategori</option>
                <option value="customer">Customer</option>
                <option value="reseller">Reseller</option>
                <option value="agen">Agen</option>
                <option value="member">Member</option>
                <option value="dropshipper">Dropshipper</option>
              </select>
              {errors.kategori && (
                <span className="text-xs text-red-500">{errors.kategori.message}</span>
              )}
            </div>

            <FormField<CustomerFormValues>
              label="Nama Lengkap"
              name="namaLengkap"
              placeholder="Masukan nama lengkap"
              nullable={false}
              register={register}
              error={errors.namaLengkap?.message}
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Provinsi <span className="text-destructive">*</span></label>
              <Controller
                name="provinsiId"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    options={provinceOptions}
                    value={field.value || ""}
                    onChange={handleProvinceChange}
                    placeholder="Pilih Provinsi"
                    isLoading={loadingProvinces}
                    error={errors.provinsiId?.message}
                  />
                )}
              />
              {errors.provinsiId && (
                <span className="text-xs text-red-500">{errors.provinsiId.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Kota / Kabupaten <span className="text-destructive">*</span></label>
              <Controller
                name="kotaId"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    options={cityOptions}
                    value={field.value || ""}
                    onChange={handleCityChange}
                    placeholder="Pilih Kota / Kabupaten"
                    disabled={!selectedProvinceId}
                    isLoading={loadingCities}
                    error={errors.kotaId?.message}
                  />
                )}
              />
              {errors.kotaId && (
                <span className="text-xs text-red-500">{errors.kotaId.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Kecamatan <span className="text-destructive">*</span></label>
              <Controller
                name="kecamatanId"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    options={districtOptions}
                    value={field.value || ""}
                    onChange={handleDistrictChange}
                    placeholder="Pilih Kecamatan"
                    disabled={!selectedCityId}
                    isLoading={loadingDistricts}
                    error={errors.kecamatanId?.message}
                  />
                )}
              />
              {errors.kecamatanId && (
                <span className="text-xs text-red-500">{errors.kecamatanId.message}</span>
              )}
              {watchedKecamatanId && (
                <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <span>✓</span>
                  <span>Destination ID: <strong>{watchedKecamatanId}</strong> (otomatis dari kecamatan)</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Desa / Kelurahan</label>
              <Controller
                name="desaId"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    options={villageOptions}
                    value={field.value || ""}
                    onChange={handleVillageChange}
                    placeholder="Pilih Desa / Kelurahan"
                    disabled={!selectedDistrictId}
                    isLoading={loadingVillages}
                  />
                )}
              />
            </div>

            <FormField<CustomerFormValues>
              label="Kode Pos"
              name="kodePos"
              placeholder="Masukan kode pos"
              nullable={true}
              register={register}
            />

            <FormField<CustomerFormValues>
              label="Email"
              name="email"
              type="email"
              placeholder="Masukan email"
              nullable={false}
              register={register}
              error={errors.email?.message}
            />
          </div>

          <FormField<CustomerFormValues>
            label="No Telepon"
            name="noTelepon"
            placeholder="Masukan no telepon"
            nullable={false}
            register={register}
            error={errors.noTelepon?.message}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Alamat <span className="text-destructive">*</span></label>

            <textarea
              {...register("alamat")}
              className="border rounded-xl p-3 resize-none h-28"
              placeholder="Masukan alamat lengkap"
            />

            {errors.alamat && (
              <span className="text-xs text-red-500">
                {errors.alamat.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            variant="outline"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Simpan Perubahan" : "Simpan Customer"}
          </Button>
        </form>

        <div className="border p-4 rounded-xl space-y-4">
          <h3 className="font-bold text-base">Tipe Customer</h3>

          <CustomerLabelCard
            title="Customer"
            description="Pelanggan biasa yang mendapatkan harga normal."
          />

          <CustomerLabelCard
            title="Reseller"
            description="Customer yang mendapatkan potongan harga khusus untuk penjualan kembali."
          />

          <CustomerLabelCard
            title="Agen"
            description="Perantara yang biasanya memiliki kuota atau target penjualan tertentu."
          />

          <CustomerLabelCard
            title="Member"
            description="Customer yang telah mendaftar sebagai anggota dan mungkin mendapatkan promo atau akses khusus."
          />

          <CustomerLabelCard
            title="Dropshiper"
            description="Customer dengan harga normal, tetapi alamat pengiriman memakai data customer dropship."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;
