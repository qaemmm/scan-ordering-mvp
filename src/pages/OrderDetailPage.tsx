import { Button, Card, DotLoading, Empty, List, Tag, Toast } from "antd-mobile";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { Timeline } from "../components/order/Timeline";
import { useOrderPolling } from "../state/orderPolling";
import type { OrderStatus } from "../types/domain";

function statusLabel(status: OrderStatus) {
  const map: Record<OrderStatus, string> = {
    PENDING_PAYMENT: "待支付",
    PAID: "已支付",
    ACCEPTED: "商家已接单",
    PREPARING: "制作中",
    DELIVERING: "配送中",
    READY_FOR_PICKUP: "可取餐",
    DONE: "已完成",
    CANCELLED: "已取消",
  };
  return map[status];
}

function modeLabel(mode: string) {
  if (mode === "DINE_IN") return "堂食";
  if (mode === "DELIVERY") return "外送";
  if (mode === "PICKUP") return "自取";
  return mode;
}

export function OrderDetailPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { order, timeline, loading, error } = useOrderPolling(orderId);

  const cancelOrder = async () => {
    if (!orderId) return;
    await api.post(`/api/merchant/orders/${orderId}/status`, { nextStatus: "CANCELLED" });
    Toast.show({ content: "订单已取消" });
  };

  if (loading) {
    return (
      <div className="mobile-page center">
        <DotLoading color="primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mobile-page">
        <Empty description={error ?? "订单不存在"} />
      </div>
    );
  }

  return (
    <div className="mobile-page page-order">
      <div className="hero-banner compact">
        <p className="hero-kicker">TRACKING</p>
        <h2>订单状态追踪</h2>
      </div>

      <Card title={`订单 #${order.id}`} extra={<Tag color="primary">{statusLabel(order.orderStatus)}</Tag>}>
        <p>模式：{modeLabel(order.mode)}</p>
        <p>支付状态：{order.payStatus}</p>
        {order.cancelReason && <p>取消原因：{order.cancelReason}</p>}
        {!!order.estimateArrivalTime && (
          <p>预计送达：{new Date(order.estimateArrivalTime * 1000).toLocaleTimeString()}</p>
        )}
        {order.tableNo && <p>桌号：{order.tableNo}</p>}
        {order.pickupTime && <p>自取时间：{new Date(order.pickupTime).toLocaleString()}</p>}
      </Card>

      {order.mode === "DELIVERY" && (
        <Card title="配送地图（演示占位）">
          <div className="map-placeholder">
            <span>这里可接入真实地图与骑手轨迹</span>
          </div>
        </Card>
      )}

      <Card title="商品明细">
        <List>
          {order.items.map((item) => (
            <List.Item key={item.id} description={`${item.specName} x${item.qty}`}>
              {item.productName} · HK${item.subtotal.toFixed(2)}
            </List.Item>
          ))}
        </List>
        <h4 style={{ marginTop: 12 }}>应付：HK${order.payableAmount.toFixed(2)}</h4>
      </Card>

      <Card title="状态时间线">
        <Timeline events={timeline} />
      </Card>

      <div className="row-gap">
        {["PENDING_PAYMENT", "PAID", "ACCEPTED"].includes(order.orderStatus) && (
          <Button color="danger" onClick={cancelOrder}>
            取消订单
          </Button>
        )}

        <Button fill="outline" onClick={() => navigate("/")}>
          再来一单
        </Button>

        {order.orderStatus === "DONE" && (
          <Button
            fill="outline"
            onClick={() => {
              Toast.show({ content: "评价功能开发中" });
            }}
          >
            去评价
          </Button>
        )}

        <Button fill="none" onClick={() => navigate("/merchant/orders")}>
          查看商家看板
        </Button>
      </div>
    </div>
  );
}
