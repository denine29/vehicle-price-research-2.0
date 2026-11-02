# 德国 DE — 站点坑位详段

> 市场码 DE · 18 段 · 品牌：DS / Alfa Romeo / Alpine / Dacia / INEOS / Jeep / Abarth / Audi / Aiways / Lucid / MINI / Polestar / VinFast / smart / ALPINA / Aston Martin / Elaris
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-10-30 · 文中 snapshotVersion / token / 车型 id 均为当时实测值，必须现取

---

### DS DE（德国 `www.dsautomobiles.de`：**Akamai 封主站，configv3 API 直取全版本 PVC**）✅

- **★ 主站被封、API 可通**：`www.dsautomobiles.de` 对 curl 一律 Akamai 403（`errors.edgesuite.net`），PDF 价目表同样受保护；但配置器后端 `api-cdn.configv3.awsmpsa.com` **curl 直通**。derivedModel ID 需用浏览器打开各配置器页，从 network 的 `versions?derivedModel=` 抓取。
- **★ 端点**：`GET https://api-cdn.configv3.awsmpsa.com/api/v4/d-de-de-btoc/vehicles/versions?derivedModel=<VP…>`（`Accept: application/json`）→ 数组，每元素一个版本：
  - `version.label` = 官方完整版本名（`DS 3 PALLAS HYBRID 145`、`N°7 LA PREMIÈRE E-TENSE AWD LONG RANGE 350 PS`）
  - `prices.price.base` = **含 19% MwSt 的 UPE**（= `priceWithoutTax.base × 1.19`），`discount` 全为 0 → 就是目录价
  - `grCommercialName.label` = trim（`PALLAS` / `ÉTOILE + Alcantara` / `ÉTOILE + Nappa` / `LA PREMIÈRE`）
  - `energy.label` = `Hybrid` / `Diesel` / `Elektro` / `Plug-in-Hybrid`
- **★ derivedModel（按车系）**：DS 3=`VP100054` · N°4=`VP100060` · N°7=`VP100056` · N°8=`VP100052`。DS 7 传 `VP100049` 返回 `400 "Derived model VP100049 is unknown for environment d-de-de-btoc"` → 已下架。
- **★ 在售权威**：`/infocenter/konfigurator.html` —— DS 3 / N°4 / N°7 / N°8 有「Konfigurieren」；**DS 7 只有「Fahrzeuge im Bestand ansehen」（库存车，无配置器）**；DS 4 / DS 9 不在列表。`/infocenter/preislisten.html` 也只有 DS3 / N4 / N7 / DS7 / N8 五份 PDF，且全部 Akamai 403。
- **★ 燃油陷阱**：DS 的 `HYBRID 145` 是 **48V 自充电轻混**（官网原文 "selbstladende 48V Li-Ion-Batterie"，系统功率 107 kW）→ **MHEV，不是 HEV**；`E-TENSE` → BEV；`BlueHDi` → Diesel；`PLUG-IN-HYBRID 240` → PHEV。
- **★ 年款**：配置器 HTML 的 `<meta name="modelYear" content="">` 为空、API 无 MY 字段 → 全部 `官网无年款`。
- **交付结果（20261026）**：`DS_DE_官网价_20261026.xlsx`，**34 条 / 4 个车型**（DS 3 6 · N°4 11 · N°7 12 · N°8 5），33.870–78.450 €。燃油：BEV 19 · MHEV 9 · Diesel 3 · PHEV 3。未纳入：DS 7（仅库存车，无配置器价）、DS 4 / DS 9（已退出配置器）。

---

### Alfa Romeo DE（德国 `www.alfaromeo.de`：**Stellantis Omnichannel 配置器，无 sccf、`ncs/retrieve` 不可重放 → UI 逐卡读「UPE des Herstellers ab Werk」**）✅

- **★ 可达性**：Akamai 对 `curl` 全域 **403**（任意路径、任意 UA）；Qoder 真实浏览器正常打开。关键技巧：**页面内同源 `fetch()` 不受 Akamai 拦截** —— `/sitemap.xml`、`/modelle/*`、JS bundle（6 MB）全部用同源 fetch 拿到，省掉逐个 navigate。这与 Citroën BE、Jeep DE 的经验一致：Stellantis 系「curl 死、浏览器活、fetch 通」。
- **❌ 无 sccf 静态价格库**：Citroën BE 那套 `sccf`/静态价格 JSON 在本品牌/市场**不存在**，别按老路去猜 URL。
- **❌ `POST /service-contract/v1/ncs/retrieve` 是死路（401 陷阱）**：空 body `{}` → **200 但过滤器为空、零数据**；任何带内容的 body（`{"filters":{}}`、brand/market 组合等 5 种变体）→ **401 Unauthorized**。ES/Abarth 段记的「从 `ncs/retrieve` 拿车系级 `cataloguePrice`」在这里**重放不出来**：请求体形状不在 car-selector bundle 里（`indexOf('ncs/retrieve')` 在该 6.08 MB bundle 内 0 命中）。→ 批量目录路线放弃。
- **★ 唯一可采来源 = 配置器 UI**：`https://www.alfaromeo.de/omni/konfigurator#/`（`x-origin-omni: car-selector`，brandCode 83 = Alfa Romeo，marketCode 3110 = DE）。首页渲染 **15 张「车系 × 年款」卡 = 官网认定的在售全量**，每张固定文案：
  `<名称> MY2x | Verfügbar als: Hybrid|Elektro|Diesel|Benzin|Plug-in Hybrid Q4 | N Motoren | M Versionen | UPE des Herstellers ab Werk ab X €`
  页脚口径原文：`*UVP des Herstellers inkl. MwSt, zzgl. Überführungskosten.`（含 19% VAT、不含交付费；`UPE` = 官网用词，即出厂建议零售价）。
- **★ 卡片深链（入表来源 URL 用这个）**：`#/customize?commercialModelCode=<code>&vehicleType=VP&userType=B2C`。15 个 code：`6261` `6271`（Junior Ibrida/Elettrica **MY26**）、`6262` `6262Q4` `6272`（Junior MY27）、`6223H`（Tonale Ibrida **MY26**）`6224` `6224H` `6384`（Tonale MY27 Diesel/Ibrida/PHEV）、`6206Q` `6207`（Giulia MY27/Quadrifoglio）、`6306`（Giulia Quadrifoglio **MY25**）、`6207Q` `6306Q` `6307` `6307Q`（Stelvio / Stelvio Quadrifoglio）。
- **★ DOM 契约（v3 才稳定）**：卡片 = `.targetSelector`；官方版本名 = `h3[type=bodyLBold]`；价格 = 同卡片内 `span[type=heading7]`（第一个数字即起价），位置在 `<p>UPE des Herstellers ab Werk ab </p>` 之后的 `div.sc-ezWOiH`。**分组定位用「文本以 `Ausstattungsvariante (N)` / `Motorisierung (N)` 开头的最大 div 中取最小那个」**（`N` 直接给出应有条数，是天然的校验锚点）。⚠ 侧边栏显示的 `UPE des Herstellers ab Werk X *` 是**当前已选配置的价（含选装）**，不是起价，别拿它入表。
- **★ 停销判据（唯一依据，不推断）**：进旧年款卡片后顶部横幅原文 `Modelljahr 26 (MY26) ist nicht mehr neu Bestellbar. Es stehen nur noch Lagerfahrzeuge zur Verfügung.`（MY25 同句式）→ 该卡所有行 `是否停销=是`；正则 `/Modelljahr [0-9]{2} \(MY[0-9]{2}\) ist nicht mehr[^.]{0,80}/`。⚠ 扫 `body.innerText` 头部会误命中「SkiptoContentText…」导航跳转链接文本，必须用这条正则而不是取前 N 字符。同一句话也在 backoffice 的 `CommercialBarRepository` `modelMessages` 里（6306Q/6206Q/6306/6206 = MY25、6261/6261Q4… = MY26），可作二次印证。
- **★ 后台 API 只当「年款/停订」佐证，不当价格源**：`POST /backoffice/v1/crud`（`{"configCode":"PriceConfigRepository",…,"operationType":"search"}`）→ DE/83/VP 下 **B2C 的 `cataloguePriceType` = `withTaxDeductionsAndFees`**，B2B/B2E 是 `withoutVAT` 等其它口径 → **口径不同，绝不能混用**。`POST /pricing/v1/vehicle` 能按 `priceType` 拆出 `cataloguePrice` / `eStorePriceUncond` / `eStorePrice`（后者是 eStore 促销价，纪律 6 不采）。重放鉴权：`localStorage.OATK`（accessToken）+ `localStorage.OMNI_DEFAULT_HEADERS`。
- **★ 交叉校验**：5 个服务端直出的营销页（`/modelle/*`，同源 fetch 拿 HTML）与配置器逐卡起价**逐项一致**；营销页无 MY 标签，所以年款/停销仍以配置器卡片与横幅为准。
- **⚠ 未纳入**：① `**/modelle/sonderserie/intensa**` 特别版系列——营销页给了 6 个公开 UPE（36.500 / 45.500 / 51.300 / 62.100 / 66.500 / 71.100），但**配置器无入口、无 MY 标注**，不属在售目录 → 不入表，值已记在依据页以便回溯。注意 URL 要从 `/sitemap.xml` 里取（`/modelle/intensa`、`/modelle/junior-luna-rossa`、`/modelle/quadrifoglio-oro` 全是 404，真实路径是 `/modelle/sonderserie/…`）；Intensa 页标题正则拿不到，要按 `cvModelRange__cardTitle` 切原始 HTML。② `/angebote/*` 租赁/分期页（促销）。③ B2B/B2E 价。
- **★ 双向集合校验（纪律 8 的落地）**：每张卡声明的 `M Versionen` == 表内该卡行数；卡片 `ab` 价 == 该卡组内最低价；`N Motoren` 与去重后的动力数吻合。15 卡 → **40 行**，无上一代年款与当年款并排的重复行。MY26 的 Junior/Tonale 与 MY25 的 Giulia Quadrifoglio/Stelvio 虽属旧年款，但**官网 UI 仍呈现为可订余留/库存目录卡片**，按 UI 入表并标 `是否停销=是`。
- **命名口径**：`官网车型名称` = 卡片名（含官网自带的 Q4 / Elettrica / Ibrida / Ibrida Plug-In / Diesel / Quadrifoglio 后缀）；`官网型号名称` = `<Version> <官网 Motorisierung 原文>`（例 `Ti Ibrida 1.2l 107kW (145PS) Systemleistung eDCT6`），不自拼规格。
- **★ 燃油分类（按页面证据）**：官方「48V-Hybrid」/「Kombinierte Leistung von Verbrennungsmotor … und Elektromotor …」→ **MHEV**；`Elektro`/`Elettrica` → BEV；`Plug-In Hybrid Q4` → PHEV；柴油机官网从不写 48V → Diesel；Quadrifoglio 卡片 `Verfügbar als: Benzin` → Gasoline。
- **⚠ 浏览器自动化两个硬坑**（Stellantis SPA 通用，下次直接按此写）：① `evaluate_script` **15,000 ms 硬超时**，且**超时后 promise 仍在页面里继续跑**（zombie job 会继续点卡片，把下一次采集的起点带偏）→ 一律改成 **fire-and-forget**：脚本立刻返回，循环结果写 `window.__D2={done,log,cards,errors}`，另起多次调用轮询，轮询内部 `while(Date.now()-t0<13000)` 留足余量。② `navigate_page` 会 reload 并**清空注入的 `window.*` 状态**；SPA 内部 `#/…` 切换不刷新但会换页 → 定位卡片前必须加 hub 守卫（页脚文本 + ≥15 个 `MY2` 标题）再 `querySelector`，否则在 customize 页找 h3 会 `Cannot read properties of undefined (reading 'closest')`。逐 trim 点击后要**稳定轮询**（连续 3 次动力列表 JSON 相同才取值，每次 sleep 700 ms）。
- **⚠ 本机出表**：Excel COM 写完后 `FreezePanes` 看起来没生效（只读重开时 `Panes=0`、`SplitRow` 空）——那是**读取方式骗人**：必须 `$ws.Activate()` 后读 `$excel.ActiveWindow.FreezePanes/.SplitRow` 才是真值；每个 sheet 各自 `FreezePanes=$false; SplitRow=1; FreezePanes=$true` 重设一遍再存。
- **交付结果（20261027）**：`AlfaRomeo_DE_官网价_20261027.xlsx`，**40 条 / 4 个车系**（Junior 15 · Tonale 15 · Giulia 5 · Stelvio 5），32.900–109.700 €；年款逐字 `MY25`/`MY26`/`MY27`；`是否停销=是` 共 10 条（全部有官网横幅原文支撑）。燃油：MHEV 15 · BEV 7 · Diesel 11 · PHEV 4 · Gasoline 3。附第二个工作表「口径与依据」20 行（15 张卡的逐字原文 + 覆盖型号数 + 判定过程 + `commercialModelCode` 来源 URL，加 5 行口径/未纳入说明）。

---

### Alpine DE（德国 `www.alpinecars.de`：**Renault rplug 配置器直取 SRP，curl 全通**）✅

- **★ 配置器 base（按车系，勿猜）**：A110=`BAEL5`（`/product/model/AL1/a110/c/A`）· A290=`BAERh`（`/product/model/A5E/a290/c/A`）· A390=`BAEQx`（`/product/model/Z1D/alpine-a390/c/A`）。base 从各配置器页的 `modelURI` 提取。
- **★ 两个 JSON 端点（均需 `Accept: application/json`）**：
  - `GET /product/model/<spec>/<slug>/c/A` → Schema.org，`schema:isVariantOf[]` 里每个版本带 `schema:price` + `priceType:"SRP"`（=PVC 含税目录价）
  - `GET /pricelist/<base>` → 全版本 `PVC`（含 19% VAT）与 `PCHT`/`TVA`，比 product 端点更全（A290 5 个版本一次拿全）
- **★ 年款**：A390 配置器属性有 `label:"MODEL YEAR 2026"`（code `EV2GA1`，SYSTEMATIC）→ 写 `MY2026`；A110/A290 无任何 MY 标记 → `官网无年款`。A110 的 `c2gMillesime:millesime_2015` 是车型代号，**不是年款**。
- **★ 动力并入型号（取「Ihre Motorisierung」的 `engineName` 原文）**：A110 `4 Zyl. 1.8l 252 PS`、GTS `4 Zyl. 1.8l 300 PS`（不是只写 `252 PS`）；A290 `Elektro 180` / `Elektro 220`；A390 `AWD 3 Motor 400 PS` / `AWD 3 Motor 470 PS`。
- **⚠ 老版本 variant URL 会 400**：`SERIELIM3`（A110 S / R 70 页仍挂着）返回 `400 {"":"}"` → 说明该版本已停配；`/angebot/a110-gt|a110s|a110-r-70` 都是余留页，**无价格、勿入表**。
- **⚠ A110 官方 Preisliste 是图片版**：`cdn.group.renault.com/alp/de/price_list/2025_03_05_Preisliste_A110.pdf.asset.pdf/<hash>.pdf`，5 页含 1227 张 Image，`pdftotext` 只出破折号 → 不需 OCR，直接用配置器。
- **交付结果（20261026）**：`Alpine_DE_官网价_20261026.xlsx`，**9 条**（A110 2 + A290 5 + A390 2）。未纳入：A110 R 70 与 5 款 Limitierte Edition（无公开价、配置器无入口）。

---

### Dacia DE（德国 `www.dacia.de`：**APP_STATE 内嵌全版本矩阵 + rplug PVC 双源**）✅

- **★ 站点结构**：React 页把整棵 JSON 塞在 `window.APP_STATE=JSON.parse("…")`，路径 `page.data.content.contentZone.configurator.staticData.engines[].grades[]`。用「找 `window.APP_STATE=JSON.parse(` → 定位引号 → 反转义 → 二次 `JSON.parse`」解析，**不要**用正则扫 1 MB 单行 HTML（会卡死）。
- **★ 关键字段**：`grades[].pricedVersion.label` = 官方完整版本名（已含动力，如 `Expression Eco-G 120 auto`）；`minPrice` = PVC；`webDisplayPrices.displayPrice` 与 `minPrice` 一致。`startingPrice` 有时是营销起价，**不可用**。
- **★ 配置器 base（按车系）**：Sandero/Stepway=`BAEQu0AhhAjJ8J9J-` / `BAEQu0AhhAjJ_KAKB`（同属 `BI1/sandero`）· Jogger=`BAERm`（`RI1/jogger`）· Duster=`BAERg`（`DU3/duster`）· Bigster=`BAEQ_`（`BD1/bigster`）· Striker=`BAERl`（`BK1/striker`）· Neuer Spring=`BAEQl`（`TWD/neuer-spring`）· 上一代 Spring=`BAEP8`（`S2E/spring`）。
- **★ 年款**：各 base 的 `/c/<base>/A` JSON 里 `impact[].specCatCode=="c2gMillesime"` → `millesime_YYYY`。本季：Sandero/Stepway/Jogger=2025、Duster/Bigster=2024、Striker/Neuer Spring=2026、上一代 Spring=2024。
- **⚠ Bigster Extreme 起价陷阱**：`startingPrice` 比 PVC 低 500 €（Extreme mild hybrid-G 140：26.990 vs 27.490；另 4 个 Extreme 版本同样差 500）→ **一律取 `minPrice`**，并用 `/pricelist/<base>` 的 `PVC` 交叉校验。
- **⚠ 两个 Spring 并存**：`Neuer Spring`（`BAEQl`，Expression/Journey electric 80，17.900/19.400）为在售新车系；`Spring`（`BAEP8`，仅 `Extreme electric 100`，19.700，MY2024）**只剩库存车入口**（`Lagerfahrzeuge anzeigen`，无配置器）→ 入表但「是否停销」标 **是**。
- **★ 型号名补充**：Neuer Spring 配置器 `pricedVersion` 只有 `Expression`/`Journey`，必须按官网价目页补成 `Expression electric 80` / `Journey electric 80`。Stepway 版本的官方名自带 `Stepway` 前缀，车型列写 `Sandero Stepway`。
- **★ 燃油口径（与既有西班牙 Dacia 一致）**：TCe / Eco-G（汽油+LPG 双燃料）→ `Gasoline`；mild hybrid(-G) 140 → `MHEV`；hybrid 155 / HYBRID 155 / tribrid 150 4x4 / Striker hybrid 150 4x4 → `HEV`；electric → `BEV`。
- **交付结果（20261026）**：`Dacia_DE_官网价_20261026.xlsx`，**74 条 / 8 个车型**（Sandero 9 · Sandero Stepway 10 · Jogger 9（5 座 5 + 7 座 4）· Duster 16 · Bigster 17 · Striker 10 · Neuer Spring 2 · Spring 1），13.590–32.790 €。燃油：Gasoline 29 · HEV 23 · MHEV 19 · BEV 3。

---

### INEOS DE（德国 `ineosgrenadier.com/de/de`：**Next.js 站点 + 独立配置器主机，官方价目 PDF 一页可文本解析**）✅

- **★ 两个源**：官网 `https://ineosgrenadier.com/de/de/`（车系页）与配置器 `https://configurator.ineosgrenadier.net`（**独立主机**，curl 直连返 500，浏览器 fetch 返 200 → 必须走浏览器）。产品清单：`https://configurator.ineosgrenadier.net/products/products/DE`，返回 JSON。
- **★ 产品码与车系对应**（DE，2026-10 在售）：`G01E` Station Wagon（BASE `72.640` / `PPT` Trialmaster `82.900` / `PPQ` Fieldmaster `82.900`）· `G02E` Utility Wagon 2-Sitzer `71.140` · `G03E` Utility Wagon 5-Sitzer `72.640` · `G09E` Quartermaster（同三档 trim，`72.640` / `82.900` / `82.900`）· `G11B` Chassis Cab（MY24，**无价**）。
- **★ 官方价目 PDF**：`https://mss-p-034-delivery.stylelabs.cloud/api/public/content/Pricelist_DE`（1 页，文本层正常，`pdftotext -layout` 表头会错位）。可靠解法：`pdftotext` 后按**产品码 token 定位行**（`G01E` / `GEB` …），再用 **x 坐标**把价格列归到表头分组（Station Wagon / Utility Wagon 2-seat / Utility Wagon 5-seat / Quartermaster / Chassis Cab）。柴油 = 同款汽油 +1.000 €（`GEB` 汽油 / `GEC` 柴油）。
- **★ 年款**：PDF 与产品 JSON 均写 **MJ27**（= MY2027）→ 入表 `MY2027`。Chassis Cab 为 `CC-24`（MY24）。
- **★ 型号名（以配置器“Motor”栏为准，2026-10 修正）**：发动机全称是 **`BMW 3.0L Turbo-Benziner, Reihensechszylinder`**（0 €）/ **`BMW 3.0L Twin-Turbo-Diesel, Reihensechszylinder`**（+1.000 €）——**必须带 `BMW` 前缀和 `, Reihensechszylinder` 后缀**，别只写 `3.0L Turbo-Benziner`。型号列 = trim + 发动机全称：`Grenadier BMW 3.0L Turbo-Benziner, Reihensechszylinder` / `Trialmaster Edition BMW 3.0L Twin-Turbo-Diesel, Reihensechszylinder`。车名列用官网车系名（`Grenadier Station Wagon` / `Grenadier Utility Wagon (2-Sitzer)` / `Grenadier Utility Wagon (5-Sitzer)` / `Grenadier Quartermaster`）。
  - 取法：`ineosgrenadier.com/de/de/das-fahrzeug/fahrzeugkonfigurator` → 点车系 `VERSION AUSWÄHLEN` → 版本卡 `KONFIGURIEREN` → 第 01 步「FAHRZEUG & ANTRIEB」的「Motor」单选组即原文（同时显示选装价 0 / 1.000）。
- **⚠ 未纳入（须在交付说明里讲清）**：
  - **Quartermaster Chassis Cab**：官网车系页只有 `REGISTRIERE DICH ALS INTERESSENT`（登记意向），无价格；MJ27 价目 PDF 虽有 72.640 / 73.640，但配置器无购车入口 → **不入表**（避免把「仅登记」当成在售）。
  - **Black Edition**：官网价格位是占位符（`AB †`），无实价。
  - **Trialmaster X**：限量版，官网写 `AB €87.890*`，价目 PDF 无此版本。
  - **Arcane Works Detour**：定制系列，无公开价。
- **交付结果（20261026）**：`Ineos_DE_官网价_20261026.xlsx`，**16 条 / 4 个车系**（SW 6 · UW 2-Sitzer 2 · UW 5-Sitzer 2 · Quartermaster 6），71.140–83.900 €。燃油：Gasoline 8 · Diesel 8。

---

### Jeep DE（德国 `www.jeep.de`：**Akamai 封 curl，配置器 SPA 逐卡点取 + 官方价目 PDF 交叉校验**）⚠️ 需浏览器

- **★ 站点结构**：全站（含 PDF）对 curl 返 **403 Akamai**，加全套请求头也无效；浏览器内 `fetch` 200。PDF 走「本地 Node HTTP 接收器 + 浏览器 fetch POST」落盘（`http://127.0.0.1:18766/pdf?name=...`）。
- **★ 配置器**：`https://www.jeep.de/omni/konfigurator`（SPA，hash 路由）。首页是 13 张车系×动力卡片，卡片用 **`aria-label`** 标识（`Neuer Compass e-Hybrid` / `Avenger e-Hybrid MJ27` / `Wrangler Benziner` …）。点卡片进入 `#/customize`，**价格异步加载**，首次解析常缺第一个 trim 的价格 → 等 9–12 s 再解析，或读 hub 起价校验。
- **⚠ hash 历史坑**：`history.back()` 常回不到 hub → 每台车之前直接 `navigate` 到 `https://www.jeep.de/omni/konfigurator`。
- **★ 解析法**：`document.body.innerText` 正则 `/([A-Z0-9][A-Z0-9 .\\-]{2,40})\\n\\nUPE des Herstellers ab Werk ab\\n\\n([\\d.]+)\\n€/g` 取 trim+价；动力名取含 `kW` 且不含 `/100`、`g/km`、`kWh` 的行（`1.2 Hybrid 48V 107kW (145PS) Automatik`）。**同车系多动力时，trim 卡只显示当前动力的价格**：`Compass Elektro` 有 157/170 kW 两档，必须分别点 trim 读「Motorisierung」段确认组合（`FIRST EDITION` 仅 157 kW）。
- **★ 官方价目 PDF（4 份，全部 `www.jeep.de/content/dam/jeep/de/models/pdf/`）**：`Compass-MY26.pdf`（MJ2026）· `Avenger-MY27.pdf`（MJ27）· `Avenger_MY25.pdf`（**文件名骗人，内容是 MJ2026**，09.01.2026）· `Wrangler.pdf`（MJ2025，`ab 07/2025`）。价格表在 `pdftotext -layout` 的固定列区，先 `grep -n "Unverbindliche Preisempfehlung"` 定位。
- **★ 年款**：官方 MJ 标记 → `MY2027` / `MY2026` / `MY2025`。**Avenger 两代同时在售**（MJ26 清库 + MJ27 新车），配置器并列，必须按 MJ 分开、不能合并。
- **★ 燃油口径**：`e-Hybrid`（1.2 T3 48V，81/107 kW）与 `4xe`（1.2l T3 4xe）在官网标签就是 **`Hybrid 48V`** → **MHEV**（不是 HEV）；`e-Hybrid Plug-In`（1.6 165 kW）→ **PHEV**；`Elektro` / `4xe Elektro`（双电机 275 kW）→ **BEV**；Wrangler `2.0l T-GDI` → **Gasoline**。
- **⚠ 配置器 vs PDF 差异（以配置器为准）**：
  - `Compass 4xe Elektro`：配置器 **275 kW (375 PS)**，PDF 写 276 kW。
  - `Avenger 4xe MJ27`：PDF 只列 `UPLAND 34.300`，配置器还有 `85th ANNIVERSARY 35.900`、`OVERLAND 36.500`。
  - `85th ANNIVERSARY` 全系（Benziner 30.400 / e-Hybrid 32.400 / Elektro 42.300）**不在 MY27 PDF 里**，只在配置器。
- **★ 在售范围**：仅 Avenger / Compass / Wrangler 三车系；Renegade、Grand Cherokee、Gladiator 已无页面，Wrangler 只售 Benziner（无 4xe）。
- **交付结果（20261026）**：`Jeep_DE_官网价_20261026.xlsx`，**44 条 / 3 个车型**（Compass 13 · Avenger 29（MY2026 14 + MY2027 15）· Wrangler 2），26.300–72.900 €。燃油：MHEV 17 · BEV 15 · Gasoline 9 · PHEV 3。

---

### Abarth DE（德国 `www.abarth.de`：**Akamai 封 curl，浏览器配置器 + 官方价目 PDF 双源**）⚠️ 需浏览器

- **★ 封锁**：主站与 PDF 对 curl 一律 **403 Akamai**（`errors.edgesuite.net`，367 字节）；浏览器打开正常。
- **★ 在售范围**：`https://www.abarth.de/omni/konfigurator/#/`（Stellantis OmniChannel SPA）hub 只有 **3 个车系 / 6 个版本**：`500e HB`（2）· `500e Cabrio`（2）· `600e`（2）。更早的 124 Spider / 500C / 595 / 695 在「Ehemalige Sondermodelle」页明确 `laufen nicht mehr vom Band`，无价、不入表。
- **★ 价格**：hub 卡片与 customize 页版本卡都直接写 `UPE des Herstellers ab Werk ab`（含 19% MwSt，不含 Überführung）。价格 API `POST https://api.omnichannel.stla-aws.net/pricing/v1/vehicle`（Bearer + `brandCode:66` + `marketCode:3110`），body 关键字段 `version:"365.A2A.2.000"`、`trim:<内饰码>`、`priceType:"eStorePrice"`；响应 `price.vehicle.prices[]` 里取 **`priceType:"cataloguePrice"` 的 `withVAT`**（本例 41.989,99，含税应为 35.285,71×1.19；界面显示 41.990）。`totalPromo` / `ECOBONUS` 一律不用。
- **★ 官方价目 PDF**（`www.abarth.de/preislisten`，选车型后出直链；curl 403，用「浏览器 fetch → POST 到本机 Node 接收器」落盘）：
  - 500e：`/content/dam/abarth/de/pricelist/2026/2025017853_AB_LB_Preisblatt_500e-WEB.pdf`（3.1 MB，6 页）
  - 600e：`/content/dam/abarth/de/pricelist/2025/600e/july-26/2026038658_AB_LB_Preisblatt_600e_MY2026_WEB.pdf`（830 KB，6 页）
  - 文本层正常，Node `pdfjs-dist` 可解析（`node pdftext.js`）；价格行是 `Preis* 41.990 €`，版本名在紧邻上一行。
- **★ 官方版本全称（PDF）**：`ABARTH 500e` / `ABARTH 500e TURISMO`（LIMOUSINE 列）· `ABARTH 500e CABRIO` / `ABARTH 500e TURISMO CABRIO` · `ABARTH 600e TURISMO` / `ABARTH 600e COMPETIZIONE`。配置器版本卡只显示 `500e` / `Turismo`（相对车系），**写型号列要用 PDF 全称**，否则同名的 `Turismo` 在两车系里分不清。
- **★ 年款**：只有 600e 的官方 PDF 文件名带 `MY2026` → `MY2026`；500e 的 PDF 文件名无 MY、正文只有 `STAND 01/2026`（价目表版本日期）→ `官网无年款`。**不要把 STAND 日期当年款**。
- **★ 燃油**：全系 `Elektro` → **BEV**（500e 113,7 kW/155 PS；600e TURISMO 175 kW/240 PS、COMPETIZIONE 207 kW/280 PS）。
- **交付结果（20261028）**：`Abarth_DE_官网价_20261028.xlsx`，**6 条 / 3 个车型**，37.990–45.990 €，全部 BEV。

---

### Audi DE（德国 `www.audi.de/de`：**Akamai 只封 `www.audi.de`，价格主机 `omnigraph.audi.com` 可 curl 直取**）✅

- **★ 可达性**：`curl https://www.audi.de/de/` → **403 Akamai**（浏览器正常）；但配置器价格走 **`https://omnigraph.audi.com/graphql`，不带 Akamai**，curl / Node 直连即可（本机 schannel 偶发 `CRYPT_E_NO_REVOCATION_CHECK`，用 `rejectUnauthorized:false` 或 curl `--ssl-no-revoke`）。
- **★ 持久化查询（APQ）**：`operationName=CarlineStructure`，`sha256Hash=252862bdb52e8818f5847539b531167019155cb8e7006853a5aed948999d3d61`；variables `{"identifier":{"brand":"A","country":"de","language":"de","id":"<carlineId>"},"enableIncentives":false}`。必须带 `content-type: application/json` + `apollo-require-preflight: true`（否则 `CSRF_ERROR`）。
- **★ 在售全量 = 61 个 carline**：不要猜 id（`a3`/`a5`/`q4` 不存在，`a3sb`/`a3limo`/`q4etron` 才存在）。权威清单在总览页 `https://www.audi.de/de/neuwagen/`：
  - 静态 `<button data-testid="cargroupCard-<group>">` → 15 个车系组（a2etron/a3/a5/a6/a6etron/q3/q4/q5/q6/q7/q8/q9/etrongt/nuvolari/f1），各组「N Modelle」合计 **61**；
  - 页面内 `<script type="x-feature-hub/serialized-onegraph-store">` 是 Apollo store 的 JSON，递归找 `__typename === "CarlineStructureCarline"` 即得 **61 个 `identifier.id` + name + `prices.minPrice` + 配置器 URL**（比逐组点卡片快得多）。
- **★ 价格**：`data.carline.trimlines[].models[].prices.price.value`（含 19% MwSt，不含 Überführung）；`prices.priceWithFees` 同值。与官方价目 PDF 逐一吻合（Q7 87.900/90.500、A2 38.200/41.900/48.900/51.200、Q9 108.400）。
- **★ 版本名**：用 **`engineName`**（= 配置器第 1 步「Modelle und Antriebe」卡片的原文，如 `quattro 470 kW tiptronic`、`e-tron quattro performance 250 kW`）；`name` 会漏功率（A2 e-tron 四个型号的 `name` 全是 `e-tron`，只有 `engineName` 带 `125/140/170/240 kW`）。`trimline` 非 `Grundmodell` 时 `engineName` 已自带前缀（`S line business e-tron performance 270 kW`），**不要重复拼**；但**多装备线车系里的基础行要补 `Grundmodell ` 前缀**（与 advanced / S line 行对齐，用户 20261028 确认）——只有 9 个车系有多条装备线（A3 Limousine / A3 Sportback / A3 Sportback e-hybrid / A6 Avant e-tron / A6 Sportback e-tron / Q6 SUV e-tron / Q6 Sportback e-tron / Q8 SUV / Q8 SUV e-hybrid），共 30 行；其余 46 个车系只有一条装备线，**不加**（避免每行都重复同一个词）。
- **★ 出行粒度**：一行 = 一个配置器卡片 = trimline × 动力。A3 Sportback 18 行（3 条装备线 × 6 动力），全站 **172 行 / 55 个 carline**。
- **★ 无价无配置器的 6 个 carline 不入表**（总览页有卡片但**无 `ab` 价、无「Konfigurieren」、Neuwagenbörse (0)**）：`S6 Limousine TDI`、`S6 Avant TDI`、`RS 6 Avant`、`RS 6 Avant performance`、`Audi Nuvolari`、`Audi R26`（R26 页面明写 `Dieses Fahrzeug steht nicht zum Verkauf.`）。CarlineStructure 对它们返回 `trimlines: []`。
- **★ 年款**：页面和价目 PDF 正文都**不写 `Modelljahr`**；年款取 GraphQL `models[].modelId.year = 2027`（172 个型号全为 2027），旁证两条官方信号：站内生成的配置器链接 `?pr=8YYANC1_2027%7C…`、官方价目 PDF 归档目录 `/content/dam/country/de/de/neuwagen/preislisten/my-2027/preislisten/preisliste_<slug>.pdf` → **MY2027**。价目 PDF 在该目录下只有 `a2-e-tron` / `q7-suv` / `q9-suv` 三份可直连（其余 slug 404），可作为价格交叉校验源。
- **★ 燃油**：取 `technicalDataV2.modelAttributes`——`driveTrain` ∈ `ICE` / `MHEV` / `PHEV` / `BEV`，`fuelType` ∈ `PETROL` / `DIESEL` / `ELECTRICAL`。即 `BEV→BEV`、`PHEV→PHEV`、`MHEV→MHEV`、`ICE+PETROL→Gasoline`、`ICE+DIESEL→Diesel`。Audi 官方价目 PDF 也写 `(mit MHEV plus-Technologie)`，与 `driveTrain:MHEV` 一致。
- **★ 交叉校验（必做）**：每个 carline 的 `min(rows.price)` 必须等于总览页 `prices.minPrice`（即卡片「ab X EUR inkl. MwSt」）——61/61 全对。
- **交付结果（20261028）**：`Audi_DE_官网价_20261028.xlsx`，**172 条 / 55 个车型**，31.850–160.500 €。燃油：MHEV 61 · BEV 40 · PHEV 28 · Gasoline 26 · Diesel 17。

---

### Aiways DE（德国 `ai-ways.eu/de`：**营销站，德国境内不发售、无德国价**）❌ 无数据

- **★ 站点性质**：WordPress + Elementor 营销壳（`wp-content`、`elementor` 大量出现），导航只有 `U5 / U6 / ÜBER UNS / Service`，**没有配置器、没有「Preise」页**。
- **★ 无德国价（三点证据）**：
  1. 整站 HTML（首页 + `/de/u5` + `/de/u6` + Service 页）里 **`€` 出现 0 次**、`CHF` 出现 0 次，也没有任何「ab X」价格块；
  2. 所有购买/试驾/目录入口都指向瑞士进口商 **`aiways-switzerland.ch`**（`/de/catalog/`、`/fr/catalog/`、`/de/probefahrt/`、`/de/kontakt`）；
  3. 站内 `/de/wp-json/wp/v2/media?search=preis` 能翻到的价目 PDF 全是 **瑞士版**：`2024-Aiways-U5-Preisliste_MY22-without-XCITE-VAT-CHANGE.pdf`（表头 `Preis inkl. MwSt in CHF`，U5 PRIME **45`490**，Version 01.12.2023）、`2024-Aiways-U6-Preisliste.pdf`（`Provisorischer Preis inkl. MwSt. in CHF`，U6 PRIME **48`990**），落款是 `Maxomotive Schweiz AG`。
- **★ 结论**：德国官网不提供德国 MSRP，唯一可见价格是瑞士 CHF 且 U6 明标「临时价」→ **不生成表**（拿 CHF 当 DE 价、或把「Provisorischer Preis」当官方 MSRP 都属编造）。如后续要求「瑞市」再按 `aiways-switzerland.ch` 采。

---

### Lucid DE（德国 `lucidmotors.com/de-de`：**Next.js 服务端直出「Ab X €」，curl 可通**）✅

- **★ 可达性**：`curl` 直通，但 schannel 需加 `--ssl-no-revoke`（否则 `CRYPT_E_NO_REVOCATION_CHECK`）；带普通 Chrome UA 即可，无 Akamai/Cloudflare。
- **★ 价格源**：车型页 HTML 里**服务端已渲染** `Ab 85.900 €`，剥 `<script>` 后正则 `/Ab\s+([\d.]+)\s*€/` 即可；`/de-de/air` 与 `/de-de/gravity` 两页覆盖全系。Air Sapphire 是特例，文案 **`Vollständig ausgestattet bei 250.000 €`**（没有 `Ab`），必须单独匹配。
- **★ 版本矩阵**：
  - Air（4）：Pure 85.900 · Touring 99.900 · Grand Touring 130.900 · Sapphire 250.000（满配价）。
  - Gravity（4）：Touring 94.900 · Touring Plus 99.900 · Grand Touring 119.900 · Grand Touring Ultimate 147.500；页面原文「vier individuelle Ausstattungsvarianten」，价格块顺序与车型块一致。
- **★ 年款**：车型页不写 MY；**对比页**（`/de-de/compare?vehicles=air-pure-2026,...`）的下拉项写 `2026 Lucid Air Pure` / `2027 Lucid Gravity Touring` → Air=2026、Gravity=2027。**2026 款 Gravity 只出现在对比下拉里、配置器无**，不纳入。
- **★ 配置器**：`/de-de/configure`（Air）与 `/de-de/configure/gravity`；价格与车型页一致，可交叉校验。
- **口径**：含增值税 + 运输/文件费（官网 disclaimer）；Sapphire 为「fully equipped」单一价。
- **交付结果（20261026）**：`Lucid_DE_官网价_20261026.xlsx`，**8 条 / 2 个车型**（Air 4 · Gravity 4），85.900–250.000 €。燃油：BEV 8。

---

### MINI DE（德国 `www.mini.de/de_DE`：**BMW Connext 前端渲染，Akamai 封 curl，只能浏览器逐页等渲染**）⚠️ 需浏览器

- **★ 可达性**：`curl` 直接超时（Akamai），必须 MCP 浏览器；页面价格是**前端异步渲染**，`navigate` 后常先返回空卡，需等 **8–10 s**（个别页要 reload 一次）。
- **★ 7 个车系页（slug 必须用全称，猜不得）**：`/de_DE/home/range/{electric | mini-3-tuerer | mini-5-tuerer | mini-cabrio | mini-countryman | all-electric-mini-countryman | all-electric-mini-aceman}/models.html`。后两个不是 `mini-countryman-electric` / `mini-aceman`（会 404「Error page」）。
- **★ 车系官方名**：取各页 `<title>` 前缀，大小写权威：**MINI Cooper Electric · MINI Cooper 3-Türer · MINI Cooper 5-Türer · MINI Cooper Cabrio · MINI Countryman · MINI Countryman Electric · MINI Aceman Electric**（`<h1>` 全是营销语「WELCHER STYLE…」，不能用）。
- **★ 卡片解析**：`.fsm-tp-card` → `h3` = 车型名、`h4` = trim、整卡文本 `Ab ([\d.]+) €`。**`h3.textContent` 才是正写**（`MINI Cooper ONE`）；`innerText` 被 CSS 全大写（`MINI COOPER ONE`），别直接用。
- **⚠ 配置器折扣陷阱**：`configure.mini.de/de_DE/configure/<range>/<modelCode>/<trimCode>` 的「Gesamtpreis」会自动减 **€1.000 Kundenvorteil**（例：Cooper ONE Essential 显示 25.450，官网标价 26.450）→ **一律用车型页 `Ab` 价**，不用配置器总价。另：配置器 `body.innerText` 可能为空，读价要用 `take_snapshot`（无障碍树）。
- **★ 年款**：全站无 MY——vehicle-trees API 无年份字段，页面只有页脚 `© MINI 2026`（版权年，不是 MY）→ 全部 `官网无年款`。
- **口径**：含增值税 + Bereitstellungspauschale（tp-cards disclaimer）。
- **交付结果（20261026）**：`MINI_DE_官网价_20261026.xlsx`，**98 条 / 7 个车系**（Cooper 3-Türer 14 · Cooper Electric 13 · Cooper 5-Türer 13 · Cooper Cabrio 9 · Countryman 25 · Countryman Electric 13 · Aceman Electric 11），26.450–54.220 €。燃油：Gasoline 52 · BEV 37 · Diesel 9。

---

### Polestar DE（德国 `www.polestar.com/de/`：**curl 被 302 跳 polestar.cn，真实浏览器完全正常**）✅ 需浏览器

- **★★ 关键纠偏（2026-10-27 实测）**：`curl` 对 `www.polestar.com` 任意路径（`/de/`、`/de-de/`、`/robots.txt`）一律 **302 → `https://www.polestar.cn/<同路径>`**，会误判为「整站封锁 / 零数据」。**真实浏览器打开 `https://www.polestar.com/de/` 完全正常**，返回德国站（导航为 Polestar 2/3/4/5 + Laden/Shop，页脚 `Polestar © 2026`）。→ **这是 curl/无指纹 bot 的国家跳转，不是 IP 级封锁**；判定前必须用浏览器复核。⚠ `/de-de/` 本身是 404（会落到 global 404 页，导航链接全变 `/global/`），德国路径是 **`/de/`**，别用 `/de-de/` 作可达性判据。
- **★ 在售范围（德国）**：配置器 `staticData.availableModels.models` 恰好 5 条 —— `polestar-2`、`polestar-3`、`polestar-4-coupe`、`polestar-4-suv`、`polestar-5`。Polestar 1 只有页脚入口 `/de/polestar-1/`（heritage 页、**全页 0 个 €**、无配置器、CTA 指向 Polestar 2）→ 已停产，不入表。
- **★ 价格主源（配置器 API，无折扣字段）**：
  `GET /de/<model>/configurator/api/v2/initconfig?productType=Cash&customerType=B2C&customerSubtype=None&markdown=true&excludePrice=false`
  - 变体全集在 `configuration.features[].data.featureGroups[]`（`data.id === "engine"`）：每个 feature 的 **`name` = 官网版本名**、**`modelEngine.unformattedPrice` = 该版本 Kaufpreis ab（含 VAT）**。⚠ `price` 字段是相对默认版本的**加价差额**（如 `4.300 €`），别当车价。
  - `configuration.prices.startingPrice.value` = 当前选中版本 `Kaufpreis ab`；`configuration.model.modelYear` = 年款；`configuration.model.displayName` = 车型名。
  - `discounts: []`、`tacticalCampaigns.data: []` —— 无促销价覆盖。
- **⚠ 「Kaufpreis ab」≠「Gesamtfahrzeugpreis」**：默认配置里常预勾 `Einzeloptionen`（AC-Ladekabel 200 €），使 `Gesamtfahrzeugpreis` 比起价高 200 €（Polestar 2：57.690 vs 57.890；Polestar 3：78.900 vs 79.100）。**MSRP 一律取 `startingPrice`/`modelEngine.unformattedPrice`**，且与车型页「ab」价一致（5 个车型页全部吻合：57.690 / 78.900 / 61.900 / 57.900 / 118.600）。
- **⚠ 口径**：`Kaufpreis ab` 含 19% MwSt.，**不含 Überführungskosten**（Polestar 2 = 1.200 €，其余 = 1.300 €）；`summaryPrice`/`Gesamtbestellpreis` 是加上运费后的落地价，**不要用**（如 Polestar 5 页脚 sticky 显示 119.900 = 118.600 + 1.300）。
- **⚠ Polestar 2 的隐藏第三项**：engine 组里还有 `Long Range Dual Motor mit Performance-Paket`，`modelEngine` 同样是 61.990 €，但 **UI 只渲染 2 张版本卡**；Performance-Paket 实际是 6.500 € 选装包（`packages` 组）。→ **不入表**，别把它当作 61.990 的第三款。
- **★ 年款**：`configuration.model.modelYear` —— Polestar 2/3/4 Coupé/4 SUV = **2027**，Polestar 5 = **2026**。页面正文无 `Modelljahr`/`MY` 字样；页脚 `© 2026` 是版权年；Polestar 5 的 `Voraussichtliche Lieferung Feb.–März 2027` 是**预计交付期**，两者都不得当年款。
- **交付结果（20261027）**：`Polestar_DE_官网价_20261027.xlsx`，**11 条 / 5 个车型**（2 · 3 · 2 · 2 · 2），57.900–141.600 €。燃油：BEV 11。

---

### VinFast EU/DE（德国 `vinfastauto.eu/de`：**Cloudflare 托管挑战，curl 403，真实浏览器 10–15 s 放行**）⚠️ 需浏览器

- **★ 可达性**：`curl` 命中 `Just a moment...`（403 / 5 KB 挑战页）；浏览器 `navigate` 后先出现「正在验证您是否是真人」，等 **10–15 s** 自动放行，之后同源页面正常渲染。
- **★ 在售范围（德国）**：只有 **VF 6 / VF 8**。`/de/vehicles/vf-3`、`/vf-5` 是 404；`/vf-7`、`/vf-9` **200 但重定向回首页**（不在售），导航里也只有这两款。
- **★ 价格源（双源一致）**：
  - 车型页 `https://vinfastauto.eu/de/vehicles/vf-6|vf-8` → 「Fahrzeugspezifikation」表头即版本名，行「Preis ab1」即价格。
  - 配置器 `https://shop.vinfastauto.eu/de_DE/reservation?model=vf6|vf8` → 自动跳产品页（`EB15_2023_MOD_GB11E.html` / `PD1U_2023_MOD_ND11E.html`），显示 `Online-Preis` + 版本单选（Eco / Plus）。
  - 两源价格完全一致：VF 6 Eco 34.990 / Plus 38.990；VF 8 Eco 48.490 / Plus 54.490。
- **⚠ 千分位不统一**：同一站 VF 6 写点号（`34.990 €`）、VF 8 写逗号（`48,490 €`）→ 出表统一欧元点号 `34.990,00`。
- **★ 版本名**：车型页表头是 `VF 6 Eco` / `VF 6 Plus` / `VF 8 Eco` / `VF 8 Plus`（配置器里只写 `Eco` / `Plus`，必须补车系前缀）。车列 `VF 6` / `VF 8`。
- **★ 年款**：页面不显示 MY；配置器产品码里的 `_2023_MOD_` 是内部产品代号，不是官方年款 → 全部 `官网无年款`。
- **口径**：`Online-Preis` 含增值税、含电池；按配置器租赁脚注「Fahrzeuggesamtpreis … zzgl. Überführungskosten」，**不含 Überführungskosten**。可选 `Smart Driving Package` 另计，不入 MSRP。
- **交付结果（20261027）**：`VinFast_DE_官网价_20261027.xlsx`，**4 条 / 2 个车型**（VF 6 Eco/Plus · VF 8 Eco/Plus），34.990–54.490 €。燃油：BEV 4。

---

### smart DE（德国 `de.smart.com/de/`：**Storyblok + SPA，价格藏在无鉴权 trpc BFF；BFF 是跨年款全量目录，在售要按 `latestModelYearFlag=true` 过滤**）✅

- **★ 可达性**：主站、配置器、`__app__` BFF 全部可直连，但 `curl` 默认报 `schannel: CRYPT_E_NO_REVOCATION_CHECK`（本机证书吊销检查失败，不是反爬）→ **必须加 `--ssl-no-revoke`**，加上后 200。
- **★ 车型页 0 价格**：`/de/models/hashtag-one|three|five/` 是 SPA，HTML 里 grep 不到任何 `[0-9]{2}\.[0-9]{3},00`；`/de/models/hashtag-two/`（smart #2）例外——预发布页，价格写在 Storyblok 内联 JSON 的 `priceRichText` 里（URL 编码，需 `decodeURIComponent` 再取 `"text":"..."`）。
- **★ 价格主源（无鉴权 trpc BFF，一条请求拿全站）**：
  `https://de.smart.com/__app__/customizer-app/prod/bff/getAppModel,getProductModel?batch=1&input={"0":{"envName":"prod","preview":false,"marketId":"de","languageTag":"de-DE","mock":false},"1":{…同上+,"priceType":"private"}}`
  响应是 batch 数组：`[0].result.data` = Storyblok 文案；`[1].result.data` = `{v1,v2,lineCategories}`。
  - `v2.models[].lines[]` → 每个 Line 的 `priceRanges[]` 里 **`type:"cash-buy" && priceType:"private"` 的 `minPrice.formattedValue`** 就是官网展示的「Kaufpreis ab」。
  - `lineCategories[]` 给 `defaultPN18`；`v1.products[]`（310 条 PN18）给 `battery.name`（`"66 kWh (gesamt)/62 kWh (nutzbar)"`）和 `classifications[]`（`…PRODUCTIONDATA.modelyeardescription` = Modelljahr、`…transmissiontype` = RWD/AWD）。
  - ⚠ `priceType:"commercial"` / `netPriceRange` 是**未含税企业价**（31.084,03），别拿；`leasing` 的 `minPrice.value` 可能是 `-1`。
- **⚠ MSRP ≠ PN18 价**：`getProductDetailsModel?…productCode=<PN18>&priceType=private` 返的是**含默认配色/选装的那一台**的车价（Premium MY2027 默认 PN18 = `48.590,00 €`），而 Line 的「ab」= `47.990,00 €`。→ **一律取 Line 级 `minPrice`**，PN18 接口只用来交叉校验。
- **★★ `lineCategories` / `v2.lines` 的 34 条 ≠ 在售目录**：BFF 里每个车型同时挂着**上一代年款的同名 Line**，`latestModelYearFlag=true` 才是官网配置器/车型页实际呈现的在售 Lines —— 实测 `#1 6 · #3 5 · #5 5 = 16` 条，加上预售的 #2 共 **17 行**；`false` 的 18 条（#1/#5 的 MY2025、#3 的 MY2024）**不入表**。
- **★ 为什么旧年款那 18 条必须排除**（三重证据，别只看年款字段）：① 配置器 UI 根本不显示它们；② `v1.products[].stock` 几乎全线 `outOfStock`（#3 旧款 46 个 PN18 全出架，个别 2025 款残留 1–3 台 = 库存车而非目录在售）；③ 旧款里有 5 条 Line 在 2027 目录**已取消**（#1 `Pure+`、#1/#5 `Pulse`、#5 `Pro`、#5 `Summit Edition`、#3 `Keith Haring Edition`）→ 属换代下架。`#3` 旧款的 `endeProduktion` 官网直接写 **`Q3 2026`**（生产已结束），`#1` 旧款写 `in Produktion` 但只是残留产能，不能当在售依据。
- **⚠ 旧年款价 ≠ 现行价（会把指导价采低）**：同一 trim 两代差 500–1.000 €，例 `#3 Pro` 40.490(2024) → 41.140(2027)、`#3 Premium` 48.490 → 48.990、`#5 Pro+` 50.900 → 51.400、`#1 BRABUS` 52.490 → 53.490。两代并列成两行 = 同一型号出现两个「起价」，直接判错。
- **★ 年款**：官方年款看**配置器 Lines 卡片标题** `smart #X | 2027` → 原样写 **`2027`**（官网没有 `MY` 前缀，别自己加）。`v1.products[].classifications` 里的 `modelyeardescription`（2024/2025/2027）只用于**判断哪条 Line 是当年款**，不用于填「年款」列；一个 Line 只出一行，不按颜色/配置拆。
- **★ 官网型号名称 = `<车型名> <Line 名>`**（`smart #1 Pro+ Black Collection`、`smart #5 Premium AWD`）。**不要**在后面拼电池 kWh 与 RWD/AWD——那是 `v1.products` 的规格串，不是官网命名；同一 Line 的电池/驱动本来就唯一（#1/#3 = 49 或 66 kWh，#5 = 100 kWh，AWD 只出现在 `Premium AWD` / `BRABUS` 的 Line 名里）。
- **★ smart #2 是预发布价**：官方「Startet ab 19.990 €¹」，脚注原文 `Dies sind voraussichtliche Angaben. Das Fahrzeug ist noch im EU-Homologationsverfahren.`，且不在配置器数据里 → 按全局纪律 #2 原样入表（型号名 `smart #2 Pure`）、`官网无年款`，交付说明标注。
- **口径**：配置器页明确「Alle Preise inkl. MwSt.」= **含 19% 增值税**，不含选装、不含一次性 Überführungskosten 990 €（含税）。`是否停销` 全部 `否`（官网未标停产）。
- **★ 交叉校验要做集合相等，不是单向包含**：BFF `latest=true` 的 16 价 ↔ 配置器 UI `body.innerText` 16 价 ↔ 车型页 pinterest 埋点 `product_price`。⚠ 之前只验了「UI 的 17 个价在 BFF 里都能找到」（单向），所以 BFF 多出的 18 条没被发现 —— 必须反向再比一次：**表里每一行都能在官网 UI 上找到对应卡片**。
- **⚠ 本机出表两个坑**（与站点无关，但会卡住交付）：① 无 python3 → `format_output.py` 跑不了，改用 **Excel COM（PowerShell）**写 xlsx；② PowerShell 里 `NumberFormat = '@'` 会让解析器报「字符串缺少终止符」（`'@` 被当 here-string 尾巴）→ 用 `[string][char]64` 代替字面量 `'@'`。
- **❌ 作废的交付（2026-10-27 复盘）**：本日用 BFF 出的 **35 行版是错的**（16 条 2027 + 18 条上一代年款 + #2），已被用户以正确的 **17 行版**覆盖；错误原因见上两条。**下次只按 `latestModelYearFlag=true` 出行**。正确版另附第二个工作表「年款依据」（品牌 / 车型 / 年款 / 覆盖型号数 / 判定过程 / 官网原文逐字 / 来源 URL）——年款是官网不易直接证明的字段，建议后续品牌都补这张依据页。
- **交付结果（20261027，已核对为正确版）**：`smart_DE_官网价_20261027.xlsx`，**17 条 / 4 个车型**（smart #1 6 · smart #3 5 · smart #5 5 · smart #2 1），年款 `2027`（#2 = 官网无年款），19.990–61.900 €，燃油 BEV 17；含「年款依据」第二页。

---

### smart DE · 配置器逐线读价（`de.smart.com/de/customizer/?pn18=…`）—— BFF 拿不到时的交叉校验/兜底

> **首选仍是上方 ✅ 段的 trpc BFF**（一条请求拿全站）。本段是配置器逐张 Lines 卡读 `Kaufpreis` 的方法与实测价，两条路的价格必须一致；在售范围一律按 `latestModelYearFlag=true` 过滤。

- **★ 可达性**：`curl` 200（Next.js SSR 壳，700 KB+），但车型页 HTML 里**没有任何 € 金额**；价格和 Lines 卡片全靠客户端渲染 → 必须浏览器。`navigate` 常 30 s 超时，但页面实际已加载，**等 6–8 s 再 evaluate** 即可。
- **★ 在售范围（德国）**：`#1 / #2 / #3 / #5` 四款。#2 是预售（EU 认证未完成），其余三款可配置。车型页只有「ab」起价，逐线价格在配置器。
- **★ 配置器（逐线价唯一来源）**：`https://de.smart.com/de/customizer/?pn18=<产品ID>`。产品 ID 从各车型页的「Konfigurieren」按钮取：
  - #1 `HXYH2D3I61EU000001` · #3 `HC1ESD2I51EU01285L` · #5 `HY107D3J61EU00000T`
- **★ 解析法**：`body.innerText` 中每张 Lines 卡是固定三段：`smart #X | 2027` → 线名（Pure / Pro / Pro+ / Pro+ Black Collection / Premium / Pulse / Premium AWD / BRABUS）→ `Kaufpreis1` → `36.990,00 €1`。正则 `/smart #(\d) \| (\d{4})\n([^\n]+)\nKaufpreis1\n([\d.,]+) €/g` 一次取全。
- **★ 年款**：卡片标题里的 `| 2027` 即官方年款，原样入表 `2027`；#2 无 MY（页脚 `© 2026` 是版权年，不采）→ `官网无年款`。
- **★ 各线价格（MY2027）**：
  - #1（6 线）：Pure 36.990 · Pro 39.490 · **Pro+ 44.489,99**（官网就是这个零头，不要抹成 44.490）· Pro+ Black Collection 45.090 · Premium 47.990 · BRABUS 53.490。
  - #3（5 线）：Pro 41.140 · Pro+ 46.140 · Pro+ Black Collection 46.740 · Premium 48.990 · BRABUS 54.490。
  - #5（5 线）：Pro+ 51.400 · Pro+ Black Collection 52.000 · Premium 55.900 · Premium AWD 58.400 · BRABUS 61.900。
  - #2（预售，仅 1 个公开价）：Pure 19.990；Pure+/Premium/Couture Edition 未标价，BRABUS 暂不可订。
- **⚠ 折扣陷阱**：全站有 `smart Prämie` 专项补贴——#1/#3 的 Pure→BRABUS 及 #5 Premium/Premium AWD/BRABUS 减 **6.000 €**，#5 Pro+/Pro+ Black Collection 减 **4.000 €**。**这是促销，必须忽略**，取 `Kaufpreis` 目录价。
- **⚠ 配置价 ≠ 起价**：右下角 `vehicle-details` 悬浮卡会显示某台已选装车的总价（例 #5 BRABUS 62.500），**不是线起价**（61.900），别混。
- **口径**：`Kaufpreis` 含增值税；**不含一次性 Überführungskosten 990 €（含税）**。
- **交付结果（20261027）**：`smart_DE_官网价_20261027.xlsx`，**17 条 / 4 个车型**（#1 6 · #3 5 · #5 5 · #2 1），19.990–61.900 €。燃油：BEV 17。

---

### ALPINA DE（德国 `www.alpina.de`：**品牌站已退役，跳 BMW 品牌愿景页，无车型/价格**）❌ 无数据

- **★ 重定向链（2026-10-28 实测）**：`https://www.alpina.de/` → **301** `https://www.bmwalpina.com/index-en.html`；`bmwalpina.com` 再按出口 IP **302**：
  - 德国 IP（`X-Forwarded-For: 85.214.132.117`）→ `https://www.bmw.de/bmw-alpina`（终页 `/de/bmw-alpina.html`）；
  - 其他 IP → `https://alpina.bmw.com.cn/`（中文站，`X-Cache: HIT`）。
  - 旧配置器域名 `www.alpina-configurator.de` 同样 301 到 bmw.de ALPINA 页，原配置器已下线。
- **★ 德国终页内容**：`<title>BMW ALPINA | Exklusivste Performance Marke von BMW`；全文 **19 次「Vision BMW ALPINA」**，`B3 / B4 / B5 / XB7 / XD3 / XD4 / D3 S / D4 S` 出现 **0 次**；无车型卡、无「Preise」页、无价目 PDF（页面里唯一的 PDF 是回收网点表）。
- **★ BMW.de 侧复核**：`/de/neufahrzeuge/bmw-alpina.html`、`/de/neufahrzeuge/alpina/b3.html`、`/de/modelle/bmw-alpina.html` 全 404；`bmw.de/sitemap.xml` 里 alpina 命中 0。
- **结论**：ALPINA 已并入 BMW，官网不再提供在售车型与官方价；经销商仍有 2025 年生产的 B3/B4/XB7 新车上牌车，但那是**经销商价**，不是 MSRP → **不出表**。

---

### Aston Martin DE（德国 `www.astonmartin.com/de`：**官网/配置器全链路不公布价格 → 按规则出表，MSRP 填 `官网无价格`**）⚠️ 无价格出表

- **★ 可达性**：curl 与真浏览器均 200，无封锁；问题不在可达性，在**官方不给价**。
- **★ 在售清单**：导航（`Modelle` 菜单）共 **24 个版本 / 10 个车系**，即交付表的全部行；`Past Models` 是历史归档入口，不计入在售。
  - Vantage：Vantage S · Vantage · Vantage Roadster
  - DB12：DB12 S · DB12 · DB12 Volante · DB12 Volante: 60th Anniversary Edition
  - Vanquish：Vanquish · Vanquish Volante · Vanquish: 25th Anniversary Edition · Vanquish Volante: 60th Anniversary Edition
  - DBX：DBX GT · DBX S · DBX707
  - Valhalla：Valhalla Coupe · Valhalla Spider
  - Valkyrie：Aston Martin Valkyrie Coupe · Spider · AMR Pro · LM
  - 单车型：Valen · Valour · Valiant · AMR26 F1
- **★ 价格证据**：23 个车型页遍历后 `€` 出现 **0 次**（浏览器 `innerText` 复核同样为 0），无「ab X €」、无 UVP、无价目 PDF。
- **★ 配置器**：`configurator.astonmartin.com/DE/configuration/AM003A`（Angular SPA，`main-*.js`）只渲染车型/外观/内饰，**全程无金额**；免责声明逐字：*"This configurator is not an offer to sell ... Any purchase is subject to the terms and conditions of sale (**including price**) issued by the particular dealer."*
- **★ 用户给的 `/en/dealers/`**：纯经销商定位页（约 112 KB），无库存车、无价格字段。
- **★ 年款**：23 页均无 MY/Modelljahr；唯一四位年份是页脚版权 `Aston Martin 2026`（排除）。AMR26 的 2026 指 F1 新规赛季、Valkyrie LM 的 2025er/2027 指 WEC 赛车与体验计划、Vanquish 25th 的 "this 2025 …" 是叙述句 → 一律 `官网无年款`。
- **★ 交付**：`AstonMartin_DE_官网价_20261028.xlsx`，主表 24 行（MSRP 全部 `官网无价格`），`年款依据` 10 组、覆盖 24 行、无 `[WARN]`。燃油：Valhalla = PHEV；Valkyrie Coupe/Spider、AMR26 F1 = HEV；其余 Gasoline。

---

### Elaris DE（德国 `www.elaris.de` / 用户给的 `www.elaris.eu`：**品牌已破产，官网下线；elaris.eu 是 Wayback 回放且价格自相矛盾**）❌ 无数据

- **★ 公司状态**：ELARIS AG 于 **2025-01-20** 向 Neustadt an der Weinstraße 法院提交破产申请（公司 ad hoc 公告）；行业媒体口径「Neue Fahrzeuge von Elaris gibt es seit Anfang 2025 nicht mehr」。
- **★ 官网**：`elaris.de` 任意路径 → Cloudflare **403「Sorry, you have been blocked」**（真浏览器同样）；经公共代理访问返回 **522**（源站不可达）→ 官网已下线。
- **★ 用户给的 `elaris.eu`**：可以 200，但 HTML 内含 Wayback **wombat** 注入脚本、字体/资源路径为 `/web/20250314213303im_/…` → 是 **2025-03-14 的 Wayback 回放**，不是实时站；且各页来自不同年份快照，阵容都对不上：
  - 首页导航 5 款：BEO / JACO / LENN / DYO / CARO S；
  - 首页链接 6 款：多 LEO、CARO，少 LENN；
  - 配置器 6 个 `car_model_id`：BEO / JACO / LENN / DYO / CARO / CARO S（无 LEO）。
- **★ 价格互相矛盾（三点）**：
  1. 配置器 `Order[base_price]`：BEO 31.939 · JACO 36.494 · LENN 33.354,30 · DYO 17.764,70 · CARO 60.483,20 · CARO S 25.126,10；
  2. 同站 `beo-reservieren` 页写 **「ELARIS BEO € 53.925,-」**，并注明该 UVP 已扣制造商创新补贴 **2.975 €**、另可申领 BAFA **5.000 €**；
  3. 第三方 evspecs 记 BEO 72 kWh 德国含税价 **40.112 €**；2022 年媒体 UVP 为 **47.290–56.900 €**。
  - 配置器还带隐藏字段 `Order[special_discount]=12900`，购买页未展示折前/折后对照 → **无法判定哪个是「不带折扣的官方 MSRP」**。
- **★ 年款**：存档页无任何 MY 标记（只有 `©` 版权年与 2023–2025 的活动日期）→ 若将来采，只能写 `官网无年款`。
- **结论**：无可靠、可复核的当前官方 MSRP → **不出表**。若用户明确要「历史存档价」，再按「只取配置器 `base_price` + 停销=是 + 副表注明快照 2025-03-14」单独确认口径。
