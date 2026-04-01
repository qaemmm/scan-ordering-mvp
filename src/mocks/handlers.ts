import { delay, http, HttpResponse } from "msw";
import type { CartItem, OrderStatus } from "../types/domain";
import { db } from "./db";

const API = "/api";

export const handlers = [
  http.get(`${API}/stores/:storeId`, async ({ params }) => {
    await delay(250);
    if (params.storeId !== db.store.id) {
      return HttpResponse.json({ message: "Store not found" }, { status: 404 });
    }
    return HttpResponse.json({ store: db.store, tables: db.tables, modes: db.store.supportModes });
  }),

  http.get(`${API}/users/me/addresses`, async () => {
    await delay(200);
    return HttpResponse.json({ addresses: db.addresses });
  }),

  http.get(`${API}/stores/:storeId/menu`, async ({ params }) => {
    await delay(250);
    if (params.storeId !== db.store.id) {
      return HttpResponse.json({ message: "Store not found" }, { status: 404 });
    }
    return HttpResponse.json(db.menu);
  }),

  http.post(`${API}/cart/validate`, async () => {
    await delay(150);
    return HttpResponse.json({ ok: true });
  }),

  http.get(`${API}/checkout/options`, async () => {
    await delay(200);
    return HttpResponse.json({ coupons: db.coupons, paymentMethods: db.paymentMethods });
  }),

  http.post(`${API}/orders`, async ({ request }) => {
    await delay(400);
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
    await delay(300);
    const body = (await request.json()) as { orderId: string };
    return HttpResponse.json({ payToken: `token_${body.orderId}` });
  }),

  http.post(`${API}/payments/confirm`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { orderId: string; simulateCancel?: boolean };
    if (body.simulateCancel) {
      return HttpResponse.json({ message: "支付已取消" }, { status: 409 });
    }
    const order = db.confirmPayment(body.orderId);
    if (!order) {
      return HttpResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return HttpResponse.json({ ok: true, order });
  }),

  http.get(`${API}/orders/:orderId`, async ({ params }) => {
    await delay(250);
    const order = db.getOrder(String(params.orderId));
    if (!order) {
      return HttpResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return HttpResponse.json({ order });
  }),

  http.get(`${API}/orders/:orderId/timeline`, async ({ params }) => {
    await delay(250);
    return HttpResponse.json({ timeline: db.getTimeline(String(params.orderId)) });
  }),

  http.get(`${API}/merchant/orders`, async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const status = (url.searchParams.get("status") ?? "NEW") as "NEW" | "PREPARING" | "DONE";
    return HttpResponse.json({ orders: db.getMerchantOrders(status) });
  }),

  http.post(`${API}/merchant/orders/:orderId/accept`, async ({ params }) => {
    await delay(250);
    const order = db.merchantAccept(String(params.orderId));
    if (!order) {
      return HttpResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return HttpResponse.json({ order });
  }),

  http.post(`${API}/merchant/orders/:orderId/status`, async ({ request, params }) => {
    await delay(250);
    const body = (await request.json()) as { nextStatus: OrderStatus; reason?: string };
    const order = db.merchantStatus(String(params.orderId), body.nextStatus, body.reason);
    if (!order) {
      return HttpResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return HttpResponse.json({ order });
  }),
];
