import { Button, Card, Space, Tag } from "antd";
import type { Order, OrderStatus } from "../../types/domain";

type Props = {
  order: Order;
  actions?: Array<{ label: string; status: OrderStatus | "ACCEPT"; danger?: boolean }>;
  onAction: (orderId: string, status: OrderStatus | "ACCEPT") => void;
};

function modeText(mode: Order["mode"]) {
  if (mode === "DINE_IN") return "堂食";
  if (mode === "DELIVERY") return "外卖";
  return "自取";
}

function statusText(status: OrderStatus) {
  const map: Record<OrderStatus, string> = {
    PENDING_PAYMENT: "待支付",
    PAID: "已支付",
    ACCEPTED: "已接单",
    PREPARING: "制作中",
    DELIVERING: "配送中",
    READY_FOR_PICKUP: "可取餐",
    DONE: "已完成",
    CANCELLED: "已取消",
  };
  return map[status];
}

export function OrderCard({ order, actions = [], onAction }: Props) {
  return (
    <Card
      size="small"
      title={`#${order.id}`}
      extra={<Tag>{modeText(order.mode)}</Tag>}
      style={{ marginBottom: 12 }}
    >
      <p>状态：{statusText(order.orderStatus)}</p>
      <p>金额：¥{order.payableAmount.toFixed(2)}</p>
      <p>商品：{order.items.map((item) => `${item.productName} x${item.qty}`).join("，")}</p>
      {order.cancelReason && <p>原因：{order.cancelReason}</p>}
      {!!actions.length && (
        <Space wrap>
          {actions.map((action) => (
            <Button
              key={action.label}
              size="small"
              danger={action.danger}
              onClick={() => onAction(order.id, action.status)}
            >
              {action.label}
            </Button>
          ))}
        </Space>
      )}
    </Card>
  );
}
