import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as shopService from "@/lib/services/shop.service";

export const shopKeys = {
  default: ["shop"] as const,
};

export function useShop() {
  return useQuery({
    queryKey: shopKeys.default,
    queryFn: shopService.getDefaultShop,
  });
}

export function useUpdateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => shopService.updateDefaultShop(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopKeys.default });
    },
  });
}
