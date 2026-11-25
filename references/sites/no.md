# 挪威 NO — 站点坑位详段

> 市场码 NO · 13 段 · 品牌：ZEEKR / Jaguar / Toyota / Fiat / Ford / Land Rover / Voyah / Lexus / Dongfeng / Lotus / Renault / Ferrari / JAC
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-11-20 · 文中 snapshotVersion / token / 车型 id 均为当时实测值，必须现取

---

### ZEEKR（NO 挪威 `www.zeekr.eu/nb-no`：**车型页给起价，版本价在 `shop.zeekr.eu/nb-no/configuration/?linkCode=`；NOK 用空格千分位**）✅

- **可达性**：`www.zeekr.eu/nb-no` curl 200；车型页 001/7X/7GT/X/9X；配置器 `shop.zeekr.eu/nb-no/configuration/?linkCode=`（2026-11-19）。
- **★ 在售范围（4 车型 / 14 版本）**：001 4 · 7X 4 · 7GT 3 · X 3；`9X` 仅 `Hold deg oppdatert`（未上市）→ 不纳入。
- **★ 取价源**：配置器 `Versjon` 卡逐版本 `Pris`：
  - 001：Long Range RWD 630 500 / Performance AWD 660 500 / Privilege AWD 710 500 / Sport Edition AWD 730 500
  - 7X：Core RWD 590 500 / Long Range RWD 640 500 / Privilege AWD 680 500 / Business Edition AWD 599 900
  - 7GT：Core RWD 399 900 / Long Range RWD 513 900 / Privilege AWD 594 900
  - X：Core RWD 376 800 / Long Range RWD 455 800 / Privilege AWD 511 800
- **⚠ 促销 vs 目录价**：页面同时写 `Kampanje - nå fra 299 900 kr` / `Spar opptil 85 600 kr` 等；**取未划线的 `Pris`（如 X Core 376 800，不用 kampanje 299 900）**。
- **年款**：配置器/车型页均无 `årsmodell` / `modellår`；图片素材里的 2025 只作旁证 → 全部 `官网无年款`。
- **燃油**：全 BEV。
- **NOK 格式**：官方 `630 500 NOK`（空格千分位、无小数）；工作簿 E 列写 `630 500`，不带 `NOK`。生成与回读统一使用 `--money space`，不要手工替换单元格。
- **交付结果**：`ZEEKR_NO_官网价_20261119.xlsx`，**14 条 / 4 车型**；NOK 376 800–730 500；BEV 14。
- **实测**：2026-11-19
- **来源**：`https://www.zeekr.eu/nb-no/models/001`；`https://shop.zeekr.eu/nb-no/configuration/?linkCode=1`；`?linkCode=1075`；`?linkCode=1611`；`?linkCode=1628`
- **原文**：`Long Range RWD 630 500 NOK`；`Performance AWD 660 500 NOK`；`Core RWD 590 500 NOK`；`Core RWD 376 800 NOK` / `Kampanje - nå fra 299 900 kr`

---

### Jaguar（NO 挪威 `www.jaguar.no` → `www.jaguar.com/no-no`：**仅 Type 01 品牌页，无配置器/无价格**）⚠️ 无价格出表

- **可达性**：`www.jaguar.no` 301 → `www.jaguar.com/no-no/index.html`，curl 200，但首页是 `Copy nothing.` 品牌 teaser；sitemap 仅 Type 01 / about / legal 页面，无旧车型页与配置器（2026-11-19）。
- **在售范围**：仅 `Type 01`（四门 Grand Tourer，纯电，页面 `BESTILL NÅ`）；无价格、无配置器、无 årsmodell。
- **价格**：全站 0 个 `NOK`/价格字段 → `官网无价格`（不拿第三方/媒体价）。
- **年款**：无 `årsmodell`/`modellår`；版权年 `2026` 排除 → `官网无年款`。
- **燃油**：Type 01 官方 720 km 续航/纯电 → BEV。
- **交付结果**：`Jaguar_NO_官网价_20261119.xlsx`，**1 条 / 1 车型**；`官网无价格`。
- **实测**：2026-11-19
- **来源**：`https://www.jaguar.com/no-no/type-01.html`；`https://www.jaguar.com/no-no/sitemap.xml`
- **原文**：`Type 01` / `BESTILL NÅ`；`Opptil 720 km rekkevidde`；`© Jaguar Land Rover Limited 2026`

---

### Toyota（NO 挪威 `www.toyota.no`：curl 与 robots 全 403，真浏览器可开；价格在车型页内嵌 grade-selector JSON）✅

- **可达性**：`curl` 主页与 `robots.txt` 均 403（Akamai，23.62.46.x），真浏览器正常（实测 2026-11-19）
- **取价源**：车型页 `https://www.toyota.no/nybil/<slug>` 的 `<div id="tor-…-data">`，`textContent` 可 `JSON.parse`；路径 `gradeSelectorModel.model.gradeBodyTypes[].engines[].transmissions[].wheeldrives[].price.list` = 不含选装颜色的基础 list 价；**不取** 卡片上带默认金属漆的显示价（bZ4X Active 卡面 469 975，数据 list=458 100）
- **在售范围**：`/nybil` 10 个车型卡；gradeBodyTypes 展开共 43 个可售组合。Proace Verso 不在 grade-selector 里，走 `/nybil/proace-verso/build?path=engine/<engineId>/<bodyId>/<gradeId>`：Family Plus 749 800 / Shuttle Nordic V2 678 900
- **年款**：JSON 无 `modelYear/millesime`，页面仅版权年 `© 2025`；官方价目表 PDF 内只有 `Priser gjelder fra 12.09.2026` / `Kampanjen gjelder t.o.m 30.9.2026` 等价格生效/活动日期，无 `MY`/`Model Year` → 全部 `官网无年款`
- **价目表 PDF**：车型页「Se prisliste」→ `https://forhandler.toyota.no/pdf/<model>`（bz4x / bz4x-touring / urban-cruiser / toyota-c-hr-plus / hilux / proace / proace-city-electric / proace-verso-electric / proace-max-electric / proace-max-diesel / land-cruiser）
- **坑**：本机 `curl` 落盘 PDF 会被 DLP 加 `%TSD-Header-###%` 头，`pdftotext` 报 `Couldn't read xref table`；浏览器内 `fetch` 拿到的字节仍是原始 `%PDF-1.4`。做法：浏览器 `fetch` → base64 → Node 解码写临时文件 → **同一条命令立即** `pdftotext`，读完即删（DLP 数秒后会再次包装）
- **实测**：2026-11-19
- **来源**：`https://www.toyota.no/nybil/bz4x`；`https://forhandler.toyota.no/pdf/toyota-bz4x`
- **原文**：`"price":{"net":19494,"netWithDiscount":19494,"list":458100,"listWithDiscount":458100,"currency":"NOK"}`；`Priser gjelder fra 12.09.2026`
- **交付结果**：`Toyota_NO_官网价_20261119.xlsx`，43 条（10 车系；BEV 36 / MHEV 7）

---

### Fiat（NO 挪威 `www.fiat.no`：curl 403，真浏览器可开；乘客车与轻型商用车价目表 PDF 直链可读）✅

- **可达性**：`curl` 主页与 `robots.txt` 403；真浏览器正常（实测 2026-11-19）
- **取价源**：`/nyttige-lenker/prislister` 的「SE PRISLISTE」→ 车型页 302 到官方 PDF（`/content/dam/fiat2023/no/prislister/*.pdf`）。表内 `Veil.pris inkl mva` 是含税建议价；同表还有 `Kampanje` 行（低 25 000–50 000），**不采**。例：500 HB La Prima 369 900 / 活动 319 900；600e La Prima 324 900 / 299 900；Grande Panda 274 900 / 234 900
- **在售范围**：乘客车 500 Hatchback / 500 Cabrio / 500 3+1 / 600e / Grande Panda（5 行）；轻型商用车 E-Doblò / E-Scudo（L2 633 000、L3 648 000，含税）/ E-Ducato。E-Doblò 的「SE PRISLISTE」指向 `Kundeprisliste_Fiat_E-Doblo.pdf` 但返回 404，记 `未核实`；E-Ducato 车型页无价目表、无价格，记 `官网无价格`
- **年款**：价目表只有 `Prisliste gjeldende fra 18.09.2026` / `06.02.2026`；E-Scudo 表头 `Veil. utsalgspris 2026` 是价格年度列，不是年款；无 `MY` → 全部 `官网无年款`
- **坑**：① 乘客车价格含 MVA 与 vrakpant/levering Oslo；商用车 PDF 同时给 `eks. mva` 与 `inkl mva` 两列，取 `inkl mva`。② `fiat.no/professional/prislister` 是 404，不要当前入口
- **实测**：2026-11-19
- **来源**：`https://www.fiat.no/nyttige-lenker/prislister`；`https://www.fiat.no/content/dam/fiat2023/no/prislister/KundeprislisteFIAT500LaPrima18092026.pdf`
- **原文**：`Prisliste gjeldende fra 18.09.2026`；`Veil.pris inkl mva`；`Kundeprisliste gyldig fom 1.5.2026`
- **交付结果**：`Fiat_NO_官网价_20261119.xlsx`，9 条（5 乘客车 + E-Scudo 2 + E-Doblò/E-Ducato 缺价各 1）

---

### Ford（NO 挪威 `www.ford.no`：curl 超时，真浏览器可开；配置器 servicescache API 直出 series 价）✅

- **可达性**：`curl` 000/timeout（TCP 通），真浏览器正常（实测 2026-11-19）；`www.rohneselmer.no` 是福特经销商（Cloudflare 挑战），**不是官网**，不作为 MSRP 来源
- **取价源**：`https://www.servicescache.ford.com/api/vehicle-model/v1/load?locale=no_NO&retrieve=…prices…&config=<catalogId>&nameplateConfig=default&namedConfig=default`；`data.features.byMarketing` 里 `code:"series"` 的 `features[].featurePrice.basePrice.grossOTR` = 含 delivery/registration 的 OTR 建议价；`data.props["marketing-model-year"]` = 年款，`data.props["nameplate-label"]` = 车系名
- **catalogId**：Puma Gen-E `WAENX-CF7-2024-PumaGen-ENOR202700`；Capri `WAENX-CFU-2024-CapriNOR202725`；Explorer EV `WAENX-CFU-2024-ExplorerEVNOR202725`；Mustang Mach-E `WAENX-CGW-2026-Mach-ENOR202650`；Tourneo Custom（含 E-Tourneo）`WAENX-TTU-2023-TourneoCustomNOR202725`
- **在售范围**：`/biler` 6 个乘用车系 + `/oversikt-nyttekjoeretoey` 14 个 CV/皮卡 = **20 个在售车系 / 50 行**。PV 以官方价目表 PDF（`pdftotext -raw` 顺序最稳）逐版本取：Puma Gen-E 4（Select / Black Edition / Premium / BlueCruise Edition，均 Standard Range FWD 168 hk）；Capri 8（Style 1 / Select 2 / Collection 2 / Premium 3；RWD Standard Range 58 kWt 190 hk、RWD Extended 79 kWt 286 hk、AWD Extended 77 kWt 340 hk）；Explorer EV 8（同 4 series × 同三种动力）；Mach-E 4（Select LFP 73 kWt RWD 268 hk / Premium 88 kWt RWD 276 hk / Premium 88 kWt AWD 375 hk / GT 91 kWt AWD 487 hk）；E-Tourneo Custom 8（L1/L2 × Active/Titanium X × RWD/AWD）；Tourneo Custom 4（L1/L2 × PHEV 233 hk / 2.0L EcoBlue 170 HK AWD）。CV 官方 From（`Veil.pris ink, avgift Eks. MVA`）：Transit City 366 900 / Transit Courier 335 700 / E-Transit Courier 391 530 / Transit Connect 416 070 / Transit Custom 526 742 / E-Transit Custom 539 480 / Transit 1 228 833 / E-Transit 689 395 / Transit Minibus 585 968 / Ranger 651 520 / Ranger Raptor 983 910 / Transit City Chassis 394 900 / Transit Chassis 657 880 / E-Transit Chassis 657 880。Fiesta/Focus 页面逐字 `produseres ikke lenger` / `sluttet å produsere` → 不入表；Ranger Super Duty 是 `Kommer snart` → 不入表
- **⚠ 口径**：PV 的 `grossOTR`/`Pris fra` 含 MVA；CV 14 行是官方 `Eks. MVA`（不含增值税，含注册税与 levering Ski），**同表不得与 PV 含税价横向比较**
- **年款**：按官网原年款照写，不取整——Puma `2027`（配置器 `marketing-model-year`）、Capri/Explorer `2027.25`（配置器原值 / 价目表 `MY27.25`）、Mach-E `2026`（价目表逐字 `Modellår 2026`）、E-Tourneo/Tourneo `2026.50`（价目表 `MY 26.50`，保留小数）；CV `官网无年款`
- **坑**：① `featurePrice.basePrice.grossOTR` 是 MSRP；`finalPrice.recommendedOTRPromotionalPrice` 是扣 `customerSaving`（Puma 62 500）后的活动价，**不采**。② 首次 `load` 可能 401 `Consumer is not Authorized`，先真浏览器打开对应 build 页再 fetch。③ 页面「Pris fra」= 最低 series 的 grossOTR，不要当全系
- **实测**：2026-11-19
- **来源**：`https://www.ford.no/handle/buy-online/build-your-ford/mec?catalogId=WAENX-CF7-2024-PumaGen-ENOR202700`
- **原文**：`"marketing-model-year":"2027"`；`"grossOTR":348700.00`；`"customerSaving":62500`
- **交付结果**：`Ford_NO_官网价_20261119.xlsx`，50 条（PV 36：Puma 4 / Capri 8 / Explorer 8 / Mach-E 4 / E-Tourneo 8 / Tourneo 4；CV 14：车系级、Eks. MVA）

---

### Land Rover（NO 挪威 `www.landrover.no` / `www.rangerover.com/no-no`：**配置规则 JSONP 直出 7 车系 186 个 PRODUCT，curl 可直连**）✅

- **可达性**：`www.landrover.no` curl 301 → 200，`robots.txt` 200；`rules.config.landrover.com` 200，无需浏览器 / cookie（实测 2026-11-19）
- **核心端点**：`GET https://rules.config.landrover.com/rc/lr/no_no/{carline}_k27/.jsonp?view=personalise&callback=config_rcjson` → 302 到 `/rc/lr/no_no/<carline>_k27/<build>.jsonp`；用 `curl -L --compressed` 自动跟随并解 gzip
- **车系码 / 年款**：`l460` RANGE ROVER · `l461` RANGE ROVER SPORT · `l560` RANGE ROVER VELAR · `l551` RANGE ROVER EVOQUE · `l462` DISCOVERY · `l550` DISCOVERY SPORT · `l663` DEFENDER。`k27`=MY2027、`k26`=MY2026；`l550` 请求 k27 实际返回 **k26**（Discovery Sport 仍为 MY2026）
- **型号价**：`feature-dictionary.feature-list` → `name=="PRODUCT"` 组；`price.RETAIL.value`（Velar / Discovery Sport 部分条目没有 RETAIL，回退 `price.GROSS.value`）；`currency` 写作 `EUR-NO`，数值是 **NOK**；本批 RETAIL = GROSS = NET（无 excl/incl 双列）
- **型号名（v2 修正）**：不要用 PRODUCT 的 `description`（长工程名）。用同文件的 `BODYSTYLE` / `MODEL` / `ENGINE` 三组，按各自 `compatibility` 里的 `PRODUCT` refs 映射到每个 PRODUCT，再拼 `{车身} {版本} {动力}`：`MODEL` 去掉家族前缀（`Range Rover ` / `Range Rover Sport ` / `Range Rover Velar ` / `Range Rover Evoque ` / `Discovery ` / `Discovery Sport ` / `Defender `），Defender 车身去掉 `Defender `。示例：`130 S D250 Diesel Mild Hybrid`（车系列 DEFENDER）、`Long Wheelbase HSE D350 Diesel Mild Hybrid`、`Dynamic S P400e Petrol Plug-in Electric Hybrid`。Range Rover 保留 Standard/Long Wheelbase（价格不同），Defender 保留 90/110/130/OCTA；其余车系只有一种车身，省略Standard Wheelbase
- **在售范围**：7 车系 186 个 PRODUCT（RR 61 · RR Sport 35 · Velar 13 · Evoque 15 · Discovery 5 · Discovery Sport 8 · Defender 49），`availability` 仅 `available`/`default`，无停销标记
- **年款依据**：`feature-dictionary.vehicle.modelyear` = `k27` / `k26`，URL 段与字段一致
- **燃油（v2 修正）**：按官方 `ENGINE` 标签判，PHEV 先判（`Plug-in` / `PHEV` / `P#e`）→ MHEV（`Mild Hybrid`）→ BEV（`Electric` / `EV#`）→ Diesel → Petrol。结果 MHEV 117 · PHEV 39 · BEV 18 · Gasoline 12；**没有纯 Diesel**——Discovery/Evoque 的 D250/D350/D165 官方引擎标签本身就是 `Diesel Mild Hybrid`；P380 是 `Petrol`（Gasoline），P540/P550e 才带轻混/插混
- **坑**：① 不带 `-L` 只拿到 302 gzip 空壳；必须 `-L --compressed`。② `description` 可能只有 `no`（Discovery）或只有 `en`（多数），要按语言回退。③ 个别官方文本尾部带多余引号（Range Rover HSE/Autobiography 550PS PHEV），按逐字规则保留。④ 主页「Pris fra」是车系最低价（RR 1 955 900 / RR Sport 1 437 900 / Velar 1 247 900 / Evoque 1 090 900），与 JSON 最小值一致
- **交叉验证（2026-11-19）**：配置器 UI 的 `SUMMARY → On the road → Base Price / Grand Total` 与 JSONP `price.RETAIL` 逐条一致；抽样 8 条覆盖 7 车系：RR EV SE 450PS 1 955 900 · RR HSE P460e LWB 2 516 900 · RR Sport Dynamic SE EV450 1 437 900 · Velar Dynamic S PHEV 1 330 900 · Evoque S Dynamic D165 1 052 900 · Discovery Landmark D250 1 732 900 · Discovery Sport Landmark D200 1 204 900 · Defender 110 X-Dynamic SE D200 1 839 900
- **实测**：2026-11-19
- **来源**：`https://rules.config.landrover.com/rc/lr/no_no/l460_k27/.jsonp?view=personalise&callback=config_rcjson`；`https://www.rangerover.com/no-no/index.html`；`https://www.landrover.no/index.html`
- **原文**：`"modelyear":"k27"`；`"RETAIL":{"currency":"EUR-NO","value":"2426900.00"}`；`Pris fra: 1 955 900 kr`
- **交付结果**：`LandRover_NO_官网价_20261119.xlsx`（v2 命名修订：UI 车身+版本+动力），**186 条 / 7 车系**，NOK 1 005 900–4 946 900；年款 MY2027 178 / MY2026 8

---

### Voyah（NO 挪威 `www.voyah.no`：**仅 COURAGE 在售；Dream / Free 标 `Utgått`；`bygg-din-bil` 版本卡给 NOK**）✅

- **可达性**：`www.voyah.no` curl 200；配置器 `/voyah-courage/bygg-din-bil` 正常（2026-11-19）。
- **★ 在售范围（1 车型 / 4 版本）**：COURAGE CORE RWD / CORE AWD / PREMIUM RWD / DESIGN AWD；`VOYAH DREAM`、`VOYAH FREE` 页面标 `Utgått` → 停销，不纳入。
- **★ 取价源**：配置器第 1 步 `Velg COURAGE utstyrsmodell` 逐卡 `kr`：CORE RWD 299 990 · CORE AWD 349 990 · PREMIUM RWD 349 990 · DESIGN AWD 399 990。
- **⚠ 促销**：DESIGN 卡有 `Spar 100.000 kr`，页面只给 399 990；无单独 `før` 价，按展示价采并在交付说明标注。
- **年款**：无 `årsmodell`/`modellår`；页面 2026 是版权年、2027 只是“价格将上涨”文案 → 全部 `官网无年款`。
- **燃油**：全 BEV。
- **NOK 格式**：空格千分位（`299 990`），不带 `kr`。
- **交付结果**：`Voyah_NO_官网价_20261119.xlsx`，**4 条 / 1 车型**；NOK 299 990–399 990；BEV 4。
- **实测**：2026-11-19
- **来源**：`https://www.voyah.no/`；`https://www.voyah.no/voyah-courage/bygg-din-bil`；`https://www.voyah.no/voyah-dream`
- **原文**：`COURAGE CORE 299 990 kr Bakhjulsdrift`；`COURAGE CORE 349 990 kr Firehjulsdrift`；`COURAGE PREMIUM 349 990 kr Bakhjulsdrift`；`COURAGE DESIGN Spar 100.000 kr 399 990 kr Firehjulsdrift`；`Utgått`

---

### Lexus（NO 挪威 `www.lexus.no`：**curl 403 Akamai；首页同源 fetch 取 HTML + Texus getGrades/getMotorizations 枚举 子车型×grade**）✅

- **可达性**：`www.lexus.no` curl 403 `Access Denied`；browser 首页正常，`/new-cars/rz` 直航常超时；从首页 `fetch('/new-cars/rz')` 200（2026-11-19）。
- **★ 第一性全集（3 车型 / 13 版本）**：RZ 5（350e Executive/Luxury、500e Executive/Luxury、550e F SPORT）· ES 3（350e Executive/Luxury、500e Executive）· TZ 5（450e Executive；550e Luxury / Luxury Bright / Luxury Bi-tone / Bi-tone Bright）。
- **⚠ 只看页面 grade 卡会少算**：`carData.models[].grades[]` 只给每个 grade 的最低配价，RZ 会漏掉 500e Executive 642 100 / 500e Luxury 740 000，ES 会漏掉 500e Executive 711 400。必须按 build 页（如 `/new-cars/rz/build.rz.090.742bd2a4-…`）的 Texus 链接继续枚举：
  1. `GET https://texus.lexus-europe.com/v2/car/getGrades/lexus/no/no/<modelToken>/promotiontimeframe/00000000-0000-0000-0000-000000000000` → grade ID（Executive/Luxury/F SPORT）。
  2. `GET .../getMotorizations/.../grade/<gradeId>/bodytype/<bodyTypeId>` → 每个 `Engine`（EV 350e/500e/550e）的 `Grades[]`，取 `PriceInfo.ListPriceWithDiscount`；按 `engine + grade` 去重。
  - RZ token `1d923850-11c2-460f-b615-ac77f66b8d32`，bodytype `4045302a-5701-44a0-bceb-a160f390a68b`；ES token `361e94e8-2e10-4934-a625-bf8b50ebaee2`，bodytype `74469257-47ae-46eb-859d-2c693e6726ca`。
- **★ TZ 取价源**：`/new-cars/tz-world-premiere` 的静态 `Prisoversikt` 表，逐行 `Fra kr`；表头写明 `Utsalgspris inkludert frakt og levering (Oslo)` → **含运至 Oslo 的 frakt/levering**。
- **价格（NOK）**：RZ 350e 576 200 / 639 100；RZ 500e 642 100 / 740 000；RZ 550e F SPORT 825 900；ES 350e 649 100 / 776 900；ES 500e 711 400；TZ 857 400–972 400。
- **年款**：RZ/ES `generation` 逐字 `RZ 2026` / `ES 2026`；TZ 页面无 generation/年款 → `官网无年款`。
- **燃油**：全 BEV（Engine.Type ELECTRIC，Category Battery Electric Vehicle）。
- **NOK 格式**：空格千分位，不带 `kr`。
- **交付结果**：`Lexus_NO_官网价_20261119.xlsx`，**13 条 / 3 车型**；NOK 576 200–972 400；BEV 13。
- **实测**：2026-11-19
- **来源**：`https://www.lexus.no/new-cars/rz`；`https://www.lexus.no/new-cars/es`；`https://www.lexus.no/new-cars/tz-world-premiere`；`https://www.lexus.no/new-cars/rz/build.rz.090.742bd2a4-f03a-4efe-9914-59f8c22d259f`；`https://texus.lexus-europe.com/v2/car/getGrades/...`；`.../getMotorizations/...`
- **原文**：`"Engine":{"Name":"EV 500e"}`；`"Grades":[{"Name":"Luxury","PriceInfo":{"ListPriceWithDiscount":740000}}]`；`"generation":{"name":"RZ 2026"}`；`Lexus TZ 450e AWD Executive | Fra kr 857 400,-`；`Utsalgspris inkludert frakt og levering (Oslo)`

---

### Dongfeng（NO 挪威 `www.dong-feng.no`：**BOX / VIGO 两车型，Webflow + 自带 konfigurator，版本卡直接给 kr**）✅

- **可达性**：`www.dong-feng.no` curl 200；`/box/konfigurator`、`/vigo/konfigurator` 正常（2026-11-19）。
- **★ 在售范围（2 车型 / 4 版本）**：BOX GO / BOX Long Range；VIGO Comfort / VIGO Signature。
- **★ 取价源**：配置器 `Velg type` 版本卡：BOX GO 189 990 · BOX Long Range 214 900 · VIGO Comfort 229 990（`COMFORT PACK - verdi 30 000 kr`）· VIGO Signature 259 990。加价项（冬季胎、frunk、脚垫等）不采。
- **年款**：无 `årsmodell`/`modellår`；2026 仅为版权年 → 全部 `官网无年款`。
- **燃油**：全 BEV（官网 `Norges billigste elbil` / `el-SUV`）。
- **NOK 格式**：空格千分位，不带 `kr`。
- **交付结果**：`Dongfeng_NO_官网价_20261119.xlsx`，**4 条 / 2 车型**；NOK 189 990–259 990；BEV 4。
- **实测**：2026-11-19
- **来源**：`https://www.dong-feng.no/`；`https://www.dong-feng.no/box/konfigurator`；`https://www.dong-feng.no/vigo/konfigurator`
- **原文**：`BOX GO 189 990 kr`；`BOX Long Range 214 900 kr`；`VIGO Comfort COMFORT PACK - verdi 30 000 kr 229 990 kr`；`VIGO Signature 259 990 kr`；`© 2026 Electric Way`

---

### Lotus（NO 挪威 `www.lotuscars.com/en-NO`：**配置器/定价 API 直出 NOK；Eletre X 与 Emeya 以配置器为准，Emira 6 变体与 Evija 全链路无价**）✅ 部分无价

- **可达性**：`www.lotuscars.com/en-NO` curl 200（Sitecore + Vue SSR）；配置器 SPA 可直开 `/en-NO/configurator/<model>/<version>`；定价 API 可 curl（2026-11-20）。
- **★ 车型全集（5 车系 / 20 版本）**：Emira 6（420 Sport / Turbo / Turbo SE / Turbo SE Racing Line / V6 SE / V6 SE Racing Line）· **Eletre X** 2（H550 / H1000，PHEV）· Eletre 6（600 / 600 GT / 600 GT SE / 600 Sport SE / 900 Sport / 900 Sport Carbon）· Emeya 5（600 GT / 600 GT SE / 600 Sport SE / 900 Sport / 900 Sport Carbon）· Evija 1。产品树 `configurator.prd.configurator.eu.lotuscars.com/products/products/NO` 与站点导航双证。
- **★ 取价源**：`GET https://configurator.prd.configurator.eu.lotuscars.com/ruler/pricing/<MODEL>/NO/<MHP_CODE>` → `{"currency":"NOK","retailPrice":N}`，取 `retailPrice`。⚠ 路径顺序是 `/<MODEL>/NO/<CODE>`（不是 `<CODE>/NO`，写反返回 200 空 body）。
- **⚠ 页面展示价 vs 配置器（配置器为准）**：
  - Eletre 车型页 `Available from NOK 1,049,000` = 配置器 1 049 000 ✔
  - **Eletre X 车型页 `Available from NOK (1).449.000.*` 已过期**；配置器/API 为 H550 **1 492 300**、H1000 **1 742 300** → 取配置器。
  - Emeya 车型页 `Available from 1,149,000 NOK` 是取整展示价；配置器逐版本为 600 GT **1 149 318**、600 GT SE **1 249 318**（API `retailPrice` 为 1149317.75 / 1249317.75，配置器显示取整到克朗）→ 取配置器整数。
- **★ 无价判定**：Emira 6 个 `MHP_EMIRA_*` 定价请求全部 `500 Internal Server Error`，车型页/配置器/摘要页（YOUR LOTUS EMIRA）均无金额 → `官网无价格`；Evija `MHP_EVIJA` 返回 200 空 body，页面无价 → `官网无价格`。二者均照常逐版本出行。
- **年款**：车型页可见文本、配置器版本卡、产品树、定价 API 均无 `MY` / `modellår` / `årsmodell`；`MY26_*`（Eletre）与 `my26-*`（Emira）、`/content-my24/`（Emeya）只出现在图片素材名/路径 → 按规则不采信，全部 `官网无年款`。
- **燃油**：Emira = Gasoline；Eletre X = PHEV（配置器卡逐字 `PHEV`，1 974 cc X-Hybrid）；Eletre / Emeya / Evija = BEV（配置器卡 `EV`）。
- **NOK 格式**：空格千分位（`1 049 000`），不带 `kr`；生成与回读使用 `--money space`。
- **交付结果**：`Lotus_NO_官网价_20261120.xlsx`，**20 条 / 5 车系**（Emira 6 · Eletre X 2 · Eletre 6 · Emeya 5 · Evija 1）；有价 13 条 NOK 1 049 000–1 749 000；燃油 BEV 12 · PHEV 2 · Gasoline 6；年款全 `官网无年款`。
- **实测**：2026-11-20
- **来源**：`https://www.lotuscars.com/en-NO`；`https://www.lotuscars.com/en-NO/{emira,eletre-x,eletre,emeya,evija}`；`https://www.lotuscars.com/en-NO/configurator/{eletre/eletre-600,emeya/emeya,emira/emira-turbo-se}`；`https://configurator.prd.configurator.eu.lotuscars.com/products/products/NO`；`https://configurator.prd.configurator.eu.lotuscars.com/ruler/pricing/<MODEL>/NO/<MHP_CODE>`
- **原文**：`Available from NOK 1,049,000`（Eletre）；`Available from NOK (1).449.000.*`（Eletre X，过期展示价）；`Available from 1,149,000 NOK`（Emeya）；`From 1 492 300 kr` / `From 1 742 300 kr`（配置器 Eletre X）；`From 1 149 318 kr` / `From 1 249 318 kr`（配置器 Emeya）；`{"currency":"NOK","wholeSalePrice":1049000,"retailPrice":1049000,"transferPrice":1049000}`；`{"message":"Internal Server Error","statusCode":500}`（全部 Emira 变体）
- **与 FR 差异**：同一套 `ruler/pricing` API；FR Emira 有价（99 100 € 起），**NO Emira 全变体 500 + 全链路 0 价**；FR 有 Eletre X 2 版但无 Eletre X 过期展示价问题；NO 的 Emeya 600 GT/GT SE 含 `.75` 克朗小数，按配置器显示取整。

---

### Renault（NO 挪威 `www.renault.no`：**Vercel Security Checkpoint 拦 curl，真浏览器可开；官方价目表 PDF 走 `rn-nordic-prod.objects.frb.io` 直链；乘用车取 `veil.kundepris`、不取 `LAGERKAMPANJE` 清库价，商用车取 `Kundepris eks. mva`**）✅

- **可达性**：`renault.no` / `www.renault.no` curl 返回 **429 Vercel Security Checkpoint**（25 KB 挑战页）；真浏览器正常（2026-11-20）。站点是 Next.js，`/personbil`、`/varebil`、`/brosjyrer` 可直读。PDF 资源在 `rn-nordic-prod.objects.frb.io`，curl 直链 200。
- **⚠ 本机 DLP 包 PDF**：落盘的 `*.pdf` 会在数秒内被加 `%TSD-Header-###%` 头，`pdftotext` 报 `Couldn't read xref table`。做法：**同一条命令** `curl … | cat > tmp.pdf && pdftotext -table tmp.pdf -`（xpdf 4.00，用 `-table` 最整齐；`-raw` 会丢价格列），读完即删；文本文件也会被重新包装，不要在后续命令里再读。
- **★ 在售范围（8 车系 / 35 版本）**：`/personbil` 4 个在售：**Renault 5 E-Tech Electric** 6 · **Renault 4 E-Tech Electric** 6 · **Megane E-Tech Electric** 4 · **Scenic E-Tech Electric** 5；`/varebil` 4 个在售：**Kangoo** 3 · **Trafic** 5 · **Master** 3 · **Master E-Tech Electric** 3。**未开售不入表**：Twingo E-Tech Electric（`Kommer snart`）、Nye Megane E-Tech Electric（`Kommer 2027`）、Renault 5 Turbo 3E（`Kommer 2028`）、Trafic E-Tech Electric（`Kommer snart` / `Årets Varebil 2027`）。
- **★ 取价源**：`https://www.renault.no/brosjyrer` 的 8 个 `prisliste` PDF（乘客车 4 + 商用车 4）。乘客车取 **`veil.kundepris`**；商用车表有 `Kundepris inkl. mva` / `eks. mva` 两列，**取 `eks. mva`**（与站点 `Fra kr …` 一致，且沿用 Ford NO 商用车口径）。
- **⚠ LAGERKAMPANJE 清库价（R5 / R4 / Scenic）**：价目表每个 trim 两行——正常行 + `LAGERKAMPANJE**`（`Gjelder så langt lageret rekker. Kontrakter i perioden 01.10.26-31.12.26. Registrering før 31.12.26.`）。**站点卡片 `Fra kr 249 900` 是促销价，不采**；目录价取正常行：
  - R5：evolution 40 = **269 900**（促销 249 900）· techno 40 = 299 900（279 900）· evolution 52 = 299 900（279 900）· techno 52 = 333 900（299 900）· iconic five 52 = 358 900（319 900）· Roland-Garros 52 = 371 900（339 900）
  - R4：evolution 40 = **299 900**（249 900）· evolution 52 = 327 900（279 900）· techno 52 = 364 900（299 900）· techno plein sud 52 = 374 900（319 900）· iconic 52 = 389 900（319 900）· iconic plein sud 52 = 399 900（329 900）
  - Scenic：evolution 60 = **345 900**（319 900）· techno 60 = 382 900（339 900）· techno 87 = 445 900（399 900）· esprit Alpine 87 = 470 900（424 900）· iconic 87 = 495 900（439 900）
- **⚠ 乘用车税价口径**：价目表逐字 `Det beregnes 25 % mva av det beløpet på bil og fabrikkmontert ekstrautstyr som overstiger kr 300 000,-`、`Dersom totalbeløpet er under kr 300 000,-, vil beløpet ikke inkludere mva. For å se totalsum inkludert eventuell mva benytt vår konfigurator på www.renault.no`。**配置器实测**（R5 techno 52）：汇总 `kr 333 900,- inkl. mva 3 888,-`，与价目表 `333 900 kr` 完全一致 → **`veil.kundepris` 就是最终含税客户价**（超 30 万部分按 25% 计并已含在标价内），不要再自行加税。价格含 `frakt & levering: ØRJE`（R5/R4/Scenic）或 `OSLO`（Megane），`Lokal frakt tilkommer`。
- **⚠ 商用车口径**：Kangoo / Trafic / Master / Master E-Tech 取 `eks. mva`（不含 25% MVA，含 vrakpant；`Frakt/levering kommer i tillegg`），**不得与乘用车含税价横向比较**。Master L2H2 150hk 标 `(kun lagerbiler)`。
- **年款**：8 份价目表全文 grep 无 `MY` / `modellår` / `årsmodell` / `Model Year`，只有价格生效日（`Prisliste fra 09.11.2026`、`01.01.2026`、`Veiledende kundepriser gjeldende fra 01.09.2026` 等）；Scenic 文件名 `Prisliste-Renault-Scenic-MY25-…` 只作旁证不采信；站点 `© Renault 2017-2026` 是版权年 → **全部 `官网无年款`**。
- **燃油**：R5 / R4 / Megane / Scenic / Master E-Tech = BEV（24 行）；Kangoo / Trafic / Master = Diesel（11 行）。
- **NOK 格式**：空格千分位（`269 900`），不带 `kr`；生成与回读使用 `--money space`。
- **交付结果**：`Renault_NO_官网价_20261120.xlsx`，**35 条 / 8 车系**；NOK 269 900–729 900（乘用车 vs 商用车 ex-VAT 两种口径，见上）；BEV 24 · Diesel 11；年款全 `官网无年款`。
- **实测**：2026-11-20
- **来源**：`https://www.renault.no/personbil`；`https://www.renault.no/varebil`；`https://www.renault.no/brosjyrer`；价目表 PDF：`Prisliste-Renault-5-09.11.26-3.pdf`、`Prisliste-Renault-4-Plein-Sud-09.11.26-2.pdf`、`Prisliste-Megane-E-Tech-electric-01.01.2026-V.2.2-1.pdf`、`Prisliste-Renault-Scenic-MY25-09.11.2026-V.2-1-3.pdf`、`Prisliste-Renault-KANGOO-010926-v2-uten-frakt.pdf`、`Prisliste-0109-Renault-TRAFIC-gsr2_3-uten-frakt.pdf`、`Prisliste-0109-Master-diesel-uten-frakt.pdf`、`Prisliste-Master-E-Tech-Electric-02.01.2026-2.pdf`（均在 `https://rn-nordic-prod.objects.frb.io/Cars/.../PDF/`）
- **原文**：`Fra kr 249 900,-`（R5 站点卡片，促销）；`LAGERKAMPANJE**` / `Gjelder så langt lageret rekker. Kontrakter i perioden 01.10.26-31.12.26.`；`269 900 kr`；`evolution 40 kWt urban range … 90 kW / 120 hk`；`Kundepris eks. mva`；`Priser er inkl. frakt og levering: OSLO`；`Prisen inkluderer levering Ørje. Lokal frakt tilkommer.`；`Det beregnes 25 % mva av det beløpet på bil og fabrikkmontert ekstrautstyr som overstiger kr 300 000,-.`
- **与 FR 差异**：FR 走 `fr.co.rplug.renault.com` 配置器 API 逐版本取 PVC；**NO 没有 rplug 链路**（`no.co.rplug.renault.com` TLS 握手失败），改为 RN Nordic 的 Next.js 站点 + 官方 PDF；FR 的 CEE 奖金陷阱在 NO 对应为 `LAGERKAMPANJE` 清库价，判断方式相同（取正常行，不取促销行）；NO 商用车单独用 `eks. mva`。

---

### Ferrari（NO 挪威 `www.ferrari.com/en-NO`：**裸 curl 403，带 Chrome UA 直通；Range 19 款、Range 与 19 个车型页 0 个价格字段 → 19 条全 `官网无价格`**）⚠️ 无价格出表

- **可达性**：不带 UA 的 `curl` 对 `www.ferrari.com/en-NO` 及 `/en-NO/auto/car-range` 返回 **403**（919 B CloudFront 错误页）；加 `-A "<Chrome UA>"` + `Accept-Language: en-GB` 后 **200**（Range 549 KB）。真浏览器导航 45–90 s 超时，本任务用 curl 成功（2026-11-20）。
- **★ 车型全集（19）**：`/en-NO/auto/car-range` 的 Supercars / Special series / Icona 三段：
  - Supercars：**F80 · Luce · 12Cilindri · 12Cilindri Spider · Purosangue · 849 Testarossa · 849 Testarossa Spider · Amalfi · Amalfi Spider · 296 GTB · 296 GTS**（11）
  - Special series：**12Cilindri Manuale · SF90 XX Stradale · SF90 XX Spider · 296 Speciale · 296 Speciale A**（5）
  - Icona：**Daytona SP3 · Monza SP1 · Monza SP2**（3）
- **★ 无价证据**：Range 页与 19 个车型页（`/en-EN/auto/<slug>`）的 `price` / `NOK` / `€` 命中数**全部为 0**；CTA 只有 `Build your own` / `Request information`；Next.js 数据里没有金额字段。→ 19 条 MSRP 全填 `官网无价格`，不拿经销商/媒体价冒充。
- **年款**：Range 与车型页均无 `MY` / `model year` 字段；全站唯一的 `Model year` 出现在 VIN recall 表单标签（`vin.recall.ca.model_year`），不是车型年款；版权年 `© Ferrari 2026` 排除 → 全部 `官网无年款`。
- **燃油（逐车型页判定）**：**PHEV 9**（F80、849 Testarossa ×2、296 GTB/GTS、SF90 XX Stradale/Spider、296 Speciale/Speciale A）· **Gasoline 9**（12Cilindri ×3、Purosangue、Amalfi ×2、Daytona SP3、Monza SP1/SP2）· **BEV 1**（Luce）。⚠ 与 AR 的 19 条计数（PHEV 8 · HEV 1）不同：本批逐页核对后 **没有 HEV**，849 Testarossa 为 PHEV。
- **交付结果**：`Ferrari_NO_官网价_20261120.xlsx`，**19 条 / 19 车型**；MSRP 全 `官网无价格`；年款全 `官网无年款`；燃油 PHEV 9 · Gasoline 9 · BEV 1。
- **实测**：2026-11-20
- **来源**：`https://www.ferrari.com/en-NO/auto/car-range`；`https://www.ferrari.com/en-EN/auto/{f80,ferrari-luce,ferrari-12cilindri,ferrari-12cilindri-spider,ferrari-purosangue,849-testarossa,849-testarossa-spider,ferrari-amalfi,ferrari-amalfi-spider,296-gtb,296-gts,ferrari-12cilindri-manuale,sf90-xx-stradale,sf90-xx-spider,296-speciale,296-speciale-a,ferrari-daytona-sp3,monza-sp1,monza-sp2}`
- **原文**：`F E R R A R I L I N E - U P`；`Discover the Ferrari F80`；`Discover the Ferrari Luce`；`Discover the 849 Testarossa`；`Discover the 296 GTB`；`DISCOVER THE FERRARI DAYTONA SP3`；`Build your own` / `Request information`；`© Ferrari 2026`；`"vin.recall.ca.model_year":"Model year"`

---

### JAC（NO 挪威 `jacmotors.no`：**Next.js 直通；2 车系 6 版本；官方 iPaper 价目表取 `Veil.pris levert Drammen`；E30X 3 版、T9 EV 3 版**）✅

- **可达性**：`jacmotors.no` curl 200（Next.js）；`/modeller`、`/modeller/e30x`、`/modeller/t9-ev`、`/cc/e30x`、`/cc/t9-ev` 均可直读；T9 车型页偶发 TLS `Recv failure`，重试即可（2026-11-20）。
- **★ 车型全集（2 车系）**：**E30X**（3 版）· **T9 EV 4x4**（3 版）。导航与 sitemap 均只有这两款；`/modeller/e-js4` 为 404，e-JS4 仅出现在 `kampanjer` 促销页。
- **★ 取价源（iPaper PDF）**：车型页 `Prisliste` 指向
  - E30X：`https://viewer.ipaper.io/rsa-no/jac-norge/jac-e30x-prisliste/`
  - T9：`https://viewer.ipaper.io/rsa-no/jac-norge/jac-t9-prisliste/`
  下载方式：**POST `<viewer>/GetPDF.ashx`，body `pageNumbers=`** → 302 到 `cdn.ipaper.io/iPaper/Papers/<guid>/Download.pdf?token=…`，再 GET 该签名 URL（带 Chrome UA）。⚠ 本机 DLP 会包 PDF：**POST→GET→`pdftotext -layout` 必须在同一条命令里完成**。价目表列：`Nettoris eks. mva. og Regavgift ink avgifter` / `vrakpant` / `Mva.` / **`Veil.pris levert Drammen`**（采最后一列）。
- **★ 价格（NOK，含税、levert Drammen）**：
  - E30X：**Pure 40 = 219 900**（车型页 `Fra 217 500 kr · Pris uten registreringsavgift`；价目表加 2 400 reg.avgift 后 219 900）· **Pure 50 = 254 900** · **Nordic Edition 50 = 259 900**
  - T9 EV 4x4：**524 900** · **5-seter Nordic Edition = 618 000** · **2-seter Nordic Edition 价目表列名但无金额 → `官网无价格`**
- **⚠ 促销不采**：站点 `fra kun 219 000,-`（Introduksjonskampanje）与 e-JS4 `299 900`（`Spar kr. 111.000`，且无车型页）均为促销价，不采。
- **年款**：价目表只有 `Prisliste 1/2026 · Gjeldende fra Januar 2026`（价格生效日）；车型页/配置器/PDF 均无 MY/årsmodell/modellår → 全部 `官网无年款`。
- **燃油**：全 BEV。
- **NOK 格式**：空格千分位（`219 900`）。
- **交付结果**：`JAC_NO_官网价_20261120.xlsx`，**6 条 / 2 车系**；NOK 219 900–618 000；BEV 6；1 条 `官网无价格`。
- **实测**：2026-11-20
- **来源**：`https://jacmotors.no/modeller`；`https://jacmotors.no/modeller/{e30x,t9-ev}`；`https://jacmotors.no/cc/{e30x,t9-ev}`；`https://viewer.ipaper.io/rsa-no/jac-norge/jac-{e30x,t9}-prisliste/`
- **原文**：`E30X Fra 219 900 kr`；`E30X Pure 40 Fra 217 500 kr Pris uten registreringsavgift`；`E30X Pure 50 Fra 254 900 kr`；`E30X Nordic Edition 50 Fra 259 900 kr`；`Nå får du JAC E30X fra kun 219 000,-`；`Veil.pris levert Drammen`；`Prisliste 1/2026` / `Gjeldende fra Januar 2026`；`JAC T9 EV 4x4 5-seter Nordic Edition … 618 000`

---

> 注：挪威各站均按官网展示价采集。Toyota 与 Fiat 的 PDF 价格含 frakt/levering Oslo；Ford PV `grossOTR` 含 delivery + registration、CV 14 行为 `Eks. MVA`；Land Rover 取 `price.RETAIL`（= GROSS，NOK）。官网未逐字标注含税性的不推断。复用时先重取 catalogId / 价格表 PDF 文件名（品名里带日期）。
