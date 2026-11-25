# 俄罗斯 RU — 站点坑位详段

> 市场码 RU · 22 段 · 品牌：Ferrari / Porsche / TENET / Rolls-Royce / Evolute / Foton / Maserati / SWM / Yangwang / Soueast / AVATR / Belgee / McLaren / Exeed / GAC / VGV / Moskvich / Hongqi / KGM / Denza / JAC / Kaiyi
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-11-24 · 文中 snapshotVersion / token / 车型 id 均为当时实测值，必须现取
>
> **RU 价格边界**：官方授权经销商/进口商站只能证明车型存在或不标价；库存价、成交价、普通展示价不得直接冒充厂商 MSRP。只有厂商明确标注的 RRЦ / МРЦП / RRP 且无折扣、无置换、无选装时才可采，否则写 `未核实` 或 `官网无价格`。RUB 生成与回读统一用 `--money space`。
>
> **RU 年款校准（2026-11-25）**：俄语 `год выпуска` / `г.в.` / `2026 года производства` 只要绑定到具体车型、trim、价格或库存车，就按车辆年份采（2026 / 2025 / 2023）；只有 `действует с` / `цена от` / 版权年 / 活动期才排除。旧段中“生产年一律不采”的表述以本规则为准。

---

### Ferrari（RU 俄罗斯 `www.ferrari.com/ru-RU`：**官方俄语站可开；Range 20 款、全站 0 个价格字段，20 条全 `官网无价格`**）⚠️ 无价格出表

- **可达性**：带 Chrome UA + `Accept-Language: ru-RU` 的 curl 对 `www.ferrari.com/ru-RU` 200（154 KB）、`/ru-RU/auto/car-range` 200（562 KB）；`/ru-RU/auto/gama`、`/ru-RU/models` 404（俄罗斯用 car-range，不用 gama）（2026-11-23）。
- **★ 车型全集（20）**：`/ru-RU/auto/car-range` 的 Supercars / Ограниченная серия / Icona：
  - Supercars：**F80 · Luce · 12Cilindri · 12Cilindri Spider · Purosangue · 849 Testarossa · 849 Testarossa Spider · Amalfi · Amalfi Spider · 296 Challenge Stradale · 296 GTB · 296 GTS**（12）
  - Ограниченная серия：**12Cilindri Manuale · SF90 XX Stradale · SF90 XX Spider · 296 Speciale · 296 Speciale A**（5）
  - Icona：**Daytona SP3 · Monza SP1 · Monza SP2**（3）
  - ⚠ 与 en-NO 的 19 款差异：俄区多 **296 Challenge Stradale**（`/ru-RU/auto/296-challenge-stradale`）。
- **★ 无价证据**：Range 页 `price` / `RUB` / `₽` / `руб` 命中数全部为 0；车型页同样 0 个价格字段，CTA 只有 `Конфигуратор` / `Запросить информацию`。→ 20 条 MSRP 全填 `官网无价格`。
- **年款**：Range 与车型页无 MY/model year；唯一的 `Model year` 在 VIN recall 表单标签（`vin.recall.ca.model_year`），不是车型年款；版权年 `© Ferrari 2026` 排除 → 全部 `官网无年款`。
- **燃油**：**PHEV 9**（F80、849 Testarossa ×2、296 GTB/GTS、SF90 XX ×2、296 Speciale/A）· **Gasoline 10**（12Cilindri ×3、Purosangue、Amalfi ×2、Daytona SP3、Monza SP1/SP2、**296 Challenge Stradale**）· **BEV 1**（Luce）。296 Challenge Stradale 页面 V6 13 次、无 hybrid/electric 字样 → Gasoline。
- **交付结果**：`Ferrari_RU_官网价_20261120.xlsx`，**20 条 / 20 车型**；MSRP 全 `官网无价格`；年款全 `官网无年款`；PHEV 9 · Gasoline 10 · BEV 1。
- **实测**：2026-11-23
- **来源**：`https://www.ferrari.com/ru-RU/auto/car-range`；`https://www.ferrari.com/ru-RU/auto/{f80,ferrari-luce,ferrari-12cilindri,ferrari-12cilindri-spider,ferrari-purosangue,849-testarossa,849-testarossa-spider,ferrari-amalfi,ferrari-amalfi-spider,296-challenge-stradale,296-gtb,296-gts,ferrari-12cilindri-manuale,sf90-xx-stradale,sf90-xx-spider,296-speciale,296-speciale-a,ferrari-daytona-sp3,monza-sp1,monza-sp2}`
- **原文**：`М О Д Е Л Ь Н Ы Й Р Я Д F E R R A R I`；`Посмотреть Ferrari F80`；`Посмотреть 296 Challenge Stradale`；`Конфигуратор` / `Запросить информацию`；`© Ferrari 2026`；`"vin.recall.ca.model_year":"Model year"`

---

### Porsche（RU 俄罗斯 `www.porsche.ru`：**域名无 A 记录、站点已下线；porsche.com/russia 与配置器均 403 → 无官方 RUB MSRP**）❌ 无数据

- **★ `www.porsche.ru` 已下线**：公共 DNS（Cloudflare DoH）对 `www.porsche.ru` 返回 **NXDOMAIN**；`porsche.ru` apex 只有 SOA（`ns3-l2.nic.ru`），**无 A 记录**。curl 对 https 为 `schannel: failed to receive handshake`，http 经代理 502，WebFetch 亦 `fetch failed`（2026-11-23）。域名仍注册，但没有可访问的 Web 主机。
- **★ 官方替代入口也不可用**：`https://www.porsche.com/russia/`、`/ru-RU/`、`/russia/ru/` 均为 **403 Akamai `Access Denied`**（380–388 B）；`configurator.porsche.com/ru-RU` 403 并跳到 `www.porsche.com/usa/models/`。
- **★ 对比站不是俄区**：`compare.porsche.com/ru-RU` 200，但 302 到 **`compare.porsche.com/en-XW`**（国际站，`lang="en-XW"`），不是俄罗斯市场，也没有 RUB 报价；**不得拿 en-XW 的价格冒充 RU**。
- **结论**：Porsche 目前没有可访问的俄罗斯官方零售站，无法采官方 RUB MSRP → 按 §E 止损，不出 Porsche_RU 表；也不使用第三方/经销商/归档价。
- **实测**：2026-11-23
- **来源**：`https://www.porsche.ru/`；`https://www.porsche.com/russia/`；`https://www.porsche.com/ru-RU/`；`https://configurator.porsche.com/ru-RU`；`https://compare.porsche.com/ru-RU`；Cloudflare DoH `https://cloudflare-dns.com/dns-query?name=www.porsche.ru&type=A`
- **原文**：DoH `{"Status":3,...}`（NXDOMAIN）；`curl: (35) schannel: failed to receive handshake, SSL/TLS connection failed`；`Access Denied`；`You don't have permission to access "http://www.porsche.com/…`；`https://compare.porsche.com/en-XW`（`lang="en-XW"`）

---

### TENET（RU 俄罗斯 `tenet.ru`：**官方站 nav 的「от X ₽」是含置换促销价；取每车型「Прайс-лист」PDF 的常规价行（= 促销价 + трейд-ин 抵扣 + 额外抵扣）**）✅

- **可达性**：`tenet.ru` curl 200（WordPress 风格，483 KB）；`/models/{t4l,t7,t8,t9,a8}/`、`/customers/{configurator,comparison}/` 均 200；配置器是 Yandex Cloud 的 perxis widget，价格表 PDF 在 `1.cdn.perxis.ru/originals/<id>/original`（2026-11-23）。
- **★ 取价链路**：车型页 `Прайс-лист` / `Скачать прайс-лист` 按钮的 href → perxis PDF；每份 PDF 首屏是价格矩阵：
  - 第 1 行 = **含营销活动的促销价**（站点 `от X ₽` 同值）
  - 第 2 行 = **трейд-ин 抵扣**（150 000 / 200 000 等）
  - 第 3 行 = **常规价**（= 第 1 + 第 2 [+ 第 3 个 50 000 抵扣]）→ **采这一行**
  - 金融示例可交叉验证：`T4L Актив 2026 г.в. … 2 344 000 руб.` 与常规价一致；站点 `от 2 194 000` 是减 150 000 трейд-ин 后的价。
- **★ 在售范围（5 车系 / 15 版本）**：
  - T4L 2：Active 1.5T 147 DCT6 2WD = **2 344 000** · Prime 1.5T 147 DCT6 2WD = **2 494 000**
  - T7 4：Active/Prime × 2WD/4WD = **2 830 000 / 3 005 000 / 3 010 000 / 3 210 000**
  - T8 4：Active 1.6T 186 = **3 099 000** · Prime 1.6T 186 = **3 299 000** · Prime 2.0T 197 = **3 630 000** · Ultra 2.0T 197 = **3 885 000**
  - T9 3：Prime 5 = **3 949 000** · Ultra 5 = **4 299 000** · Ultra 7 = **4 449 000**
  - A8 2：Prime 1.6T 150 DCT7 = **2 999 000** · Ultra 2.0T 197 AT8 = **3 499 000**
- **⚠ 坑**：① PDF 的 Cyrillic 文本层没有 ToUnicode，`pdftotext` 只能抽到数字和拉丁字母，行标签丢失 → 用「常规价 = 促销 + 抵扣」的算术关系 + 金融示例确认列义；② PDF 8–11 MB，本机 DLP 会包 `%TSD-Header`，必须**下载 + `pdftotext` 同一条命令**；③ 配置器 widget 的 `/data/widget_configurator_version/index.json` 只返回 1 字节，拿不到 trim 数据，别在它上面耗时间；④ 车型页 nav 的 `от` 价是促销，不是 MSRP。
- **年款**：价目表页眉 `2026` 与金融示例 `TENET T7 2026 г.в.` 都绑定到具体车型/trim/价格 → 全部 **2026**（不是文档生效日）。
- **燃油**：T4L/T7/T8/T9/A8 全部 1.5T/1.6T/2.0T 汽油 → Gasoline。
- **交付结果**：`TENET_RU_官网价_20261123.xlsx`，**15 条 / 5 车系**；RUB 2 344 000–4 449 000；Gasoline 15；年款全 **2026**。
- **实测**：2026-11-23
- **来源**：`https://tenet.ru/models/`；`https://tenet.ru/models/{t4l,t7,t8,t9,a8}/`；价目 PDF：`https://1.cdn.perxis.ru/originals/{dbq7s3ss5adg00dgrd60,dbv8bsss5adg00dgrmlg,dar85vqto5r2kdf2fi7g,dbgp144s5adg00dgqn1g,dbqm824s5adg00dgrdd0}/original`
- **原文**：`T4L от 2 194 000 ₽`；`Рекомендуемая цена перепродажи. Не является публичной офертой.`；`Максимальная цена перепродажи с учетом маркетинговых акций`；`T4L … комплектации Актив Передний привод, 2026 г.в, 2 344 000 руб.`；`T7 … 2026 г.в комплектации Актив Передний привод с учетом скидки по программе трейд-ин в размере 150 000 руб, составляет 2 680 000 руб.`；`T8 … 2 899 000,00 руб.`；`T9 … Прайм … 3 749 000,00 руб.`；`2026 / Active / Prime`

---

### Rolls-Royce（RU 俄罗斯 `www.rolls-roycecars.ru`：**Rolls-Royce Motor Cars Moscow / БорисХоф 官方经销商站；车型页不标价，只有「Предложите вашу цену」→ 9 条全 `官网无价格`**）⚠️ 无价格出表

- **可达性**：`www.rolls-roycecars.ru` curl 200（1C-Bitrix；61 KB 首页）；`/models/<slug>/` 均 200，但车型页正文是 JS 异步加载（静态 HTML 显示 `Страница загружается...`）；`/models/` 静态 HTML 里有完整车型链接（2026-11-23）。
- **★ 当前车型（9）**：**Spectre** · **Cullinan Series II** · **Ghost Series II** · **Ghost Series II Extended** · **Phantom** · **Phantom Extended** · **Black Badge Cullinan Series II** · **Black Badge Ghost Series II** · **Black Badge Spectre**。`/models/` 后半段另有 Cullinan / Ghost / Phantom VIII / Phantom EWB / Ghost Extended / Wraith / Dawn / Dawn Black Badge / Wraith Black Badge / Cullinan Black Badge 等历史车型，不入当前表。
- **★ 无价证据**：9 个车型页 0 个 `₽`/整车金额；页面 CTA 是 `Предложите, пожалуйста, Вашу цену на данный роскошный автомобиль`（请出价）+ `Укажите e-mail и мы сообщим, если цена изменится`；`/our-offer/cars-in-stock/` 有**库存车**价格（如 `Старая цена 67 000 000,00`），但那是单车库存价/经销商报价，不是厂商 MSRP → **不采**，9 条全填 `官网无价格`。
- **年款**：车型页/`/models/` 无 MY/`модельный год`/`год выпуска` 字段；`Series II` 是产品系列代号；库存页的年份属于单车 → 全部 `官网无年款`。
- **燃油**：Spectre 与 Black Badge Spectre = BEV；其余 7 款 = Gasoline（V12/V8）。
- **交付结果**：`Rolls-Royce_RU_官网价_20261123.xlsx`，**9 条 / 9 车型**；MSRP 全 `官网无价格`；年款全 `官网无年款`；BEV 2 · Gasoline 7。
- **实测**：2026-11-23
- **来源**：`https://www.rolls-roycecars.ru/models/`；`https://www.rolls-roycecars.ru/models/{spectre,cullinan-series-ii,ghost-series-ii,ghost-series-ii-extended,phantom,phantom-extended,black-badge-cullinan-series-ii,black-badge-ghost-series-ii,black-badge-spectre}/`；`https://www.rolls-roycecars.ru/our-offer/cars-in-stock/?TYPE=new`
- **原文**：`Rolls-Royce в Москве | Rolls-Royce Motor Cars Moscow - официальный дилер`；`Предложите, пожалуйста, Вашу цену на данный роскошный автомобиль`；`Укажите, пожалуйста, Ваш e-mail и мы сообщим, если цена на этот автомобиль изменится`；`Старая цена 67 000 000,00`（库存车）；`Страница загружается...`

---

> 注：俄罗斯站价格为 RUB，本批统一按空格千分位、不带 ₽ 输出；TENET 的常规价与促销价已在段内说明。

---

### Evolute（RU 俄罗斯 `www.evolute.ru`：**官方厂方站；站点 `от …` 是叠加 господдержка/прямая выгода/трейд-ин/кредит 后的促销价，必须取 RRЦ**）✅

- **可达性**：`www.evolute.ru` curl 200；车型页 `/models/i-joy-new`、`/models/i-space-new`、`/models/i-sky-new` 可读；价目表 `/media-link/{new-i-joy,new-i-space,i-space-4x4,new-i-sky}-pricelist` 直出 PDF（2026-11-23）。
- **★ 车型/版本（6）**：i-JOY **Бизнес / Сити+**（车型页 `2 комплектации`）· i-SPACE **5-местный / 7-местный** · i-SPACE 4x4 · i-SKY。
- **★ 价格陷阱（RRЦ vs 促销）**：站点 headline `от 2 199 000 ₽` 等是**补贴/贴息/置换后的促销价**；同页脚注逐字给出 `рекомендованная розничная цена`：i-JOY 3 124 000 / 3 324 000 · i-SPACE 5/7 座 3 585 000 / 3 685 000 · i-SPACE 4x4 3 890 000 · i-SKY 3 515 000。**采 RRЦ，不采 `от`**。
- **年款**：价目表 `2026 года производства` 绑定到车型/价格 → 全部 **2026**。
- **燃油**：i-JOY / i-SKY = BEV；i-SPACE / i-SPACE 4x4 官方 `последовательный гибрид`（串联混动、发动机发电、可外接充电）→ **REEV**。
- **交付结果**：`Evolute_RU_官网价_20261123.xlsx`，**6 条 / 4 车型**；RUB 3 124 000–3 890 000；BEV 3 · REEV 3。
- **实测**：2026-11-23
- **来源**：`https://www.evolute.ru/models/{i-joy-new,i-space-new,i-sky-new}`；`https://www.evolute.ru/media-link/{new-i-joy,new-i-space,i-space-4x4,new-i-sky}-pricelist`
- **原文**：`от 2 199 000 ₽`；`рекомендованная розничная цена которого составляет 3 124 000 рублей`；`3 585 000` / `3 685 000` / `3 890 000` / `3 515 000`；`2 комплектации`；`Бизнес` / `Сити+`；`5-местный` / `7-местный`；`последовательный гибрид`

---

### Foton（RU 俄罗斯 `foton-mbrus.ru`：**官方经销商 МБ РУС；价目表 PDF 同时列 РРЦ 与 −150 000/−300 000 促销，取 РРЦ**）✅

- **可达性**：`foton-mbrus.ru` curl 200；`/models/{tunland-v9,tunland-v7,tunland-g9,tunland-g7,view,toano-pro}` 可读；`/media-link/<model>-price` 直出 PDF（2026-11-23）。
- **★ 车系（6）**：TUNLAND V9 · TUNLAND V7 · TUNLAND G9 · TUNLAND G7 · VIEW · TOANO PRO。
- **★ 价格（取 РРЦ，不取促销）**：V9 5 450 000（两版 5 550 000 / 5 450 000）· V7 5 250 000（5 250 000 / 5 550 000）· G9 3 990 000 · G7 3 200 000 · VIEW 3 400 000 起 · TOANO 2025 3 400 000 / 2026 3 525 000 起。站点 `от 5 150 000` 等是扣 −150 000/−300 000 后的促销价。
- **⚠ PDF 西里尔文限制**：xpdf `pdftotext` 对这些 PDF 的 Cyrillic 无 ToUnicode（版本名空白），只能读数字/拉丁发动机代号；因此本表按**车型最低 РРЦ** 出一行，版本级列在官方 PDF 内但未可靠取出版本名。
- **年款**：TOANO 价目表按 `2025 г.в.` / `2026 г.в.` 分行 → 2025/2026；其余只有 `01.10.2026` 价格生效日、无 MY → `官网无年款`。
- **燃油**：V7（Aucan 2.0D）、G9（4F20TC15）、VIEW（4F20TC34）、TOANO（4F25TC2）= Diesel；G7（4K22T）= Gasoline；V9 同时有 159 hp 柴油与 245 hp 汽油两版 → `未标注`。
- **交付结果**：`Foton_RU_官网价_20261123.xlsx`，**7 条 / 6 车系**；RUB 3 200 000–5 450 000。
- **实测**：2026-11-23
- **来源**：`https://foton-mbrus.ru/models/{tunland-v9,tunland-v7,tunland-g9,tunland-g7,view,toano-pro}`；`https://foton-mbrus.ru/media-link/{tunland-v9,tunland-v7,tunland-g9,tunland-g7,view,toano-pro}-price`
- **原文**：`Foton Tunland V9 01.10.2026`；`5 550 000` / `-300 000` / `5 250 000`；`5 450 000` / `-400 000` / `5 050 000`；`2025 г.в.` / `2026 г.в.`；`Aucan 117 / 159`；`4K31TD 180 / 245`；`4F20TC15`；`4K22T`；`4F20TC34`；`4F25TC2`

---

### Maserati（RU 俄罗斯 `maseratimoscow.ru`：**Модификации 展开 13 个版本（Ghibli 5 / Levante 4 / Quattroporte 4），0 个价格字段 → 13 条全 `官网无价格`**）⚠️ 无价格出表

- **可达性**：`maseratimoscow.ru/models/` curl 200（36 KB）；`/model/{ghibli,levante,quattroporte}/` 均 200；`/cars` 200（2026-11-23）。
- **★ 车型/版本（13）**：Ghibli **Trofeo / GT Hybrid / Modena / Modena S / Modena S Q4**（5）· Levante **Trofeo / GT Hybrid / Modena / Modena S**（4）· Quattroporte **Trofeo / GT / Modena / Modena Q4**（4）。版本名取自各车型页 `Модификации Maserati <model>` 标签。
- **★ 无价证据**：3 个车型页与 `/cars` 均 0 个 `₽`/`price` 金额（`руб` 命中仅为地址 `Рублево-Успенское шоссе`）；每个版本 CTA 只有 `Получить дополнительную информацию`。Maserati 在俄无厂方站，该经销商站是唯一官方车型来源 → 13 条 MSRP 全 `官网无价格`，不采库存/第三方价。
- **年款**：无 MY/`модельный год`/`год выпуска` → 全部 `官网无年款`。
- **燃油**：Ghibli GT Hybrid / Levante GT Hybrid = **MHEV**（2.0 L4 48V 轻混）；其余 11 款 Gasoline（V6/V8）。
- **交付结果**：`Maserati_RU_官网价_20261123.xlsx`，**13 条 / 3 车系**；MSRP 全 `官网无价格`；MHEV 2 · Gasoline 11。
- **实测**：2026-11-23
- **来源**：`https://maseratimoscow.ru/models/`；`https://maseratimoscow.ru/model/{ghibli,levante,quattroporte}/`；`https://maseratimoscow.ru/cars`
- **原文**：`Модификации Maserati Ghibli Ghibli Trofeo Ghibli GT Hybrid Ghibli Modena Ghibli Modena S Ghibli Modena S Q4`；`Модельный ряд Maserati Levante Levante Trofeo Levante GT Hybrid Levante Modena Levante Modena S`；`Модификации Maserati Quattroporte Quattroporte Trofeo Quattroporte GT Quattroporte Modena Quattroporte Modena Q4`；`Получить дополнительную информацию`
---

### SWM（RU 俄罗斯 `swm-auto.ru`：**perxis 站；3 车系各 1 个 From 价；2025 价目表已过期且与站点 2026 展示价不一致，未用于定价**）✅

- **可达性**：`swm-auto.ru` curl 200（perxis/WordPress 风格）；`/models/{swm-g01f,swm-g01pro,swm-g05pro}/` 均 200（2026-11-23）。
- **★ 车型与当前价（3 行）**：**SWM G01Pro = 2 789 900** · **SWM G01F = 2 639 900** · **SWM G05 Pro = 2 559 900**（站点 nav「от」，带 `*` 脚注；每款只有 1 个展示价粒度）。
- **⚠ 价目表不能直接用**：车型页 `Прайс-лист` 链接的 perxis PDF 分别是 2025-10-30（G01F，Smart 2 367 000 / Force 2 449 500）、2025-12-12（G05Pro，2 499 900 / 2 559 900）；G01Pro 的 PDF 无价格。G01F 与站点 2 639 900 差 27 万，说明 PDF 为旧版；**本次按站点当前 From 价出车系级表，不混用旧 PDF 的 trim 价**。
- **年款**：站点/车型页无 MY/`модельный год`；PDF 日期与页面 2026 活动期都不是年款 → 全部 `官网无年款`。
- **燃油**：G01F/G01Pro/G05Pro 均 1.5T 汽油 → Gasoline。
- **交付结果**：`SWM_RU_官网价_20261123.xlsx`，**3 条 / 3 车系**；RUB 2 559 900–2 789 900；Gasoline 3；年款全 `官网无年款`。
- **实测**：2026-11-23
- **来源**：`https://swm-auto.ru/models/`；`https://swm-auto.ru/models/{swm-g01f,swm-g01pro,swm-g05pro}/`
- **原文**：`от 2 789 900 ₽*`；`от 2 639 900 ₽*`；`от 2 559 900 ₽*`；`Прайс-лист`；`Скачать`；`Информация … не является публичной офертой`

---

### Yangwang（RU 俄罗斯 `yangwang-russia.ru`：**Tilda 进口商库存目录；仅 U8 2023 库存 3 台，价格不是厂商 MSRP**）⚠️ 非厂商 MSRP

- **可达性**：`yangwang-russia.ru` curl 200（Tilda，938 KB）；`/catalog` 与 3 个 U8 详情页均 200（2026-11-23）。
- **★ 在售范围**：只有 **Yangwang U8**，3 条库存：
  - `41678831` 银色 18 750 000 ₽
  - `41678832` 银色 19 750 000 ₽（同色第二台）
  - `41681898` 黑色 17 300 540 ₽
  三台配置相同：2.0 л / 1197 л.с. / Гибрид、4WD、5 门 SUV、2023 年、1 km。
- **★ 价格口径**：站点是「официальных дилеров и импортеров」库存目录，明示「цены могут отличаться от действительных цен дилеров」→ 属经销商/进口商库存价，不是厂商 MSRP。标准 MSRP 任务**不得把 18 750 000 / 19 750 000 / 17 300 540 写入主表数字价**；U8 的厂商 MSRP 未确认，主表写 `未核实`，库存价只在用户明确要求时写交付说明。
- **年款**：库存车字段逐字 `Год выпуска 2023` 绑定到该台具体车辆 → **2023**（该车出厂年份/年款，不是网页日期）。
- **燃油**：2.0T + 四电机、页面逐字 `Гибрид` → **PHEV**。
- **交付结果（旧口径，需重出）**：`Yangwang_RU_官网价_20261123.xlsx` 曾按库存价出 2 条数字价；按现行规则应改为 `未核实`，不得继续把进口商库存价当 MSRP。
- **实测**：2026-11-23
- **来源**：`https://yangwang-russia.ru/catalog`；`https://yangwang-russia.ru/catalog/yangwang-u8/{41678831,41678832,41681898}`
- **原文**：`Каталог Yangwang 2023 — 18 750 000 ₽`；`19 750 000 ₽`；`17 300 540 ₽`；`Год выпуска 2023`；`2.0 л / 1197 л.с. / Гибрид`；`Сведения о ценах … носят исключительно информационный характер … могут отличаться от действительных цен дилеров`

---

### Soueast（RU 俄罗斯 `soueast.ru`：**官方价目表 PDF；3 车系 8 版本；取常规价行，2026 年款折扣不采**）✅

- **可达性**：`soueast.ru` curl 200；`/cars`、`/models/{s06,s07,s09}` 均 200；`/media-link/{s06,s07,s09}-pricelist` 直接返回 `application/pdf`（2026-11-23）。
- **★ 车型/配置/常规价**（主表型号用英文；俄文站点写 Престиж = **Prestige**、Премиум = **Premium**）：
  - **S06**：**Prestige 2WD** 1.5T 6 = **3 029 000** · **Prestige AWD** 1.6T 8 = **3 409 900**（折扣后 2 589 000 / 2 899 900，不采）
  - **S07**：**Prestige** 1.6T 8 AWD = **3 399 000**（2025 与 2026 同常规价；2026 折扣后 2 999 000）· **Premium** 1.6T 8 AWD = **3 549 000**（2026 折扣后 3 249 000）
  - **S09**：**Prestige** 2.0T 7 2WD = **3 899 000** · **Premium** 2.0T 8 AWD = **4 099 000**（2025）
- **年款**：S07 价目表列头逐字有 **2025 / 2026** 两列 → 两个年款各出行；S09 逐字 **2025**；S06 无年款列 → `官网无年款`。站点 `до 30 ноября 2026` 是活动期，不是年款。
- **燃油**：S06 1.5T/1.6T、S07 1.6T、S09 2.0T 均汽油 → Gasoline。
- **交付结果**：`Soueast_RU_官网价_20261123.xlsx`，**8 条 / 3 车系**；RUB 3 029 000–4 099 000；Gasoline 8；年款 2025 4 · 2026 2 · 官网无年款 2。
- **实测**：2026-11-23
- **来源**：`https://soueast.ru/models/{s06,s07,s09}`；`https://soueast.ru/media-link/{s06,s07,s09}-pricelist`
- **原文**：`2 комплектации`；`Престиж 2WD` / `Престиж AWD`；`Престиж` / `Премиум`；`3 029 000` / `3 409 900`；`2025 2026`；`2 999 000` / `3 249 000`（折扣）；`3 899 000` / `4 099 000`

---

### AVATR（RU 俄罗斯 `avatr-motors.ru`：**官方俄语站；07 / 11 / 12 三款 10 个配置；价格表逐字「2026 года производства, руб. с НДС」**）✅

- **可达性**：`avatr-motors.ru` curl 200（Nuxt，708 KB）；站点内嵌三份规格 PDF：`/files/AVATR_{07,11,12}_Спецификация_*.pdf`（2026-11-23）。
- **★ 车型/配置/价格（2026 生产年，含 НДС）**：
  - **AVATR 07**：`07_1` **6 600 000** · `07_3.1` **6 900 000** · `07_3.2` **7 000 000**
  - **AVATR 11**：`11_1` **6 990 000** · `11_2` **8 290 000** · `11_3` **8 490 000**
  - **AVATR 12**：`12_1` **6 990 000** · `12_2` **7 790 000** · `12_3.1` **8 290 000** · `12_3.2` **8 390 000**
  - 表格统一写 `Рекомендованная розничная цена на автомобили 2026 года производства, руб. с НДС`；配置只有内部码，没有 Comfort/Luxury 等营销名。
- **年款**：价格表 `на автомобили 2026 года производства` 绑定到该车型全部配置与价格 → 全部 **2026**。
- **燃油**：**07 = REEV**（39,05 kWh 电池 + `Генератор (двигатель внутреннего сгорания)`）· **11 / 12 = BEV**（CATL NMC，无发电机）。
- **交付结果**：`AVATR_RU_官网价_20261123.xlsx`，**10 条 / 3 车系**；RUB 6 600 000–8 490 000；REEV 3 · BEV 7；年款全 **2026**。
- **实测**：2026-11-23
- **来源**：`https://avatr-motors.ru/`；`https://avatr-motors.ru/files/AVATR_07_Спецификация_12.11.2026.pdf`；`…/AVATR_11_…`；`…/AVATR_12_…`
- **原文**：`Рекомендованная розничная цена на автомобили 2026 года производства, руб. с НДС`；`Комплектация 07_1 / 07_3.1 / 07_3.2`；`Комплектация 11_1 / 11_2 / 11_3`；`Комплектация 12_1 / 12_2 / 12_3.1 / 12_3.2`；`Генератор (двигатель внутреннего сгорания)`；`Гибридное исполнение`

---

### Belgee（RU 俄罗斯 `belgee.ru`：**perxis 站；4 车系 14 版本；站点 `от` 是减 100k/150k/200k 的促销价，取价目表常规价**）✅

- **可达性**：`belgee.ru` curl 200（perxis/WordPress 风格）；`/model/{belgee-x50-new,belgee-x50-plus,belgee-s50,belgee-x70-facelift}/` 均 200；价目 PDF 在 `cdn.perxis.ru/originals/<id>/original`（2026-11-23）。
- **★ 车型/配置/常规价**：
  - **X50**：Active **2 199 990**（站点 2 099 990 = 减 100 000）
  - **X50+**：Active **2 319 990** · Style **2 509 990** · Prestige **2 699 990** · Onyx **2 799 990**（站点价均再减 150 000）
  - **S50**：Active 5MT **1 929 990**（站点 1 729 990，减 200 000）· Active 6AT **2 069 990** · Style 6AT **2 165 990** · Prestige 6AT **2 345 990**（后三者减 120 000）
  - **X70**：Active 6AT FWD **2 609 990** · Style 6AT FWD **2 745 990** · Style 4WD 7DCT **2 839 990** · Prestige 4WD **3 039 990** · Prestige+ 4WD **3 115 990**（站点价再减 80 000）
- **年款**：车型页/价目表无 MY/`модельный год`；页面 2025 是奖项、2026 是活动期 → 全部 `官网无年款`。
- **燃油**：X50 / X50+ / S50 全部 Gasoline；X70 Active 与 Style 6AT FWD 为 Gasoline，X70 Style 4WD / Prestige / Prestige+ 带 48V 轻混 → MHEV。
- **交付结果**：`Belgee_RU_官网价_20261123.xlsx`，**14 条 / 4 车系**；RUB 1 929 990–3 115 990；Gasoline 11 · MHEV 3；年款全 `官网无年款`。
- **实测**：2026-11-23
- **来源**：`https://belgee.ru/model/{belgee-x50-new,belgee-x50-plus,belgee-s50,belgee-x70-facelift}/`；价目 PDF `https://cdn.perxis.ru/originals/{dbi9gv7vbdlg00bp61kg,dbk84hvvbdlg00bp6fr0,dbi9gifvbdlg00bp61k0,dbi9hhnvbdlg00bp61lg}/original`
- **原文**：`от 2 099 990 ₽*`；`от 1 729 990 ₽*`；`2 199 990 / 100 000 / 2 099 990`（X50 价目表）；`Система мягкого гибрида, бортовая сеть 48В есть (Стиль / Style, Престиж / Prestige, Престиж+ / Prestige+)`

---

### McLaren（RU 俄罗斯 `mclarenautomotive.ru`：**旧版俄语站，无当前俄罗斯在售全集；不得用全球 lineup 补行**）❌ 无当前市场数据

- **可达性**：`mclarenautomotive.ru` curl 200（54 KB），但页面仍是旧版车型：`Новый GT`、`600LT`、`570S`、`720S`、`Speedtail`、`Senna`、`P1`、`12C`、`F1` 等，**没有 Artura / 750S / GTS**；标题 `McLaren Automotive - Russia`（2026-11-23）。
- **★ 无价证据**：全站 0 个 `£/$/€/₽` 整车金额，CTA 只有 `Узнать` / `Оформить` / `Заявка`；McLaren 本身全球不公布 MSRP。
- **车型口径**：`.ru` 站只列旧车型，无法证明当前俄罗斯在售范围。按「车型全集必须来自该市场官网」规则，**不按全球 lineup 补 Artura / 750S / GTS 等行**；标准任务判定无当前市场数据，不出 McLaren_RU 表。
- **年款 / 燃油**：既然不出表，不再为全球车型推断俄罗斯年款与燃油。
- **交付结果（旧口径，需撤回）**：`McLaren_RU_官网价_20261123.xlsx` 曾用全球 lineup 出 6 条，违反全集闸；不应作为有效成品继续使用。
- **实测**：2026-11-23
- **来源**：`http://mclarenautomotive.ru/`；`https://www.mclaren.com/cars/`
- **原文**：`The Official Website of McLaren Automotive - Russia`；`Новый GT`；`600LT` / `570S` / `720S` / `Speedtail` / `Senna`；`Узнать` / `Оформить`

---

> 注：俄罗斯站价格为 RUB，本批统一按空格千分位、不带 ₽ 输出；TENET 的常规价与促销价已在段内说明。

### Exeed（RU 俄罗斯 `exeed.ru` + `esteo.ru/exlantix`：**VX/RX 只展示含 трейд-ин/直降的促销价，图片型价目表取不到 RRЦ → `未核实`；EXLANTIX ET/ES 页面同时给列表价 6 990 000 / 6 170 000**）⚠️ 部分

- **可达性**：`exeed.ru` curl 200；`/cars/vx-fl/`、`/cars/rx/`、`/configurator/` 均 200；EXLANTIX 在 `esteo.ru/exlantix/{et,es}/`（2026-11-23）。
- **★ 车型/版本（4 车系 7 版本）**：VX **Престиж 25 MY / Президент (6 мест) / Президент (7 мест)** · RX **Премиум 8AT / Флагман 8AT** · **EXLANTIX ET** · **EXLANTIX ES**。
- **★ VX/RX 价格陷阱**：页面 `от 4 990 000 / 4 270 000` 带脚注 ¹，逐字为 `с учетом выгоды, получаемой при сдаче автомобиля в трейд-ин` + `Прямая скидка`；官方 `Прайс-лист` 是 perxis 图片型 PDF（2 MB、`pdftotext` 0 行），无法确认 RRЦ → VX/RX 5 条 MSRP 填 **`未核实`**，不拿促销价冒充。促销价仅备注：VX Prestige 4 990 000 / President 5 330 000；RX Premium 4 270 000 / Flagship 4 580 000。
- **★ EXLANTIX**：ET 页同时给 `6 990 000 ₽¹` 与 `ОТ 5 990 000 ₽²`（²=含最大置换+直降），取列表价 **6 990 000**；ES 页列表价 **6 170 000**（促销 от 5 670 000）。两者均为串联混动（1 L 汽油发电）→ **REEV**。
- **年款**：VX 版本名带 `25 MY` + 脚注 `2025 г.в.` → 2025；RX / ET / ES 无 MY 字段 → `官网无年款`。
- **交付结果**：`Exeed_RU_官网价_20261123.xlsx`，**7 条 / 4 车系**；2 条有价（6 170 000 / 6 990 000），5 条 `未核实`；Gasoline 5 · REEV 2。
- **实测**：2026-11-23
- **来源**：`https://exeed.ru/cars/{vx-fl,rx}/`；`https://esteo.ru/exlantix/{et,es}/`；`https://1.cdn.perxis.ru/originals/{d92jgr2to5r6hlpdrjm0,dbregjks5adg00dgrgeg}/original`（VX/RX 图片型价目表）
- **原文**：`Прайс-лист`；`с учетом выгоды, получаемой при сдаче автомобиля в трейд-ин`；`от 4 990 000 ₽¹`；`6 990 000 ₽¹ ОТ 5 990 000 ₽²`；`EXLANTIX ES 6 170 000 ₽`；`ПРЕСТИЖ 25 MY`；`ГИБРИДНЫЙ ДВИГАТЕЛЬ 1л бензина генерирует 3.7кВт*ч`

---

### GAC（RU 俄罗斯 `gac.ru`：**Комплектации 展开 17 个版本；GS4 3 版按官方按揭计算器取价（2 999 000 / 3 499 000 / 3 499 000）；GS8 / Aion V / M8 Lounge 取价目表 RRЦ；其余 8 条 `未核实`**）⚠️ 部分

- **可达性**：`gac.ru` curl 200；`/models/{gs3,gs4,gs8-ii,empow,aion-v,hyptec-ht,m8}` 均 200；`/media-link/<model>-pricelist` 直出 PDF；按揭计算器 `/credit-calculator#/credit/new/gac/<model>/<configId>/<slug>?year=YYYY` 为 Angular 配置器（2026-11-23）。
- **★ 车型/版本（7 车系 17 版本）**：
  - GS4（3）：**GB 2 999 000 · GB AWD 3 499 000 · GL AWD 3 499 000**（2026，官方按揭计算器 `Стоимость автомобиля`）
  - GS3（1）：**GS3**
  - Empow（2）：**GS · GL (S-style)**（GL 为 2024）
  - Hyptec HT（1）：**EX Premium**
  - GS8（4）：**GL (5 мест) 4 199 000 · GT 4 599 000 · GX Premium 4 949 000 · GX Traveller**（2026）
  - Aion V（2）：**EX 4 399 000 · EX Premium 4 699 000**（2026）
  - M8（4）：**GT · GX · GX Premium · Lounge (4 места) 7 999 999**（2025）
- **★ GS4 价格口径**：车型页 Комплектации 的 `от 2 999 000 / 3 399 000 / 3 549 000` 是含 `трейд-ин` 的展示价；**官方按揭计算器**对 2026 配置给出 `Стоимость автомобиля` **2 999 000 / 3 499 000 / 3 499 000**，取计算器价（配置器优先于促销展示价）。
- **★ 未核实（8 条）**：GS3 / Empow ×2 / Hyptec HT 价目表为**图片型 PDF**，站点 `от 2 799 000 / 2 799 000 / 3 369 000 / 5 699 000` 只展示含 `трейд-ин` 促销价；GS8 **GX Traveller**（от 4 849 000）与 M8 **GT/GX/GX Premium**（от 6 249 999 / 6 549 999 / 6 749 999）不在可读价目表列内 → MSRP 全 `未核实`。
- **年款**：GS4 按揭计算器选 2026（URL `?year=2026`）；Empow GL `2024`，Empow GS 无年款；GS8 GL 5-seat 脚注 `2026 года выпуска`；Aion V 表头 `2026 г.в.`；M8 表头 `2025 г.в.`；GS3/Hyptec 无 MY → `官网无年款`。
- **燃油**：GS8 / M8 / GS4 / GS3 / Empow = Gasoline；Aion V / Hyptec HT = BEV。
- **交付结果**：`GAC_RU_官网价_20261123.xlsx`，**17 条 / 7 车系**；9 条有价 2 999 000–7 999 999；8 条 `未核实`。
- **实测**：2026-11-23
- **来源**：`https://gac.ru/credit-calculator#/credit/new/gac/gs4/61729/gac-gs4-gac-gs4-gb?year=2026`；`https://gac.ru/models/{gs4,gs3,gs8-ii,empow,aion-v,hyptec-ht,m8}`；`https://gac.ru/media-link/{gs3,gs4,gs8,empow,aion-v,hyptec-ht,m8}-pricelist`
- **原文**：`Стоимость автомобиля 2 999 000 ₽`；`GB AWD 2026 3 499 000 ₽`；`GL AWD 2026 3 499 000 ₽`；`GL 4 199 000 / GT 4 599 000 / GX PREMIUM 4 949 000`；`EX 4 399 000 / EX Premium 4 699 000`；`Lounge (4 места) 7 999 999`；`2026 года выпуска` / `2025 г.в.`
---

### VGV（RU 俄罗斯 `vgvmotor.ru`：**官方价目表分列 RRЦ 与「с учетом всех выгод」，取 RRЦ；3 车系 9 版本**）✅

- **可达性**：`vgvmotor.ru` curl 200；`/models/{u70-plus,u70-pro,u75-plus}/` 可读（2026-11-23）。
- **★ 版本/РРЦ**：
  - U70 PLUS：Elite (7s) 1.5T GDI 7DCT **1 999 000** · Luxury (7s) **2 099 000**（无折扣）
  - U70 PRO：Стиль 5 мест 6AКПП 2025 **2 579 990** · Стиль 7 мест 2025 **2 639 900** · Ультра 7 мест 2025 **2 794 900** · Ультра 7 мест 2024 **2 794 900**
  - U75 PLUS：Ультра 5 мест 8AКПП **2 999 900** · Ультра 7 мест **3 049 900** · Премиум 7 мест **3 199 900**
  页面同时列 `Просто скидка!` / `Цена с учетом всех выгод`（−200 000 / −380 000 / −395 000 / −425 000），**不采**。
- **年款**：U70 PLUS 脚注 `VGV U70 PLUS 2026 года` → 2026；U70 PRO 版本名带 2025/2024；U75 PLUS 无 MY → `官网无年款`。
- **燃油**：全 Gasoline（1.5T / 2.0T，2WD）。
- **交付结果**：`VGV_RU_官网价_20261123.xlsx`，**9 条 / 3 车系**；RUB 1 999 000–3 199 900。
- **实测**：2026-11-23
- **来源**：`https://vgvmotor.ru/models/{u70-plus,u70-pro,u75-plus}/`
- **原文**：`Комплектации U70 PLUS`；`Elite (7s) 1.5T GDI 7DCT`；`Рекомендованная розничная цена*`；`Цена с учетом всех выгод на а/м`；`2 579 990 руб.`；`2 794 900 руб.`；`VGV U70 PLUS 2026 года`

---

### Moskvich（RU 俄罗斯 `moskvich.ru` + `moskvich-m.ru`：**官网 `от` 多为促销价；取官方价格表常规价（含 VAT），CNG 全链路无价**）✅

- **可达性**：2026-11-24 本机对 `moskvich.ru`、`www.moskvich.ru`、`moskvich-m.ru`、`configurator.moskvich.ru` 均 TCP 443 超时，真实浏览器 `ERR_TIMED_OUT`；但官方页面 HTML/首页读者快照可读，`storage.yandexcloud.net/s3-moskvich-new/**/*.pdf` 静态 PDF 可在浏览器打开。不是 robots 403，也未使用归档价。
- **★ 车型全集**：官网首页导航 + `/models` 为 Москвич 3 / 3е / 3 РУ / 6 / 8 / М70 / М90；buyers 导航的 CNG 页再分出 Москвич 3 CNG、Москвич 6 CNG。
- **★ 价格源**：`/buyers/catalogues` 与车型页 `Прайс-лист`；М70/М90 为 `https://moskvich-m.ru/static/auto-service/{m70,m90}-price-list.pdf`。常规价逐字 `Максимальная цена перепродажи (рекомендованная розничная цена), вкл. НДС`；不取 `с учетом всех выгод`、`Прямая скидка`、credit/trade-in/господдержка。
- **★ 交付**：`Moskvich_RU_官网价_20261124.xlsx`，28 条 / 9 车型；24 条数字价、4 条 CNG `官网无价格`。М70 DRIVE 3 099 000、ULTRA 3 499 000；М90 4 199 000；CNG 无独立价格。
- **年款**：仅价格表 `Москвич 3е MY26` 与页面 `Бизнес MY26` / `Техно MY26` 写 MY2026；`2025/2026 год производства` 全是生产年，写 `官网无年款`。
- **燃油**：汽油 6 车型 = Gasoline；Москвич 3е = BEV；CNG 官方 `Бензин ... / Компримированный природный газ (КПГ)` = Dual Fuel。
- **缺口**：Москвич 3 РУ PDF 还列 2026 生产列 2 185 000，但页面只展示 2025 生产配置 2 069 000，PDF 西里尔无 ToUnicode，无法可靠还原独立版本名，未单列。
- **实测**：2026-11-24
- **来源**：`https://moskvich.ru/models/{moskvich-3,moskvich-3e,moskvich-3-ru,moskvich-6,moskvich-8,moskvich-cng}`；`https://moskvich.ru/buyers/catalogues`；`https://moskvich-m.ru/models/{m70,m90}`
- **原文**：`Максимальная цена перепродажи (рекомендованная розничная цена), вкл. НДС`；`(2026 год производства)*`；`Москвич 3е MY26`；`Бизнес MY26`；`Москвич CNG — двухтопливные версии моделей Москвич 3 и Москвич 6`

---

### Hongqi（RU 俄罗斯 `hongqi.ru`：**官方 API + 车型页 + 10 份 PDF 交叉；季节价需逐条排除 trade-in/折扣**）⚠️ 部分待复核

- **可达性**：2026-11-24 官网、`api.hongqi.ru`、`cdn.hongqi.ru` 可读；PDF 为轮廓/图像型，普通抽字失败，已渲染 20 页并 OCR。
- **★ 车型全集**：首页导航、sitemap、`/configurator-models`、`/prices` 与 API 一致，10 个当前车型：HS3 / HS5 / HS7 / H5 / ОБНОВЛЕННЫЙ H5 / H6 / H9 / HQ9 / E-HS9 / GUOYA。
- **★ 价格源**：`https://api.hongqi.ru/api/v1/models/<slug>?X-Domain=hongqi.ru` 的 `trims[].price`，车型页 From 与官方规格/价格 PDF 交叉。价格栏逐字 `Сезонная цена`；法律声明 `Сайт не содержит публичных оферт. Для официальных дилеров Hongqi представленные на сайте цены являются рекомендованными.` 整车 VAT/НДС 未说明。**除明确不含 trade-in/折扣的配置外，不能仅凭 API 有数字就认定 MSRP**；无法确认的写 `未核实`。
- **★ 缺价**：HS3 Comfort 的 3 199 000 含 250 000 трейд-ин 优惠，找不到未折扣官方价 → `未核实`；H5 Comfort API 为 0 且 PDF `Наличие и стоимость уточняйте у официальных дилеров` → `官网无价格`。
- **年款**：10 份 PDF 共 20 页全文 + 页面/API 均无 MY/Model Year/модельный год；`Сезонная цена` 不是年款，20 条全 `官网无年款`。
- **燃油**：Gasoline 10；HS7/H9/HQ9 的 `Мягкая гибридная система 48 В (MHEV)` / `Генератор-электромотор 48В` = MHEV 5；GUOYA `Гибридная установка HEV` = HEV 2；E-HS9 双电机 = BEV 3。
- **跨市场**：RU 使用自身 API/PDF；丹麦知识库仅提到 Hongqi 在 cars4ever 多品牌清单，未复用该第三方平台价格。
- **交付结果（待复核）**：`Hongqi_RU_官网价_20261124.xlsx` 有 18 条数字价；其中除 HS3 Comfort 已标 `未核实` 外，其余季节价需逐条确认不含 trade-in/折扣，不能直接视为最终 MSRP。
- **实测**：2026-11-24
- **来源**：`https://hongqi.ru/configurator-models`；`https://api.hongqi.ru/api/v1/models/{novyi-hs3,novyi-hs5,novyi-hs7,h5,h5-2026,h6,h9,hq9,e-hs9,guoya}?X-Domain=hongqi.ru`
- **原文**：`Сезонная цена`；`Рекомендованная сезонная цена HONGQI HS3(эйч эс три) в комплектации «Комфорт» указана с учётом выгоды 250 000 рублей по программе «Трейд-ин».`；`Наличие и стоимость уточняйте у официальных дилеров`

---

### KGM（RU 俄罗斯 `kgm.ru`：**无配置器/价格 API；4 车型官方 PDF 取未折扣 МРЦП，税价未标注**）✅

- **可达性**：2026-11-24 `kgm.ru` curl/浏览器可读；sitemap、首页、`/models`、`/cars/new` 与四个车型页一致。
- **★ 车型全集**：Tivoli / Korando / Torres / Rexton；未发现仍带有效官网价的停售车型。
- **★ 价格源**：`https://kgm.ru/media-link/pricelist-{tivoli,korando}-2025`、`pricelist-torres`、`pricelist-rexton`、`pricelist-rexton-2025`。取 `Максимальная рекомендованная цена перепродажи, руб.`，不取 `С учётом максимальной выгоды`、трейд-ин、семейный автомобиль。
- **税价/口径**：页脚逐字 `Максимальная рекомендованная цена перепродажи (МРЦП) не является ценой реализации автомобилей приобретателю/покупателю.`；所有有效 PDF 未出现 НДС/VAT，不推断税性。
- **★ 版本/价格**：Tivoli 3、Korando 4、Torres 10（2024/2025 模型年各 5）、Rexton 6；Tivoli СИТИ PDF 为 `-`，页面 2 990 000 又带 трейд-ин，无法确认未折扣价 → `未核实`。
- **年款**：Torres/Rexton 2025 价格 PDF 明确 `2024/2025 МОДЕЛЬНОГО ГОДА`；Tivoli/Korando 与 Rexton 2024 生产表只有 `ГОДА ПРОИЗВОДСТВА`，写 `官网无年款`。跨表同名配置按官方表头追加模型年/生产年短语消除重复。
- **燃油**：四车型页均 `1.5T GDI` / `2.0T GDI` + AИ-95，全 Gasoline。
- **跨市场**：BE 的 Next.js `__NEXT_DATA__`/`listPrice.priceInclVat` 与 KR 的 `web.kg-mobility.com/app/*.do` 均不适用 RU；RU 无配置器，PDF 是主源，且税价未标注。
- **交付结果**：`KGM_RU_官网价_20261124.xlsx`，23 条 / 4 车型；22 条数字价、1 条 `未核实`。
- **实测**：2026-11-24
- **来源**：`https://kgm.ru/models/{tivoli,korando,torres,rexton}`；`https://kgm.ru/media-link/pricelist-{tivoli,korando}-2025`；`https://kgm.ru/media-link/pricelist-{torres,rexton,rexton-2025}`
- **原文**：`Максимальная рекомендованная цена перепродажи, руб.`；`АВТОМОБИЛИ 2025 ГОДА ПРОИЗВОДСТВА 2024 МОДЕЛЬНОГО ГОДА`；`АВТОМОБИЛИ 2025 ГОДА ПРОИЗВОДСТВА 2025 МОДЕЛЬНОГО ГОДА`

---

### Denza（RU 俄罗斯 `denza-russia.ru`：**仅 Z9 混动版有 8 400 000 起价；Z9 GT/N9 全链路无价**）⚠️ 部分

- **可达性**：2026-11-24 官网 curl/浏览器可读；sitemap.xml 为 0 字节，sitemap-feeds.xml 返回 HTML 404；车型全集以实时导航 + 三车型页选择器为准。
- **★ 车型全集**：Denza Z9 GT / Denza Z9 / Denza N9，均 `discontinued=false`。
- **★ 唯一数字价**：Z9 官方长读配置卡 `HYBRID DENZA Z9` / `от 8 400 000 ₽`；不是促销/折扣价，但页面要求经理确认配置和额外选项，故只取基础起价。税价未标注。
- **★ 缺价**：Z9 GT 两版、N9 一版车型页/长读/PDF 链路均无数字价，且 `Для уточнения стоимости выбранной комплектации и дополнительных опций свяжитесь с менеджерами отдела продаж` → `官网无价格`；Z9 纯电同车型已有混动价但无独立价 → `未核实`。
- **年款**：官方标题 `Отличия седана Denza Z9 2025 года и хэтчбека Denza Z9 GT 2024 года`、`Комплектации Denza Z9 2025`、`Denza N9 Flagship 2025`，分别写 2024/2025；无 PDF 可查。
- **燃油**：Z9 GT/Z9 的 `Запас хода на электротяге — 201 км` + plug-in 文案 = PHEV；纯电版 = BEV；N9 字段 `PHEV гибрид 2-литровый` = PHEV。
- **跨市场**：AU 只有限时活动 Driveaway、无常规售价且无 MY；TH 价格在促销新闻条款；RU 是独立进口商内容站，Z9 有明确起价且官方标题给 2024/2025，不能套用 AU/TH 的无价或促销口径。
- **交付结果**：`Denza_RU_官网价_20261124.xlsx`，5 条 / 3 车型；1 条数字价 8 400 000、1 条 `未核实`、3 条 `官网无价格`。
- **实测**：2026-11-24
- **来源**：`https://denza-russia.ru/{denza-z9-gt,denza-z9-sedan,denza-n9}`；`https://denza-russia.ru/sedan-denza-z9-2025-obzor`；`https://denza-russia.ru/denza-n9-obzor`
- **原文**：`HYBRID DENZA Z9`；`от 8 400 000 ₽`；`Комплектации Denza Z9 2025`；`Denza N9 Flagship 2025`；`PHEV гибрид 2-литровый`

---

### JAC（RU 俄罗斯 `jaccar.ru`：**官网静态价格表 + perxis 官方 PDF；取未折扣 РРЦ，T8 PRO 汽油版口径冲突记未核实**）✅

- **可达性**：2026-11-24 `jaccar.ru` 可读，官方价格表 PDF 在 `cdn.perxis.ru/originals/<id>/original`；未发现配置器或独立价格 API。
- **★ 车型全集**：首页导航、`/models/` 与三车型页一致，仅 JAC T8 PRO / JAC T9 / JAC RF8；旧 T8、JS3、JS6、J7 无当前价格区且不在当前目录，不纳入。
- **★ 价格口径**：车型页/PDF 逐字 `Максимальная цена перепродажи¹`、脚注 `¹ (РРЦ) ... без учета дополнительного оборудования или иных услуг, предложений, программ и скидок официального дилера.`；只取 РРЦ，不取 `Специальное предложение`、`Трейд-ин`、`с учетом всех выгод`。三车型均未标 НДС/VAT。
- **★ 价格/版本**：T8 PRO 柴油 3 230 000；T9 EXPLOR 汽油 3 719 000、URBAN 汽油 3 759 000、URBAN+ 汽油 3 789 000、EXPLOR 柴油 3 819 000；RF8 FLAGSHIP 2025 生产年 4 875 000、2026 MY 5 074 000。T8 PRO 汽油 3 130 000 在页/PDF 一处标含全部优惠、另一处又列 РРЦ，无法确认未折扣价 → `未核实`。
- **年款**：T8 PRO/T9 只有 `Год выпуска`/`Годы выпуска`，RF8 2025 只有 `2025 года выпуска`，均写 `官网无年款`；RF8 明确 `2026 модельного года`，写 2026。
- **燃油**：T8 PRO/T9 汽油与柴油版按 `Бензин`/`Дизель` 分 Gasoline/Diesel；RF8 `Топливо: Бензин, АИ-92 и выше` = Gasoline。
- **缺口**：RF8 2025 生产年 4 875,000 仅官方 PDF 单源，车型页未列 2025 价格；不声称双源核价。
- **交付结果**：`JAC_RU_官网价_20261124.xlsx`，8 条 / 3 车型；7 条数字价、1 条 `未核实`；车型/型号列按用户要求英文。
- **实测**：2026-11-24
- **来源**：`https://jaccar.ru/models/`；`https://jaccar.ru/models/{t8-pro,t9,rf8}/`；`https://cdn.perxis.ru/originals/{dbq27lvvbdlg00bp91vg,dbk3tu7vbdlg00bp6eg0,dbqmppfvbdlg00bp9dv0}/original`
- **原文**：`¹ (РРЦ) Указана максимальная цена перепродажи на автомобиль на дату 01.11.2026 г без учета дополнительного оборудования или иных услуг, предложений, программ и скидок официального дилера.`；`2026 модельного года`；`2025 года выпуска`

---

### Kaiyi（RU 俄罗斯 `kaiyi-auto.ru`：**4 车型 7 个动力版本全链路无当前常规价；保养条例页给版本名，7 条全官网无价格**）⚠️ 无价格出表

- **可达性**：2026-11-24 官网、`/models`、sitemap 和四个车型页可读；未发现配置器、价格 API 或价目表 PDF。四本官方说明书已全文检查（E5 193 页、X3 185 页、X3 PRO 186 页、X7 Kunlun 210 页）。
- **★ 车型全集**：首页导航、`/models`、sitemap 一致，仅 KAIYI E5 / KAIYI X3 / KAIYI X3 PRO / KAIYI X7 Kunlun，均在售。
- **★ 无价证据**：SSR 页面无 From/常规价，官方 JS 无车型价格接口，PDF 仅说明书且无价格表。车型卡脚注 `Максимальная цена перепродажи автомобилей 2024 г.в., с учетом маркетинговых акций ... действует с 01.10.2025 г. по 30.11.2025 г.` 已过期且是库存活动价，不采；四车型填 `官网无价格`。
- **版本粒度**：车型页无价格配置器，但官方 `/owners/regulations-to` 保养条例页明确列 7 个动力/变速箱版本：E5 1.5T 6MT/CVT、X3 1.5T MT/CVT、X3 PRO 1.5T CVT、X7 Kunlun 1.6T/2.0T DCT，均 FWD；逐版本出行，不再用 `Unspecified`。
- **年款**：四本说明书均无 MY/Model Year/модельный год；VIN 的 `год производства`/`год выпуска`、`© 2026`、手册出版日期和活动库存 `2024 г.в.` 均不作年款，统一 `官网无年款`。
- **燃油**：E5/X3 PRO `Бензиновый двигатель с турбонаддувом`，X3/X7 手册 `Неэтилированный бензин с октановым числом не ниже 92` / `Топливо 92# и выше`，全 Gasoline。
- **交付结果**：`Kaiyi_RU_官网价_20261124.xlsx`，7 条 / 4 车型，全 `官网无价格`；车型/型号列按用户要求英文。
- **实测**：2026-11-24；动力版本补充核验：2026-11-25
- **来源**：`https://kaiyi-auto.ru/models`；`https://kaiyi-auto.ru/owners/regulations-to`；`https://kaiyi-auto.ru/models/{kaiyi-e5,kaiyi-x3,kaiyi-x3pro,kaiyi-x7-kunlun}`；`https://kaiyi-auto.ru/media-link/{kaiyi-e5-rukovodstvo,kaiyi-x3-rukovodstvo,kaiyi-x3-pro-rukovodstvo,kaiyi-x7-kunlun-rukovodstvo}`
- **原文**：`Максимальная цена перепродажи автомобилей 2024 г.в., с учетом маркетинговых акций.`；`БЕНЗИНОВЫЙ, 1.5T, 6MT, ПЕРЕДНИЙ`；`БЕНЗИНОВЫЙ, 1.6T, DCT, ПЕРЕДНИЙ`；`Бензиновый двигатель с турбонаддувом`；`Топливо 92# и выше неэтилированный бензин 60 л`

---


