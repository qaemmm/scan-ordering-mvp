import { Button, Empty, List, Popup, Space } from "antd-mobile";
import type { CartItem } from "../../types/domain";

type Props = {
  visible: boolean;
  items: CartItem[];
  onClose: () => void;
  onChangeQty: (id: string, delta: number) => void;
  onClear: () => void;
};

export function CartDrawer({ visible, items, onClose, onChangeQty, onClear }: Props) {
  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{ height: "55vh", borderRadius: "12px 12px 0 0", overflow: "auto" }}
    >
      <div className="sheet-body">
        <div className="row-between">
          <h3>购物车</h3>
          <Button size="small" fill="none" color="danger" onClick={onClear}>
            清空
          </Button>
        </div>
        {!items.length ? (
          <Empty description="购物车空空如也" />
        ) : (
          <List>
            {items.map((item) => (
              <List.Item
                key={item.id}
                description={`${item.specName}${item.addonNames.length ? ` / ${item.addonNames.join("、")}` : ""}`}
                extra={
                  <Space>
                    <Button size="mini" onClick={() => onChangeQty(item.id, -1)}>
                      -
                    </Button>
                    <span>{item.qty}</span>
                    <Button size="mini" onClick={() => onChangeQty(item.id, 1)}>
                      +
                    </Button>
                  </Space>
                }
              >
                {item.productName} · HK${item.subtotal.toFixed(2)}
              </List.Item>
            ))}
          </List>
        )}
      </div>
    </Popup>
  );
}
