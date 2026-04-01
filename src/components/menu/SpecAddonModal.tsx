import { Button, Checkbox, Divider, Popup, Radio, Space } from "antd-mobile";
import { useState } from "react";
import type { MenuItem } from "../../types/domain";

type Props = {
  visible: boolean;
  item: MenuItem | null;
  onClose: () => void;
  onConfirm: (payload: {
    productId: string;
    productName: string;
    specId: string;
    specName: string;
    addonIds: string[];
    addonNames: string[];
    unitPrice: number;
  }) => void;
};

export function SpecAddonModal({ visible, item, onClose, onConfirm }: Props) {
  const [specId, setSpecId] = useState<string>(item?.specs[0]?.id ?? "");
  const [addonIds, setAddonIds] = useState<string[]>([]);

  if (!item) return null;

  const selectedSpec = item.specs.find((spec) => spec.id === specId) ?? item.specs[0];
  const selectedAddons = item.addons.filter((addon) => addonIds.includes(addon.id));
  const unitPrice =
    item.basePrice +
    (selectedSpec?.delta ?? 0) +
    selectedAddons.reduce((acc, addon) => acc + addon.delta, 0);

  return (
    <Popup visible={visible} onMaskClick={onClose} bodyStyle={{ borderRadius: "12px 12px 0 0" }}>
      <div className="sheet-body">
        <h3>{item.name}</h3>
        <p className="muted">选择规格和加料</p>
        <Divider />

        <div>
          <p className="field-title">规格</p>
          <Radio.Group value={specId} onChange={(val) => setSpecId(String(val))}>
            <Space direction="vertical" block>
              {item.specs.map((spec) => (
                <Radio key={spec.id} value={spec.id}>
                  {spec.name} {spec.delta ? `(+${spec.delta.toFixed(2)})` : ""}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>

        <Divider />

        <div>
          <p className="field-title">加料</p>
          <Checkbox.Group value={addonIds} onChange={(val) => setAddonIds(val as string[])}>
            <Space direction="vertical" block>
              {item.addons.map((addon) => (
                <Checkbox key={addon.id} value={addon.id}>
                  {addon.name} (+{addon.delta.toFixed(2)})
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </div>

        <Button
          color="primary"
          block
          onClick={() =>
            onConfirm({
              productId: item.id,
              productName: item.name,
              specId: selectedSpec?.id ?? "",
              specName: selectedSpec?.name ?? "标准",
              addonIds: selectedAddons.map((addon) => addon.id),
              addonNames: selectedAddons.map((addon) => addon.name),
              unitPrice: Number(unitPrice.toFixed(2)),
            })
          }
        >
          加入购物车 ¥{unitPrice.toFixed(2)}
        </Button>
      </div>
    </Popup>
  );
}
