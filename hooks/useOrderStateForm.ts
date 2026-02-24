"use client";

import { useState, useMemo, useEffect } from "react";
import { useSalesChannels } from "@/hooks/useSalesChannels";
import { useCustomers } from "@/hooks/useCustomers";
import { useProducts } from "@/hooks/useProducts";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { useDeliveryPlaces } from "@/hooks/useDeliveryPlaces";
import { useCreateOrder, useUpdateOrder, useOrder } from "@/hooks/useOrders";
import { useCalculateShippingCost } from "@/hooks/useShippingCost";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { OrderCreatePayload, ApiCustomer, ApiProductListItem, ApiDeliveryPlace } from "@/types/api";
import type { ShippingOption } from "@/types/api";
import { calculateOrderDiscount, calculateProductSubtotal, getPriceForCustomer } from "@/lib/utils";
import type { OrderProductItem, OrderFormProps } from "../types/index";


export function useOrderForm({ mode = "create", orderId }: OrderFormProps) {
    const router = useRouter();
    const { toast } = useToast();

    // Selected shipping option state
    const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
    const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
    const [selectedShippingType, setSelectedShippingType] = useState<"reguler" | "cargo" | "instant">("reguler");
    const [shippingMode, setShippingMode] = useState<"none" | "free" | "calculate" | "manual">("none");
    const [manualShippingCourier, setManualShippingCourier] = useState("");
    const [manualShippingCost, setManualShippingCost] = useState(0);

    // Order products state
    const [orderProducts, setOrderProducts] = useState<OrderProductItem[]>([]);
    const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);

    // Optional fees state
    const [showDiscount, setShowDiscount] = useState(false);
    const [showInsurance, setShowInsurance] = useState(false);
    const [showShippingDiscount, setShowShippingDiscount] = useState(false);
    const [orderDiscount, setOrderDiscount] = useState(0);
    const [orderDiscountType, setOrderDiscountType] = useState<"percent" | "nominal">("nominal");
    const [insurance, setInsurance] = useState(0);
    const [shippingDiscount, setShippingDiscount] = useState(0); // per 1kg
    const [installmentAmount, setInstallmentAmount] = useState(0); 

    // Search states for server-side filtering
    const [customerSearch, setCustomerSearch] = useState("");
    const [productSearch, setProductSearch] = useState("");

    // API hooks for dropdown data with search params
    const { data: salesChannelsData, isLoading: loadingSalesChannels } = useSalesChannels();
    // Pass search to hooks. Limit is default (50)
    const { data: customersData, isLoading: loadingCustomers } = useCustomers({ search: customerSearch });
    const { data: productsData, isLoading: loadingProducts } = useProducts({ search: productSearch });
    const { data: paymentMethodsData, isLoading: loadingPaymentMethods } = usePaymentMethods();
    const { data: deliveryPlacesData, isLoading: loadingDeliveryPlaces } = useDeliveryPlaces();

    // Ensure data is always an array
    const salesChannels = Array.isArray(salesChannelsData) ? salesChannelsData : [];
    const customers = Array.isArray(customersData) ? customersData : [];
    const products = Array.isArray(productsData) ? productsData : [];
    const paymentMethods = Array.isArray(paymentMethodsData) ? paymentMethodsData : [];
    const deliveryPlaces = Array.isArray(deliveryPlacesData) ? deliveryPlacesData : [];

    // Mutation hooks
    const createOrder = useCreateOrder();
    const updateOrder = useUpdateOrder();
    const calculateShipping = useCalculateShippingCost();

    // Fetch existing order data for edit mode
    const { data: existingOrder, isLoading: loadingOrder } = useOrder(
        mode === "edit" && orderId ? orderId : ""
    );

    const isSubmitting = createOrder.isPending || updateOrder.isPending;

    // Selected customer states
    const [ordererId, setOrdererId] = useState("");
    const [receiverId, setReceiverId] = useState("");
    const [deliveryPlaceId, setDeliveryPlaceId] = useState("");
    const [salesChannelId, setSalesChannelId] = useState("");
    const [paymentMethodId, setPaymentMethodId] = useState("");
    const [paymentStatus, setPaymentStatus] = useState<"belum_dibayar" | "cicilan" | "lunas" | "dibatalkan">("belum_dibayar");
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split("T")[0]);
    const [note, setNote] = useState("");
    const [receiptNumber, setReceiptNumber] = useState("");

    // Populate form with existing order data when in edit mode
    useEffect(() => {
        if (mode === "edit" && existingOrder && customers.length > 0 && products.length > 0) {
            // Set basic order info
            setOrdererId(existingOrder.OrdererCustomer?.id || "");
            setReceiverId(existingOrder.DeliveryTargetCustomer?.id || "");
            setDeliveryPlaceId(existingOrder.DeliveryPlace?.id || "");
            setSalesChannelId(existingOrder.SalesChannel?.id || "");

            // Set order detail info
            const orderDetail = existingOrder.OrderDetail;
            if (orderDetail) {
                setPaymentMethodId(orderDetail.PaymentMethod?.id || orderDetail.paymentMethodId || "");

                // Map payment status
                const status = orderDetail.paymentStatus;
                if (status === "SETTLEMENT") setPaymentStatus("lunas");
                else if (status === "CANCEL") setPaymentStatus("dibatalkan");
                else setPaymentStatus("belum_dibayar");

                setReceiptNumber(orderDetail.receiptNumber || "");

                // Set fees
                const otherFees = orderDetail.otherFees;
                if (otherFees) {
                    setInsurance(otherFees.insurance || 0);
                    if (otherFees.discount) {
                        setShowDiscount(true);
                        setOrderDiscount(otherFees.discount.value || 0);
                        setOrderDiscountType(otherFees.discount.type || "nominal");
                    }

                    // Set installment data from otherFees
                    if (otherFees.installments) {
                        setInstallmentAmount(otherFees.installments.amount || 0);
                        setPaymentStatus("cicilan");
                    }

                    // Set shipping cost from otherFees
                    if (otherFees.shippingCost) {
                        const shippingCostData = otherFees.shippingCost;
                        const calculatedTypes = ["reguler", "cargo", "instant"];

                        if (shippingCostData.type === "manual") {
                            setShippingMode("manual");
                            setManualShippingCourier(shippingCostData.shippingService || "");
                            setManualShippingCost(shippingCostData.cost || 0);
                        } else if (shippingCostData.type === "free") {
                            setShippingMode("free");
                        } else if (calculatedTypes.includes(shippingCostData.type)) {
                            // Raja Ongkir calculated shipping — restore as calculate mode
                            setShippingMode("calculate");
                            setSelectedShippingType(shippingCostData.type as "reguler" | "cargo" | "instant");
                        } else {
                            // Unknown type fallback — treat as manual
                            setShippingMode("manual");
                            setManualShippingCourier(shippingCostData.shippingService || "");
                            setManualShippingCost(shippingCostData.cost || 0);
                        }
                    }
                }
            }

            // Set shipping from ShippingServices if available
            const shippingServices = existingOrder.ShippingServices;
            if (shippingServices && shippingServices.length > 0) {
                const firstShipping = shippingServices[0];
                const calculatedTypes = ["reguler", "cargo", "instant"];

                if (firstShipping.type === "free" || firstShipping.shippingCost === 0) {
                    setShippingMode("free");
                } else if (calculatedTypes.includes(firstShipping.type)) {
                    // Raja Ongkir — restore calculate mode with synthetic ShippingOption
                    setShippingMode("calculate");
                    setSelectedShippingType(firstShipping.type as "reguler" | "cargo" | "instant");

                    const syntheticOption: ShippingOption = {
                        shipping_name: firstShipping.shippingName || "",
                        service_name: firstShipping.serviceName || "",
                        shipping_cost: firstShipping.shippingCost || 0,
                        shipping_cost_net: firstShipping.shippingCostNet ?? firstShipping.shippingCost ?? 0,
                        shipping_cashback: firstShipping.shippingCashback ?? 0,
                        etd: firstShipping.etd || "-",
                        is_cod: firstShipping.isCod ?? false,
                        service_fee: firstShipping.serviceFee ?? 0,
                        net_income: firstShipping.netIncome ?? 0,
                        grandtotal: firstShipping.grandtotal ?? 0,
                        weight: firstShipping.weight ?? totalWeight,
                    };
                    setShippingOptions([syntheticOption]);
                    setSelectedShipping(syntheticOption);
                } else {
                    // Manual / unknown — fallback to manual
                    setShippingMode("manual");
                    setManualShippingCourier(`${firstShipping.shippingName} - ${firstShipping.serviceName}`);
                    setManualShippingCost(firstShipping.shippingCost || 0);
                }
            }

            // Set order date
            if (existingOrder.orderDate) {
                setOrderDate(new Date(existingOrder.orderDate).toISOString().split("T")[0]);
            }
            setNote(existingOrder.note || "");

            // Set order products
            const existingProducts = orderDetail?.OrderProducts || [];
            if (existingProducts.length > 0) {
                const mappedProducts: OrderProductItem[] = existingProducts.map((op) => {
                    // Find product data to get weight and price
                    const productData = products.find(p => p.product.id === op.productId);
                    const variantData = productData?.variant.find(v => v.id === op.productVariantId);
                    const customerCategory = customers.find(c => c.id === existingOrder.OrdererCustomer?.id)?.category;

                    // Inline price calculation
                    let price = 0;
                    if (productData?.price) {
                        switch (customerCategory) {
                            case "RESELLER":
                                price = productData.price.reseller;
                                break;
                            case "AGENT":
                                price = productData.price.agent;
                                break;
                            case "MEMBER":
                                price = productData.price.member;
                                break;
                            default:
                                price = productData.price.normal;
                        }
                    }

                    return {
                        productId: op.productId,
                        variantId: op.productVariantId || variantData?.id || "",
                        productName: productData?.product.name || "Unknown Product",
                        variantInfo: variantData ? `${variantData.size || ""} ${variantData.color || ""}`.trim() : "",
                        quantity: op.productQty,
                        price: price,
                        weight: productData?.product.weight || 0,
                        discount: 0,
                        discountType: "nominal" as const,
                        subtotal: price * op.productQty,
                    };
                });
                setOrderProducts(mappedProducts);
            }
        }
    }, [mode, existingOrder, customers, products]);

    // Get selected customer for price calculation and shipping
    const selectedOrderer = customers.find((c) => c.id === ordererId);
    // Receiver is strictly from "Dikirim Kepada" field - no fallback
    const selectedReceiver = customers.find((c) => c.id === receiverId);
    const selectedDeliveryPlace = deliveryPlaces.find((dp) => dp.id === deliveryPlaceId);

    // Add product to order
    const handleAddProduct = (product: ApiProductListItem, variantId: string) => {
        const variant = product.variant.find((v) => v.id === variantId);
        if (!variant) return;

        const price = getPriceForCustomer(product.price, selectedOrderer?.category);

        // Check if product already exists
        const existingIndex = orderProducts.findIndex(
            (p) => p.productId === product.product.id && p.variantId === variantId
        );

        if (existingIndex >= 0) {
            // Increase quantity
            const updated = [...orderProducts];
            updated[existingIndex].quantity += 1;
            updated[existingIndex].subtotal = calculateProductSubtotal(updated[existingIndex]);
            setOrderProducts(updated);
            toast({
                title: "Produk ditambahkan",
                description: `Qty ${product.product.name} ditambah menjadi ${updated[existingIndex].quantity}`,
                variant: "success",
            });
        } else {
            // Add new product
            const newProduct: OrderProductItem = {
                productId: product.product.id,
                variantId: variantId,
                productName: product.product.name,
                variantInfo: `${variant.size} - ${variant.color}`,
                price: price,
                quantity: 1,
                weight: product.product.weight,
                discount: 0,
                discountType: "nominal",
                subtotal: price,
            };
            setOrderProducts([...orderProducts, newProduct]);
            toast({
                title: "Produk ditambahkan",
                description: product.product.name,
                variant: "success",
            });
        }
    };

    // Update product
    const updateProduct = (index: number, updates: Partial<OrderProductItem>) => {
        const updated = [...orderProducts];
        updated[index] = { ...updated[index], ...updates };
        updated[index].subtotal = calculateProductSubtotal(updated[index]);
        setOrderProducts(updated);
    };

    // Remove product
    const removeProduct = (index: number) => {
        setOrderProducts(orderProducts.filter((_, i) => i !== index));
    };

    // Calculate totals
    const totalWeight = orderProducts.reduce((sum, p) => sum + (p.weight * p.quantity), 0);
    const subtotal = orderProducts.reduce((sum, p) => sum + p.subtotal, 0);

    const effectiveShippingCost = useMemo(() => {
        if (shippingMode === "free") return 0;
        if (shippingMode === "manual") return manualShippingCost;
        if (shippingMode === "calculate" && selectedShipping) {
            // Apply shipping discount per kg
            const weightInKg = totalWeight / 1000;
            const discount = shippingDiscount * weightInKg;
            return Math.max(0, selectedShipping.shipping_cost - discount);
        }
        return 0;
    }, [shippingMode, manualShippingCost, selectedShipping, totalWeight, shippingDiscount]);

    const grandTotal = subtotal - calculateOrderDiscount(orderDiscount, subtotal, orderDiscountType) + insurance + effectiveShippingCost;

    // Calculate shipping
    const handleCalculateShipping = async () => {
        // Validate receiver is selected (from "Dikirim Kepada" field) - NO FALLBACK
        if (!selectedReceiver) {
            toast({
                title: "Data tidak lengkap",
                description: "Pilih penerima di field 'Dikirim Kepada' terlebih dahulu",
                variant: "destructive",
            });
            return;
        }

        if (!selectedDeliveryPlace) {
            toast({
                title: "Data tidak lengkap",
                description: "Pilih lokasi pengiriman di field 'Pengiriman Dari' terlebih dahulu",
                variant: "destructive",
            });
            return;
        }

        if (!selectedReceiver.destinationId) {
            toast({
                title: "Data penerima tidak lengkap",
                description: `${selectedReceiver.name} tidak memiliki data destinasi pengiriman. Silakan update data customer terlebih dahulu.`,
                variant: "destructive",
            });
            return;
        }

        if (totalWeight <= 0) {
            toast({
                title: "Berat tidak valid",
                description: "Tambahkan produk terlebih dahulu",
                variant: "destructive",
            });
            return;
        }

        try {
            const result = await calculateShipping.mutateAsync({
                shipper_destination_id: selectedDeliveryPlace.destinationId,
                receiver_destination_id: selectedReceiver.destinationId,
                weight: totalWeight, // dalam gram (sesuai requirement)
                item_value: subtotal,
                cod: "no",
            });

            let options: ShippingOption[] = [];
            if (selectedShippingType === "reguler") {
                options = result.calculate_reguler || [];
            } else if (selectedShippingType === "cargo") {
                options = result.calculate_cargo || [];
            } else {
                options = result.calculate_instant || [];
            }

            setShippingOptions(options);
            setShippingMode("calculate");

            if (options.length === 0) {
                toast({
                    title: "Tidak ada layanan tersedia",
                    description: "Tidak ada layanan pengiriman untuk rute ini",
                    variant: "default",
                });
            } else {
                toast({
                    title: "Berhasil",
                    description: `Ditemukan ${options.length} opsi pengiriman`,
                    variant: "success",
                });
            }
        } catch (error) {
            toast({
                title: "Gagal menghitung ongkir",
                description: error instanceof Error ? error.message : "Terjadi kesalahan",
                variant: "destructive",
            });
        }
    };

    const handleSubmit = async () => {
        if (!ordererId) {
            toast({ title: "Error", description: "Pilih pemesan", variant: "destructive" });
            return;
        }

        if (!salesChannelId) {
            toast({ title: "Error", description: "Pilih sales channel", variant: "destructive" });
            return;
        }

        if (orderProducts.length === 0) {
            toast({ title: "Error", description: "Tambahkan minimal 1 produk", variant: "destructive" });
            return;
        }

        if (!selectedShipping) {
            toast({ title: "Error", description: "Pilih jasa pengiriman", variant: "destructive" });
            return;
        }

        try {
            /* =========================
            * otherFees (WAJIB LENGKAP)
            * ========================= */
            const otherFees = {
                packaging: 0,
                insurance: insurance ?? 0,
                weight: totalWeight,

                shippingCost: {
                    shippingService: selectedShipping.shipping_name,
                    cost: selectedShipping.shipping_cost,
                    type: selectedShippingType,
                },
            } as OrderCreatePayload["orderDetail"]["detail"]["otherFees"];

            // Order discount
            if (orderDiscount > 0) {
                otherFees.discount = {
                    value: orderDiscount,
                    type: orderDiscountType,
                };
            }

            // Product discount
            const productDiscount = orderProducts
                .filter(p => p.discount > 0)
                .map(p => ({
                    produkVariantId: p.variantId,
                    discountAmount: p.discount,
                    discountType: p.discountType,
                }));

            if (productDiscount.length > 0) {
                otherFees.productDiscount = productDiscount;
            }

            // Installments (optional by contract)
            if (installmentAmount > 0) {
                otherFees.installments = {
                    paymentMethodId: paymentMethodId,
                    paymentDate: new Date(orderDate).toISOString(),
                    amount: installmentAmount ?? 0,
                };
            }

            /* =========================
            * PAYLOAD (STRICT)
            * ========================= */
            const payload: OrderCreatePayload = {
                order: {
                    ordererCustomerId: ordererId,
                    deliveryTargetCustomerId: receiverId || ordererId,
                    deliveryPlaceId,
                    salesChannelId,
                    orderDate: new Date(orderDate).toISOString(),
                    note,
                },
                orderDetail: {
                    detail: {
                        originalFinalPrice: subtotal,
                        otherFees,
                        receiptNumber: receiptNumber || undefined,
                    },
                    paymentMethod: {
                        id: paymentMethodId,
                        status:
                            paymentStatus === "lunas"
                                ? "SETTLEMENT"
                                : paymentStatus === "dibatalkan"
                                    ? "CANCEL"
                                    : "PENDING",
                        date: new Date(orderDate).toISOString(),
                    },
                    orderProducts: orderProducts.map(p => ({
                        productId: p.productId,
                        productVariantId: p.variantId,
                        productQty: p.quantity,
                        productPrice: p.price,
                    })),
                    shippingServices: [
                        {
                            shippingName: selectedShipping.shipping_name,
                            serviceName: selectedShipping.service_name,
                            weight: totalWeight,
                            isCod: selectedShipping.is_cod ?? false,
                            shippingCost: selectedShipping.shipping_cost,
                            shippingCashback: selectedShipping.shipping_cashback ?? 0,
                            shippingCostNet: selectedShipping.shipping_cost_net ?? selectedShipping.shipping_cost,
                            grandtotal: grandTotal,
                            serviceFee: selectedShipping.service_fee ?? 0,
                            netIncome: selectedShipping.net_income ?? grandTotal,
                            etd: selectedShipping.etd ?? "-",
                            type: selectedShippingType,
                        },
                    ],
                },
            };

            // @debug — commented for production
            // console.log("=== ORDER SUBMIT PAYLOAD (STRICT) ===");
            // console.log(JSON.stringify(payload, null, 2));

            if (mode === "edit" && orderId) {
                await updateOrder.mutateAsync({ id: orderId, payload });
                toast({ title: "Berhasil", description: "Order berhasil diperbarui", variant: "success" });
            } else {
                await createOrder.mutateAsync(payload);
                toast({ title: "Berhasil", description: "Order berhasil dibuat", variant: "success" });
            }

            router.push("/orders");
        } catch (error) {
            toast({
                title: "Gagal",
                description: error instanceof Error ? error.message : "Terjadi kesalahan",
                variant: "destructive",
        });
    }
};

    return {
        // Mode
        mode,

        // Router
        router,

        // Shipping state
        selectedShipping,
        setSelectedShipping,
        shippingOptions,
        setShippingOptions,
        selectedShippingType,
        setSelectedShippingType,
        shippingMode,
        setShippingMode,
        manualShippingCourier,
        setManualShippingCourier,
        manualShippingCost,
        setManualShippingCost,

        // Order products state
        orderProducts,
        setOrderProducts,
        editingProductIndex,
        setEditingProductIndex,

        // Optional fees state
        showDiscount,
        setShowDiscount,
        showInsurance,
        setShowInsurance,
        showShippingDiscount,
        setShowShippingDiscount,
        orderDiscount,
        setOrderDiscount,
        orderDiscountType,
        setOrderDiscountType,
        insurance,
        setInsurance,
        shippingDiscount,
        setShippingDiscount,
        installmentAmount,
        setInstallmentAmount,

        // Search states
        customerSearch,
        setCustomerSearch,
        productSearch,
        setProductSearch,

        // Data arrays
        salesChannels,
        customers,
        products,
        paymentMethods,
        deliveryPlaces,

        // Loading states
        loadingSalesChannels,
        loadingCustomers,
        loadingProducts,
        loadingPaymentMethods,
        loadingDeliveryPlaces,
        loadingOrder,

        // Mutation states
        isSubmitting,
        calculateShipping,

        // Selected entities
        ordererId,
        setOrdererId,
        receiverId,
        setReceiverId,
        deliveryPlaceId,
        setDeliveryPlaceId,
        salesChannelId,
        setSalesChannelId,
        paymentMethodId,
        setPaymentMethodId,
        paymentStatus,
        setPaymentStatus,
        orderDate,
        setOrderDate,
        note,
        setNote,
        receiptNumber,
        setReceiptNumber,

        // Derived / selected
        selectedOrderer,
        selectedReceiver,
        selectedDeliveryPlace,

        // Computed values
        totalWeight,
        subtotal,
        effectiveShippingCost,
        grandTotal,

        // Handlers
        handleAddProduct,
        updateProduct,
        removeProduct,
        handleCalculateShipping,
        handleSubmit,
    };
}

export type UseOrderFormReturn = ReturnType<typeof useOrderForm>;
