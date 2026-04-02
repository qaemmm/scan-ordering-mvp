import type {
  Address,
  CartItem,
  Coupon,
  MenuPayload,
  MerchantOrder,
  Order,
  OrderMode,
  OrderStatus,
  PaymentMethod,
  Store,
  Table,
  TimelineEvent,
} from "../types/domain";

const now = () => Date.now();

const store: Store = {
  id: "s_1001",
  name: "港味馄饨·中环店",
  minOrderAmount: 38,
  deliveryFee: 6,
  supportModes: ["DINE_IN", "DELIVERY", "PICKUP"],
};

const tables: Table[] = [
  { tableNo: "A01", capacity: 2 },
  { tableNo: "A02", capacity: 2 },
  { tableNo: "A03", capacity: 4 },
  { tableNo: "A05", capacity: 4 },
  { tableNo: "B01", capacity: 4 },
  { tableNo: "B03", capacity: 6 },
  { tableNo: "C01", capacity: 8 },
  { tableNo: "C02", capacity: 8 },
];

const addresses: Address[] = [
  {
    id: "addr_1",
    name: "陈小姐",
    phone: "+852 9123 0001",
    detail: "九龙尖沙咀广东道 88 号 12F",
    lng: 114.1722,
    lat: 22.2976,
  },
  {
    id: "addr_2",
    name: "林先生",
    phone: "+852 9733 0002",
    detail: "香港岛中环皇后大道中 120 号 9F",
    lng: 114.1577,
    lat: 22.2819,
  },
  {
    id: "addr_3",
    name: "黄太",
    phone: "+852 9344 0003",
    detail: "新界沙田好运中心 3 座 15F",
    lng: 114.1956,
    lat: 22.3831,
  },
];

const menu: MenuPayload = {
  categories: [
    { id: "c_1", name: "招牌馄饨", sort: 1 },
    { id: "c_2", name: "云吞面", sort: 2 },
    { id: "c_3", name: "港式小食", sort: 3 },
    { id: "c_4", name: "饮品甜品", sort: 4 },
  ],
  items: [
    {
      id: "p_101",
      categoryId: "c_1",
      name: "鲜虾云吞汤",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=900",
      basePrice: 36,
      specs: [
        { id: "s1", name: "标准份", delta: 0 },
        { id: "s2", name: "加大份", delta: 10 },
      ],
      addons: [
        { id: "a1", name: "加紫菜", delta: 3 },
        { id: "a2", name: "加鱼蛋", delta: 6 },
      ],
      tags: ["鲜虾", "招牌", "清汤"],
    },
    {
      id: "p_102",
      categoryId: "c_1",
      name: "蟹籽鲜肉云吞",
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=900",
      basePrice: 34,
      specs: [
        { id: "s1", name: "标准份", delta: 0 },
        { id: "s2", name: "双拼份", delta: 8 },
      ],
      addons: [
        { id: "a3", name: "加溏心蛋", delta: 5 },
        { id: "a4", name: "加菜心", delta: 4 },
      ],
      tags: ["鲜肉", "蟹籽", "人气"],
    },
    {
      id: "p_103",
      categoryId: "c_1",
      name: "松露鸡汤云吞",
      image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=900",
      basePrice: 42,
      specs: [
        { id: "s1", name: "标准份", delta: 0 },
        { id: "s2", name: "尊享份", delta: 12 },
      ],
      addons: [
        { id: "a5", name: "加松露酱", delta: 8 },
        { id: "a6", name: "加金针菇", delta: 4 },
      ],
      tags: ["鸡汤", "浓郁", "推荐"],
    },
    {
      id: "p_201",
      categoryId: "c_2",
      name: "鲜虾云吞面",
      image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=900",
      basePrice: 38,
      specs: [
        { id: "s1", name: "细面", delta: 0 },
        { id: "s2", name: "河粉", delta: 2 },
      ],
      addons: [
        { id: "a7", name: "加面", delta: 6 },
        { id: "a8", name: "加牛丸", delta: 8 },
      ],
      tags: ["饱腹", "经典"],
    },
    {
      id: "p_202",
      categoryId: "c_2",
      name: "叉烧云吞面",
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=900",
      basePrice: 40,
      specs: [
        { id: "s1", name: "细面", delta: 0 },
        { id: "s2", name: "公仔面", delta: 2 },
      ],
      addons: [
        { id: "a9", name: "加叉烧", delta: 10 },
        { id: "a10", name: "加青菜", delta: 4 },
      ],
      tags: ["叉烧", "港味"],
    },
    {
      id: "p_203",
      categoryId: "c_2",
      name: "双拼云吞面",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900",
      basePrice: 45,
      specs: [
        { id: "s1", name: "虾+肉", delta: 0 },
        { id: "s2", name: "虾+牛", delta: 4 },
      ],
      addons: [
        { id: "a11", name: "加鱼片", delta: 8 },
        { id: "a12", name: "加辣油", delta: 0 },
      ],
      tags: ["双拼", "招牌"],
    },
    {
      id: "p_301",
      categoryId: "c_3",
      name: "咖喱鱼蛋",
      image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=900",
      basePrice: 22,
      specs: [
        { id: "s1", name: "小份", delta: 0 },
        { id: "s2", name: "大份", delta: 8 },
      ],
      addons: [{ id: "a13", name: "加萝卜", delta: 4 }],
      tags: ["小食", "微辣"],
    },
    {
      id: "p_302",
      categoryId: "c_3",
      name: "港式炸云吞",
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=900",
      basePrice: 24,
      specs: [
        { id: "s1", name: "6只", delta: 0 },
        { id: "s2", name: "10只", delta: 10 },
      ],
      addons: [{ id: "a14", name: "加甜辣酱", delta: 2 }],
      tags: ["香脆", "下饭"],
    },
    {
      id: "p_303",
      categoryId: "c_3",
      name: "香葱牛肉丸",
      image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=900",
      basePrice: 26,
      specs: [{ id: "s1", name: "标准份", delta: 0 }],
      addons: [{ id: "a15", name: "加汤底", delta: 3 }],
      tags: ["肉丸", "热卖"],
    },
    {
      id: "p_401",
      categoryId: "c_4",
      name: "冻柠茶",
      image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=900",
      basePrice: 14,
      specs: [
        { id: "s1", name: "少糖", delta: 0 },
        { id: "s2", name: "正常糖", delta: 0 },
      ],
      addons: [{ id: "a16", name: "加柠檬片", delta: 2 }],
      tags: ["解腻", "经典"],
    },
    {
      id: "p_402",
      categoryId: "c_4",
      name: "冻奶茶",
      image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=900",
      basePrice: 16,
      specs: [
        { id: "s1", name: "小杯", delta: 0 },
        { id: "s2", name: "大杯", delta: 4 },
      ],
      addons: [{ id: "a17", name: "加珍珠", delta: 3 }],
      tags: ["港式", "人气"],
    },
    {
      id: "p_403",
      categoryId: "c_4",
      name: "杨枝甘露",
      image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=900",
      basePrice: 20,
      specs: [{ id: "s1", name: "标准杯", delta: 0 }],
      addons: [{ id: "a18", name: "加西米", delta: 2 }],
      tags: ["甜品", "推荐"],
    },
  ],
};

const coupons: Coupon[] = [
  { id: "cp_new", title: "新客立减 5", threshold: 30, discount: 5, scope: "STORE" },
  { id: "cp_set", title: "双人套餐减 12", threshold: 68, discount: 12, scope: "STORE" },
  { id: "cp_night", title: "夜宵档减 8", threshold: 50, discount: 8, scope: "STORE" },
  { id: "cp_88", title: "满 88 减 15", threshold: 88, discount: 15, scope: "STORE" },
];

const paymentMethods: PaymentMethod[] = [
  { id: "PAY_AT_STORE", name: "到店付款", enabledModes: ["DINE_IN", "PICKUP"] },
  { id: "ONLINE", name: "在线支付（演示预留）", enabledModes: ["DINE_IN", "DELIVERY", "PICKUP"] },
  { id: "COD", name: "外送货到付款", enabledModes: ["DELIVERY"] },
];

type InternalOrder = {
  order: Order;
  timeline: TimelineEvent[];
};

const orders = new Map<string, InternalOrder>();

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

function pushTimeline(orderId: string, event: TimelineEvent) {
  const entry = orders.get(orderId);
  if (!entry) return;
  entry.timeline.push(event);
}

function statusText(status: OrderStatus): string {
  switch (status) {
    case "PENDING_PAYMENT":
      return "待支付";
    case "PAID":
      return "支付成功";
    case "ACCEPTED":
      return "商家已接单";
    case "PREPARING":
      return "制作中";
    case "DELIVERING":
      return "配送中";
    case "READY_FOR_PICKUP":
      return "可取餐";
    case "DONE":
      return "已完成";
    case "CANCELLED":
      return "已取消";
    default:
      return status;
  }
}

export const db = {
  store,
  tables,
  addresses,
  menu,
  coupons,
  paymentMethods,
  createOrder(input: {
    mode: OrderMode;
    addressId?: string;
    tableNo?: string;
    pickupTime?: string;
    items: CartItem[];
    deliveryFee: number;
    discount: number;
    totalAmount: number;
    payableAmount: number;
    note?: string;
  }) {
    const id = makeId("o");
    const createdAt = now();
    const order: Order = {
      id,
      storeId: store.id,
      mode: input.mode,
      payStatus: "UNPAID",
      orderStatus: "PENDING_PAYMENT",
      estimateArrivalTime:
        input.mode === "DELIVERY" ? Math.floor((createdAt + 30 * 60 * 1000) / 1000) : undefined,
      addressId: input.addressId,
      tableNo: input.tableNo,
      pickupTime: input.pickupTime,
      items: input.items,
      discounts: input.discount > 0 ? [{ name: "优惠减免", amount: input.discount }] : [],
      deliveryFee: input.deliveryFee,
      totalAmount: input.totalAmount,
      payableAmount: input.payableAmount,
      note: input.note,
      createdAt,
    };

    const timeline: TimelineEvent[] = [
      {
        code: "CREATED",
        text: "订单已提交",
        ts: createdAt,
        operator: "USER",
      },
    ];

    orders.set(id, { order, timeline });
    return order;
  },
  confirmPayment(orderId: string) {
    const entry = orders.get(orderId);
    if (!entry) return null;

    entry.order.payStatus = "PAID";
    entry.order.orderStatus = "PAID";
    pushTimeline(orderId, {
      code: "PAID",
      text: "支付已确认（演示）",
      ts: now(),
      operator: "USER",
    });
    return entry.order;
  },
  getOrder(orderId: string) {
    return orders.get(orderId)?.order ?? null;
  },
  getTimeline(orderId: string) {
    return orders.get(orderId)?.timeline ?? [];
  },
  getMerchantOrders(status: "NEW" | "PREPARING" | "DONE"): MerchantOrder[] {
    const all = [...orders.values()].map((entry) => entry.order as MerchantOrder);
    return all.filter((order) => {
      if (status === "NEW") return order.orderStatus === "PAID";
      if (status === "PREPARING") {
        return ["ACCEPTED", "PREPARING", "DELIVERING", "READY_FOR_PICKUP"].includes(order.orderStatus);
      }
      return ["DONE", "CANCELLED"].includes(order.orderStatus);
    });
  },
  merchantAccept(orderId: string) {
    const entry = orders.get(orderId);
    if (!entry) return null;

    entry.order.orderStatus = "ACCEPTED";
    pushTimeline(orderId, {
      code: "ACCEPTED",
      text: "商家已接单",
      ts: now(),
      operator: "MERCHANT",
    });
    return entry.order;
  },
  merchantStatus(orderId: string, nextStatus: OrderStatus, reason?: string) {
    const entry = orders.get(orderId);
    if (!entry) return null;

    entry.order.orderStatus = nextStatus;
    if (nextStatus === "CANCELLED" && reason) {
      entry.order.cancelReason = reason;
    }

    pushTimeline(orderId, {
      code: nextStatus,
      text: nextStatus === "CANCELLED" && reason ? `订单已取消（${reason}）` : statusText(nextStatus),
      ts: now(),
      operator: "MERCHANT",
    });
    return entry.order;
  },
};
