# 新西兰 NZ / 菲律宾 PH / 全球 — 站点坑位详段

> 市场码 GLOBAL · 4 段 · 品牌：Mercedes-Benz / Aston Martin / IM Motors 智己
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-10-30 · 文中 snapshotVersion / token / 车型 id 均为当时实测值，必须现取

---

### Mercedes-Benz（NZ 新西兰：Akamai 按数据中心 IP 拦，仅部分 overview 页有价）

| 项 | 内容 |
|---|---|
| **市场** | NZ |
| **坑** | Akamai 按数据中心 IP 拦截（403）；只有 WebFetch 类外部节点可读 |
| **可用** | 部分车型 overview 页 SSR 带 `Estimated Drive Away Price`；无价车型需配置器 |

---

### Aston Martin（官方不公布 MSRP → 按 `官网无价格` 规则出表）

| 项 | 内容 |
|---|---|
| **表现** | 官网 `astonmartin.com`、配置器 `configurator.astonmartin.com`、经销商站三层**均无官方建议零售价** |
| **配置器接口** | `configurator.astonmartin.com`（MHP 提供，Angular SPA）<br>`GET /models/products/{COUNTRY}` → 车型清单（**无价格**）<br>`GET /models/products/{ID}/details` → 相机/环境/动画（**无价格**）<br>`GET /rules/configuration/{ID}?options=...&country=ES` → 完整配置树（**无价格**） |
| **证据** | 三个接口全量 JSON 中 `price`/`amount`/`currency`/`total` 字段**一个都没有**；配置器 UI 从选车到 "Review & Proceed" 全程不显示任何金额 |
| **官方口径** | 配置器免责声明原文：*"This configurator is not an offer to sell... Any purchase is subject to the terms and conditions of sale (**including price**) issued by the particular dealer."* |
| **经销商站陷阱** | `astonmartinmadrid.com` 等经销商站的价格标 **"Vehicles in stock"**，含 `Vendido`(已售)/`Reservado`(已订)/里程/年份 → **库存车单车标价，不是 MSRP，严禁采集** |
| **可比参照** | 同属"官方不公布售价"阵营；自 2026-10-28 起按规则**仍出表**，MSRP 列填 `官网无价格`（DE 已交付 24 行），不再以"无法采集"为由跳过 |
| **技术备注** | 市场清单 `GET /data/api/country-list` 返回 59 个市场（含 ES/GB/US 等）；`/models/products/ES` 可正常返回，证明 ES 市场有效，但同样无价 |

---

### IM Motors 智己（全球站 `www.immotors.com/global/`：站点全通，但**官网不公开价格**）❌

**结论：Next.js 站点、API 全部打通，但**全站 0 价格字段**——配置器只有规格表，没有金额。**

| 项 | 内容 |
|---|---|
| 连通性 | ✅ `https://www.immotors.com/global/landing` 200（阿里云 WAF `yundunwaf4.com`，`47.110.174.185`）|
| 站点性质 | **Next.js**（`portal-cdn-prd.immotors.com/global/_next/...`），页面数据全在 `<script id="__NEXT_DATA__">` |
| **★ 车系（4 款）** | `l6_detail`（IM L6 / SEO 写 "IM5"）· `l7_detail`（IM L7）· `ls6_detail`（IM6）· `ls7_detail`（IM LS7）|
| **★ 配置器** | `/global/vehicle_config/<carType>`，carType ∈ `l6` `l7` `ls6` `ls7` |
| **★ 配置器数据接口（两大真源）** | ① `GET /global/api/portal-international/page/c/v1/query?name=kvVehicleConfig_<carType>ConfigTable&type=function&offset=0&limit=10` —— **返回规格表**（Editor.js JSON，表格结构，含版本列名 + 全部参数）<br>② `GET /global/api/app/generalParameters/v3/getGeneralParameter?key=OfficialInternationalVehicleKv_carTypeList` —— 车型下拉列表 |
| **⚠ 直连 API 会被 WAF 拒** | curl 直接打 ① 返回 `{"resultCode":"10003","message":"错误请求"}`（117 B）——**必须带 `Referer: https://www.immotors.com/global/vehicle_config/<carType>`**，且 WAF 认浏览器 TLS 指纹；**最稳是用 Playwright 页内请求** |
| **★ 价格字段** | 规格表 JSON + 全站 7 个页面（含 contact_us / about_im）**money 正则 0 命中、price/msrp 关键词 0 命中** |
| **★ 版本列表（无价）** | L6: Max Standard / Max Tech / Max Long Range / Max Ultra Long Range / Max Extreme Performance（5）<br>L7: Ultra Long Range / Long Range Performance / Long Range Flagship（3）<br>LS6: Max Standard / Max Long Range / Max Ultra Long Range / Max Extreme Performance（4）<br>LS7: Urban Fit / Urban Fit Pro / Elite RWD / Elite AWD / Lux RWD / Lux AWD / Pro AWD（7）|
| **★ 无购买入口** | 全站 `a[href]` 里**没有任何 buy/order/price/book/reserve 链接**，唯一外链是 Facebook/Instagram；购车只能走 `contact_us` 找经销商 |
| 内网 API 域名 | Next.js host 配置里有 `apiHost:"http://galaxy.immotors.com"` → **curl 000 不通**（内网域名，非公网）|
| **结论** | **官网不公布 MSRP**（海外市场由经销商报价）。取证：`ConfigTable` 规格 JSON 无任何金额字段 + 全站无购买链接 |

> **与 Maserati / McLaren 归为一类**：**「官网不公开价格」**。IM Motors 的取证特点是"**规格给得很全、价格一个字都没有**"——连 `showPrice` 之类的开关都不存在，直接没有该功能。

---

### 其它市场速记（无独立详段）

> 本表只放**没有单独段落**的站点。其余站点的坑位见下方同名详段，按市场的快速索引见文首「0. 站点速查」。

| 站点 | 关键坑 | 价格在哪 |
|---|---|---|
| 领克 lynkco.com | 按出口 IP 地理跳转 .com.cn | 需海外代理 |
| 本田/标致 NZ | Cloudflare 拦截直连 | 车型页 From + ORC |
| 保时捷 NZ | 无价目表 PDF | 车型总览页 astro-island JSON（`modelCards` → `price.formattedValue`） |
| 大众 NZ | 价格只在各车型页 | 每车型页 `Download specs` PDF（含多配置 MRP） |
| BYD NZ | 有官方价格表 | BROCHURE 按钮 → price-list PDF |
| Fiat/Jeep PH | JS 渲染 | 官方导航数据区 `STANDARD MODELS` |
| BMW PH | 车型页无价，藏在 PDF | `BMW Price List` 按钮 → S3 上的价目 PDF（**沙箱封 `*.s3.amazonaws.com`**） |
| 法拉利（全球） | 官方从不公布售价 | 仅经销商询价，**无法采集 MSRP** |
| Aston Martin（全球含 ES / DE） | 官方从不公布售价；配置器全链路无价格字段 | 仅经销商报价；**仍出表**，MSRP 填 `官网无价格`（DE 24 行已交付，详见下） |
