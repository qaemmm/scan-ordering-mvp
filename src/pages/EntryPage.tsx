import { Button, Card, DatePicker, Form, Input, List, Radio, Selector, Toast } from "antd-mobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useSessionStore } from "../state/session";
import type { Address, OrderMode, Store, Table } from "../types/domain";

type StoreRes = { store: Store; tables: Table[]; modes: OrderMode[] };
type AddressRes = { addresses: Address[] };

export function EntryPage() {
  const navigate = useNavigate();
  const {
    storeId,
    mode,
    tableNo,
    addressId,
    pickupTime,
    setMode,
    setTableNo,
    setAddressId,
    setPickupTime,
  } = useSessionStore();

  const [store, setStore] = useState<Store | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    void (async () => {
      const [storeRes, addrRes] = await Promise.all([
        api.get<StoreRes>(`/api/stores/${storeId}`),
        api.get<AddressRes>("/api/users/me/addresses"),
      ]);
      setStore(storeRes.store);
      setTables(storeRes.tables);
      setAddresses(addrRes.addresses);
    })();
  }, [storeId]);

  const canEnter =
    (mode === "DINE_IN" && !!tableNo) ||
    (mode === "DELIVERY" && !!addressId) ||
    (mode === "PICKUP" && !!pickupTime);

  const enterMenu = () => {
    if (!canEnter) {
      Toast.show({ content: "请先完成必填项" });
      return;
    }
    navigate(`/store/${storeId}/menu`);
  };

  return (
    <div className="mobile-page page-entry">
      <div className="hero-banner">
        <p className="hero-kicker">HONG KONG WONTON</p>
        <h1>港味馄饨·中环店</h1>
        <p>扫码即点 · 出餐可追踪 · 商家实时接单</p>
      </div>

      <Card title={store?.name ?? "加载中..."}>
        <p>
          起送价：HK${store?.minOrderAmount ?? "-"}，配送费：HK${store?.deliveryFee ?? "-"}
        </p>
      </Card>

      <Card title="今日招牌推荐">
        <div className="ai-entry-list">
          <button type="button" className="ai-entry-chip" onClick={() => navigate(`/store/${storeId}/menu`)}>
            本店招牌是什么？
          </button>
          <button type="button" className="ai-entry-chip" onClick={() => navigate(`/store/${storeId}/menu`)}>
            两个人怎么点更稳妥？
          </button>
        </div>
      </Card>

      <Card title="选择点餐方式">
        <Selector
          columns={3}
          value={[mode]}
          options={[
            { label: "堂食", value: "DINE_IN" },
            { label: "外送", value: "DELIVERY" },
            { label: "自取", value: "PICKUP" },
          ]}
          onChange={(arr) => setMode((arr[0] as OrderMode) ?? "DINE_IN")}
        />
      </Card>

      {mode === "DINE_IN" && (
        <Card title="绑定桌号">
          <Radio.Group value={tableNo ?? ""} onChange={(val) => setTableNo(String(val))}>
            <List>
              {tables.map((table) => (
                <List.Item key={table.tableNo} prefix={<Radio value={table.tableNo}> </Radio>}>
                  {table.tableNo}（{table.capacity} 人）
                </List.Item>
              ))}
            </List>
          </Radio.Group>
        </Card>
      )}

      {mode === "DELIVERY" && (
        <Card title="选择地址">
          <Radio.Group value={addressId ?? ""} onChange={(val) => setAddressId(String(val))}>
            <List>
              {addresses.map((address) => (
                <List.Item key={address.id} prefix={<Radio value={address.id}> </Radio>}>
                  <div>
                    {address.name} {address.phone}
                  </div>
                  <div className="muted">{address.detail}</div>
                </List.Item>
              ))}
            </List>
          </Radio.Group>
        </Card>
      )}

      {mode === "PICKUP" && (
        <Card title="自取时间">
          <Form layout="horizontal">
            <Form.Item label="备注">
              <Input placeholder="例如：20 分钟后到店" />
            </Form.Item>
          </Form>
          <DatePicker
            precision="minute"
            value={pickupTime ? new Date(pickupTime) : undefined}
            onConfirm={(val) => setPickupTime(val.toISOString())}
          >
            {(val) => (
              <Button block>
                {val ? `已选：${new Date(val).toLocaleString()}` : "选择自取时间"}
              </Button>
            )}
          </DatePicker>
        </Card>
      )}

      <Button color="primary" block disabled={!canEnter} onClick={enterMenu}>
        进入菜单
      </Button>

      <Button block fill="outline" onClick={() => navigate("/scan")}>
        扫码点单入口
      </Button>

      <Button block fill="none" onClick={() => navigate("/merchant/orders")}>
        进入商家看板（内部演示）
      </Button>
    </div>
  );
}
