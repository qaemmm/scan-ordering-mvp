# 点餐系统 MVP — 一键启动 Prompt

## 使用方法
1. 确认当前目录包含 `docs/spec.md` 与 `docs/checklist.md`。  
2. 启动 Codex 或 Claude Code。  
3. 复制下面完整 Prompt，粘贴执行。  

## Prompt

```text
Read these files first:
- docs/spec.md
- docs/checklist.md

Goal:
Build a pure-frontend React MVP demo with mock APIs only.
Do not integrate real backend/payment/map/push services.

Execution Mode:
- Default to autonomous execution.
- Do not stop for minor ambiguity.
- Only pause if one of these happens:
  1) architecture-level conflict,
  2) requirement conflict that changes demo flow,
  3) core flow cannot be validated end-to-end.

If paused:
- Log blocker in DECISIONS.md with:
  - Date
  - Blocker
  - Why it blocks
  - Options considered
  - Proposed decision

Non-blocking ambiguity:
- Make a reasonable local decision and log it in DECISIONS.md.

Hard Constraints:
- Keep scope to 5 pages:
  - /
  - /store/:storeId/menu
  - /store/:storeId/checkout
  - /orders/:orderId
  - /merchant/orders
- Keep PICKUP mode as branch logic only. No extra pages.
- Use MSW for mock APIs.
- Keep user side mobile-first and merchant side desktop-friendly.
- Reuse components and shared types.

Build Order:
1) Project skeleton + dependencies + router + base theme.
2) Types + API client + MSW handlers + seed data.
3) Core pages in order:
   Entry -> Menu/Cart -> Checkout -> OrderDetail -> MerchantBoard
4) Status sync:
   Merchant updates should be visible on user order detail via polling (3-5s).
5) Empty/error/loading states.
6) Verification and fixes.

Verification Requirements:
- Run build successfully.
- Verify the full demo path defined in docs/spec.md.
- Confirm data consistency between user and merchant views.
- Confirm status transition timeline updates within 5 seconds after merchant action.

Output Format at the end:
1) What was built (short summary)
2) What decisions were made (from DECISIONS.md)
3) What remains (if anything)
4) How to run and demo the project

Start now.
```
