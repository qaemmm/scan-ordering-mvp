import { delay, http, HttpResponse } from "msw";
import type { AiRecommendResponse, CartItem, MenuItem, OrderStatus } from "../types/domain";
import { db } from "./db";

const API = "/api";

function scoreItem(item: MenuItem, query: string) {
  let score = 0;
  const q = query.toLowerCase();

  if (q.includes("招牌") && item.tags.some((tag) => tag.includes("招牌") || tag.includes("推荐"))) score += 4;
  if ((q.includes("清淡") || q.includes("减脂") || q.includes("低卡")) && item.tags.some((tag) => tag.includes("清汤") || tag.includes("解腻"))) score += 4;
  if ((q.includes("两人") || q.includes("双人")) && item.basePrice >= 30) score += 2;
  if ((q.includes("饱") || q.includes("主食")) && item.categoryId === "c_2") score += 3;
  if ((q.includes("小食") || q.includes("配菜")) && item.categoryId === "c_3") score += 3;
  if ((q.includes("喝") || q.includes("饮品")) && item.categoryId === "c_4") score += 3;

  if (score === 0 && item.tags.some((tag) => tag.includes("人气") || tag.includes("推荐"))) score += 1;
  return score;
}

function buildAiRecommendation(query: string): AiRecommendResponse {
  const items = db.menu.items
    .map((item) => ({ item, score: scoreItem(item, query) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item);

  const fallback = ["p_101", "p_201", "p_401"];
  const picks = (items.length ? items : db.menu.items.filter((item) => fallback.includes(item.id))).map((item) => ({
    productId: item.id,
    reason: item.tags.includes("招牌")
      ? "这款是本店招牌，出单稳定、复购高。"
      : item.tags.includes("清汤")
        ? "口味清爽，适合想吃得轻一点。"
        : `搭配 ${item.tags[0]} 风味，和主餐组合更完整。`,
  }));

  const answer =
    query.trim().length === 0
      ? "先试试招牌鲜虾云吞汤，再配一杯冻柠茶，组合稳妥。"
      : `根据“${query}”给你推荐了 ${picks.length} 个更合适的选项，可直接加购。`;

  return {
    answer,
    picks,
    suggestedQuestions: [
      "本店招牌是什么？",
      "两个人怎么点更稳妥？",
      "想吃清淡一点，推荐什么？",
    ],
  };
}

export const handlers = [
  http.get(`${API}/stores/:storeId`, async ({ params }) => {
    await delay(250);
    if (params.storeId !== db.store.id) {
      return HttpResponse.json({ message: "门店不存在" }, { status: 404 });
    }
    return HttpResponse.json({ store: db.store, tables: db.tables, modes: db.store.supportModes });
  }),

  http.get(`${API}/users/me/addresses`, async () => {
    await delay(180);
    return HttpResponse.json({ addresses: db.addresses });
  }),

  http.get(`${API}/stores/:storeId/menu`, async ({ params }) => {
    await delay(240);
    if (params.storeId !== db.store.id) {
      return HttpResponse.json({ message: "门店不存在" }, { status: 404 });
    }
    return HttpResponse.json(db.menu);
  }),

  http.post(`${API}/cart/validate`, async () => {
    await delay(120);
    return HttpResponse.json({ ok: true });
  }),

  http.post(`${API}/ai/recommend`, async ({ request }) => {
    await delay(160);
    const body = (await request.json()) as { query?: string };
    return HttpResponse.json(buildAiRecommendation(body.query ?? ""));
  }),

  http.get(`${API}/checkout/options`, async () => {
    await delay(200);
    return HttpResponse.json({ coupons: db.coupons, paymentMethods: db.paymentMethods });
  }),

  http.post(`${API}/orders`, async ({ request }) => {
    await delay(320);
    const body = (await request.json()) as {
      mode: "DINE_IN" | "DELIVERY" | "PICKUP";
      addressId?: string;
      tableNo?: string;
      pickupTime?: string;
      items: CartItem[];
      deliveryFee: number;
      discount: number;
      totalAmount: number;
      payableAmount: number;
      note?: string;
    };

    if (!body.items.length) {
      return HttpResponse.json({ message: "购物车不能为空" }, { status: 400 });
    }

    const order = db.createOrder(body);
    return HttpResponse.json({ orderId: order.id, order });
  }),

  http.post(`${API}/payments/create`, async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as { orderId: string };
    return HttpResponse.json({ payToken: `token_${body.orderId}` });
  }),

  http.post(`${API}/payments/confirm`, async ({ request }) => {
    await delay(260);
    const body = (await request.json()) as { orderId: string; simulateCancel?: boolean };
    if (body.simulateCancel) {
      return HttpResponse.json({ message: "支付已取消（演示）" }, { status: 409 });
    }

    const order = db.confirmPayment(body.orderId);
    if (!order) {
      return HttpResponse.json({ message: "订单不存在" }, { status: 404 });
    }

    return HttpResponse.json({ ok: true, order });
  }),

  http.get(`${API}/orders/:orderId`, async ({ params }) => {
    await delay(220);
    const order = db.getOrder(String(params.orderId));
    if (!order) {
      return HttpResponse.json({ message: "订单不存在" }, { status: 404 });
    }
    return HttpResponse.json({ order });
  }),

  http.get(`${API}/orders/:orderId/timeline`, async ({ params }) => {
    await delay(220);
    return HttpResponse.json({ timeline: db.getTimeline(String(params.orderId)) });
  }),

  http.get(`${API}/merchant/orders`, async ({ request }) => {
    await delay(220);
    const url = new URL(request.url);
    const status = (url.searchParams.get("status") ?? "NEW") as "NEW" | "PREPARING" | "DONE";
    return HttpResponse.json({ orders: db.getMerchantOrders(status) });
  }),

  http.post(`${API}/merchant/orders/:orderId/accept`, async ({ params }) => {
    await delay(200);
    const order = db.merchantAccept(String(params.orderId));
    if (!order) {
      return HttpResponse.json({ message: "订单不存在" }, { status: 404 });
    }
    return HttpResponse.json({ order });
  }),

  http.post(`${API}/merchant/orders/:orderId/status`, async ({ request, params }) => {
    await delay(200);
    const body = (await request.json()) as { nextStatus: OrderStatus; reason?: string };
    const order = db.merchantStatus(String(params.orderId), body.nextStatus, body.reason);
    if (!order) {
      return HttpResponse.json({ message: "订单不存在" }, { status: 404 });
    }
    return HttpResponse.json({ order });
  }),
];
