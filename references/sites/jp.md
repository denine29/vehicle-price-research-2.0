# 日本 JP — 站点坑位详段

> 市场码 JP · 2 段 · 品牌：Mazda / Nissan
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-11-06 · 文中 slug / 价格均为当时实测值，必须现取
> ⚠ 本市场口径：**メーカー希望小売価格（消費税込）= 税込建议零售价**，不含诸费用；输出 `--money comma`（无小数、无¥符号）

---

### Mazda（JP 日本 `www.mazda.co.jp`：`/grade/` 页 SSR 直出「グレード×駆動×変速機×税込価格」，curl 全通）✅

- **可达性**：`curl` 直连 200（2026-11-06），**无反爬**；纯 SSR，不需要浏览器
- **车型清单**：`https://www.mazda.co.jp/cars/` → 链接形如 `/cars/{passenger|light-vehicle|commercial}/<slug>/`。页面顶部还带每个车系的「¥X〜（消費税込）」起价，可直接用来**反向校验最低价**
- **取价源**：每个车系的 `…/<slug>/grade/` 页（**不是**车系首页）。结构极规整：
  ```html
  <h2 class="cmp-grade-and-spec-data__title">20C</h2>
  <h3 class="cmp-grade-and-spec-data__subtitle">e-SKYACTIV G 2.0</h3>
  <li class="cmp-grade-and-spec-data__variant">
    <div class="cmp-grade-and-spec-data__variant-name">（2WD | 6EC-AT）</div>
    <div class="cmp-grade-and-spec-data__variant-price"> ¥2,640,000 <span>（消費税込）</span></div>
  ```
  → 按 `__title` 切块，块内取 `__subtitle`（发动机）与每个 `__variant`（驱动｜变速器 + 价格）
- **★ 型号名 = `グレード + 駆動 + 变速器`**（官网变体名就是「（2WD | 6EC-AT）」这种括号串）；同一グレード可有多驱动/多变速器，**价格不同必须分开出行**（如 ROADSTER `S Special Package` 6MT 3,146,000 / 6EC-AT 3,267,000）
- **★ 一页装两个车系**
  - `passenger/mazda3/grade/` 同时有 **MAZDA3 FASTBACK** 与 **MAZDA3 SEDAN**：每个 grade 块内部带「MAZDA3 FASTBACK/SEDANを確認しますか？」文案 → **按块内文案判车身**（块内 SD 命中 > 0 即 SEDAN），别用全页搜索（导航里两个名字都有）
  - `passenger/roadster/grade/` 同时有 ROADSTER 与 **ROADSTER RF**：RF 的 grade 名以 `RF ` 开头 → 拆成两个车系，输出时把 `RF ` 前缀去掉（车型已写 ROADSTER RF）
  - `passenger/mazda3-sedan/`、`passenger/roadster-rf/` 的 `/grade/` 是 **404**，别单独抓
- **★ 新老同堂**：`passenger/cx-5/`（新型，S/G/L 三档）与 `passenger/cx-5_kf/`（KF，14 档）**同时在售**，两个页面标题都叫「MAZDA CX-5」→ 用 `CX-5` / `CX-5 (KF)` 区分，勿合并
- **★ 重复块**：同一 grade 在页面里会渲染两遍（PC/SP）→ 按 `车系+grade+驱动+变速器` 去重。⚠ **但 MAZDA2 的 `15 BD i Selection II インパネ：グロスブラック/グロスライトブルー/ピュアホワイト` 是三个独立グレード（同价也是三条）**，不能当内饰色合并 —— 按官网原名出 3 条（英文写作 `Instrument Panel: Gloss Black / Gloss Light Blue / Pure White`），每个还有 2WD/4WD
- **★ 主 grade 页不含全部グレード**：`/grade/` 页只列常规グレード，**特设グレード在子页** —— `passenger/roadster/grade/nr-a/`（NR-A，2WD(FR) 6MT，3,124,000）、`passenger/mazda2/grade/15mb/`（15MB，2WD 6MT，1,768,800）；这两页结构同主页面（`cmp-grade-and-spec-data__*`），抓的时候要遍历 `/grade/<sub>/` 链接。`cx-30/grade/sedv/`、`flair-wagon/grade/slope/` 是**福祉車両**，不要纳入
- **燃油判据（逐字，2026-11-06）**
  | 官网字样 | 归类 | 例 |
  |---|---|---|
  | `e-SKYACTIV G`（SKYACTIV-G + M HYBRID） | **MHEV** | CX-30 全系、CX-5 新型、MAZDA3 25S/25L/SEDAN 20S |
  | `e-SKYACTIV X`（页内写 マイルドハイブリッド） | **MHEV** | MAZDA3 X Touring |
  | `SKYACTIV-G`（不带 e-） | Gasoline | CX-5 (KF) 20S/25S、MAZDA3 15C/15S、MAZDA2、ROADSTER |
  | `SKYACTIV-D` | Diesel | CX-5 (KF) XD、CX-60/80 XD |
  | `e-SKYACTIV D`（48Vマイルドハイブリッド） | **MHEV** | CX-60/80 XD-HYBRID |
  | `e-SKYACTIV PHEV` | PHEV | CX-60/80 PHEV |
  | `e-SKYACTIV R-EV` | **REEV** | MX-30 ROTARY-EV |
  | `HYBRID` 前缀 + 页内写 `マイルドハイブリッド` | **MHEV** | CAROL HYBRID C/G |
  | 只有 `ハイブリッド`、无 mild 字样 | HEV | FLAIR HYBRID XS |
  | `660 DOHC VVT`（轻自动车，无混动字样） | Gasoline | FLAIR WAGON / FLAIR CROSSOVER / SCRUM WAGON / CAROL C·G |
- **年款**：所有 `grade` 页 **无「年式」「年モデル」「MY\d\d」**（全站检索 0 命中）→ 一律 `官网无年款`；页内出现的 `2026年10月生産開始予定` 是**车色投产日**，不是年款
- **坑**：① 404 页统一约 82 KB，按大小过滤即可跳过；② 车系首页也有大量 `¥` 数字（导航里各车型的起价），**别在首页抓价**；③ `commercial/` 下 9 个商用车（BONGO/FAMILIA/TITAN 等）**没有 `/grade/` 页**，只有 PDF 规格表（日文为 CID 编码，`pdftotext` 抽不出字），本次未纳入；其中 `BONGO TRUCK` 官网写「お取り扱いを休止しています」、`TITAN LHR/LHS` 写「価格は販売店にご確認ください」
- **来源**：`https://www.mazda.co.jp/cars/`、各 `https://www.mazda.co.jp/cars/<分类>/<slug>/grade/`
- **交付结果**：`Mazda_JP_官网价_20261106.xlsx`，**146 条 / 25 车系**：17 个乘用/轻车系 138 条（逐グレード）+ 商用车 5 款按官方车系起价各 1 条（FAMILIA VAN 1,974,500 / SCRUM VAN 1,354,100 / BONGO VAN 1,923,900 / BONGO BRAWNY VAN 2,997,500 / SCRUM TRUCK 1,227,600）+ TITAN LHR/LHS·TITAN·TITAN DUMP 各 1 条 `官网无价格`（官网逐字 `※価格は販売店にご確認ください`）；燃油 Gasoline 76 / MHEV 35 / Diesel 21 / PHEV 4 / REEV 2 / HEV 2 / 未标注 6

---

### Nissan（JP 日本 `www3.nissan.co.jp`：`version-explorer` JSON 出グレード名，价格在车种页内嵌 `individualVehiclePriceJSON`）✅

- **可达性**：`curl` 直连 200（2026-11-06）；首页 301 到 `www.nissan.co.jp`，**车型页/JSON 都在 `www3` 域名下**
- **车型清单**：`https://www3.nissan.co.jp/sitemap.xml` → `index.pages-sitemap.xml` → 取 `…/vehicles/new/<slug>.html`（2026-11 共 21 个 slug）
- **★ 两段拼数据**
  1. **グレード名 / 版本全集**：`https://www3.nissan.co.jp/content/nissan_prod/ja_JP/index/vehicles/new/<slug>/version-explorer/jcr:content/core.versionexplorerdata.json` → `versions[]`（`key` / `name` / `gradeId`）
  2. **税込価格**：车种页 `<slug>.html` 里内嵌 `<iframe id="individualVehiclePriceJSON">` 的 JSON → `[<model>_admin]["Retail with VAT"]` → `grades[gradeId].gradePrice`（**Note/Wagon 等有 `versions`，Serena/X-Trail 只有 `grades`，两种都要兼容**）
  - `versionexplorerdata.json` 的 `general.priceType` 直接写着 `Retail with VAT` → 这就是税込口径
- **★ 车种页的 price JSON 有错挂（2026-11 实测）**：`dayz`/`skyline` 页里挂的是 `dayz_rider`、`elgrand`/`leaf` 页里挂的是 `new_roox` —— **必须核对 JSON 的顶层 key 与车型是否一致**；不一致的 4 个车型（dayz/elgrand/leaf/skyline）改走浏览器读配置器：
  `https://www3.nissan.co.jp/vehicles/new/<slug>/version-explorer/configurator-v3.html`，在页面里按行取 `名称 / メーカー希望小売価格 / X,XXX,XXX 円` 三元组
- **★ 型号名**：`versions[].name` 原文（`X（2WD）`、`ハイウェイスターX プロパイロットエディション（2WD）`、`バン DX（2WD・ガソリン）…`）；**只把全角括号换成半角**，拉丁部分（`X`/`G`/`e-4ORCE`/`NISMO`/`AUTECH`/`ROCK CREEK`）原样保留；官网**没有英文版车型名**，日文部分不硬翻
- **燃油判据**
  | 车型 | 归类 | 依据 |
  |---|---|---|
  | ARIYA / LEAF / SAKURA | BEV | 页面标 EV / 電気自動車 |
  | NOTE / AURA / KICKS / ELGRAND / X-TRAIL | **HEV** | 全系 e-POWER（X-Trail 页 schema.org 逐字写 `1.497L (HYBRID)`；2WD 与 e-4ORCE 都是 e-POWER） |
  | SERENA | 名称含 `e-POWER`/`e-4ORCE` → HEV，其余 Gasoline | `X 2,789,600` vs `e-POWER X 3,320,900` 两套价并存 |
  | CARAVAN | 名称含 `ディーゼル` → Diesel，含 `ガソリン` → Gasoline | 名称里逐字标注 |
  | DAYZ / ROOX / NV200 VANETTE / Z / SKYLINE / CLIPPER 系 | Gasoline | 660cc / 2.0T / 3.0T 汽油 |
- **年款**：车种页、价格 JSON、version-explorer JSON 全文检索「年式/年モデル/MY」**0 命中** → 一律 `官网无年款`
- **坑**：① `clipper_ev/clipperrio/clippertruck/clippervan` 与 `murano` **没有 version-explorer**（404），Clipper 四款官网只给车系起价（`…円 ～`）→ 按车系级各出 1 行；`murano` 页面无任何价格 → 不出表；② `caravan_private` 是 Caravan 的私用版页面（同一车型，勿重复出行）；③ `dayz`/`skyline` 的错挂 JSON 若直接取会拿到别车型的价格，是本站最大陷阱；④ 轻型车（DAYZ/ROOX/CAROL 类）价格是税込，但不含法定费用
- **来源**：`https://www3.nissan.co.jp/vehicles/new/<slug>.html`、`…/version-explorer/jcr:content/core.versionexplorerdata.json`、`…/version-explorer/configurator-v3.html`
- **交付结果**：`Nissan_JP_官网价_20261106.xlsx`，**247 条 / 19 车系**（ARIYA 6 / AURA 15 / CARAVAN 50 / DAYZ 20 / ELGRAND 6 / KICKS 12 / LEAF 10 / NOTE 8 / NV200 VANETTE 18 / ROOX 20 / SAKURA 3 / SERENA 49 / SKYLINE 4 / X-TRAIL 14 / Z 8 / CLIPPER 4 款各 1 条车系级）；燃油 Gasoline 115 / HEV 82 / Diesel 30 / BEV 20
