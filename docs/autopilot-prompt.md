# 香港馄饨扫码点餐 Demo - 一键执行 Prompt

## 使用方法
1. 确认目录包含：`docs/spec.md`、`docs/checklist.md`。
2. 启动 Codex 或 Claude Code。
3. 粘贴下方 Prompt 执行。

## Prompt

```text
Read these files first:
- docs/spec.md
- docs/checklist.md

Goal:
Retrofit the existing ordering project into a Hong Kong wonton QR-ordering demo for internal sales review.
Do NOT rebuild from scratch.

Execution Mode:
- Default to autonomous execution.
- Do not pause for minor ambiguity.
- Pause only when:
  1) architecture-level conflict,
  2) requirement conflict affecting demo flow,
  3) core flow cannot be validated end-to-end.

If paused:
- Log blocker in DECISIONS.md with date, blocker, impact, options, and proposed decision.

For non-blocking ambiguity:
- Make a reasonable local decision and log it in DECISIONS.md.

Hard Constraints:
- Keep existing route skeleton:
  - /
  - /store/:storeId/menu
  - /store/:storeId/checkout
  - /orders/:orderId
  - /merchant/orders
- Replace current generic/Sichuan menu and copy with Hong Kong wonton brand content.
- Prioritize fixing Chinese copy quality and garbled text.
- Keep SPA + MSW architecture.
- Payment in v1 must remain simulated/reserved (no real local payment integration such as GCash).
- AI in v1 must be lightweight recommendation/Q&A only.
- Do not build full natural-language order agent.
- Do not add membership marketing automation features.

Build Order:
1) Copy and text quality pass (fix garbled strings, unify UI copy).
2) Brand and SKU data retrofit (Hong Kong wonton categories/items/specs/addons).
3) Visual style retrofit (simple, flat, light, Apple-like direction).
4) Checkout payment wording and flow alignment (reserved/simulated).
5) Lightweight AI recommendation entry and suggested prompts.
6) End-to-end demo validation and final cleanup.

Verification Requirements:
- Build succeeds.
- Lint/type checks used by project remain passing.
- Demo flow runs end-to-end:
  customer scan/entry -> menu -> checkout -> order detail -> merchant board status update -> customer status sync.
- Menu and brand language are Hong Kong wonton aligned.
- UI style is visibly simplified and flattened compared to baseline.

Output Format at the end:
1) What changed (by capability area)
2) Decisions made (from DECISIONS.md)
3) Remaining gaps (if any)
4) How to run and demo internally
```
