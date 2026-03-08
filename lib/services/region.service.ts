import api from "@/lib/api";
import type {
    ApiResponse,
    ApiProvince,
    ApiCity,
    ApiDistrict,
    ApiVillage,
} from "@/types/api";

export async function fetchProvinces(): Promise<ApiProvince[]> {
    const res = await api.get<ApiResponse<ApiProvince[]>>("/regions/provinces");
    return res.data?.responseObject || [];
}

export async function fetchCities(provinceId: string): Promise<ApiCity[]> {
    if (!provinceId) return [];
    const res = await api.get<ApiResponse<ApiCity[]>>(`/regions/cities/${provinceId}`);
    return res.data?.responseObject || [];
}

export async function fetchDistricts(cityId: string): Promise<ApiDistrict[]> {
    if (!cityId) return [];
    const res = await api.get<ApiResponse<ApiDistrict[]>>(`/regions/districts/${cityId}`);
    return res.data?.responseObject || [];
}

export async function fetchVillages(districtId: string): Promise<ApiVillage[]> {
    if (!districtId) return [];
    const res = await api.get<ApiResponse<ApiVillage[]>>(`/regions/villages/${districtId}`);
    return res.data?.responseObject || [];
}
