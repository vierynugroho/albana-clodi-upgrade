import { useMutation } from "@tanstack/react-query";
import * as shippingService from "@/lib/services/shipping.service";

export function useCalculateShippingCost() {
    return useMutation({
        mutationFn: (params: shippingService.ShippingCostParams) =>
            shippingService.calculateShippingCost(params),
    });
}
