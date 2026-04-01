# MVP Autopilot — AI 驱动的最小可行产品一次性交付方法论

> **当前形态：** 方法论文档（.md）
> **未来形态：** 封装为 Claude skill（验证好用后加 frontmatter + evals）
> **适用场景：** 个人开发者 / 小团队，10-30 个页面或接口的 MVP 项目
> **不适用：** 分布式大型系统、需要多人协作 Git 流程的正式项目

---

## 〇、核心理念

**你不是程序员，你是甲方。**

传统用法：你 ↔ AI，一问一答，逐模块确认，本质上你还是在"盯着工人干活"。
本方法论：你只负责两件事——**签字（审批计划）** 和 **验收（看最终结果）**。中间的拆任务、写代码、自测、整合，全部交给 AI 自主完成。

这套方法论的目标是把你的介入降到最低：

```
介入点          你花的时间      你做的事
─────────────  ────────────  ──────────────
需求讨论        10-30 min     和 AI 对话描述你要什么
审批计划        2-3 min       扫一眼文档，确认方向没跑偏
启动执行        30 sec        粘贴 prompt，回车
验收结果        10-20 min     跑起来点点看，提修改意见
```

---

## 一、阶段模型：四步走

整个流程固定为四个阶段，每个 MVP 项目都走这套：

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌────────────┐
│  PHASE 1    │ →  │  PHASE 2     │ →  │  PHASE 3     │ →  │  PHASE 4   │
│  需求锁定    │    │  计划生成     │    │  自主执行     │    │  验收修补   │
│  (人+AI)    │    │  (AI 为主)   │    │  (AI 裸奔)   │    │  (人为主)  │
└─────────────┘    └──────────────┘    └──────────────┘    └────────────┘
   你主导              AI 主导            AI 全自动           你主导
   10-30 min           AI 生成你审批       30-90 min          10-20 min
```

---

## 二、PHASE 1：需求锁定

### 目标
把你脑子里的模糊想法变成 AI 能精确执行的文档。

### 输出物
1. **需求规格文档** (`spec.md`) — 页面/接口列表、Mock 数据定义、交互规范
2. **开发清单** (`checklist.md`) — 按步骤排列的任务、优先级、预估时间

### 怎么做

和 AI（Claude / ChatGPT / 任何你喜欢的）对话，用以下模板引导：

```markdown
# 需求沟通模板

## 项目一句话描述
[例：菲律宾市场的会员营销系统 Demo]

## 目标用户
[例：菲律宾中小商家 + 他们的会员用户]

## 核心场景（按优先级排）
1. [例：用户登录 → 看到会员卡 → 签到赚积分]
2. [例：商家看 Dashboard → 搜会员 → 创建活动]
3. ...

## 技术约束
- 前端/全栈/后端？
- 技术栈偏好？
- 需要真实后端还是 Mock？
- 移动端/PC/都要？

## 设计偏好
- 风格关键词：[例：年轻活泼 / 专业克制 / 极简]
- 主色调：[如果有的话]
- 参考产品：[如果有的话]

## 特殊要求
[例：全英文界面、货币用 ₱ PHP、日期 MM/DD/YYYY]
```

### 关键原则

**在这个阶段多花 10 分钟，执行阶段少踩 2 小时的坑。**

需求文档的质量直接决定了 AI 裸奔的成功率。以下信息必须锁死：

- **数据结构**：每个实体的字段名、类型、示例值（不要让 AI 自己编）
- **页面/接口清单**：完整列表 + 优先级标注
- **交互规范**：按钮点了之后发生什么、loading 多久、成功/失败提示是什么
- **边界条件**：空状态长什么样、列表没数据时显示什么

**反模式：** "帮我做一个会员系统" ← 太模糊，AI 会自由发挥，结果你不满意
**正确姿势：** 给出上面模板级别的具体信息，然后让 AI 帮你补全成完整文档

### 需求文档自检清单

在进入 PHASE 2 之前，确认以下问题都有答案：

```
[ ] 所有页面/接口都列出来了？
[ ] 每个页面的布局大致清楚？（文字描述或 ASCII 线框图）
[ ] Mock 数据的字段和示例值定义了？
[ ] 交互反馈统一了？（loading 时长、Toast 样式、错误处理）
[ ] 设计规范明确了？（颜色、圆角、字体、间距风格）
[ ] 优先级标了？哪些是必须做的，哪些可以简化？
```

---

## 三、PHASE 2：计划生成

### 目标
让 AI 基于需求文档生成可执行的开发清单，你只需要审批。

### 输出物
1. **开发清单** (`checklist.md`) — 任务步骤、优先级、预估时间、依赖关系
2. **架构决策** — 项目结构、路由设计、共享组件规划
3. **一键启动 Prompt** (`autopilot-prompt.md`) — 复制粘贴就能跑的执行指令

### Prompt 模板：让 AI 生成计划

```markdown
请基于以下需求文档，生成开发任务清单：

1. 拆成具体步骤，每步只做一件事
2. 标注优先级（P0 必做 / P1 应做 / P2 可简化）
3. 标注预估时间
4. 标注步骤间的依赖关系
5. 先骨架和数据层，再页面，最后润色
6. 给出架构决策建议（项目结构、路由设计、共享组件）

同时生成一份"一键启动 Prompt"，
让我可以直接粘贴给 Claude Code / Codex 一次性跑完整个项目。

[粘贴你的 spec.md 内容]
```

### 你的审批（2-3 分钟）

拿到计划后，只检查三件事：

1. **方向对不对** — 技术栈、项目结构、路由设计是否符合你的预期
2. **优先级对不对** — P0 的页面是不是真正核心的那几个
3. **有没有遗漏** — 有没有你很在意但 AI 降级成 P2 的功能

不需要逐行审查。方向对了就放手。

---

## 四、PHASE 3：自主执行

### 目标
AI 拿着文档和计划，全自动完成编码，不需要你盯着。

### 最小执行原则

为了不让"不要停下来问我"变成"瞎做也别停"，这里补三条最小约束：

1. **默认自主决策继续做**，不要频繁打断
2. **只有关键阻塞才停下来**：影响整体架构、需求明显冲突、或核心流程无法验证时，才暂停并记录 blocker
3. **完成后必须自检**：至少确认能运行、核心演示链路走通、关键决策已记录

### 三条执行路线

根据项目规模选择：

#### 路线 A：串行裸奔（推荐，最省心）

**适合：** 15 个页面以下、纯前端或简单全栈
**工具：** 1 个 Claude Code 或 Codex 实例
**你做的事：** 粘贴 prompt → 离开 → 回来验收

```bash
# 进入项目目录
cd your-project

# 确保文档在目录里
# - spec.md（需求文档）
# - checklist.md（开发清单）

# 启动 Claude Code（或 Codex）
claude  # 或 codex

# 粘贴一键启动 prompt，回车，走人
```

**一键启动 Prompt 模板：**

```
Read `spec.md` and `checklist.md` in this directory.
Build the complete project following the checklist from start to finish.

Rules:
- Default to autonomous execution; do not stop for minor ambiguity
- If a decision affects overall architecture, reveals requirement conflicts, or blocks the core demo flow, pause and log the blocker in DECISIONS.md
- Make reasonable decisions when ambiguity is local, and log them in DECISIONS.md
- Follow the architecture decisions in the checklist
- After completing all steps, run the project and verify it compiles
- Verify the core demo flow defined in spec.md
- Print a summary of what was built

GO.
```

#### 路线 B：并发执行（更快，适合稍大项目）

**适合：** 20+ 页面、前后端分离、模块间依赖低
**工具：** 多个 Claude Code / Codex 实例
**你做的事：** 跑脚本 → 离开 → 回来跑整合

**关键前提：** 骨架必须先串行跑完（项目结构、共享组件、Mock 数据、路由配置），否则并发实例会冲突。

**并发原则：** 小项目可以先用"不要改共享文件"的轻约束；一旦项目变复杂，优先切到独立 branch / worktree 隔离，再做最后整合。

```bash
#!/bin/bash
# mvp-parallel-build.sh

echo "=== Step 1: Skeleton (串行) ==="
claude -p "Read spec.md and checklist.md. Build ONLY the skeleton:
project init, shared components, mock data, routing, layouts.
Do NOT build any page content yet."

echo "=== Step 2: Pages (并发) ==="
claude -p "Read spec.md. Build [页面组A] in the existing project. Do not modify shared files." &
claude -p "Read spec.md. Build [页面组B] in the existing project. Do not modify shared files." &
claude -p "Read spec.md. Build [页面组C] in the existing project. Do not modify shared files." &
wait

echo "=== Step 3: Integration (串行) ==="
claude -p "Review the full project. Fix all import errors, broken routing,
missing exports. Verify it compiles. Verify the core demo flow. Log issues in DECISIONS.md."

echo "=== DONE ==="
```

**并发分组原则：**
- 共享文件（路由、数据、组件库）在骨架阶段全部定稿，并发阶段不允许修改
- 每组页面之间尽量无直接依赖
- 前端和后端天然隔离，是最好的并发切割点
- 每组的 prompt 要明确写 "Do not modify shared files"
- 如果开始频繁撞文件或互相覆盖，直接改用独立 branch / worktree

#### 路线 C：两段式放手（折中，适合前后端都有的项目）

**适合：** 项目有天然的两大模块（如用户端 + 管理后台、前端 + 后端）
**工具：** 1 个 Claude Code / Codex 实例，分两次跑
**你做的事：** 跑第一段 → 花 2 分钟瞄一眼 → 跑第二段 → 验收

```
第一次 prompt: "Build skeleton + [Module A] per spec.md and checklist.md"
→ 你瞄一眼，确认 Module A 基本通了
第二次 prompt: "Now build [Module B] in the same project"
→ 验收
```

### 执行路线选择决策树

```
你的项目有多少页面/接口？
├── < 15 个 → 路线 A（串行裸奔）
├── 15-30 个
│   ├── 模块间依赖多？ → 路线 C（两段式）
│   └── 模块间依赖少？ → 路线 B（并发）
└── > 30 个 → 先拆成多个独立 MVP，每个走路线 A/B
```

### Codex 推理等级选择

```
任务类型                          推理等级
──────────────────────────────  ──────────
需求明确的页面搬砖（大部分情况）     medium
复杂算法 / 多文件联动 bug 调试      high
架构级重构 / 深度推理               xhigh
只读扫描 / 基础测试生成             low（如果用 Codex-Spark）
```

**经验法则：** 文档写得越清楚，越用 medium 就够了。需要 high 通常说明需求文档有模糊地带。

---

## 五、PHASE 4：验收修补

### 目标
花最少的时间把 AI 的输出打磨到可用状态。

### 最小交付标准

交付前至少确认以下四件事：

```
[ ] 项目能启动 / 编译通过
[ ] 核心演示链路能走通
[ ] 主要页面 / 接口已经连通
[ ] 关键决策已记录在 DECISIONS.md
```

### 验收流程

**第一步：能跑吗？（2 分钟）**
```bash
npm start  # 或对应的启动命令
# 能编译通过？页面能打开？
# 如果不能，把错误信息丢给 AI 修
```

**第二步：走演示路线（5-10 分钟）**

在需求文档里你应该定义过核心使用场景。按这个场景走一遍：
- 每个页面能打开吗？
- 核心交互能走通吗？（点击、提交、跳转）
- 数据显示正确吗？
- 样式大致对吗？（不需要完美，MVP 够用就行）

**第三步：收集问题，一次性修（5-10 分钟）**

不要发现一个修一个。把所有问题记下来，一次性丢给 AI：

```
Review the project and fix the following issues:

1. Home page: membership card gradient is missing
2. Points page: check-in calendar doesn't show today highlighted  
3. Dashboard: pie chart colors don't match design spec
4. Router: clicking "Store" tab doesn't navigate correctly
5. [...]

Fix all of them, then verify the project still compiles.
```

### 验收心态

**MVP 的标准是"能演示"，不是"能上线"。**

- 样式差 10% → 接受，后面再调
- 某个 P2 页面内容太简单 → 接受，不影响演示
- 核心流程走不通 → 必须修
- 数据显示明显错误 → 必须修

---

## 六、文档模板库

每个 MVP 项目都产出以下文件，形成标准化交付：

```
your-project/
├── docs/
│   ├── spec.md              ← 需求规格（PHASE 1 产出）
│   ├── checklist.md         ← 开发清单（PHASE 2 产出）
│   └── autopilot-prompt.md  ← 一键启动 Prompt（PHASE 2 产出）
├── DECISIONS.md             ← AI 执行时的自主决策记录（PHASE 3 产出）
└── src/                     ← 代码（PHASE 3 产出）
```

### spec.md 标准结构

```markdown
# [项目名] — 需求规格

## 项目概览
| 项目 | 说明 |
|------|------|
| 产品名称 | |
| 技术栈 | |
| 目标用户 | |
| 设计风格 | |

## 设计规范
- 主色调：
- 辅助色：
- 圆角/字体/间距：

## 页面/接口清单
### 页面 1：[名称] `[路由]` `[优先级]`
**布局：** [ASCII 线框图或文字描述]
**交互：** [按钮点了发生什么]
**Mock 数据：** [字段 + 示例值]

### 页面 2：...

## 全局 Mock 数据定义
[所有数据结构集中定义]

## 交互规范
[统一的 loading、Toast、错误处理规则]

## 演示路线
[核心使用场景的步骤描述，验收时按这个走]
```

### checklist.md 标准结构

```markdown
# [项目名] — 开发清单

## 架构决策
| 决策点 | 结论 | 理由 |
|--------|------|------|

## 任务列表

### Phase 1: 骨架
| Step | 内容 | 时间 | 依赖 |
|------|------|------|------|

### Phase 2: 核心页面（P0）
| Step | 内容 | 时间 | 优先级 |
|------|------|------|--------|

### Phase 3: 次要页面（P1-P2）
...

### Phase 4: 润色
...

## 注意事项备忘
[货币格式、日期格式、设计关键词等]
```

### autopilot-prompt.md 标准结构

```markdown
# [项目名] — 一键启动 Prompt

## 使用方法
1. 把 spec.md 和 checklist.md 放进项目目录
2. 启动 Claude Code / Codex
3. 复制下面的 prompt，粘贴，回车，走人

## Prompt

[完整的启动指令，包含：
- 读哪些文档
- 架构决策摘要
- 设计规范摘要
- 构建顺序
- "不要停下来问我"的明确指令
- 什么情况下允许暂停并记录 blocker
- 完成后做什么（编译验证、验证演示路线、生成 DECISIONS.md）]
```

---

## 七、经验法则 & 避坑指南

### 什么项目适合这套方法论

```
适合 ✅                          不适合 ❌
─────────────────────────────  ─────────────────────────
纯前端 Demo / MVP                分布式微服务架构
10-30 个页面或接口                100+ 接口的大型系统
一个人开发                        多人协作需要 PR 流程
Mock 数据 / 简单后端              复杂的第三方集成（支付、OAuth）
演示用 / 概念验证                  直接上线的生产系统
```

### 提高一次性成功率的关键

1. **Mock 数据写死在文档里** — 不要让 AI 自己编数据，它编的数据往往不符合业务逻辑
2. **交互规范统一** — "所有按钮 loading 1.5s 后成功"比"每个按钮自行决定"好 10 倍
3. **共享组件提前规划** — 在清单里明确列出要复用的组件，AI 会优先实现它们
4. **P2 页面明确降级** — 写清楚"做最简版即可"，不然 AI 会每个页面都做到同样精细
5. **给出演示路线** — AI 会优先保证这条路径的完整性

### 成本控制

- 文档写得好 → medium 推理等级够用 → 省 token
- 串行跑 → 比并发省，因为没有重复加载上下文的开销
- 一键 prompt 里内联关键信息 → 减少 AI 反复读取文件的次数
- 如果用 API：开启 prompt caching，静态文档只付一次钱

---

## 八、升级为 Skill 的路径

当你用这套方法论跑过 3-5 个 MVP 项目后，可以升级为正式 skill：

```
mvp-autopilot/
├── SKILL.md                    ← 本文档精简版（<500 行）
├── references/
│   ├── spec-template.md        ← spec.md 模板
│   ├── checklist-template.md   ← checklist.md 模板
│   └── prompt-templates.md     ← 各路线的 prompt 模板
├── scripts/
│   ├── parallel-build.sh       ← 并发执行脚本
│   └── validate-spec.py        ← 需求文档完整性检查脚本
└── evals/
    └── evals.json              ← 测试用例
```

**触发 description 草稿：**
```
Use this skill when the user wants to build an MVP or demo project 
with AI assistance. Triggers include: "build an MVP", "one-shot project", 
"自动化开发", "让 AI 跑完整个项目", "偷懒开发", or any request to 
generate a complete project from a spec or requirements doc. Also trigger 
when the user mentions Claude Code / Codex orchestration, parallel AI 
coding, or multi-agent development workflows.
```

---

*方法论版本：v1.1-minimal | 2026-04-01*
*本次更新：只补三件事——关键阻塞才暂停、并发优先隔离、交付前最小验收标准*
