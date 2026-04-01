import { List, Popup, Radio } from "antd-mobile";
import type { Coupon } from "../../types/domain";

type Props = {
  visible: boolean;
  coupons: Coupon[];
  selectedId?: string;
  amount: number;
  onClose: () => void;
  onSelect: (id?: string) => void;
};

export function CouponSelector({ visible, coupons, selectedId, amount, onClose, onSelect }: Props) {
  return (
    <Popup visible={visible} onMaskClick={onClose} bodyStyle={{ borderRadius: "12px 12px 0 0" }}>
      <div className="sheet-body">
        <h3>选择优惠券</h3>
        <Radio.Group value={selectedId ?? ""} onChange={(val) => onSelect(val ? String(val) : undefined)}>
          <List>
            <List.Item
              prefix={<Radio value=""> </Radio>}
              description="不使用优惠券"
              onClick={() => onSelect(undefined)}
            >
              不使用
            </List.Item>
            {coupons.map((coupon) => {
              const usable = amount >= coupon.threshold;
              return (
                <List.Item
                  key={coupon.id}
                  prefix={<Radio value={coupon.id}> </Radio>}
                  description={
                    usable
                      ? `满 ${coupon.threshold} 可用`
                      : `当前金额不足，满 ${coupon.threshold} 可用`
                  }
                  disabled={!usable}
                >
                  {coupon.title}
                </List.Item>
              );
            })}
          </List>
        </Radio.Group>
      </div>
    </Popup>
  );
}
