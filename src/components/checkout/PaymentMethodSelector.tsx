import { List, Radio } from "antd-mobile";
import type { OrderMode, PaymentMethod } from "../../types/domain";

type Props = {
  methods: PaymentMethod[];
  mode: OrderMode;
  value: string;
  onChange: (id: string) => void;
};

export function PaymentMethodSelector({ methods, mode, value, onChange }: Props) {
  return (
    <Radio.Group value={value} onChange={(val) => onChange(String(val))}>
      <List>
        {methods.map((method) => {
          const enabled = method.enabledModes.includes(mode);
          return (
            <List.Item key={method.id} prefix={<Radio value={method.id}> </Radio>} disabled={!enabled}>
              {method.name}
            </List.Item>
          );
        })}
      </List>
    </Radio.Group>
  );
}
