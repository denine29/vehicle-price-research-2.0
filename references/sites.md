# 站点坑位速记表（品牌 × 市场）

> 实测积累，持续追加。**本文件只是索引 + 通用方法**；每个市场的坑位详段在 `sites/<market>.md`，新站追加到对应市场文件（模板 `sites/_template.md`）并在此加一行。

## 0. 站点速查（先看这里）

> **30 秒定位**：按市场找到品牌行 → 看结论和一句话方法 → 按该表末尾的「详段」去读 `sites/<market>.md`（`grep -n "<品牌>"`）。**只看索引不够**，字段名/正则/坑都在市场文件里。
>
> **结论图例**：`✅` 可采并已交付 · `⚠️` 可采但粒度/覆盖不全 · `❌` 无解（封锁，或官网不标价）
>
> **时效性**：文中的 `snapshotVersion` / `dataVersion` / token / 车型 id 都是**当时实测值**，会过期（例：Škoda BE 已从 `b430ec84…` 变为 `37f3d879…`）。每次任务必须**现取**，不能照抄。
>
> **读取方式**：本索引约 260 行，整读也无妨；**详段**在 `sites/<market>.md`，只读对应市场那一份（16–824 行），不要把所有市场文件一起读。

### 西班牙 ES

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| Dacia / Renault | ✅ | `es.co.rplug.renault.com` 配置器后端，Schema.org `priceType:SRP`；每个车系独立 base，用返回的 `next` URL |
| DS / Citroën / Peugeot / Opel / Fiat / Jeep | ✅ | `store.<brand>.es/graphql` → `getProductOffer`；取 `catalogAmount`，**不取** `totalAmount`；`engineGearbox` 传 slug |
| Abarth | ⚠️ | Stellantis Omnichannel SPA，DOM/坐标/URL 全进不去；只能从 `api.omnichannel.stla-aws.net/.../ncs/retrieve` 拿车系级 `cataloguePrice` |
| Audi | ⚠️ | `audi.es` 等全域 Akamai 403（curl/Playwright/外部节点全被拦）→ 改走 `datos.autopista.es/coches/audi/<车系>/`（**非官网第三方**，只能作口径参考并注明"非官网"，不得直接当官方 MSRP 入表） |
| Aston Martin | ⚠️ 无价格出表 | 官方从不公布售价，配置器全链路无价格字段 → 仍出表，MSRP 填 `官网无价格` |

> 详段：sites/es.md（1 段）

### 比利时 BE

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| CUPRA | ✅ | `api.cupra.be/v1/car-configurator/choices/<CARLINE>` 无鉴权，1 请求/车系；取 `engine.price`，**不取** `priceWithReduction` |
| Škoda | ✅ | `cc.skoda-auto.com/c3pobe/*` 配置器 API；`modelId` 第 3 段是年款；取 `modelPrice.price`（**BE：== `priceOriginal`，纯车价**；**UK：OTR 价**，见下方 UK 段） |
| Volvo | ✅ | 主站 Akamai 403（连 robots 也拒）→ 用**真浏览器**开 `/nl-be/l/prijslijsten/` 取 16 份 `prijslijst-*` PDF 链接，PDF 在 `azure-eu-assets.contentstack.com` 可 curl 直下；`pdftotext -table -f 3` 取 `Catalogusprijs incl. btw`（不取 `Nettoprijs*`） |
| Citroën | ✅ | 主站 curl 全 403，但**页面内 `fetch()` 不受限** → `sccf` 静态价格库 JSON |
| KGM / KG Mobility | ✅ | Vercel 托管全开放，`__NEXT_DATA__` 直读 `configurations[].listPrice.priceInclVat` |
| Mitsubishi | ✅ | `www-graphql.prod.mipulse.co` APQ（GET + sha256 哈希）；`getSummary` 的 `summary.model.description` HTML 里取 `Aanbevolen catalogusprijs`，**不取** `model.price.value`（促销价） |
| MG | ✅ | Craft CMS + Alpine；配置器内嵌 `field_commercePrivatePaymentOptions[0].field_paymentOption_basePrice`（= Aanbevolen catalogusprijs）；IM5/IM6/Cyberster 走新版 `editions[].prices.cash` |
| Maxus | ✅ | Next.js `__NEXT_DATA__` → `configurationInfo.configurations[]`；取 `listPrice.priceInclVat`（UI 标签 = "Catalogusprijs"），**不取** `totalPrice` |
| Hyundai | ✅ | curl 到 `org-eu-www.hyundai.com` 仍被 SNI 级 RST，但**页面内 `fetch()` 可打通** → `POST /eu/papi` 跑 `hppFscs2(country,language,modelId,service:"S03")`，取 `fscPrice`（= Aanbevolen catalogusprijs），**不取**车系页 `Vanaf`（促销） |
| SEAT | ✅ | curl/无头浏览器全 403，但**用户真机 Chrome 正常** → 真浏览器开 `configurator/w/version?carlineGroup=CARLINE-GROUP-<CODE>&wf=seat-be-fr`，点 finition 卡进 `Motorisation` 步骤读 `Prix à partir de`（= tarifs conseillés TVAC） |

> 详段：sites/be.md（11 段）

### 丹麦 DK

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| MG | ✅ | Cloudflare 但不拦；WordPress + 经销商配置器 |
| CUPRA | ❌ | 全站 IP 封锁；同 IP 访问 `api.cupra.be` 却正常 → 站方策略，非我方 IP 问题 |
| Citroën | ❌ | 价格源是第三方 `pricelists-api.cars4ever.eu`，**TCP 443 我方路由阻断**（无 response、无 fail） |
| Nissan | ❌ | IP 级风控 |

> 详段：sites/dk.md（4 段）

### 智利 CL

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| Opel | ✅ | `www.opel.cl` curl 403 但 Playwright 可通；滚动懒加载后的 "PRECIO DESDE" 卡片（含完整型号名 + 起价） |

> 详段：sites/cl.md（1 段）

### 泰国 TH

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| GWM 长城 | ✅ | Fastly 全通，SSR；`span.option` ↔ `data-title="฿..."` 顺序 zip；⚠ slug 不带 `-diesel` 的多为 HEV |
| Nissan | ✅ | CloudFront 全通；`all-grade-price.html` 内嵌 `const data={...}`（JS 字面量，交 node 解析）；Terra 只在车型页 |
| Mitsubishi | ✅ | SSR `<h3>车系</h3>` + `<table>`；用 `/en/` 版版本名更规范；站点慢（单页 1MB+/200s） |
| Subaru | ✅ | Azure SSR 正则直读；`/th/en/home/` 已 404，正确入口 `/th/en/` |
| Isuzu | ✅ | Netlify 全通；`รุ่นรถ` 段「版本行 + `N,N,NNN THB`」配对；⚠ 页脚 `MODEL LINEUP` 有他车价须截断 |
| Denza 腾势 | ⚠️ | 无独立价格页；价格只在促销活动页 `ราคาจำหน่าย` 表格，Playwright 渲染 |
| Volvo | ⚠️ | curl 全 403，**有头 Playwright 200**；价格只在配置器 `/en-th/build/<model>/`；EX90 无价 |
| Chevrolet | ❌ | 官网已转型纯售后站（GM 2020 退出泰国新车市场） |
| Tata Motors | ❌ | Cloudflare **国家封锁**（Error 1009，封 CN）；源站 80/443 均 CLOSED |
| Tesla | ❌ | Akamai 按出口 IP 黑名单；`auth.tesla.com` 200 但 `www` 全 403 |
| Maserati | ❌ | 站点全通，**纯政策问题**：AEM `.model.json` 的 `price` 全为 `"0"` |
| McLaren | ❌ | 站点全通、API 全打通，但 `showPriceSummary='false'` + `showPricesByCountry='false'` |

> 详段：sites/th.md（12 段）

### 美国 US

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| Cadillac | ✅ | 配置器 API 最全：`aec-cp-configurator-gateway/p/v1/trim` → `data.trimList`（含运费，粒度 trim × 驱动）；三代年款清单不同 |
| Mazda | ✅ | 车型页内联 JSON `"lowestMsrp":"$X","title":"TRIM"`；须先 `html.unescape`；CX-30 无 JSON，用 FAQ 文本兜底 |
| Lotus | ⚠️ | 美国站仅 Eletre Carbon 标价；配置器是云渲染 3D（GorillaStreaming）；★ 对照 `/en-GB` 有价、`/en-US` 无价 → 站方策略 |

> 详段：sites/us.md（3 段）

### 印度 IN

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| Force Motors | ✅ | 无任何反爬；`/prices/` 34 个 `<table>` 即官方总表；车系 = 表内**单列行**（别向前找 heading，会串 `Disclaimer:`） |
| Jeep | ✅ | 车型页内联 JSON 给变体价；**变体名只在轮播标签**→ 按顺序 zip；⚠ JS `el.click()` 对 React 无效，用 `locator.click(force=True)` |
| Toyota | ✅ | 价格 API 有 **SafeLine WAF** 拦 curl → **Playwright 页面上下文 `fetch()`** 调 `POST 1.0/api/price/list/{dealerId}/{modelId}` 拿 XML；⚠ 剔除 68 条颜色加价 |
| VinFast | ✅ | Cloudflare 托管挑战，stealth + `wait_until='commit'` + reload 概率通过；价格在 `shop.vinfastauto.in/reservation?model=<X>`；⚠ **MPV7 参数是 `VFMPV7`** |
| BYD | ✅ | curl 只有 6.5 KB SPA 壳 → Playwright 渲染车型页；首页 `₹ 24.99 Lakh`、车型页空格分组 `₹ 24 99 000` |
| Volkswagen | ✅ | AEM + feature-app；变体价在 **MOFA BFF**（需平台注入 token，**只能拦截响应，手拼 URL 必失败**） |
| BMW | ✅ | **IPv6 全断 / IPv4 时通时断**（Akamai 多边缘）→ 直接 Playwright；价格全在 `/en/all-models` 卡片（车型详情页无价） |
| Porsche | ✅ | Qwik 序列化状态内嵌（`"key":[0,value]` 二元组），`html.unescape` 后正则切卡片，**不能 `json.loads`** |
| Mercedes-Benz | ✅ | 页面无头 403 / 有头 200；价格在 **VMOS API**（可直连 curl）+ 配置器 **OWCC**（`proposedStep=MOTORIZATION`） |
| MINI | ⚠️ | Akamai **HTTP/2 层拒绝**（`INTERNAL_ERROR`，`--http1.1` 也 000）→ 只有有头浏览器；官网只公开 7 条 |
| Honda | ⚠️ | curl 直通，官方 API `GET /api/getAllCarsData` **无鉴权但只给车系起价** |
| Ford | ❌ | 2021-09-09 已退出印度新车市场，官网纯售后（sitemap 仅 29 条无车型页） |
| Bentley | ❌ | 官网全站不标价（CTA 一律 "Enquire to buy"），印度站仅经销商地址 → 无数据可采 |

> 详段：sites/in.md（13 段）

### 韩国 KR

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| KGM / KG Mobility | ✅ | 主 HTML 被地理屏蔽（空壳），但 `/assets/*.js` 可下 → **grep JS 挖出无鉴权 API** `web.kg-mobility.com/app/*.do` |

> 详段：sites/kr.md（1 段）

### 英国 UK

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| Ford | ✅ | **`/cars` 页是促销价不能采**；真价在 `/cars/<model>/pricelist` → 官方 PDF；**行内最后一个带逗号的金额 = OTR**；文件名日期不可信，读 `pdfinfo Title` |
| Peugeot | ✅ | 官方价目表是 **Adobe InDesign 在线文档**，文字是矢量 path（`<text>` 节点数 0）→ **截图 + OCR**；用算术关系定位列 |
| Honda | ✅ | curl 全通；grade 级价格在配置器页内联 JSON，**必须以 `gradeName` 做锚点** |
| Hyundai | ⚠️ | curl 全通；只有车系级起价（models 页 JSON），配置器是纯壳 |
| Fiat | ⚠️ | 主站 JS 全挂（61 KB 空壳）；只有 `store.fiat.co.uk/compare` 的 10 个车系 |
| Mercedes-Benz | ✅ | VMOS API（英国路径 `en_GB/CCci`，`typeClass` 要剥 `-fl`/`-fl2`），36 series / **403 条**；接口 `modelYear` 是销售代码 → `官网无年款` |
| Škoda | ✅ | 与 BE 同一套 `cc.skoda-auto.com/c3pobe/*`，市场码 `GBR`；**英国 `modelPrice.price` 是 OTR 价**（含 delivery + 首注册 + VED），与 BE 口径不同 |

> 详段：sites/uk.md（5 段）

### 德国 DE

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| DS Automobiles | ✅ | 主站 Akamai 封，`configv3` API 直取全版本 PVC |
| Abarth | ⚠️ 需浏览器 | Akamai 封 curl（含 PDF）；OmniChannel 配置器 3 车系 / 6 版本，价 `cataloguePrice`，官方价目 PDF 逐版本全称与交叉校验 |
| Alfa Romeo | ✅ | Stellantis Omnichannel 配置器（`/omni/konfigurator`）**无 sccf、`ncs/retrieve` 不可重放** → 只能**逐卡读 UI 的「UPE des Herstellers ab Werk ab」**；15 张 `commercialModelCode` 卡 = 在售全量 |
| Audi | ✅ | `www.audi.de` Akamai 封 curl，但**价格主机 `omnigraph.audi.com` 不封** → `CarlineStructure` 持久化查询可 curl 直取；61 车系全量在车型总览页的 `serialized-onegraph-store` 里，配置器 172 个动力组合 |
| Aiways | ❌ 无数据 | `ai-ways.eu/de` 全站 **0 个「€」**；购买/目录入口全跳 `aiways-switzerland.ch`，唯一价目 PDF 是 **CHF**（瑞士进口商）→ 德国无官方 MSRP，不出表 |
| ALPINA | ❌ 无数据 | `alpina.de` / `alpina-configurator.de` 均 301 → `bmwalpina.com`；德国 IP 再 302 → `bmw.de/de/bmw-alpina.html`，只有「Vision BMW ALPINA」愿景页，无车型/价格 |
| Aston Martin | ⚠️ 无价格出表 | `/de/models` 24 个在售版本、配置器与价目全链路 0 个「€」，免责声明写明价格由经销商确定 → 按规则 MSRP 填 `官网无价格` 出表（24 行） |
| Elaris | ❌ 无数据 | 2025-01 已破产；`elaris.de` Cloudflare 403 / 源站 522；用户给的 `elaris.eu` 是 **Wayback 回放**（快照 2025-03-14），配置器与预约页价格互相矛盾 |
| Alpine | ✅ | Renault rplug 配置器直取 SRP，curl 全通 |
| Dacia | ✅ | 车型页 `APP_STATE` 内嵌全版本矩阵 + rplug PVC 双源 |
| INEOS | ✅ | Next.js 站 + 独立配置器主机，官方价目 PDF 一页可文本解析 |
| Jeep | ⚠️ | curl 全站 403 → 浏览器内 fetch；配置器 SPA 逐卡（等 9–12 s）+ 4 份价目 PDF 交叉校验 |
| Lucid | ✅ | Next.js 服务端直出 `Ab X €`，curl 可通（schannel 要加 `--ssl-no-revoke`） |
| MINI | ⚠️ | Akamai 封 curl，BMW Connext 前端渲染，逐页等 8–10 s；⚠ 配置器自动减 €1.000 `Kundenvorteil` → 用车型页 `Ab` 价 |
| Polestar | ⚠️ 需真浏览器 | `curl` 任意路径（含 robots.txt）按出口国家 **302 → `www.polestar.cn`**；但**真实浏览器可正常打开 `/de/`**，配置器 `initconfig` API 可采全量 |
| smart | ✅ | `de.smart.com` 无鉴权 trpc BFF（`getAppModel,getProductModel`）curl 一把取全（要 `--ssl-no-revoke`）；⚠⚠ BFF 的 34 个 Line 是**跨年款全量目录**，在售只有 `latestModelYearFlag=true` 的 **16 个**（+ 预售 #2 = 17 行） |
| VinFast | ⚠️ 需浏览器 | Cloudflare 托管挑战，curl 403，真浏览器 10–15 s 放行；只有 **VF 6 / VF 8**，车型页「Preis ab」与 shop 产品页双源一致 |

> 详段：sites/de.md（18 段）

### 法国 FR

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| Mitsubishi | ✅ | `www.mitsubishi-motors.fr` curl 一律 **445 空响应**（本机 TLS 指纹被 nginx 拒），只能浏览器同源 `fetch()`；价格在**车型页「Niveaux de finition」块的 `À partir de X,00 €`**，⚠ 首页/hero 的 `À partir de` 混的是促销价 |
| Citroën | ✅ | `store.citroen.fr` Next.js 在线商店 + 单一 GraphQL 端点，**curl 直连一次拿全量**（无需浏览器）；与 BE 的 sccf 静态库不同 |

> 详段：sites/fr.md（2 段）

### 希腊 GR

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| Nissan | ✅ | 主站 `www.nissan.gr` Akamai 403；`build.nissan.gr` 配置器服务端直出可 curl，官方 LTPF PDF（`ΛΤΠΦ` = 建议零售价）兜底 |

> 详段：sites/gr.md（1 段）

### 澳大利亚 AU

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| Kia | ✅ | Build & Price 先设邮编 **2000**（写 `regionCode=NSW; postCode=2000` 两个 cookie）→ `curl` 带 cookie 直取每个等级页；价格取页面显示的 Drive Away（`trimOfferPrice`，无则 `trimPrice`=RRP+上路费），**两者差值为活动折扣**；型号名取等级卡 `<label>` 文本（`Air - Standard Range`），**不用 API 内部名**（`Air SR`）；年款取车型页浏览器标题（`2027 Kia EV3…`） |
| Nissan | ✅ | 车型页不给逐版本价；配置器 `cfg.shtml` 读版本卡「Driveaway from」，**须先走 Set Location 弹窗提交 2000**（默认就是 Sydney，`defaultPostCode:"2000"`）；年款看导航卡 `data-vehicle-year` + aria-label + 片段名，**Patrol 三处冲突**；车型页与配置器常差 1 AUD（下取整 vs 四舍五入） |
| LDV | ✅ | 价全在 `/price/`：一表两栏 `Retail Price From` / `ABN Holder Price From`，**删除线那条才是建议价**；按「标签/零售/ABN」三格序列解析（不是 table）；Cab Chassis 价不含货箱；无 postcode 门 |
| Denza | ⚠️ | 全站无常规售价，只有 `/au/offer` 限时活动 Driveaway（清库、限时）→ 不采；**年款也踩空**：`MY26` 只出现在规格书文件名与按钮属性 `data-document-name`，三份规格书（47/47/25 MB）全文 0 次命中 `MY\d\d` → 首版按文件名写的 MY26 已在 v2 改回「官网无年款」；`Build & Order` 跳渠道商城 |
| CUPRA | ✅ | **主源＝配置器** `/carshop/w/model`（等 5–10 s 出 `SELECT YOUR MODEL` → 点下拉 `<a>` → CONTINUE → `SELECT YOUR VARIANT`，版本名与 `Driveaway from $X` 在 `role=listbox` 里、要递归 shadowRoot）；6 个可配车型（New Formentor / New Formentor VZ5 / Tavascan / Terramar / Leon Hatch / Leon Sportstourer），只给 MY26、不要邮编；正式版本名带电池与驱动形式（`TAVASCAN ENDURANCE 210KW / 77KWH RWD MY26 = 71,490`）。⚠ `/stock` 库存卡是**现车价、含选装、按代理浮动**，会高于官网起价（实测 Leon VZx Sportstourer：配置器 72,490 vs 库存最低 73,110），只用来补配置器已下架的清库年款 MY24/MY25/MY25.5，且要先过 `Enter postcode … We use your region to get accurate prices`（填 2000），价格藏在 `ds-currency` 的 shadow root（`body.innerText` 取不到 → 这是首版误判「零金额」的原因）。口径逐字：配置器 [D1] `Manufacturer's driveaway price (MDP) … options selected and other applicable statutory charges`；库存 [D1] `…MRDP for new MY26 vehicles`、[D2] `Campaign Driveaway Price for new MY23 and MY24 vehicles`。⚠ 内置浏览器面板不可见时配置器按钮 `getBoundingClientRect()` 为 0×0，点击与截图都失败，要请用户把面板点到前台；`vtpapi…/search/car` 401、不要复用内置 token；ATECA、BORN 两源皆无 → `官网无价格` + 停销 `是` |
| GWM ANZ | ✅ | 逐版本上路价在 `/au/config/<车型>`（**无邮编框，按州取价**：面板点州标签从默认 VIC 切 NSW）；`Driveaway price includes savings of $…` 属**价内含减免**；车型页首价是默认展示版本、不是起价 |
| Škoda | ✅ | `cc.skoda-auto.com` 配置器三连：`POST /c3pobe/version {"country":"AUS"}` 取 snapshotVersion → `HomepageSelection` 拿在售车型卡（`title` 里就是 `MY27`/`MY26`）→ `POST /c3popr/v3/GetTrimlinesPrices`（传 ModelClass=车系码前 2 位 + ModelYear）一次拿全 class 的 `prices[]{id:trimlineId,price}`；价格即 MRDP 上路价（`disclaimers` 首条）；**`Find` 结果≠在售**（NW 夹着停售 Scala、NU 夹着无页面的 130 Edition）→ 用 `/sitemap-web.xml` + 车型页内嵌 `bodies[].derivatives[]` 回筛 |
| Volvo | ✅ | `curl` 全 403 → 真浏览器点 `/au/build/<model>/`；**4 维矩阵**：衍生款（EX30 / EX30 Cross Country、XC90 / XC90 Black Edition）× 等级（Plus/Ultra）× 动力（B4/B5/T8/P5/P8/P6/P10/Twin…）× **主题（XC40 Ultra 有 Bright / Dark，Dark +$1,050）**；价格取 `[data-testid=car-price-offer-price]` 的 MRDP（postcode 默认 2000），点卡片后要等 4–5 s |
| Infiniti | ⛔ | 品牌**已退出澳洲**：`infiniticars.com.au` 证书名不匹配（curl 000 / `SEC_E_WRONG_PRINCIPAL`，需 `curl -kL`）301 → 全球站 `infiniti.com/regions/en-au.html`；正文逐字 `Sales of new cars in your location have come to an end.`、区域数据里 Australia 带 `"sunset":true`；en-au 只剩 auto-repair / financial-services / owners-faq，`/regions/en-au/vehicles/qx60.html`、`build.html`、`sitemap.xml` 全 404，导航里的 QX60/QX65/QX80 指向美国页 → **不出表**（别用 `官网无价格` 凑行，会被读成"在售但没标价"） |
| Hyundai | ✅ | 浏览器同源 `fetch`（curl 403 指纹级）：`content/api/au/hyundai/v3/carpricecalculator?postcode=2000&modelname=<小写带空格>`，上路价取 `priceEstimate`、`price` 是 RRP；**型号名 = variantGroup + engineType + transmissionType**，接口 `name`（NX4/CN7/MX5）是内部名；车型全集用 `/carpricecalculator/models`（带 categoryId 的才算，含 Runout/Coming Soon 分类）；**空结果先换 key**（`sonata` 空、`sonata n line` 有价）；`i30 N` 与 `i30 Sedan N` 是两个车型；**年款只印在规格表 PDF 内文**（页面/接口/配置器全无 MY），4 车型 13 行靠 `pdftotext` 抽全文得到，文件名里的 `MY26/MY27` 与 `…/my26-tucson/` 路径不作数；HTML 403 但 `/content/dam/**` 的 PDF `curl` 200 |
| Chevrolet / GMSV | ⚠️ 无价格出表 | GM 官方进口渠道站（同域 `/au-en`+`/nz-en`）**全站 0 价格**：32 个页面全文 $ 开头的金额串 0 命中、无配置器/无价格表页、3 份官方飞标 PDF 也无价，FAQ 逐字 `Corvette prices differ by model and features. Please visit your local GMSV Dealer for pricing information.`；对照实验 NZ 站同样 0 价 → 仍出 8 行、MSRP 全填 `官网无价格`；年款在 1500 两页脚注 `Figures shown apply to MY26i …only.`、2500 HD 只在飞标**内文** `MY26 Equipment & Features`、Corvette 靠正文 `The 2026 Corvette Stingray`/`2027 CORVETTE Z06`（E-Ray 2026 与 Z06 2027 并行）；等级全集只在 FAQ 一句里，⚠ 别按那句排 2LT Convertible（车型页逐字 convertible 只给 3LT）；E-Ray 无 `plug-in` 但有 6-8 km 纯电模式 → HEV |
| Citroën | ⛔ | 官网逐字声明**已停止澳洲新车销售**（`…exclusively support the vehicle maintenance and servicing requirements… effective 1st November 2024, following the cessation of new vehicle sales in the local market.`，`/about-citroen/news/citroen-announcement.html` 日期 15/08/2024）→ **不出表**（`官网无价格` 会被读成"在售只是没价"）；导航只剩 Maintain/Owners/Support，sitemap 48 条 0 新车页，46 页扫下来只有保养套餐价；⚠ `/owners/c5-x/hybrid.html` 残留 `exclusively available by customer order` + `BUILD & PRICE` 配置器深链属**停售前遗留文案**，别当在售证据；抓取要点：`curl` 连 robots 都 403（`/content/dam` 的 PDF 也拦，与 Hyundai AU 相反）→ **真浏览器进去后用同源 `fetch()` 抓全站**；`configurator.citroen.com.au` TLS 握手即断（SNI 级，本机 CN 出口无解，但结论不依赖它） |

> 详段：sites/au.md（12 段）

### 日本 JP

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| Mazda | ✅ | `www.mazda.co.jp` curl 全通、纯 SSR；车型在 `/cars/` 的 `passenger|light-vehicle|commercial/<slug>/`，**价格只在各车系 `/grade/` 页**：按 `cmp-grade-and-spec-data__title`（グレード）切块，块内取 `__subtitle`（发动机）与每个 `__variant`（`（2WD｜6EC-AT）` + `¥税込`）；型号名 = グレード + 駆動 + 变速器；**一页两车系**（MAZDA3 页含 FASTBACK/SEDAN、ROADSTER 页含 RF）要按块内文案与 `RF ` 前缀拆；新老 CX-5 同堂（`cx-5` / `cx-5_kf`）；重复渲染按 车系+グレード+駆動+变速器 去重；`e-SKYACTIV G/X/D` 全是 **MHEV**（页内 M HYBRID / マイルドハイブリッド / 48V），`SKYACTIV-G` 才是 Gasoline，`R-EV` = REEV；全站无年式 → `官网无年款`；商用车只有 PDF（CID 编码抽不出字）未纳入 |

| Nissan | ✅ | `www3.nissan.co.jp` curl 全通；グレード名/全集取 `…/vehicles/new/<slug>/version-explorer/jcr:content/core.versionexplorerdata.json`（`versions[].name`），税込价取车种页内嵌 `individualVehiclePriceJSON` 的 `Retail with VAT`（`grades[gradeId].gradePrice`，Serena/X-Trail 只有 grades 没有 versions）；**⚠ dayz/skyline 页错挂 dayz_rider、elgrand/leaf 页错挂 new_roox** → 这 4 款改读 `configurator-v3.html` 的界面文本；e-POWER/e-4ORCE 全记 HEV，CARAVAN 按名称里的 ガソリン/ディーゼル 分；Clipper 四款只有车系起价 |

> 详段：sites/jp.md（2 段）

### 新西兰 NZ / 菲律宾 PH / 全球

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| Mercedes-Benz NZ | ⚠️ | Akamai 按数据中心 IP 拦（403）；部分车型 SSR 带 `Estimated Drive Away Price` |
| 保时捷 NZ | ✅ | 车型总览页 astro-island JSON（`modelCards` → `price.formattedValue`） |
| 大众 NZ | ✅ | 每车型页 `Download specs` PDF（含多配置 MRP） |
| BYD NZ | ✅ | BROCHURE 按钮 → price-list PDF |
| 本田 / 标致 NZ | ⚠️ | Cloudflare 拦直连；车型页 From + ORC |
| Fiat / Jeep PH | ⚠️ | JS 渲染；官方导航数据区 `STANDARD MODELS` |
| BMW PH | ⚠️ | 车型页无价；`BMW Price List` 按钮 → S3 上的 PDF（**沙箱封 `*.s3.amazonaws.com`**） |
| 领克 | ❌ | 按出口 IP 地理跳转 `.com.cn`，需海外代理 |
| 法拉利 / Aston Martin | ❌ | 官方从不公布售价，仅经销商询价 |
| IM Motors 智己 | ❌ | 站点全通但 API 只有规格表，0 价格字段 |

> 详段：sites/global.md（4 段）

> ⚠ **本索引与详段的关系**：本文件只是**路由 + 通用方法**；每个市场的踩坑细节（字段名、正则、失败过程）在 **`sites/<market>.md`**（各表末尾有「详段」指向）。两者冲突时以市场文件里的详段为准。
> ⚠ **找不到对应市场文件时**：先按 `## 数据源定位方法（通用）` 走，采完把坑位追加到 `sites/<market>.md` 并在本索引加一行。

---

## 数据源定位方法（通用）

1. **先抓配置器**：开 Playwright，`page.on('response')` 捕获所有 XHR/fetch，找含 `price` / `config` / `graphql` 的接口。
2. **配置器不可用或只到车系起价 → 看车型页 From 卡**。
3. **仍缺变体/缺价 → 找官方价格表 PDF**：车型页上找 `Download specs` / `Brochure` / `prijslijst` / `price list` / `Download price` 按钮，用 PDF 补全并备注来源。
4. **接口优先于 DOM**：能调 API 就别点页面（DOM 点击易失败、易漏项）。

**❌ 反面教训**：不要硬编码车型 base ID（Dacia 每个车系有独立 base：BIGSTER=`BAHMm`、DUSTER=`BAHMn`、SANDERO=`BAHMo`、JOGGER=`BAHMp`、SPRING=`BAHMx`）。要用接口返回的 `next` 完整 URL，否则**跨车型串价**。

### 止损判定：30 秒内判断「这个站能不能采」

按以下顺序快速探，命中了就别恋战，记入本表后换下一个品牌：

| 步骤 | 命令 | 命中结论 |
|---|---|---|
| ① 整站试探 | `curl -s -o /dev/null -w "%{http_code}" <站点>/robots.txt` | **403 → 整站 IP 级封锁**，换 UA/浏览器/路径都无效，**直接止损** |
| ② 多市场试探 | 依次试 `.es` `.fr` `.de` `.uk` `.nl` `.it` … | 全 403 → 同一 WAF 策略，全球无解 |
| ③ DNS 分级 | `python3 -c "import socket;print(socket.gethostbyname('<host>'))"` | 看是否 Akamai/Cloudflare/独立 IP；apex 与 www 常在不同平台 |
| ④ TCP/TLS 分诊 | `bash -c 'cat </dev/null >/dev/tcp/<ip>/443'` 和 `openssl s_client -connect <host>:443 -servername <host>` | **TCP 通 + TLS `read 0 bytes`（立即 RST）→ SNI 级封锁**；浏览器表现 `net::ERR_CONNECTION_CLOSED` |

> 关键区分：**403 = 应用层 WAF**（可能有绕行机会，如换浏览器/换路径）；**TLS RST = 网络层封锁**（本环境出口 IP 被针对，无解）。
> 界面「数据拉不到」的常见表征：配置器 URL 在 `#/trims`（正常）与 `#/error` 之间随机跳，且 DOM/价格恒为空 —— 先查它的数据 API 域名是否被 TLS RST，而不是反复调 UI。

---

## 集团级套路（跨市场）

> 各品牌的坑位详段已按市场拆分到 `sites/<market>.md`；本节只留跨市场的集团级套路（雷诺 rplug / Stellantis GraphQL + sccf），品牌特有的字段与正则看对应市场文件。

### 雷诺集团（Dacia / Renault）

| 项 | 内容 |
|---|---|
| **市场** | 西班牙 |
| **价格源** | `es.co.rplug.renault.com` — 配置器后端，**公开返回 Schema.org 结构化报价** |
| **关键字段** | `schema:price` + `priceType: "SRP"`（= 官方建议零售价，未折扣）+ `schema:validFrom`（数据新鲜度） |
| **年款来源** | `impact[]` 里 `specCatCode == 'c2gMillesime'` → `specCode.replace('millesime_','')` |
| **发动机识别** | `impact[]` 里 `specCatCode.startswith('PT')` 且 `possibles` ≥2 → 取 `specCode` + `next` |
| **坑** | ① 每个车系独立 base，禁止硬编码；② 用返回的 `next` 完整 URL；③ 价格可能是字符串，格式化前先 `float()` |
| **无价格表** | `tarifas.html` / `precios.html` 均 404；catalogos 的 PDF 是宣传册（正文 0 个 €） |

### Stellantis（DS / Citroën / Peugeot / Opel / Fiat / Jeep）

| 项 | 内容 |
|---|---|
| **市场** | 西班牙 |
| **价格源** | `store.<brand>.es/graphql` — **在线商店 GraphQL** |
| **核心接口** | `operationName: "getProductOffer"`，POST，需 `credentials:'include'` |
| **入参** | `{input:{model, trim, engineGearbox, exteriorColour, interiorColour, options:[], accessories:[]}, page:'config'}` |
| **价格字段** | `selectedConfiguration.prices.cash.catalogAmount` = **官方目录价（MSRP）** ✔<br>`...totalAmount` = 促销价 ✘<br>`configurationOptions.trims[].prices.cash.baseAmount` = 各配置价 |
| **车型 slug** | DS ES：`ds-3-suv` / `no4-berlina-5-p` / `no7-suv` / `no8-berlina-5-puertas` |
| **URL 结构** | `/selector/configurable/{model}/{trim}/{engineSlug}/{color}/{interior}?channel=b2c` |
| **发动机参数** | `engineGearbox` 要传 **slug**（`hybrid-145cv-automatica-hibrido`），**不是** id |
| **trim 传空** | `trim:''` + `showAllEngines:true` → 返回该发动机下所有 trim 的价格矩阵（最高效） |
| **坑 1** | 组合无效时接口返回 `Unable to get product offer`（缺有效 trim/interior 配合） |
| **坑 2 关键** | 某些 trim 不支持某发动机时，会**回显**其它发动机的价格 → 判定法：**同一 trim 跨发动机价格完全相同 = 该组合无效**，须剔除 |
| **坑 3** | 主站 `www.dsautomobiles.es` 被 Akamai 403；但 `store.dsautomobiles.es` 畅通 |
| **坑 4** | 主站目录页会列出已停销车型（DS 4 重定向、DS 7 仅库存车），**以 store 的 configurable 列表为在售权威** |
| **年款** | 页面年份多为版权年/交付期，**非年款** → 写「官网无年款」 |
| **DS 官方 PDF** | `www.dsautomobiles.es/content/dam/ds/spain/pdf/caracteristicas-tecnicas/CT_{DS3,DS7,N4,N8}.pdf` — **只有技术规格，无整车价**（直链 403，需同源 fetch 破封） |

---

## 交付后清理约定

用户习惯：**每个品牌只留最终 XLSX**（8 列 + `年款依据` 副表），其余中间文件与脚本清理掉。
长期保留的只有本 skill；交付目录下不保留行数据 JSON、截图、PDF 等中间文件。
