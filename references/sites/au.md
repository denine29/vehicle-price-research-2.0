# 澳大利亚 AU — 站点坑位详段

> 市场码 AU · 12 段 · 品牌：Kia / Nissan / LDV / Denza / CUPRA / GWM ANZ / Hyundai / Škoda / Volvo / Infiniti / Chevrolet / GMSV / Citroën
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-11-03 · 文中车型 slug / id 均为当时实测值，必须现取
> ⚠ **口径提醒（2026-11-10）**：本文件大量方法写的是「按邮编 2000 取 drive-away」，那是 2026-11 那批任务的**指定口径**，不是本站默认。新任务先确认口径：**默认取官网 MSRP / RRP**；只有用户明确要 drive-away（上路价）时，才按各段的邮编步骤取，并在交付说明写明邮编与包含项。之后 AU 需求可能变，别把邮编步骤当默认流程。
> ⚠ 本市场三条通用坑（AU 十站实测）：① 上路价**可能带分**：官网显示带分的品牌（Kia/Hyundai）用 `--money comma2`，官网显示整数（Nissan/CUPRA/Škoda/Volvo/LDV/GWM）用 `comma`——**以官网显示为准**，别一律 comma2；② 接口里的 `name` 常是**内部名**（带车身代号/缩写），型号名必须回读**界面渲染文本**；③ **年款常只印在官方规格表/价格表 PDF 的内文里**（页面与配置器不标）→ 逐车型抽 PDF 全文找 `MY\d\d`／`〈年份〉〈车型〉` 抬头，文件名里的 MY 只算旁证（详见 SKILL.md「年款怎么来」第 6 条与下面 Hyundai 段）

---

### Kia（AU 澳大利亚 `www.kia.com/au`：Build & Price 先设邮编，`curl` 带 cookie 可直取全量等级价）✅

- **可达性**：`curl` 直连 200，**不受 Akamai 拦**（2026-11-03）；不需要浏览器
- **任务口径**：邮编 **2000**（悉尼 NSW）、价格取 **drive-away**（含 12 个月注册 + CTP 估算 + 印花税 + dealer delivery）
- **★ 邮编怎么生效**：页面点 `SET YOUR LOCATION` → 输入 2000 → 站点写两个 cookie：
  ```
  regionCode=NSW; postCode=2000
  ```
  之后 `curl -b "regionCode=NSW; postCode=2000"` 拿到的 HTML 才带价格字段。**不带 cookie 时 `name="trimPrice"` 出现 0 次**（页面照样 200），不要据此判「官网无价」
- **车型清单**：`/au/shopping-tools/build-and-price.html` 里每个卡片的 `href` 是 `javascript:moveNext('<trim页URL>','<车型码>','<分类>','<卡片名>','<yr码>')`；卡片名即官网车型名（`Seltos MY26` / `Tasman Dual Cab Chassis` …），**`yr` 字段不是年款**（Seltos 传 23、EV9 传 23，别用）
- **等级页**：`/au/shopping-tools/build-and-price.trim.<slug>.html`（2026-11 共 22 个）
- **★ 两个价的区别（必看）**

  | 字段 | 含义 |
  |---|---|
  | `trimRRPPrice` | 裸车 RRP（不含上路费） |
  | `trimPrice` | **标准上路价估计** = RRP + 12 个月注册 + CTP 估算 + 印花税 + dealer delivery（`trimPrice − RRP = 上路费`，逐条成立） |
  | `trimOfferPrice` | 页面 `<em class="option_price">` 实际显示的 Drive Away；有活动时低于 `trimPrice` |

  - 实测 98 个等级里 **66 个** `offer < trimPrice`：Stonic S 31,840.03 → 29,990；EV5 Air SR 61,114.05 → 49,990；Tasman X-Pro 80,084.05 → 64,990（最大差 15,094.05）
  - ⚠ **默认口径**：按 SKILL「促销价不采」应取 `trimPrice`（标准上路价），`trimOfferPrice` 只备注；**本次交付（2026-11-03）是用户明确要求「页面显示价」才按 offer 优先**——没有同样指令时，一律 `trimPrice`

- **解析骨架**（Node + curl，85 行内）：
  ```js
  const html = await fetch(url, { headers: { cookie: 'regionCode=NSW; postCode=2000' } });
  const parts = html.split('<li class="trim_l');          // 每个等级一个块
  const la = c.match(/path="([^"]*)"[^>]*>([^<]*)<\/label>/);   // path=等级码, label=短名
  const pr = c.match(/name="trimPrice" value="([^"]*)"/);
  const of = c.match(/name="trimOfferPrice" value="([^"]*)"/);
  const rp = c.match(/name="trimRRPPrice" value="([^"]*)"/);
  ```
- **★ 型号名取配置器卡片标签**：等级页每个 `<li>` 里的 `<label …>Air - Standard Range</label>` / `<label …>GT-Line Two-Tone</label>` 就是页面上显示的等级名 → **型号名用它**
- **⚠ 别用 `details[].name` 当型号名**：`GET /api/kia_australia/base/carInfo.selectVehicleList?nCd=au` → `dataInfo.<分类>[]` → `details[]` 里的 `name` 是**内部缩写**（`Air SR`、`GT-LINE LRT`、`SHEV`），与页面不一致；它只适合做**燃油判定**（含 `48V Mild-Hybrid` / `Petrol` / `Diesel` 等字样）
- **★ 年款**：Build & Price 卡片只有 Seltos 写 `MY26`；其余取**车型页浏览器标题**：
  - `/au/cars/<slug>.html` 会 302 到 `…/features.html`，`<title>` 形如 `2027 Kia EV3 | Electric Small SUV | Kia Australia`、`2026 Kia Seltos | Small SUV | Kia Australia`
  - `Carnival Hybrid` / `K4 Sedan` / `K4 Hatch` / `PV5 Cargo` **没有独立车型页**（`carnival-hybrid.html`、`k4-sedan.html`、`pv5-cargo.html` 全 404）→ 用同页 `carnival.html`、`k4.html` 的标题 + 官方宣传册封面 `MY27` / `K4 Hatch & Sedan MY26` / `PV5 MY26 - Mechanical & Feature List` 互证
- **slug 清单（2026-11-03）**：trim 页 `stonic` `seltos` `seltos-hybrid` `sportage` `sportage-hev` `sorento` `sorento-hybrid` `sorento-plug-in-hybrid` `ev3` `ev4-sedan` `ev5` `ev6` `ev9` `pv5-cargo` `carnival-hybrid` `carnival` `picanto` `k4-sedan` `k4-hatch` `tasman` `tasman-dcc` `tasman-scc`；车型页 `stonic` `seltos` `seltos-hybrid` `sportage` `sportage-hybrid` `sorento` `sorento-hybrid` `sorento-plug-in-hybrid` `ev3` `ev4` `ev5` `ev6` `ev9` `pv5` `carnival` `picanto` `k4` `tasman`
- **燃油判据**（用 `details[].name` 逐字）：
  ① `PHEV` / `Plug-in` → PHEV　② `Mild-Hybrid` / `48V` → MHEV（Stonic 全系）
  ③ `Hybrid` → HEV（Seltos/Sportage/Sorento/Carnival Hybrid）　④ `Diesel` / `CRDi` → Diesel
  ⑤ `Petrol` / `MPI` / `T-GDI` → Gasoline　⑥ 无燃油词的纯电（EV3/EV4/EV5/EV6/EV9、PV5）→ BEV
  ⑦ Tasman 等级名不带燃油 → 官方宣传册 `2.2L Diesel` + `Fuel Type: Diesel` → Diesel
- **坑**：
  1. 无 cookie 时价格字段为 0 个，容易误判「官网无价格」
  2. `trimPrice`（RRP+上路费）≠ 页面显示价（活动 offer），两者别混用
  3. `details[].name` 是内部缩写（`Air SR` / `GT-LINE LRT` / `SHEV`），页面上显示的是 label（`Air - Standard Range` / `GT-Line Two-Tone` / `S Hybrid`）→ 型号名取 label
  4. `EV5` 的 `GT-LINE LRT`（Two-Tone）与 `GT-LINE LR` 同价，两条都保留
  5. 上路费带分（`35,031.35`）→ 用 `--money comma2` 输出 `106,230.27` 这种格式；`--money comma` 会圆整成整数，别用
- **来源**：`https://www.kia.com/au/shopping-tools/build-and-price.html`（postCode=2000 / regionCode=NSW）、`https://www.kia.com/api/kia_australia/base/carInfo.selectVehicleList?nCd=au`
- **交付结果**：`Kia_AU_官网价_20261103.xlsx`，**98 条 / 22 车型**；燃油 BEV 22 / Gasoline 24 / HEV 23 / Diesel 22 / PHEV 4 / MHEV 3；年款 2027(42) / 2026(56)

---

### Nissan（AU 澳大利亚 `www.nissan.com.au`：车型页无逐版本价，逐版本上路价只在配置器 SPA 的 grade→version 卡上）✅

- **可达性**：`curl` 直连 200（AEM `pace-vlp-plus`，非 Akamai 拦），但价格是客户端算的 → 需要浏览器在页面上下文里操作
- **★ 价格门**：默认压制（配置里 `isPriceSupressionEnabled:true`、`defaultPostCode:"2000"`）。不输位置时价格格是空的（`To see correct pricing information / Set Location`）。走站点自己的位置弹窗：点 `Set Location` → 输入 `2000` → 点搜索 → `CONFIRM`，回执 `Price for postcode 2000 / 2000 Haymarket, NSW`；**位置会留在该浏览会话**，之后逐个车型页直接可读
- **取价源**：`/vehicles/browse-range/<slug>/version-explorer/configurator-v3/cfg.shtml` 的版本卡「Driveaway from」。逐版本点击版本组（a11y 名 `Select Your Grade. ST-L, , 2 of 5`）后读 `Select Your Version.` 那批按钮的文本 + 价格；一次 evaluate 只能吃 2–3 个组（工具 15 s 上限）
- **在售范围**：车型清单以导航（Vehicles 菜单）为准，共 9 项；逐车型版本数与目录 JSON 对齐（如 X-TRAIL 13 = 目录 versions 13）
- **年款在哪**：① 导航车型卡字段 `data-vehicle-year`（逐车型 2025/2026/2027）；② aria-label「Explore X-TRAIL MY26」；③ 目录 `contentFragmentURL` 片段名（`cf-container-ve-x-trail-my26`）。**Patrol 自相矛盾**：页面写 MY26（`<VLP+> Patrol MY26`、hero description），卡片字段与片段名是 2025，图片 alt 也是 MY25 → 冲突要在依据里两边留痕
- **坑**：
  1. 同一辆车在「SPECS & PRICES」页与配置器差 1 AUD（页下取整、配置器四舍五入，底层带分：Patrol 105,307 / 105,308）→ 按优先级取配置器，另一个值记副表
  2. `/suvs/explorer/2026/models/` 这类**带年份的 URL 不切换内容**（返回的仍是当年清单）；老 `Z`(30273) 的配置器入口已换成 `/forms/get-a-quote.html`，`all-new-patrol` 换成 `request-a-call-back`
  3. 页面打点数组 `vehicleCategory=["MY27 Z", …]` 才是 New Z 的年款来源；DAM 图片名里的 MY24/MY26.5 不作依据
  4. 别去翻 `localStorage` 里的价格接口 token（会被安全策略判成凭证探测）；走界面路径即可
- **来源**：`https://www.nissan.com.au/vehicles/browse-range.html`、各车型 `/version-explorer/jcr:content/core.versionexplorerdata.json`、`…/configurator-v3/cfg.shtml`
- **★ 年款复核（2026-11-04；规格书 = `…/download-specsheet.html` 302 到的 `www-asia.nissan-cdn.net/content/dam/Nissan/AU/Files/Brochures/Models/Specsheet/*.pdf`，`curl -L` 直取）**：QASHQAI 规格书印 `MY26.5 QASHQAI`（首页 + 页眉 `/Nissan MY26.5 QASHQAI specifications`）→ **文档精度高于页面字段（`data-vehicle-year=2026`），按文档写 MY26.5**；Patrol 印 `MY26 Patrol` → 页面三处冲突（卡片 2025 / 图片 alt my25 / hero MY26）由文档定案；X-TRAIL / Navara / Z 的 download-specsheet.html **不重定向到 PDF**，沿用页面字段；ARIYA 与 New Nissan Z 的规格书内文 **0 次命中 MY**（只有 `Updated August 2025`、印刷日期 `…ACN 004 663 156. October 2026.`；文件名 `Nissan_Z_Spec_Sheet_AU_2026.pdf` 不算依据）→ 现值仅页面字段/打点数组支撑，副表标「证据等级低」；All-new Nissan Patrol 文档只有「…feature breakdown will be released throughout 2026」（发布计划）；All-new Navara Pro Plug-in Hybrid 无规格书（404）→ 官网无年款 正确
- **交付结果**：`Nissan_AU_官网价_20261103_v2.xlsx`，**40 条 / 9 车型**；上路价（postcode 2000）；⚠ 价格格式用 `--money comma`（官网显示取整后的澳元上路价，与 Kia/Hyundai 带分不同）

---

### LDV（AU 澳大利亚 `www.ldvautomotive.com.au`：价全在 `/price/` 一表两栏，Retail 与 ABN 并列）✅

- **可达性**：`curl` 全通（Gatsby 5 静态站），页面 SSR 就带价格
- **取价源**：`https://www.ldvautomotive.com.au/price/` → 14 个价目分组，每组表头 `Retail Price From` + `ABN Holder Price From`，行结构是「标签 / 零售价 / ABN 价」三格连续（**按格序列解析，别按 `<table>`**，它不是 table）
- **★ 划线价才是建议价**：带活动的那格写成 `<s>$54,200 Driveaway</s><br/>$49,700 Driveaway`（`VIEW LAUNCH OFFER` / `THAT'S $2000 OFF` / `VIEW SPECIAL OFFER`）→ 入表用**删除线上的值**，活动价记副表
- **ABN 栏是资格受限价**（须以 ABN 主体名义购买、可能查验 ABN）→ 主表取 Retail 栏，ABN 值逐行记反查表
- **`±` 脚注**：Cab Chassis 两行的价按官网注释不含货箱/托盘（tub/tray），但含 CTP/注册/印花税 → 必须在依据写明
- **在售范围**：价目表 13 组覆盖导航 14 个车型页（T60 一组含 MY27 与 MY25 两个车型页）；CMS 目录里多出的 trim（如 G10+ 的 Petrol A/T、Diesel M/T，Deliver 9 的 LWB Mid Roof Manual）**页面选择器与价目表都没有** → 不出行
- **坑**：① `/all-new-navara/specs-and-pricing.html` 与 `/navara/...` 返回同一份内容（同 model code 30316），别出两代；② `eDeliver 9` 该行两栏都是 `Get a Quote` → 无价；③ 选装行（`Rear Barn Doors $600`、`Premium Paint $500/$2,000`）混在价目表里，要剔掉；④ sitemap 里 `juke.html`、`qashqai-my25.html` 等已 404，不能当在售依据；⑤ 无 postcode 门，2000 填不进去
- **来源**：`https://www.ldvautomotive.com.au/price/`、各 `/vehicles/ldv-*/`
- **★ 年款在哪（2026-11-04 复核）**：规格书挂在 `/download-brochure/`，链接是 `cdn.cms-uploads.i-motor.me/<无扩展名 id>`（按「锚文本 → 所属 h2/h3 车型」映射取得）。内文实测：T60 MAX 两份分别印 `LDV MY27 T60 MAX` / `MY25`（与下载按钮文案 `Download MY27 specification sheet`、`Download MY25 specification sheet` 一致）；**G10+ Van 首页印 `MY25 VAN` + 页眉 `LDV MY25 G10+ VANS`**；**Deliver 7 首页印 `MY26`**；eDeliver 7 规格书内文**没有** MY，它的 MY25 来自官网选项标签文本（`Long Wheelbase / Low Roof (77kWh Battery) MY25` 等）；Terron 9 / D90 / Deliver 9 全系 / eDeliver 5 / eDeliver 9 内文 0 命中 MY，只有页脚日期与 ANCAP 年份 → 记「官网无年款」
- **交付结果**：`LDV_AU_官网价_20261103_v2.xlsx`，**34 条 / 14 车型**（v2 相对 v1 只改 3 行年款：G10+ Van→MY25、Deliver 7→MY26）

---

### Denza（AU 澳大利亚 `www.denza.com/au`：全站不公开常规售价，只有 `/au/offer` 的限时活动 Driveaway）⚠️

- **可达性**：`curl` 200，但页面是 SPA，价格是客户端按地区算的
- **★ 唯一公开价**：`/au/offer` 的 `DENZA B5 … Starting From $74,990 Driveaway`、`B5 Leopard $79,990`，同页写 *Selected models (2025 Build) / While stock lasts / Offer ends 30 November 2026* → 促销价，按规则**不采**
- **车型页/规格书无价**：`/au/car/b5|b8|d9|z9gt` 与三份官方规格书 PDF（47/47/25 MB，文本抽取后 0 个价格字段）全无价；`/au/offers`、`/au/offers/b8` 是金融对比利率页
- **`Build & Order`** 按钮指向渠道商城（页面配置里是 BYD 的 mall/API 域名），公开链路点不出报价页
- **年款**：⚠ **只有文件名带 MY26**（`MY26_DENZAB5_SpecSheetAU_260306.pdf`、下载按钮属性 `data-document-name="MY26 DENZA B5 Spec Sheet"`）。2026-11-04 把三份规格书（B5 47 MB / B8 47 MB / D9 25 MB，`pdftotext` 抽字 39,603 / 37,336 / 29,374 B）**全文搜 `MY\d\d` / `Model Year` = 0 命中**，能匹配年份形的一行都没有（页面另有 `©2026 BYD Australia Pty. Ltd.` 版权年、第三方评分 `Drive. August 2026`）→ **首版按文件名记的 MY26 已改回「官网无年款」**，Z9GT 无规格书可下载
- **来源**：`https://www.denza.com/au/offer`、`https://www.denza.com/au/car/<slug>`
- **交付结果**：`Denza_AU_官网价_20261103_v2.xlsx`，**5 条全部 `官网无价格`**（含 Z9GT 预售）；v2 相对 v1 只把 4 行年款从 MY26 改回「官网无年款」

---

### CUPRA（AU 澳大利亚 `cupra.com.au → cupraofficial.com.au`：**主源是配置器 `/carshop`**，清库年款补自 `/stock` 库存卡）✅

- **可达性**：`curl` 403（Akamai，连 `/content/dam`、`/brochures`、`/robots.txt` 都 403），**只有浏览器可通**；`cupra.com.au` 302 到 `www.cupraofficial.com.au`，老 `cupra.com.au/models/...` 404
- **★ 邮编闸门（首版就是栽在这里，误判成「全站零金额」）**：进 `/stock` 会弹 web-component 对话框 `Enter postcode and find nearest dealer / We use your region to get accurate prices`。填 `2000` 点 Continue 之后卡片才带价。⚠ **价格不在 `document.body.innerText` 里** —— 它在 `ds-currency--v2-*` 自定义元素的 **shadow root** 内，`querySelectorAll` 也要递归 `el.shadowRoot` 才拿得到（读 `amount-number`）；`querySelectorAll` 一把抓的结果是「有 `Driveaway price` 标签、没金额」，看起来就像官网不标价
- **取价源**：`https://www.cupraofficial.com.au/stock?t_model=<码>&sort=price_asc`，码 = `EXFO` FORMENTOR / `EXAE` TAVASCAN / `EXAF` TERRAMAR / `EXAI` LEON / `EXSP` LEON SPORTSTOURER（车型筛选 chips 只有这 5 项）。翻页靠 `Load more`（要点**最内层**文本节点，点外层包装元素无反应），单轮 +12 台
- **价格口径**：卡面价 = 脚注逐字 `[D1] Manufacturer's recommended driveaway price (MRDP) for new MY26 vehicles … includes the recommended retail price, 12 months private registration, 12 months CTP, an estimated dealer delivery charge, stamp duty, options entered during the configuration process, … LCT`。⚠ MRDP 把选装算进去，且 `Actual prices … will vary between Cupra Agents` → **同一版本有多张不同价的卡**（实测 FORMENTOR S 110kW MHEV MY26 从 53,990 到 58,810），**取官网该版本最低卡价当起价**，把最高价与卡数写进副表反查。⚠ **选装口径冲突**：MRDP 含配置过程录入的选装，与 SKILL「不含选装」不一致；取最低卡可近似零选装，但副表必须注明「最低卡价，可能含选装」，否则不能当纯 MSRP 用。每张卡角标都是 `driveaway [D1/D2]`（清库车两个都带，不能逐卡分辨），`[D2] Manufacturer’s Campaign Driveaway Price for new MY23 and MY24 vehicles purchased from 01/10/2025 and delivered by 31/12/2025`
- **年款就在卡面**：版本行直接印 MY —— `S 110kW MHEV MY26`、`Endurance 210kW MY25.5`（**半点年号原样保留**）、`VZ 250kW AWD MY24`、`Hatch VZx 221kW MY25`；再叠加脚注的 `for new MY26 vehicles` / `for new MY23 and MY24 vehicles`
- **覆盖核对**：正序价全扫 + 倒序价再扫一轮比对版本集合（`sort=price_desc` 只取头部 36 卡即可复核正序已见的版本；有 6 个稀有清库版本天然只在正序尾部出现，属排序设计不是漏采）。⚠ 库存数会漂（TAVASCAN 正序 223 / 倒序 224；SPORTSTOURER 基线 90 / 实际 92）；⚠ FORMENTOR chips 里的 `VZX WITH EXTREME PACK`（27 台）**不输出独立版本行**，两种排序都仍写 `VZx 245kW AWD MY26` → 无法逐字区分，不出行、只在副表记
- **★ 配置器才是主源（别学我判成壳）**：`https://www.cupraofficial.com.au/carshop/w/model` 的 app 挂在 `#mcc-app-root`（React，资源来自 `pcc-carconfigurator.seat.com`），**加载要 5–10 s**：外层 `document.body.innerText` 一开始只有 ~856 字符的导航，等到出现 `SELECT YOUR MODEL` 才算就绪。界面是 `SELECT YOUR MODEL →（点模型下拉里的 `<a>`）→ CONTINUE → SELECT YOUR VARIANT`，版本卡在 `role="listbox"`（`aria-label="Trim"`）里，**名称与 `Driveaway from $X` 都要递归 `el.shadowRoot` 才读得到**。官网正式版本名带电池与驱动形式，例：`TAVASCAN ENDURANCE 210KW / 77KWH RWD MY26 = 71,490`、`TAVASCAN V 140KW / 58KWH RWD MY26 = 59,990`、`LEON VZX SPORTSTOURER 245KW AWD MY26 = 72,490`；⚠ 该屏是**全大写显示样式**（同一屏图片替代文本写「Leon S Hatch 110kW MHEV MY26」），两种写法都留在依据里。配置器 `SELECT YOUR MODEL` 只有 **6 项**：New Formentor / New Formentor VZ5 / Tavascan / Terramar / Leon Hatch / Leon Sportstourer（Formentor 拆成两项、Ateca 与 Born 不在里面），且**只给 MY26**、**不要求邮编**。⚠ 环境坑：内置浏览器面板在**后台不可见**时，配置器底部按钮的 `getBoundingClientRect()` 是 `0×0`，`click` 工具报 `Element is covered by another element`、截图报 `NATIVE_BROWSER_VIEWPORT_UNAVAILABLE`；让用户把浏览器面板点到前台（`document.visibilityState` 变 `visible`）才走得动。别用 `history.pushState` 去跳配置器路由 —— 会把 React Router 打成半死状态（URL 变了但页面空白），要重新 `navigate`。
- **接口与鉴权**：库存接口 `https://vtpapi.seat.com/restapi/v1/cuaunwb/search/car` 裸调 **401**，配置器 workflow 接口 `gateway.prod.pcc.seat.cloud.vwgroup.com/mambo/v1/core/v1/workflows/cupra-au-en/project/zenit` 只回 166 字节空包 —— 都**不要复用页面内置 token**，走界面
- **停销**：ATECA、BORN 页脚导航仍在（`Ateca - Agile Small SUV` / `Born - Fully Electric Performance Hatch`），但 `/stock` 车型筛选没有它们、车型卡标 `SOLD OUT` → 记 `是` + `官网无价格`
- **来源**：配置器 `https://www.cupraofficial.com.au/carshop/w/model`（→`/carshop/w/trim`）、库存 `…/stock?t_model=&sort=`、页脚 `[D1]/[D2]`
- **⚠ 版本名踩过两次坑**：① 用接口/内部名（Hyundai 那类）；② **用库存卡的简写行**（本品牌 v2）—— 卡面写 `Endurance 210kW MY26`，而配置器的正式版本名是 `TAVASCAN ENDURANCE 210KW / 77KWH RWD MY26`，电池/驱动形式这一层被丢了；而且库存车价含选装，会**高于**官网起价（LEON VZX SPORTSTOURER 实测：配置器 72,490 vs 库存最低 73,110）。规则：**名称与起价都取配置器**，库存卡只用来补配置器里已消失的清库年款（MY24/MY25/MY25.5）
- **交付结果**：`CUPRA_AU_官网价_20261105_v3.xlsx`，**27 条 / 8 车型名**（配置器 17 条 MY26 + 库存清库 8 条 + ATECA/BORN 2 条；MHEV 4 / Gasoline 10 / PHEV 5 / BEV 7 / 未标注 1；价 50,990–101,990）。⚠ 前两版都不要引用：`_20261103.xlsx` 误判「官网无价格」，`_20261105.xlsx` 版本名用了库存卡简写

---

### GWM ANZ（AU 澳大利亚 `www.gwmanz.com/au`：车型页只有一个"展示版本"价，逐版本价在 `/au/config/<车型>`）✅

- **可达性**：`curl` 200（Nuxt 站点，内容走 Storyblok；页面里 `77,100` 那种数是数组下标，不是价格，别当价读）
- **取价源**：`/au/config/<车型>` 的 `Choose Your Variant` 列表逐行「版本名 + From $价 + 动力原文」；右上 `DRIVEAWAY PRICE` 面板带「Private Buyer + 州」，**默认 VIC，站点没有邮编框**，按 2000 点州标签切 `New South Wales`（选择跨页保留；Tank 300 两州同价）
- **⚠ 减免已含在展示价里**：多数车型写 `Driveaway price includes savings of $1,000/$1,500/$3,000/$4,000 … Offer ends 30 November 2026`（Tank 500/H6/H6GT/H7 是"上路价之外再减"）→ 与用户确认口径后再入表，逐车型在依据写明属哪一类
- **⚠ 车型页首价不是起价**：`ute/cannon` 首屏 50,990 / `cannon-alpha` 58,990 是**默认展示版本**的价，全系最低分别是 34,990 / 54,990 → 双向核对时别拿它当最低价比
- **年款**：页面无 MY（`my26` 只出现在图片资源名），只有 `Price applicable for 2026 build vehicle`（建造年）→ 记「官网无年款」并把这句留进依据。⚠ 2026-11-04 已把 `/au/download-brochure/` 挂的 9 份官方规格书（`assets.gwmanz.com`，1.49–7.08 MB，全部可抽字、非图片型）逐份搜过：内文 **0 次命中 `MY\d\d`**，末页只有 `Information in this brochure is current as at 09/10/2026.` + `Edition Code: GWMAU 20261009.`（生效日期）→ 「全表无年款」成立；Cannon Alpha 内文那个 `2026` 是拖拽吨位表的数值列（同列 3500/2550/6555），别当年度
- **来源**：`https://www.gwmanz.com/au/config/<车型>`、`…/au/models/<分类>/<车型>/`
- **交付结果**：`GWM_AU_官网价_20261103.xlsx`，**45 条 / 9 车型**

---

### Hyundai（AU 澳大利亚 `www.hyundai.com/au/en`：车型页/规格书全无价，价与版本全集都在配置器背后那个接口）✅

- **可达性**：`curl` 403（Akamai 指纹级），**浏览器可通** → 在页面上下文里 `fetch` 同源调用。⚠ 但 **`/content/dam/**` 静态资源 `curl` 直取 200**（规格表 PDF 全在这下面，不用过浏览器）；`/au/en.sitemap.xml` 也能直取，`specifications` 类页面共 39 个，`offers/` 16 个
- **★ 取价源（一个接口搞定）**：`https://www.hyundai.com/content/api/au/hyundai/v3/carpricecalculator?postcode=2000&modelname=<小写、带空格>`
  - `priceEstimate` = 该邮编下的 drive-away（上路价，含注册/CTP/交付/印花税）→ 入表
  - `price` = RRP（不含上路成本）→ 只记反查表
  - 车型全集：同路径 `/carpricecalculator/models` → `models[]` **带 categoryId 的才是官网分类里的车型**（分类含 `Runout`、`Coming Soon`），其余是历史/测试垃圾条目（`2023 …`、`qatest`、`copytest`、`Merchandise`）
  - 返回体是**数组套两个对象**，同一批 variants 出现两次 → 按 `variant.id` 去重，**不要按名称文本去重**（会吞真版本）
- **⚠ modelname 猜错会得到"空结果"**：`sonata` 返回空但 `sonata n line` 有价（62,281.20）；`mighty`、`tucson plug-in`、`santa fe plug-in`、`sonata hybrid` 是真无数据 → **空结果一律先换 key 重试，不许写 `官网无价格`**
- **★ 型号名 = variantGroup + engineType + transmissionType**（界面层级就是版本→动力→变速箱），例 `i30 Sedan N Line Smartstream G1.6 T-GDi Petrol 7-Speed DCT FWD`
  - 接口另有个 `name` 字段带车身代号（`NX4`/`CN7`/`MX5`/`LX3`/`US4`）和另一种词序（`i30 N Line Sedan …`）→ **内部名，只进副表当反查键**
  - 三段拼完仍同名的行，靠官网词 `N Line Package` 区分（TUCSON 3 行、KONA 5 行），照原词补在末尾
  - `priceLow/priceHigh`（models 列表里）含选装包，**不能用来验版本覆盖**（会误判成"漏版本"）
- **⚠ 漏取整车型的真实教训**：`i30 Sedan N` 与 `i30 N` 是**两个并列车型**（下拉列表各占一项），只按 sitemap 猜 key 会整个漏掉 6 个版本
- **★ 年款在哪（2026-11-04 复盘：首版「全表官网无年款」是漏查）**：车型页/配置器/接口/offers 页都不标 MY，**但规格表 PDF 的内文印着**。逐车型把 `/content/dam/hyundai/au/en/models/<车型>/…/*Specification*.pdf` 拉下来 `pdftotext -layout` 全文找 `MY\d\d`，实测：
  - 有印的（采）：`Hyundai QX.V5 Venue - MY23`（VENUE 规格表末页页脚）、`MY25 Hyundai i20 N`、`Hyundai i30 Sedan N - MY25`（每页抬头）、`2026 Hyundai IONIQ 6 N`（每页抬头）
  - 没印的（仍记无年款）：TUCSON／SANTA FE／KONA／PALISADE／i30／i30 N／STARIA／STARIA Load／INSTER／IONIQ 5／IONIQ 5 N／IONIQ 9／SONATA N Line —— 内文只有 `as at 11/2025`、`date as at August 2026`、`as at 16th of February 2026` 这类**生效日期**
  - **文件名/DAM 路径的 MY 不能当依据**：`my26-tucson/MY26-TUCSON_…pdf`、`MY26-INSTER-…`、`MY27_Specification_Sheet_IONIQ5…`、`…my27.pdf`（IONIQ 9）——其中 IONIQ 6 N 就翻车：文件名 `IONIQ-6-N-Specification-Sheet-MY27.pdf` 而内文印 `2026`，**取内文**
  - KONA 的 EV 手册脚注 `17. KONA (base - MY26 onwards) …` 说明版本跨 MY、官网未逐版本标 → 整车型仍记「官网无年款」，把这句留依据里
  - PALISADE 的规格表是**图片型**（`pdftotext` 只出 7 字节）→ 依据写「图片型无法抽字，证据不足」，别拿文件名 `2026-palisade` 补
- **车身形式**：接口每条 variant 带 `bodyType` —— 普通 i30 全部 `Sedan`（AU 已无 i30 两厢，sitemap 里的 `/small-cars/i30/hatch/specifications` 是历史页），`i30 N` 全部 `Hatchback`（官网脚注逐字写 `i30 N Hatch 2.0L Petrol Turbo 6-Speed Manual`），`i30 Sedan N` 为 Sedan。⚠ 接口 `categories` 里的 `Hatch & Sedan` 是**官网栏目名**，不是车身形式，别据此判断有 hatch
- **来源**：上述接口 + `https://www.hyundai.com/au/en/shop/calculator/<车型>` + 各车型 `/au/en/cars/<分类>/<车型>`（规格表 PDF 挂在这里）
- **交付结果**：`Hyundai_AU_官网价_20261103_v3.xlsx`，**86 条 / 17 车型**（首版 80 条有 17 行车型名空白 + 79 行名称用错字段，被用户指出后重做；v3 又补了 13 行规格表印出的年款）

---

### Škoda（AU 澳大利亚 `www.skoda.com.au` → 配置器 `cc.skoda-auto.com`：全量 MRDP 在 `GetTrimlinesPrices`，在售范围要拿官网 derivative 目录回筛）✅

- **可达性**：`curl` 直连 200（2026-11-04）。⚠ `cc.skoda-auto.com` 要带浏览器头，**少了 `sec-fetch-*` / `origin` / `referer` 会回 `Invalid use - 100`（HTTP 400）**，容易被误判成「接口需要鉴权」
- **★ 三步取价（一次拿一整个 modelClass 的价）**
  1. `POST https://cc.skoda-auto.com/c3pobe/version`，body `{"country":"AUS"}` → 返回 `"<snapshotVersion>"`（本次 `f8061dd7-…`，**现取**）
  2. `GET /c3pobe/HomepageSelection/?Version=<v>&Country=AUS&Culture=en-AU` → `groups[].tiles[]`，**这就是配置器首页的在售车型卡**，每张带 `title`（`ELROQ MY27` / `KAMIQ MY26`，**年款就写在这**）和 `modelId`
  3. `POST /c3popr/v3/GetTrimlinesPrices`，body `{"Country":"AUS","Culture":"en-AU","ModelYear":<tile modelId 第 3 段>,"ModelClass":<第 4 段前 2 位>,"SnapshotVersion":"<v>"}` → `prices[]`：`{id: trimlineId, price}`
- **★ 价格口径 = MRDP（上路价）**：`GET /c3pobe/disclaimers?Version=<v>&Country=AUS&Culture=en-AU` 首条 `COMMON_1` 逐字写 *Manufacturer's recommended driveaway price (MRDP) … includes the recommended retail price, 12 months private registration, 12 months compulsory third party insurance (CTP), an estimated dealer delivery charge, stamp duty …* → 正是任务要的 drive-away
- **★ `modelClass` 是 2 位车系码，一个码里可能装两个车系**：`NU`→Karoq；`NW`→**Kamiq + Scala**；`5A`→**Enyaq + Enyaq Coupé**；`NZ`→**Superb + Superb Wagon**；`PV`→**Octavia + Octavia Wagon**。`WebModel/Find` 不能传 3 位（报 *must be a string or array type with a maximum length of '2'*）
- **★ 型号名 = `carlineName` + `trimLineName`**（配置器右侧面板标题就是这两段拼接）；`salesGroupname` 有时缺 trim（Kamiq 只回 `Kamiq`），**不要拿它当名**。年款取 `modelYear` 字段（2027 / 2026）
- **★ 在售范围：`Find` 的结果 ≠ 在售**（同 smart DE 的教训）。`NW` 里塞着**已停售的 Scala**、`NU` 里塞着**官网无任何页面的 Karoq 130 Edition**、`NW` 里还有 Kamiq 130 Years Edition → 必须用官网目录回筛：
  - `https://www.skoda.com.au/sitemap-web.xml` → `<loc>…/models/<family>/<variant></loc>`（2026-11 共 31 条）= 在售全集
  - 任一车型页 HTML 里内嵌 `"bodies":[{modelBodyName, derivatives:[{modelName, derivativePage}]}]` 与 `firstLevelTitle/secondLevelTitle/price/labels` → 官网自己的版本目录（31 条，名字 `Kamiq Select` / `Elroq Select 60` / `Kodiaq Hybrid (mHEV)`）
  - 反向也要查：官网有、配置器没有的版本（本次 `Octavia Sportline` 46,990 / `Octavia Wagon Sportline` 47,990）→ 用车型页 `From $X` 补，并在依据注明「配置器未收录」
- **★ 未上市的不出表**：`elroq-sportline` 页面逐字写 *The all-new Elroq Sportline is arriving soon … orders opening in early 2027*，且全站无价 → 剔除
- **交叉校验结果**：28 个双方都有的版本，配置器价与车型页 `From` 价 **100% 一致**（Elroq 49,990/59,990、Enyaq RS 79,990、Kodiaq RS 76,990、Superb Wagon PHEV 66,990…）→ 两个源可互证
- **年款**：`MY26` / `MY27` 印在配置器车型卡标题；Octavia 另有 `MY26 Octavia Spec Sheet` 字样。**官网页面版权年不作依据**
- **★ 主线是配置器（用户口径 2026-11-04）**：车型/版本清单与型号名一律以配置器为第一权威 —— `WebModel/Find` 加 `carLine=<tile 的 carline 码>` 就是该车型卡下的版本全集（KAMIQ 卡 → 3 个：Select / 130 Years Edition / Monte Carlo）。型号名取 `trimLineName` 原文（Kodiaq 是 `mHEV` / `PHEV`，**不要换成官网营销名** `Hybrid (mHEV)` / `Plug-in Hybrid`）；官网车型页只用来**佐证在售**与补配置器未收录的版本
- **⚠ 与 BE 的差异**：BE 的同一端点 `GetTrimlinesPrices` 返回**促销价**（action price，见 `sites/be.md` 并禁用）；AU 返回 MRDP，且与车型页 `From` 100% 对齐 → **以市场实测为准，别跨市场套用**。
- **坑**：① `GetExtrasMonthlyPrice` 对多数配置回 500（金融月供算不出），**与车价无关**，别当取价失败；② `modelPrice` 只在 `GetAllPrices` 里，逐配置调用太重，全量价一律走 `GetTrimlinesPrices`；③ 车系名带重音（`Enyaq Coupé`、`Škoda`），输出保留原写法
- **来源**：`https://cc.skoda-auto.com/c3pobe/{version,HomepageSelection,WebModel/Find,disclaimers}`、`https://cc.skoda-auto.com/c3popr/v3/GetTrimlinesPrices`、`https://www.skoda.com.au/sitemap-web.xml`、各 `/models/<family>/<variant>`
- **★ 在售判断别只看 sitemap 车型页（2026-11-04 被用户纠正）**：`Kamiq 130 Years Edition`（1,5 TSI，MRDP 45,990）与 `Karoq 130 Edition`（1,4 TSI，49,990）**在配置器里可配、有价，却没有任何 `/models/...` 页面**；前者只出现在促销页 `/promotions/offers/kamiq-offers`（逐字 *`Kamiq 130 Years from $81 per week±`* + *`±Based on a driveaway price of $45,990 for new and demonstrator MY26 Škoda Kamiq 130 Years stock vehicles`*），后者只出现在官方库存检索 `/apps/stock/carSearch`（*`130 Edition · $49,990 · Model year: 2026 · 1,4 TSI`*）。→ **判定规则：① 配置器 `trimlines` 有该 trimline（同一 carline 且有首页车型卡）＋ ② 任一官方渠道（车型页 / 促销页 / 库存页）能佐证 → 算在售**；只有 `Scala` 两版是「配置器有价、官网零页面、零促销、首页无卡」（MY26 清库后停售）→ 才剔除
- **★ 逐 carline 的 trimline 清单**：`GET /c3pobe/trimlines/?Version=..&Country=AUS&Culture=en-AU&ModelClass=<2位>&ModelYear=<年>` → `items[]`（`carlineName`/`name`/`salesGroup`/`fuelTypeNames`/`features`）。⚠ 该接口**忽略 `CarLine` 参数**，同一 modelClass 里会混排两个 carline（NW=Kamiq+Scala、NU 只有 Karoq），要按返回的 `carlineName` 自己分组
- **★★ 型号名 = 配置器卡片上的版本名原文（2026-11-04 第三次返工，最终口径）**：先按 `trim + engine` 拼过一版（`mHEV 1,5 TSI m-HEV`、`RS 82 kWh`），又按 `salesGroupname` 推过一版（`Enyaq Select 60` / `Sportline 85`）——**两版都被用户判为错**，因为界面上根本不长这样。以真浏览器逐车系读 `trimline-scenic` 页后确认：
  - 卡片名就是 `trimLineName` 原文：`Select` / `Monte Carlo` / `130 Years Edition` / `Sportline 110TSI` / `Sportline 4x4 140TSI` / `130 Edition` / `mHEV` / `PHEV` / `RS`；**Elroq 例外**，卡片名自带电池号 `Select 60` / `Select 85`
  - 发动机（`1,0 TSI` / `61 kWh`…）是卡片上**紧挨名字的独立字段**，不在版本名里 → **不许拼进型号名**（拼了就和界面不一致）；车型名 + 型号名拼起来正好等于选中卡的标题（`Kamiq` + `Select` = `Kamiq Select`）
  - **★ 校验姿势（最快的真值法）**：`navigate_page` 到 `https://cc.skoda-auto.com/aus/en-AU/start-configuration?carLine=<车型码>&mbvCode=<tile的mbv>&mbvVersion=<tile的版本>&modelYear=<年>&salesGroup=<tile的sg>&step=trimline-scenic`，再 `evaluate_script` 取 `document.body.innerText` 到 `Legal Disclaimer` 之前 —— 一次拿到该车系**全部卡片名 + 各卡价格**（轮播里所有卡都在 DOM，不用点）
- **交付结果**：`Skoda_AU_官网价_20261104_v2.xlsx`，**30 条 / 11 车型**（Fabia 2 / Kamiq 3 / Karoq 4 / Elroq 2 / Enyaq 3 / Enyaq Coupé 2 / Octavia 3 / Octavia Wagon 3 / Superb 1 / Superb Wagon 2 / Kodiaq 5）；燃油 Gasoline 17 / BEV 7 / MHEV 3 / PHEV 3；年款 2027(7) / 2026(23)。⚠ 官网另有 `Octavia Sportline` 46,990 / `Octavia Wagon Sportline` 47,990（`/models/octavia-family/octavia-sportline`，页面标 NEW），**配置器 `PV` 2026 只有 6 个版本、不含它**，且页面未公布动力 → 按「配置器优先」暂不纳入

---

### Volvo（AU 澳大利亚 `www.volvocars.com/au`：Build 页 4 维矩阵 —— 衍生款 × 等级 × 动力 × 主题，主题 `Dark` 只挂在 XC40 Ultra 上）✅

- **可达性**：`curl` 全站 **403**（含 `/au/`、`/au/build/xc40/`）→ 只能真浏览器；站内 `fetch()` 同源可取 HTML/JSON，但价格是点击后客户端算的，必须点
- **任务口径**：页面默认 `Showing pricing for Sydney NSW 2000`（正是要的邮编），价格标签 **Manufacturer's Recommended Drive Away Price\***（= 列表价 + 最高 delivery fee + 印花税 + 12 个月注册 + CTP）
- **★ 4 个维度，少查一维就会漏车**
  1. **衍生款**（页面顶部独立卡片，`role=radio`）：`EX30` / `EX30 Cross Country`、`XC90` / `XC90 Black Edition`
  2. **等级** `stage-level:container`：`Plus` / `Ultra`（有些车型只有 Ultra）
  3. **动力** `stage-powertrain:container`：`B4 Mild hybrid` / `B4 AWD Mild hybrid` / `B5 AWD Mild hybrid` / `T8 AWD Plug-in hybrid` / `P5 Long Range Electric` / `P8 AWD Electric` / `P6 Electric` / `P10 AWD Electric` / `Single Motor Extended Range` / `Twin Motor` / `Single Motor` / `Twin Motor Performance`
  4. **★ 主题**（`Choose your theme`）：**只有 `XC40 Ultra` 有 `Bright`（Standard）/ `Dark`**，`Dark` 加 **$1,050**（69,621 → 70,671）；其余 9 个 build 页均无此维
- **★ 漏项实例（2026-11-04 被用户点名）**：`XC40 Ultra B4 Dark` 就是「Ultra + B4 AWD Mild hybrid + 主题 Dark」，不在等级卡里，只在选完 Ultra 之后出现 → 首版 22 条漏了它
- **页面坐标**：价格 `[data-testid="car-price-offer-price"]`；等级/动力卡在 `stage-level:container` / `stage-powertrain:container`；主题与颜色卡是 `[role=radio]`；结论区 `stage-conclusion:container` 给价格拆解（XC40 Ultra：MRDP 69,621 = 列表价 61,990 + delivery 3,995 + 印花税 2,400 + 注册 1,236）
- **坑**：① 点卡片后价格 **4–5 s 才更新**，而单次 `evaluate_script` 上限 15 s → 一次调用最多点 2–3 次；② 切换衍生款（EX30 CC / XC90 Black Edition）也要等 4 s，点太快会读到旧价（表现为价格不变、等级卡不变）；③ 判断是否点中看 `aria-checked="true"`，别只看价格；④ 年款不在页面上，取配置器链接/接口的 `my=`（EX30/EX40/EX60/EX90/ES90 = 2027，XC40/XC60/XC90 = 2026）
- **build 页清单**：`/au/build/{ex90-electric, ex60-electric, ex40-electric, ex30-electric, es90-electric, xc90-hybrid, xc90, xc60-hybrid, xc60, xc40}/`
- **交付结果**：`Volvo_AU_官网价_20261104.xlsx`，**23 条 / 9 车型**（BEV 11 / MHEV 8 / PHEV 4），postcode 2000 的 MRDP

---

### Infiniti（AU 澳大利亚 `infiniticars.com.au`：官网自己写明「当地新车销售已结束」→ 按退出市场止损，不出表）⛔

- **可达性 / 坑**：`infiniticars.com.au` 的 **TLS 证书名不匹配**（Schannel 报 `SEC_E_WRONG_PRINCIPAL`、curl 000；openssl 是 `unable to verify the first certificate`）→ 要 `curl -kL` 才看得到跳转；`www.infiniticars.com.au` 直接 000（该主机没被服务）。落地页是**全球站** `https://www.infiniti.com/regions/en-au.html`
- **★ 终局证据（逐字）**：en-au 页正文 `Sales of new cars in your location have come to an end. But if you're already an owner, you can still access the dedicated maintenance and ownership support services you'd expect from INFINITI.`；页面标题 `INFINITI Car Service, Repair & Support | INFINITI Australia`；区域选择器 `/regions/selector.html` 的国家数据里 Australia 直接带 **`"sunset":true`**
- **止损三条全中**（见 `../sites.md`「止损判定」）：① en-au 下只剩 `auto-repair.html` / `financial-services.html` / `owners-faq.html` / `Privacy.html`（全售后）② `/regions/en-au/vehicles/qx60.html`、`/regions/en-au/build.html`、`/regions/en-au/sitemap.xml` **全 404**，全球 `sitemap.xml` 只有 342 B 索引 ③ 导航里的 Vehicles（QX80 / QX60 / First-Ever QX65 + `Shop Now`）指向**全球站** `/vehicles/qx60-2026.html` 这类美国页，不是澳洲车型页，**不能拿来当澳洲在售清单**
- **结论**：按「品牌已退出该市场」**不出 8 列表**（不要给 QX 系列写 `官网无价格` 凑行数——那会被读成"澳洲在售但没标价"）。交付说明里列名 QX60 / QX65 / QX80 并引那句 sunset 原文即可
- **来源**：`https://infiniticars.com.au/` →（301）`https://www.infiniti.com/regions/en-au.html`、`https://www.infiniti.com/regions/selector.html`

---

### Chevrolet / GMSV（AU 澳大利亚 `www.gmspecialtyvehicles.com/au-en`：GM 进口商渠道站，全站 0 官方价且官网写明由经销商定价 → 出「官网无价格」表）⚠️

- **站点性质**：GM Specialty Vehicles 是 Chevrolet（+GMC）**经官方授权进口 AU/NZ 右舵版本**的渠道站，同域两个市场 `/au-en/` 与 `/nz-en/`（AEM + Azure blob DAM，`x-vhost: publish`）。**没有配置器、没有 Build & Price、没有价格表页、没有 postcode 门**；CTA 只有 `Locate a Dealer` / `Request a Test Drive` / `Register interest`
- **可达性**：`curl` / `node fetch` 直连 200，`/robots.txt` 也 200，无任何封锁（实测 2026-11-05）
- **在售范围（三源交叉，全部对齐）**：① 导航片段 `/content/chevrolet/oc/au/en/portablenavigation/primary-navigation2/vehicles/vehicles.html` 的 `data-content-id` 只有 `corvette` / `trucks` / `yukon`；② `/au-en/sitemap` 页 34 条内链；③ 官网 FAQ 自述车型数。Chevrolet 侧 = Corvette Stingray / E-Ray / Z06 + Silverado 1500 LTZ Premium / 1500 ZR2 / 2500 HD；猜路径 `tahoe|suburban|camaro|colorado|silverado|gmc/sierra` 全部 404（404 页恒 22270 字节，好认）
- **取价源**：**无。** 32 个 `/au-en` 页面全文 `$ 开头的金额串` **0 命中**；3 份官方产品飞标 PDF 只有装备与规格、无价格；全站唯一的集团接口 `/content/gm/api/services/colorizerContent?path=…` 只回等级/颜色（`trims[].name`、`exteriors[]`），**没有任何金额字段**
- **原文**（逐字，判「官网无价格」的铁证）：
  - `Corvette prices differ by model and features. Please visit your local GMSV Dealer for pricing information.`（/au-en/chevrolet/corvette FAQ）
  - `Available options and prices vary by vehicle it's best to ask your local GMSV Dealer for the specifics.`（/au-en/chevrolet/trucks FAQ）
  - `Prices and colours may vary by model.`（/au-en/chevrolet/corvette/z06 图片注）
  - Current Offers 只有非现金权益：`Silverado Offer 3 Years Free Scheduled Servicing. T&Cs apply.`
- **对照实验**（证明是渠道定价、不是抓取失败）：同代码的 **NZ 站 `/nz-en/` 全部车型页同样 0 价格**；官方商城 `www.gmsvstore.com.au` 只卖服饰配件（`$99.95` 之类），不卖车
- **年款在哪**：① Silverado 1500 两个车型页 `WEIGHT & TOWING` 段末逐字 `Figures shown apply to MY26i Silverado 1500 LTZ Premium only.` / `…MY26i Silverado 1500 ZR2 only.`；② **2500 HD 页面内没有任何 MY 表述**，年款只印在官方飞标 PDF **内文抬头** `MY26 Equipment & Features`；③ Corvette 三车页面均无 MY 字段，靠正文年份+车型：`The 2026 Corvette Stingray comes with signature seats and wheel designs…`、`The 2026 Corvette E-Ray comes standard with…`、Z06 首屏标题 `2027 CORVETTE Z06`
- **坑**：
  1. 页脚 `©2026 General Motors. All rights reserved.` 是**版权年**、offers 脚注 `delivered between 1 October 2026 and 31 December 2026` 是**活动生效期**、图片注 `2025 Overseas model Z06 shown` 是**展示车年份** —— 三者都不能当年款
  2. DAM 路径 `/index/2026/performance/corvette/e-ray/…`、`/index/2027/…/2027-corvette-z06/` 与飞标文件名 `MY26i-…` 只作旁证；**E-Ray 在 2026、Z06 在 2027，两代年款并行**，不要一个年份盖全部
  3. 等级只在该站的 FAQ 里逐字给全：`Stingray is offered in 2LT, 3LT trims and available in both Coupe or Convertible body styles. Z06 and E-Ray are available in the 3LZ Coupe configuration only.` ⚠ 这句会让人排成 2LT/3LT × Coupe/Convertible 四行，但车型页更具体的一条是 `Available in 3LT, the Stingray convertible features a power-retractable roof…`，且 2LT 清单里是 `Body Colour Non-Transparent Roof` → **按具体源，不排 2LT Convertible**（3 行）
  4. 同一台车两套动力写法：车型页 `6.2L EcoTec3 V8 Engine` / `Duramax © 6.6L Turbo-Diesel V8`，Trucks 总览页 `6.2L EcoTec 3 V8 Engine`（**EcoTec 3 带空格**）/ `6.6L Duramax Turbo Diesel V8 Engine`；取逐字即可，别自己统一
  5. **E-Ray 归 HEV 不是 PHEV**：全站只写 `electrified propulsion system` / `electrified all-wheel drive technology`，`plug-in`、`rechargeable` 0 命中；但它有纯电模式（`drive solely using electric power for 6-8 kilometers at speeds up to 72km/h`）→ 既不是 MHEV 也不是 PHEV，落 HEV
  6. 本机 DLP：`curl` 落的 PDF 与 `pdftotext` 落的 `.txt` 都被套壳成 `%TSD-Header-###%`；**node fetch 到内存再写 `.bin`（pdftotext 吃 `.bin`，输出走 stdout `pdftotext x.bin -`）可绕过**
- **未纳入**：GMC Yukon Denali（同站另一品牌，首屏 `INTRODUCING THE ALL-NEW 2025 GMC YUKON DENALI`，同样全站无价）—— 本次 URL 是 `/au-en/chevrolet`，按品牌只出 Chevrolet
- **实测**：2026-11-05
- **来源**：`https://www.gmspecialtyvehicles.com/au-en/chevrolet`、`…/au-en/chevrolet/corvette`、`…/corvette/{stingray,z06,e-ray}`、`…/au-en/chevrolet/trucks`、`…/trucks/{silverado-ltz-premium,silverado-zr2,silverado-2500hd}`、`…/au-en/current/offers`、飞标 PDF `…/2023-silverado-ltz-premium/02-pdf/MY26i-Silverado-1500-LTZ-Premium-Product-Flyer-(AU)-(1).pdf`、`…/2026/trucks/silverado-zr2/01-pdf/MY26i-Silverado-1500-ZR2-Product-Flyer-(AU)-(1).pdf`、`…/2024-silverado-hd/secondary-nav/01-pdfs/my26-silverado-2500-hd-ltz-premium-product-flyer-au.pdf`
- **交付结果**：`Chevrolet_AU_官网价_20261105.xlsx`，**8 条 / 5 车型**，MSRP 全部 `官网无价格`；燃油 Gasoline 6 / HEV 1 / Diesel 1；年款 2026(4) / 2027(1) / MY26i(2) / MY26(1)


---

### Citroën（AU 澳大利亚 `www.citroen.com.au`：官网逐字声明 2024-11-01 起停止澳洲新车销售、只剩售后 → 按退出市场止损，不出表）⛔

- **结论铁证（逐字，实测 2026-11-05）**：`Citroën Australia has announced it will exclusively support the vehicle maintenance and servicing requirements of Australian customers effective 1st November 2024, following the cessation of new vehicle sales in the local market.`
  来源：`https://www.citroen.com.au/about-citroen/news/citroen-announcement.html`（页面标题 `Citroën News: Citroën Announcement`，文内日期行 `15/08/2024`）
- **现状自证**：首页 H1 `CITROËN IS STILL AT YOUR SERVICE` + 正文 `Citroën Australia remains at the service of our customers, and we are ready to support your servicing needs via 35 authorised Service Centres across Australia.`；页脚是 `Citroën 2026` → 站是活的、声明是当前口径，不是旧闻
- **导航与全集核对**：主导航只有 `Maintain / Owners / Support`（片段 `/navigation-partials/primary-navigation/{maintain,Owners,Support}.html`）；`/sitemap.xml` 共 **48 条 URL，0 个新车页**——`/owners/{c3,c4,c5-aircross-suv,c5-x,c5-x/hybrid}.html` 与各自 `/specifications.html` 是**车主手册与规格页**，`/buy/*` 两条其实是 `citroen-financial-services` 与 `citroen-assistance`（不是买车页）
- **全站无整车价**：46 个页面逐页 origin-fetch 扫金额，唯一出现 `$` 数字的是 `/maintain/servicing-with-citroen/service-plans.html` 的**预付保养套餐价**（`$407 / $688 / $1,000 / $1,400 / $1,700`），0 个车型价；`findadealer.citroen.com.au` 标题是 `Find a Citroën Service Dealer Near You`，分类只有 Service / Parts
- **⚠ 遗留文案别当成在售证据**：`/owners/c5-x/hybrid.html` 仍留着停售前那段营销文 `ALL-NEW CITROËN C5 X PLUG-IN HYBRID / Introducing the New Citroën C5 X Plug-In Hybrid, exclusively available by customer order.`，还带 `BUILD & PRICE` 与配置器深链 `https://configurator.citroen.com.au/build-and-reserve/build/vehicle/?model_id=405&dp=2765`、`…/build/find/?model_name=C5+X&dp=2000`；同页下方残留法文 `Configurez` / `Demandez une offre`（模板从 FR 站带过来的没删）→ 判为**过期页面**，别据此出表
- **封锁形态（与 SEAT BE / Hyundai AU 都不同，值得记）**：
  1. `www.citroen.com.au` **curl 连 `/robots.txt` 都是 403**（376–506 字节的 Akamai 错误页），`/content/dam/**.pdf` 与 `/etc.clientlibs/**.js` 也 403 —— 这个站**静态资源一样拦**（不要套 Hyundai AU「PDF 放行」的经验）
  2. **真浏览器能通**，且进去后**同源 `fetch()` 可以拿全站任意页面与 sitemap**（200）→ 本市场正解：browser MCP 开主页建指纹，再用 `evaluate_script` 逐页 origin-fetch；`node fetch` / `curl` 一律 403
  3. `configurator.citroen.com.au`：TCP 443 通、**TLS 握手立即被断**（openssl 显示 `Protocol: TLSv1.3` 但 `Cipher is (NONE)`；Chrome `ERR_SSL_VERSION_OR_CIPHER_MISMATCH`；node TLS1.2/1.3 都 `ECONNRESET`）= **SNI 级封锁**（AWS Global Accelerator `99.84.x`），本机出口（CN）无解；但 `http://` 80 端口返回 403 说明主机本身在线，只是我们进不去 TLS —— 出表结论**不依赖**它（品牌自己的停止销售声明已足够）
- **为什么不按 `官网无价格` 出表**：`官网无价格` 的语义是「该品牌在此市场在售、但官网不标价」（GMSV 就是这么出的）；Citroën 是**已退出新车销售**，出表会被读成"还有 5 个车型在售只是没价" → 与 Infiniti AU 同类，**只列名不出表**
- **未纳入（点名）**：C3 / C4 / C5 Aircross / C5 X / C5 X Plug-In Hybrid —— 官网 `/owners/` 下仅剩售后资料，无在售身份、无价格，不进表
- **实测**：2026-11-05
- **来源**：`https://www.citroen.com.au/`、`https://www.citroen.com.au/about-citroen/news/citroen-announcement.html`、`https://www.citroen.com.au/sitemap.xml`（48 条）、`https://www.citroen.com.au/owners/c5-x/hybrid.html`、`https://www.citroen.com.au/maintain/servicing-with-citroen/service-plans.html`、`https://findadealer.citroen.com.au`
- **交付结果**：**不出表**（退出市场止损）；用户若坚持要这 5 个车型的历史官方价，需另找停售前发布的官方价目文件，第三方/媒体价不得冒充 MSRP
