// hooks/useRegions.ts
import { useQuery } from "@tanstack/react-query";
import {
    fetchProvinces,
    fetchCities,
    fetchDistricts,
    fetchVillages,
} from "@/lib/services/region.service";

/**
 * Hook to fetch all provinces
 * Fetches on mount
 */
export function useProvinces() {
    return useQuery({
        queryKey: ["regions", "provinces"],
        queryFn: fetchProvinces,
        staleTime: 1000 * 60 * 60, // 1 hour - provinces don't change often
    });
}

/**
 * Hook to fetch cities by province ID
 * Only fetches when provinceId is provided
 */
export function useCities(provinceId: string | undefined) {
    return useQuery({
        queryKey: ["regions", "cities", provinceId],
        queryFn: () => fetchCities(provinceId!),
        enabled: !!provinceId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

/**
 * Hook to fetch districts by city ID
 * Only fetches when cityId is provided
 */
export function useDistricts(cityId: string | undefined) {
    return useQuery({
        queryKey: ["regions", "districts", cityId],
        queryFn: () => fetchDistricts(cityId!),
        enabled: !!cityId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

/**
 * Hook to fetch villages by district ID
 * Only fetches when districtId is provided
 */
export function useVillages(districtId: string | undefined) {
    return useQuery({
        queryKey: ["regions", "villages", districtId],
        queryFn: () => fetchVillages(districtId!),
        enabled: !!districtId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}
