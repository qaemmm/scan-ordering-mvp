# 香港馄饨扫码点餐 Demo

用于销售内部评审的前端演示项目（React + Vite），核心能力：
- 顾客端扫码点单闭环（堂食 / 外送 / 自取）
- 商家端接单与状态流转
- 轻量 AI 推荐与问答（招牌推荐、双人点单建议）
- MSW 模拟 API（不接真实后端）

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 演示定位

- 当前版本为**内部演示版**，用于销售对齐与需求澄清。
- 支付能力为**演示预留**，不对接 GCash 等本地真实支付。
- AI 能力为轻量推荐，不做完整自然语言 Agent 下单。

## 环境变量

在根目录创建 `.env`，或在 Vercel 配置：

```bash
VITE_ENABLE_MSW=true
```

说明：
- `true`：dev/prod 都启用 MSW（适合演示站）
- 未设置或 `false`：仅本地 dev 启用

## 扫码链接格式

```text
https://<your-domain>/scan?storeId=s_1001&mode=DINE_IN&tableNo=A01
```

字段：
- `storeId`：门店 ID
- `mode`：`DINE_IN | DELIVERY | PICKUP`
- `tableNo`：堂食桌号（`DINE_IN` 必填）

## 部署（Vercel）

1. 推送仓库到 GitHub。
2. 在 Vercel 导入项目（Framework 选 `Vite`）。
3. Build Command：`npm run build`
4. Output Directory：`dist`
5. 设置环境变量 `VITE_ENABLE_MSW=true`（至少 Production）。
6. 如需自定义域名，完成 DNS 绑定。

`vercel.json` 已配置路由回退，刷新 `/scan`、`/orders/...`、`/merchant/orders` 不会 404。
