import { Badge, Button } from "antd-mobile";

type Props = {
  count: number;
  total: number;
  canCheckout: boolean;
  onOpen: () => void;
  onCheckout: () => void;
};

export function CartBar({ count, total, canCheckout, onOpen, onCheckout }: Props) {
  return (
    <div className="cart-bar">
      <div className="cart-bar-left" onClick={onOpen}>
        <Badge content={count}>
          <div className="cart-dot">🛒</div>
        </Badge>
        <div>
          <div className="cart-total">HK${total.toFixed(2)}</div>
          <div className="muted">点击查看购物车</div>
        </div>
      </div>
      <Button color="primary" disabled={!canCheckout} onClick={onCheckout}>
        去结算
      </Button>
    </div>
  );
}
