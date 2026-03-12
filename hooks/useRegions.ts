import { useQuery } from "@tanstack/react-query";
import {
    fetchProvinces,
    fetchCities,
    fetchDistricts,
    fetchVillages,
} from "@/lib/services/region.service";

export function useProvinces() {
    return useQuery({
        queryKey: ["regions", "provinces"],
        queryFn: fetchProvinces,
        staleTime: 1000 * 60 * 60, // 1 hour - provinces don't change often
    });
}

export function useCities(provinceId: string | undefined) {
    return useQuery({
        queryKey: ["regions", "cities", provinceId],
        queryFn: () => fetchCities(provinceId!),
        enabled: !!provinceId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useDistricts(cityId: string | undefined) {
    return useQuery({
        queryKey: ["regions", "districts", cityId],
        queryFn: () => fetchDistricts(cityId!),
        enabled: !!cityId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useVillages(districtId: string | undefined) {
    return useQuery({
        queryKey: ["regions", "villages", districtId],
        queryFn: () => fetchVillages(districtId!),
        enabled: !!districtId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}
