import { useCallback, useEffect, useState } from "react";
import {
  getAllOrders,
  getRecentOrders,
  markOrderFulfilled,
} from "../lib/menuApi";

const pageSize = 10;

export function useOrdersDashboard(restaurantId, onError) {
  const [recentOrders, setRecentOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [allOrdersPage, setAllOrdersPage] = useState(0);
  const [allOrdersTotal, setAllOrdersTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allOrdersLoading, setAllOrdersLoading] = useState(false);

  const loadRecentOrders = useCallback(async () => {
    if (!restaurantId) return;
    setLoading(true);
    const { data, error } = await getRecentOrders(restaurantId);
    if (error) onError(error.message);
    else setRecentOrders(data || []);
    setLoading(false);
  }, [onError, restaurantId]);

  const loadAllOrders = useCallback(
    async (page = 0) => {
      if (!restaurantId) return;
      setAllOrdersLoading(true);
      const { data, error, count } = await getAllOrders(
        restaurantId,
        page,
        pageSize,
      );
      if (error) onError(error.message);
      else {
        setAllOrders(data || []);
        setAllOrdersPage(page);
        setAllOrdersTotal(count || 0);
      }
      setAllOrdersLoading(false);
    },
    [onError, restaurantId],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadInitialOrders() {
      if (!restaurantId) return;
      setLoading(true);
      const { data, error } = await getRecentOrders(restaurantId);
      if (cancelled) return;
      if (error) onError(error.message);
      else setRecentOrders(data || []);
      setLoading(false);
    }

    loadInitialOrders();
    return () => {
      cancelled = true;
    };
  }, [onError, restaurantId]);

  async function handleFulfill(orderId) {
    const { error } = await markOrderFulfilled(orderId);
    if (error) {
      onError(error.message);
      return;
    }
    setRecentOrders((orders) => orders.filter((order) => order.id !== orderId));
    setAllOrders((orders) =>
      orders.map((order) =>
        order.id === orderId
          ? { ...order, fulfilled_at: new Date().toISOString() }
          : order,
      ),
    );
  }

  return {
    recentOrders,
    allOrders,
    allOrdersPage,
    allOrdersTotal,
    loading,
    allOrdersLoading,
    loadRecentOrders,
    loadAllOrders,
    handleFulfill,
    pageSize,
  };
}
