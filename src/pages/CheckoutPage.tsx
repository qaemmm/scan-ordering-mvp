import { Button, Card, List, TextArea, Toast } from "antd-mobile";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { CouponSelector } from "../components/checkout/CouponSelector";
import { PaymentMethodSelector } from "../components/checkout/PaymentMethodSelector";
import { getCartTotal, useCartStore } from "../state/cart";
import { useSessionStore } from "../state/session";
import type { Coupon, PaymentMethod } from "../types/domain";

type CheckoutOptionsRes = { coupons: Coupon[]; paymentMethods: PaymentMethod[] };

export function CheckoutPage() {
  const navigate = useNavigate();
  const { storeId = "s_1001" } = useParams();
  const session = useSessionStore();
  const { items, clear, hydrated } = useCartStore();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [couponId, setCouponId] = useState<string | undefined>(undefined);
  const [methodId, setMethodId] = useState<string>("PAY_AT_STORE");
  const [note, setNote] = useState("");
  const [couponVisible, setCouponVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!hydrated) return;

    if (!items.length) {
      Toast.show({ content: "购物车为空，请先选菜", duration: 1200 });
      navigate(`/store/${storeId}/menu`);
      return;
    }

    void (async () => {
      const res = await api.get<CheckoutOptionsRes>("/api/checkout/options");
      setCoupons(res.coupons);
      setMethods(res.paymentMethods);
      setMethodId(res.paymentMethods[0]?.id ?? "PAY_AT_STORE");
    })();
  }, [hydrated, items.length, navigate, storeId]);

  const total = getCartTotal(items);
  const deliveryFee = session.mode === "DELIVERY" ? 6 : 0;
  const selectedCoupon = coupons.find((coupon) => coupon.id === couponId);
  const discount = selectedCoupon && total >= selectedCoupon.threshold ? selectedCoupon.discount : 0;
  const payable = Math.max(0, total + deliveryFee - discount);

  const submit = async () => {
    if (!items.length) {
      Toast.show({ content: "购物车不能为空" });
      return;
    }

    setSubmitting(true);
    let currentOrderId = "";

    try {
      const orderRes = await api.post<{ orderId: string }>("/api/orders", {
        mode: session.mode,
        addressId: session.addressId,
        tableNo: session.tableNo,
        pickupTime: session.pickupTime,
        items,
        deliveryFee,
        discount,
        totalAmount: total,
        payableAmount: payable,
        note,
      });

      currentOrderId = orderRes.orderId;
      await api.post("/api/payments/create", { orderId: orderRes.orderId, methodId });
      await api.post("/api/payments/confirm", { orderId: orderRes.orderId, simulateCancel: false });

      clear();
      Toast.show({ content: "下单成功", duration: 1200 });
      navigate(`/orders/${orderRes.orderId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "下单失败";
      Toast.show({ content: message });
      if (currentOrderId) {
        navigate(`/orders/${currentOrderId}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="mobile-page page-checkout center">
        <p className="muted">正在恢复购物车...</p>
      </div>
    );
  }

  return (
    <div className="mobile-page page-checkout">
      <div className="hero-banner compact">
        <p className="hero-kicker">CHECKOUT</p>
        <h2>确认并提交订单</h2>
      </div>

      <Card title="订单信息">
        {session.mode === "DELIVERY" && <p>地址：{session.addressId ?? "未选择"}</p>}
        {session.mode === "DINE_IN" && <p>桌号：{session.tableNo ?? "未选择"}</p>}
        {session.mode === "PICKUP" && <p>自取时间：{session.pickupTime ?? "未选择"}</p>}
      </Card>

      <Card title="商品明细">
        <List>
          {items.map((item) => (
            <List.Item key={item.id} description={`${item.specName} x${item.qty}`}>
              {item.productName} · HK${item.subtotal.toFixed(2)}
            </List.Item>
          ))}
        </List>
      </Card>

      <Card title="优惠券">
        <Button onClick={() => setCouponVisible(true)}>
          {selectedCoupon ? selectedCoupon.title : "选择优惠券"}
        </Button>
      </Card>

      <Card title="支付方式（演示口径）">
        <PaymentMethodSelector methods={methods} mode={session.mode} value={methodId} onChange={setMethodId} />
        <p className="muted" style={{ marginTop: 8 }}>
          首版仅做支付能力预留，不接入本地真实支付通道。
        </p>
      </Card>

      <Card title="备注">
        <TextArea value={note} onChange={setNote} placeholder="例如：不要香菜、少冰" maxLength={80} />
      </Card>

      <Card title="金额明细">
        <p>商品总价：HK${total.toFixed(2)}</p>
        <p>配送费：HK${deliveryFee.toFixed(2)}</p>
        <p>优惠：-HK${discount.toFixed(2)}</p>
        <h3>应付：HK${payable.toFixed(2)}</h3>
      </Card>

      <Button block color="primary" loading={submitting} onClick={submit}>
        提交订单（演示）
      </Button>

      <CouponSelector
        visible={couponVisible}
        coupons={coupons}
        selectedId={couponId}
        amount={total}
        onClose={() => setCouponVisible(false)}
        onSelect={(id) => {
          setCouponId(id);
          setCouponVisible(false);
        }}
      />
    </div>
  );
}
