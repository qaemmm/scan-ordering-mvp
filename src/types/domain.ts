export type OrderMode = "DINE_IN" | "DELIVERY" | "PICKUP";
export type ScanState = "SCAN_IDLE" | "SCAN_ACTIVE" | "SCAN_SUCCESS" | "SCAN_FALLBACK";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "ACCEPTED"
  | "PREPARING"
  | "DELIVERING"
  | "READY_FOR_PICKUP"
  | "DONE"
  | "CANCELLED";

export interface Store {
  id: string;
  name: string;
  minOrderAmount: number;
  deliveryFee: number;
  supportModes: OrderMode[];
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  detail: string;
  lng: number;
  lat: number;
}

export interface Table {
  tableNo: string;
  capacity: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  sort: number;
}

export interface MenuSpec {
  id: string;
  name: string;
  delta: number;
}

export interface MenuAddon {
  id: string;
  name: string;
  delta: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  image: string;
  basePrice: number;
  specs: MenuSpec[];
  addons: MenuAddon[];
  tags: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  specId: string;
  specName: string;
  addonIds: string[];
  addonNames: string[];
  qty: number;
  unitPrice: number;
  subtotal: number;
}

export interface Coupon {
  id: string;
  title: string;
  threshold: number;
  discount: number;
  scope: "STORE";
}

export interface PaymentMethod {
  id: "ONLINE" | "COD" | "PAY_AT_STORE";
  name: string;
  enabledModes: OrderMode[];
}

export interface DiscountLine {
  name: string;
  amount: number;
}

export interface TimelineEvent {
  code: string;
  text: string;
  ts: number;
  operator: "USER" | "MERCHANT" | "SYSTEM";
}

export interface Order {
  id: string;
  storeId: string;
  mode: OrderMode;
  payStatus: "UNPAID" | "PAID";
  orderStatus: OrderStatus;
  estimateArrivalTime?: number;
  addressId?: string;
  tableNo?: string;
  pickupTime?: string;
  items: CartItem[];
  discounts: DiscountLine[];
  deliveryFee: number;
  totalAmount: number;
  payableAmount: number;
  note?: string;
  cancelReason?: string;
  createdAt: number;
}

export interface MerchantOrder extends Order {
  contact?: string;
}

export interface SessionContext {
  storeId: string;
  mode: OrderMode;
  tableNo?: string;
  addressId?: string;
  pickupTime?: string;
}

export interface MenuPayload {
  categories: MenuCategory[];
  items: MenuItem[];
}
