## Web3 DAPP – Cyberpunk Landing & Core Flows (Expo App PRD)

### 1. 产品概述

- **产品类型**: Web3 钱包内 DAPP 客户端（Expo / React Native）
- **目标**: 在移动端提供一个视觉统一的 cyberpunk 风格 DAPP 入口，支持：
  - 连接钱包
  - 代币购买 / 赎回（Buy / Redeem）
  - 代币转账（Transfer）
  - 管理员市场管理（Admin / Market management）
- **风格**: Cyberpunk + glassmorphism + neon（深色背景、霓虹主色）

### 2. 视觉与交互规范（用于 Expo UI 实现）

- **配色（优先在 theme 中统一定义）**
  - 背景色: `#0F0F23`
  - 正文文字: `#E2E8F0`
  - 次级文字: `#94A3B8`
  - 主色（Primary / Accent）: `#7C3AED`
  - 次主色（Secondary）: `#A78BFA`
  - CTA / 强调色: `#F43F5E`
- **字体（Expo 可用接近风格）**
  - 标题: 类似 `Orbitron`（科幻/几何无衬线）
  - 正文: 类似 `Exo 2`（现代无衬线）
- **玻璃拟态卡片**
  - 背景: `rgba(255,255,255,0.05)` 或同等透明度
  - 描边: `rgba(255,255,255,0.10)`
  - 模糊: `backdropBlur` / 阴影模拟玻璃高光
- **交互要求（遵守 ui-ux-pro-max 样式规范）**
  - 所有可点击卡片/按钮必须有 **`cursor-pointer` / 明显点击态**（移动端即视觉反馈）
  - Hover/Press 状态: 颜色/阴影变化，不要造成布局抖动
  - 所有点击区域最小尺寸 ≥ 44x44 pt
  - 焦点/选中状态（适配无障碍）: 有明显边框或光晕

### 3. App 结构 & 导航

Expo 应用采用 **Stack + Tabs 或 Stack + Drawer**（具体导航实现可以在技术设计中确定），但功能上需要以下主入口：

1. **Landing（首页）**
2. **Buy / Redeem 页面**
3. **Transfer 页面**
4. **Admin / 管理员页面**

所有主入口都需要从 Landing 上可达。

---

### 4. Landing Page（首页）— 功能需求

#### 4.1 Hero 区域

- **内容**
  - 标题: “Build on Chain” 或中文同义标题（可多语言）
  - 副标题: 简要说明 “Token marketplace, transfers, admin tools…”
  - 主 CTA 按钮:
    - 「Connect Wallet」/ 「连接钱包」
    - 「Explore Marketplace」/ 「进入市场」
- **功能**
  - **未连接钱包**
    - 「Connect Wallet」按钮调起钱包连接流程（参考 RainbowKit / wagmi 对应的移动端方案，Expo 侧可以对接 WalletConnect/Deep Link）。
    - 按钮文案和图标需清晰表示为“连接钱包”。
  - **已连接钱包**
    - Hero 区域可以显示已连接钱包的地址简写（如 `0x1234...abcd`）。
    - 「Connect Wallet」按钮改为「Connected」样式或次要按钮，避免引导重复连接。

#### 4.2 Glassmorphism 功能卡片（Why This DAPP）

- **卡片数量**: 至少 3 张
  1. Instant Swaps – “Buy token with ETH or redeem to ETH on Sepolia”
  2. One-Click Connect – “MetaMask, WalletConnect, Coinbase…”
  3. Marketplace – “Transparent pricing and admin controls”
- **功能**
  - 卡片本身可以点击，点击后滚动/跳转到对应功能区（Buy / Transfer / Admin）或打开相应 Tab。
  - 无需在卡片上直接发交易，但要清晰说明该功能在 App 中存在。

#### 4.3 Featured DAPP Gallery（功能入口宫格）

- **内容**
  - 至少 3 个入口:
    - MikaToken – Buy / Redeem → 跳转到 Buy 页面
    - Transfer – Send tokens → 跳转到 Transfer 页面
    - Admin – Market & Treasury Management → 跳转到 Admin 页面
- **功能**
  - 每个入口是一个玻璃风格卡片：
    - 标题 + 简短描述
    - 图标（Lucide / SVG, 不用 emoji）
    - 「Open」/ 「进入」小标签
  - 点击行为:
    - 导航到对应页面（使用 React Navigation）。

#### 4.4 Wallet Connection Demo 区块

- **内容**
  - 标题: “Connect Wallet”
  - 文本:
    - 未连接: “Connect to use buy, transfer and admin”
    - 已连接: “You are connected” + 显示当前地址（可折叠/单行展示）
  - 操作按钮:
    - 「Connect Wallet」或「Change Wallet」
    - 快捷入口按钮: 「Buy / Redeem」「Transfer」（仅在已连接时展示）
- **功能**
  - 未连接:
    - 点「Connect Wallet」调起钱包连接流程。
  - 已连接:
    - 显示地址、提供快速跳转到 Buy / Transfer 页。

#### 4.5 Creator Spotlight 区块

- **内容**
  - 至少一个卡片:
    - 名称: “MikaToken”
    - 角色: “ERC20 + Market”
    - Tag: “Sepolia”
  - 可扩展为多项目列表。
- **功能**
  - 点击卡片可跳转到相关详情页（MVP 可先跳到 Buy 页面或简单链接）。

#### 4.6 Marketplace Preview 区块

- **内容**
  - 标题: “Marketplace Preview”
  - 文本: 简要描述支持的交易类型（Buy / Redeem / Transfer / Admin）。
  - 三个操作块:
    1. Buy / Redeem – “ETH ⇄ Token”
    2. Transfer – “Send tokens”
    3. Admin – “Owner only”
- **功能**
  - 点击对应块跳转到 Buy / Transfer / Admin 页面。

---

### 5. Buy / Redeem 页面（与现有 Web DAPP 对齐）

> 该部分 PRD 主要用于 Expo 侧对齐行为，具体合约地址、ABI、链 ID 与当前 web 项目保持一致（如 Sepolia）。

#### 5.1 前提条件

- 必须已连接钱包，且当前链为 **Sepolia**（或配置中的目标链）。
- 如链不正确，需要有 **切换链提示**。

#### 5.2 功能需求

1. **显示基础信息**
   - Token 名称、符号（如从合约 `name` / `symbol` 读取）
   - 用户当前 Token 余额
   - 合约总供应量（可选）
2. **Buy（购买）**
   - 输入 ETH 数量
   - 显示预估可获得 Token 数量（根据合约逻辑）
   - 点击「Buy」发起交易
   - 异步状态: 加载中、成功、失败提示（错误信息简单清晰）
3. **Redeem（赎回为 ETH）**
   - 输入要赎回的 Token 数量
   - 显示预估得到的 ETH 数量
   - 点击「Redeem」发起交易
   - 提示与 Buy 一致
4. **链错误处理**
   - 当前链不是目标链时，界面显著提示并引导用户在钱包中切换链。

---

### 6. Transfer 页面

#### 6.1 前提条件

- 已连接钱包并在目标链。

#### 6.2 功能需求

1. **输入信息**
   - 目标地址（带基础格式校验）
   - 转账 Token 数量
2. **转账行为**
   - 点击「Transfer」调用合约 `transfer` 或等价方法
   - 异步状态 & 错误/成功反馈
3. **余额展示**
   - 展示当前 Token 余额（供用户参考）。

---

### 7. Admin 页面（管理员 / 市场运营）

> 仅合约 Owner 可以执行特定操作，界面需要明显标记「Owner only」。

#### 7.1 前提条件

- 已连接钱包。
- 需要知道当前连接地址是否为合约 Owner（从合约读 Owner 地址并对比）。

#### 7.2 功能模块（参考现有 Web Admin 功能）

1. **资金与市场操作**
   - 从市场/合约中提取 ETH（Withdraw ETH）。
   - 把 ETH 发送到市场合约。
   - 授权市场合约使用当前合约 Token（Approve）。
2. **权限提示**
   - 非 Owner 用户访问 Admin 时:
     - 显示 “You are not the owner” 提示
     - 隐藏或禁用需要 Owner 权限的操作按钮

---

### 8. 钱包与链管理（Expo 侧）

> 技术实现细节（WalletConnect、Deep Link、Expo Router 等）放在技术设计文档，这里只描述需求。

- **连接钱包**
  - App 需要支持至少一种通用连接方式（如 WalletConnect），用于连接常见钱包（MetaMask Mobile、Rainbow、Coinbase 等）。
  - 连接成功后，在全局状态中保存地址与当前链 ID。
- **链检查**
  - 在 Buy / Transfer / Admin 页面，需要校验当前链是否为目标链（Sepolia）。
  - 如不匹配，页面提示“请在钱包中切换到 Sepolia”，并禁用发送交易按钮。

---

### 9. 非功能性需求

- **性能**
  - 避免每次进入页面都重复拉取同一合约数据，可使用简单缓存或状态管理。
- **可用性 & 无障碍**
  - 所有按钮/卡片有明显按压反馈。
  - 文字对比度满足深色背景下可读性要求。
- **一致性**
  - 所有页面背景统一使用 `#0F0F23` 或从该色系衍生。
  - 卡片、按钮、标题风格与 Landing 保持统一的 cyberpunk / glassmorphism 风格。

---

### 10. MVP 范围总结

1. Expo App 内实现一个 **Cyberpunk 风格 Landing 页**，包含:
   - Hero + CTA（Connect Wallet / Explore Marketplace）
   - Glassmorphism 功能卡片
   - Featured DAPP Gallery（跳转 Buy / Transfer / Admin）
   - Wallet Connection Demo（连接状态 + 快捷入口）
   - Creator Spotlight
   - Marketplace Preview（跳转各功能）
2. 实现三个核心业务页面:
   - Buy / Redeem（与当前 Web 合约行为一致）
   - Transfer
   - Admin（Owner 操作）
3. 基础钱包连接与链检查能力。

