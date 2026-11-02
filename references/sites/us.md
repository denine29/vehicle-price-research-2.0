# 美国 US — 站点坑位详段

> 市场码 US · 3 段 · 品牌：Cadillac / Mazda / Lotus
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-10-30 · 文中 snapshotVersion / token / 车型 id 均为当时实测值，必须现取

---

### Cadillac（US 美国 `www.cadillac.com`：**全通，价格 SSR 内联，可采**）✅

**结论：GM 官网（AEM + Akamai），curl 即可拿到全部车型起价与各 trim 售价；价格以纯 HTML 形式内联在导航与车型页的 `gb-` 组件里。**

| 项 | 内容 |
|---|---|
| 连通性 | ✅ curl 200（1.3–2.1 MB/页）。⚠ 与 Chevrolet/Volvo 同款：**无头 Playwright 403，有头（xvfb + `headless=False`）200**；curl 直接可用 |
| **★ 价格源 ①（全系起价）** | 任意页面的**导航菜单**：每个车型条目 `title="YYYY MODEL" data-dtm="global nav:..."` 后跟 **`From: $X`**。这是官网「该车型最低配置起价」 |
| **★ 价格源 ②（trim 级售价）** | **车型页主体**的 `CHOOSE YOUR ...` 区块：`TRIM NAME` 紧跟 **`From: $X`**（如 `LUXURY` / `SPORT` / `PREMIUM LUXURY` / `SIGNATURE LUXURY` / `PLATINUM` / `V-SERIES` …）|
| **★ 区分导航 vs 主体** | 导航条目前 400 字符内含 `data-dtm="global nav`；**主体 trim 块不含** → 用此条件过滤，否则会把别车价格串进来 |
| **★ 年款分层（关键！）** | 官网同时在售 **MY2027 / MY2026 / MY2025 三代**，**且三代车型清单不同**（不是同一批车换年份）。URL 规则：**当年代** = `/electric/lyriq`、`/sedans/ct4`、`/suvs/escalade`；**上一年度** = 加 `preceding-year/`（`/electric/preceding-year/lyriq`）。⚠ 2025 只在导航里带价，其页面多半已变成 `Cadillac Legacy Vehicles`（无价） |
| **★ 各年款车型清单** | **MY2027（9 款）**：ESCALADE · ESCALADE ESV · ESCALADE-V · ESCALADE-V ESV · VISTIQ · LYRIQ · LYRIQ-V · OPTIQ · OPTIQ-V<br>**MY2026（17 款）**：上述 9 款 + **ESCALADE IQ · ESCALADE IQL · XT5 · CT5 · CT5 V-SERIES · CT4 · CT4 V-SERIES · CELESTIQ**（即 IQ/IQL 与燃油轿车仅有 2026 款）<br>**MY2025（6 款）**：ESCALADE IQ · XT4 · CT5 · CT4 · CT4 V-SERIES · CELESTIQ |
| ⚠ 不要用同一年款覆盖全部 | **ESCALADE IQ / IQL / XT5 / CT4 / CT5 只到 MY2026**（无 2027）；**XT4 / ESCALADE IQ 的 MY2025** 是清库存老款。交付时「年款」列必须逐年标注，不能统一写一个 |
| ⚠ CELESTIQ 无标价 | built-to-order 定制车，导航/车型页**均无价格** → 表中留空（MY2025/MY2026 各一行） |
| ⚠ 同车型跨年价差 | ESCALADE：MY2027 LUXURY `$102,700` vs MY2026 LUXURY `$102,100`、MY2026 另有入门 `$91,100` 起价 → **别把两代混成一代** |
| ⚠ `/vehicles` 是空壳 | `https://www.cadillac.com/vehicles` 仅 8 KB 导航模板，**无车型列表**；车型清单只能从导航 `href` 或 sitemap 取 |
| 货币格式 | 🇺🇸 美元用**逗号千分位**（`102,700`），与欧洲市场的点号（`28.220`）相反 —— 该市场按其官网原生写法 |
| 燃油 | ESCALADE 全系 = `Gasoline`（6.2 V8 / V-Series 增压）；ESCALADE IQ/IQL · VISTIQ · LYRIQ(-V) · OPTIQ(-V) · CELESTIQ = `BEV`；XT5 · XT4 · CT4/CT5 及 V 系 = `Gasoline` |

**交付结果（页面口径 / 不含运费）**：`Cadillac_US_官网价_20261013.xlsx`，**78 条**（**MY2027 24 条 / MY2026 46 条 / MY2025 8 条**，按年款 × 车型 × trim 展开）。

#### ★ 更优口径：官方配置器（Build & Price）—— `?radius=900&zipCode=20146`

**配置器给出的是「含目的地运费」的官方价，且细到「trim × 驱动形式」，数据来自独立 REST API，比页面导航更权威。**

| 项 | 内容 |
|---|---|
| 入口 | `https://www.cadillac.com/shopping/configurator?radius=900&zipCode=20146`（`zipCode` 决定区域价；`radius` 经销商半径）|
| 单车型 URL | `https://www.cadillac.com/shopping/configurator/<bodyType>/<year>/<model>/<model>/model?radius=900&zipCode=20146`，例：`/shopping/configurator/suv/2027/escalade/escalade/model`。`bodyType` ∈ `suv` `sedan` `electric` `v-series` |
| **★ 两个关键 API**（同一网关，curl 带 referer 亦可，但**页面内抓最稳**） | `GET/POST /cadillac/shopping/api/aec-cp-configurator-gateway/p/v1/catalogue` → 全车型目录（`models[].years[].msrp`，含年款/bodyType）<br>`/p/v1/trim` → **该车型全部 trim + 价格**（按驱动形式分组）|
| **★ trim API 结构** | `data.trimList`：`{ "4WD": [ {name:"LUXURY", msrp:{value:108595}}, {name:"SPORT", …}, … ], "2WD": [...] }` —— **一次拿全「trim × 驱动」价格** |
| **★ 价格口径** | **含目的地运费**（destination charge）。同车型比页面 `From` 高 $1,795–$2,895，例：LYRIQ 2027 LUXURY 页面 `$59,400` → 配置器 RWD `$61,195`；ESCALADE 2027 LUXURY 页面 `$102,700` → 配置器 2WD `$105,595`。**交付时须说明口径，别与页面 MSRP 混用** |
| **★ 支持年款** | `bootstrap` API 列出 **2028 / 2027 / 2026 / 2025 / 2024**（比页面导航多 2028、2024）|
| ⚠ 不在配置器的车型 | **CT4 · CT4-V · XT4** → trim API 返回 `Unsupported Vehicle: … combination not found`（`CONF-UV-001`），说明已下架/停售，只能从旧页面拿 |
| ⚠ 驱动字段 | 各车型不同：ESCALADE 用 `2WD/4WD` + V-Series 用 `AWD`；LYRIQ/OPTIQ 用 `RWD/AWD`；XT5 用 `FWD/AWD`；CT5 用 `RWD/AWD`。**驱动类型必须并入型号名**（如 `LUXURY 4WD`）|
| ⚠ 提速技巧 | 页面单次加载慢（易 `goto` 超时）→ 分开跑、每次只抓 `/p/v1/trim` 响应体；**必须带 xvfb + headed**，headless 403 |

**交付结果（配置器口径 / 含运费）**：`Cadillac_US_官网价_配置器版_20261013.xlsx`，**114 条**（**MY2027 41 / MY2026 69 / MY2025 4**）。

---

### Mazda（US 美国 `www.mazdausa.com`：**全通，价格 SSR + 内联 JSON，可采**）✅

**结论：Mazda 美国官网 curl 直通，全部车型起价在首页卡片里、各 trim 售价在各车型页的内联 JSON 里，均可正则提取。**

| 项 | 内容 |
|---|---|
| 连通性 | ✅ curl 200（0.9–1.6 MB/页），Akamai（`_abck`/`bm_sz` cookies）但**不拦 curl** |
| **★ 价格源 ①（全系起价）** | 首页/车系列表页的**车型卡片**：`<div class="mdp-header-global__card" data-type="..." data-model="26C70">` → 内含 `<span>2026</span>`、`<p>Mazda CX-70</p>`、`<p>Inline 6 Turbo</p>`、**`Starting At … $42,750`** |
| **★ 价格源 ②（trim 级）** | **车型页内联 JSON**：**`"lowestMsrp": "$42,750", "title": "3.3 Turbo Preferred"`** —— 每个 trim 一条，最干净。⚠ 该 JSON 被转义（`\u0027` 等），**必须先 `html.unescape` 再正则** |
| **★ 兜底：FAQ 文本** | 少数页面（如 **CX-30**）**无 `lowestMsrp`**，但页面 FAQ 里有纯文本 trim 列表：`The Mazda CX-30 is available in eight different trim levels: 2.5 S: Starting at $26,375; …` —— 用「`trim levels?` 后面的 `<li>` 列表」兜底 |
| **★ 在售车型（12）** | MAZDA3 SEDAN · MAZDA3 HATCHBACK · CX-30 · CX-5 · CX-50 · CX-50 HYBRID · CX-70 · CX-70 PHEV · CX-90 · CX-90 PHEV · MX-5 MIATA · MX-5 MIATA RF |
| ⚠ 正则陷阱 | `Starting At` 与 `$X` 之间相隔 **~98 字符**（含 `</span><span>` 等），容差 `{0,60}` 会**漏匹配** → 用 `{0,200}` |
| ⚠ 卡片属性顺序 | `<div class="…__card" data-**type**="…" data-**model**="…">` —— **data-type 在前**，正则别写反 |
| ⚠ 起步价 vs trim | 卡片 `Starting At` = 最低 trim 价（与 JSON 第一条一致），可交叉验证 |
| 燃油 | MAZDA3 · CX-30 · CX-5 · CX-50(2.5/2.5T) · MX-5 = `Gasoline`；**CX-50 HYBRID = `HEV`**；**CX-70 / CX-90 的 3.3 Turbo = `MHEV`**（官网标 `Mild Hybrid Inline 6`）；**CX-70 PHEV / CX-90 PHEV = `PHEV`** |
| 货币格式 | 🇺🇸 美元逗号千分位（`24,650`）|

**交付结果**：`Mazda_US_官网价_20261013.xlsx`，**55 条**（12 车型 × trim 展开）。

---

### Lotus（US 美国 `www.lotuscars.com/en-US`：站点全通，但**美国官网基本不公开价格**，仅 Eletre 标价）⚠️ 部分

- **站点**：✅ 200，CloudFront + **API7/3.8.22**（Apache APISIX 网关）；**Vue SSR 门户**（Sitecore JWS 内容）+ **独立 SPA 配置器**。curl 直通，无需绕封锁。
- **★ 美国在售 4 车系**（首页导航 + 配置器 API 双证）：`Eletre`(电 SUV) · `Emira`(燃油跑车) · `Emeya`(电 GT) · `Evija`(电超跑)
- **★ 价格只标了 1 个**：**Eletre Carbon = `Starting from $229,900*`**，写在 `/en-US/eletre` 的 CMS 富文本里：
  ```html
  <p class="__ff-overpass-light __c-white __f-h9">The electric Hyper-SUV with racecar DNA<br />Starting from $229,900*</p>
  ```
- **其余车型官网一律无价**：`/en-US/emira` `/emeya` `/evija` 三个车型页 curl + Playwright 渲染后**零价格**（只有 `CONFIGURE` / `KEEP ME UPDATED` 按钮）；首页、`/models`、`/shop`、`/emira/reservation` 也全无价
- **★ 路径全是 SPA fallback 陷阱**：`/en-US/models`、`/en-US/shop`、`/en-US/finance`→404、`/en-US/pricing`→404，注意 **`/models` `/shop` 返回的是首页 HTML（316,829 B 同尺寸）**，别当成有效页
- **★ 配置器是「云渲染 3D」**（MHP GmbH 做，`Lotus Cars - Immersive Car Configurator`）：
  - 入口 `/en-US/configurator/{model}/{variant}`，SPA 空壳 1,941 B，入口 JS `/en-US/configurator/assets/index-C7LTwRy4.js`（3.3 MB）
  - 云渲染走 **GorillaStreaming**（`session.lotus.gorillastreaming.com`，需 WebRTC）→ **Playwright 渲染永远超时 / 拿不到画面**
  - **★ 真 API（可 curl，无需鉴权）**：`https://configurator.prd.configurator.eu.lotuscars.com`，路径段配置在 JS 的 `pathSegments`：
    ```js
    pathSegments:{iod:"iod",ruleEngine:"ruler",productData:"products",shortCode:"url-shortener",matchmaker:"matchmaker",reservation:"reservation",instances:"instances",signaling:"signalingserver",pdf:"pdf"}
    ```
    - **`GET /products/products/{COUNTRY}`** → 返回该国全车系产品树（`id/modelCode/productAlternatives[].config/defaultConfig`），例：`/products/products/US`
    - ⚠ **但产品数据里 0 个价格字段**（US/DE/GB 三个市场都一样，只有 `config` 数组 + `meta.filterId`）
    - 价格引擎在 `/ruler/pricing/{t}/{n}/{r}`，**参数语义不明 + 返回空**；`ClientId` header 无关紧要
  - **★ 变体名藏在 config 标识里**（`MHP_*`）：EMIRA = `MHP_EMIRA_420SPORT` / `TURBO_SE` / `LINE` / `V6SE` / `V6LINE`（5 版）；EMEYA = `MHP_EMEYA_R_PACK`；ELETRE = `MHP_R_CARBON_PACK`；EVIJA = `MHP_EVIJA`；且所有美国条目带 **`MHP_US_MARKET`** 标记
- **★ 对照实验（关键心法）**：同一套代码，**`/en-GB` 首页渲染后有价**（Eletre £86,305 / Emira Turbo SE £93,955 / Emeya 600 £86,305，含 finance offers），**`/en-US` 渲染后无价** → 证明"渲染无价"是**站方策略**而非工具问题，可放心判定。
- **背景**：Lotus 美国是**经销商模式**，官网只做展示，价格走配置器/经销商询价（同类：McLaren / Maserati）。官方新闻稿虽给过 Emira 420 Sport 美国 MSRP `$122,900`，但**官网自身不展示**，按口径不采。
- **燃油**：Eletre / Emeya / Evija = `BEV`；Emira = `Gasoline`（2.0T i4 或 3.5L V6 增压）

**交付结果**：`Lotus_US_官网价_20261014.xlsx`，**7 条**（4 车系 × 版本展开；**仅 Eletre Carbon 有官网价 $229,900**，其余按"收录但价格留空"处理）。
