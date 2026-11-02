# 泰国 TH — 站点坑位详段

> 市场码 TH · 12 段 · 品牌：GWM 长城 / Nissan / Mitsubishi / Subaru / Denza 腾势 / Volvo / Isuzu / Chevrolet / Tata Motors / Tesla / Maserati / McLaren
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-10-30 · 文中 snapshotVersion / token / 车型 id 均为当时实测值，必须现取

---

### GWM 长城（TH 泰国 `www.gwm.co.th`：**全通，价格可直接 curl，一次成功**）✅

**结论：车型页服务端渲染，价格就在内联 HTML 里；26 条数据一次采齐。是「东南亚皮卡/SUV 站」的最佳采样对象。**

| 项 | 内容 |
|---|---|
| 连通性 | ✅ 主站 301 → `/en`；Fastly `199.232.163.10`（`adobe-aem.map.fastly.net`）；`robots.txt` 200 |
| **★ 车型页 URL** | `https://www.gwm.co.th/en/models/<slug>` —— **服务端渲染**，价格直接在内联 HTML，**无需 JS、无需浏览器** |
| **★ 价格提取结构（bs4）** | 代码见本节末尾「GWM 价格提取（bs4）」代码块 |
| **⚠ 解析三坑** | ① `find_all(..., recursive=False)` **会返回空**（层级不符），**不要限制层级**<br>② `dd.find_all('span', class_='option')` 返回空（option 不在 `.dropdown` 内）→ 改用 `area.find_all(...)`<br>③ 价格可能带空格 `฿ 949,000` → 需 `re.sub(r'\s+','',p)` |
| **★ 顺序对应** | `options-list` ↔ `color-group-list > button-group` **顺序一一对应**，直接 zip 即可 |
| **★ 交叉验证** | 用 `data-car-img` 路径段（`4wd-black-ultra`/`2wd-black-pro`/`singal-cab-s`/`singal-cab-l`）核对版本↔价格配对 |
| **★ slug ≠ 车系名（重大陷阱）** | 见下表。**同一车系燃油版/柴油版是两个 slug**，且 URL 里的 `-diesel` 与**不带**后缀的关系常常反直觉 |
| **★ 官方 PDF 规格表** | 全部在 `/content/dam/gwm/pages/th/en/model/...`（用 `urllib.parse.quote` 处理空格）。PDF **只有规格没有价格**，但**是判定燃油类型的权威依据** |
| 后端 API | `https://cms.gwm.co.th/prod-api/...`（CloudFront `18.66.102.80`）→ `/prod-api/system` **401**（需鉴权，未使用）；`mall.gwm.co.th`（订购站）存在 |
| sitemap | 仅 2 条（无用）；models 总览页是 JS 渲染 |

**GWM 价格提取（bs4）**

```python
area = s.find('div', class_='switch-area')
opts = [o.get_text(strip=True) for o in area.find_all('span', class_='option') if o.get_text(strip=True)]
cgl = area.find('div', class_='color-group-list')
for g in cgl.find_all('div', class_='button-group'):
    for it in g.find_all('div', class_='btn-item'):
        p = it.get('data-title')          # "฿1,229,000"
        img = it.get('data-car-img','')   # 版本图，用于交叉验证
```

**★ slug ↔ 车系 ↔ 燃油 对照表（本页 10 个有效 slug）**

| slug | 官网车型名称 | model dir | 燃油 | PDF 佐证 |
|---|---|---|---|---|
| `poer` | POER | `poer` | **Diesel** | `POER 2.4T PRO SINGLE CAB AUTO -EN-9.1.pdf` |
| `sahar` | **POER SAHAR HEV** | `poer-sahar` | **HEV** | `GWM POER SAHAR HEV_EN.pdf`（2.0T HEV PRO/ULTRA DOUBLE CAB）|
| `sahar-diesel` | **POER SAHAR DIESEL** | `poer-sahar-diesel` | **Diesel** | `GWM POER SAHAR DIESEL_EN.pdf`（2.4T）|
| `haval-h6` | HAVAL H6 | `haval-h6-hev` | **HEV / PHEV** | HEV PRO + PHEV PRO + PHEV ULTRA（同页混版）|
| `ora-5-ev` | ORA 5 EV | `ora-5/bev` | **BEV** | `ORA 5-EN.pdf` |
| `tank-300` | **TANK 300 HEV** | `tank-300-hev` | **HEV** | `Tank 300 HEV-eng 9.1.pdf` |
| `tank-300-diesel` | **TANK 300 DIESEL** | `tank-300-diesel` | **Diesel** | `TANK 300 DIESEL_EN.pdf`（2.4T）|
| `tank-500` | **TANK 500 HEV** | `tank-500-diesel` | **HEV** | `TANK 500 DSL + HEV ENG 9.1.pdf`（**同一 PDF 含 DIESEL+HEV 两栏**）|
| `tank-500-diesel` | **TANK 500 DIESEL** | `tank-500-diesel` | **Diesel** | 同上 |
| `wey-g9` | WEY G9 | `wey-g9` | **PHEV** | `eng_wey_g9.pdf`（Hi4 = 插混四驱）|

> **⚠ 最容易踩的雷**：`tank-300` / `tank-500`（不带后缀）**是 HEV 版，不是汽油版**；`sahar`（不带后缀）**是 HEV，不是柴油**。只凭 slug 字面推断燃油 = 必然出错。**必须用 PDF 的 `Type:` 行或 `GWM TANK 300 HEV` 标题字段确认**。
>
> **⚠ 另一个坑**：`tank-500` 页与 `tank-500-diesel` 页的 `data-car-img` 都指向 `tank-500-diesel/` 目录 —— **不能靠图片目录判燃油**，得看版本名（HEV 版只有 PRO/ULTRA 两版；DIESEL 版有 BLACK WARRIOR/ULTRA/PRO 五版）。
>
> **⚠ 车名需自造区分**：官网两页车名都写 "GWM TANK 500" / "POER SAHAR"，交付时须在「官网车型名称」列补上 HEV / DIESEL 以免重名混淆（如 `POER SAHAR HEV` / `POER SAHAR DIESEL`）。

**交付结果**：`GWM_TH_官网价_20261010.xlsx`，26 条（10 slug × 版本展开）。

---

### Nissan（TH 泰国 `www.nissan.co.th`：**全通，价格在内联 JSON，curl 直读**）✅

**结论：AEM（HELIOS）站点，价格数据以 JSON 形式内联在 HTML 的 `<script>` / `<iframe>` 里，纯 curl + 正则/bs4 即可取全，无需浏览器。**

| 项 | 内容 |
|---|---|
| 连通性 | ✅ 200（CloudFront `eb20e7a8...cloudfront.net`，`x-cache: Hit`）；无封锁 |
| **★ 真源 ①（全车系价格页）** | `https://www.nissan.co.th/vehicles/all-grade-price.html`（英文版 `en.nissan.co.th/...` 同结构）页内嵌 `const data = {languages:{th:{models:[...]}, en:{...}}}` —— 每个 `models[].versions[]` 含 `{name, price}`。**用括号配平从 HTML 里切出该 JS 对象，再交给 node 解析**（是 JS 字面量、含单引号，不能直接 `json.loads`） |
| **★ 真源 ②（每车型页）** | 任意车型页 `<iframe id="individualVehiclePriceJSON">` 内联 JSON：`{<model>:{Retail:{grades:{<gradeKey>:{versions:{<verKey>:price}}}}}}` |
| ⚠ 常见坑 | 页内还引用了 `/content/nissan_prod/th_th/.../jcr:content.proxy.json`，**但直连 404**（Apigee `Unable to identify proxy for host: https_vhost_sslrouter`）→ **必须从页面 HTML 内联内容取，不要直连 json 路径** |
| ⚠ `all-grade-price` 不含 Terra | 该页 `data` 只有 **6 车系**（Almera / Kicks e-POWER / X-Trail e-POWER / Serena / Serena e-POWER / Navara）；**Terra 需从 `/vehicles/new-vehicles/new-terra.html` 的 `individualVehiclePriceJSON` 单独取** |
| ⚠ 排除项 | `almera-stylish-package.html` 是 **Almera 的配件套件**（泰文标题 `ชุดแต่ง STYLISH PACKAGE`），价格与 Almera 完全相同 → **非独立车型，不列** |
| **★ 在售车系（7）** | ALMERA · KICKS e-POWER · X-TRAIL e-POWER · SERENA · SERENA e-POWER · NAVARA · TERRA |
| 燃油字段 | Schema.org `fuelType`：Almera/Kicks/X-Trail/Serena 均 `เบนซิน`（汽油）；Navara/Terra `ดีเซล`（柴油）。Almera 内联还有 `versionPowertrainType:"เบนซิน"` |
| **★ e-POWER 归类** | 发动机 `fuelType=Gasoline` + 驱动为 `AC3 Synchronous Motor`（同步电机）、**不可外接充电** → 归 **HEV**（非插电式混合动力） |
| **★ SERENA 归类** | 官网标注 `ระบบ S-HYBRID (Mild Hybrid)`（Smart Simple Hybrid，发动机+启停/辅助电机）→ 归 **MHEV** |
| 版本名脚注 | 版本名尾部带 `*` / `**` / `*** / ****` 免责标记，**交付时须清理**（`re.sub(r'\s*\*+(\s*/\s*\*+)*\s*$','',s)`） |

**交付结果**：`Nissan_TH_官网价_20261011.xlsx`，**27 条**（7 车系 × 版本展开）。

---

### Mitsubishi（TH 泰国 `www.mitsubishi-motors.co.th`：**全通，价格表 SSR 直读**）✅

**结论：价格表页服务端渲染，表格 HTML 直接可解析；官网同时提供泰文 `/th/` 与英文 `/en/` 两版，英文版版本名更规范。**

| 项 | 内容 |
|---|---|
| 连通性 | ✅ 200（nginx + Varnish/Fastly，`x-served-by: cache-nrt-...`）；`robots.txt` 正常 |
| ⚠ 站点很慢 | 单页 1–1.6 MB，**单次 curl 可达 200s+**；批量抓多页务必后台跑 |
| **★ 真源** | `https://www.mitsubishi-motors.co.th/th/buy/all-models-price`（英文版 `/en/buy/all-models-price`）—— 标题「ราคารถทุกรุ่น / All models price」 |
| **★ 解析结构** | 每个车系 = `<h3>车系名</h3>` + 紧随的 `<table>`，行 `<tr><td>GRADE/版本</td><td>价格 BAHT</td></tr>`；用 bs4 `find_all_previous(['h1'..'h6'])` 给每个 table 配标题 |
| ⚠ 价格脏字符 | 价格单元格含 `\xa0`（nbsp）/ `\u200b`（零宽空格）→ 取数字前先 `re.sub(r'[^0-9]','',s)` |
| **★ 英文版优先** | `/en/buy/all-models-price` 版本名是规范英文（`SINGLE CAB 2.4 PRO 4WD AT`），泰文版是泰文；两版**价格完全一致**。⚠ 个别措辞有差异（泰文写 `SINGLE CAB 2.4 PRO`，英文写 `SINGLE CAB 2.4`）—— 属官网双语差异 |
| **★ 车系 ↔ 表格标题映射** | 一个车系可能拆成多张表：`TRITON ATHLETE` / `TRITON SINGLE CAB 4WD` / `TRITON DOUBLE CAB PLUS` / `TRITON 2WD` → 都归车系 **TRITON**；`NEW PAJERO SPORT ELITE EDITION` + `PAJERO SPORT` → 都归 **PAJERO SPORT** |
| **★ 在售车系（6）** | XPANDER HEV · XPANDER CROSS HEV · XFORCE HEV · TRITON · PAJERO SPORT · MIRAGE |
| 燃油佐证 | 车型页：TRITON `เครื่องยนต์ดีเซลคอมมอนเรล 2.4ลิตร`（2.4L 共轨柴油）；PAJERO SPORT `HYPER POWER 184 แรงม้า`（2.4 柴油，与 Triton 同动力）；MIRAGE `เครื่องยนต์เบนซิน DOHC MIVEC 1.2 ลิตร`（1.2L 汽油）+ `fuelType:"เบนซิน"`；XFORCE/XFANDER `ขุมพลังไฮบริด`（混动） |
| **燃油分类** | XPANDER HEV / XPANDER CROSS HEV / XFORCE HEV → `HEV`；TRITON / PAJERO SPORT → `Diesel`；MIRAGE → `Gasoline` |

**交付结果**：`Mitsubishi_TH_官网价_20261011.xlsx`，**21 条**（6 车系 × 版本展开）。

---

### Subaru（TH 泰国 `www.subaru.asia/th/en/`：**全通，价格 SSR 直读**）✅

**结论：区域门户站（Azure Front Door），车型页价格纯 HTML 可读；⚠ 用户常见入口 `/th/en/home/` 已 404，正确入口是 `/th/en/`。**

| 项 | 内容 |
|---|---|
| 连通性 | ✅ 200（Azure Front Door `mr-a03.tm-azurefd.net`）；无封锁 |
| ⚠ URL 陷阱 | `https://www.subaru.asia/th/en/home/` → **404**；`https://www.subaru.asia/th/en/` → 200。裸域 `https://www.subaru.asia/` → 会 **302 跳到 `subaru.cn`（中国站）**，别从根域进 |
| **★ 真源** | 车型页 `https://www.subaru.asia/th/en/<model>/`（如 `/forester/`、`/wrx/`），**服务端渲染**。版本卡片结构：`<img alt="WRX 2.4 6MT">` 后跟 `<div>版本名</div> … THB 3,309,000*` |
| **★ 提取法** | 正则 `THB\s*([0-9][0-9,\.]+)`，再向前取最近的 `alt="版本名"` / 卡片标题配对。首页只给 5 款「From THB」起价，**完整版本必须进车型页** |
| **★ 在售车系（5）** | FORESTER · CROSSTREK · WRX · WRX WAGON · BRZ |
| ⚠ OUTBACK 已下架 | `/th/en/outback/` → **302 跳回 `/th/en/`**（页面不存在）；导航仍残留菜单项但无页无价 → **不采**。`/th/en/solterra/` → **404**（泰国无此车） |
| ⚠ 同车双路径 | `/forester/` 与 `/forester-2025/` 内容与价格相同（同车），取一个即可 |
| 燃油 | 全系 `Gasoline`（Forester 2.5 NA / Crosstrek 2.0 NA / WRX 2.4 Turbo / WRX Wagon 2.4 Turbo / BRZ 2.4 NA）。⚠ Crosstrek 页 meta 里出现 `e-Boxer` 字样，但正文与价格表只有 2.0i 汽油版 → **不按 MHEV 计** |

**交付结果**：`Subaru_TH_官网价_20261011.xlsx`，**9 条**（5 车系 × 版本展开）。

---

### Denza 腾势（TH 泰国 `www.denzathailand.com/en`：**全通，但官网无独立价格页，价格藏在促销活动条款里**）⚠️ 可采

**结论：官网（Rêver Automotive 代理，Next.js/RSC）没有车型价格页，`ราคาจำหน่าย`（售价）只写在 news-promotions 的活动条款正文中。可采，但取数路径特殊。**

| 项 | 内容 |
|---|---|
| 连通性 | ✅ 200（Google Frontend / GCP）；`robots.txt` 全允许 |
| 站点性质 | Next.js **App Router（RSC 流式）**。⚠ `/en/models` 是 **404**（sitemap 里有但实际不可用）；`/en/models/denza-d9` 等车型页**只有规格、无价格**（且规格值为 0，需 JS） |
| **★ 真源** | `https://www.denzathailand.com/{th,en}/news-and-promotions/<活动 slug>` —— 活动条款里的表格 `ราคาจำหน่าย / รายละเอียด` 明列各版本售价。**用 Playwright（`domcontentloaded`+wait，`networkidle` 会超时）渲染后读正文** |
| **★ 活动 slug（当期）** | D9 → `denza-d9-oct-2026-campaign`（或 `denza-d9-jun-2026-campaign`）；Z9GT → `z9gt-oct-2026-campaign` / `denza-z9gt-sep-2026-campaign` |
| **★ 提取法** | 渲染后文本里定位 `ราคาจำหน่าย` 段，读取 `รุ่น <版本>` ↔ `<数字> บาท`。⚠ 页面同时混有分期月供、配件价值等干扰数字，**只取 `ราคาจำหน่าย` 表** |
| **★ 口径判定** | 同一价格跨多期活动不变（如 D9 Premium 在 2026-06 与 2026-10 都是 `1,949,900`）→ 判定为**官方售价（MSRP）**，非折扣价 ✓ |
| **★ 在售车型（2）** | DENZA D9（Premium / Performance AWD）· DENZA Z9GT（Performance AWD） |
| ⚠ Phantom Edition | D9 Phantom Edition II = **车身价（与普通版同）+ 配件包 70,000** → 净价 2,019,900 / 2,469,900。按「不含选装」**不采**，或按需单列 |
| 燃油 | 全系 `BEV` |
| ⚠ 无 models 列表 | 找车系只能从首页 RSC 的 `text:"รถยนต์ไฟฟ้า DENZA ..."` 或 news 列表里挖 |

**交付结果**：`Denza_TH_官网价_20261011.xlsx`，**3 条**。

---

### Volvo（TH 泰国 `www.volvocars.com/en-th/`：**curl 全 403，但有头 Playwright 可通；价格只在配置器**）⚠️ 可采

**结论：curl 直连全站 Akamai 403，但 `xvfb-run + headless=False` 的真实浏览器可以正常打开；官网无价格表页，价格只在「设计你的 Volvo」配置器的各配置档。**

| 项 | 内容 |
|---|---|
| 连通性 | ⚠ `curl` → **403**（Akamai `errors.edgesuite.net`）；✅ **有头 Playwright**（`headless=False` + xvfb）→ **200，站点完全正常** |
| **★ 关键姿势** | 与 Tesla（有头也 403）不同，Volvo 的 403 是**对无浏览器指纹的拦截**，真浏览器可过。**必须 `xvfb-run -a` + `chromium.launch(headless=False)` + 去 `navigator.webdriver`** |
| URL 陷阱 | `/en-th/cars/` → **404**；车型页形如 `/en-th/cars/<model>/`（如 `/ex40-electric/`），但**车型页本身不含价格** |
| **★ 价格真源** | **配置器**：`https://www.volvocars.com/en-th/build/<model>/`（英文名，如 `ex40-electric` / `xc60-hybrid`）。进入后默认选中该国在售配置档，正文显示 `Your level: <档位>` + **`THB x,xxx,xxx`**。配置器总览页 `/en-th/build/` 还给出各车型「From THB ...」 |
| **★ 取数法** | 渲染 `/build/<model>/` → 读 `inner_text` → 正则 `THB\s*([0-9][0-9,\.]+)`；页面里 `Your level` 段的价格即该车型在售价 |
| **★ 在售车型（6）** | EX40 · EC40 · ES90 · XC60 · XC90 · EX90 |
| ⚠ EX90 无价 | EX90 配置器有 **Plus / Ultra** 两档可选，但**通篇不显示任何价格**（点击档位也不出价）→ 判定「官网暂未公布价格」，表中留空 |
| ⚠ 单车单档 | 泰国市场 EX40/EC40/ES90/XC60/XC90 均**只进口一个配置档 Ultra**（配置器 `Your level` 仅 1 项），所以每个车系 1 行 |
| 燃油 | EX40 / EC40 / ES90 / EX90 → `BEV`；XC60 / XC90 → `PHEV`（配置器标 `plug-in hybrid`，动力 `T8 AWD Plug-in hybrid`）|

**交付结果**：`Volvo_TH_官网价_20261011.xlsx`，**6 条**（5 条有价 + EX90 1 条价格留空）。

---

### Isuzu（TH 泰国 `www.isuzu-tis.com`：**完全开放，价格 SSR/RSC 直读**）✅

**结论：Tri Petch Isuzu 官网（Netlify + Next.js），首页带 Schema.org 起价、车型页 RSC 内含逐版本价，均可直读。**

| 项 | 内容 |
|---|---|
| 连通性 | ✅ 200（Netlify）；⚠ 首屏较慢（~26s），车型页 600–880KB，批量抓建议后台跑 |
| **★ 价格源 ①（起价）** | 首页 JSON-LD（`@type: ListItem` + `offers.price`）给 6 车系起价；页面可见文本也有 `เริ่มต้น x,xxx,xxx THB` |
| **★ 价格源 ②（逐版本）** | 车型页 RSC 里 `ราคา`/`รุ่นรถ` 段：**版本名行** 紧跟 **`N,NNN,NNN THB` 行**。⚠ 用 `inner_text` 渲染后按行配对最稳（详见「提取法」） |
| **★ 提取法** | Playwright 渲染 `/isuzu-*` → 定位独立行 `รุ่นรถ` → 向下读到 `MODEL LINEUP` / `เริ่มต้น` 为止，把「汉字/字母行」与紧随的「数字+THB 行」配对 |
| ⚠ 页面底部有干扰 | 页脚 `MODEL LINEUP` 列**其它车型**的 `เริ่มต้น xxx THB`，**必须先截断到 `รุ่นรถ` 段再取**，否则会串入别车价格 |
| ⚠ 颜色加价 | `สี... +7,000 THB`（特殊漆）属选装 → **不采**；同理 AggregateOffer 的 `highPrice`（= 顶配 + 特殊色）不等于任何标准版本价 |
| **★ 在售车系（6）** | V-CROSS · D-MAX 2-DOOR（Hi-Lander Spacecab）· D-MAX 4-DOOR（Hi-Lander）· D-MAX SPARK · X-SERIES · MU-X |
| ⚠ 车系名来源 | 官网 Schema.org 用泰文 `อีซูซุ วี-ครอส / ดีแมคซ์ ปิกอัพ 4 ประตู / …`，车型页 hero 只有 `2 DOORS / SPARK / X-SERIES`，其余以 URL slug 命名为准 |
| 燃油 | 全系 `Diesel`（`Ddi MAXFORCE` 共轨柴油，163/190 PS）|

**交付结果**：`Isuzu_TH_官网价_20261011.xlsx`，**32 条**（6 车系 × 版本展开）。

---

### Chevrolet（TH 泰国 `www.chevrolet.co.th`：官网**已转型为纯售后服务站**，不销售新车）❌ 无数据

**结论：不是封锁、也不是不公开价格——而是 GM 已于 2020 年退出泰国新车市场，该官网只做售后（配件/保修/维修），站内根本没有任何在售车型。**

| 项 | 内容 |
|---|---|
| 连通性 | ✅ curl 200（125KB），AEM 站（`/content/chevrolet/as/th/th/...`）。⚠ 但**无头 Playwright → 403 Akamai**，有头 Playwright → 200（与 Volvo 同款指纹现象）|
| **★ 决定性证据 ①** | 站点导航**全是售后**：`สินค้า`(配件) / `ศูนย์บริการ`(服务中心) / `การรับประกัน`(保修) / `บริการช่วยเหลือฉุกเฉิน`(道路救援) / `นัดหมายเรียกกลับ`(召回) / `คู่มือการใช้งาน`(手册) —— **无任何车型/购车/试驾入口** |
| **★ 决定性证据 ②** | `sitemap.xml` 共 ~50 条 URL，**无一条车型页**（全部是 products / complete-care / news-events / tools）；`/vehicles` `/cars` `/models` `/colorado` `/trailblazer` 全部 **404** |
| **★ 决定性证据 ③** | 页面全文检索 `Colorado / Trailblazer / Captiva / Spin / Cruze / Sonic / Silverado` 等**命中 0 次** |
| ⚠ 易误判点 | `/promotion/2025-new-price` 标题像"新车价"，实为**配件调价表**（`อะไหล่เชฟปรับราคาเกินครึ่งกว่า 1,500 รายการ` = Chevy 配件调价 1500+ 项），列的 Colorado/Cruze/Captiva 是**配件适配车型**，不是整车 |
| ⚠ 页面类型 | `/products` 是 **ACDelco 配件**页（滤芯/机油/电瓶/化学品），非整车 |
| 背景 | GM 2020 年停止在泰国销售新车，将 Rayong 工厂出售给 Great Wall（长城），此后仅保留售后网络（Chevrolet Authorized Service Outlets）。⚠ 第三方比价站（如 autogiz）会列一堆"Chevrolet 泰国价"，**那是美国市场换算价或二手参考，非官网，不采** |
| **结论** | **官网无新车 MSRP**；此类「品牌已退出该市场新车销售」的站，**挖再深也没有数据**，应立即止损 |

> **新类别（区别于"封锁"与"不公开价格"）**：**「品牌已退出该市场新车销售，官网仅剩售后」**。判别信号：① 导航无车型/试驾/购车入口；② sitemap 无车型页；③ 车型关键词全文 0 命中；④ 站内仅有 service / warranty / parts / recall。遇到即判定**无数据**。

---

### Tata Motors（TH 泰国 `www.tatamotors.co.th/en`：**Cloudflare 国家封锁，封 CN，无解**）❌

| 项 | 内容 |
|---|---|
| 症状 | `curl`/Playwright（含 headed）**一律 403**，返回 Cloudflare **Error 1009**：<br>`The owner of this website has banned the country or region your IP address is in (CN) from accessing this website.` |
| **★ 封锁性质** | **国家级地区封锁（法务/市场分区），不是 IP 级、不是 UA 级** —— 换 UA 头、headed 浏览器、IPv6 全无效 |
| 佐证 | 我方出口 `101.35.42.136`（AS45090 腾讯云 · 上海 · CN）；全球站 `www.tatamotors.com` 同样 403 |
| 源站直连 | 裸域 `tatamotors.co.th` → `15.206.215.211`（AWS），但 **:80/:443 均 CLOSED**（只放行 Cloudflare）→ 绕过 CDN 直连源站也走不通 |
| 代理 | 公共 CORS/reader 代理（allorigins / codetabs / corsproxy / thingproxy / 12ft）**全部超时或需 key**；`translate.goog` 在沙箱 DNS 不通 |
| **结论** | **本环境无法采集**；需海外（非 CN）出口，或用户本地取数 |

---

### Tesla（TH 泰国 `www.tesla.com/en_th`：**Akamai IP 级拒绝，无解**）❌

| 项 | 内容 |
|---|---|
| 症状 | `www.tesla.com/**` 与 `tesla.com/**` **全 403**，Akamai 页面：`Access Denied … Reference #18.xxxx … errors.edgesuite.net` |
| **★ 封锁性质** | Akamai **按出口 IP 拒绝**（数据中心 IP 段被拉黑）—— 换 UA/完整浏览器头/headed Chromium **均无效** |
| 关键对照 | **并非全域封锁**：`auth.tesla.com` → **200** ✅、`digitalassets.tesla.com` → **200** ✅、`static-assets.tesla.com` → **404**（服务端正常应答）；**只有 `www` 主机被拦** → 是 www 上的 bot/IP 规则，不是域名级 |
| 端点探测 | `configurator/api/v3/options/en_th/model3`、`/cua-api/...`、`inventory/api/v4/...`、`/en_th/model3/design` → **全部 403**（都在 www 下） |
| 代理 | 同 Tata，公共代理全不可用 |
| **结论** | **本环境无法采集**；需非数据中心出口或用户本地取数 |

> 📌 **与 Tata 的区别**：Tata 是**国家封锁**（明确说封 CN）；Tesla 是**数据中心 IP 黑名单**（`www` 主机 403，其它子域正常）。两者**同属"我方出口被拒"**，但性状不同。

---

### Maserati（TH 泰国 `www.maserati.com/th/en`：站点全通，但**官网刻意不公开价格**）❌

**结论：不是技术问题，是厂家政策——泰国站所有界面 `price` 均为 `"0"`。**

| 项 | 内容 |
|---|---|
| 连通性 | ✅ 完全通。主站 Akamai `23.210.7.22`、`robots.txt` 200、sitemap 681 条 |
| **★ 泰国在售车系（6 个）** | `grancabrio` `granturismo` `grecale` `gt2-stradale` `mcpura` `mcpura-cielo`（配置器 `SELECT` 列表） |
| **★ 真源（AEM `.model.json`）** | `https://www.maserati.com/th/en/models/<model>/jcr:content/main/tool_version_carouse.model.json`<br>⚠ 必须**先 301 跳一次**（`/content/countries/th/en/...` → `/th/en/...`），直接 curl 会拿到空体 |
| **★ 价格字段** | `items[].price` —— **全部为 `"0"`**（实测 grecale / granturismo / grancabrio 无一例外），同时 `items[].modelYear` / `modelName` / `specifications` 都是真实数据 |
| 配置器 | `www.configurator.maserati.com/ccbe/public/api/*` ✅ 通（`country/list` 200，泰国 `id=182`）；但只做车型选择与 3D 渲染，**不出价** |
| 配置器 API 域 | `apilayer.maserati.com` → **403**（另需鉴权） |
| 页面字段开关 | JS 里有 `display_model_price` 变量，但泰国站未启用（`price:"0"` 印证） |
| **结论** | **官网不公布 MSRP**（东南亚市场惯例，价格由经销商报价）。技术上没有任何绕法——**不是封锁，是真的没有数据** |

> **心法**：见到 `price: "0"` / `price: null` **成片出现**且 `modelYear`、规格全都正常时，应判定为「厂家未公开价格」，**立即止损**，别再往配置器/API 深处挖。

---

### McLaren（全球含 TH `www.mclaren.com/cars/gl_en/...`：站点全通，但**配置器价格被显式关闭**）❌

**结论：站点完全可访问、配置器 API 全部打通，但 `showPriceSummary=false` → 官网不显示任何价格。**

| 项 | 内容 |
|---|---|
| 连通性 | ✅ 主站 Cloudflare `104.16.153.71` 200；`robots.txt` `Allow: /*` |
| 站点性质 | SPA（`/cars/assets/index-*.js`）。用户给的 `/cars/gl_en/retailers/BangkokMcLaren` 是**经销商页**，只有联系方式，无车价 |
| **★ 配置器** | `https://configurator.mclaren.com/mclaren-ui/` ✅ 200（SAP **ConfigAir** / 3D 配置器） |
| **★ profile 列表** | `landing` 数据 `webui.environmentsModelList = 'artura,artura-spider,gts,750s,750s-spider'`（5 款） |
| **★ 核心端点（全部无鉴权 GET）** | `GET /configuration/ajaxLandingPageData.do?profileName=<model>&language=en`（车型档案）<br>`GET /configuration/ajaxStartConfiguration.do?profileName=<model>&configCountry=<CC>`（启动，返回 `windowId`）<br>`GET /configuration/ajaxGetInitialData.do?cacheControl=<ts>`（**含 `profileInfo`，价格开关在这里**）<br>`GET /configuration/ajaxGetConflicts.do` · `ajaxGetInstanceList.do` · `ajaxGetCharacteristicViews.do` · `ajaxGetCharacteristics.do` |
| **★ 价格端点（存在但从不被调用）** | `GET /configuration/ajaxGetConfigPrices.do` —— JS 逻辑：`this.profileInfo?.showPriceSummary && (t = this.sendWebConfGetXhr('ajaxGetConfigPrices.do'))` → **开关为 false 时压根不发请求**（抓包实测：整轮配置流程 0 次调用） |
| **★ 决定性证据** | `ajaxGetInitialData.do` 的 `profileInfo`（103 条）里：<br>· **`webui.showPriceSummary = 'false'`**<br>· **`webui.showPricesByCountry = 'false'`**<br>· `webui.showValuePricesInLangName = 'false'`<br>→ 三重关闭，**配置器不显示也不查询任何价格** |
| 货币字段存在 | JS 里有 `currency/currencySymbol/formatted/prices/PriceSummary` 等完整实现，**只是被 profile 开关关掉**（同一套配置器在别的市场可能开价） |
| 其它 API | `mclaren-cms.production.aws.mclaren.com/api/*` → **403**（需鉴权） |
| **结论** | **官网不公布 MSRP**（超跑惯例，价格一律经销商报价）。技术通路全开但没有数据 |

> **与 Maserati 的区别**：Maserati 是「字段在、值为 0」；McLaren 是「字段在、**服务端根本不返回价格，且前端开关关闭**」。两者**同属"官网不公开"**，但取证方式不同：McLaren 要看 `profileInfo` 开关 + 是否调用价格端点。


> 📌 **通用教训**：**403 + "维护页" + 数据中心出口 IP → 优先怀疑风控，不是站点状态**。别把"我这里看到的"当成"站点真实状态"。
