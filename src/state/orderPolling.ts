import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Order, TimelineEvent } from "../types/domain";

type OrderResponse = { order: Order };
type TimelineResponse = { timeline: TimelineEvent[] };

export function useOrderPolling(orderId?: string, intervalMs = 4000) {
  const [order, setOrder] = useState<Order | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    let timer: number | null = null;
    let disposed = false;

    const pull = async () => {
      try {
        const [orderRes, timelineRes] = await Promise.all([
          api.get<OrderResponse>(`/api/orders/${orderId}`),
          api.get<TimelineResponse>(`/api/orders/${orderId}/timeline`),
        ]);
        if (!disposed) {
          setOrder(orderRes.order);
          setTimeline(timelineRes.timeline);
          setError(null);
        }
      } catch (err) {
        if (!disposed) {
          setError(err instanceof Error ? err.message : "加载失败");
        }
      } finally {
        if (!disposed) setLoading(false);
      }
    };

    void pull();
    timer = window.setInterval(() => void pull(), intervalMs);

    return () => {
      disposed = true;
      if (timer) window.clearInterval(timer);
    };
  }, [orderId, intervalMs]);

  return { order, timeline, loading, error };
}
