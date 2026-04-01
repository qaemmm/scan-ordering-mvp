# 点餐系统 MVP — 需求规格

## 项目概览
| 项目 | 说明 |
|------|------|
| 产品名称 | 点餐系统 MVP Demo |
| 技术栈 | React + TypeScript + Vite + React Router + Ant Design Mobile + Ant Design + MSW |
| 目标用户 | 用户端：堂食/外卖/自取点餐用户；商家端：店员/店长 |
| 交付目标 | 纯前端 + Mock API 演示闭环，不接真实后端 |
| 设计风格 | 清晰、可读、移动端优先（用户端），桌面信息密度优先（商家端） |

## 设计规范
- 主色调：`#E85D2A`（品牌橙）
- 辅助色：`#1F2937`（主文本）、`#64748B`（次文本）、`#F8FAFC`（背景）
- 成功/警告/失败：`#16A34A` / `#D97706` / `#DC2626`
- 圆角：卡片 `12px`，按钮 `10px`
- 字体：`PingFang SC, Microsoft YaHei, sans-serif`
- 间距：4pt 栅格（4/8/12/16/24）
- 动效：页面进入淡入 180ms；抽屉/弹窗 220ms

## 页面/接口清单

### 页面 1：入店与方式选择页 `/` `[P0]`
**布局：** 门店信息卡 + 方式选择分段控件（堂食/外卖/自取）+ 条件输入区（桌号或地址）+ 进入菜单按钮。  
**交互：**
- 选择 `DINE_IN`：必须绑定桌号，可填写人数。
- 选择 `DELIVERY`：必须选择地址。
- 选择 `PICKUP`：选择取餐时间（立即/预约），不新增页面。
- 进入菜单前校验必填，失败给错误提示。
**Mock 数据：**
- `Store`: `id/name/minOrderAmount/deliveryFee/supportModes`
- `Table`: `tableNo/capacity`
- `Address`: `id/name/phone/detail/lng/lat`
**接口：**
- `GET /api/stores/:storeId`
- `GET /api/users/me/addresses`

### 页面 2：菜单页 `/store/:storeId/menu` `[P0]`
**布局：** 分类栏 + 菜品列表 + 购物车浮条 + 规格加料弹窗 + 购物车抽屉。  
**交互：**
- 分类切换后滚动到对应分组。
- 点击菜品打开规格/加料弹窗，确认后加购。
- 浮条显示件数和小计，购物车可加减删。
- 购物车为空时“去结算”不可用。
**Mock 数据：**
- `MenuCategory`: `id/name/sort`
- `MenuItem`: `id/categoryId/name/basePrice/specs/addons/tags/image`
- `CartItem`: `id/productId/specId/addonIds/qty/unitPrice/subtotal`
**接口：**
- `GET /api/stores/:storeId/menu`
- `POST /api/cart/validate`（可选，默认返回通过）

### 页面 3：结算页 `/store/:storeId/checkout` `[P0]`
**布局：** 订单信息区（地址/桌号/取餐信息）+ 优惠券区 + 支付方式区 + 金额明细区 + 提交按钮。  
**交互：**
- 外卖显示地址与送达时间；堂食显示桌号；自取显示取餐时间。
- 优惠券单选，实时刷新应付金额。
- 支付方式按模式可用性控制（例如堂食可到店支付）。
- 提交订单后进入创建中状态，成功跳订单详情。
**Mock 数据：**
- `Coupon`: `id/title/threshold/discount/scope`
- `PaymentMethod`: `id/name/enabledModes`
- `CheckoutSummary`: `itemsTotal/discount/deliveryFee/payable`
**接口：**
- `POST /api/orders`
- `POST /api/payments/create`
- `POST /api/payments/confirm`

### 页面 4：订单详情/状态追踪页 `/orders/:orderId` `[P0]`
**布局：** 状态头部 + ETA/模式信息 + 时间线 + 订单商品列表 + 地图占位（外卖）+ 操作区。  
**交互：**
- 状态展示：`PENDING_PAYMENT/PAID/ACCEPTED/PREPARING/DELIVERING/READY_FOR_PICKUP/DONE/CANCELLED`
- 每 3-5 秒轮询订单状态并更新时间线。
- 外卖显示 ETA 和地图占位；堂食显示桌号；自取显示取餐码/时间。
- `PENDING_PAYMENT` 和 `ACCEPTED` 可取消，其他状态不可取消。
**Mock 数据：**
- `Order`: `id/mode/payStatus/orderStatus/estimateArrivalTime/items/discounts/address/tableNo`
- `TimelineEvent`: `code/text/ts/operator`
**接口：**
- `GET /api/orders/:orderId`
- `GET /api/orders/:orderId/timeline`
- `POST /api/orders/:orderId/cancel`（可选）

### 页面 5：商家订单看板页 `/merchant/orders` `[P0]`
**布局：** 顶部筛选 + 三栏列表（新订单/制作中/已完成）+ 订单卡操作按钮。  
**交互：**
- 新单可接单/拒单。
- 制作中可改为出餐完成（堂食/自取）或配送中（外卖）。
- 已完成仅查看。
- 改状态后用户端轮询应看到变化。
**Mock 数据：**
- `MerchantOrder`: `id/mode/orderStatus/payStatus/itemsSummary/note/contact`
**接口：**
- `GET /api/merchant/orders?status=NEW|PREPARING|DONE`
- `POST /api/merchant/orders/:id/accept`
- `POST /api/merchant/orders/:id/status`

## 全局 Mock 数据定义

```ts
type OrderMode = "DINE_IN" | "DELIVERY" | "PICKUP";
type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "ACCEPTED"
  | "PREPARING"
  | "DELIVERING"
  | "READY_FOR_PICKUP"
  | "DONE"
  | "CANCELLED";

interface Store {
  id: string;
  name: string;
  minOrderAmount: number;
  deliveryFee: number;
  supportModes: OrderMode[];
}

interface SessionContext {
  storeId: string;
  mode: OrderMode;
  tableNo?: string;
  addressId?: string;
  pickupTime?: string;
}
```

统一约束：
- 所有金额单位统一为元，保留两位小数。
- 时间统一使用本地时区字符串和 Unix 时间戳双存储。
- 状态变更以订单主状态为准，支付状态独立维护。

## 交互规范
- 全局 loading：按钮提交态最短 600ms，普通列表最短骨架 400ms。
- 成功反馈：右上角轻提示 1.5s；关键动作（下单）显示“成功并跳转”。
- 失败反馈：接口错误统一 Toast + 页内重试入口。
- 空态至少覆盖：菜单空、购物车空、订单空、商家无新单。
- 网络弱网处理：轮询失败连续 3 次后显示“状态同步延迟”提示，不中断页面使用。
- 路由保护：
- 结算页必须有购物车数据。
- 订单页必须有 `orderId`。
- 商家页无需登录，但默认展示“Demo 环境”标识。

## 演示路线
1. 进入 `/`，选择 `DELIVERY`，选择地址，进入菜单页。  
2. 在菜单页选择 1 个含规格/加料的菜品加购，进入结算页。  
3. 在结算页选择优惠券与支付方式，提交订单并模拟支付成功。  
4. 跳转订单详情页，确认状态为 `PAID` 且时间线存在“订单提交/支付成功”。  
5. 打开 `/merchant/orders`，接单并改为 `PREPARING`。  
6. 回到订单详情页，5 秒内看到状态更新。  
7. 商家端继续改为 `DONE`，用户端最终状态完成，演示闭环结束。  

## 非目标（本期不做）
- 真实支付通道接入
- 真实地图 SDK 和轨迹
- 复杂营销规则（叠券、阶梯满减）
- 会员体系和真实认证
- 推送服务端（仅轮询模拟）
