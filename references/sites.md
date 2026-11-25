# 站点坑位速记表（品牌 × 市场）

> 实测积累，持续追加。**本文件只是索引 + 通用方法**；每个市场的坑位详段在 `sites/<market>.md`，新站追加到对应市场文件（模板 `sites/_template.md`）并在此加一行。

## 0. 站点速查（先看这里）

> **30 秒定位**：按市场找到品牌行 → 看结论和一句话方法 → 按该表末尾的「详段」去读 `sites/<market>.md`（`grep -n "<品牌>"`）。**只看索引不够**，字段名/正则/坑都在市场文件里。
>
> **结论图例**：`✅` 可采并已交付 · `⚠️` 可采但粒度/覆盖不全 · `❌` 无解（封锁，或官网不标价）
>
> **时效性**：文中的 `snapshotVersion` / `dataVersion` / token / 车型 id 都是**当时实测值**，会过期（例：Škoda BE 已从 `b430ec84…` 变为 `37f3d879…`）。每次任务必须**现取**，不能照抄。
>
> **读取方式**：本文件是路由索引，按任务只读**目标市场块 + 通用方法 + 止损判定**，不要整读；**详段**在 `sites/<market>.md`，只读对应市场里命中的品牌段，也不要把所有市场文件一起读。

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
| Subaru | ✅ | `www.subaru.be` 车型页版本卡 + 官方 Prijslijst PDF（`Catalogusprijs incl. BTW`）双源交叉 5/5；e-BOXER 判 **MHEV**、三款纯电判 BEV；年款取 PDF 脚注 `modeljaar 26` |

> 详段：sites/be.md（12 段）

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
| Škoda | ✅ | `www.skoda.co.uk` range 页只给 trim 入门 `From*` 价；**完整版必须走配置器**：webcache `trimlines/engines-en-GB.json` + `POST /c3popr/v3/GetEnginePricesByTrim {"ModelId":"<defaultModelId>"}`；**14 车系 171 版本，MY2027**；BEV 27 · Gasoline 80 · Diesel 33 · MHEV 21 · PHEV 10；只解析 range 页会漏掉同 trim 的 1.0 MPI/1.0 TSI/DSG 等衍生版（73 vs 171） |
| MG | ✅ | `www.mg.co.uk` 200；15 车系 35 版本；配置器 `/configurator/<slug>` 的 Compare trims 逐 trim £价（Cash Price Details）；BEV 21 · HEV 6 · PHEV 4 · Gasoline 4；无 MY → `官网无年款`；GBP 逗号千分位 |
| Mitsubishi | ✅ | `www.mitsubishi-motors.co.uk` 200；当前 2 车系 4 版本：L200 Titan/Barbarian £36 295/£39 995（CVOTR Excl. VAT）、Outlander PHEV Nativa/Diamond £46 995/£49 995（OTR）；无 MY → `官网无年款` |
| KGM | ✅ | `www.kgm-motors.co.uk/new-cars/` 200；模型级 From 价 9 款：Tivoli £24,045、Torres Hybrid £35,995、Torres EVX £35,495（inc £1,500 ECG）、Actyon Hybrid £38,995、Rexton £42,615、Rexton Commercial £35,995 exc. VAT、Musso Pick-Up £32,980 exc. VAT、Musso EV £39,995（inc £5,000 PiVG）、Musso Rhino £38,995 exc. VAT；无 MY → `官网无年款` |
| Subaru | ✅ | `subaru.co.uk/overview/<model>` 200；Price Breakdown 逐 trim 取 **Total On The Road Price**；5 车系 14 版本：Crosstrek £35,995/£38,100、Forester £39,995/£41,545/£44,100、Outback £40,495/£42,655/£45,645、Solterra £52,505/£55,505、e-Outback £49,995/£51,995/£52,495/£54,995；无 MY → `官网无年款`；e-Boxer MHEV · Outback Gasoline · Solterra/e-Outback BEV |
| Volvo | ✅ | `volvocars.com/uk/build/` 真浏览器（curl 常 403）；13 个 MY27 build 页按 **Level × Powertrain** 出 **65 条**（价格=Level 基础价+动力加价）：EX30 P5/P5 LR +4 200、EX90 Single/Twin +5 900、EX60 P6/P10 +3 000/P12 +8 000、EX40/EC40 P5 LR/P8 +4 000；XC90/XC60/V60 各 PHEV（T8）+ MHEV（B5），XC40 B3，V60 MHEV B4；EX30 31 385–45 885、EX90 73 160–99 760、EX60 56 860–70 360、EX40 43 860–53 860、EC40 45 860–53 860、ES90 67 560–77 260、XC90 PHEV 75 765–89 265、XC90 MHEV 56 120–70 770、XC60 PHEV 56 765–70 865、XC60 MHEV 42 860–57 420、XC40 37 710–46 760、V60 PHEV 52 765–57 365、V60 MHEV 45 210–49 810；年款 2027；BEV 34 · PHEV 13 · MHEV 18；放桌面 |
| Maxus | ❌ | `www.maxus.co.uk` 是 GoDaddy 停放页 `/lander`（`LANDER_SYSTEM="PW"`、`ap:"parking"`），无车型/价格 → 不出表 |

> 详段：sites/uk.md（12 段）

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
| Suzuki | ✅ | `www.suzuki.fr` / `configurateur.suzuki.fr` curl 全 403（Azure App Gateway），真浏览器同源 `fetch()`：`/api/models` → `/api/motorizations?model=<数字id>` → `/api/versions?model=&motorization=`；取 `priceB2B`，**不取** `priceB2C`（扣 remise+reprise） |
| Toyota | ✅ | `www.toyota.fr` curl 403（Akamai）；价格走 `cocadap.toyota-europe.com/.../comparegradespecsv2/<modelId>` 的 `from.list`（catalogue MSRP，**不取** `listWithDiscount` 页面 remisé），全名/动力走 `texus.../GetFullConfiguration` 的 `Car.Name`；**年款看官网明标 MY**：金融方案脚注/手册标题/新闻稿逐字给 `MY26`/`MY27`（API 无 modelYear 字段）；Mirai/Proace Verso 特例；GR GT 未来车型不入表 |
| Ford | ✅ | `www.ford.fr` curl 000（Akamai edgekey）；版本价在官方 `pricelist` PDF 的 `Tarif maximum TTC` 表（pdf.js 按 x/y 坐标把价格映射到 finition 列），年款取首页 `Année modèle 20xx`；**Ranger/Transit/Tourneo 另表（穷举 167 条）**：配置器 ngc2 复合配置码 `CATALOG~SERIES_BODY_..._VS-...` 逐条取 `load.price`，Ranger/Transit 为 HT、Tourneo 为 TTC，不可横比；Mustang GTD 无价不入表 |
| Fiat | ✅ | `omni/configurateur` 总览卡同时写 `Prix en ligne`（折扣，不采）与 `Prix catalogue`；全量目录价在静态库 `…/fccf_mv/scope/3109200.json` → `CM_T5_3109200_<code>.json` 的 `Vehs[].PriceArray[3]`（含 VAT），13 个 comMod / 62 版本；版本名 = `ComVersDes` + `Moteur` 官方动力串；年款取官网页脚 `FIAT-ABARTH_POSTER_CONSO_04-2026.pdf` 抬头 `ANNÉE MODÈLE 2026` → MY2026；Topolino 另有官方手册价 9 990/10 490/11 490（无年款） |
| Geely | ✅ | `www.geelyauto.fr` curl 直通（Nuxt SSR），**无配置器**；页内只有车系起价（`Prix de vente conseillé à partir de … TTC`，`soit … après remise` 是促销不采），变体价只在官方 brochure PDF 末页 `Tarifs clients TTC`（每 finition 一列一价）；⚠ E2 的 brochure 是图片型（text stream 仅 2 个），须渲染成图目视读价；年款全站无 MY → 「官网无年款」 |
| Jaguar | ⛔ | `www.jaguar.com/fr-fr` curl 301→200 无 WAF，但**自 2024-11 起停售新车**：Support FAQ 逐字 `À compter de novembre 2024, nous arrêterons les ventes de véhicules Jaguar neufs …`，首页只剩 Type 01 概念车 / Approved 二手车 / 售后；sitemap 除 dealer locator 外 0 车型页，`f-pace/i-pace/e-pace/xf/f-type/configurator` 全 404；Type 01 明写 `pas encore disponibles à la vente` → **不出表** |
| Cadillac | ✅ | `www.cadillaceurope.com/fr-fr` 配置器 `/fr-fr/design/<model>` **curl 直连即 200**（Akamai 间歇 403，重试可破），HTML 内嵌 per-trim `trim.prices.msrp.value` + `carline.modelYear`；概览页 JSON-LD `modelDate=2026` 且 OPTIQ 价滞后（69.5k），以配置器为准；法国在售 4 款纯电 SUV，共 9 trim（OPTIQ 2/LYRIQ 2/LYRIQ-V 1/VISTIQ 4） |
| Zeekr | ✅ | `shop.zeekr.eu/fr-fr/configuration` SPA（curl 只返回 404 壳，需 Playwright 渲染）；底层 API `gateway-pub-azure.zeekr.eu/panda/api/c/item/`：`getOpenCarModel`(countryCode=FR) 取车型树 + `queryCarModels` 取版本价（均需浏览器内调用，curl 报 401 signature） |
| Land Rover | ✅ | `rules.config.landrover.com/rc/lr/fr_fr/{车系}_{k27}/.jsonp` **curl 直连**（主站车型页只有车身级起价）；`feature-list` 的 `PRODUCT` 组 = 全部型号 + `price.RETAIL` 含税价，`property.definition` 首段补 LWB/110/130 车身写法 |
| Genesis | ⚠️ | `org-eu.genesis.com/eu/papi` 本机 **TCP 443 不通**（浏览器内 fetch 亦 Failed）→ 走 **GraphQL over GET + 外部抓取通道**；`gppTrims` 的 `minPriceGross` 即型号级 TTC 起价，年款见 `gppFscs.modelYear` |
| Lancia | ✅ | 主站 Akamai 封 curl（robots 也 403）/ 真浏览器通；无 `store.` 子域 → 走 **Omnichannel 配置器** `/omni/configurateur/#/`：`ncs/retrieve` 一次拿 6 车系起价，版本价读「Prix catalogue」；⚠ hash 不重载，每台车先 `about:blank` |
| Renault | ✅ | `www.renault.fr` APP_STATE 取车系 → `fr.co.rplug.renault.com` curl 直连：`/pricelist/<base>` 的 **PVC**=TTC 未折扣 MSRP（页面 `PVCBONADOBE` 的 From 扣 3620 € CEE 奖金，不采）；在售集=`/category`==`impact` VersionId；燃油按 `PT5662`；**年款取版本名末缀 - 26/-26b→2026、- 27→2027，c2gMillesime 是冻结产品代号非年款（与 ES 相反）**；T3E 官网无价格、SpaceNomad 未核实、Duo 属 Mobilize 不入表；**Grand Kangoo 5/7 places 是两个独立配置器产品（5 座入口 mtc 带 `_slash_0P3RAN`），5 座 = PVC − 500，须拆行**；`confOptimum` 是实时配置价 ≠ PVC；`prix-versions` 的 SRP/`startingPrice` = 5 座价、headline `displayPrice` = 7 座价 |

| Lexus | ✅ | `www.lexus.fr` curl 403（Akamai errors.edgesuite.net），真浏览器可开；车型 UUID 读任一配置器页 `window.dxp.settings.modelMap`，变体价走 `cocadap.toyota-europe.com/lexus/fr/fr/comparegradespecsv2/<UUID>` 的 `from.list`（22 条均 == `listWithDiscount`，无折扣；`default` 含金属漆 +1 200 不取）；年款 LBX/UX/NX=`MY26`（方案脚注/手册封面）、RZ/ES=`2026`、RX=`2027`（车型页 JSON-LD `vehicleModelDate`）、LM=`官网无年款`；TZ 2027 未来车型不入表 |

| Lotus | ✅ | `www.lotuscars.com/fr-FR` curl 200 无 WAF；产品树 `configurator.prd.../products/products/FR` 取 `MHP_*` 变体码，价格走 **`ruler/pricing/<MODEL>/FR/<CODE>` 的 `retailPrice`**（未折扣 MSRP）；⚠ Emeya `/models` 卡片价统一比 API 低 3 200（促销展示价，不采）；Eletre X=PHEV、Eletre/Emeya/Evija=BEV、Emira=Gasoline；Evija 无价；年款全「官网无年款」 |

| Leapmotor | ✅ | `www.leapmotor.net/fr-fr` curl TLS reset、真浏览器可开；Next.js offers payload 的 **`product.originalPrice` = 目录价**，页面 « Prix promotionnel » / « à partir de » 是扣 CEE/prime 后的促销价不采；7 在售车系（T03/B03X/B05/B10/B10 e-Hybrid/C10/C10 e-Hybrid），B03 未开售不入表；e-Hybrid = `prolongateur d'autonomie` → **REEV** |
| Lynk & Co | ✅ | `me.lynkco.com/fr-fr` curl 200；页面 `{buyPrice}` 占位符被拦不渲染，但官方 Sitecore GraphQL `POST cd.web.lynkco.biz/api/lynkco-global-portal` 的 `buyPriceQuery`（root `/Global Setting/BuyPrices/BuyPrices`）只给 **Core 起价** 01=41 495 / 02=35 995 / 08=53 995；**More 取官方新闻稿** 45 495 / 39 995 / 57 995 → 6 条（每款 Core+More）；02 年款 **MY27**（官方 MY27 新闻稿），01/08 官网无年款 |

| Lamborghini | ⚠️ 无价格出表 | `www.lamborghini.com/fr-en` curl 200；官网**不公布法国 MSRP**：车型页 JSON-LD 无 offers/price、配置器无 €/amount、CTA 只有 « Faire une demande » / `ENQUIRE`；配置器 5 个车型 **Temerario / Revuelto / Revuelto SV / Urus SE / Urus SE Performante** 全部入表，MSRP 全 `官网无价格`（前 3 个官网标「未开售」但按缺价规则仍出行）；5 个 ENQUIRE 表单均逐字 `2027 Lamborghini …` → 年款 2027；均 PHEV |

> 详段：sites/fr.md（20 段）

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

> ⚠ **AU 口径**：索引里的「邮编 2000 / drive-away」是 2026-11 批次的任务口径，**不是默认**；默认取官网 MSRP/RRP，只有用户明确要上路价时才按邮编步骤取（见 sites/au.md 头部）。

> 详段：sites/au.md（12 段）

### 日本 JP

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| Mazda | ✅ | `www.mazda.co.jp` curl 全通、纯 SSR；车型在 `/cars/` 的 `passenger|light-vehicle|commercial/<slug>/`，**价格只在各车系 `/grade/` 页**：按 `cmp-grade-and-spec-data__title`（グレード）切块，块内取 `__subtitle`（发动机）与每个 `__variant`（`（2WD｜6EC-AT）` + `¥税込`）；型号名 = グレード + 駆動 + 变速器；**一页两车系**（MAZDA3 页含 FASTBACK/SEDAN、ROADSTER 页含 RF）要按块内文案与 `RF ` 前缀拆；新老 CX-5 同堂（`cx-5` / `cx-5_kf`）；重复渲染按 车系+グレード+駆動+变速器 去重；`e-SKYACTIV G/X/D` 全是 **MHEV**（页内 M HYBRID / マイルドハイブリッド / 48V），`SKYACTIV-G` 才是 Gasoline，`R-EV` = REEV；全站无年式 → `官网无年款`；商用车只有 PDF（CID 编码抽不出字）未纳入 |
| Nissan | ✅ | `www3.nissan.co.jp` curl 全通；グレード名/全集取 `…/vehicles/new/<slug>/version-explorer/jcr:content/core.versionexplorerdata.json`（`versions[].name`），税込价取车种页内嵌 `individualVehiclePriceJSON` 的 `Retail with VAT`（`grades[gradeId].gradePrice`，Serena/X-Trail 只有 grades 没有 versions）；**⚠ dayz/skyline 页错挂 dayz_rider、elgrand/leaf 页错挂 new_roox** → 这 4 款改读 `configurator-v3.html` 的界面文本；e-POWER/e-4ORCE 全记 HEV，CARAVAN 按名称里的 ガソリン/ディーゼル 分；Clipper 四款只有车系起价 |
| Hyundai | ✅ | `www.hyundai.com/jp` curl 全通、纯 SSR；车型 slug 要从首页 DOM 的 `setGaParam('<slug>')` 挖（`inster/ioniq5/ioniq5n/kona/kona-maunaloa/the-all-new-nexo`），价格在 `/<slug>/price` 的 HTML 表格：表头列 = グレード，价格行标签有 `車両価格（消費税込み）`/`メーカー希望小売価格（消費税込み)`/`車両販売価格（消費税込み）` 三种写法；单グレード车型（IONIQ 5 N、KONA Mauna Loa）表里无グレード名，型号直接用车名；NEXO = FCEV |
| Chevrolet | ✅ | `www.chevroletjapan.com` curl 200（AEM）；只卖 **CORVETTE / CORVETTE Z06**（`/corvette`、`/corvette/z06`，`/vehicles.html` 是空导航页）；价格在车种页「プライス」表：`メーカー希望小売価格(消費税込)` 列（2LT 15,350,000 / 3LT 17,950,000 / コンバーチブル 19,600,000；Z06 クーペ 3LZ 27,100,000 / コンバーチブル 3LZ 30,500,000）+ SANTORINI EDITION 29,000,000 |
| Citroën | ✅ | `www.citroen.jp` curl 全 403 → 浏览器（页面内 `fetch('/models/x.html')` 可读 HTML）；价格在各车型页グレード卡 `メーカー希望小売価格（消費税込）X円〜`，按出现顺序与グレード名配对、同名去重；`HYBRID` = 48V **MHEV**、ë-C3 = BEV、BERLINGO = Diesel、C5 X MAX PHEV = PHEV；`c4/e-c4-electric`、`c5-aircross-suv/pluginhybrid` 等子页无价格；页脚「2026年10月現在」是价格日期不是年款 |
| Volvo | ✅ | `www.volvocars.com/jp` curl 全 403 → 真浏览器（页面内 `fetch` 可读 HTML）；车型清单在 **`/jp/build`**（`/jp/cars/` 常报「一時的にご利用いただけません」）；每个 build 页 = **バージョン（`div.selectable-card`）× グレード**，点衍生款后读 `トリムレベル/モデルグレード` 段；**年款取车型页内嵌 `prices[<slug>].modelYears` 的键**（2027/2026，连续 unescape 4 次后 JSON.parse）；EX60 / V60 Cross Country 的 build 页跳回列表 = 未开卖 |
| Subaru | ✅ | `www.subaru.jp` curl 全通、纯 SSR、无反爬；全集在 `/carlineup/`（**28 卡 / 6 tab**，切卡别要求 `data-car-id`，否则少 5 张），价格只在各车系 `/<slug>/grade/`：按 `grade-nml-box` 切块取 `txt-xs`（动力）+ `txt-3l`（グレード）+ 每个 `ttl-price-box`（`ttl-box` 駆動 + `span.num` 税込）；型号名 = 动力+グレード+駆動/変速機。**⚠ `img alt` 滞后**（layback 的 alt 写 Smart Edition EX/GT-H EX，渲染实为 Limited EX/Black Selection）→ 只认 `txt-3l`；**⚠ 駆動是 `<p>MT<br>2WD</p>`**，去标签要还原成 `MT 2WD` 不是 `MT2WD`；车系名取 `/grade/` 页 `<h1>`（`レヴォーグ レイバック` 与 `レヴォーグ レイバック（S:HEV）` 是两个车系）；28 卡里 8 张是营销重复卡要折进母车系，只有 WRX STI Sport♯ 是真新增（在 `/advertising/wrx/stisportsharp/`，600 台抽选已结束）；grade-comparison JSON 是**税抜**（×1.1 才对得上）且 chiffon 滞后 → 只作校验；停销认 `label-endofsale`（全站 3 张）+ **渲染出来的** `notice-txt`（transcare 的同句被注释掉，不算）；`e-BOXER（ストロングハイブリッド）` = **HEV**（シリーズ・パラレル + EVドライブモード），`e-SMART HYBRID` = HEV（100%モーター但官网无増程字样）；生産終了旧 e-BOXER 9 档与福祉車両 3 卡全链路无价 → `官网无价格`；全站无年式，17 份 specifications.pdf 是 **Adobe-Japan1 CID 抽不出日文**，页脚 `2026.09` 是文档日期不是年款 → 一律 `官网无年款` |
| Maserati | 部分公开价 | 当前日本配置器 6 车系 11 版本；build 链接现取 modelCode/modelName，`carGrid/107/<modelCode>` 的 `general.price` 为基础 MSRP，`countryProp` 取完整动力标签及 MY27；GranCabrio Trofeo 实时价 28,700,000 优先于起价卡 28,670,000；MCPURA/Cielo 无公开价，GT2 MY27 价未核实，未套用无年款的历史新闻价 |
| McLaren | 官网不标价 | `www.mclaren.com/jp` 404 → 日本站在 `/cars/jp_ja`；CMS `mainnav?site=10` 给 12 个车型条目；配置器 5 个 profile 的 `ajaxGetConfigPrices` 全 `items:[]`，`showPriceSummary`/`showPricesByCountry` 均 `false` → 12 条全 `官网无价格`；官网/配置器/官方 PDF 无 MY → `官网无年款` |

> 详段：sites/jp.md（9 段）

### 阿根廷 AR

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| Ferrari | 官网不标价 | `www.ferrari.com/en-AR` 302 → `/es-AR`；`/es-AR/auto/gama` 的 Next.js `blocks` 给 19 个 CarBanner（Gama 11 + Serie especial 5 + Serie Icona 3）；车型页/配置器 0 个 `price` 字段、0 个金额，CTA 只有 `CONFIGURACIÓN`/`SOLICITAR INFORMACIÓN` → 19 条全 `官网无价格`；`listingData.year` 是上市/列表年、非 MY → `官网无年款` |

> 详段：sites/ar.md（1 段）

### 巴西 BR

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| Agrale | ⚠️ 无价格出表 | `www.agrale.com.br` curl 200；Caminhões 8 / Tratores 13 / Chassis 7 / Utilitários 9 = **37 个产品型号**；全站无 `R$` / `preço` / `valor`，只有 `Rede Agrale` / `Fale Conosco` → MSRP 全 `官网无价格`；无 MY → 年款全 `官网无年款` |
| Effa Motors | ⚠️ 无价格出表 | `www.effamotors.com.br` Wix；4 款（Picape V21 / V21 Baú / V22 / Furgão V25）；无 `R$` / `preço`，只有 WhatsApp 销售入口；Ficha Técnica 均 `Gasolina (E22)` → MSRP 全 `官网无价格` |
| Ram | ✅ | `www.ram.com.br` curl 403；`mvs-service` + `price-service`（`*.k8s.fcalatam.com.br`）直出全量：MVS 拿 `code/versionName/year/fuel`，`/price?mvsCode=&country=BR&year=` 顶层 `price` = 目录价；⚠ 预约接口 `/price/reservation` 是促销价，州/市缺省会显示不可用 |
| Troller | ✅ | `www.troller.com.br` 仅留档；官方 `A Ford encerrará a produção de veículos Troller ao final de setembro ... 2021` → 停产，全站 0 价格、无年款；2 条 `官网无价格` + 停销是 |
| Jeep | ✅ | `www.jeep.com.br` curl 直通；6 车系（Renegade 611/Compass 675/Commander 671/Avenger 657/Wrangler 685/Gladiator 559）；`mvs-service/mvs?brand=JEEP&model=&year=&market=pt-BR` 拿版本，`price-service/price?mvsCode=&country=BR&year=` 取顶层 `price`；⚠ `market=` 会 400，金融数字不采 |
| MINI | ✅ | **官方价格表 PDF 为主源**：Legal 页挂 `mini_tabela_de_precos_outubro_2026.pdf`（`Preços Públicos válidos 01/10–31/10/2026`），表列 `Modelo / Versão / Ano/Modelo / Preço`，18 版逐条取 **Ano/Modelo 单值**（2026/2027）；mini.com.br curl 000 但 PDF 可浏览器同源 fetch；mini4u 计算器与促销条款只作交叉核对，冲突以价目表为准 |

| BMW | ✅ | `www.bmw.com.br/pt` curl TLS reset，真浏览器可开；`/pt/all-models.html` 32 张 `.cmp-allmodelscard`，23 张有价卡展开为 **30 个配置 + 2 个 Novo 无价 = 32 条 / 20 车系**；⚠ 年款取卡内隐藏句 `Preço público sugerido ... ano/modelo YYYY/YYYY, de R$ ...`（一句同时给配置+年款+价，X1/320i/M4/M3/M2 一卡多配置），可见 `A partir de` 只是最低配；金融清库段的 2025/2025、2025/2026 不是价格年款；**售价再按配置器校准**（shadow DOM 的 `CON-MODAL-LINE-SELECTION`；M3 Competition 897.950 / Track 1.003.950、M2 Track 740.950 取配置器） |

| Audi | ✅ | `www.audi.com.br/pt` curl 403 Akamai、真浏览器可开；`/pt/models/` 的 serialized-onegraph-store 给 **20 carline + minPrice**，配置器 `Etapa 1` 版本卡给逐版本 BRL 价（26 版本）；年款取 carline id / `pr` 参数（19×2026 + A6 Avant e-tron 2027） |

| Porsche | ✅ | `www.porsche.com` / `configurator.porsche.com` curl 403，但官方对比站 `compare.porsche.com/pt-BR` curl 200 SSR 全量：车系计数 **911 12 / Taycan 5 / Panamera 4 / Macan 4 / Cayenne 15 = 40 卡**，卡内 `De R$`（⚠ R$ 后是 U+00A0）；配置器抽验 25 条一致、口径 `Preços públicos sugeridos` 不含国内运费；GT3×3 + Cayenne Electric×6 无价（CTA `Solicitar veículo`）→ `官网无价格` |
| Avatr | ✅ | `avatr.caoachangan.com.br`（CAOA AVATR 官方进口商）curl 403、真浏览器可开；仅 AVATR 11，官网逐字 `4 lugares: A partir de R$ 619.900`、`5 lugares: A partir de R$ 599.990`；无 ano-modelo/MY → 官网无年款 |
| Aston Martin | ⚠️ 无价格出表 | 以巴西配置器 `configurator.astonmartin.com/BR/model-select` 为准：`/models/products/BR` = **16 衍生版 / 6 车系**（Valen / Valhalla / DBX / Vantage / DB12 / Vanquish）；公开会话不渲染价格（dealer pricingData 缺省），声明价格由经销商确定 → 全 `官网无价格`；无 MY → 官网无年款 |
| Mercedes-Benz | ✅ | 站点 curl 403，但 `api.oneweb.mercedes-benz.com` 直通（Referer = www2）；`vmos BR/pt` 给 17 车系，`owcc pt_BR/CCci/291767b9/entry?proposedStep=MOTORIZATION&typeClass=` 给 36 个 motorization 的 `name`/`price`/`fuelType`；年款取 tile name 末尾 `26/26`、`26/27`；`modelYear 806/807` 是销售代码不当年款 |
| Honda | ✅ | `www.honda.com.br` curl 403；页面选 **SP (São Paulo)** 后调 `GET /automoveis/api/produtos/completo?modelo=<machine_name>&uf=SP&timestamp=YYYY_M_D_H` → `version_features[].colors[].pps.SP.field_pps_preco`，每版取颜色最低价；10 车系 21 版本全部有价（117 700–430 500 BRL）；**年款取每车型页底部 Texto Legal 的 `ano/modelo`，按第二年份映射 MY（2025/2026、2026/2026→MY2026；2026/2027→MY2027）**，不按发布/生产年份推算；machine_name 见详段 |
| Peugeot | ✅ | `www.peugeot.com.br` curl 403、真浏览器可开；5 车系（208/2008/Partner Rapid/Expert/Boxer）逐车 `gama/<model>/monte.html` 的「1. VERSÃO」版本卡给全量版本价；版本名尾部即 ano/modelo（26/27、26/26、25/26）；**取版本卡/De 价，不取 POR 促销**（208 Style 89.990、2008 GT 162.990） |
| Volkswagen | ✅ | `www.vw.com.br` curl 200 但价格全在配置器 JS；**全集必须以 `<carline>.app` 的「N versões」逐车清点**（`model-structure.mofa.json` 会滞后：Tera 实际 4 版，JSON 只有 3 版，漏 `Tera 170 TSI` 31601 / R$ 124.290）；`configurador.html/__app/<path>.app?...` 选完动力显示 `Preço Total`，完整车型名尾部 `Modelo 2027`（Amarok 2026）；**12 carline / 35 版本**；compare 页最多并排 3 个配置；Tukan（未上市）/Golf GTI（404）不纳入 |
| Toyota | ✅ | `www.toyota.com.br` curl 200；**配置器** `/modelos/<slug>/monte` 的 `__NEXT_DATA__ → pageBlocks[1].props.models[].versions[]` 逐版本给价（`status:true`，取 `modelYear.colorWithPrice[].price` 最低）+ `modelYear.year`（2024/2026/2027）；17 车系 38 版本；PDF 仅交叉核对，bZ4X 颜色行合并、Hilux MT 不在售、GR Corolla 2024 取配置器 416 990/461 990、Corolla Cross GR-Sport 为 Gasoline 非 HEV |
| Ford | ⚠️ 商用车缺价 | `www.ford.com.br` curl 403；**build&price 配置器** `?nameplate=<id>` 的 `.bp-nameplate-data[data-json]` 逐版本给 `label/price/PowerTrain`；9 nameplate 去重后 23 个乘用车版本 + 5 个商用车 = 28 条；年款取 label 末尾（Ranger 2027/2026、Raptor/Bronco/Territory 2026、Mustang GT 2025）；F-150/Maverick/Dark Horse 标签无年份且页面 2025 是版权年 → 官网无年款；Transit/E-Transit `Consulte sua concessionária Ford` → 官网无价格 |
| GAC | ✅ | `www.gacgroup.com/pt-br`（`gac.com.br` TLS 不可用）；GS3 / GS4 Hybrid / GS9；版本价在 `/pt-br/configuration/<slug>/<year>` 的 Nuxt `vehicleModels[].salePrice`（`vehStyleCode` 即年款）；GS9 ULTRA 无价 |
| Aion | ✅ | 同站 AION UT / V / ES / Y；`/pt-br/configuration/aion-*/2024` 的 `salePrice` 逐版本；⚠ `aionbrasil.com.br` 是 AI 服务公司，不是汽车品牌，官方车系在 gacgroup.com |
| Hyptec | ✅ | 同站 `/pt-br/configuration/hyptec-ht/2024`；HT ELITE 314.990 / ULTRA 369.990；BEV |
| BYD | ✅ | 乘用车在 `www.byd.com/br`（bydbrasil.com.br 是商用车）；`/br/order-<model>` 版本卡给 `Preço de Venda`（与 `/ofertas` 的 `De` 一致，不取 `Por`）；**16 车型 21 版本**；年款分散：Ofertas 2027、Condições Comerciais 逐字 `ano/modelo`、Yuan Plus 标题 2026；Dolphin SE/Dolphin Plus/Han/Sealion 7/Tan 无官方年款 → 官网无年款 |
| Fiat | ✅ | `www.fiat.com.br` curl 200；各车型子域 `monte.html` 版本卡 `input[name=version]` = MVS code、`img[alt]` = 完整版本名，卡上价格显示不可用；价格取 `price-service.k8s.fcalatam.com.br/price?mvsCode=&country=BR&year=` 顶层 `price`；**11 车型 41 版本**；年款取版本名尾部，Titano/Fiorino/Ducato 用 MVS `year`（2026/2027/2025）；Ducato Heavy 529GGF0 未在 monte 卡中列出，不纳入 |
| ZEEKR | ✅ | `zeekr.com.br` 证书过期 → 内容在 `zeekrlife.com/pt-br`；价格只在 `conf.zeekr.com.br` 3D 配置器，`?linkCode=` 切车型（001 默认 / 7X 1197 / X 3）；逐字读 `Ano/Modelo` + `Versão` + `xxx.000 BRL`；**3 车型 6 版本**，R$ 298.000–542.000，全 BEV |
| Geely | ✅ | `www.geelybrasil.com.br` curl 200；**各车型配置器版本不同**：EX2 用 `d3ksl4ozrd1trt.../v13/?model=ex2`、EX5 用官方 monte 页内嵌 `d3ibdg82ywvs0g.../pr-20/index.html`（v13 的 EX5 旧价 205.800/225.800 已废，现为 207.800/227.800）、EX5 EM-i 用 `pr-17`；**3 车型 7 版本**；EX5 EM-i 有 `De/Por`，取 De 199.990/219.990/244.990；年款取 offer 法律条款 `ano/modelo 26/26`；BEV 4 · PHEV 3 |
| Land Rover | ✅ | `www.landrover.com.br` curl 200；Range Rover 三款走 `rangerover.com/lr/pt_br/<l460_/l461_/l560>/ipr/personalise/`，Defender/Discovery 走 `landrover.com.br/lr/pt_br/<l663/l462/l550>/ipr/personalise/`；配置器 `Modelo` 卡给 `A partir de`，`RESUMO` 直接给车型年；**8 车型 13 版本**；PHEV 5 · MHEV 5 · Diesel 2 · Gasoline 1；Range Rover GT 未上市、Velar 2025 库存版不纳入 |
| JAC Motors | ✅ | `www.jacmotors.com.br` curl 200；Elementor 价格客户端注入（静态占位 `R$000.000`），页面重、navigate 常超时但 `evaluate` 可读；**CARROS 3 款 + Hunter 皮卡 = 4 车系 5 版本**；E-JS1 25/26 `De 132.900`（Por 119.900 不采）、EXT 无价、E-JS4 254.900、E-J7 259.900、Hunter HD 25/26 259.900；VANS/卡车商用线无公开价，不混入 |
| Jaguar | ⚠️ 无价格出表 | `www.jaguar.com.br` 是 **Jaguar Equipamentos 工业设备**，不是汽车；JLR 巴西官方 `jaguarbrasil.com.br` → `jaguar.com/pt-br`，当前仅 `Type 01` 预生产车、全站无 R$/price → `官网无价格` + `官网无年款`；BEV |
| Ferrari | ⚠️ 无价格出表 | `www.ferrari.com/en-BR` curl 200，车型页 curl 403 但真浏览器可开；Range 页 **19 款** + 配置器独有 **Roma Spider = 20 车型**；Range/车型页/`carconfigurator.ferrari.com/en_EN` 全部 0 个价格字段，CTA `ENQUIRE`/`REQUEST INFORMATION` → 20 条全 `官网无价格` + `官网无年款`；Gasoline 10 · PHEV 8 · HEV 1 · BEV 1 |

> 详段：sites/br.md（26 段）

### 挪威 NO

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| ZEEKR | ✅ | `www.zeekr.eu/nb-no` curl 200；车型页给起价，版本价在 `shop.zeekr.eu/nb-no/configuration/?linkCode=`（001=1 / 7X=1075 / 7GT=1611 / X=1628）；**4 车型 14 版本**，NOK 376 800–730 500；页面 `Kampanje - nå fra …` 是促销，取未划线 `Pris`；无 årsmodell → 官网无年款；全 BEV；NOK 用空格千分位 |
| Jaguar | ⚠️ 无价格出表 | `www.jaguar.no` → `jaguar.com/no-no`，首页仅 `Copy nothing.` teaser；sitemap 只有 Type 01，无配置器/价格/年款；Type 01 纯电但 `官网无价格` + `官网无年款` |
| Toyota | ✅ | `www.toyota.no/nybil` curl/robots 全 403，真浏览器可开；车型页 `<div id="tor-…-data">` 的 `gradeSelectorModel.model.gradeBodyTypes[].engines[].transmissions[].wheeldrives[].price.list` 逐版本取价（**不取**带默认漆的卡面价）；10 车系 43 组合；Proace Verso 走 build 页；官方价目 PDF 无 MY → 官网无年款 |
| Fiat | ✅ | `www.fiat.no` curl 403，真浏览器可开；`/nyttige-lenker/prislister` → 官方 PDF，取 `Veil.pris inkl mva`（**不取** `Kampanje` 行）；5 乘客车 + E-Scudo 2 有价，E-Doblò 价目表 404=`未核实`、E-Ducato=`官网无价格`；无 MY → 官网无年款 |
| Ford | ✅ | `www.ford.no` curl 超时，真浏览器可开；配置器 `servicescache.ford.com/api/vehicle-model/v1/load?config=<catalogId>` 的 `features.byMarketing[series].featurePrice.basePrice.grossOTR` = MSRP（**不取** `recommendedOTRPromotionalPrice`）；PV 以官方价目表 PDF（`pdftotext -raw`）逐版本取：**20 车系 / 50 行** = PV 6 车系 36 行（Puma 4 / Capri 8 / Explorer 8 / Mach-E 4 / E-Tourneo 8 / Tourneo 4）+ CV/皮卡 14 车系 14 行车系级（官方 `Eks. MVA`，不与 PV 含税价横比）；年款按官网原值照写：Puma 2027 / Capri·Explorer 2027.25 / Mach-E 2026 / Tourneo·E-Tourneo 2026.50；CV 官网无年款；Fiesta/Focus 停产、Ranger Super Duty 未上市均不入表；`rohneselmer.no` 是经销商，不作官网源 |
| Land Rover | ✅ | `rules.config.landrover.com/rc/lr/no_no/{carline}_k27/.jsonp` 可 curl 直连（须 `-L --compressed`，先 302 到 build 文件）；`PRODUCT` 组取 `price.RETAIL`（Velar/Discovery Sport 回退 `GROSS`）；**7 车系 186 型号**，NOK 1 005 900–4 946 900；`modelyear` k27→MY2027 / k26→MY2026；同名补 SWB/LWB 与 90/110/130 车身 |
| Voyah | ✅ | `www.voyah.no` curl 200；仅 COURAGE 在售（Dream/Free 标 `Utgått`）；`/voyah-courage/bygg-din-bil` 4 版本卡给 NOK：CORE RWD 299 990 / CORE AWD 349 990 / PREMIUM RWD 349 990 / DESIGN AWD 399 990；DESIGN `Spar 100.000` 只有展示价；无 årsmodell → 官网无年款；全 BEV |
| Lexus | ✅ | `www.lexus.no` curl 403 Akamai；首页同源 `fetch('/new-cars/…')` 取 HTML；**只看 grade 卡会少算**：必须继续 Texus `getGrades` → 每个 grade 的 `getMotorizations`，取各 `Engine` 的 `Grades[].PriceInfo.ListPriceWithDiscount`；**RZ 5 / ES 3 / TZ 5 = 13 版本**（RZ 500e Executive 642 100、500e Luxury 740 000、ES 500e Executive 711 400 是卡片漏项）；TZ 取 `Prisoversikt` 静态表（含 frakt/levering Oslo）；RZ/ES 2026、TZ 无年款；全 BEV |
| Dongfeng | ✅ | `www.dong-feng.no` curl 200；BOX / VIGO 两车型，`/box/konfigurator`、`/vigo/konfigurator` 版本卡直接给 kr；**4 版本**：BOX GO 189 990 / BOX Long Range 214 900 / VIGO Comfort 229 990 / VIGO Signature 259 990；加价项不采；无 årsmodell → 官网无年款；全 BEV |
| Lotus | ✅ 部分无价 | `www.lotuscars.com/en-NO` curl 200；定价 `ruler/pricing/<MODEL>/NO/<MHP>` 取 `retailPrice`（NOK）；**5 车系 20 版本**（Emira 6 · Eletre X 2 · Eletre 6 · Emeya 5 · Evija 1）；Eletre X 取配置器 1 492 300（页面 1.449.000 过期）、Emeya 600 GT 取 1 149 318（页面 1,149,000 为取整）；Emira 全变体 API 500+全链路 0 价、Evija 空 body → `官网无价格`；MY 只在素材名 → 官网无年款；NOK 空格千分位 |
| Renault | ✅ | `www.renault.no` curl 429 Vercel 挑战，真浏览器可开；`/brosjyrer` 8 份官方价目 PDF（`rn-nordic-prod.objects.frb.io` 直链，本机 DLP 包 PDF 须 `curl|cat>tmp.pdf && pdftotext -table` 同命令处理）；乘用车取 `veil.kundepris`，**不取** `LAGERKAMPANJE` 清库价（站点 `Fra 249 900` 是促销，R5 目录价 269 900 起）；商用车取 `Kundepris eks. mva`（与乘用车含税口径不可横比）；**8 车系 35 版本**；无 MY → 官网无年款；未开售的 Twingo / Nye Megane / R5 Turbo 3E / Trafic E-Tech 不入表 |
| Ferrari | ⚠️ 无价格出表 | `www.ferrari.com/en-NO` 裸 curl 403，带 Chrome UA 200；`/en-NO/auto/car-range` **19 款**；Range + 19 个车型页 0 个 `price/NOK/€`，CTA 只有 `Build your own` / `Request information` → 19 条全 `官网无价格`；无 MY（`Model year` 仅 VIN recall 标签）→ `官网无年款`；PHEV 9 · Gasoline 9 · BEV 1（Luce） |
| JAC | ✅ | `jacmotors.no` Next.js curl 200；**2 车系 6 版本**（E30X 3 / T9 EV 4x4 3）；官方 iPaper 价目表 `/jac-{e30x,t9}-prisliste/`，POST `GetPDF.ashx` 取签名 PDF（本机 DLP 须同命令 POST→GET→pdftotext）；取 `Veil.pris levert Drammen`：E30X Pure 40 219 900 / Pure 50 254 900 / Nordic 259 900；T9 524 900 / 5-seter Nordic 618 000；2-seter 无价；`219 000` 与 e-JS4 `299 900` 是促销不采；无 MY → `官网无年款`；全 BEV；NOK 空格千分位 |

> 详段：sites/no.md（13 段）

### 俄罗斯 RU

| 品牌 | 结论 | 数据源 / 一句话方法 |
|---|---|---|
| Ferrari | ⚠️ 无价格出表 | `www.ferrari.com/ru-RU` 带 Chrome UA 200；`/ru-RU/auto/car-range` **20 款**（比 en-NO 多 `296 Challenge Stradale`）；Range + 车型页 0 个 `price/RUB/₽`，CTA `Конфигуратор` / `Запросить информацию` → 20 条全 `官网无价格`；无 MY → `官网无年款`；PHEV 9 · Gasoline 10 · BEV 1（Luce） |
| Porsche | ❌ 无俄罗斯市场数据 | `www.porsche.ru` 公共 DNS 无 A 记录（www NXDOMAIN，apex 仅 SOA）、curl TLS 握手失败、http 502、WebFetch 失败；`porsche.com/russia` / `configurator.porsche.com/ru-RU` 均 403 Akamai；`compare.porsche.com/ru-RU` 302 → `en-XW`（国际站，非俄区）→ 无官方 RUB MSRP，不出表 |
| TENET | ✅ | `tenet.ru` curl 200；5 车系 15 版本；车型页 `Прайс-лист` → perxis PDF（`1.cdn.perxis.ru/originals/<id>/original`），取**常规价行**（= 促销价 + трейд-ин 抵扣 + 额外抵扣）；站点 nav `от X ₽` 是含置换促销价不采；金融示例交叉验证；PDF Cyrillic 无 ToUnicode，用算术关系；金融示例 `2026 г.в.` 绑定车型/trim/价格 → 年款 **2026**；全 Gasoline；RUB 空格千分位 |
| Rolls-Royce | ⚠️ 无价格出表 | `www.rolls-roycecars.ru`（Rolls-Royce Motor Cars Moscow / БорисХоф 官方经销商）curl 200；9 个当前车型页 0 个 `₽`，CTA `Предложите вашу цену`；`/our-offer/cars-in-stock/` 的库存车价不是 MSRP 不采 → 9 条全 `官网无价格`；无 MY → `官网无年款`；BEV 2 · Gasoline 7 |
| Evolute | ✅ | `www.evolute.ru` curl 200；4 车型 6 版本（i-JOY Бизнес/Сити+、i-SPACE 5/7 座、i-SPACE 4x4、i-SKY）；站点 `от …` 是叠加补贴/贴息/置换后的促销价，**取 RRЦ**：i-JOY 3 124 000/3 324 000、i-SPACE 3 585 000/3 685 000、4x4 3 890 000、i-SKY 3 515 000；`2026 года производства` 绑定车型/价格 → 年款 **2026**；BEV 3 · REEV 3 |
| Foton | ✅ | `foton-mbrus.ru` 官方经销商 МБ РУС curl 200；6 车系；`/media-link/<model>-price` PDF 同时列 РРЦ 与 −150 000/−300 000 促销，**取 РРЦ**：V9 5 450 000、V7 5 250 000、G9 3 990 000、G7 3 200 000、VIEW 3 400 000、TOANO 2025 3 400 000 / 2026 3 525 000；TOANO 年款 2025/2026，其余官网无年款；PDF 西里尔文无 ToUnicode，按车型最低 РРЦ 出行 |
| Maserati | ⚠️ 无价格出表 | `maseratimoscow.ru` 官方经销商站 curl 200；Модификации 展开 **13 版本**（Ghibli Trofeo/GT Hybrid/Modena/Modena S/Modena S Q4 · Levante Trofeo/GT Hybrid/Modena/Modena S · Quattroporte Trofeo/GT/Modena/Modena Q4）；车型页与 `/cars` 0 个 `₽`/整车金额，CTA 只有 `Получить дополнительную информацию` → 13 条全 `官网无价格`；无 MY → `官网无年款`；MHEV 2（GT Hybrid）· Gasoline 11 |
| SWM | ✅ | `swm-auto.ru` perxis 站 curl 200；3 车系各 1 个 From 价：G01Pro 2 789 900 / G01F 2 639 900 / G05 Pro 2 559 900；⚠ 2025 价目表 PDF 与站点 2026 展示价不一致（G01F PDF 2 367 000），未用旧 PDF；无 MY → `官网无年款`；全 Gasoline |
| Yangwang | ⚠️ 非厂商 MSRP | `yangwang-russia.ru` 是进口商库存目录；3 台 U8 库存价不是厂商 MSRP，标准任务主表写 `未核实`，不得按颜色取最低库存价出数字行；`Год выпуска 2023` 绑定该台库存车 → 年款 **2023**；PHEV |
| Soueast | ✅ | `soueast.ru` curl 200；`/media-link/{s06,s07,s09}-pricelist` 官方 PDF；3 车系 8 版本；取常规价（S06 3 029 000/3 409 900、S07 3 399 000/3 549 000、S09 3 899 000/4 099 000），**不取** 2026 折扣价（2 999 000/3 249 000 等）；S07 有 2025/2026 两年款，S09 2025，S06 无年款；全 Gasoline |
| AVATR | ✅ | `avatr-motors.ru` Nuxt curl 200；07/11/12 三款 10 配置；价格表逐字 `2026 года производства, руб. с НДС`：07 6 600 000/6 900 000/7 000 000、11 6 990 000/8 290 000/8 490 000、12 6 990 000/7 790 000/8 290 000/8 390 000；配置只有内部码；`2026 года производства` 绑定车型/价格 → 年款 **2026**；07 REEV · 11/12 BEV |
| Belgee | ✅ | `belgee.ru` perxis 站 curl 200；4 车系 14 版本；站点 `от` 是减 100k/150k/200k 促销，取价目 PDF 常规价：X50 2 199 990；X50+ 2 319 990/2 509 990/2 699 990/2 799 990；S50 1 929 990/2 069 990/2 165 990/2 345 990；X70 2 609 990/2 745 990/2 839 990/3 039 990/3 115 990；无 MY → `官网无年款`；X70 三款 48V → MHEV，其余 Gasoline |
| McLaren | ❌ 无当前市场数据 | `mclarenautomotive.ru` 是旧版俄语站，只列 New GT/570S/720S/Senna 等旧车；无当前俄罗斯在售全集，**不得按全球 lineup 补 Artura/750S/GTS 等行**；标准任务不出 McLaren_RU 表 |
| Exeed | ⚠️ 部分 | `exeed.ru` + `esteo.ru/exlantix` curl 200；4 车系 7 版本；VX/RX 只展示含 трейд-ин/直降的促销价、perxis 价目表为图片型 PDF → 5 条 `未核实`；EXLANTIX ET/ES 取列表价 6 990 000 / 6 170 000（REEV）；VX 年款 2025，其余无年款；Gasoline 5 · REEV 2 |
| GAC | ⚠️ 部分 | `gac.ru` curl 200；Комплектации 展开 **17 版本 / 7 车系**；GS4 3 版按官方按揭计算器取配置价 2 999 000 / 3 499 000 / 3 499 000（2026）；GS8 GL/GT/GX Premium 4 199 000/4 599 000/4 949 000、Aion V EX/EX Premium 4 399 000/4 699 000、M8 Lounge 7 999 999（取价目表 RRЦ）；GS3/Empow/Hyptec 及 GS8 GX Traveller、M8 GT/GX/GX Premium 只有促销价或图片型 PDF → 8 条 `未核实` |
| VGV | ✅ | `vgvmotor.ru` curl 200；3 车系 9 版本；官方表分列 RRЦ 与「с учетом всех выгод」，取 RRЦ：U70 PLUS 1 999 000/2 099 000、U70 PRO 2 579 990/2 639 900/2 794 900、U75 PLUS 2 999 900/3 049 900/3 199 900；年款 2026/2025/2024/官网无年款；全 Gasoline |
| Moskvich | ✅ | `moskvich.ru` + `moskvich-m.ru` 本机 TCP 超时，但官方页面/PDF 可读；`от` 多为促销，取价格表常规价（含 VAT）；28 条 / 9 车型，CNG 4 条 `官网无价格`；仅明确的 MY26 写 MY2026，生产年不当年款 |
| Hongqi | ⚠️ 部分待复核 | `hongqi.ru` API + 车型页 + 10 份 PDF 交叉；`Сезонная цена` 必须逐条排除 trade-in/折扣，HS3 Comfort 已确认含 250 000 трейд-ин → `未核实`，H5 Comfort `官网无价格`；其余数字价待复核；48V=MHEV、GUOYA HEV、E-HS9 BEV |
| KGM | ✅ | `kgm.ru` 无配置器/API；4 车型官方 PDF 取未折扣 МРЦП，税价未标注；23 条，Tivoli СИТИ `未核实`；Torres/Rexton 明确模型年 2024/2025，生产年不当年款；全 Gasoline |
| Denza | ⚠️ 部分 | `denza-russia.ru` 仅 Z9 混动 `от 8 400 000 ₽`；Z9 GT/N9 无价、Z9 纯电 `未核实`；5 条 / 3 车型；官方标题给 2024/2025；PHEV 3 · BEV 2 |
| JAC | ✅ | `jaccar.ru` 静态价格表 + perxis PDF 取未折扣 РРЦ；3 车型 8 版本，T8 PRO 汽油版口径冲突 `未核实`；RF8 明确 2026 MY，生产年不当年款；Gasoline 6 · Diesel 2 |
| Kaiyi | ⚠️ 无价格出表 | `kaiyi-auto.ru` 4 车型无配置器/价格 API/价目表；`/owners/regulations-to` 明确 7 个动力版本（E5/X3 各 2、X3 PRO 1、X7 2），全 `官网无价格`；四本官方说明书无 MY；全 Gasoline |

> 详段：sites/ru.md（22 段）

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
| Rolls-Royce 劳斯莱斯 | ⚠️ 无价格出表 | 官网**全站不标价**（中/英/美三站 0 个价格，CTA 只有 `Enquire`；配置器页写明须与经销商确认）→ 仍出表，MSRP 填 `官网无价格`；⚠ 沙箱出口被 302 到 `.com.cn` |
| Lamborghini | ⚠️ 无价格出表 | `www.lamborghini.com/en-en` curl 200；官网不公布 MSRP：车型页 JSON-LD 无 `offers/price`、配置器全流程 0 金额、只有 `ENQUIRE`；Range 3 车系 6 车型（Temerario / Temerario Spyder / Revuelto / Revuelto SV / Urus SE / Urus SE Performante）全入表、MSRP 全 `官网无价格`；ENQUIRE 表单逐字 `2027 Lamborghini …` → 年款 2027；均 PHEV |

> 详段：sites/global.md（6 段）

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
