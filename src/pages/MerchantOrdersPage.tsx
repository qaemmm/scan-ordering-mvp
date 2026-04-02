import { Button, Card, Empty, Segmented, Space, Spin, Typography, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { api } from "../api/client";
import { OrderCard } from "../components/merchant/OrderCard";
import type { Order, OrderStatus, Table } from "../types/domain";

type MerchantRes = { orders: Order[] };
type StoreRes = { tables: Table[] };
type QrEntry = { tableNo: string; url: string; dataUrl: string };

type MerchantTab = "NEW" | "PREPARING" | "DONE";

export function MerchantOrdersPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<MerchantTab>("NEW");
  const [orders, setOrders] = useState<Order[]>([]);
  const [qrEntries, setQrEntries] = useState<QrEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const storeId = "s_1001";

  const fetchOrders = useCallback(async (nextTab: MerchantTab) => {
    setLoading(true);
    try {
      const res = await api.get<MerchantRes>(`/api/merchant/orders?status=${nextTab}`);
      setOrders(res.orders);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders(tab);
  }, [tab, fetchOrders]);

  useEffect(() => {
    let disposed = false;
    void (async () => {
      try {
        const res = await api.get<StoreRes>(`/api/stores/${storeId}`);
        const baseUrl = window.location.origin;
        const entries = await Promise.all(
          res.tables.map(async (table) => {
            const url = `${baseUrl}/scan?storeId=${storeId}&mode=DINE_IN&tableNo=${encodeURIComponent(table.tableNo)}`;
            const dataUrl = await QRCode.toDataURL(url, {
              width: 240,
              margin: 1,
              errorCorrectionLevel: "M",
            });
            return { tableNo: table.tableNo, url, dataUrl };
          }),
        );
        if (!disposed) {
          setQrEntries(entries);
        }
      } catch {
        if (!disposed) {
          message.error("桌码生成失败");
        }
      }
    })();

    return () => {
      disposed = true;
    };
  }, []);

  const onAction = async (orderId: string, action: OrderStatus | "ACCEPT") => {
    if (action === "ACCEPT") {
      await api.post(`/api/merchant/orders/${orderId}/accept`);
      message.success("已接单");
      void fetchOrders(tab);
      return;
    }

    if (action === "CANCELLED") {
      const reason = window.prompt("请输入拒单原因（例如：菜品售罄）", "菜品售罄")?.trim() || "商家拒单";
      await api.post(`/api/merchant/orders/${orderId}/status`, {
        nextStatus: action,
        reason,
      });
      message.warning(`已拒单：${reason}`);
      void fetchOrders(tab);
      return;
    }

    await api.post(`/api/merchant/orders/${orderId}/status`, { nextStatus: action });
    message.success("状态已更新");
    void fetchOrders(tab);
  };

  const actionsFor = (order: Order) => {
    if (tab === "NEW") {
      return [
        { label: "接单", status: "ACCEPT" as const },
        { label: "拒单", status: "CANCELLED" as const, danger: true },
      ];
    }

    if (tab === "PREPARING") {
      if (order.mode === "DELIVERY") {
        return [
          { label: "制作中", status: "PREPARING" as const },
          { label: "配送中", status: "DELIVERING" as const },
          { label: "完成", status: "DONE" as const },
        ];
      }

      return [
        { label: "制作中", status: "PREPARING" as const },
        { label: "可取餐", status: "READY_FOR_PICKUP" as const },
        { label: "完成", status: "DONE" as const },
      ];
    }

    return [];
  };

  const downloadCode = (entry: QrEntry) => {
    const a = document.createElement("a");
    a.href = entry.dataUrl;
    a.download = `table-${entry.tableNo}.png`;
    a.click();
  };

  return (
    <div className="merchant-page">
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <div className="row-between merchant-head">
          <Typography.Title level={3} style={{ margin: 0 }}>
            商家订单看板
          </Typography.Title>
          <Space>
            <Typography.Text type="secondary">内部演示环境</Typography.Text>
            <Button onClick={() => navigate("/")}>返回用户端</Button>
          </Space>
        </div>

        <Segmented
          value={tab}
          options={[
            { label: "新订单", value: "NEW" },
            { label: "制作中", value: "PREPARING" },
            { label: "已完成", value: "DONE" },
          ]}
          onChange={(val) => setTab(val as MerchantTab)}
        />

        <Card title="桌码管理（扫码点单）" size="small">
          {qrEntries.length === 0 ? (
            <Spin />
          ) : (
            <div className="qr-grid">
              {qrEntries.map((entry) => (
                <div key={entry.tableNo} className="qr-item">
                  <img src={entry.dataUrl} alt={`桌号 ${entry.tableNo}`} />
                  <div className="qr-meta">
                    <strong>{entry.tableNo}</strong>
                    <span className="muted">堂食扫码点单</span>
                  </div>
                  <Space size={8}>
                    <Button size="small" onClick={() => downloadCode(entry)}>
                      下载 PNG
                    </Button>
                    <Button
                      size="small"
                      onClick={async () => {
                        await navigator.clipboard.writeText(entry.url);
                        message.success("链接已复制");
                      }}
                    >
                      复制链接
                    </Button>
                  </Space>
                </div>
              ))}
            </div>
          )}
        </Card>

        {loading ? (
          <div className="center" style={{ minHeight: 220 }}>
            <Spin />
          </div>
        ) : orders.length === 0 ? (
          <Empty description="当前没有订单" />
        ) : (
          orders.map((order) => (
            <OrderCard key={order.id} order={order} actions={actionsFor(order)} onAction={onAction} />
          ))
        )}
      </Space>
    </div>
  );
}
