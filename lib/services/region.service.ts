// lib/services/region.service.ts
import api from "@/lib/api";
import type {
    ApiResponse,
    ApiProvince,
    ApiCity,
    ApiDistrict,
    ApiVillage,
} from "@/types/api";

/**
 * Fetch all provinces
 * GET /regions/provinces
 */
export async function fetchProvinces(): Promise<ApiProvince[]> {
    const res = await api.get<ApiResponse<ApiProvince[]>>("/regions/provinces");
    return res.data?.responseObject || [];
}

/**
 * Fetch cities by province ID
 * GET /regions/cities/{provinceId}
 */
export async function fetchCities(provinceId: string): Promise<ApiCity[]> {
    if (!provinceId) return [];
    const res = await api.get<ApiResponse<ApiCity[]>>(`/regions/cities/${provinceId}`);
    return res.data?.responseObject || [];
}

/**
 * Fetch districts by city ID
 * GET /regions/districts/{cityId}
 */
export async function fetchDistricts(cityId: string): Promise<ApiDistrict[]> {
    if (!cityId) return [];
    const res = await api.get<ApiResponse<ApiDistrict[]>>(`/regions/districts/${cityId}`);
    return res.data?.responseObject || [];
}

/**
 * Fetch villages by district ID
 * GET /regions/villages/{districtId}
 */
export async function fetchVillages(districtId: string): Promise<ApiVillage[]> {
    if (!districtId) return [];
    const res = await api.get<ApiResponse<ApiVillage[]>>(`/regions/villages/${districtId}`);
    return res.data?.responseObject || [];
}
