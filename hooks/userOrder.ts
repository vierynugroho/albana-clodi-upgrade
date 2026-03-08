// hooks/useOrder.ts
import useSWR from 'swr';
import apiClient from '@/lib/api';
import type { Order } from '@/types';

export function useOrders() {
  const { data, error, mutate } = useSWR<Order[]>(
    '/orders',
    (url) => apiClient.get(url).then((res) => res.data)
  );

  const createOrder = async (order: Partial<Order>) => {
    await apiClient.post('/orders', order);
    mutate();
  };

  const updateOrder = async (id: string, order: Partial<Order>) => {
    await apiClient.put(`/orders/${id}`, order);
    mutate();
  };

  const deleteOrder = async (id: string) => {
    await apiClient.delete(`/orders/${id}`);
    mutate();
  };

  return {
    orders: data,
    isLoading: !error && !data,
    isError: error,
    createOrder,
    updateOrder,
    deleteOrder,
  };
}