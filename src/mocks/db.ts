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
  name: "小李川菜馆",
  minOrderAmount: 20,
  deliveryFee: 3,
  supportModes: ["DINE_IN", "DELIVERY", "PICKUP"],
};

const tables: Table[] = [
  { tableNo: "A01", capacity: 2 },
  { tableNo: "A02", capacity: 4 },
  { tableNo: "A03", capacity: 4 },
  { tableNo: "A04", capacity: 6 },
  { tableNo: "B01", capacity: 2 },
  { tableNo: "B02", capacity: 4 },
  { tableNo: "B03", capacity: 6 },
  { tableNo: "B10", capacity: 6 },
  { tableNo: "C01", capacity: 8 },
  { tableNo: "C02", capacity: 8 },
  { tableNo: "D01", capacity: 10 },
];

const addresses: Address[] = [
  {
    id: "addr_1",
    name: "张三",
    phone: "13800000000",
    detail: "浦东新区示例路 88 号 3 单元 1202",
    lng: 121.521,
    lat: 31.227,
  },
  {
    id: "addr_2",
    name: "李四",
    phone: "13900000000",
    detail: "徐汇区示例路 66 号 2 单元 802",
    lng: 121.44,
    lat: 31.192,
  },
  {
    id: "addr_3",
    name: "王五",
    phone: "13700000000",
    detail: "静安区南京西路 188 号 5 楼 501",
    lng: 121.457,
    lat: 31.229,
  },
  {
    id: "addr_4",
    name: "赵六",
    phone: "13600000000",
    detail: "长宁区虹桥路 520 号 1 幢 901",
    lng: 121.403,
    lat: 31.214,
  },
];

const menu: MenuPayload = {
  categories: [
    { id: "c_1", name: "招牌", sort: 1 },
    { id: "c_2", name: "川味热菜", sort: 2 },
    { id: "c_3", name: "主食", sort: 3 },
    { id: "c_4", name: "小吃", sort: 4 },
    { id: "c_5", name: "饮品", sort: 5 },
    { id: "c_6", name: "汤羹", sort: 6 },
  ],
  items: [
    {
      id: "p_101",
      categoryId: "c_2",
      name: "宫保鸡丁",
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800",
      basePrice: 28,
      specs: [
        { id: "s1", name: "小份", delta: 0 },
        { id: "s2", name: "大份", delta: 8 },
      ],
      addons: [
        { id: "a1", name: "加花生", delta: 2 },
        { id: "a2", name: "加米饭", delta: 3 },
      ],
      tags: ["辣", "下饭"],
    },
    {
      id: "p_102",
      categoryId: "c_1",
      name: "麻婆豆腐",
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800",
      basePrice: 22,
      specs: [{ id: "s1", name: "标准", delta: 0 }],
      addons: [{ id: "a2", name: "加米饭", delta: 3 }],
      tags: ["招牌"],
    },
    {
      id: "p_103",
      categoryId: "c_2",
      name: "水煮牛肉",
      image: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800",
      basePrice: 42,
      specs: [
        { id: "s1", name: "标准", delta: 0 },
        { id: "s2", name: "加量", delta: 12 },
      ],
      addons: [
        { id: "a4", name: "加豆皮", delta: 4 },
        { id: "a2", name: "加米饭", delta: 3 },
      ],
      tags: ["重辣", "热销"],
    },
    {
      id: "p_104",
      categoryId: "c_2",
      name: "鱼香肉丝",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800",
      basePrice: 29,
      specs: [
        { id: "s1", name: "标准", delta: 0 },
        { id: "s2", name: "大份", delta: 8 },
      ],
      addons: [{ id: "a2", name: "加米饭", delta: 3 }],
      tags: ["微辣", "下饭"],
    },
    {
      id: "p_105",
      categoryId: "c_1",
      name: "回锅肉",
      image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800",
      basePrice: 32,
      specs: [
        { id: "s1", name: "标准", delta: 0 },
        { id: "s2", name: "大份", delta: 10 },
      ],
      addons: [{ id: "a2", name: "加米饭", delta: 3 }],
      tags: ["招牌", "家常"],
    },
    {
      id: "p_106",
      categoryId: "c_1",
      name: "辣子鸡",
      image: "https://images.unsplash.com/photo-1625944230932-76c5dc64f6f5?w=800",
      basePrice: 36,
      specs: [
        { id: "s1", name: "中辣", delta: 0 },
        { id: "s2", name: "特辣", delta: 0 },
      ],
      addons: [{ id: "a1", name: "加花生", delta: 2 }],
      tags: ["香辣", "招牌"],
    },
    {
      id: "p_107",
      categoryId: "c_3",
      name: "扬州炒饭",
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800",
      basePrice: 18,
      specs: [{ id: "s1", name: "标准", delta: 0 }],
      addons: [{ id: "a5", name: "加蛋", delta: 3 }],
      tags: ["主食"],
    },
    {
      id: "p_108",
      categoryId: "c_3",
      name: "红油抄手",
      image: "https://images.unsplash.com/photo-1617622141573-6f4f67f54874?w=800",
      basePrice: 20,
      specs: [
        { id: "s1", name: "8个", delta: 0 },
        { id: "s2", name: "12个", delta: 6 },
      ],
      addons: [{ id: "a6", name: "加香菜", delta: 1 }],
      tags: ["主食", "辣"],
    },
    {
      id: "p_109",
      categoryId: "c_3",
      name: "担担面",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
      basePrice: 19,
      specs: [
        { id: "s1", name: "标准", delta: 0 },
        { id: "s2", name: "加面", delta: 4 },
      ],
      addons: [{ id: "a7", name: "加卤蛋", delta: 3 }],
      tags: ["主食", "畅销"],
    },
    {
      id: "p_110",
      categoryId: "c_4",
      name: "红糖糍粑",
      image: "https://images.unsplash.com/photo-1514517093094-4f4f34d8fd77?w=800",
      basePrice: 14,
      specs: [{ id: "s1", name: "标准", delta: 0 }],
      addons: [],
      tags: ["甜品", "小吃"],
    },
    {
      id: "p_111",
      categoryId: "c_4",
      name: "炸酥肉",
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800",
      basePrice: 22,
      specs: [
        { id: "s1", name: "小份", delta: 0 },
        { id: "s2", name: "大份", delta: 8 },
      ],
      addons: [{ id: "a8", name: "加椒盐", delta: 1 }],
      tags: ["小吃", "脆香"],
    },
    {
      id: "p_112",
      categoryId: "c_4",
      name: "口水鸡",
      image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800",
      basePrice: 26,
      specs: [{ id: "s1", name: "标准", delta: 0 }],
      addons: [{ id: "a6", name: "加香菜", delta: 1 }],
      tags: ["凉菜", "热门"],
    },
    {
      id: "p_113",
      categoryId: "c_5",
      name: "酸梅汤",
      image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800",
      basePrice: 8,
      specs: [
        { id: "s1", name: "中杯", delta: 0 },
        { id: "s2", name: "大杯", delta: 3 },
      ],
      addons: [{ id: "a9", name: "加冰", delta: 0 }],
      tags: ["解辣"],
    },
    {
      id: "p_114",
      categoryId: "c_5",
      name: "鲜榨柠檬茶",
      image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=800",
      basePrice: 12,
      specs: [
        { id: "s1", name: "少糖", delta: 0 },
        { id: "s2", name: "正常糖", delta: 0 },
      ],
      addons: [{ id: "a9", name: "加冰", delta: 0 }],
      tags: ["饮品", "清爽"],
    },
    {
      id: "p_115",
      categoryId: "c_5",
      name: "冰豆花",
      image: "https://images.unsplash.com/photo-1627735483798-0ac51442f0ca?w=800",
      basePrice: 10,
      specs: [{ id: "s1", name: "碗", delta: 0 }],
      addons: [{ id: "a10", name: "加红糖", delta: 1 }],
      tags: ["甜品", "饮品"],
    },
    {
      id: "p_116",
      categoryId: "c_2",
      name: "干锅肥肠",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
      basePrice: 48,
      specs: [
        { id: "s1", name: "标准", delta: 0 },
        { id: "s2", name: "加量", delta: 12 },
      ],
      addons: [{ id: "a11", name: "加土豆", delta: 4 }],
      tags: ["重口", "下饭"],
    },
    {
      id: "p_117",
      categoryId: "c_2",
      name: "毛血旺",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
      basePrice: 58,
      specs: [
        { id: "s1", name: "中辣", delta: 0 },
        { id: "s2", name: "特辣", delta: 0 },
      ],
      addons: [{ id: "a12", name: "加午餐肉", delta: 6 }],
      tags: ["招牌", "聚餐"],
    },
    {
      id: "p_118",
      categoryId: "c_2",
      name: "椒盐排骨",
      image: "https://images.unsplash.com/photo-1600891963935-c1f6bb4d88f0?w=800",
      basePrice: 46,
      specs: [
        { id: "s1", name: "小份", delta: 0 },
        { id: "s2", name: "大份", delta: 10 },
      ],
      addons: [],
      tags: ["香脆", "热销"],
    },
    {
      id: "p_119",
      categoryId: "c_3",
      name: "腊味煲仔饭",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
      basePrice: 26,
      specs: [{ id: "s1", name: "标准", delta: 0 }],
      addons: [{ id: "a13", name: "加香肠", delta: 5 }],
      tags: ["主食", "饱腹"],
    },
    {
      id: "p_120",
      categoryId: "c_3",
      name: "酸辣粉",
      image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800",
      basePrice: 18,
      specs: [
        { id: "s1", name: "标准", delta: 0 },
        { id: "s2", name: "加粉", delta: 4 },
      ],
      addons: [{ id: "a14", name: "加牛肉", delta: 7 }],
      tags: ["酸辣", "主食"],
    },
    {
      id: "p_121",
      categoryId: "c_4",
      name: "椒麻鸡爪",
      image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800",
      basePrice: 24,
      specs: [{ id: "s1", name: "6只", delta: 0 }],
      addons: [],
      tags: ["冷盘", "开胃"],
    },
    {
      id: "p_122",
      categoryId: "c_4",
      name: "炸鲜奶",
      image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=800",
      basePrice: 16,
      specs: [{ id: "s1", name: "标准", delta: 0 }],
      addons: [{ id: "a15", name: "加炼乳", delta: 2 }],
      tags: ["甜品", "小吃"],
    },
    {
      id: "p_123",
      categoryId: "c_5",
      name: "杨枝甘露",
      image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=800",
      basePrice: 16,
      specs: [
        { id: "s1", name: "中杯", delta: 0 },
        { id: "s2", name: "大杯", delta: 3 },
      ],
      addons: [{ id: "a9", name: "加冰", delta: 0 }],
      tags: ["饮品", "人气"],
    },
    {
      id: "p_124",
      categoryId: "c_6",
      name: "番茄蛋花汤",
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800",
      basePrice: 16,
      specs: [
        { id: "s1", name: "小份", delta: 0 },
        { id: "s2", name: "大份", delta: 6 },
      ],
      addons: [{ id: "a16", name: "加豆腐", delta: 3 }],
      tags: ["汤羹", "家常"],
    },
    {
      id: "p_125",
      categoryId: "c_6",
      name: "菌菇老鸭汤",
      image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800",
      basePrice: 38,
      specs: [
        { id: "s1", name: "2人份", delta: 0 },
        { id: "s2", name: "4人份", delta: 18 },
      ],
      addons: [{ id: "a17", name: "加粉丝", delta: 4 }],
      tags: ["滋补", "汤羹"],
    },
  ],
};

const coupons: Coupon[] = [
  { id: "cp_10", title: "满30减10", threshold: 30, discount: 10, scope: "STORE" },
  { id: "cp_5", title: "无门槛减5", threshold: 0, discount: 5, scope: "STORE" },
  { id: "cp_20", title: "满60减20", threshold: 60, discount: 20, scope: "STORE" },
  { id: "cp_12", title: "满88减12", threshold: 88, discount: 12, scope: "STORE" },
];

const paymentMethods: PaymentMethod[] = [
  { id: "ONLINE", name: "在线支付", enabledModes: ["DINE_IN", "DELIVERY", "PICKUP"] },
  { id: "COD", name: "货到付款", enabledModes: ["DELIVERY"] },
  { id: "PAY_AT_STORE", name: "到店支付", enabledModes: ["DINE_IN", "PICKUP"] },
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
      discounts:
        input.discount > 0 ? [{ name: "优惠券", amount: input.discount }] : [],
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
      text: "支付成功",
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
      if (status === "PREPARING")
        return ["ACCEPTED", "PREPARING", "DELIVERING", "READY_FOR_PICKUP"].includes(
          order.orderStatus,
        );
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
      text: nextStatus === "CANCELLED" && reason ? `已取消（${reason}）` : statusText(nextStatus),
      ts: now(),
      operator: "MERCHANT",
    });
    return entry.order;
  },
};
