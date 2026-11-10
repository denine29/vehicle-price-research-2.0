# 日本 JP — 站点坑位详段

> 市场码 JP · 9 段 · 品牌：Mazda / Nissan / Subaru / Volvo / Hyundai / Chevrolet / Citroën / Maserati / McLaren
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-11-10 · 文中 slug / 价格均为当时实测值，必须现取
> ⚠ 本市场口径：**メーカー希望小売価格（消費税込）= 税込建议零售价**，不含诸费用；输出 `--money comma`（无小数、无¥符号）
> ⚠ 本市场三条通用坑（JP 九站实测）：① **型号名必须用界面渲染文本**——Mazda=`グレード+駆動+変速機`、Subaru=`txt-3l`（**不用 `img alt`**）、Nissan=`versions[].name`、Maserati=`SHORT_MODEL_DESCRIPTION`；接口里的 `name` 常是内部码；② **年款**：JP 站基本不标，页面 `年式` 多是影像免责声明，PDF 文件名/版权年/`2026.09` 改订日期都不算；Subaru 的 PDF 是 Adobe-Japan1 CID，抽不出字要如实写；③ **价格**：只取 `メーカー希望小売価格（消費税10%込）`，月供/残価/车漆加价都不是车价。

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

> **英文版交付（2026-11-06）**：`Nissan_JP_Official_Price_20261106_EN.xlsx` —— 247 条全英文（表头 / 年款 `Not stated` / 是否停销 `No` / 燃油 `Not specified` / MSRP `Not published` 都英文化），グレード名按官网语义罗马化，映射表：
> ハイウェイスター→Highway Star、アーバンクロム→Urban Chrome、プロパイロットエディション→ProPILOT Edition、ブラックパッケージ→Black Package、プレミアムGX→Premium GX、ボレロ→Bolero、XVパッケージ→XV Package、防水シート車→Water-repellent Seats、RECARO製スポーツシート装着車→with RECARO Sport Seats、NissanConnectインフォテインメントシステム装着車→with NissanConnect Infotainment System、バン→Van、ワゴン→Wagon、ロングボディ/Super Long Body、標準幅/標準ルーフ/ハイルーフ/低床→Standard Width/Standard Roof/High Roof/Low Floor、◯人乗→◯-seat、◯ドア→◯-door、[2列]/[3列]→[2-row]/[3-row]、ガソリン/ディーゼルターボ→Gasoline/Diesel Turbo；`（車系起价）`→`From price (grade list not published)`。**「年式」等检索词在依据表里保留日文原文**（那是证据，不是内容）

---

### Subaru（JP 日本 `www.subaru.jp`：`/carlineup/` 出全集 28 卡，价格只在各车系 `/grade/` 页 SSR 直出，curl 全通）✅

- **可达性**：`curl --ssl-no-revoke` 直连 200（实测 2026-11-09），`/robots.txt` 也 200，**无反爬**；纯 SSR，不需要浏览器
- **车型全集**：`https://www.subaru.jp/carlineup/` → **28 张卡 / 6 个 tab**（normal 12・stisport 3・special 2・kei 6・commercial 2・welfare 3）。卡片结构：
  ```html
  <div class="item" data-car-id="11" data-model-id="rex_rex">
    <a href="/rex/" class="lineup-panel label-endofsale">
  ```
  ⚠ **别要求 `data-car-id`**：stisport / special 的卡只有 `data-model-id`，加了这条过滤会少 5 张（23 ≠ 28）。按 `<div class="item"([^>]*)>` 全量切
- **取价源**：每个车系的 `https://www.subaru.jp/<slug>/grade/`（**不是**车系首页）。结构极规整：
  ```html
  <div class="grade-nml-box">
    <div class="box-img"><img … alt="クロストレック　Premium S:HEV EX"></div>
    <p class="txt-xs">e-BOXER（ストロングハイブリッド）</p>      ← 动力标签
    <p class="txt-3l mt-xxs">Premium S:HEV EX</p>              ← グレード名（权威）
    <p class="txt-b mt-s">メーカー希望小売価格</p>
    <div class="ttl-price-box">
      <div class="ttl-box"><p>AWD</p></div>                    ← 駆動 / 変速機
      <p class="price"><span class="num" lang="en">4,053,500</span><span class="sub">円 (税込)〜</span></p>
  ```
  → 按 `grade-nml-box` 切块，块内取 `txt-xs` + `txt-3l` + 每个 `ttl-price-box`
- **★ 型号名 = `动力标签 + グレード + 駆動/変速機`**（按界面层级顺序拼，三段都逐字保留）；同一グレード多駆動/多変速機**价格不同必须分开出行**（BRZ `STI Sport` MT 3,839,000 / AT 3,872,000；サンバー `TB` MT 2WD 1,094,500 / MT 4WD 1,226,500 / CVT 2WD 1,149,500 / CVT 4WD 1,303,500）
- **★ `<br>` 必须还原成空格**：駆動标签原文是 `<p>MT<br>2WD</p>`，直接去标签会得到 **`MT2WD`（错）**，正确是 `MT 2WD`。サンバートラック/サンバーバン 全部 32 行都踩这个坑
- **★ `img alt` 会滞后，只能用 `txt-3l` 渲染文本**：`/levorg-layback/grade/` 的 alt 写 `レヴォーグ レイバック　Smart Edition EX` / `…GT-H EX`，但渲染出来的 `txt-3l` 是 **`Limited EX` / `Black Selection`**（HTML 注释与渲染文本一致，alt 是旧版残留）。按 alt 出表会写错型号名
- **★ 车系名取 `/grade/` 页的 `<h1>`/`<title>`，不是 lineup 卡名**：`レヴォーグ レイバック`（`/levorg-layback/`，ガソリン）与 `レヴォーグ レイバック（S:HEV）`（`/levorg-layback-wagon/`）是**两个独立车系两个 URL**；lineup 卡名是营销拆分（`レイバック` / `レイバック（S:HEV）`）
- **★ lineup 28 卡里有 8 张是营销重复卡**，要折进母车系、别重复出行：`levorg_stisport`→レヴォーグ `STI Sport EX`、`brz_stisport`→SUBARU BRZ `STI Sport`、`wrx_s4_stisport`→WRX S4 `STI Sport R EX`、`forester_special_sport_blackselection`→フォレスター `SPORT EX Black Selection`、`chiffon_custom`/`chiffon_try`→シフォン `R`/`TRY`、`sambar_dias`→サンバーバン `ディアス`。佐证：`estimate.js` 里 `chiffon_custom`→`chiffon`、`stella_custom`→`stella`、`justy_custom`→`justy`（カスタム 只是营销分组，不是独立车型；`/chiffon/custom/` 301 回 `/chiffon/`，页面内 `カスタム` 0 命中）。**只有 `wrx_special_stisportsharp` 是真新增**（见下）
- **★ 5 个 `/grade/` 子 URL 是 404，且都恰好 12060 字节**：`/levorg/stisport/`、`/brz/stisport/`、`/wrx-s4/stisport/`、`/sambar-van/dias/`、`/chiffon/try/` → **按字节数过滤**即可跳过，它们的グレード都在母页上
- **★ grade-comparison JSON 是「税抜」且可能滞后，只作交叉校验不作价格源**：`/crosstrek/grade-comparison/json/crosstrek_grade.json` 的 `grade_data[].price[0].value = "3485000"` → **×1.1 = 3,833,500** 正好等于 `/grade/` 页税込价（`3685000×1.1=4,053,500` 同理）。但 `chiffon_grade.json` 的价**全部偏低且滞后**（L 写 1,360,000，`/grade/` 页是 1,496,000）→ **一律以 `/grade/` 页为准**（它还与 carlineup 起价逐车吻合）
- **★ WRX STI Sport♯ 不在任何 `/grade/` 页上**，只在广告页：`https://www.subaru.jp/advertising/wrx/stisportsharp/`，逐字 `WRX STI Sport♯ ［WRX S4 STI Sport R EX特別仕様車］` / `2.4L DOHC 直噴ターボ “DIT” 6MT AWD（常時全輪駆動）` / `希望小売価格（消費税10%込） 6,105,000円` / `消費税抜き価格5,550,000円` / `600台限定 抽選エントリー期間： 2026年4月9日〜5月17日`。归 WRX S4 车系；**抽選受付已结束**（2026-05-17 < 采集日）→ 停销记 `是`；`サンライズイエロー［特別設定色］（55,000円高・消費税10%込）` 是车漆选装，**不采**
- **停销判据（两处，都要）**：① carlineup 卡的 `class="lineup-panel label-endofsale"` —— 全站**恰好 3 张**：`rex_rex` / `wrx_s4` / `wrx_s4_stisport`；② 车系页**渲染出来的** `<p class="notice-txt">`，逐字 `掲載の現行モデルは生産終了に伴い、販売店での在庫対応のみとなります。`（rex）、`現行モデルについては、生産終了に伴い販売店での在庫対応のみとなります。また、現行モデルを以ってWRX S4 STI Sport グレードの展開を終了いたしました。`（wrx-s4）
  ⚠ **`/transcare/lineup/sambar_dias.html` 里同样的「生産終了」句子被 `<!-- … -->` 包住了（`<div class="endoforderArea">` 整块注释掉）→ 不是渲染文本，不能当停销证据**。判定前先查 `lastIndexOf('<!--') > lastIndexOf('-->')`
- **★ 生産終了 e-BOXER 旧グレード要入表，但官网整条链路无价**：`/crosstrek/previous-grade/`（4 档：`e-BOXER Touring` / `Limited` / `Limited Black` / `Limited Style Edition`）、`/impreza/previous-grade/`（5 档：`e-BOXER ST-G` / `ST-H` / `ST-H Style Edition` / `ST-H STI Performance Edition` / `ST-H STI Performance Edition （STI Performance Edition PLUSパッケージ装着車）`）。页面 `<title>` 逐字 `e-BOXERモデル（生産終了・在庫販売） | クロストレック | SUBARU`；正文只有 `2.0Lエンジン車（e-BOXER）は、生産終了に伴い販売店での在庫対応のみとなります。`，**0 个 `ttl-price-box`**，页内 `円` 只有车漆加价 `（33,000円高・消費税10%込）`；`estimate.js` 里这些グレード名 0 命中；prev 页无 PDF 链接 → **`官网无价格` + 停销 `是` + 燃油 `未标注`**（官网只写 `2.0Lエンジン車（e-BOXER）`，无电机输出、无 EV モード、无「ハイブリッド」字样，封闭词表判不出，**别拿 BE 市场的 e-BOXER 12,3 kW 证据跨市场套**）
- **★ 福祉車両（トランスケア）3 卡全站无价** → `官网无价格`、停销 `否`。车名取 img alt 逐字：`福祉車両：シフォン トランスケア ウイングシート（助手席リフトタイプ）` / `福祉車両：シフォン トランスケア スロープタイプ` / `福祉車両：サンバー ディアス トランスケア スロープタイプ`；页面只给 `排気量 0.66L` / `乗車定員 4名` / `駆動方式 2WD/4WD` / `変速機形式 CVT`，`価格` 二字 0 命中
- **燃油判据（逐字，2026-11-09）**
  | 官网字样 | 归类 | 依据（`/<slug>/driving/` 技术页逐字） |
  |---|---|---|
  | `e-BOXER（ストロングハイブリッド）` | **HEV** | `シリーズ・パラレル方式のハイブリッドシステム`；`街中での頻繁な発進・低速時はモーターのみで走り、高速道路を一定の速度で走る場合にはエンジンを使うなど、エンジンとモーター、それぞれの得意な領域に合わせて動力源を切り替えます。`；`■EVドライブモード 約30km/h以下で車両の状態が条件を満たしている場合、スイッチ操作でモーターのみでの走行モードに切り替えられます。` → **有 EV 模式故不是 MHEV**、发动机直接驱轮故不是 REEV、无外部充电故不是 PHEV |
  | `e-SMART HYBRID`（レックス G/Z HYBRID） | **HEV** | `バッテリーとエンジンでの発電を組み合わせて、100%モーターで走行。`；`低速域ではエンジンをかけず、バッテリーだけでモーターを駆動し、夜間や早朝も静かに走行できます。`；`※ e-SMART HYBRIDはe-BOXER（ストロングハイブリッド）とはシステムが異なります。` → 串联结构，但**官网无 `range extender`/`増程` 字样**，按 closed 顺序落 ④ HEV（与本市场 Nissan e-POWER 同口径） |
  | `ガソリン` | Gasoline | 卡片 `txt-xs` 逐字 |
  | `BEV`（ソルテラ / トレイルシーカー） | BEV | 卡片 `txt-xs` 逐字 |
  | `2.0Lエンジン車（e-BOXER）`（生産終了旧档） | **未标注** | 见上，官网无电机/EV/混动字样 |
- **年款**：**全部 `官网无年款`**。查过 `/grade/`・车系页・`/specification/`・`/carlineup/`・`estimate.js`・grade-comparison JSON，`年式/年モデル/モデルイヤー/MY\d\d/Model Year` **0 命中**。
  ⚠ **17 份 `specifications.pdf` 是 Adobe-Japan1 CID 编码**，`pdftotext -layout` 报 `Syntax Error: Unknown character collection 'Adobe-Japan1'`，**日文字形抽不出、只有拉丁字母与数字可读**（这点必须如实写进依据，不能当"已验证无年款"）。可抽出文本里：页脚逐字 `2026.09`（brz `2026.07`、forester `2026.05`、levorg `2026.06`、rex `2026.04`、sambar-truck `2026.03`、sambar-van `2026.11`、stella `2026.08`、wrx-s4 `2025.10`/`2026.01`）是**文档改订日期 YYYY.MM，不是年款**；グレード名拉丁部分可读（`Premium S:HEV` / `R S STI Sport` / `L G R RS`），**无任何价格数字**
  ⚠ HTML 里的 `年式` 全部是影像免责声明：`※ 映像中の車両にはオプション装着車、プロトタイプ、旧年式車、ダミー車、海外仕様車、他車種等が含まれている場合があります。`（15 个车系命中）与 `写真は旧年式車` → **不是年款**；`forester2025` 只出现在 `/3d_assets/forester/forester2025/…` 资源路径与内部 id，**不是公布的年款**
- **价格口径（逐字，`/grade/` 页注记）**：`※ 記載価格はメーカー希望小売価格に消費税10%が含まれた総額表示です。` / `※ メーカー希望小売価格は参考価格です。販売価格は各販売店が独自に決めていますので、それぞれにお問い合わせください。` / `※ 価格にはオプションは含まれておりません。` / `※ リサイクル料金、税金（消費税を除く）、保険料、登録等に伴う諸費用等は別途必要となります。` / `※ 価格はタイヤパンク修理キットを含む価格です。`（STI Sport 页作 `…タイヤパンク修理キットとタイヤ交換用工具を含む価格です`）
- **坑**：① `残価設定クレジットで月々16,500円〜` 是**月供**不是车价 → 只取 `class="price"` 里的 `span.num`；② 同一グレード在页面里 PC/SP 渲染两遍 → 按 `page+grade+btc+駆動:価格` 去重（114 → **57**）；③ 本机 DLP 按扩展名套壳，`.txt`/`.pdf` 落盘会变成 `%TSD-Header-###%` 二进制 → **PDF 一律存 `.bin`**，`pdftotext` 走 stdout；④ 车系首页也有 `¥` 数字（导航起价），**别在首页抓价**
- **实测**：2026-11-09
- **来源**：`https://www.subaru.jp/carlineup/`、`https://www.subaru.jp/<slug>/grade/`、`https://www.subaru.jp/<slug>/driving/`、`https://www.subaru.jp/<slug>/specification/docs/specifications.pdf`、`https://www.subaru.jp/<slug>/grade-comparison/json/<slug>_grade.json`、`https://www.subaru.jp/advertising/wrx/stisportsharp/`、`https://www.subaru.jp/{crosstrek,impreza}/previous-grade/`、`https://www.subaru.jp/transcare/lineup/{chiffonwing,chiffonslope,sambar_dias}.html`
- **交付结果**：`Subaru_JP_官网价_20261109.xlsx`，**112 条 / 18 车系**（SUBARU BRZ 6 / シフォン 12 / クロストレック 6 / フォレスター 7 / インプレッサ 7 / ジャスティ 2 / レヴォーグ レイバック（S:HEV）2 / レヴォーグ レイバック 2 / レヴォーグ 6 / プレオ プラス 4 / レックス 6 / サンバートラック 14 / サンバーバン 18 / ソルテラ 3 / ステラ 8 / トレイルシーカー 3 / WRX S4 5 / サンバー ディアス 1）；燃油 **Gasoline 88 / HEV 9 / BEV 6 / 未标注 9**；停销 20 条（レックス 6・WRX S4 5・生産終了 e-BOXER 9）；`官网无价格` 12 条（生産終了 e-BOXER 9 + 福祉車両 3）。**校验**：25 张有价 lineup 卡的起价与 `/grade/` 页最低价**逐车吻合（25/25）**，3 张福祉卡无价；型号名 228 个片段对抓取原文做子串命中 **0 失败**；`verify_xlsx.js` PASS

---

### Volvo（JP 日本 `www.volvocars.com/jp`：curl 全 403 → 真浏览器；**四层：バージョン × グレード × パワートレイン × テーマ**，年款藏在车型页的 offer 价格表里）✅

- **可达性**：`curl` 全站 403（含 `/jp/`、`/jp/build/...`）；浏览器可开。**页面内 `fetch()` 同源不受限**，可直接抓 `/jp/build/<slug>/` 的 HTML 做结构分析
- **车型清单**：`https://www.volvocars.com/jp/build`（**不是** `/jp/cars/`，后者经常返回「このページは一時的にご利用いただけません」）→ 列出 11 个可订购车型 + 各自起价；`/jp/build/<slug>/` 直接可开。⚠ `ex60-electric`、`v60-cross-country` 的 build 页会**跳回车型列表**（=未开卖），`xc40-electric` 只是 EX40 的旧 slug
- **★★ 必须枚举四层（2026-11-06 被用户指出漏项后修正）**：① **バージョン**（衍生款）② **グレード**（Plus/Ultra/Essential/Core）③ **パワートレイン**（每个グレード下可选，价格 = グレード价 + 追加費用）④ **テーマ**（Bright/Dark，+¥100,000）。**只做 ①×② 会漏大量版本**：ES90 Ultra 还有 Twin Motor Performance（+¥1,000,000）、EX90 Ultra 有 Twin Motor Performance（+¥500,000）、EX30/EX30 CC Ultra 有 P8 AWD EV（+¥500,000）、XC40 Ultra 有 B4 AWD（+¥500,000）、XC60 Ultra 有 Dark 主题（+¥100,000）。枚举法：点 `h3._969-WG_title`（用 pointerdown/mousedown/pointerup/mouseup/click 依次 dispatch，先 `scrollIntoView` 再点），逐グレード读 `パワートレイン` 与 `テーマ` 段
- **★ 页面结构（与 AU 完全不同，没有 `stage-*` testid）**
  - **衍生款**：`バージョン` 区块里的 `div.selectable-card`（如 `EX30` / `EX30 Cross Country`、`XC60` / `XC60 Black Edition`）
  - **グレード**：`モデルグレード`（或 `トリムレベル`）区块的卡片，卡片里带 `メーカー希望小売価格`；有的车型卡片名已含动力（`Ultra, Single Motor`），有的是「グレード + パワートレイン」两块（`Plus` + `B5 AWD マイルドハイブリッド`）
  - **枚举法**：点 `div.selectable-card` 切衍生款 → 等 2.5–3 s → 读 `document.body.innerText` 里 `トリムレベル/モデルグレード` 到 `パワートレイン` 之间那段，取「グレード名 + ￥価格 + 动力名」；单次调用最多点 2–3 次（15 s 上限）
- **★ 年款**：车型页 HTML 内嵌 `offerSelector:prices` 价格表，结构 `{"<slug>":{"cash":"￥X","modelYears":{"2027":{...}},"editions":{...}}}`（脚本里是多重转义，需连续 unescape 4 次再 `JSON.parse`）→ **`modelYears` 的键就是年款**（2027/2026），比页面文字可靠
- **★ 价格**：`メーカー希望小売価格（消費税込）`，JPY；输出 `--money comma`
- **坑**：① **XC90 的 `Plus` 卡片没有价格**，且 `/jp/build` 列表的起价是 10,990,000（=Ultra）→ 该グレード当前不可订购，只出 Ultra；② EX30 Cross Country 在价格表里写作 `editions["cross-country"].cash = ￥5,990,001`，配置器显示 ￥5,990,000 —— 用配置器值；③ 各车型グレード命名不统一：XC40 是 Essential/Plus/Ultra、V60 是 Core/Ultra、EX40 只有 `Ultra, Single Motor`；④ 卡名里的「, 」分隔是官网原文
- **来源**：`https://www.volvocars.com/jp/build`、`https://www.volvocars.com/jp/build/<slug>/`、`https://www.volvocars.com/jp/cars/<slug>/`
- **交付结果**：`Volvo_JP_官网价_20261106.xlsx`，**26 条 / 10 车系**（EX30 3 / EX30 Cross Country 2 / EX40 1 / EX90 3 / ES90 3 / XC40 4 / XC60 3 / XC60 Black Edition 1 / XC90 2 / V60 3；四层枚举完成：动力加价 +500,000（EX30/EX30 CC/EX90/XC40）、+1,000,000（ES90）、主题 Dark +100,000（XC60 Ultra））；燃油 BEV 12 / MHEV 10 / PHEV 4；英文版 `Volvo_JP_官网价_20261106_EN_v2.xlsx`（只改两列名称，其余列/表头不动）

---

### Hyundai（JP 日本 `www.hyundai.com/jp`：纯 SSR，`/<slug>/price` 页一张表直出「グレード × 車両価格（消費税込）」）✅

- **可达性**：`curl` 直连 200，无反爬；首页是 JS 壳（只有 `/jp/` 一个链接），**车型 slug 要从首页 DOM 的 `javascript:common.link.setGaParam('<slug>', ...)` 里挖**
- **车型与入口**：`https://www.hyundai.com/jp/<slug>`（不是 `/models/`），价格页 `…/<slug>/price`
  - 当前 6 款：`inster` / `ioniq5` / `ioniq5n` / `kona` / `kona-maunaloa` / `the-all-new-nexo`
- **★ 取价**：`/<slug>/price` 里的 HTML `<table>`：表头 `項目 | INSTER Casual | INSTER Voyage L | …`，价格行标签**有三种写法**（都要匹配）：
  - `車両価格（消費税込み）`（INSTER）
  - `メーカー希望小売価格（消費税込み)`（KONA/NEXO，右括号是半角）
  - `車両販売価格（消費税込み）`（IONIQ 5 N / KONA Mauna Loa，单グレード表只有 1 个数字）
  → 按「表头列的グレード名 ↔ 价格行同列」配对
- **★ 单グレード车型**：`ioniq5n`（8,910,000）、`kona-maunaloa`（4,950,000）的表里**没有グレード名**，只有一行价格 → 型号名直接用车名
- **★ 导航里的起价**（`¥2,849,000~` 等）可用来校验各车系最低价，6 款全部对齐
- **燃油**：INSTER / IONIQ 5 / IONIQ 5 N / KONA / KONA Mauna Loa = **BEV**；NEXO = **FCEV**（导航标 `FCEV`）
- **年款**：`/price` 页与规格表全文无「年モデル/年式/MY」→ `官网无年款`
- **来源**：`https://www.hyundai.com/jp/<slug>/price`
- **交付结果**：`Hyundai_JP_官网价_20261106.xlsx`，**18 条 / 6 车系**（INSTER 5 / IONIQ 5 4 / IONIQ 5 N 1 / KONA 4 / KONA Mauna Loa 1 / NEXO 3）；BEV 15 / FCV 3

---

### Chevrolet（JP 日本 `www.chevroletjapan.com`：只卖 Corvette / Corvette Z06，车种页内嵌「メーカー希望小売価格(消費税込)」表）✅

- **可达性**：`curl` 直连 200（AEM 站），无反爬
- **车型**：只有 **CORVETTE** 与 **CORVETTE Z06**（`/corvette`、`/corvette/z06`）；`/vehicles.html` 是导航空模板，别拿它当清单
- **取价**：车种页的 `プライス` 区块：表头 `車種 | シボレー コルベット 2LT | 3LT | コンバーチブル`，价格行 `メーカー希望小売価格(消費税込) | ¥15,350,000 | ¥17,950,000 | ¥19,600,000`；Z06 同理（クーペ 3LZ 27,100,000 / コンバーチブル 3LZ 30,500,000），另有 **CORVETTE Z06 SANTORINI EDITION 全国20台限定 29,000,000〜**
- **年款**：页面只有「2026年モデル」等说明脚注，不对应具体グレード → `官网无年款`
- **来源**：`https://www.chevroletjapan.com/corvette`、`/corvette/z06`
- **交付结果**：`Chevrolet_JP_官网价_20261106.xlsx`，**6 条 / 2 车系**（CORVETTE 3 / CORVETTE Z06 3），全部 Gasoline

---

### Citroën（JP 日本 `www.citroen.jp`：curl 403 → 浏览器；价格在各车型页的グレード卡片里，`メーカー希望小売価格（消費税込）X円〜`）✅

- **可达性**：`curl` 全站 403（Akamai）；浏览器可通，**页面内 `fetch('/models/xxx.html')` 可取整页 HTML**
- **车型页**：`/models/c3.html`、`e-c3.html`、`c3-aircross.html`、`c4.html`、`c5-aircross.html`、`new-berlingo.html`、`c5-x.html`（另有 `c4/e-c4-electric.html`、`c5-aircross-suv/pluginhybrid.html`、`c5-x/pluginhybrid.html` 三个营销子页，**均无价格**）
- **取价**：正文里把每组「グレード名 … 全長…（动力）…メーカー希望小売価格（消費税込）X円〜」按出现顺序配对；注意同一价格在「一覧卡」和「详细卡」各出现一次，要按名称去重
- **口径**：`メーカー希望小売価格（消費税込）`，JPY；页脚「2026年10月現在」是**价格生效时间**，不是年款 → `官网无年款`
- **燃油**：C3/C3 Aircross/C4/C5 Aircross 的 `HYBRID` = 1.2ℓ涡轮 + 电机 + 6DCT → **MHEV**；`ë-C3` = BEV；BERLINGO = 1.5ℓ柴油 Diesel；C5 X MAX = 1.6ℓ汽油 Gasoline、C5 X MAX PLUG-IN HYBRID = PHEV
- **官方 PDF**：`web.citroen.jp/brochure/webcatalog/pdf/*.pdf`（full-lineup / 各车型 catalog·spec），`curl` 可下，但日文是 CID 编码 `pdftotext` 抽不出，只适合对数
- **来源**：`https://www.citroen.jp/models/<slug>.html`
- **交付结果**：`Citroen_JP_官网价_20261106.xlsx`，**19 条 / 8 车系**（C3 3 / ë-C3 2 / C3 Aircross 2 / C4 2 / C5 Aircross 2 / C5 Aircross SUV 1 / BERLINGO 4 / C5 X 3）；MHEV 9 / Diesel 4 / Gasoline 3 / BEV 2 / PHEV 2。⚠ C4 正确グレード是「C4 MAX HYBRID」(4,550,000) 与「C4 MAX HYBRID ブラックルーフ」(4,590,000)（车型页只给两个价，命名以官方購入サポート页「C4 MAX HYBRID / NEW C4 MAX HYBRID Edition Lumière / NEW C4 MAX HYBRID ブラックルーフ」为准）；Ë-C4 ELECTRIC 子页全站无价且不在当前导航、Edition Lumière 只有名称无价格 → 均未入表

---

### Maserati（JP 日本 `www.maserati.com/jp/ja`：配置器列 6 车系 11 版本，`carGrid.general.price` 取实时基础 MSRP）

- **可达性**：主站 HTML、车型轮播 `.model.json`、配置器公开 API 均可用 `curl --ssl-no-revoke -L` 读取（实测 2026-11-10）。模型选择器 HTML 已含版本、年款和 build 链接，不从全球 API 猜日本在售范围。
- **在售范围**：`https://www.maserati.com/jp/ja/shopping-tools/configurator` 的 6 组：Grecale 4、GranTurismo 2、GranCabrio 2、GT2 Stradale 1、MCPURA Cielo 1、MCPURA 1；版本卡 `data-available="true"`、`data-attribute="MY-2027"`，浏览器可选。Grecale 的 `OUTDOOR PACKAGE` / `ACCESSORIES PACKS` 是选装套餐，不另作版本；Folgore、MC20、Ghibli、Levante、Quattroporte 不在当前选择器中，未混入本次新车配置清单。
- **取价源**：从每张卡的 `/shoppingtool/build-and-price/jp/ja?modelCode=…&modelName=…` 现取参数；配置器资源 `environmentProp.json` 给出公开端点，`desktop.min.js` 给出参数次序：
  - `https://www.configurator.maserati.com/ccbe/public/api/carGrid/107/<modelCode>` → `general.price`（基础车价）、`general.modelYear`、`general.country_iso_code`、`general.fallback`。
  - `https://www.configurator.maserati.com/ccbe/public/api/countryProp/107/<modelCode>/ja` → `labels.SHORT_MODEL_DESCRIPTION`、`labels.ENGINE_DESCRIPTION`、`techData.model_year_descr`、`techData.fuel_type`。
  - 日本 `country=107`；本次 11 条均 `country_iso_code="JP"`、`fallback="false"`。**modelCode/modelName 要从本次卡片读取，不复用历史值。**
- **型号名与动力**：版本卡名与 `SHORT_MODEL_DESCRIPTION` 一致；动力保留配置器完整 `ENGINE_DESCRIPTION`，例如 `Grecale Modena V6 エンジン V6 - 3000 cc - 390 ps`。不要改成旧目录的排量/功率，也不要使用浏览器机器翻译后的中文名称；`desktop.min.js` 明确将 `ENGINE_DESCRIPTION` 渲染为动力标签。
- **价格冲突**：GranCabrio Trofeo 起价卡/轮播写 `JPY 28,670,000`，实时 `carGrid/107/8508490` 写 `"price":"28700000.00"`；实际配置摘要原文为 `希望小売価格` / `JPY 28,700,000`。本次采 **28,700,000**；另 7 条有价版本的卡片价与实时基础价一致。
- **税价边界**：日本配置器 `countryProp.labels.PRICE_NOTE_BKP` 原文 `*消費税を含みます。また、価格については他の免責事項があります。`；`BASE_PRICE` 为 `希望小売価格`。这是 **API 的含消费税标签证据**；本次摘要页面仅直接显示希望小売価格，免責条項弹窗未显示上述税句，不把未渲染标签称为可见脚注。采基础车价，不采推荐库存的实车总价；弹窗另明示 `オープニング画面に「初期コンフィギュレーション」として提示される車両には、有償オプションとなる要素が含まれています。`，因此不能直接把任何预设总额当基础 MSRP。
- **缺价两档**：MCPURA / MCPURA Cielo 的选择器和车型页无公开日元基础价，`carGrid.general.price` 为空；共用官方目录以及 2025-07-10 首发、2026-03-30 日本亮相新闻均未找到日本 MSRP，本次记 `官网无价格`。GT2 Stradale 当前 MY27 API 价为空，但 2025-03-31 官方新闻明确报价，原文 `「GT2 ストラダーレ」の価格は、税込43,940,000 円となります。`；新闻**没有年款**，不把发布日期当 MY，也未将历史价移植给 MY27，本次记 **`未核实`**。
- **年款**：11 个版本卡均显示 `2027`，`carGrid.general.modelYear=2027`，`countryProp.techData.model_year_descr` 原文 `{"label":"モデルイヤー","value":"MY27"}`，主表按卡片原文写 `2027`。Grecale / GranTurismo / GranCabrio / MCPURA 官方目录文件名含 `my26`，正文却仅有制作日期 `2 0 2 5 年 1 0 月の 制 作 時 点`，**不作年款依据**；对应物理 PDF 页为 26 / 45 / 39 / 25。GT2 目录入口未发现规格 PDF。
- **燃油**：`techData.fuel_type.value` 的 `MH` 对应 `マイルドハイブリッド車`，`PE` 对应 `ガソリン車`（官方配置器库存模块标签）；Grecale 基础款及 Modena 为 MHEV，其他 9 条为 Gasoline。Grecale 目录第 7、21–22 物理页另有 `M H E V（ マイルドハ イブリッド）` / `4 8 V` 文字，作交叉证据。
- **旧目录边界**：四份目录可提取日文，未找到价格或明确 Model Year；GranTurismo/GranCabrio 目录 Trofeo 为 550 ps，而当前选择器及配置器为 590 ps；Grecale 旧目录不含 Modena V6。用现行配置器动力，不用旧目录覆盖。
- **实测**：2026-11-10
- **来源**：`https://www.maserati.com/jp/ja/shopping-tools/configurator`；`https://www.configurator.maserati.com/ccbe/public/api/carGrid/107/8508490`；`https://www.configurator.maserati.com/ccbe/public/api/countryProp/107/8508490/ja`；`https://www.maserati.com/jp/ja/news/gt2-stradale-web-configurator-202503`；`https://www.maserati.com/jp/ja/brand/stories-of-audacity/mcpura-world-premiere-revealed-at-goodwood-festival`；`https://www.maserati.com/jp/ja/news/mcpura-april-2026`；`https://www.maserati.com/jp/ja/shopping-tools/catalogues`。
- **原文**：`"modelYear":2027`；`"model_year_descr":{"label":"モデルイヤー","value":"MY27"}`；`希望小売価格`；`*消費税を含みます。また、価格については他の免責事項があります。`；`「GT2 ストラダーレ」の価格は、税込43,940,000 円となります。`
- **交付结果**：`Maserati_JP_官网价_20261110.xlsx`，**11 条 / 6 车系**，均为官网明示 2027；8 条数字 MSRP 为 10,650,000–28,700,000 日元，MCPURA/Cielo 2 条 `官网无价格`，GT2 Stradale 1 条 `未核实`；MHEV 2 / Gasoline 9，停销均 `否`。固定 8 列主表与 7 列年款依据（6 组、覆盖 11 条），`verify_xlsx.js` 结构及逐值回读 PASS；内置 Office 预览返回 `QODER_OFFICE_XLSX_ARCHIVE_INVALID`，未宣称预览通过。

---

### McLaren（JP 日本 `/cars/jp_ja`：官网与配置器均不公开价格，12 个车型全部 `官网无价格`）

- **入口**：`https://www.mclaren.com/jp/` 返回 **404**；日本站实际在 `https://www.mclaren.com/cars/jp_ja`（全球站地区选择器 Japan (Japanese) 进入）。主站 HTML `curl` 可通；CMS API 对 `curl` 403，需浏览器内 `fetch`。
- **在售范围（12 条 / 4 类）**：CMS `https://mclaren-cms.production.aws.mclaren.com/api/mainnav?site=10`（`site` 必须用数字 id **10**；用 slug `jp_ja` 返回 404 Site not found）→ `categories[].models[]`：
  - スーパーカー：ARTURA、ARTURA SPIDER、750S、750S SPIDER、788HS、788HS SPIDER
  - グランドツアラー：GTS；ハイパーカー：W1
  - モータースポーツ：GT3 EVO、ARTURA GT4、ARTURA TROPHY EVO、MCL-HY GTR（`project-endurance`，页面写明顾客向けサーキット専用ハイパーカー，属可询价车型）
  - 页面：`/api/page?slug=cars/jp_ja/<model>`（**slug 必须带 `cars/` 前缀**；`jp_ja/artura` 单独返回 404 Content not found）。出表名用页面渲染标题（ARTURA / 750S…）；nav 的 `model_title` 是小写 `Artura`/`750s`、`Artura Spider ` 带尾空格，只作反查键。
- **价格（决定性证据）**：配置器 `https://configurator.mclaren.com/mclaren-ui/?model/<profile>` 的 5 个 profile（artura / artura-spider / gts / 750s / 750s-spider）：
  - `ajaxStartConfiguration.do?profileName=<p>&configCountry=JP&langCode=JA` → `windowId`；每个 profile 的 `items` 只有 1 个（`configuratorName: "CAL DIRECT"`），即无版本细分；
  - 后续请求必须带 `WINDOWSTORE: CWINDOWID=<windowId>`，否则 500 `ConfigurationTimeoutException`（Could not retrieve configuration. Probably the session was lost.）；
  - `ajaxGetConfigPrices.do` **5/5 返回 `{"items":[],"configStatus":"cc"}`**；`profileInfo` 103 项里 `webui.showPriceSummary=false`、`webui.showPricesByCountry=false`；
  - `landing` 接口 `clientCountryOrigin/Preferred=JP`，直接带 `configCountry=JP` 即可，不必在 UI 选地区（UI 地区选择点 JAPAN 后仍显示 UNITED STATES，`countries__itemJP` testid 不存在）。
- **官方 PDF**：CMS 车型页只挂全球英文手册（Artura 1209/1208、750S 583、GTS 108/106、Trophy 1009/1008），**无日本价格表**；750S/GTS 手册内文只有文档生效日期，无 Model Year/MY。Artura 手册（25.8MB）与机能指南（23MB）为图片型或 DLP 截断，`%PDF` 头但 xref 损坏 / `pdftotext` 抽出 0 字节，不能作年款或燃油正文证据。
- **年款**：CMS 页面、配置器 `profileInfo` 均无 `modelYear`/`millesime` 字段；官方手册只有文档日期；页面时间轴 `2021 ARTURA マクラーレン初の量産ハイブリッド` 是导入年、`2027年FIA世界耐久選手権（WEC）` 是参赛年，均非年款 → 12 条全部 `官网无年款`。
- **燃油**：ARTURA / ARTURA SPIDER = **PHEV**（官方全球 Artura 手册原文 `It is the lightest plug-in hybrid supercar`；JP 页 `静かな走りを実現するEVモード`、`ハイブリッドシステムの最高出力は700PS`）；W1 = **HEV**（JP 页 `完全新設計のHigh-Performance Hybrid Powertrain`，官网无 plug-in/充电字样，不推断 PHEV）；750S / 750S SPIDER / GTS / 788HS / 788HS SPIDER = **Gasoline**（页面原文 `4.0リッターV8ツインターボ` 等，全页无 hybrid）；GT3 EVO = Gasoline（`M840T 4.0リッターツインターボV8エンジン`）；ARTURA GT4 / ARTURA TROPHY EVO = Gasoline（页面只写 `V6パワートレイン` / `585PS`，无 hybrid 字样）；MCL-HY GTR = Gasoline（页面原文 `WECの規定で義務付けられているハイブリッドシステムは取り除きました`）。
- **停销**：750S 虽在 2026-10-08 新闻 `final orders … end production in 2027`，日本站仍在售（配置器可选）→ `否`；其余均 `否`。MCL 6GT（2026-10-31 全球首发）与 2027 年 McL 820 不在日本站车型清单，未入表；750S JC96 / GTS Signature Collection 等日本限定版不在 nav 车型清单，未单列。
- **实测**：2026-11-10
- **来源**：`https://www.mclaren.com/cars/jp_ja`；`https://mclaren-cms.production.aws.mclaren.com/api/mainnav?site=10`；`https://configurator.mclaren.com/mclaren-ui/?model/artura`（`ajaxStartConfiguration.do` / `ajaxGetInitialData.do` / `ajaxGetConfigPrices.do`）；`https://cars-assets-production.mclaren.com/1209/Global_Artura_Product_Brochure.pdf`；`https://cars-assets-production.mclaren.com/583/750S_Product_Brochure_2023_EN_UK_correct.pdf`；`https://cms-assets-production.mclaren.com/108/mclaren-GLOBAL_GTS-Product-Brochure-2023-DIGITAL-gts.pdf`；`https://cars.mclaren.press/releases/1358`。
- **原文**：`"items":[]`；`"webui.showPriceSummary" … "value":"false"`；`"webui.showPricesByCountry" … "value":"false"`；`It is the lightest plug-in hybrid supercar`；`Based on EU (UK) specifications as at 25/04/2023 00:01 GMT.`；`Based on EU (UK) specifications as at 19/12/23 00:00 GMT.`；`静かな走りを実現するEVモード`；`WECの規定で義務付けられているハイブリッドシステムは取り除きました`。
- **交付结果**：`McLaren_JP_官网价_20261110.xlsx`，**12 条 / 9 组**（ARTURA 2、750S 2、788HS 2、GTS/W1/GT3 EVO/ARTURA GT4/ARTURA TROPHY EVO/MCL-HY GTR 各 1），全部 `官网无价格`（官方链路 0 个价格字段，属品牌策略性不标价）、`官网无年款`；PHEV 2 / HEV 1 / Gasoline 9，停销均 `否`；固定 8 列主表 + 7 列年款依据（9 组、覆盖 12 条），`verify_xlsx.js` PASS。

