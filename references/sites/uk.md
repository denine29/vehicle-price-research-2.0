# 英国 UK — 站点坑位详段

> 市场码 UK · 12 段 · 品牌：Honda UK 本田英国 / Hyundai UK 现代英国 / Peugeot / Fiat / Ford / MG / Mitsubishi / Maxus / KGM / KG Mobility / Subaru / Škoda / Volvo
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-10-30 · 文中 snapshotVersion / token / 车型 id 均为当时实测值，必须现取

---

### Honda UK 本田英国（`www.honda.co.uk`：curl 全通，**grade 级价格藏在配置器页的内联 JSON**）✅

**结论：站点无任何反爬，curl 直通；但车型总览页只有 `from £X` 起价，**真正的 grade（配置等级）价格在每个车型的 `configurator.html` 页面内联数据里**，一条正则即可拿全。实测 8 车型 / 22 个 grade。**

| 项 | 内容 |
|---|---|
| 连通性 | ✅ curl 200（CloudFront），`/cars.html` 570 KB、配置器页 2.8 MB 均可直取 |
| **★ 车型清单** | `https://www.honda.co.uk/cars.html` 的车型卡片，8 款：`New Super-N`(BEV, £18,995) · `Jazz`(HEV, £28,475) · `HR-V`(HEV, £32,725) · `Civic`(HEV, £34,325) · `ZR-V`(HEV, £36,525) · `Prelude`(HEV, £41,595) · `CR-V Plug-in Hybrid`(PHEV, £47,795) · `CR-V Full Hybrid`(HEV, £48,075) |
| **★ grade 价入口** | 每款车一个配置器页：`https://www.honda.co.uk/cars/new/<slug>/configurator.html`，slug ∈ `super-n` `jazz-hybrid` `hr-v-hybrid` `civic-hybrid` `zr-v-hybrid` `prelude-hybrid` `cr-v-hybrid-suv` `plug-in-cr-v-hybrid-suv` |
| **★ 提取正则（核心）** | 页面 HTML 先 `html.unescape`，再用 `"price":"(\d{4,7})"[^{}]{0,400}?"gradeName":"([^"]{1,40})"` —— 价格与 gradeName 在**同一 JSON 对象**里，顺序是 price 在前、gradeName 在后（相隔约 200–300 字符，全是配置开关） |
| **★ 实测 grade 分布** | Super-N 2（Advance / Advance Two Tone）· Jazz 4（Elegance / Advance / Crosstar Advance / Advance Sport）· HR-V 5 · Civic 3 · ZR-V 3 · Prelude 1 · CR-V Full Hybrid 2（Elegance/Advance **- AWD**）· CR-V PHEV 2（Elegance/Advance **Tech 2WD PHEV**）|
| **⚠ 配置器页上还有一堆 £** | 选装件（`Fitted price: £1,800.00`）、促销文案（`£2,500 discount`）、以及顶部导航的 8 个 `from £X` 车系起价 —— **必须用 gradeName 配对正则**，否则会抓到几十条配件价（**Jazz 页有 50+ 个 £ 值，真 grade 只有 4 个**）|
| **★ 燃料归类** | `Super-N` → **BEV**；`CR-V Plug-in Hybrid` → **PHEV**；其余（Jazz/HR-V/Civic/ZR-V/Prelude/CR-V Full Hybrid）官网标 `Full Hybrid` → **HEV** |
| **★ 口径** | 页面脚注为 **OTR（On the Road）价**（含税含首次注册），非裸车 ex-showroom；与印度站口径不同，注意别混用 |
| 年款 | 页面不标 MY → 「官网无年款」|

> 📌 **通用教训**：**Honda 这类传统车企的「配置器」不是 SPA，而是把全量 grade 数据以 JSON 内联进 HTML**（2.8 MB / 页）。**先用 `html.unescape` 再按「字段对」正则抽**，比调 API 快得多；但**必须用 `gradeName` 做锚点**，否则满页配件价会污染结果。

---

### Hyundai UK 现代英国（`www.hyundai.com/uk/en`：curl 全通，**车系级起价在 models 页 JSON**，grade 级未公开）✅⚠️

**结论：站点无任何反爬，`/uk/en/models.html` 内嵌 `modelsOverview` JSON 给出全部车系起价；但**配置器是 SPA 且不吐 grade 价**，官网公开粒度只到「车系起价」。实测 17 条。**

| 项 | 内容 |
|---|---|
| 连通性 | ✅ curl 200（Cloudflare），models 页 113 KB、车型页 167 KB |
| **★ 数据位置** | `https://www.hyundai.com/uk/en/models.html`，HTML 里内嵌 `"modelsOverview":[...]`（按 tag 分组的 JSON 数组）——**先 `html.unescape`，再用括号计数截取该数组后 `json.loads`** |
| **★ 字段** | `modelName`（`All-new IONIQ 3` 这类，需去掉 `All-new ` 前缀）· `priceWithDisclaimer`（`£22,235`）· `promotionPrice`（**促销价，本任务为空**）· `ctaRequiredButtonLink` · `hidePrice` |
| **★ 分组 → 燃料** | `uk/electrified` → **BEV** · `uk/suv` → **PHEV** · `uk/hybrid` → **HEV** · `uk/classics` → **Gasoline** · `uk/hydrogen` → FCV |
| **★ 交付 17 条** | i20 20,010 · BAYON 24,065 · KONA 27,290 / KONA Hybrid 31,455 / KONA Electric 35,000 · INSTER 22,995 · TUCSON 30,985 / Hybrid 34,875 / PHEV 36,680 · SANTA FE Hybrid 49,090 / PHEV 53,200 · IONIQ 3 22,235 · IONIQ 5 40,695 · IONIQ 5 N 65,800 · IONIQ 6 47,050 · IONIQ 6 N 65,800 · IONIQ 9 64,995 |
| **⚠ 两条无价要剔** | `The new STARIA Electric`、`NEXO`（氢燃料）→ `priceWithDisclaimer` 为空，不入表 |
| **⚠ title 带后缀** | `IONIQ 6 N | Highlights`、`The new STARIA Electric | Highlights` —— 用 `split('|')[0]` 清理 |
| **⚠ 配置器拿不到 grade 价** | `/uk/en/models/<model>/configurator.html` 只有 25 KB SPA 壳 + `configurator-labels.model.json`（38 KB，纯文案标签），Playwright 等 12 s 也**没有任何车型/价格 XHR**；车型页（`/models/i20.html`）也只有 `from £20,010` 一个价 → **官网公开粒度就是车系级，不是没挖到** |
| 年款 | 页面不标 MY → 「官网无年款」|

> 📌 **通用教训**：**先判断「官网到底公开到哪一层」，再决定要不要死磕配置器**。Hyundai UK 三个入口（models 页 / 车型页 / 配置器）都只到车系起价 —— 这时**车系级就是正确交付**，硬挖 grade 只会浪费时间。判别特征：配置器页体积 < 30 KB（纯壳）、无价格类 XHR、车型页只有一个 `from £X`。

---

### 🇬🇧 Peugeot UK（英国）— 官方 Price List 是 InDesign 在线文档，只能 OCR

**站点**：`www.peugeot.co.uk`（Akamai，curl 403 / 无头 403 / **有头 200**）；`store.peugeot.co.uk`（**全通，无 403**）

#### 三层数据源与取舍

| 层 | 入口 | 覆盖度 | 口径 | 用途 |
|---|---|---|---|---|
| ① 首页 / offers 页 | `/offers/<nameplate-slug>` | 仅**库存配置**（208 只有 6 条） | `catalogAmount` = On The Road MRRP ✅ | 交叉校验 |
| ② 配置器 trim 页 | `/trim/configurable/<slug>` | 只回该 trim 的 5 个 engine 价 | `totalAmount`（**折后**，无 `catalogAmount`） | 取 trim 清单 |
| ③ **官方价目表** | `pricelist.varioweb.co.uk/peugeot-<model>/` | **完整 trim × engine** | **On The Road MRRP** ✅ | **主用** |

> ⚠ **`?trim=` 参数被忽略**：`/trim/configurable/208-5-door?trim=allure` 不管传什么，都返回 STYLE 的同一份 5 个 engine 价。想切 trim 只能用 `/selector/configurable/<slug>/<trim>/<engine-slug>/<colour>/<interior>`，且该页返回的是 `mtoOffers` 而非 `initialOffer`，取价麻烦。
> ⚠ **GraphQL 存在但不可直用**：`https://store.peugeot.co.uk/graphql` 与 `/api/graphql` 都返回 200，但 introspection 被禁（`GRAPHQL_VALIDATION_FAILED`），手写 query 也全失败 —— 是 **persisted query + 平台注入 token**，**别再试，直接抓 SSR 的 `__NEXT_DATA__`**。

#### 价目表文档链（关键）

```
pricelist.varioweb.co.uk/peugeot-208/          ← HTML 壳 327 B，内嵌 iframe
  └ https://indd.adobe.com/view/<docId>        ← Adobe InDesign 在线发布
      └ /content/2/<docId>/<ver>/package/<prefix>/publication-<N>.html   ← 逐页
      └ /content/2/<docId>/<ver>/package/<prefix>/manifest.json          ← 页数 + documentName
```

- `<ver>`（如 `3583774602555`）**静态 HTML 里没有**，只能**用浏览器打开 `/view/<id>` 并拦截 `indd.adobe.com/content` 请求**取前缀；`VERSION_PREFIX`（如 `5cvj`）可从 `/view/<id>` 的 `readerViewDataFromServer.MANIFEST_BODY` 里读 `VERSION_PREFIX` 字段。
- `manifest.json` 的 `pages.length` = 总页数；`documentName` 可判类型（`Specification Guide` / `Price Guide`）。

#### ★ 页面文字是矢量轮廓，HTML 里没有文本

- `publication-<N>.html` 里文字被转成 **SVG path**（`publication-web-resources/image/*.svgz`，gzip 解压后 `<text>` / `<tspan>` 节点数 = **0**）。
- `inner_text` / `textContent` 都取不到（返回空白字符）。
- **唯一可行：截图 → OCR**。截图参数：`viewport 1191x670`、`device_scale_factor=2`、`full_page=True`，裁掉底部黑色导航条（`h*0.86`）。

#### ★ OCR 解析套路（这套跑通了 109 条）

1. **定位 Price List 页**：裁顶部 20% 高度 OCR，找 `PRICE LIST` / `PRICE GUIDE`。位置规律 = 封面 1 页 + 标准配置 N 页（每 trim 1 页）→ Price List 2 页。
2. **整页 `--psm 6` + 行聚类**（y 差 < 14 合并）。
3. **算术校验挑列**（**不要硬编码 x 坐标**，各车型列位置不同）：

   ```
   Basic MRRP + VAT = Total MRRP
   Total MRRP + OTR Costs = On The Road MRRP   ← 目标列
   ```
   滑动窗口 5 个金额，找同时满足两式的连续组；容差 1.0 英镑。
4. **失败行补漏**：裁该行横带 `(0.30w, y-18, w, y+30)` → **放大 2x** → `--psm 7` 重识别。
5. **仍失败** → 退化取**行内最大金额**（On The Road 恒为该行最大值，大于 P11D 与 ECG-deducted 列）。
6. **缺口兜底**：页面顶部 `y≈280-400` 常被表头挤丢，单独裁该带放大 OCR。

> ⚠ 价格前可能带 `£`（`£26,204.17`），正则必须写成 `[£$]?\s?(\d{1,3}(?:,\d{3})+\.\d{2})` 并**取 group(1)**；否则 `fullmatch` 全部漏掉（E-Rifter / E-Traveller 页全带 £）。

#### ★ 价格口径（Stellantis 英国特有）

价目表列顺序：

```
Engine | Fuel | HP | Titre Code | CO2 | Basic MRRP | VAT | Total MRRP | OTR Costs | On The Road MRRP | On The Road MRRP - Electric Car Grant Deducted | P11D | Electric Range | BiK%
```

- ✅ **取第 10 列「On The Road MRRP」**（= 未扣补贴的 OTR 目录价，与 store 的 `catalogAmount` 完全一致）
- ❌ **不取第 11 列「Electric Car Grant Deducted」**（纯电已扣 £1,500 补贴）
- ❌ 不取 `Basic MRRP`（不含 VAT）
- **OTR Costs 按动力不同**：汽油 1,570 · 混动/柴油 1,520 · 插混 1,230-1,250 · 纯电 1,125

#### ★ 分组与 trim 命名（不要靠 OCR 认 trim 标签）

- **trim 标签 OCR 不可靠**（`STYLE`/`GT`/`GT PREMIUM` 常识别失败或错位）。
- **用「动力重复即新组」规则**：组内动力不重复，遇到与上一行相同的 engine 关键词就切组。实测 208/2008/3008/308/408/5008 全部成立（每组都以汽油或混动开头）。
- **trim 名从 store 拿**：`/trim/configurable/<slug>` 的 `configurationOptions.trims` 给出该名系全部 trim（含 slug、`baseAmount`），**按价格升序**与 PDF 组顺序一一对应（PDF 恒按价格升序排版）。
- ⚠ **组数必须 == trim 数**才按序对应；不等说明有组被漏识别，回头补 OCR。

#### 交付结果（20261021）

`Peugeot_UK_官网价_20261021.xlsx`，**109 条 / 10 个名系**：

| 名系 | 条数 | 价格区间 |
|---|---|---|
| 208 | 18 | £20,565 – 29,815 |
| 2008 | 13 | £25,765 – 33,515 |
| 3008 | 17 | £35,015 – 45,615 |
| 308 | 12 | £30,065 – 38,970 |
| 308 SW | 12 | £31,265 – 40,470 |
| 408 | 9 | £32,065 – 43,965 |
| 5008 | 17 | £38,615 – 49,310 |
| E-208 GTi | 1 | £34,995 |
| E-Rifter | 4 | £32,570 – 36,265 |
| E-Traveller | 6 | £37,060 – 49,095 |

燃油：BEV 49 · HEV 27 · PHEV 17 · Gasoline 10 · Diesel 6。

**未纳入**：
- **燃油 Rifter**（`pricelist` 的 rifter 文档 p6 列了 7 条 24,065-32,475）—— store 与官网首页均无该车，判定已停售。
- **Boxer / Expert / Partner**（LCV 商用车线，非乘用）。
- **508**：`pricelist.varioware.co.uk/peugeot-508/` 是 315 B 空壳、无 iframe，UK 已停售。

---

### 🇬🇧 Fiat UK（英国）— 只有车系级，官网主站 JS 全挂

**站点**：`www.fiat.co.uk`（Akamai，curl 403；**有头浏览器 200 但只有 61 KB 静态壳，`domcontentloaded` 超时、`links=0`、无任何价格** —— JS 被墙）；`store.fiat.co.uk`（**全通**）

#### 可用数据源只有一个

`https://store.fiat.co.uk/compare` → `__NEXT_DATA__.props.pageProps.models`

```json
{"model": {"id": "customize?commercialModelCode=3020H", "title": "500 Hybrid Hatchback"},
 "bodyStyle": {"id": "HATCHBACK"},
 "availableFuelCodes": ["pet" | "mhev" | "elec"],
 "prices": {"cash": {"baseAmount": 18994.68}}}
```

- **只有 10 个车系，每个一个起价** —— 这就是官网公开粒度。
- `baseAmount` 是**含 VAT 的车价**，部分带小数（18,994.68），官网展示取整 → 交付时四舍五入到整数（£18,995）。
- `availableFuelCodes`：`pet` → Gasoline · `mhev` → MHEV · `elec` → BEV。

#### 三条走不通的路（别重复）

| 尝试 | 结果 |
|---|---|
| `pricelist.varioweb.co.uk/` 索引 | 只有 5 条：Citroën C3、Fiat 500、Fiat Pro Doblo/Ducato/Scudo —— **Fiat 乘用车只有 500 一份文档，且是 `All Electric Fiat 500`** |
| `pricelist.varioweb.co.uk/fiat-<其他车型>/` | 全部 404（试过 500-hybrid / 500e / 600 / 600e / grande-panda / panda / topolino / ducato） |
| `store.fiat.co.uk/trim/configurable/<code>` 等 | 全部 **302 → `/error`**（Fiat 的 store 没有 trim 配置器） |

#### 交付结果（20261021）

`Fiat_UK_官网价_20261021.xlsx`，**10 条 / 4 个名系**：500 Hybrid Hatchback £18,995 · 500 Hybrid Cabrio £21,995 · 500e Hatchback £20,995 · 500e Cabrio £26,995 · 500e Armani £29,995 · Grande Panda Electric £21,495 · Grande Panda Hybrid £23,495 · 600 Petrol £23,995 · 600 Hybrid £25,995 · 600e £26,995。

---

### 🇬🇧 Ford UK（英国）— 官方 Price List PDF 在 /cars/<model>/pricelist

**站点**：`www.ford.co.uk`（Akamai；curl 全 **000**，有头浏览器 200 但首页仅 106 KB 壳、`domcontentloaded` 常超时，需 `wait_until='commit'` + 多轮等待）

#### ⚠ 第一坑：`/cars` 页的价格全是促销价，不能采

`/cars` 车型卡片写的是 **`Recommended On The Road Promotional Price from £X`**，且部分注明 `with £3,750 EV Government Grant`。按规则不采。真实目录价在 PDF 里，两者差额实例：

| 车型 | /cars 促销价 | PDF OTR 目录价 | 差 |
|---|---|---|---|
| Puma | 26,145 | **27,145** | 1,000 |
| Capri | 33,985 | **36,985** | 3,000 |
| Explorer | 32,685 | **35,185** | 2,500 |
| Mustang | 57,670 | **58,670** | 1,000 |
| Puma Gen-E | 25,245（含 EV 补贴） | **29,995** | 4,750 |
| Tourneo Courier / Connect / Custom | 28,490 / 35,330 / 60,492.8 | **同值** | 0 |

> Tourneo 系列无促销，`/cars` 与 PDF 一致，可直接交叉校验。

#### ★ 价目表路径

```
https://www.ford.co.uk/cars/<model>/pricelist        ← 页面内嵌 PDF 链接
  └ /content/dam/guxeu/uk/documents/price-list/cars/PL-*.pdf
```

- **PDF 直链 curl 也是 000**（Akamai）→ 必须**浏览器内 `fetch` + base64 回传**。
- ⚠ **文件名日期不可信**：`PL-en_gb-puma-october-2025.pdf` 的实际内容是 **`Puma ICE 27.00 MY ... Effective 5th August 2026`**（文件被覆盖更新，名字没改）。**一律以 `pdfinfo` 的 `Title` 字段判版本与年款**。

#### 各车型文件与年款（2026-10 采集）

| 车型 | PDF | pdfinfo Title 里的年款 | 条数 |
|---|---|---|---|
| Puma | `PL-en_gb-puma-october-2025.pdf` | `Puma ICE 27.00 MY` | 13 |
| Puma Gen-E | `PL_Puma_Gen-E_Customer_Price_List-Effective_1st_January_2026.pdf` | `27.00MY` | 4 |
| Kuga | `PL-All_New_Kuga.pdf` | `Kuga 27.25MY` | 14 |
| Capri | `PL-Capri_Customer_Price_List.pdf` | 无 MY | 6 |
| Explorer | `PL-Explorer_Customer_Price_List.pdf` | 无 MY | 7 |
| Mustang | `PL-new_mustang_s650.pdf` | `Mustang 2026MY` | 6 |
| Mustang Mach-E | `PL-Mach-E-2026MY.pdf` | `2026MY` | 4 |
| Tourneo Courier | `PL-All_New_Tourneo_Courier.pdf` | `27MY` | 6 |
| Tourneo Connect | `PL-tourneo_connect.pdf`（在 `price-list/commercial-vehicles/`） | `27MY` | 10 |
| Tourneo Custom | `PL-New_Tourneo_Custom_2026.pdf` | `27.25MY` | 59 |

**无价目表**：`/cars/mustang-gtd/pricelist` → **404**，`/cars` 卡片只有 `Discover Mustang GTD`（无价）→ 限量超跑询价，不入表。

#### ★ 通用提取规则：行内最后一个「带千分位逗号」的金额 = OTR

各车型 PDF 列数完全不同（Puma 10 列 / Capri 13 列 / Tourneo Custom 15 列），但**目标列恒为行内最后一个带逗号的金额**：

```
Puma       : ... £22,175.00 £26,610.00 £27,145.00 £133.18 £266.35   → 27,145 ✓
Capri      : ... £30,745.83 £36,895.00 £36,985.00 £24.61  £49.23    → 36,985 ✓
T.Custom   : ... 57195 46,050 55,260 50,989.83 60,492.80 351.61 703.22 → 60,492.80 ✓
```

- BIK 月度值（`133.18`）**不带逗号** → 天然排除
- CAP Code（`57195`）、GVM（`320`）、CO2（`122`）、VED（`3420`）**都不带逗号** → 排除
- **噪声过滤**：`left` 以 `If ` / `●` / `•` / `-` 开头，或词数 < 3 / > 20 的行（脚注、保修条款、技术数据）全部丢弃

#### ★ Ford 的燃料命名陷阱

| PDF 写法 | 实际归类 |
|---|---|
| `1.0L EcoBoost Hybrid (mHEV)` | **MHEV**（Puma 全系） |
| `2.5L Duratec FHEV` / `Self-Charging Hybrid` | **HEV** |
| `2.5L Duratec PHEV` / `Plug-In Hybrid` | **PHEV** |
| `1.5L EcoBoost 150PS ... PHEV` | **PHEV**（Tourneo Connect 有这款） |
| `1.0L EcoBoost 125PS`（无 Hybrid 字样） | Gasoline |
| `71kWh / 46kWh / 53kWh ... Electric` | BEV |

> ⚠ **Puma 全系都是 mHEV**，`/cars` 卡片写 "Hybrid SUV" 很容易误判成 HEV。

#### ★ 两个特殊处理

**1. Mustang 的 PDF 是图片版**
- `pdftotext` 只出页码，正文全是 JPEG（`pdfimages -list` 可见）。
- 处理：`pdftoppm -r 200 -png` → `tesseract --psm 6` 逐页 OCR → 先按 `£` 计数定位价格页（p-03 有价格表，p-08 是配件表，p-05 是颜色/座椅选装）。
- 识别后务必与 **p-02 封底的 `from £58,670 / £70,940`** 交叉校验。

**2. Tourneo Custom 的 trim 在分组标题行**
- 结构：`SWB Tourneo` / `LWB Tourneo`（车身）→ `Zetec - 8 Seats/...`（trim）→ 若干动力行。
- 需顺序扫描并**继承**当前 body 与 trim。
- ⚠ PDF 后半部（约 line 560+）是**技术数据表**和 **MS-RT 延伸配置**（8/9 座不同价），会污染提取 → **限定只扫主价格表区间**（line 380-566）。
- 主表 59 条：SWB/LWB × Zetec/Titanium/Titanium Luxe/Active/Titanium X/Titanium X Luxe + SWB MS-RT 3 条；**LWB MS-RT 未纳入**（只在延伸页出现，行结构不同）。

#### 交付结果（20261022）

`Ford_UK_官网价_20261022.xlsx`，**129 条 / 10 个车型**，价格区间 £27,145 – £83,235。

燃油：Diesel 37 · BEV 36 · PHEV 21 · Gasoline 15 · MHEV 13 · HEV 7。

**未纳入**：Mustang GTD（无价目表、官网无价）；Ford 商用车线（Transit / Ranger 等，属 `/vans-and-pickups`）。

---

### MG UK（`www.mg.co.uk`：**配置器页逐 trim 给 `Cash Price Details Total`；15 车型 35 版本**）✅

- **可达性**：`www.mg.co.uk` curl 200；车型页 `/model/<slug>` 与配置器 `/configurator/<slug>` 均 200（2026-11-25）。
- **★ 车型/版本（15 车系 35 版本）**：MG3（SE 17 995）· MG3 Hybrid+（SE 19 995 / Trophy 21 995）· MG4 EV Urban（Comfort SR 23 495 / Comfort LR 25 995 / Premium LR 28 495 / Design Edition 29 495）· MG4 EV（Premium LR 30 495 / Premium ER 33 495 / XPOWER 34 495）· MG ZS（SE 21 495）· MG ZS Hybrid+（SE 23 995 / Trophy 26 495）· MGS5 EV（SE 28 995 / SE LR 31 495 / Trophy LR 33 995）· MGS6 EV（SE LR 37 995 / Trophy LR 40 995 / Trophy Dual Motor 43 995）· MG HS（SE 27 495 / Trophy 29 995）· MG HS Hybrid+（SE 30 495 / Trophy 32 995）· MG HS PHEV（SE 33 495 / Trophy 35 995）· MGS9 PHEV（Comfort 34 210 / Premium 37 995）· MG IM5（75 SR 39 950 / 100 LR 45 495 / 100 Performance 48 995）· MG IM6（100 LR 48 495 / 100 Performance 51 495 / 100 Launch Edition 53 495）· MG Cyberster（Trophy 55 245 / GT 60 245）。
- **取价源**：配置器页 `Compare trims` 段逐 trim `£X`；页面 `Price Details Total` 与 trim 价一致。全系 `官网无年款`（无 MY/model year 字段）。
- **燃油**：BEV 21 · HEV 6 · PHEV 4 · Gasoline 4。
- **交付结果**：`MG_UK_官网价_20261125.xlsx`，**35 条 / 15 车系**；£17 995–£60 245。
- **实测**：2026-11-25
- **来源**：`https://www.mg.co.uk/model/<slug>`；`https://www.mg.co.uk/configurator/<slug>`（slug 同车系）
- **原文**：`Compare trims Premium Long Range £30,495 Premium Extended Range £33,495 XPOWER £34,495`；`Price Details Total: £30,495`；`MG Cyberster Trophy £55,245 GT £60,245`

---

### Mitsubishi UK（`www.mitsubishi-motors.co.uk`：**当前 2 车系 L200 / Outlander PHEV；model-range 页逐 trim 给价**）✅

- **可达性**：`www.mitsubishi-motors.co.uk` curl 200（末尾偶发超时但已收全页）；`/model-range/{l200,outlander-phev}/` 200（2026-11-25）。
- **★ 车型/版本（2 车系 4 版本）**：L200 **Titan £36 295 / Barbarian £39 995**（`CVOTR (Excl. VAT)`）· Outlander PHEV **Nativa £46 995 / Diamond £49 995**（`OTR Price`）。
- **年款**：车型页无 MY/model year → 全部 `官网无年款`。
- **燃油**：L200 Diesel；Outlander PHEV = PHEV。
- **交付结果**：`Mitsubishi_UK_官网价_20261125.xlsx`，**4 条 / 2 车系**；£36 295–£49 995；L200 为不含 VAT 的 CVOTR，Outlander 为 OTR。
- **实测**：2026-11-25
- **来源**：`https://mitsubishi-motors.co.uk/model-range/l200/`；`https://mitsubishi-motors.co.uk/model-range/outlander-phev/`
- **原文**：`Trim Levels Titan Barbarian`；`CVOTR (Excl. VAT) From £36,295` / `£39,995`；`Trim Levels Nativa Diamond`；`OTR Price From £46,995` / `£49,995`

---

### Maxus UK（`www.maxus.co.uk`：**GoDaddy 停放页 `/lander`，不是官方站；无车型/价格**）❌

- **可达性**：`www.maxus.co.uk` 返回 114 B 的 `<script>window.location.href="/lander"</script>`；`/lander` 200，`window.LANDER_SYSTEM="PW"`、`_trfd.push({ap:"parking"})`，是 GoDaddy parking 页（2026-11-25）。
- **结论**：该域名已停放，不是 Maxus 英国官方站；无车型、无价格，按 §E 止损，不出表。若需 Maxus UK，应找其现任进口商/官方域名。
- **实测**：2026-11-25
- **来源**：`https://www.maxus.co.uk/`；`https://www.maxus.co.uk/lander`
- **原文**：`window.location.href="/lander"`；`window.LANDER_SYSTEM="PW"`；`window._trfd.push({ap:"parking"})`

---

### KGM / KG Mobility（UK 英国 `www.kgm-motors.co.uk`：**模型级 From 价 9 款；官网不公开 trim 级价格**）✅

- **可达性**：`www.kgm-motors.co.uk` curl 200（Next.js 风格，181 KB）；`/new-cars/` 与各车型页均 200（2026-11-23）。
- **★ 车型/From 价**：**Tivoli £24,045**（Gasoline）· **Torres Hybrid £35,995**（HEV）· **Torres EVX £35,495**（BEV，inc £1,500 ECG）· **Actyon Hybrid £38,995**（HEV）· **Rexton £42,615**（Diesel）· **Rexton Commercial £35,995 exc. VAT**（Diesel）· **Musso Pick-Up £32,980 exc. VAT**（Diesel）· **Musso EV £39,995**（BEV，inc £5,000 PiVG）· **Musso Rhino £38,995 exc. VAT**（Diesel）。
- **口径**：乘用车是 OTR From；Rexton Commercial / Musso Pick-Up / Musso Rhino 是 **exc. VAT**；Torres EVX 标 `inc £1,500 ECG`、Musso EV 标 `inc £5,000 PiVG`，即已含政府补贴，交付说明标注，不另加/减。
- **年款**：车型页只有 `From £`，无 MY/model year；`2025 KGM range` 是 WLTP 数据年度、`2026` 是版权年 → 全部 `官网无年款`。
- **交付结果**：`KGM_UK_官网价_20261123.xlsx`，**9 条 / 9 车型**；£24,045–£42,615；Gasoline 1 · HEV 2 · Diesel 4 · BEV 2。
- **实测**：2026-11-23
- **来源**：`https://www.kgm-motors.co.uk/new-cars/`；`https://www.kgm-motors.co.uk/new-cars/<model>/`
- **原文**：`Tivoli Mini SUV From £24,045`；`Torres Hybrid Hybrid SUV From £35,995`；`Torres EVX Electric SUV inc £1,500 ECG From £35,495`；`Rexton Commercial Car derived commercial 2-seater From £35,995 exc. VAT`；`Musso EV Electric Pick-Up inc £5,000 PiVG From £39,995`

---

### Subaru（UK 英国 `subaru.co.uk`：**车型页 Price Breakdown 逐 trim 的 Total On The Road Price，14 版本**）✅

- **可达性**：`subaru.co.uk` curl 200（351 KB）；`/overview/{crosstrek,forester,outback,solterra,e-outback}` 均 200（2026-11-23）。
- **★ 取价源**：车型页 `Price Breakdown` 表逐 trim 给 `Basic Retail / VAT / Total Retail / Delivery £600 / 12 Months RFL / DVLA £55 / Total On The Road Price` → **取最后一列 OTR**。
- **★ 车型/trim/OTR**：
  - **Crosstrek**：2.0i e-Boxer Limited 5dr Lineartronic **£35,995** · 2.0i e-Boxer Touring 5dr Lineartronic **£38,100**
  - **Forester**：2.0i Limited **£39,995** · 2.0i Field **£41,545** · 2.0i Touring **£44,100**
  - **Outback**：2.5i Limited **£40,495** · 2.5i Field **£42,655** · 2.5i Touring **£45,645**
  - **Solterra**：Limited **£52,505** · Touring **£55,505**
  - **e-Outback**：AWD **£49,995** · FIELD **£51,995** · TOURING **£52,495** · TOURING+ **£54,995**
- **年款**：Price Breakdown/车型页无 MY/model year → 全部 `官网无年款`。
- **燃油**：Crosstrek / Forester 的 e-Boxer 为 **MHEV**（官网写 Self-Charging Hybrid Petrol，按 BE 段同一 e-BOXER 判法）· Outback 2.5i = Gasoline · Solterra / e-Outback = BEV。
- **交付结果**：`Subaru_UK_官网价_20261123.xlsx`，**14 条 / 5 车系**；£35,995–£55,505；MHEV 5 · Gasoline 3 · BEV 6。
- **实测**：2026-11-23
- **来源**：`https://subaru.co.uk/overview/{crosstrek,forester,outback,solterra,e-outback}`
- **原文**：`2.0i e-Boxer Limited 5dr Lineartronic … Total On The Road Price £35,995.00`；`2.0i Limited | £39,995.00`；`2.5i Touring … £45,645.00`；`Limited Touring … Total On The Road Price £52,505.00 / £55,505.00`；`AWD | £49,995.00 FIELD | £51,995.00 TOURING | £52,495.00 TOURING+ | £54,995.00`

---

### Škoda（UK 英国 `www.skoda.co.uk`：**range 页只给 trim 入门 `From*` 价；完整版本必须走配置器 `GetEnginePricesByTrim`，14 车系 171 个 trim×发动机组合，MY2027**）✅

- **可达性**：`www.skoda.co.uk` curl 200；`/new-cars/<model>/<model>-range` 均 200；配置器 `cc.skoda-auto.com` 需浏览器 session（裸 curl `Invalid use - 100`），用页面内 `fetch`（2026-11-23）。
- **⚠ 首采漏版原因（用户指出）**：range 页每个 trim 只写 `See more <trim> From* £ X`，X 是**该 trim 入门发动机价**；同一 trim 点进去还有 1.0 MPI / 1.0 TSI 95 PS / 1.0 TSI 116 PS 6G Man / 116 PS DSG 等，价格各不同。只解析 range 页会得到 73 条、漏掉一半以上（实际 171 条）。**必须取配置器逐发动机价**。
- **★ 完整取价链路**：
  1. 从任一 range 页配置器链接取 `snapshotVersion`（如 `ff1a936e-…`）、`modelCode`（class）。
  2. 取 webcache：`https://c3poweb.blob.core.windows.net/webcache/<sv>/GBR/2027/<class>/trimlines-en-GB.json`（每个 trim 的 `id`/`name`/`carlineName`/`defaultModelId`）与 `.../engines-en-GB.json`（`id`/`name`/`power.formatted`/`transmissionName`/`fuelName`/`trimlines[]`）。
  3. 逐 trim `POST https://cc.skoda-auto.com/c3popr/v3/GetEnginePricesByTrim`，body **`{"ModelId":"<defaultModelId>"}`** → `prices.<engineId>.price`（OTR）。
  4. 以 `trimline.id` 关联 engines JSON，拼 `{车系} {trim} {发动机} {功率} {变速箱}`。
- **★ class 映射**：PY Elroq · 5A Enyaq + Enyaq Coupé · PX Epiq · PJ Fabia Hatch · NW Kamiq + Scala · NU Karoq · PS Kodiaq · PV Octavia Hatch + Estate · PZ Peaq · NZ Superb Hatch + Estate。
- **★ 车系/版本数（14 / 171）**：Elroq 7 trims · Enyaq 7 · Enyaq Coupé 4 · Epiq 6 · Fabia 5 · Kamiq 4 · Karoq 5 · Kodiaq 10 · Octavia Estate 5 · Octavia Hatch 6 · Peaq 3 · Scala 3 · Superb Estate 4 · Superb Hatch 4；展开发动机后共 171 行。
  - Fabia SE Edition 例：1.0 MPI 80 PS 5G Man £21,240 · 1.0 TSI 95 PS 5G Man £21,790 · 1.0 TSI 116 PS 6G Man £22,290 · 1.0 TSI 116 PS DSG £23,290。
- **年款**：配置器 id 第三段与 webcache 路径均为 **2027**（配置器法律说明写 current model year）→ 全部 **2027**（不再写官网无年款）。
- **燃油**：按 engines JSON `fuelName`：**BEV 27 · Gasoline 80 · Diesel 33 · MHEV 21 · PHEV 10**；`Mild hybrid`→MHEV、`Plug-in hybrid`→PHEV。
- **交付结果**：`Skoda_UK_官网价_20261123.xlsx`，**171 条 / 14 车系**；£21,240–£58,280；年款全 **2027**。
- **实测**：2026-11-23
- **来源**：`https://www.skoda.co.uk/new-cars/...-range`；`https://cc.skoda-auto.com/c3popr/v3/GetEnginePricesByTrim`；`https://c3poweb.blob.core.windows.net/webcache/<sv>/GBR/2027/<class>/{trimlines,engines}-en-GB.json`
- **原文**：`See more SE Edition From* £ 21,240`；`1.0 MPI 80 PS 5G Man`；`1.0 TSI 95 PS 5G Man`；`1.0 TSI 116 PS 6G Man`；`1.0 TSI 116 PS DSG`；`Total price £21,240`

---

### Volvo（UK 英国 `www.volvocars.com/uk`：**真浏览器 build 页；13 个 MY27 车系 65 个 Level × Powertrain 版本；trim+引擎逐行**）✅

- **可达性**：`www.volvocars.com/uk` 裸 curl 常被 Akamai 403；真浏览器正常。`/uk/build/` 一次性列出 13 个 build 入口（EX30/EX90/EX60/EX40/EC40/ES90；XC90 PHEV+MHEV、XC60 PHEV+MHEV、XC40、V60 PHEV+MHEV），每个 build 页给 `Version`（子车型）、`Level`（Core/Plus/Plus Pro/Ultra/Ultra Pro）、`Powertrain` 及价格（2026-11-25）。
- **★ 取价方式（trim × 动力）**：主表按 `{Level} {Powertrain}` 逐行，价格 = Level 卡基础价 + Powertrain 加价。已实测 EX30 Core 选 `P5 Long Range Electric` 时头部价 £35,585 = 31,385 + 4,200，确认可叠加。`Version` 卡的 `From £` 用于 Black Edition / Cross Country 等子车型。
- **★ 动力加价**：EX30 `P5 Electric` 标准 / `P5 Long Range Electric +£4,200`；EX90 `Single Motor` 标准 / `Twin Motor +£5,900`；EX60 `P6 Electric` 标准 / `P10 AWD +£3,000` / `P12 AWD +£8,000`；EX40、EC40 `P5 Long Range` 标准 / `P8 AWD +£4,000`；ES90 仅 `Single Motor Extended Range`；XC90/XC60/V60 PHEV 仅 `T8 AWD`；XC90/XC60 MHEV 仅 `B5 AWD`；XC40 仅 `B3`；V60 MHEV 仅 `B4`。
- **★ 车系/Level 基础价（MY27）**：
  - EX30：Core 31 385 / Plus 33 485 / Ultra 41 685；Black Edition 38 685；Cross Country 39 260
  - EX90：Core 73 160 / Plus 80 160 / Ultra 93 860
  - EX60：Plus 56 860 / Ultra 62 360
  - EX40：Plus 43 860 / Plus Pro 45 860 / Ultra 47 860 / Ultra Pro 49 860
  - EC40：Plus Pro 45 860 / Ultra Pro 49 860
  - ES90：Plus 67 560 / Ultra 77 260
  - XC90 PHEV：Core 75 765 / Plus 78 265 / Plus Pro 81 765 / Ultra 85 765 / Ultra Pro 89 265 / Black Edition 83 765
  - XC90 MHEV：Core 56 120 / Plus 58 620 / Plus Pro 63 270 / Ultra 67 270 / Ultra Pro 70 770 / Black Edition 65 270
  - XC60 PHEV：Core 56 765 / Plus 61 265 / Plus Pro 65 365 / Ultra 70 865 / Black Edition 63 015
  - XC60 MHEV：Core 42 860 / Plus 48 220 / Plus Pro 52 320 / Ultra 57 420 / Black Edition 49 970
  - XC40：Core 37 710 / Plus 39 210 / Plus Pro 40 460 / Ultra 44 060 / Ultra Pro 46 760
  - V60 PHEV：Plus 52 765 / Ultra 57 365
  - V60 MHEV：Plus 45 210 / Ultra 49 810
- **年款**：build URL/配置数据为 **MY27**（`my=2027`、`Delivery Mid March 2027`、车型图 2027）→ 年款 2027。
- **燃油**：EX30/EX90/EX60/EX40/EC40/ES90 = BEV；XC90/XC60/V60 各 PHEV + MHEV 两套；XC40 = MHEV。
- **交付结果**：`Volvo_UK_官网价_20261125_trim_powertrain.xlsx`（**按用户要求放桌面**；原 `Volvo_UK_官网价_20261125.xlsx` 被 Excel 占用无法覆盖，故用新名），**65 条 / 13 车系**；£31,385–£99,760；BEV 34 · PHEV 13 · MHEV 18；年款 2027。
- **实测**：2026-11-25
- **来源**：`https://www.volvocars.com/uk/build/`；`https://www.volvocars.com/uk/build/{ex30-electric,ex90-electric,ex60-electric,ex40-electric,ec40-electric,es90-electric,xc90-hybrid,xc90,xc60-hybrid,xc60,xc40,v60-hybrid,v60}/`
- **原文**：`Customise your EX30`；`Core £31,385` / `Plus £33,485` / `Ultra £41,685`；`EX30 Black Edition From £38,685`；`EX30 Cross Country From £39,260`；`XC90 Plug-in hybrid From £75,765`；`XC90 Mild hybrid From £56,120`；`P5 Long Range Electric £4,200`；选中后头部 `£35,585`
