# DECISIONS

## 2026-04-01

### Decision 1
- Blocker/Issue: `antd-mobile@5` 与 React 19 存在 peer 兼容风险。
- Options:
1. 继续用 React 19，承担运行期风险。
2. 降级到 React 18，保持组件生态稳定。
- Chosen: 方案 2。
- Why: 本项目是 MVP 演示优先，稳定性高于新特性。
- Impact: 将 `react/react-dom` 与 `@types/react/@types/react-dom` 对齐到 18。

### Decision 2
- Issue: 根目录非空导致 `create-vite .` 非交互模式被取消。
- Options:
1. 手动从零创建工程文件。
2. 先在子目录生成脚手架后并入根目录。
- Chosen: 方案 2。
- Why: 降低人为漏文件风险，保留标准 Vite 初始化结构。

### Decision 3
- Issue: `PICKUP` 模式是否扩展独立页面。
- Options:
1. 新增独立页面。
2. 仅在现有入口/结算/订单详情中做分支。
- Chosen: 方案 2。
- Why: 严格遵守 5 页 MVP 范围，避免范围膨胀。
