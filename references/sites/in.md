# 印度 IN — 站点坑位详段

> 市场码 IN · 13 段 · 品牌：Force Motors / Jeep / MINI / VinFast / Honda Cars / BYD / Toyota / Ford / Volkswagen India 大众印度 / BMW India 宝马印度 / Porsche India 保时捷印度 / Mercedes-Benz India 奔驰印度 / Bentley India 宾利印度
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-10-30 · 文中 snapshotVersion / token / 车型 id 均为当时实测值，必须现取

---

### Force Motors（IN 印度 `www.forcemotors.com`：**全通，有官方 `/prices/` 价格总表，SSR 直读**）✅

- **站点**：✅ 200，**nginx + PHP 8.2（Plesk）**；curl 直通、无任何反爬，是近几轮里最"素"的一站。
- **★ 真源 = `/prices/`**（`https://www.forcemotors.com/prices/`）：**34 个 `<table>`**，统一两列 `Model Description | Ex-Showroom Price`，服务端渲染，一次 curl 全拿。
- **★ 表格结构（解析要点）**：
  - 第 1 行 = 表头（`Model Description`）
  - 表头后第一个**单列行** = 车系名（如 `TRAVELLER T1 STANDARD 3050 MM WB`）
  - 表头后的**双列行** = 配置名 + 价格
  - ⚠ **别用 `find_all_previous(['h1'..])` 取车系名** —— 会把页脚的 `Disclaimer:` 当标题串进来；用"表格内单列行"判最稳
- **在售车系**（全 166 配置）：`TRAVELLER`(T1/T2/T3 × 3050/3350/3700/4020/5200 WB，含 Delivery Van / Ambulance / School Bus) · `TRAX`(GAMA / CRUISER / TOOFAN / DV / School Van) · `CITILINE` · `SCHOOL VAN` · `URBANIA DX` · `MONOBUS`(4020/5200，Standard / School Bus / Shell) · `Gurkha`(3 Door · 5 Door)
- **价格格式**：印度 **lakh 分组** `15,70,522`（= 1,570,522）；⚠ 少数带 `₹ ` 前缀（表格 T11/T28）或 `.00` 后缀（URBANIA），提数前先 `re.sub(r'[^0-9,]','')`
- **燃油**：几乎全 `Diesel`（`FM2.6CR` = 2.6L 共轨柴油 / `FM3.2` = 3.2L）；配置名含 `CNG` 的标 `CNG`；`Gurkha` 亦为柴油
- **口径**：**Ex-Showroom Price**（印度裸车价，不含上路费）—— 印度官网通行口径

**交付结果**：`ForceMotors_IN_官网价_20261015.xlsx`，**166 条**（7 大车系 × 配置展开）。

---

### Jeep India（IN 印度 `www.jeep-india.com`：**全通，价格在 SSR + 内联 JSON，可采**）✅

- **站点**：✅ 200，**Apache + Akamai**（`CT_Akamai` geo cookie 会带 `country_code=CN`，但**不拦**）；curl 直通。
- **在售 4 车型**：`Compass`(紧凑 SUV) · `Meridian`(7 座 SUV) · `Grand Cherokee`(豪华 SUV) · `Wrangler JL`(硬派越野)
- **★ 价格有两层**：
  1. **起价**：`<meta name="description">` 里的 `from ₹X.XX Lakh*`（各车型页顶部）
  2. **变体级**：页面内联 JSON，结构为
     ```json
     "models":{"<CODE>":{"displayPricing":true,"pricing":{"price":"21.30 Lakh*",
       "description":"Ex-Showroom Price","EMIFormulaValues":{"msrp":"2130000"}}}}
     ```
     `msrp` 是精确整数（卢比），`price` 是 lakh 显示值 —— **15 个变体全部在这里**
- **★ 变体名不在 JSON 里**，而在页面**轮播标签**上（渲染后可见）：
  - Compass（7）：SPORT · LONGITUDE · LIMITED · MODEL-S · TRACK EDITION · 85TH ANNIVERSARY EDITION · TRAIL EDITION
  - Meridian（7）：Longitude · Longitude Plus · Limited (O) · TRACK EDITION · 85th ANNIVERSARY EDITION · Overland · TRAIL EDITION
  - Grand Cherokee（1）：LIMITED O
  - Wrangler（4）：WRANGLER WHITECAP EDITION · WRANGLER 1941 WILLYS EDITION · WRANGLER UNLIMITED · WRANGLER RUBICON
- **★ 配对方法（本节最有价值的经验）**：**JSON 块的出现顺序 == 轮播标签的顺序**。用 Playwright 点 4 个标签交叉验证（LIMITED→24.83 / MODEL-S→26.70 / TRACK EDITION→26.95 / TRAIL EDITION→23.66 全部吻合）后，即可放心按序 zip。
- **★ 点击轮播的两个坑**：
  - `locator.scroll_into_view_if_needed()` 会**超时**（懒加载元素不可滚动）→ 去掉这步，直接 `click(force=True)`
  - **JS `el.click()` 对 React 不生效**（事件不触发），必须用 Playwright 的 `locator.click()`
  - 轮播**只渲染当前项**，所以 DOM/`innerText` 永远只拿得到 1 个价格 —— 想拿全部只能"点一个读一个"或走 JSON
- **展示单位**：页面用 `₹17.99 Lakh*`，**换算 × 100,000**（17.99 Lakh = 1,799,000），与 JSON `msrp` 完全一致
- **燃油**：`Compass` / `Meridian` = **Diesel**（2.0L Multijet II，`"fuelType":"Diesel"` 明文）；`Grand Cherokee` = **Petrol**（`"fuelType":"Petrol"`）；`Wrangler` = **Petrol**（2.0T；官网未明写，按印度在售动力判定）
- **口径**：**Ex-Showroom Price**（印度裸车价）

**交付结果**：`Jeep_IN_官网价_20261015.xlsx`，**19 条**（4 车型 × 变体展开）。

#### 🔁 2026-10-19 补充：**变体级真源在 visualizer 的 one3d 配置器 API（30 条，优于轮播 zip）**

**`www.jeep-india.com` 的车型页轮播只是「精选 trim」；完整「发动机 × 变速箱 × 驱动」组合在独立配置器域。**

| 项 | 内容 |
|---|---|
| **★ 入口** | 车型页 visualizer 链接指向 `https://configurator.jeep-india.com/visualizer/null/<commercial_model_code>`（Angular SPA，CloudFront 托管，curl 只回 7.6 KB 壳）|
| **★ 商业代码** | `M67421` Compass · `H67523` Meridian · `W77423` Grand Cherokee · `JL7421` Wrangler |
| **★ 三个 API（`prod-jeep-api.one3d.in`）** | ① `GET /api/v1/models/all`（4 车型清单）② `GET /api/v1/variants/all`（**当前车型全部变体，183 KB**）③ `GET /api/v1/variants/details`（只有当前选中 1 条，**不是全量，别用**）|
| **★ 变体字段** | `version_name`（`Sport 2.0D MT` / `Model S (O2) 4x4 2.0D AT`）· `variant_name` · `price`（整数卢比）· `fuel_type` · `transmission_code`（6MT/9AT/8AT）· `drive`（4x2/4x4）· `num_of_seats` · `variant_cpos` · `active` |
| **⚠ curl 直连 401** | `variants/all` 需 `Authorization: Bearer <JWT>`；token 由 `POST /api/login`（body 要 `username`）下发，浏览器首屏自动调 `/api/login` 拿到 **223 字符 JWT（有效期约 6 天）** → **最省事的做法：Playwright 打开配置器页，直接拦截 `variants/all` 响应**，不要自己拼 token |
| **⚠ token 手带反而 404** | 用拦截到的 JWT 手动 curl 同一路径会返回 404（路径/租户校验），**拦截响应才是正解** |
| **★ 实测结果（30 条）** | Compass **13**（Sport→Track，含 4x4）· Meridian **14**（Longitude→Overland/Track，5/7 座）· Grand Cherokee **1**（Limited O）· Wrangler **2**（Unlimited / Rubicon）|
| **⚠ 配置器数据会滞后** | Compass / Meridian / Grand Cherokee 的配置器价与官网导航起价**完全吻合**；但 **Wrangler 配置器仍是 66.20 / 70.80 Lakh，官网车型页已涨到 67.70 / 73.55 Lakh** → **Wrangler 以车型页为准**，其余用配置器 |
| **★ 4 个车型页 URL** | Compass `/new-compass.html` · Meridian `/meridian.html` · Grand Cherokee `/grand-cherokee.html` · Wrangler **`/wrangler-jl.html`**（`/wrangler.html` 是 404，别猜）|

**交付结果**：`Jeep_IN_官网价_20261019.xlsx`，**30 条**（4 车型 × 全部 motorization 组合）。

---

### MINI（IN 印度 `www.mini.in/en_IN/`：**curl 全挂（Akamai HTTP/2 拒绝），只有 Playwright 有头可通**）⚠️ 部分

- **★ 封锁形态（记牢）**：curl 拿到 **TLS 握手成功、HTTP/2 stream 建好**，但响应 `HTTP/2 stream 1 was not closed cleanly: INTERNAL_ERROR (err 2)` → `curl (92)`，**HTTP 码 000**。**`--http1.1` 也 000**，换 UA/补头均无效。**唯一解 = Playwright 有头（`xvfb-run` + `headless=False`）**，能正常 200。
- **★ 价格藏两处**：
  1. **`/en_IN/home/range.html`** —— 车系起价（`From ₹ 47,50,000`）
  2. **`/en_IN/home/range/<model>/models.html`** —— **trim 级价**；⚠ **只有 `mini-cooper-3-door` 和 `all-electric-mini-countryman` 存在此子页**，其余车型 `/models.html` 直接 **ERR_HTTP_RESPONSE_CODE_FAILURE**
- **在售车系**：MINI Countryman C · All-Electric MINI Countryman · MINI JCW Countryman ALL4 · MINI Cooper 3-door · MINI Cooper Convertible · MINI Convertible Stardust Edition · John Cooper Works · Cooper Oxford Edition · GP Inspired
- **★ 官网只公开 7 条价**：Countryman C ₹47,50,000 · All-Electric Countryman ₹55,65,000 · JCW Countryman ALL4 ₹66,15,000 · Cooper S Essential ₹44,45,000 / Classic ₹50,40,000 / JCW Trim ₹53,25,000 / Favoured ₹53,25,000
- **Convertible / Stardust / GP / Oxford 官网不标价**：其车型页零价格（只有 `₹39,999` 之类 EMI 数字，别当成车价）
- **★ 配置器在独立域 `configure.mini.in`**（`/en_IN/configure/U25/12GA/...`），但 **Playwright 渲染恒为 len=0**（title 有 `Configurator`，正文空）→ 拿不到 Convertible 价
- **价格格式**：印度 lakh `₹ 47,50,000`
- **燃油**：Cooper S / Countryman C / JCW Countryman ALL4 = `Gasoline`（页面明写 `Petrol`）；All-Electric Countryman = `BEV`

**交付结果**：`MINI_IN_官网价_20261015.xlsx`，**7 条**（3 车系 + Cooper S 4 trim）。

---

### VinFast（IN 印度 `vinfastauto.in/en`：**Cloudflare Managed Challenge，stealth + reload 可概率性通过**）✅

- **★ 封锁形态**：`curl` 全站 **403**（`robots.txt` 是唯一 200）；Playwright 默认也是 `Performing security verification / Ray ID …` 的 **Cloudflare 托管挑战**页。
- **★ 通过方法（本段最有价值）**：
  ```
  1) 用「更像真人」的 context：
     headless=False + --disable-blink-features=AutomationControlled
     init_script: 去 navigator.webdriver、覆写 plugins/languages、window.chrome={runtime:{}}
     locale='en-IN'、timezone_id='Asia/Kolkata'、1920x1080、
     headers: Accept-Language / sec-ch-ua / sec-ch-ua-platform
  2) 访问用 wait_until='commit'（**别用 networkidle，挑战页会一直跳**）
  3) 等 15–25s；若 body 仍含 'security verification' → `pg.reload()` 再等
     ✅ 通常**第 2 轮 reload 后通过**（实测概率性，需多试几次）
  ```
- **★ 价格为「空格分组」的印度格式**：`₹ 18 19 000`（= 1,819,000）——正则要写 `₹\s*([0-9\s]{5,20})`
- **★ 价格两处**：
  1. **车型页** `/en/vf6`、`/en/vf7`、`/en/mpv7`：起价
  2. **★ 官方订购站 `shop.vinfastauto.in/reservation?model=<X>`**：`Ex. Showroom Price` 即 trim 级价
     - ⚠ **`?model=MPV7` 无效**（页面回落成 VF 6，显示 ₹18 19 000）→ **正确参数是 `?model=VFMPV7`**
     - 切 trim 用 `locator('text="VF 7 Sky"').last.click(force=True)` 即可读到对应该 trim 的 Ex-Showroom 价
- **在售 3 车系 9 个配置**：
  | 车型 | 配置 | Ex-Showroom (₹) |
  |---|---|---|
  | VF 6 | Earth / Wind / Wind Infinity | 1.819.000 / 1.959.000 / 1.959.000 |
  | VF 7 | Earth / Wind / Wind Infinity / Sky / Sky Infinity | 2.299.000 / 2.589.000 / 2.639.000 / 2.749.000 / 2.809.000 |
  | VF MPV 7 | （单一配置，**无 trim 选项**） | 2.039.000 |
- **全系 `BEV`**；车系：VF 6(紧凑 eSUV) · VF 7(5 座 eSUV) · VF MPV 7(MPV)

**交付结果**：`VinFast_IN_官网价_20261015.xlsx`，**9 条**（3 车系 × 配置展开）。

---

### Honda Cars India（IN 印度 `www.hondacarindia.com`：**curl 直通，有官方 JSON API，但只到车系起价**）⚠️ 起价

- **站点**：✅ 200，**Next.js（SSG）+ Imperva/Incapsula**（`visid_incap_*` cookie）；curl 直通，无需绕。
- **★ 官方 JSON API（关键）**：`https://www.hondacarindia.com/api/...`，全部 curl 可取，无需鉴权：
  | 端点 | 内容 |
  |---|---|
  | **`GET /api/getAllCarsData`** | **5 车系最低配**：`carModelName / carModelPrice / carModelTrim / carModelVarient / carModelFuelType / carModelTransmissionType / carModelId` |
  | `POST /api/getCarPrice`（body `{carID, city:"Delhi"}`） | ⚠ **只返回该车系起价** `P_Price`（RTO/保险全为 0），**不分变体** |
  | `GET /api/getOfferCars` | 仅列出有 offer 的车系 |
- **★ 结论：官网只公开「车系起价（= 最低配）」**。车型页只有一句 `Starts at ₹ 11 80 000*`；`/check-price` 页同样是 5 条起价。变体明细在官网**不公开**（check-price 工具要选城市，且返回的是 on-road 价，不是 ex-showroom）。
- **在售 5 车系（起价 ex-showroom）**：
  | 车型 | 最低配 | 起价 (₹) | 燃油 |
  |---|---|---|---|
  | New City | SV MT Petrol | 1.199.900 | Petrol |
  | New Amaze | V MT Petrol | 765.400 | Petrol |
  | Amaze – 2nd Gen | S MT Petrol | 697.700 | Petrol |
  | All New ZR-V | ZRV | 4.999.900 | e:HEV |
  | New Elevate | SV MT Petrol | 1.180.000 | Petrol |
- **辅助线索**：车型页 Schema.org 有 `AggregateOffer`（Amaze `lowPrice 740800 / highPrice 1097900`；Amaze 2G `697700 / 966000`）与 `Offer.price`（Elevate `1180700`）—— 可作**价格区间**参考，但**不是变体明细**
- **价格格式**：**空格分组** `₹ 11 80 000`（同 VinFast）
- **燃油**：`Petrol` → `Gasoline`；`e:HEV`（ZR-V）→ `HEV`

**交付结果**：`Honda_IN_官网价_20261015.xlsx`，**5 条**（5 车系 × 最低配起价）。

---

### BYD India（IN 印度 `www.bydautoindia.com`：**React SPA 空壳，Playwright 可渲染，价格 SSR 在车型页**）✅

- **站点**：✅ 200，**nginx/1.18（Ubuntu）+ React CRA**（`/static/js/main.*.js`）；**curl 只拿到 6.5 KB 空壳**（`<div id="root">`）→ **必须 Playwright 渲染**（有头，无需 stealth，无 Cloudflare）
- **在售 4 车型**：`/bydatto3`(SUV) · `/bydemax7`(MPV) · `/bydseal`(轿车) · `/bydsealion7`(SUV)
- **★ 价格就在车型页**：渲染并滚到底后，每个变体一个卡片，文案形如
  ```
  DYNAMIC ₹ 24 99 000* (Ex-showroom price) … PREMIUM ₹ 30 35 000* … SUPERIOR ₹ 34 49 000*
  ```
  首页只显示 `₹ 24.99 Lakh Starting Price`（**Lakh 记法**），车型页才是 `₹ 24 99 000`（**空格分组**）
- **14 个配置**：
  | 车型 | 配置 | Ex-showroom (₹) |
  |---|---|---|
  | ATTO 3 | DYNAMIC / PREMIUM / SUPERIOR | 2.499.000 / 3.035.000 / 3.449.000 |
  | eMAX 7 | COMFORT 6座 / COMFORT 7座 / SUPERIOR 6座 / SUPERIOR 7座 | 2.790.000 / 2.830.000 / 2.930.000 / 2.990.000 |
  | SEAL | DYNAMIC / PREMIUM / PERFORMANCE | 4.150.000 / 4.620.000 / 5.365.000 |
  | SEALION 7 | DYNAMIC / PREMIUM / PREMIUM(Rich Tan) / PERFORMANCE | 4.190.000 / 4.990.000 / 5.060.000 / 5.590.000 |
- **全系 `BEV`**；⚠ SEAL 页标 `Model Year 2025`（是官网唯一年款线索）
- **价格格式**：`₹ 24 99 000`（空格分组 lakh）

**交付结果**：`BYD_IN_官网价_20261015.xlsx`，**14 条**（4 车型 × 配置展开）。

---

### Toyota Bharat（IN 印度 `www.toyotabharat.com`：**本站直通，但价格全在后端 API + SafeLine WAF，需「浏览器内 fetch」**）✅ 满配

- **站点**：门户 ✅ 200（Azure，`ARRAffinity` cookie）。**但价格不在门户页上** —— `/pricelist/` 是个「选州→选市→选车型→出价」的表单，curl/渲染后 3 个下拉全是空的。
- **★ 真源（关键）**：价格走独立 API 域 **`https://webapi.toyotabharat.com/1.0/api/...`**（从 `static3.toyotabharat.com/js/forms/api.pricelist.ob.js` 里挖出，端点清单见下）：
  | 端点（全 **POST**） | 内容 |
  |---|---|
  | `1.0/api/price/models` | **13 车型** + `Id` + `EffectiveDate` |
  | `1.0/api/pricestates` | 33 个州 |
  | `1.0/api/pricestates/{stateId}/pricecities` | 城市 |
  | `1.0/api/businesscities/{cityId}/websalesdealers` | 经销商（拿 `dealerId`） |
  | **`1.0/api/price/list/{dealerId}/{priceModelId}`** | **★ 该车型全变体价格表（XML）** |
- **★ WAF 陷阱（本节最有价值）**：该 API 域有 **SafeLine WAF**（返回 `.safeline` 拦截页），**curl 直连 100% 被拦**。**解法 = 在 Playwright 里打开主站后，用页面上下文 `fetch()` 调 API**（同源策略无关，关键是带上浏览器指纹）：
  ```python
  pg.goto('https://www.toyotabharat.com/pricelist/')
  r = pg.evaluate("""async (url)=>{ const r=await fetch('https://webapi.toyotabharat.com/'+url,
       {method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'}}); return await r.text(); }""", path)
  ```
- **★ 价格 XML 结构**：`<Price><PriceGrade><PriceModel><Name>车系</Name></PriceModel><Name>变体名</Name><FuelType>P/D/C/H/E</FuelType><Details>变速箱</Details></PriceGrade><Amount>价格</Amount></Price>`
  - 燃料码：`P`=Petrol · `D`=Diesel · `C`=CNG · `H`=Hybrid · `E`=Electric
- **★ 必须过滤「颜色加价」条目**：原始 146 条里有 **68 条是车身颜色加价**（变体名带 `[Platinum White Pearl]` / `[Xxx Dual Tone]` / `[Xxx x Midnight Black]` / `[Xxx with Bluish black roof]`，价格 +20,000）→ **按"不含选装"剔除**；⚠ 但 `[7S]`/`[8S]`（Innova Hycross 座位数）、`[LE]` 是**真实配置差异，要保留**。剔除后 **89 条**
- **13 车系 89 变体**：Glanza(13) · Urban Cruiser Taisor(10) · Rumion(8) · Urban Cruiser Hyryder(11) · Urban Cruiser Ebella(1, BEV) · Innova Crysta(11) · Innova Hycross(13) · Fortuner(6) · Legender(3) · Camry(2) · Vellfire(4) · Land Cruiser 300(4) · Hilux(3)
- **口径**：**Ex-Showroom**（按 **Delhi / dealerId=97** 取的官方价；印度 ex-showroom 全国基本一致）
- **年款**：API 有 `EffectiveDate`（价格生效日，如 Glanza `14th Oct 2026`）→ ⚠ **那是价格生效日、不是年款**，按规则写「官网无年款」

**交付结果**：`Toyota_IN_官网价_20261015.xlsx`，**89 条**（13 车系 × 变体，已剔除颜色加价）。

---

### Ford India（IN 印度 `www.india.ford.com`：**已退出印度新车市场，官网是纯售后站**）❌ 无数据

- **站点**：门户 curl **403（AkamaiGHost）**，但 **Playwright 有头 200**；内容**全是售后**：Owner Dashboard / Service & Maintenance / Genuine Ford Parts / Ford Protect / Roadside Assistance / SYNC Support / Careers / CSR。
- **★ 三条决定性证据**：
  1. **sitemap 全量只有 29 条 URL**，**无一个车型页或价格页**（全是 `owner/*`、`service-booking`、`locate-dealer`、`about-ford/*`）
  2. 首页与全站文本里 **EcoSport / Endeavour / Figo / Aspire / Freestyle 等车型词 0 命中**，`price`/`₹`/`Lakh` 也 0
  3. **官方新闻稿实锤**（`/about-ford/media/newsroom/2021/ford-restructures-india-operations.html`）：**2021-09-09 宣布退出印度市场、停止本地整车制造**，明写 *"Sales of current products such as Figo, Aspire, Freestyle, EcoSport and Endeavour will cease once existing dealer inventories are sold."*；2022-08 把 Gujarat 工厂卖给 **Tata Motors**；此后只做「服务网络 + 零件进口分销 + 延保」
- **归类**：与 **Chevrolet 泰国**同类 —— **「品牌已退出该市场新车销售」**，官网无车型无价格，**无数据**

**交付结果**：无（品牌已退出印度新车市场）。

---

### Volkswagen India 大众印度（`www.volkswagen.co.in`：AEM + feature-app 微前端，**变体价藏在 MOFA BFF**）✅

**结论：curl 全通（Akamai，无封锁）；车型页的变体价格区（`#MOFA`）是懒加载的 feature-app 微前端，curl **拿不到**，必须 Playwright 滚动触发，拦截 `mofa.feature-app.io/bff/model-overview` 响应。实测交付 28 条。**

| 项 | 内容 |
|---|---|
| 连通性 | ✅ `www.volkswagen.co.in` curl **200**（Akamai `edgesuite.net`），robots.txt/sitemap 均通 |
| 站点性质 | **Adobe AEM**（`/etc.clientlibs/clientlibs/vwa-ngw18/...`）+ **feature-hub 微前端**；页面嵌 `<script id="spaModel">`（AEM JSON，**无价格**）、`x-feature-hub/serialized-states` |
| **★ 车型清单** | `https://www.volkswagen.co.in/en/models.html` 卡片里 `From ₹xx,xx,xxx.00`；链接 7 个：`taigun` `tayron` `tiguan-r-line` `virtus` `virtus-chrome` `virtus-sport` `golf-gti`（`sitemap.html` 同）|
| **★ 变体价格真源（核心）** | 车型页有 `id="MOFA"` 锚点（Model Overview Feature App）。滚动触发后浏览器发出：`GET https://v1-<ver>.mofa.feature-app.io/bff/model-overview?cacheBuster=1&countryCode=IN&currency=INR&dataVersion=<hash>&language=en&serviceConfigEndpointToken=<token>` |
| ⚠ **该 API 不能直接 curl** | 缺参数逐个报错：`language` → `dataVersion` → **`serviceConfigEndpointToken`**（token 由平台注入，无法手搓）→ **不要硬拼，直接 Playwright 拦截响应** |
| **★ 树形结构** | `payload.models[]`（carline）→ `children[]`（**trim**）→ `data.referenceModel.prices.price1.{value,formattedValue,displayValue}` = **Ex-showroom 价**；`data.engines[].engineTypes/gearTypes` = 发动机/变速箱 |
| **★ 记录变体名 + 价（示例 Taigun 11 条）** | Comfortline 1.0L TSI MT 10,99,900 / Highline MT 12,99,900 / Highline AT 14,09,900 / Highline Plus MT 14,41,900 / Highline Plus AT 15,56,900 / Topline MT 16,21,900 / Topline AT 17,37,900 / GT Line MT 14,71,900 / GT Line AT 15,86,900 / GT Plus Chrome 1.5L 19,16,900 / GT Plus Sport 1.5L 19,46,900 |
| **★ 哪些页有 MOFA** | **只有 `#MOFA` 的页面才有**：`taigun` `tayron` `virtus-chrome` `virtus-sport`。`tiguan-r-line` `golf-gti` `virtus` **无 MOFA**（单变体），价格直接写在页内 `"technicalData":[{"key":"Ex-showroom Price:","value":"₹ 47 11 013*"},{"key":"Engine","value":"2.0L TSI "},...]` |
| **★ 拦截时的过滤陷阱** | 用 `'model-overview' in url` 会**误抓同名 JS bundle**（`model-overview-umd.js`）→ 必须用 `'.feature-app.io/bff/' in url` 且响应体 `lstrip().startswith('{')` |
| **★ 抓取可靠性** | 同一脚本跑两遍，`virtus/tiguan-r-line/golf-gti` 会随机 MISSING（响应时机不稳）→ **脚本要有重试/逐页串行 + 充分滚动（wheel ×8）** |
| **⚠ 页面上的「From」/首页价 ≠ 本任务口径** | 首页 `volkswagen.co.in` 的车型卡片是**促销口径**（`Taigun Chrome **Offer price** ₹ 10 58 300`、`Taigun Sport **Price starting** ₹ 14 32 748`、`Tayron R-Line **Introductory** ₹ 46 99 000`），比 Ex-showroom **低**；**models 页的 `From ₹…` 和 MOFA 的 `price1` 才是 Ex-showroom（本任务取这个）**。例：Tayron R-Line MOFA/车型页 **₹47,74,000**，首页 Introductory ₹46,99,000 → 取前者 |
| **★ 车系结构（官网把同车系拆成多条 product line）** | `The new Taigun`（11 trim，含 GT Line/GT Plus Chrome/GT Plus Sport）· `Tayron`（Life / R-Line）· `Virtus Chrome`（Comfortline→GT Plus，9 trim）· `Virtus Sport`（GT Line / GT Plus Sport，4 trim）· `Tiguan R-Line`（1）· `Golf GTI`（1）。⚠ `virtus.html` 只是系列落地页、**无价**，别当成独立车型 |
| **★ 燃料** | 全系 **Gasoline**（1.0L/1.5L/2.0L TSI，无柴油无电动在售）|
| **★ 价格格式** | 印度 **lakh 分组**：官网 `formattedValue` = `₹10,99,900.00` → 入表 `10,99,900`（去 `₹` 与 `.00`）|
| 年款 | 全站**未标 MY/年份** → 一律「官网无年款」（2026 Taigun facelift 只在新闻里叫 2026，官网不写）|

> 📌 **通用教训**：**AEM / feature-hub 站点的「变体价格」区常是一个懒加载 feature-app，服务端 HTML 里空空如也**。判别：页面有 `id="XXX"` 锚点 + `CmsFeatureAppLoader` + 「Loading」占位。动作：**Playwright 打开 → 反复 wheel 滚动到锚点 → 拦截 `*.feature-app.io/bff/*` 的 JSON 响应**（别去拼它的 token）。

---

### BMW India 宝马印度（`www.bmw.in`：**IPv6 全断 / IPv4 时通时断，只能浏览器**；价格全在 all-models 卡片）✅

**结论：curl（含 `-4`）时通时 000，Playwright 稳定 200。价格不打在车型页，**只在 `/en/all-models.html` 的卡片里**。实测交付 23 条。**

| 项 | 内容 |
|---|---|
| ⚠️ **连通性（关键）** | `www.bmw.in` 解析出 Akamai `e25631.dsca.akamaiedge.net`，**`getent hosts` 只给 IPv6（2600:140b:…）→ curl 默认走 v6 直接 000**；`curl -4` **偶尔 200、多数 000**；**Playwright 每次 200** → 直接上浏览器，别在 curl 上耗时 |
| 站点性质 | BMW 自研 **"crx3" 平台**（响应头 `x-vhost: publish`、`baqend-tags: crx3composite,bmw/marketIN/bmw_in/...`）|
| **★ 价格唯一入口** | `https://www.bmw.in/en/all-models.html`（页面带 `?series=` `?bmwM=yes` 筛选）。⚠ **车型详情页（如 `bmw-7-series-sedan.html`）一个 ₹ 都没有**，别去详情页找价 |
| **★ 卡片选择器** | 根节点 `.cmp-allmodelscard__root`（26 个）|
| **★ 字段映射** | `.cmp-allmodelscarddetail__body-type`（Sedan/SUV/Coupé/Cabrio/Gran Coupé）· `__series`（**车系名**：`i7` `i5` `i5 LWB` `M5` `X7` `X5` `X3` `X1` `X1 LWB` `7 series` `5 LWB` `4 series` `M4` `3 series` `3 LWB` `M2` `2 series`）· `__description`（`Models` / `M Model`）· `__fuelTypeText-text`（**Petrol / Diesel / Electric / Hybrid**）· `__usp-text`（`From ₹4,580,000`）· **`img[alt]` = 具体变体名**（`BMW X7 xDrive40i`、`330Li M Sport`、`The M5`）|
| **⚠ 价格筛选器是干扰项** | 页面左上有价格区间滑块，数字是 **lakh 分组**（`₹45,80,000` `₹73,41,700` … `₹2,11,50,000`）→ **那是筛选刻度，不是车型价**，别采。真车价全部是 **标准千分位** `₹4,580,000` |
| **★ 无价卡片要剔除** | 26 张里 3 张无 `From ₹`：`BMW M Concept Neue Klasse`（概念车）、`Vision BMW ALPINA`（概念车）、`The 7 Protection`（防弹车）→ 不入表 |
| **★ 燃料归类** | `Petrol`→`Gasoline`、`Diesel`→`Diesel`、`Electric`→`BEV`、`Hybrid`→**`PHEV`**（页面过滤器明确写 `Plug-in hybrid (1)`，即 M5 G90；不是 HEV）|
| **★ 交付清单（23 条）** | 2 series 218 M Sport 4,580,000 · 3 series M340i 7,780,000 · 3 LWB 330Li 6,270,000 / 320Ld 6,420,000 · 4 series M440i 11,065,000 · 5 LWB 530Li 7,700,000 · 7 series 740 M Sport 19,500,000 · M2 10,650,000 · M4 16,290,000 · M5 21,150,000 · i5 M60 11,950,000 · i5 LWB eDrive35L 7,960,000 · i7 50 xDrive 19,500,000 · X1 sDrive18d 5,290,000 · X1 LWB 4,990,000 · X3 30 xDrive 7,690,000 / xDrive20 7,690,000 / xDrive20d 7,820,000 · X5 xDrive40i 9,690,000 / xDrive30d 9,890,000 · X7 xDrive40i 13,490,000 / xDrive40d DPE 7 Seater 13,220,000 / xDrive40d 13,860,000 |
| **★ 口径** | 页面 disclaimer：`Ex-showroom prices inclusive of GST ... excludes Road Tax, TCS, RTO, insurance` → **Ex-showroom 含 GST**，符合 MSRP 口径 |
| **★ 车型覆盖** | 官网 all-models 只有这 23 个在售变体；**没有 iX / i4 / Z4 / X2 / X4 / X6**（全文关键词 0 命中）→ 不要凭印象补 |
| 年款 | 卡片不标 MY → 「官网无年款」|

> 📌 **通用教训**：**`getent hosts` 只返回 IPv6 时，curl 会静默 000**——先 `getent ahostsv4` + `curl -4`。若 v4 也时通时断（Akamai 多边缘 IP），**直接 Playwright**，别在 curl 上反复重试。

---

### Porsche India 保时捷印度（`www.porsche.com/middle-east/india/models/`：**Qwik 序列化状态内嵌，curl 直读**）✅

**结论：curl 200 直通，全量数据就在 HTML 里（HTML-escaped 的 Qwik `[0,value]` 结构），不需要浏览器、不需要 API。实测 5 车系 20 个变体。**

| 项 | 内容 |
|---|---|
| 连通性 | ✅ curl 200（Akamai `a299.g.akamai.net`），393 KB |
| **★ 页面框架** | **Qwik**（`q:` 属性 + `props="{&quot;...&quot;}"`）→ 数据是 **HTML-escaped 的类 JSON 序列化**，所有字段形如 `"key":[0,value]`，**不是标准 JSON，`json.loads` 会失败** |
| **★ 提取步骤（核心）** | ① `html.unescape(raw)` ② 正则 `"model":\[0,\{(.*?)\}\],"props"`（`re.S`）切出 20 个卡片块 ③ 块内逐字段正则 `'"%s":\[0,"([^"]*)"\]'` |
| **★ 字段清单** | `modelName`（变体名：`911 Carrera` / `Macan 4S Electric`）· `modelYear`（**2027 / 2026 / 2025**）· `modelRange`（**车系**：`911` `Taycan` `Panamera` `Macan` `Cayenne`）· `modelSeries`（`911 Carrera Model variants`）· `bodyType`（⚠ 有脏值如 `Macan Electric` `SUV Electric`，**别用**）· `wheelDrive` · `seats` · `fuelTypeText`（`Gasoline` / `Electric`）· `gearTypeText` · `price.value` + `price.formattedValue`（`From ₹2,11,29,000.00 incl. VAT`）· `powerHp.formattedValue` |
| **★ 价格正则** | `"price":\[0,\{"value":\[0,(\d+)\]` → 整数；展示用官网 `formattedValue` 的整数部分（**lakh 分组** `2,11,29,000`）|
| **★ 口径** | `incl. VAT`（印度 GST 含税）、`From ...` 起价 → 符合 MSRP，无促销价干扰 |
| **★ 交付分布（20 条）** | Cayenne 8 · 911 4 · Macan 4 · Taycan 3 · Panamera 1；Gasoline 12 / Electric 8；MY2027 18、MY2026 1（Macan 燃油）、MY2025 1（Macan Electric）|
| **★ 无 718** | 全文 `718` / `Boxster` / `Cayman` **0 命中** → 印度已停售，不要补 |
| **⚠ 别被语言/国家选择器链接淹没** | 页面里 `href=".../models/"` 有 40+ 条全是全球市场切换链接；真车型链接不在 `<a>` 里（是卡片 + 配置器 JS 路由），**直接解析 `modelCards` 数据即可** |
| 配置器 | 卡片对应 `porsche.com/middle-east/india/models/<range>/<model>/` 与 configurator，但价格已全在列表页，无需进配置器 |

> 📌 **通用教训**：**Qwik / Nuxt / Next 的「序列化状态」是绕过渲染的最佳入口**。Qwik 的特征是 `[0,value]` 这种 `[引用类型, 值]` 二元组 + HTML 实体转义（`&quot;`）。处理套路固定：**先 `html.unescape`，再用「对象块 + 字段」两级正则**，比硬解析 DOM 稳得多。

---

### Mercedes-Benz India 奔驰印度（`www.mercedes-benz.co.in`：**无头 403 / 有头 200**；价格在 **VMOS API**，接口本身可 curl）✅

**结论：站点无头浏览器 403、curl 全 000，但 `headless=False` + stealth + Mac UA 稳定 200。真正的价格不在页面，而在一套**可直接 curl 的公开 API**（`api.oneweb.mercedes-benz.com/vmos-api`）。实测 23 车系 / 31 条。**

| 项 | 内容 |
|---|---|
| ⚠️ **连通性（两段式）** | ① `www.mercedes-benz.co.in` curl **000**（Akamai）；headless Chromium **403**（body 仅 208 B）；**`headless=False` + `xvfb-run` + 去 `navigator.webdriver` + `window.chrome` + Mac UA → 200** ② **API 域 `api.oneweb.mercedes-benz.com` 反而 curl 200 直通**（只需 `Referer: https://www.mercedes-benz.co.in/`）|
| **★ 价格真源（核心）** | `GET https://api.oneweb.mercedes-benz.com/vmos-api/v1/data/IN/en/OWF/live?subContext=CONFIGURATOR`（95 KB）<br>`GET .../vmos-api/v1/data/IN/en/OWF/live/summary`（54 KB）<br>VMOS = Vehicle Model Overview Service；**IN = 市场，en = 语言，OWF = 渠道** |
| **★ 数据结构** | 顶层 `vehiclesData{}`（23 个车系）+ `cards{}`（25 个展示卡片）+ `groups`（`all` / `amg` / `maybach` / `new`）|
| **★ 车系对象** | `vehiclesData["c-class:saloon:W206"]`：`name`（`C-Class`）· `classId` · `bodytypeId`（`saloon` / `offroader`）· `modelSeries`（`W206`）· `bm4` · `technicalData.priceData` |
| **★ 价格结构（关键）** | `priceData` 的 key 是**品牌分组**（`all` / `amg` / `maybach` / `new`），每个分组内：`{value, formattedValue, filters:{PETROL:{value,formattedValue}, DIESEL:{...}, ELECTRIC:{...}, HYBRID:{...}}}`。**分组价 ≠ 燃料价**：如 C-Class `all`=6,120,000 但 `all.filters.DIESEL`=6,200,000、`amg`=9,405,000 |
| **★ 去重规则** | 同一车系多个 group 出现**同价**很常见（A-Class `all`=`amg`=8,700,000）→ 按 `(fuel, price)` 去重；只有 **C-Class 的 AMG 价（9,405,000）** 是真正独立的一条 |
| **★ 两条易混车系** | `EQS` 出现两次：`eqs-class:saloon-long:V297`（EQS 轿车 13,000,000）/ `eqs-class:offroader:X296`（EQS SUV 13,500,000）→ 都用 `bodytypeId` 区分；`G-Class` 两次：`N465`=电动 31,500,000 / `W465`=燃油（柴油 29,000,000、汽油 38,000,000）|
| **★ 燃料归类** | `PETROL`→`Gasoline`、`DIESEL`→`Diesel`、`ELECTRIC`→`BEV`、`HYBRID`→**`PHEV`**（S-Class / E-Class Sedan / Maybach S-Class 的 `tags` 均含 `phev`）|
| **★ 年款不要推断** | `vehiclesData` 里的 `modelYear` 是**内部销售代码**（`804` `805` `806` `807` `X24` `X25` `X26`），**不是年份** → 一律「官网无年款」|
| **★ 页面口径** | models.html 卡片只显示 `Starting from ₹X`（= 该车系 `priceData.all.value`，**最低动力价**），不显示燃料细分；`?group=amg` / `?group=maybach` 是官方品牌分组筛选 |
| **★ 交付分布（31 条 / 21 个车系名）** | 汽油 17 · 柴油 6 · 纯电 6 · 插混 3（S-Class 22,000,000 / E-Class Sedan 14,500,000 / Maybach S-Class 32,000,000）；价格区间 5,180,000（GLA 汽油）– 44,000,000（Maybach SL Monogram）|
| ⚠ 页面 SSR 干扰 | 车型页 HTML 里 `"Starting from ₹ ..."` 出现 48 次（导航 24 + 页面 24），其中 4 条是**分类聚合**（`All Limousines` `All SUVs` `All Coupés` `All Cabriolets / Roadsters`）→ 不要当车型 |

| **★ 变体级真源（2026-10-19 补充，优先用这个）** | `GET https://api.oneweb.mercedes-benz.com/owcc-backend/api/v3/en_IN/CCci/<configVersion>/entry?proposedStep=MOTORIZATION&typeClass=<型号>` → `motorizations.tiles[]`，每条含 **`name`（如 `CLA 200 Progressive Line` / `C 220d`）+ `priceInformation.basePrice.formattedPrice` + `tags[fuelType]` + `modelId` + `modelYear`**。⚠ **`proposedStep=MOTORIZATION` 是必需参数**（不加只返回 `startPage.preConfigs` 三个营销卡片，且会把同一车型重复两次）；参数大小写敏感，`motorization` 小写会回落成 start page。`configVersion` 从 `GET .../owcc-backend/api/v3/en_IN/CCci/version`（返回 8 位 hash，如 `2cfef53e`）拿 |
| **★ 实测 22 个 typeClass / 49 条 motorization** | `C174` CLA 3 · `W206` C-Class 4（C 200 / C 220d / C 300 / AMG C 43）· `V297` EQS 1 · `X254` GLC 2 · `W214` E-Class Sedan 2（AMG E53 Performance/Racing）· `V214` E-Class Long 3（E200/E220d/E450）· `X167` GLS 7（含 3 条 Maybach GLS）· `V167` GLE 5 · `C254` GLC Coupé 1 · `C167` GLE Coupé 1 · `H247` GLA 3 · `W177` A-Class 1 · `N465` G-Class EV 1 · `W465` G-Class 3 · `C192` AMG GT 2 · `Z223` Maybach S 1 · `Z296` Maybach EQS SUV 2 · `Z232` Maybach SL 1 · `C236` CLE Coupé 1 · `A236` CLE Cabriolet 1 · `X296` EQS SUV 2 · `V223` S-Class 2 |
| **★ 英国站（2026-10-20 补充）** | 市场路径为 **`en_GB/CCci`**（不是 `en-GB`，后者 404），`/version` 返回 `{"dataVersion":"d1b4c02f"}`（**是 JSON 对象，不是字符串**，与印度不同）。**`typeClass` 要剥掉 `-fl` / `-fl2` 后缀**：vmos 里 `X167-fl2` / `V167-fl2` / `W177-fl` / `C167-fl2` / `H247-fl` / `V223-fl` / `S206-fl` / `W247-fl` / `V447-fl2` 直接请求全部 404，改成 `X167` / `V167` / `W177` 才通 → **脚本写「原名 + 去后缀」双候选回退**。实测 36 个 series / **403 条** |
| **★ 英国站重名车系要按动力拆** | 7 组同名双 series（ICE 与 BEV 并存）：`G-Class`(W465/N465) · `GLA`(H247/H244) · `CLA`(C178/C174) · `GLC`(X254/X540) · `CLA Shooting Brake`(X178/X174) · `C-Class Saloon`(W206/W520) · `GLB`(X248/X244) → BEV 那支加 `Electric` 后缀（`CLA` / `CLA Electric`），否则会混成一堆看不出区别的型号 |
| **⚠ Maybach GLS 藏在 GLS 里** | `X167`（GLS）的 tiles 里混有 3 条 `Mercedes-Maybach GLS 600*`（27,500,000 / 30,700,000 / 41,000,000）→ 要按名称拆到「Mercedes-Maybach GLS」车系，否则 GLS 会虚增。**英国站同理**：`X167` 6 条里含 1 条 `Mercedes-Maybach GLS 680 4MATIC`（£179,995）|
| **⚠ 同价同型要区分** | `W465` 有 `Mercedes-AMG G 63` 与 `Mercedes-AMG G 63 Offroad Pro` **同为 38,000,000**（不同型号）；`GLS 450 4MATIC Night Edition` 官网 tag 反而写 **Diesel**（名字漏了 d），**按官网 tag 落表** |

> 📌 **通用教训**：**「站点难进」不代表「数据难拿」**。Mercedes 这种大厂站，页面被 Akamai 掐死，但它的**前端数据服务（VMOS / oneweb）往往独立部署、无鉴权、可直连**。动作顺序应是：**先 Playwright 过一次（拿到 XHR 清单）→ 再把 XHR 里的 API 拎出来直接 curl**，不要一直在页面上硬啃。

---

### Bentley India 宾利印度（`www.bentleymotors.com/in/en.html`：**官网全站不标价，印度站仅经销商页**）❌

**结论：不是反爬问题，是产品策略——Bentley 全球官网都不公开车型价格，CTA 一律 "Enquire to buy"。印度站更是只有 3 家经销商地址。无数据可采。**

| 项 | 内容 |
|---|---|
| 连通性 | ⚠️ curl 全 **403**（Akamai "Access Denied"）；**headless Chromium 403、`headless=False` 200**（与 Mercedes 相反）|
| **★ 印度站实况** | `/in/en.html` 正文仅 **3,149 字符**：品牌故事 + **Mumbai / Bengaluru / Delhi 三家经销商**地址电话，**0 个价格**；`/in/en/models/*` **全部 404** |
| **★ 全球车型页也无价** | `/en/models/bentayga.html`（413 KB）与英国站 `/uk/en/models/bentayga.html`（418 KB）→ **`₹` `£` `$` 全部 0 命中**，页面只有配置/油耗/CO₂ |
| **★ 配置器也无价** | `/en/misc/car-configurator.html/select/bentayga` 可进配置流程，但 **0 个金额**，按钮为 **`Enquire to buy`** |
| **★ 配置器后端实锤** | `GET https://sdl.bentleymotors.com/bentley/api/cc2/brandmaster/models?language=en&role=public&country=<token>` → 7 个 section（Torcal / Bentayga / Bentayga EWB / Flying Spur / Continental GT / Continental GTC / Supersports），**全部 `priceVersion: null`**（无价格版本）|
| ⚠️ **country 参数是加密 token** | 传 `IN` / `GB` / `US` / `DE` / `JP` / `KR` / `CN` 一律返回 **16,371 B、0 section**；只有浏览器下发的 **`GZGBZGB`** 才返回 7 section → **不能用国家代码直接切市场**，别在这上面浪费时间 |
| **★ 国家选择器不含印度** | 只有 **United Kingdom / China / Japan / Germany / United States / South Korea** 六个市场；印度不在配置器覆盖范围 |
| 在售车型（仅供参考，无价） | Torcal · Bentayga · Bentayga EWB · Flying Spur · Continental GT · Continental GTC · Supersports · Mulliner（定制）· Bentley Hybrids · Concept Cars · Pre-Owned |
| **判定依据（四条独立证据）** | ① 印度站正文 0 价格 ② 全球+英国车型页 `₹/£/$` 0 命中 ③ 配置器 CTA 为 Enquire to buy ④ 配置器 API `priceVersion: null` |

> 📌 **通用教训**：**超豪华品牌（Bentley / Rolls-Royce / Ferrari 部分市场）常采用「官网不标价、只接受询价」策略**。判别顺序：① 车型页有没有货币符号 ② 配置器 CTA 是不是 "Enquire" ③ 配置器后端 `priceVersion` 是否为 null。三条都中 → **立即判定「官网不公开价格」，不要再去挖 API**。
