# 法国 FR — 站点坑位详段

> 市场码 FR · 20 段 · 品牌：Citroën / Mitsubishi / Suzuki / Toyota / Ford / Fiat / Geely / Jaguar / Cadillac / Zeekr EU / Land Rover / Genesis / Lancia / Renault / Lexus / Lotus / Leapmotor / Lynk & Co / Lamborghini
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-11-16 · 文中 snapshotVersion / token / 车型 id 均为当时实测值，必须现取

---

### Citroën（FR 法国 `www.citroen.fr` → `store.citroen.fr`：**GraphQL 可 curl 直连**，全量配置价格一次拿完）✅

> 与 BE 的 sccf 静态库不同，法国走 **Next.js 在线商店 + 单一 GraphQL 端点**，**无需浏览器**（`store.citroen.fr` 无 Akamai）。
> 主站 `www.citroen.fr` 是 AEM 展示站，车型页的"配置"按钮直接跳到 `store.citroen.fr/selector/configurable/<slug>`。

| 项 | 内容 |
|---|---|
| **★ 端点** | `POST https://store.citroen.fr/graphql`（`content-type: application/json`），curl 直连 200 |
| **★ 核心查询** | `getProductOffer(input: DimensionsInput!)`；input 字段：`model` `trim` `engineGearbox` `exteriorColour` `interiorColour` `options` `accessories` `showBodyStyles` `showAllEngines` `isCatalogPriceMode` `partnerId` |
| **★ 价格口径** | `selectedConfiguration.prices.cash.catalogAmount` = **Prix catalogue**（未折扣 MSRP，采这个）；`totalAmount` = **Prix Citroën Store**（线上折后价，**不采**）；差额=`saving`，`discountAmount` 常为 0 但 `saving` 非 0，**勿用 discountAmount 判断有无折扣** |
| **★ 交叉验证** | `https://store.citroen.fr/configurable` 车型卡逐字写「Prix catalogue 16 390 € / Prix Citroën Store à partir de 16 090 €」——12 个车系起价与 `catalogAmount` **逐一吻合** |
| **枚举方法** | 先 `getProductOffer({model, showAllEngines:true, showBodyStyles:true})` 取 `configurationOptions.trims[]` 与 `engines[]`，再对 **trim × engine 全组合**逐个查 `selectedConfiguration`；无效组合返回 `errors: [{message:"Unable to get product offer"}]`，跳过即可 |
| **★ 必带参数** | `showAllEngines:true` —— 否则只返回默认 trim 可配的发动机（C4 X 会漏掉 Electrique 156） |
| **车系 slug（12）** | `c3-berline-5-portes` `c3-aircross-suv` `c4-berline-5-portes` `c4-x-berline-4-portes` `c5-aircross-suv` `berlingo-m` `berlingo-xl` `spacetourer-m` `spacetourer-xl` `jumpy-combi-m` `jumpy-combi-xl` `holidays-m`（AMI 不在 store，见下） |
| **★ 官方版本名** | `selectedConfiguration.title` 即官网全名，如 `ë-C4 X Électrique 136ch, autonomie confort, PLUS`；**但有错字**：`C3 Aircorss`、`ë-` 时有时无、`SpaceTourer Business M` 在 XL 车型上未改字 → 用 `bodyStyle.title` + `engineGearbox.fuel` 校正，勿直接照抄 |
| **★ 颜色不加价** | 默认 `exteriorColour.prices.cash.baseAmount = 0`、`interiorColour` 同为 0 → 直接取 `catalogAmount` 即不含选装 |
| **AMI（独立小店）** | `https://store.citroen.fr/ami/<slug>`，9 个版本：`ami` `ami-spicy` `ami-minty` `ami-icy` `ami-outdoor` `ami-rip-curl-sunrise` `ami-rip-curl-sunset` `ami-buggy` `ami-buggy-palmeira`；价格在 `__NEXT_DATA__.props.initialState.deal.financeSimulation.totalPrice.cash.netPrice`（**只展示 comptant 现金价**，含 500 € 彩装包；`vehiclePrice` 同值） |
| **年款** | 全站（GraphQL、订单页、车型页）**无 millésime / modelYear / MY 字段** → 全部「官网无年款」；页脚 `Citroën 2026` 是版权年，勿采 |
| **范围边界** | B2C 配置器只卖上列 12 个 slug + AMI；**C4 Hybride（车型页宣传 30 300 € 起）与 C5 X 只出现在 stock/展厅，不在配置器**，无版本级官方价 → 不收录、交付时注明；纯商用 van（Berlingo Van/Jumpy Van/Jumper）在 `store-utilitaires.citroen.fr`/pro 站，HT 口径，另行处理 |
| **交付结果** | **118 条 / 23 个展示车系**（2026-10-29）：按 fuel 拆 ë- 车系（C3/ë-C3、C4 X/ë-C4 X…），Berlingo/SpaceTourer/Jumpy Combi 再按 M/XL 拆 |

**抓取骨架（Node，无需浏览器）**：

```js
const q = `query ($input: DimensionsInput!) { getProductOffer(input: $input) {
  selectedConfiguration { title lcdv16 bodyStyle { title }
    trim { title slug } engineGearbox { engine { title } gearbox { title } fuel slug }
    prices { cash { catalogAmount totalAmount saving } } } } }`;
const r = await fetch('https://store.citroen.fr/graphql', {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ query: q, variables: { input: { model, trim, engineGearbox } } }),
});
const sc = (await r.json()).data?.getProductOffer?.selectedConfiguration;
const msrp = sc?.prices.cash.catalogAmount;   // ★ 未折扣目录价
```

---

### Mitsubishi FR（法国 `www.mitsubishi-motors.fr`：**curl 445 空响应；WordPress/Elementor SSR，同源 fetch 取车型页 finition 价**）⚠️ 需浏览器

- **★ 可达性**：`curl`（含 `--ssl-no-revoke`、任意 UA / Accept-Language / HTTP1.1）对**任何路径**都返回 **`HTTP/1.1 445`、`Content-Length: 0`**（`Server: nginx`，连 `/robots.txt` 也是 445）→ 按 TLS 指纹拦，不是 403 页、没有挑战脚本，浏览器实测正常。同集团 `mitsubishi-motors.de` / `.it` 却 200 → 是**法国站自己的 nginx 规则**，不是全站策略。
- **★ 取价方式**：MCP 浏览器打开任意页面后，**同源 `fetch('/colt/')` 拿 SSR HTML**（200，775 KB），价格就在 HTML 里，不用等渲染、不用点 UI。`/wp-admin/admin-ajax.php`（`fetch_models_configurator_hp` / `fetch_data_product_range`）也可同源 POST，但配置器只是 Gravity Forms 留资表单，**不返回价格**。
- **★ 价格在哪（唯一可靠位）**：车型页底部「**Niveaux de finition / équipements**」块，每个 finishion 一段 `À partir de XX XXX,00 €` + 名称。名称与价格是**两个独立元素**（先连续列出所有名称，再连续列出所有价格），**顺序一一对应**，别按「标题在价格上方」的直觉去配对（找不到父级标题）。
- **⚠⚠ 首页 hero 与车型页顶部 `À partir de` 全是促销价**：5 个车系首页卡片里 COLT 25 090 / ASX 31 990 是原价，但 NOUVEAU GRANDIS 32 390、NOUVEL ECLIPSE CROSS 29 990、NOUVEL OUTLANDER 39 990 **是扣完 `avantages client` + CEE `Prime Coup de Pouce` 后的价**（脚注写明「après déduction de …」）→ 一律不用，只用 finition 块。
- **★ 反向校验（5/5 全对）**：促销 hero = finition 原价 − 脚注减免，逐项吻合：Colt 25 090−3 500=21 590；ASX 31 990−3 000=28 990；Grandis 33 390−1 000=32 390；Eclipse Cross INVITE 41 390−6 600−4 800=29 990、INVITE+ 45 990−6 600−4 800=34 590；Outlander 52 090−12 100=39 990、BLACK EDITION 63 340−11 350=51 990。「Modèle présenté」报价也能对上（+ 金属漆/双色调选装，− 同一笔减免）：Grandis INSTYLE 38 990−1 000+950=38 940；ASX INSTYLE 36 990−3 000+1 450=35 440；Outlander INSTYLE+ 66 590−12 100+750=55 240。
- **★ 官方车型 / 动力名**：页面 `<title>` 就给动力口径 —— Colt «nouvelle génération»、ASX «Le SUV hybride urbain»（唯一动力 `1.8 HEV 158`）、Nouveau GRANDIS «Le SUV hybride urbain familial»、Eclipse Cross «Le SUV familial 100% électrique」（按电池/充电机分档：`moyenne autonomie 67 kWh` / `grande autonomie 89 kWh` / `11 kW` / `22 kW (en option)`）、Outlander «Hybride rechargeable」（`2.4 MIVEC`）。Eclipse Cross 另有 `SPIRIT EDITION 50 240,00 €`（专页，无减免），该页把同一块电池写成 **87 kWh**（主页写 89 kWh）→ 官网自相矛盾，按所在页原样记录。
- **⚠ 促销页不可采**：`/offres-speciales/particuliers/<model>-lld/`、`/asx-kuro-edition/`（title 其实是「ASX Black Edition」）、`/outlander-kuro-edition/`（hero 51 990 是 Black Edition 促销价）全是 LLD / remise 页；`Prime Coup de Pouce`、`Super Bonus`、`avantages client` 属补贴与折扣。另 Outlander「Malus masse 7 900 € non inclus」= 法国重量税**不含在标价内**。
- **★ 年款**：官网只在「Modèle présenté」和首页排放脚注里出现 `MY26` / `MY26.5`（且 ASX 两种写法都出现过），**没有和任何一条价格绑定** → 全部 `官网无年款`，不推断。
- **★ 停销**：官网不标注任何停产/下架车型（在售 5 车系 20 档）→ 全部 `否`。
- **口径**：含税（TTC）建议零售价、不含选装（`À partir de` = 该 finition 最便宜动力/电池档起价）。
- **交付结果（20261027）**：`Mitsubishi_FR_官网价_20261027.xlsx`，**20 条 / 5 个车系**（COLT 3 · ASX 3 · GRANDIS 3 · ECLIPSE CROSS 5 · OUTLANDER 6），25 090–66 590 €。燃油：HEV 7 · BEV 5 · PHEV 6 · 未标注 2（Colt INVITE+/INTENSE 跨 1.0 MPI-T 91 / GPL 101 / HEV 143 三种动力，官网未把动力与价格对应；INSTYLE 官网明写「Disponible uniquement en HEV」→ HEV）。

---

### Suzuki（FR 法国 `www.suzuki.fr` + `configurateur.suzuki.fr`：**curl 全 403（Azure WAF），真浏览器同源 fetch 走配置器 API，一次拿全量变体**）✅

- **可达性**：`curl`（含 UA / `--ssl-no-revoke`）对 `www.suzuki.fr` 与 `configurateur.suzuki.fr` **任意路径含 `/robots.txt` 均 403**，响应 581 B、`Server: Microsoft-Azure-Application-Gateway/v2`；真浏览器（browser MCP）正常，页面内 `fetch()` 同源可取 JSON（实测 2026-11-11）。
- **取价源（唯一变体级）**：`GET /api/models` → `GET /api/motorizations?model=<numeric id>` → `GET /api/versions?model=<id>&motorization=<id>`（注意参数是 `model` = **数字 id**，不是 `modelId`；`modelId=` 会 400）。
- **★ 价格口径**：每个 model/motorization/version 同时给 `priceB2B` 与 `priceB2C`；**采 `priceB2B`（catalogue MSRP）**，`priceB2C` 是扣完 dealer remise + reprise 的展示价。以 Swift Avantage 为例：`priceB2B 19690`，`priceB2C 16890`，`legalMentions` 写明 `tarif TTC conseillé ... de 19 690€` 与 `remise ... de 1 800€ + 1 000€ d'aide à la reprise`（19 690 − 2 800 = 16 890）。
- **★ 口径原文**：`Prix catalogue du véhicule présenté. ... Tarif TTC clés en main conseillé au 02/11/2026 comprenant le transport jusqu'à la concession, la préparation du véhicule avec la fourniture et la pose des plaques d'immatriculation ainsi que la livraison du véhicule.` → 含税、clés en main（含运输/准备/牌照/交付），不含选装与金属漆。
- **车型 id / 版本数（2026-11-11 现取）**：SWIFT 65（7）· VITARA 75（9）+ VITARA XPLORE 78（4）· S-CROSS 76（8）+ S-CROSS XPLORE 79（4）· e VITARA 77（5）· Nouveau Across 80（1）。共 38 条。
- **★ 在售范围**：首页 7 张卡（含 2 张 XPLORE 特装）与配置器 7 个 model 一致；官方价目表按车系分组，**XPLORE 是 VITARA / S-CROSS 的特别版（与 Style 同价）**，故主表合并为 VITARA 13 条 / S-CROSS 12 条，版本名用价目表原文 `Xplore`。
- **★ 命名**：`{版本} {动力} {变速箱}`；动力取配置器 `motorization.name`（`1.2 Hybrid SHVS` / `1.4 Boosterjet Hybrid` / `1.4 Boosterjet Hybrid AllGrip` / `Electrique 106 kW / Batterie 49 kWh`），变速箱取 `gearbox.name` + `information.numberOfReport`（`Manuelle (5/6)`、`Automatique (CVT/6)`）；纯电与 Across 只有一种变速箱，不加后缀。`Automatique (6)` 与手动的同名版本靠后缀区分（价目表也写 `Auto (CVT)`）。
- **燃油**：`HYBRIDE SHVS` = **MHEV**（官网只写辅助电机 60 Nm、无纯电续航/纯电模式，如 Swift 页 `L'apport immédiat du couple du moteur électrique (60 Nm)`）；`ELECTRIQUE` = BEV；`HYBRIDE RECHARGEABLE` = PHEV；SWACE `1.8 Hybrid`（auto-rechargeable）= HEV。
- **年款**：配置器 `/api/models`、`/api/motorizations`、`/api/versions` 全字段无 `millésime` / `modelYear` / `MY`；官方价目表抬头 `TARIF GAMME SUZUKI N°02/26 Au 1er juin 2026` 是**生效日期**；各车型手册尾页 `Broch. Ref. … - Imprimé en France - …` 是**印刷日期** → 全部 `官网无年款`（逐车型查过手册：Swift 99PUB-231 02/04/2024、Vitara 99PUB-376 Octobre 2026、S-Cross 99PUB-222 Juin 2025、e Vitara 99PUB-254 Octobre 2026、Across 99PUB-215 Septembre 2026）。
- **官方价目表**：`https://www.suzuki.fr/build/images/TARIF_GAMME_VP_JUIN26.pdf`（`TARIF GAMME SUZUKI N°02/26 Au 1er juin 2026`，1 页）。**2026-11 配置器价比 6 月 PDF 统一 +200（Vitara/S-Cross）或 +300（Swift），e Vitara 完全一致** → 冲突按配置器；价目表只用于 Swace 与全集核对。
- **SWACE**：`/vehicule/swace` 页面仍在线但**无价格、无配置器入口**，首页/Gamme hybride/商用 gamme 均不展示；仅 6 月价目表列 `1.8 Hybrid Privilège 33 750 €` / `1.8 Hybrid Pack 36 250 €` → 入表 2 条并标 `是否停销=是`。
- **明确不在售**：Ignis 页面原文 `L'Ignis n'est plus disponible à la vente.`；Jimny 页面原文 `Le Jimny n'est plus disponible à la vente.`，两车官网无价格 → **不入表**，仅在交付说明列名。
- **交付结果**：`Suzuki_FR_官网价_20261111.xlsx`，**40 条 / 6 车系**（SWIFT 7 · VITARA 13 · S-CROSS 12 · e VITARA 5 · ACROSS 1 · SWACE 2），19 690–55 150 €；燃油 MHEV 32 · BEV 5 · PHEV 1 · HEV 2。
- **实测**：2026-11-11
- **来源**：`https://configurateur.suzuki.fr/api/models`、`/api/motorizations?model=65`、`/api/versions?model=65&motorization=119`；`https://www.suzuki.fr/build/images/TARIF_GAMME_VP_JUIN26.pdf`；`https://www.suzuki.fr/vehicule/{swift-hybrid,vitara,s-cross-hybrid,evitara,across,swace}`
- **原文**：`Prix catalogue du véhicule présenté. ... Tarif TTC clés en main conseillé au 02/11/2026 ...`；`après déduction d’une remise offerte par votre concessionnaire de 1800€ + 1 000€ d'aide à la reprise`（Swift）；`TARIF GAMME SUZUKI N°02/26 Au 1er juin 2026`；`L'Ignis n'est plus disponible à la vente.`；`Le Jimny n'est plus disponible à la vente.`

---

### Toyota FR（法国 `www.toyota.fr`：**curl 403（Akamai errors.edgesuite.net），浏览器可开；价格在 comparegradespecsv2 JSON 与 texus GetFullConfiguration**）✅

- **可达性**：`curl`（含 UA / `--ssl-no-revoke`）对 `/` 与 `/robots.txt` 均 **403 `Access Denied`（errors.edgesuite.net）**；browser MCP 正常。
- **★ 车型全集**：`/vehicules-neufs/gamme-toyota` 给 16 个乘用车 slug；另有 `professionnels/vehicules-professionnels/*` 的 Hilux / Proace / Proace City / Proace Max（商用车线，另计，不并入本表）。
- **★ 取价主源（变体级）**：车型页 HTML 内含 `grade-selector/fr/fr?modelId=<uuid>` → `GET https://cocadap.toyota-europe.com/toyota/fr/fr/comparegradespecsv2/<modelId>`。结构 `grades[].bodyTypes[].engines[].transmissions[].wheeldrives[]`，叶子 `from.list` = **catalogue MSRP**，`from.listDiscount` = 促销额，`from.listWithDiscount` = 页面「Prix remisé」；`car.id` 为配置 ID。
- **★ 官方全名 + 动力**：车型页 `product-token/<uuid>` 即产品 token；`GET https://texus.toyota-europe.com/v2/car/GetFullConfiguration/toyota/fr/fr/<token>/promotiontimeframe/2ccd6e19-8aa3-4a66-9380-85675fcacd0e/car/<carId>/tfsenabled/false/getfinance/false/getinsurance/false` → `Car.Name`（官网全名，含车身/动力/变速箱/配置）、`Car.PriceIncl`（= list）、`Motorization.Engine.Type.Name`（Hybride/Electrique/Diesel/Hydrogène）。
- **⚠ 页面价是折后价**：车型页所有 `Prix remisé à partir de` = list − listDiscount（Yaris 24 850 − 4 000 = 20 850）；**主表取 `from.list`**，不取 remisé。配置器页 `price.cash` 也等于 list。
- **取全名时的边界**：Mirai 的 `Car.Name` 只有 `Lounge`/`Executive`，按配置器卡「Mirai Lounge / Berline coupé 4 portes」补成 `Mirai Lounge Berline coupé 4 portes`；Proace Verso 无配置器，价格在车型页 `modelchooser__SPACER__d{1,2,3}{1..4}`（COMBI/DYNAMIC/EXECUTIVE × MEDIUM/LONG，6 档；字段顺序=名称/价格/座位数/行李箱容积，原文 `d111..d324`）；GR GT 是未来车型（`valeurs cibles de développement`，无价无配置器）→ 不入表。
- **★ Proace Verso 座位数（2026-11-11 实测）**：官网标题 `monospace électrique jusqu'à 9 places`；`d113/d123=9`（COMBI 两长度 9 座）、`d213/d223=8 ou 9*`（DYNAMIC 两长度）、`d313/d323=8`（EXECUTIVE 两长度）；页内脚注 `9 places (disponible uniquement sur long)* * de série sur Electric` → 9 座是 COMBI 标配、DYNAMIC 可选（仅 LONG），EXECUTIVE 无 9 座；官网未给 9 座单独价格，仍按 finition×长度 的 `à partir de` 出 6 条。⚠ 页内第三张卡把 `62 610 / 64 050 €` 写成 `FINITION DYNAMIC`，但结构化组件 `d311/d321` 明确是 `EXECUTIVE`，主表按结构化字段记 EXECUTIVE。
- **同名版本**：RAV4 / Yaris Cross 的 2WD 与 AWD-i 全名相同（Car.Name 不含驱动），按 `wheeldrives.name` 给 AWD 行追加 ` (AWD-i)`（RAV4 10 条、Yaris Cross 3 条）；其余保持官网原文。
- **燃油**：`Hybride` = HEV；`Hybride Rechargeable` = PHEV；`Electrique` = BEV；`Hydrogène` = FCV；`2.8L Diesel MHEV 48V` = MHEV（Land Cruiser）。
- **★ 年款（官网明标 MY）**：Toyota France 不会把 MY 写进 compare/GetFullConfiguration 字段，但**官网页面/金融方案脚注/官方手册标题/官方新闻稿都逐字标 MY**，按车型取当期标签：AYGO X `MY26`、Yaris `MY26`、Yaris Cross `MY26`、Corolla `MY27`、Corolla Touring Sports `MY27`、C-HR `MY27`、RAV4 `MY27`、bZ4X `MY26`、bZ4X Touring `MY26`、GR Yaris `MY26`、Land Cruiser `MY27`；C-HR+ / Mirai / Supra / PROACE VERSO 当期页面与方案均无 MY → `官网无年款`。⚠ C-HR 同时存在 MY26 库存与 MY27 在售（官网 scheme 逐字 `Toyota C-HR Hybride 140 Dynamic Blanc Pur MY27`，与配置器 35 750 € 对齐），主表按当期在售取 MY27；手册正文本身不印 MY，不能只靠手册正文。
- **交付结果**：`Toyota_FR_官网价_20261111_v2.xlsx`，**96 条 / 15 车系**（AYGO X 5 · Yaris 5 · Yaris Cross 9 · Corolla 7 · Corolla Touring Sports 8 · C-HR 14 · C-HR+ 3 · bZ4X 9 · bZ4X Touring 3 · RAV4 17 · Mirai 2 · GR Yaris 2 · Supra 4 · Land Cruiser 2 · PROACE VERSO 6），22 200–144 000 €；燃油 HEV 52 · PHEV 13 · BEV 21 · Gasoline 6 · FCV 2 · MHEV 2；年款 MY26 33 · MY27 48 · 官网无年款 15。
- **实测**：2026-11-11
- **来源**：`https://www.toyota.fr/vehicules-neufs/gamme-toyota`；`https://cocadap.toyota-europe.com/toyota/fr/fr/comparegradespecsv2/<modelId>`；`https://texus.toyota-europe.com/v2/car/GetFullConfiguration/...`；`https://www.toyota.fr/offres/particuliers`；`https://www.toyota.fr/vehicules-neufs/brochures`；`https://media.toyota.fr/gamme-toyota-nouveautes-et-evolutions-tarifaires-au-1er-avril-2026/`；`https://www.toyota.fr/vehicules-neufs/proace-verso`
- **原文**：`Prix remisé à partir de 20 850 € TTC`；`Yaris Hybride Dynamic Blanc Pur MY26`；`Yaris Cross MY26 Hybride 116 2WD Design Pack Cargo`；`Corolla Berline Hybride 1.8L Dynamic Blanc Pur MY27`；`Toyota C-HR Hybride 140 Dynamic Blanc Pur MY27`；`Nouveau RAV4 Hybride Rechargeable 309ch AWD-i Graphic Sépia Pack+ MY27`；`Nouveau Toyota bZ4X Design Autonomie Confort Bleu de Prusse MY26 neuf`；`Nouveau bZ4X Touring Design Grande Autonomie Noir Graphite MY26 neuf`；`Toyota GR Yaris MY26 : la performance affinée millésime après millésime`；`Toyota Land Cruiser MY27 : une offre affirmée, des équipements renforcés`；`Toyota Aygo X Hybride 116ch Collection MY26`

---

### Ford FR（法国 `www.ford.fr`：**curl 000（Akamai edgekey），真浏览器可开；版本价在官方 « Liste de Prix » PDF 的 Tarif maximum TTC 表**）✅

- **可达性**：`curl`（含 UA、`--http1.1`、`--ssl-no-revoke`）对 `/` 与 `/robots.txt` 均 **000 / 25–30 s 超时**（DNS 到 `*.akamaiedge.net`）；真浏览器正常，静态 PDF 只能在页面内 `fetch()`（curl 403/000）。
- **★ 在售全集**：`/voitures-neuves` 14 个车型卡（Puma · Puma Gen-E · Kuga · Explorer · Capri · Mustang Mach-E · Mustang · Bronco · Tourneo Courier · e-Tourneo Courier · Tourneo Custom · e-Tourneo Custom · Tourneo Connect · Mustang GTD）。
- **★ 取价主源**：`/voitures-neufs/<model>/pricelist`（部分为 `/brochure-options`）→ 官方 PDF（`/content/dam/guxeu/fr/documents/brochures/cars/...`）。PDF 首页印 **`Année modèle 20xx`**，价格页页脚印 `Tarif maximum TTC au dd/mm/yyyy (20xxMY) - Type xx-xx`。
- **★ PDF 表解析（坐标法）**：pdf.js 取 `items[].transform[4]/[5]`；按 y 分组行；每页找 finition 表头行（≥2 个大写词，如 `TITANIUM | TITANIUM BUSINESS | ST-LINE`）；价格单元格正则 `^\d{1,3}( \d{3})+ €$`，按 x 最近邻映射到 finition 列（列宽差 ≤80，实测 5 列全对）。引擎行 = 价格行上方、上一价格行下方的文本（过滤 `Tarif/Ford/Type/®` 与 `+ xxx €`）。
- **⚠ 页面价 vs MSRP**：车型页/列表页 `Prix remisé` 是折后价；同一卡另给 `Prix public à partir de` = MSRP。PDF 的 `Tarif maximum TTC` 与 `Prix public` 同口径（Kuga 入门 E85 38 390 = 页面 Prix public 38 390）。
- **⚠ 配置器**：`mec`/`mec-ice` 页面在 browser MCP 里常是空壳（`Configuration non disponible`），真 Chrome 接受 cookie 后可走完 5 步；`ngc2` 流程直接给 `Prix public à partir de`。Bronco 用 `mec?catalogId=WAEFX-TG1-2023-BroncoFRA202325` 取到 Outer Banks 76 500 / Badlands 80 500（`Prix Total`，默认 2.7 V6 335ch，无选装）。
- **未纳入**：Tourneo 系列（Tourneo Courier / e-Tourneo Courier / Tourneo Connect / Tourneo Custom / e-Tourneo Custom）的官方手册与 Transit 商用线共用，价格页为 **HT**（`Tarif maximum au 01 avril 2026 ... € HT`），且无版本级 TTC 清单；Mustang GTD 无价目表、官网无价 → 均不入表，仅在交付说明列名。
- **燃油**：`mHEV`/`S&S (mHEV)` = MHEV（Puma 全系）；`Hybride Rechargeable (PHEV)` = PHEV；`Hybrid i-AWD (FHEV)` / `Hybrid FlexiFuel (FHEV E85)` = HEV；`100% électrique` = BEV；`5.0 V8` / `2.7l V6 Ecoboost` = Gasoline。
- **年款**：Puma `2027.00` · Puma Gen-E `2027.00` · Kuga `2027` · Mustang `2026` · Explorer `2027.25` · Capri `2027.25` · Mustang Mach-E `2026`（均取 PDF 首页 `Année modèle ...`）；Bronco 手册与配置器均无年款 → `官网无年款`。
- **交付结果**：`Ford_FR_官网价_20261111.xlsx`，**68 条 / 8 车系**（Puma 16 · Puma Gen-E 4 · Kuga 19 · Mustang 6 · Explorer 8 · Capri 8 · Mustang Mach-E 5 · Bronco 2），27 790–85 490 €；燃油 MHEV 16 · PHEV 6 · HEV 13 · BEV 25 · Gasoline 8。
- **实测**：2026-11-11
- **来源**：`https://www.ford.fr/voitures-neuves`；`https://www.ford.fr/voitures-neuves/<model>/pricelist`；`https://www.ford.fr/content/dam/guxeu/fr/documents/brochures/cars/{new-puma,puma-gen-e,Kuga,mustang,explorer,capri,mustang-mach-e,bronco}/...pdf`
- **原文**：`Année modèle 2027.00 Tarif au 28 août 2026`（Puma）；`Année modèle 2027 Tarif au 5 juin 2026`（Kuga）；`Année modèle 2027.25`（Explorer/Capri）；`Tarif maximum TTC au 27/08/2026 (2026MY)`（Mustang）；`Prix public à partir de 25 800 €`（Tourneo Courier，未纳入）；`Tarif maximum au 01 avril 2026 ... € HT`（Tourneo Connect 商用表）

### Fiat FR（法国 `www.fiat.fr` → `omni/configurateur`：**Stellantis 静态车型库 CM_T5 JSON 直出全量目录价**，`Prix en ligne` 是线上折扣不采）✅

- **可达性**：主站 `www.fiat.fr` Akamai 403（curl），但配置器背后的 `www.fiat.fr/sccf/...` 静态 JSON 可**同源 fetch**；无需点完每个 finition。
- **★ 价格口径（Stellantis 2A）**：配置器总览每张卡同时写 `Prix en ligne à partir de` 与 `Prix catalogue à partir de`，线上价低 1 000–5 000 €（例：Grande Panda Essence 15 900 vs 16 900；600e 31 400 vs 36 400）→ **`Prix en ligne` 是折扣价，不采**；采 `Prix catalogue`（未折扣建议零售价，TTC）。
- **★ 全量目录价（核心）**：
  1. `GET /sccf/prod/fiat/publish/data/fccf_mv/scope/3109200.json`（`3109`=FR 市场）→ `comMods[]`：`code` / `desc` / `nsbpath` / `vehiclesNumber`；2026-11 在售 **13 个 comMod**。
  2. `GET /sccf/prod/fiat/publish/data/fccf_mv<nsbpath>/CM_T5_3109200_<code>.json` → `Vehs[]`：`Cod`（mvss）/ `Des`（官方全名）/ `ComVersDes`（finition）/ **`PriceArray`**。
  3. **`PriceArray[3]` = 含 VAT 目录价**（`Configurations.Vehicle.PriceIndex="3"`）；与总览卡 `Prix catalogue à partir de` 的 13 个车系起价逐一吻合。`PriceArray[1]/[2]` 不是目录价、`[0]` 是其它金额，勿用。
- **★ 版本名**：`ComVersDes`（finition）+ 配置器 `Moteur` 区块的官方动力串。多动力车系必须逐条区分：
  - ESSENCE：`1.2 Essence 74kW (100ch) Manuelle`
  - HYBRID：`1.2 Hybrid 81kW (110ch) Automatique` / `1.2 Hybrid 107kW (145ch) Automatique`（600 有两个功率）
  - ELECTRIQUE：GP `Électrique 83kW (113ch)`（44/54 kWh 两款**标签完全相同**，须用 `Des` 的 `44kWh/54kWh` 区分）；500e `Électrique 70kW (95ch)`（23,8 kWh）/ `Électrique 87kW (118ch)`（42 kWh）；600e `Électrique 115kW (156ch)`
  - 500 Hybrid / Pandina：`1.0 Hybrid 48kW (65ch) Manuelle`
- **⚠️ 直达 URL 不可靠**：只带 `commercialModelCode` 打开 `#/customize` 会渲染上一个车型（实测 3326H 回显 Grande Panda）；须从总览点车系卡（`div.sc-eKlEzK` 按标题匹配，派发 pointer/mouse/click），等 hash 出现 `customize` 后再读。
- **⚠️ 官方 PDF 滞后**：车型页对比表/手册可作交叉验证，但**价格过期**（500e 旧表 `RED 30 400` vs 现 POP 28 900；GP Hybrid 旧表 `dès 18 900` vs 现 19 400；600 Hybrid 旧表 27 200 vs 现 26 200）→ 冲突时以配置器 CM JSON 为准（skill §三）。
- **燃油**：GP/600 Hybrid 官方手册逐字「moteur électrique de 48 V」→ **MHEV**；500 Hybrid 对比表「FireFly 1.0 Hybrid **12V**」→ MHEV；Pandina `HYBRID 1.0 **BSG** 65 CH` → MHEV；`Électrique` → BEV；`Essence` → Gasoline。
- **★ 年款（MY2026）**：官网页脚「Retrouvez les consommations énergétiques ici」指向 `FIAT-ABARTH_POSTER_CONSO_04-2026.pdf`，首页抬头逐字 `FIAT / ABARTH - ANNÉE MODÈLE 2026`，并按车型/动力列全，**即 MY2026 官方依据**（比车型手册可靠）；13 个 comMod 全部在内 → 年款一律 `MY2026`。CM JSON 本身无年式字段，不能拿它判年款。
- **★ Topolino（四轮车，单独源）**：MY2026 海报只覆盖 `voitures particulières neuves`，不含 Topolino；官方手册 `BROCHURE_FIAT_TOPOLINO.pdf`（Tarifs au 15/09/2026）印 `BERLINE 9 990 €` / `DOLCE VITA 10 490 €` / `SPORT 11 490 €`（prix clés en main TTC，含 transport/livraison+plaque），Sport 页另印 `Prix Final À partir de 11 490 €`；手册/价格表均无 année modèle → Topolino 记「官网无年款」。⚠ 车型页 `À partir de 7 710 €` 是 reprise + Prime CertiNergy 后的促销价，不采。
- **范围边界**：13 个 comMod = 总览 13 卡；`500 Hybrid Dolcevita`、`500 Hybrid Torino Launch Edition`、`600 Street` 只有营销页、不在配置器且无价 → 不入表、交付说明列名；`600 Sport` 是 600 Essence/Hybrid 的 SPORT finition，已包含。`Tipo` 出现在 MY2026 海报（`Tipo berline 1.6 MultiJet 130 ch`），但 `/modeles/fiat-tipo` 302 回首页、子页无价、不在配置器 → 不入表、交付说明列名。`Grizzly / Grizzly Fastback` 仅为 2026 巴黎车展预告 + KMI 留资页，无配置器/无价 → 不入表。Fiat Professional 商用线（Doblò/Scudo/Ducato/Ulysse 等）HT 口径、独立 pro 站，不并入乘用表。
- **交付结果**：`Fiat_FR_官网价_20261111.xlsx`，**65 条 / 15 车系**（GP Essence 4 · GP Hybrid 4 · GP Electrique 8 · 600 Essence 4 · 600 Hybrid 8 · 600e 4 · 500 Hybrid Berline/Cabrio/3+1 各 3 · 500e Berline/Cabrio/3+1 各 6 · Pandina 3 · Topolino 2 · Topolino Sport 1）；9 990–41 300 €；燃油 Gasoline 8 · MHEV 24 · BEV 33；其中 62 条 MY2026、Topolino 3 条官网无年款。
- **实测**：2026-11-11
- **来源**：`https://www.fiat.fr/omni/configurateur/#/`；`https://www.fiat.fr/sccf/prod/fiat/publish/data/fccf_mv/scope/3109200.json`；`.../CM_T5_3109200_<code>.json`
- **原文**：`Prix catalogue à partir de 16 900 € [1] Prix TTC. Les prix affichés sont des prix conseillés.`；`Prix en ligne à partir de 15 900 €`；`moteur électrique de 48 V`；`FireFly 1.0 Hybrid 12V (47,8 kW / 65 ch)`；`HYBRID 1.0 BSG 65 CH`

---

### Ford FR — Ranger / Transit / Tourneo（商用车三族：**配置器 ngc2 逐级报价；Ranger/Transit 为 HT，Tourneo 为 TTC**）⚠️ 混合税基

- **车型全集**：`/utilitaires-et-pick-up` 共 16 张卡：Transit City / Transit Courier / E-Transit Courier / Transit Connect / Transit Custom（含 Nugget）/ E-Transit Custom / Transit / E-Transit / Transit Châssis / E-Transit Châssis / Transit Minicar / Ranger / Ranger Raptor 等；`/voitures-neuves` 另有 Tourneo Courier / E-Tourneo Courier / Tourneo Connect / Tourneo Custom / E-Tourneo Custom。
- **★ 取价方式**：Ford FR 对这三族**不公开全版本 TTC 价目 PDF**，价格只在 `ngc2` 配置器（`servicescache.ford.com` describe/load 返回的 `price.basePrice.netRetail`/`grossRetail`）。步骤路由可直开：`ngc2/cv2/bodystyle|drive|capacity|model`（Ranger/Transit）、`ngc2/ice2/model`、`ngc2/bev2/model`、`ngc2/tourneo2/bodystyle|model`（Tourneo）。
- **★ 税基（关键）**：Ranger / Transit 配置器价格均标 `€ HT`（`Prix maximum en vigueur`，商用车口径）；Tourneo 配置器标 `Prix public`（TTC）。**两种口径不可直接横比**，交付时分开注明；本次未把 HT ×1.2 换算成 TTC。
- **Ranger（MY2027.00，HT）**：官方手册 `Année modèle 2027.00 Tarif au 20 juillet 2026`；塔里夫页为矢量/图片，文字抽不出，改用配置器逐项读：Super Cab 仅 3.0TD 240 V6 auto 4WD × XLT/Wildtrak；Double Cabine 同柴油机 × XLT/Limited/Wildtrak/Platinum + 2.3 TI VCT 281 PHEV × 同四配置，共 **10 版**，45 145–58 285 € HT。
- **Transit（官网无年款，HT）**：16 种动力（2.0 EcoBlue 105/130/165 × BVM6/BVA8 × FWD/RWD/AWD 等）× 3 车身 × 容量 × 3 配置；本次按「起价级」只收车身最低配：Fourgon Ambiente 105ch BVM6 40 865 / Cabine Approfondie Trend 130ch BVM6 47 270 / Kombi M1 Trend 130ch BVA8 50 220 € HT。配置器步骤依赖「容量」选择，nav 跳步会回退，全矩阵未逐格枚举（见 `_pending`）。
- **Tourneo Courier（官网无年款，TTC）**：`ngc2/ice2/model` 卡片逐配置给 `Prix public à partir de`：Trend 25 800 / Titanium 27 540 / Active 29 280 €，默认动力 1.0L EcoBoost 125ch BVM6。
- **E-Tourneo Courier（官网无年款，TTC）**：`ngc2/bev2/model` 仅 Trend 默认价 35 700 €（Electrique 100 kW 136ch 46kWh BVA1），其余配置需选电池后才有价，未展开。
- **Tourneo Connect（MY26.50，TTC）**：`ngc2/ice2/model`：Trend 32 304（1.5 EcoBoost 115 BVM6 FWD L1）/ Titanium 36 504（1.5 EcoBoost 115 DCT7 FWD L1）/ Active 41 784（2.0 EcoBlue 122 DCT7 FWD L1）。⚠ 手册同车型的 `€ HT` 表（Trend L1 31 764 € HT）与配置器 `Prix public` 不同源，**主表取配置器 TTC**，不要拿手册 HT 反算。
- **Tourneo Custom（官网无年款，TTC）**：`ngc2/tourneo2/model` 4 配置，默认动力 `Electrique 160 kW (218 ch) - 71 kWh BVA1 RWD`：Titanium 58 842 / Sport 62 322 / Titanium X 63 642 / Active 62 430 €。页面仅出现 `central/cars/tourneo-custom/my25/…` 媒体素材路径，**不是年款**；柴油版未在本次起价范围内展开。
- **交付结果（穷举版）**：`Ford_FR_Ranger_Transit_Tourneo_官网价_20261111_v3.xlsx`，**167 条**（Ranger 10 · Transit 57 · E-Transit 33 · Tourneo Courier 6 · E-Tourneo Courier 3 · Tourneo Connect 16 · Tourneo Custom 26 · E-Tourneo Custom 16）。年款：Ranger 10 条 MY2027.00，Tourneo Connect 16 条 MY26.50，其余 141 条官网无年款；燃油 Diesel 87 · PHEV 18 · BEV 52 · Gasoline 10。
- **★ 穷举方法（关键）**：配置器 `load` 响应的 `data.features` 里带**有效复合配置码**（格式 `SERIES_BODY_DGA..._SE#..._TR-..._VS-...`），把每个复合码作为 `config=CATALOG~<code>` 再请求 `load`，`data.price.basePrice.netRetail/grossRetail` 即该组合 HT/TTC 官方价。⚠ 码里含 `#`（`CA#LM`、`SE#GX`）必须 `encodeURIComponent`，否则被 URL fragment 截断；直接 fetch 需带页面的 `Authorization: Bearer` + `x-eusl-k` + `x-eusl-consumer: b-ngc2-prod` 三个头（可从 CDP Network.requestWillBeSent 现取，token 会过期）。本次抓取组合：TTS 90（Transit+E-Transit）· CHQ 9（Courier+E-Courier）· CFJ 16（Connect）· TTU 42（Custom+E-Custom）。
- **★ 配置器逐档补价方法（实测可用）**：选动力后 `ngc2/ice2/drive?...&series=<code>&powertrain=<code>` 的 URL 会带全部参数；直接打开 `ngc2/ice2/bodystyle?...&series=...&powertrain=...&bodystyle=BS-AH` 可锁 L2；用 CDP Network 抓 `servicescache.ford.com/api/vehicle-model/v1/load` 响应的 `data.price.basePrice`（`netRetail`=HT、`grossRetail`=TTC）即该组合官方价，比页面折扣面板可靠。⚠ 页面上的 `Prix remisé` 与 `aria-label` 只对部分组合渲染，不能作为全集来源。
- **实测**：2026-11-11
- **来源**：`https://www.ford.fr/utilitaires-et-pick-up`；`https://www.ford.fr/achat-voiture/build-your-ford/ngc2/cv2/bodystyle?catalogId=WAEFX-TRB-2026-RangerSouthAfricaFRA202700`、`.../cv2/bodystyle?catalogId=WAEFX-TTS-2024-TransitVanFRA202700`、`.../ngc2/ice2/model?catalogId=WAEFX-CHQ-2024-TourneoCourierFRA202700`、`.../ngc2/ice2/model?catalogId=WAEFX-CFJ-2022-TourneoConnectFRA202700`、`.../ngc2/tourneo2/model?catalogId=WAEFX-TTU-2023-TourneoCustomFRA202725`
- **原文**：`Année modèle 2027.00 Tarif au 20 juillet 2026`（Ranger）；`Année modèle 26.50`（Tourneo Connect）；`Prix maximum en vigueur`；`Prix public à partir de 25 800 €`；`Prix public à partir de 58 842 €`；`Prix remisé 40 630,50 €HT`（Ranger 示例）

---

### Geely（FR 法国 `www.geelyauto.fr`：Nuxt SSR，页内只有车系起价；**变体价只在官方 brochure PDF 的「Tarifs clients TTC」页**，E2 的 brochure 是图片型须渲染目视）✅

- **可达性**：`curl --ssl-no-revoke` 直通（`/` 200、`/robots.txt` 200），无 WAF / 无挑战页；Nuxt 3 SSR，`/models/<slug>` 的 HTML 里文案与脚注齐全，`/_payload.json` 只有营销文案（实测 2026-11-12）。
- **★ 车型全集（4）**：`/sitemap.xml` 只有 4 个 `/models/*` —— `geely-e2` / `geely-e5-electric-suv` / `geely-starray-em-i` / `geely-monjaro-em-i`。⚠ `MONJARO EM-i` 只挂在首页导航（车型列表页 `/models` 仅列 STARRAY / E5 / E2），但独立车型页 + 官方 brochure + 报价齐全（pré-lancement 可订）→ 计入在售。
- **★ 页内只有车系起价 + 脚注**：hero 写 `DÈS 40 990 €¹` 或 `DÈS 189 € TTC/MOIS¹`（后者是 LLD 月供，不是车价）；真价在脚注：`Prix de vente conseillé à partir de 20 990 € TTC au 01/09/2026, pour le 1er niveau de finition, hors options et hors frais d'immatriculation, de livraison et de mise à la route, soit 19 990 € TTC après application de la remise.` → 前半是 MSRP，`soit … après application de la remise` 是扣 remise 的促销价，**不采**。⚠ **官网没有配置器**（sitemap 与页面均无），不要花时间找。
- **★ 变体价唯一来源 = 官方 brochure PDF**：车型页 `Téléchargez la brochure` → `https://www.datocms-assets.com/225118/<id>-<model>_web.pdf`；末页 `Tarifs clients TTC` / `Prix publics conseillés TTC` 每个 finition 一列一个价（`PRO 20 990 €` / `PRO + 24 990 €` / `MAX + 26 990 €`），脚注逐字 `Tarifs publics conseillés TTC du 01 septembre 2026, exprimés en euros et applicables en France métropolitaine, hors options et hors peinture métallisée (+750 € TTC)`。
- **★ 交叉校验（3/3 全对）**：页内「Modèle présenté」= 该 finition 价 + 金属漆选装 —— E5 `41 990 + 750 = 42 740`（页面逐字 `Geely E5 Max+ avec option peinture, 42 740 € TTC`）、STARRAY `38 990 + 850 = 39 840`、MONJARO `40 990 − 2 000 = 38 990`（pré-lancement 优惠券）。四个车系的首个 finition 价与页内 `à partir de` 逐一吻合。
- **⚠ E2 brochure 是图片/矢量型**：`pdftotext` 与 pdf.js `getTextContent` 全文只出 `SPÉCIFICATIONS` 一个词（整本只有 2 个 text stream）→ 必须**渲染成图片目视读价**。本机可行做法：PowerShell WinRT `[Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync` + `RenderToStreamAsync` 输出 PNG（inline `-Command` 执行，脚本文件被执行策略拒绝）；浏览器内 pdf.js canvas 渲染对 hidden 页不返回（rAF 被暂停）。
- **⚠ 本机端点加密（Windows DLP）**：`curl` 落到 `Desktop\…` 的 PDF 头部被改写成 `%TSD-Header-###%`，`pdftotext`/`od` 读不到正文，但 **Node 读同一文件是明文** → 先用 Node 转存到 `%TEMP%` 再处理。
- **燃油**：`100 % électrique` → BEV（E2 / E5）；`Type de groupe motopropulseur | PHEV` / `Hybride rechargeable` → PHEV（STARRAY EM-i / MONJARO EM-i）。MONJARO Ultra 另有 `Transmission intégrale électrique e-AWD`、`Batterie 29,8 kWh`。
- **★ 年款**：全站 HTML / payload / brochure 全文均无 `MY` / `millésime` / `modelYear` / `année modèle`；brochure 只有出版说明（`soit avril 2026`、`soit octobre 2026`）与价格生效日（`du 28 avril 2026`、`au 12 octobre 2026`），页脚 `© 2025-2026` 是版权年 → 4 个车系全部「官网无年款」，不推断。
- **交付结果**：`Geely_FR_官网价_20261112.xlsx`，**12 条 / 4 车系**（E2 3 · E5 3 · STARRAY EM-i 3 · MONJARO EM-i 3），20 990–46 990 €；燃油 BEV 6 · PHEV 6；年款全部「官网无年款」。
- **实测**：2026-11-12
- **来源**：`https://www.geelyauto.fr/sitemap.xml`；`https://www.geelyauto.fr/models/{geely-e2,geely-e5-electric-suv,geely-starray-em-i,geely-monjaro-em-i}`；brochure `1787868436-geely-e2-web-1.pdf`（第 6 页 Tarifs clients TTC）、`1784283773-geely-e5_web.pdf`（第 3–4 页）、`1784283773-geely-starray-em-i_web-1.pdf`（第 3–4 页）、`1793714551-geely-monjaro-em-i-web.pdf`（第 7–8 页），均在 `https://www.datocms-assets.com/225118/`
- **原文**：`Prix de vente conseillé à partir de 20 990 € TTC au 01/09/2026, pour le 1er niveau de finition, hors options et hors frais d'immatriculation, de livraison et de mise à la route, soit 19 990 € TTC après application de la remise.`；`Modèle présenté : Geely E5 Max+ avec option peinture, 42 740 € TTC.`；`Prix catalogue TTC | 37 990 € | 39 990 € | 41 990 €`；`Tarifs publics conseillés TTC du 01 septembre 2026, exprimés en euros et applicables en France métropolitaine, hors options et hors peinture métallisée (+750 € TTC), sauf teinte Nebula Beige +350 € TTC).`；`Prix publics conseillés TTC au 12 octobre 2026, exprimés en euros et applicables en France métropolitaine, hors options et hors peinture métallisée (+900 € TTC).`；`Type de groupe motopropulseur | PHEV`；`© 2025-2026 Geely Auto France. Tous droits réservés.`

---

### Jaguar FR（法国 `www.jaguar.com/fr-fr`：**已停售新车，官网仅品牌/Type 01 概念车/Approved 二手车**）⛔ 不出表

- **可达性**：`curl`（含 UA / `--ssl-no-revoke`）301 → `https://www.jaguar.com/fr-fr/index.html` 200（AEM `X-Market: jdx-xi-en`），**无 WAF**。
- **★ 官方停售声明（Support FAQ 逐字）**：`À compter de novembre 2024, nous arrêterons les ventes de véhicules Jaguar neufs en vue de la présentation de notre nouvelle marque un peu plus tard dans l'année et du lancement de nos nouveaux produits en 2026.`；`Nous avons cessé les attributions de notre génération actuelle de véhicules Jaguar, mais nous proposons à l'achat une sélection de modèles d'occasion Approved via notre réseau de concessionnaires.`
- **★ 在售范围**：首页导航只有 `Type 01` / `À propos de Jaguar` / `Trouvez-nous` / `Assistance` / `Véhicules d'occasion Approved`；**没有车型列表、配置器、价格或「Véhicules neufs」入口**。
- **★ sitemap 实锤**：`/fr-fr/sitemap.xml`（16 KB）除首页/Type 01/about/support/contact/法律页外，**全部是 national-dealer-locator 页面，0 个车型页/配置器/价格页**；`/fr-fr/vehicles.html`、`models.html`、`f-pace.html`、`i-pace.html`、`e-pace.html`、`xf.html`、`f-type.html`、`configurator.html`、`range.html` 全部 **404**。
- **★ Type 01 不是在售车**：官方逐字 `La Type 01 donne un aperçu de notre véhicule au lancement de la production. Les modèles et fonctionnalités définitifs ne sont pas encore disponibles à la vente et pourront évoluer d'ici son lancement.` → 概念/预览，无价格。
- **结论**：法国 Jaguar 当前**无新车可售**，按 skill 止损规则**不出表**（写 `官网无价格` 会被误读为「在售但没标价」）；Approved 二手车不是新车 MSRP，也不入表。2026 年新电动车产品尚未定价/开售。
- **实测**：2026-11-12
- **来源**：`https://www.jaguar.com/fr-fr/index.html`；`https://www.jaguar.com/fr-fr/support.html`；`https://www.jaguar.com/fr-fr/type-01.html`；`https://www.jaguar.com/fr-fr/sitemap.xml`
- **原文**：`À compter de novembre 2024, nous arrêterons les ventes de véhicules Jaguar neufs ...`；`Nous avons cessé les attributions de notre génération actuelle de véhicules Jaguar ...`；`Les modèles et fonctionnalités définitifs ne sont pas encore disponibles à la vente ...`

---

### Cadillac（FR 法国 `www.cadillaceurope.com/fr-fr`：**配置器内嵌 JSON 可取 per-trim 官方 MSRP；车型页 JSON-LD 价已滞后**）✅

- **可达性**：`www.cadillaceurope.com/fr-fr`、`/robots.txt`、配置器 `/fr-fr/design/<model>` 实测 **curl 均 200**（2026-11-11，944KB–1.5MB）。Akamai 封锁**为间歇式**，非永久——早前某次返回过 403，但稳定重试可拿全页面。WebFetch 与 curl 均可穿透。
- **★ 取价源（配置器内嵌 JSON，per-trim 权威）**：配置器 HTML 内嵌每个 trim 的官方对象 `"trim":{"code":...,"name":...,"prices":{"msrp":{"value":N,"formatted":"N €"}}}` 连同 `"carline":{"modelYear":"YYYY","name":"..."}`。逐 trim 提取 `prices.msrp.value` = 官方 MSRP（欧元，TTC 含税，法国 VAT 20%）。**这是最细粒度、与价格同源的官方口径**。
- **★ 年款（消费者可见口径 = 2026，全系统一）**：官网**无显式「年款」标签**——落地页的 2025/2026 是 CO₂ 目标与版权年，配置器只显示「Arrivée estimée 2027」（交付时间，非年款）。消费者能直观看到的年款来自官方车型名本身：`2026 Cadillac OPTIQ / LYRIQ / LYRIQ-V / VISTIQ`（= 概览页 JSON-LD `name` 与 `modelDate="2026"`）。⚠️ 配置器内嵌后台字段 `carline.modelYear` 写 `OPTIQ=2025 / LYRIQ=2024 / LYRIQ-V=2026 / VISTIQ=2026`，属技术/认证年，**消费者不可见 → 不采用**，四款统一按消费者视角记 **2026**。
- **★ 在售范围**：法国在售 **4 款纯电 SUV**，每款 trim 如下（价格=配置器官方 MSRP，均 BEV，年款均消费者视角 2026）：
  - **OPTIQ**：Premium Luxury 61.000 € ／ Premium Sport 61.000 €
  - **LYRIQ**：Sport 85.000 € ／ Luxury 85.000 €
  - **LYRIQ-V**：V-Series 110.184 €（仅 1 trim）
  - **VISTIQ**：Luxury 100.540 € ／ Sport 100.540 € ／ Premium Luxury 111.658 € ／ Platinum 114.718 €
  - CT4/CT5/Escalade 等燃油车不在欧洲在售，第三方库（ccarprice 等）的 France 价是 US-spec 噪声，**不采**。
- **★ 价冲突处理**：OPTIQ 配置器 + 首页 hero「À partir de 61 000 €」均 = **61.000 €**，与概览页 JSON-LD 的 69.500 冲突 → **以配置器/首页为准**（69.5 为旧发布快照）；其余三款配置器价与 JSON-LD 一致。
- **坑**：① Akamai 间歇 403，遇 403 重试/换 WebFetch 即可；② 概览页 JSON-LD 的 `offers.price` 滞后（OPTIQ 写 69.5k），**价不可直接采**、但 `name`/`modelDate=2026` 正是消费者可见年款，年款用 2026；③ 配置器后台 `carline.modelYear` 的 2024/2025 是技术年，消费者不可见，勿当交付年款；④ Luxury 与 Sport 在 OPTIQ/LYRIQ/VISTIQ 上可能共用同一基础 MSRP（如 VISTIQ Luxury=Sport=100.540、OPTIQ 两 trim 同 61.000），属正常，勿误并。
- **实测**：2026-11-16（2026-11-11 首次）
- **来源**：`https://www.cadillaceurope.com/fr-fr/design/{optiq,lyriq,lyriq-v,vistiq}`（配置器内嵌 JSON）；交叉：`https://www.cadillaceurope.com/fr-fr/{optiq,...}`（概览页 JSON-LD）
- **原文**：`"trim":{"code":"6MH56_1SC","name":"Luxury",...,"prices":{"msrp":{"value":100540,"formatted":"100 540 €"}}}` ；`"carline":{"modelYear":"2026","name":"Vistiq"}` ；概览页 `"name":"2026 Cadillac OPTIQ","modelDate":"2026","price":69500`（滞后，弃用）
- **交付结果**：`Cadillac_FR_官网价_20261116.xlsx`，**9 条 / 4 车型**（OPTIQ 2 + LYRIQ 2 + LYRIQ-V 1 + VISTIQ 4），全 BEV；年款 **2026（消费者视角，统一）**；价格与 2026-11-11 一致。


---

### Zeekr EU FR（法国 `www.zeekr.eu/fr-fr` → 配置器 `shop.zeekr.eu/fr-fr/configuration`：**SPA，Playwright 渲染后价格即在 DOM；底层 API 网关 `gateway-pub-azure.zeekr.eu/panda/api/c/item/`**）✅

> 主站 `www.zeekr.eu/fr-fr` 是 Nuxt 落地页（列车型但无价）；价格全在 `shop.zeekr.eu` 配置器子域。**直连 `shop.zeekr.eu` 任何路径 curl 都返回 404 SPA 壳**（壳里 `<link href="https://gateway-pub-azure.zeekr.eu">` 暴露 API 网关），必须 Playwright 渲染或抓 XHR。

| 项 | 内容 |
|---|---|
| **★ 可达性** | `shop.zeekr.eu` 直连 curl = 404 壳（非封锁，是 SPA）；用 Playwright（`headless=True` 即可，非 Akamai）渲染即可见价 |
| **★ 车型全集** | `GET gateway-pub-azure.zeekr.eu/panda/api/c/item/getOpenCarModel?countryCode=FR&orderType=300`（**浏览器内调用**；直接 curl 报 `401 signature missing`）→ `categoryTreeVOList` 给出 6 车系 17 版本的 linkCode（车系 linkCode = seriesCode） |
| **★ 价格接口** | `POST gateway-pub-azure.zeekr.eu/panda/api/c/item/queryCarModels`（**浏览器内调用**）→ `data[]` 每项 `modelName` + `basePrice`(EUR) + `currencyCode`；basePrice = 含税 MSRP |
| **★ 配置器 URL** | `https://shop.zeekr.eu/fr-fr/configuration?linkCode=<车系linkCode>&modelCode=<版本linkCode>`；加载即渲染全部版本名+价（DOM 文本形如 `Core RWD 52 990 EUR`），版本名已含驱动（RWD/AWD） |
| **★ 遍历法** | 逐车系（linkCode 1 / 1075 / 1611 / 1628 / 1908 / 1904）加载配置器，拦截 `queryCarModels` 响应取版本+价；或用 Playwright `page.on('response')` 抓该接口 |
| **★ 口径** | `basePrice` = 含税建议零售价（TTC），官网脚注「Prix indicatif TTC」；默认选装项（Jantes/Intérieur/Extérieur）标 «Compris»（含在起价内），不单列 |
| **车型/版本名** | 官网 `modelName` 原样（如 `Long Range RWD`、`Privilege Sport Edition AWD`、`Ultra AWD`）；纯电 → BEV；动力（RWD/AWD）已并入名，不另加电池容量 |
| **年款** | 仅「NEW ZEEKR 7X MY27」官方车型名含 MY27 → `MY27`；其余 16 版本配置器/接口均无 MY 字段 → `官网无年款`（车型树后台 label 带 «001 EU … 23/25» 但非客户可见 MY，不采） |
| **停销** | 全部在售 → `否` |
| **交付结果（20261111）** | `ZEEKR_FR_官网价_20261111.xlsx`，**17 条 / 6 车系**：ZEEKR 001 4 · ZEEKR 7X 3 · ZEEKR 7GT 3 · ZEEKR X 3 · NEW ZEEKR 7X MY27 3 · ZEEKR 9X 1；37 990–119 500 €，全 BEV |


### Land Rover（FR 法国 `www.landrover.fr` / 配置器 `www.rangerover.com/lr/fr_fr/`：**一条 JSONP 拿全车系型号价，curl 直连**）✅

> 主站 `landrover.fr` 是 AEM 展示站，车型页**只有车身级 `À partir de` 起价**（Defender 页 5 个车身：OCTA 179 200 / Hard Top 75 400 / 90 69 000 / 110 78 600 / 130 105 400）。型号级价在 JLR 配置器（IPR），但真正的数据源是**配置规则 JSONP**，不在页面里。

| 项 | 内容 |
|---|---|
| **★ 可达性** | `curl` 直连 `landrover.fr` 车型页只返回 11 KB JS 壳（价格由前端渲染）；`rules.config.landrover.com` **可 curl 直连 200**，无需浏览器、无需 cookie |
| **★ 核心端点** | `GET https://rules.config.landrover.com/rc/lr/fr_fr/{carline}_{MY}/.jsonp?view=personalise&callback=config_rcjson`（返回 `config_rcjson({...})`，去掉回调即 JSON） |
| **★ 车系码 × 年款码** | `l460` Range Rover · `l461` RR Sport · `l560` Velar · `l551` Evoque · `l462` Discovery · `l550` Discovery Sport（**k26=MY2026**）· `l663` Defender（90/110/130/Hard Top/OCTA 全在一个 file）。年款码 `k27`=MY2027 / `k26`=MY2026，**写在 URL 段里**，例：`/rc/lr/fr_fr/l460_k27/.jsonp` |
| **★ 型号级价格在哪** | `feature-dictionary.feature-list` → `name=="PRODUCT"` 组（l460 有 57 条）。每条含 `id`（如 `A-TD6-350-SA1-LWB`）、`description.fr`（**两行**：`版本名\n动力全称`）、`price.RETAIL` / `price.GROSS`（含税，两者相等）、`property.definition`（`车身 动力 版本 驱动`，如 `A-LWB A-TD6-350 A-AB D`） |
| **★ 价格口径** | `price.RETAIL`（= `WLTP_CONFIGURED_OTR` = `GROSS`）= 法国 **TTC 建议零售价，不含选装**；`NET` = 去税价（`GROSS/1.2`，勿采）。`vehicle.price` 为空对象、`configuration.summary.price` 只是**当前默认构型**的总价，都别当型号价用 |
| **★ 型号名写法** | PRODUCT 的 `description.fr` 就是官网「版本+动力」两段原文（`Range Rover SE` + `249 ch (183 kW) 3.0 litres 6 cylindres Ingenium MHEV Diesel à double turbocompresseur, transmission intégrale, automatique`）→ 换行改一个空格即为完整型号名，**不裁剪**（与 INEOS 同口径） |
| **⚠ 同名不同车身** | LWB / 7 座 / Defender 110/130 与 SWB 的「版本+动力」文本可能**完全一样**，只有价格不同（Range Rover SV Black EV：SWB 258 400 vs LWB 290 200；Defender 200 ch 基础版：90 = 64 300 vs 110 = 68 000）。按 `property.definition` 第一段补车身写法：`A-LWB`→`LWB`、`A-LWB-7`→`LWB Sept Sièges`、`A-90/110/130`→`90/110/130`、`A-HT-90/110`→`Hard Top 90/110`、`A-SV-110`→`OCTA`；**文本里已含该字样则不重复追加**（Range Rover 的 LWB 描述多数自带 `LWB`）。不补会得到 20 组重复行 |
| **★ 年款依据** | `feature-dictionary.vehicle.modelyear` = `"k27"` / `"k26"`，与 URL 段一致；全站无 `MY2027` 字样，只有配置器 URL 与 `assets.config.landrover.com/.../l460_k27/...` 这类编码 → 落 `MY2027/MY2026` 时依据引 `modelyear` 字段 |
| **★ 燃油判定** | 动力全称里逐字：`MHEV`/`semi-hybride`/`hybride léger` → MHEV（**Diesel 轻混也归 MHEV，不归 Diesel**）；`PHEV`/`hybride électrique` → PHEV；`EV`/`Electric`/`kWh` → BEV（注意 `\bEV\b` 词边界，否则 `MHEV` 误命中）；只剩 `diesel` → Diesel；`essence` → Gasoline。Discovery 的 3.0L D350 描述里**没有 MHEV 字样** → 归 Diesel |
| **⚠ 其他无效路径** | `/rc/lr/fr_fr/{carline}_{MY}/{build}/{version}/.jsonp` 也对（`build` 如 `4d6f9`，来自 `vehicle.href`），但 `{carline}_{MY}/{build}/{bodystyle}/{version}`、`{version}/{engine}` 这类三段式返回 **28 KB 空壳、价格 0.00** → 只有「车系级」与「车系+版本」两种形态有效 |
| **⚠ PDF 生成器** | `https://pdfgen.config.landrover.com/lr/fr_fr/{carline}_{MY}/{build}/landrover.pdf` 可下（515 KB / 19 页），但内容是**当前单一构型**的配置单（末页 `PRIX DE BASE`），**不是全系价目表**，别当价目源 |
| **交付结果（20261111）** | `LandRover_FR_官网价_20261111.xlsx`，**172 条 / 7 车系**（DEFENDER 62 · RANGE ROVER 57 · RANGE ROVER SPORT 30 · RANGE ROVER EVOQUE 8 · RANGE ROVER VELAR 6 · DISCOVERY SPORT 5 · DISCOVERY 4），57 800–326 445 €；燃油 MHEV 112 · PHEV 39 · BEV 18 · Diesel 3；年款 MY2027 167 / MY2026 5（Discovery Sport） |

**抓取骨架（Node，无需浏览器）**：

```js
const url = `https://rules.config.landrover.com/rc/lr/fr_fr/${carline}_k27/.jsonp?view=personalise&callback=config_rcjson`;
const txt = await (await fetch(url)).text();
const d = JSON.parse(txt.replace(/^config_rcjson\(/, '').replace(/\)\s*;?\s*$/, ''));
const model = d['feature-dictionary'].vehicle.description.en;      // RANGE ROVER / DEFENDER …
const my    = d['feature-dictionary'].vehicle.modelyear;           // k27
const prod  = d['feature-dictionary']['feature-list'].find(g => g.name === 'PRODUCT').feature;
// prod[i].description.fr 两行；prod[i].price.RETAIL.value；prod[i].property.definition 首段=车身码
```

---

### Genesis（FR 法国 `www.genesis.com/fr/fr`：**GraphQL 只能 GET、且 `org-eu` 网段被墙 → 用外部抓取通道**）⚠️ 特殊

> 站点是 AEM + HPP2 配置器（`gv60_configurator`）。车型页 `carcf-json` 只有**车系级起价**（GV60 = 54 200），型号级价全在 `org-eu.genesis.com/eu/papi`。

| 项 | 内容 |
|---|---|
| **⚠ 可达性** | `org-eu.genesis.com`（185.106.9.162）与 `ctbapi.hyundai-europe.com`（185.106.8.129）在本沙箱 **TCP 443 直接不通**（`curl` 000、`/dev/tcp` 失败），浏览器打开配置器时页面内 `fetch` 也报 `TypeError: Failed to fetch`、`context.request` 40 s 超时 → 不是 UA/CORS 问题，是网段不可达 |
| **★ 破法** | 端点支持 **GraphQL over GET**：`GET https://org-eu.genesis.com/eu/papi?query=<urlencoded query>`，用 `WebFetch`（外部出口）逐条取，返回标准 JSON |
| **★ 参数** | `service:"S03"`（欧洲）、`country:"fr"`、`language:"fr"`；`modelId` 形如 `AR|*|||FL`（**含 `|` `*`，必须 URL 编码**） |
| **★ 三个 query** | `gppModels{modelId modelDescription price currency}` → 车系与起价（FR 仅 4 条：GV60 54 200 / Electrified GV70 68 400 / Electrified G80 82 000 / GV60 Magma 86 600）<br>`gppTrims{trimId trimNm minPriceNet minPriceGross}` → **型号级起价，首选**（GV60: PURE 54 200 / PREMIUM 64 100 / LUXURY 74 100）<br>`gppFscs{...modelYear trimNm fscGrossPrice}` → 逐配置（含颜色组合，几十行），只用来看 `modelYear` |
| **★ 价格口径** | `minPriceGross` / `fscGrossPrice` = 法国 **TTC**；`minPriceNet` = 去税（`/1.2`）。⚠ 别用 `gppFscs` 的行数当型号数：同一 trim 会按车漆/内饰组合返回 30–60 行，价格在 `minPriceGross` 到 `minPriceGross+1.5 万` 之间浮动 |
| **★ 年款** | `gppFscs` 的 `modelYear` = `"2027"`，且 `fscDescription` 逐字带 `(MY27)` → 落 `MY2027`。`carcf-json` 里的 `modelYear` 是 `0.0`（无值），别采 |
| **★ 燃油** | FR 在售 4 个车系**全为纯电**（车型名 `Electrified …` / `powertrainType:"EV"`）→ BEV |
| **⚠ 无效端点** | `/eu/papi` 直接 POST、`www.genesis.com/eu/papi`、`www.genesis.com/eu/papi/papi`、`sst.genesis.com/msr`（其实是 GTM 容器）全部 404 或非价格数据 |
| **交付结果（20261111）** | `Genesis_FR_官网价_20261111.xlsx`，**8 条 / 4 车系**（GV60 3 · Electrified GV70 3 · Electrified G80 1 · GV60 Magma 1），54 200–86 600 €，全部 BEV / MY2027。GV90 仅在导航出现，`gppModels` 无此车系 → 不收录 |


---

### Lancia（FR 法国 `www.lancia.fr`：Akamai 封 curl / 真浏览器通；价格在 **Stellantis Omnichannel 配置器** `/omni/configurateur/#/`）✅

- **可达性**：`curl` 对**任何路径（含 `/robots.txt`）恒 403 AkamaiGHost（367 B）**；`--http1.1`、换 UA 均无效；真浏览器（有头 + 去 webdriver）**200**（实测 2026-11-11）。`store.lancia.fr` **无 DNS 记录**（该品牌没有 store 子域，别照搬 Citroën 的 `/graphql` 套路）
- **★ 车系全集（car-selector，一次请求拿全）**：`POST https://api.omnichannel.stla-aws.net/service-contract/v1/ncs/retrieve`——配置器首屏自动发、**200 且无需自拼 body**，返回 `modelList[].models[].data[]`：`modelCod` `modelName` `cataloguePrice` `eStorePrice` `fuelTypeName` `numberEngines` `numberTrims` `vehicleCode`。6 个车系 / 17 个版本
- **★ 版本级价格**：`/omni/configurateur/#/customize?commercialModelCode=<modelCod>&…` 页面——**未选中的 trim 卡片**显示「Prix catalogue à partir de <金额> €」，**当前选中那个 trim 的价格只在右侧侧栏**「Prix catalogue[1]」
- **★ 底层接口**：`POST https://api.omnichannel.stla-aws.net/pricing/v1/vehicle`（Bearer；body `brand:"70"` `brandCode:"70"` `country:"FR"` `version:"444.1HF.0.000"` `trim:"079"` `priceType:"eStorePrice"`）→ `price.vehicle.prices[]` 取 **`priceType:"cataloguePrice"` 的 `withTaxesAndFees`**（= 页面显示值）。`withVAT` 是**未含 delivery 220,74 + transportation 540** 的车价，别混
- **口径**：页面脚注 [1] 逐字「Prix TTC. Les prix affichés sont des prix conseillés. … Le prix ci-dessus n'inclut pas le montant de la carte grise et de l'éventuel malus.」→ 含税建议零售价、不含灰卡与 malus
- **在售范围**：Ypsilon Turbo 100 / Ypsilon Hybride / Ypsilon Électrique / Ypsilon HF 280ch / Gamma Électrique / Gamma HF Intégrale 进配置器；**Gamma Hybride（LS / LX / HF Line 三档）只在车型页 `/models/gamma-hybride` 有「À partir de X € (prix catalogue)」，car-selector 里没有该车系** → 车系页取价并注明
- **坑**：① **深链必须带全 `color/interior/wheels/mvss`**，只给 `commercialModelCode` 时侧栏恒显示 `--` 且无 Finition 列表（`4282M` 实测）；② **hash 路由不会重载**：连续 `goto` 不同 `#/customize?…` 会沿用上一台车（实测 13 个深链全部落到 `mvss=704441HF0000`）→ 每台车先 `goto('about:blank')` 再打开；③ trim 卡片价格会**陈旧渲染**（4440 首次渲染 LX=45 900，复位重载后为 47 900），以「LX 选中态 + 侧栏 47 900」为准；④ 「Disponible avec la version <trim>」只是当前选中 trim 的提示，不是动力-配置对应表；⑤ 页面 `data-props` 有 `modelYear` 但为**空串**
- **年款**：配置器、AEM、car-selector、pricing 接口四处**均无 MY / millésime**，`WlModelIndex` 的 `modelYear` 为空串 → 全部「官网无年款」；页脚 `©2023` 是版权年
- **停销**：官网未标注任何停产/下架 → 全部 `否`
- **实测**：2026-11-11
- **来源**：`https://www.lancia.fr/omni/configurateur/#/`（6 个 `commercialModelCode`：`4282T` `4282M` `4292B` `4292HF` `4440` `4440HF`）；`https://www.lancia.fr/models/{ypsilon-turbo-100,ypsilon-hybrid,ypsilon-electric,gamma-electrique,gamma-hybride}`
- **原文**：`Prix catalogue à partir de` / `Ypsilon Turbo Essence 74kW (100ch) Manuelle` / `Hybrid 81kW (110ch) Automatique`/ `Électrique 169kW (230ch)` / `Électrique 180kW (245ch)` / `Électrique 275kW (375ch)` / `Électrique 207kW (280ch)` / `SYSTÈME HYBRIDE 48 V`（Gamma Hybride）
- **交付结果**：`Lancia_FR_官网价_20261111.xlsx`，**17 条 / 7 个车系**，22 300–59 900 €；燃油：BEV 8 · MHEV 6 · Gasoline 3（Ypsilon Hybride 按 car-selector `fuelTypeName:"Mild Hybrid"` + 21 kW 辅助电机判 **MHEV**，不是 HEV；Gamma Hybride 按官网「hybride 48 V」判 MHEV）

---

### Renault FR（法国 `www.renault.fr` → `fr.co.rplug.renault.com`：**rplug 后端 curl 直连，PVC=未折扣 MSRP；页面 From 是扣 CEE 奖金促销价不采**）✅

- **可达性**：`fr.co.rplug.renault.com` 全 GET 端点 curl 直连 200（`Accept: application/json` + Chrome UA + `--ssl-no-revoke`）；主站 HTML 亦 curl（APP_STATE 内嵌），无需浏览器。（实测 2026-11-11）
- **★ 取价链路（每车系独立 base，禁硬编码）**：① 车型页 `window.APP_STATE`（双重转义 JSON）菜单 `…megaDropdown…ranges[0].models[]` 取全量车系 `{modelAdmin.modelURI, modelData.minPrice, webDisplayPrices.minPriceWithoutBonus, pricedVersion}`；② `GET /product/model/<spec>;<mtc>/<slug>/c/A` → Schema.org `offers[0]` 尾段抽 **BASE**；③ `GET /pricelist/<BASE>` → `priceList[]` 按 `priceType.reference`：**PVC=TTC 未折扣 MSRP（采）**、PCHT/TTVA/TREMIS/PBASE 不采；④ `GET /pres/<BASE>` → `versionsPresentation` 树 `versionItem.{key:"VECxxx_FRAN", label.fr=版本全名}`；⑤ `GET /category/<BASE>` → `versionCategories[]`（==在售集）`PT5554_*`发动机/`PT1628_*`燃油/`PT5662_*`能量类/`LPGEQ`。**curl 必带 `-L`**：BASE 会被官网 301 刷新（2026-11-13 实测 megane `BAKHn0AhhAhCD`→`BAKH20AhhAhCD`、renault4 `BAKHg`→`BAKHy`、symbioz `BAKHs`→`BAKH7`），拿旧 base 直连会「fetch failed」，须回 ② 重抽 base；**modelURI 含字面空格须转 `%20`**（Kangoo E-Tech `KV2;mtc= ENS_MDL2PSL1SERIESPE3, …`），否则请求失败。
- **★ CEE 奖金陷阱**：菜单/车型页 `priceType:"PVCBONADOBE"` 的 `à partir de` = MSRP − 3620 €（Twingo 19490→15870、R5 28490→24870、R4 29990→26370、Megane 37900→33070）→ **促销不采**；采 PVC，与 `minPriceWithoutBonus` 逐一吻合。免责逐字：`Prix TTC selon tarif constructeur maximum conseillé (comprenant les frais de préparation du véhicule, hors options et prestations facultatives)`。
- **★ 在售范围**：`/category` == `/c/<BASE>/A` 的 `impact[]`(VersionId)；**pricelist/pres 含下架版本（更多）**，以 category∩impact 为准（Clio 15→11，evolution+ SERIELIM2 排除）；17 车系 idsMatch 全 true。**在售集会随批次变动**：2026-11-13 复检 SYMBIOZ 由 6→8 版本（新增 `VEC179` techno series full hybrid E-Tech 160 ch - 26b = 34 400、`VEC180` techno series Eco-G 120 ch - 26b = 29 900，原 6 版本价不变），故**每次交付前须按当前 base 重取 category，别复用旧 rows**。
- **★ 燃油（PT5662 优先）**：electric→BEV、phev→PHEV、hev→HEV、icebifuellpg→Dual Fuel（Eco-G）、icemonofuel+PT1628_diesel→Diesel、+essence→Gasoline。
- **★ 座位数维度（Grand Kangoo 5/7 places 是两条独立产品线，2026-11-13 补）**：官网把座位数做成配置器**独立一步** —— pre-configurateur h1 逐字「étape 2 - sélectionner le nombre de places」，两个 CTA「configurer en version 5 places」「configurer en version 7 places」各进**不同配置器产品**：

  | 车系 | 7 places 入口 → BASE | 5 places 入口 → BASE |
  |---|---|---|
  | Grand Kangoo 汽/柴油（h2「GRAND KANGOO ESSENCE OU DIESEL」） | `/vehicules-particuliers/grand-kangoo/configurateur.html` → `BAKGy0AhhAiMtMu` | `/vehicules-particuliers/grand-kangoo-5-places/configurateur.html` → `BAKGy0AhiAiMtMuAhB1` |
  | Grand Kangoo E-Tech（h2「GRAND KANGOO E-TECH ÉLECTRIQUE」） | `/vehicules-electriques/grand-kangoo-e-tech/configurateur.html` → `BAKHw0AhhAiKUKV` | `/vehicules-electriques/grand-kangoo-e-tech-5-places/configurateur.html` → `BAKHw0AhiAiKUKVAhBi` |

  5 座产品 `product` 的 mtc 带 **`_slash_0P3RAN`**，其 `impact` cat256 仅 `0P3RAN`（implied）且 `2P3RAN` 在 `impossibles`；7 座产品 cat256 两者皆可。**cat256 `0P3RAN`(5 座)/`2P3RAN`(7 座) → 派生规格 `PT1691`「nombre de places」= `PT1691_5`/`PT1691_7`**（label.fr 逐字「5」「7」）。配法：`/c/<BASE>/A` → `impact[VersionId].possibles[].next` → 该节点 `impact[256].possibles[].next` → 读 `PT1691` implied + `confOptimum[0].value`。**7 座 = 目录 PVC，5 座 = PVC − 500**（thermique 4 版本 + E-Tech 2 版本差额一致）。**必须拆成两行、车系名带座位数**（`GRAND KANGOO 5 places`/`GRAND KANGOO 7 places`，E-Tech 同理）——只取 pricelist PVC 会整条漏掉 5 座产品线（2026-11-11 首采 94 行即此错）。⚠ pres `equipementsPresentation` 把 `2P3RAN` 装备原文标为「**configuration 5 places**」（官网原文如此，易误读），座位数一律以派生 `PT1691` 与官网 5/7 places 入口为准；`0P3RAN` 装备原文「sans 2 sièges en rang 3」。
- **⚠ confOptimum ≠ PVC（别拿实时配置价当目录 MSRP）**：`/c/<BASE>/A` 及各 `next` 节点的 `confOptimum[0].value`(`@type:minPrice`) 是**当前配置实时价**，未勾选的标准件会少算（实测 Trafic 版本节点 = PVC − 1500、Espace esprit Alpine = PVC − 1000；Grand Kangoo 7 座与 Espace techno/iconic 恰好相等）。**目录 MSRP 一律取 `pricelist` 的 PVC**，配置节点只用来核**座位差额**，且差额须与官网价格页独立对齐。
- **⚠ 官网价格页两套价（5 座 vs 7 座）**：`prix-versions.html` 的 Schema.org `schema:priceSpecification.schema.priceType:"SRP"` 与 APP_STATE `startingPrice` = **5 座最低价**；可见 headline「à partir de」/ `webDisplayPrices.displayPrice` / `minPriceWithoutBonus` = **7 座价**（Grand Kangoo 实测 SRP 32 500/34 000、E-Tech 41 000/42 500 对 displayPrice 33 000/34 500、41 500/43 000，差 500）。APP_STATE 里 `startingPrice` 与 `pricedVersion` 同属一个 spec 对象，**须向后就近配对**（向前找会串到别的版本）；5 座入口产品自身 `confOptimum.minPrice` 亦等于 SRP，可作第三路核对。
- **★ 座位维度全车系复检结论（19 车系逐个跑配置器，2026-11-13）**：**Espace** 5/7 座**已写进版本名**（`techno 5PL …`/`techno 7PL …`，cat256 `0SE3R`/`2SE3R`）→ 6 行不拆；**Trafic passenger** 8 座与 9 座**同价**（`PT1691_8`/`PT1691_9` 两节点 confOptimum 相同；+700 是 `PT1262_5`、+500 是 cat264 `PALAW` 侧滑门，均属选装非座位）→ 10 行不拆，spaceClass 固定 8 座；**Trafic Escapade** 固定 7 座（`3P3RAN` implied）；**短 Kangoo / Kangoo E-Tech** `2P3RAN` 在 impossibles → 仅 5 座；**Twingo** 4 座（`PT1691_4`）；其余乘用车固定 5 座。判座位看 **`PT1691`**，别拿 cat257（`ESPGRL`/`ESPHSA` 等内饰/装备码）当座位维度。
- **★ 年款（与 ES 集团法相反！）**：FR 版本名末缀即 millésime `- 26`/`- 26b`→2026、`- 27`→2027（pres label.fr 逐字含后缀，Kangoo trim 组名亦带「- 26」，26b=年中二次批次）。**`c2gMillesime` 在 FR 是冻结于上市年的产品程序代号，非现售年款**（Megane/Scenic/Austral/Espace/Rafale=2021、Kangoo/Trafic=2020、R5=2024），勿套 ES 集团段「c2gMillesime→年款」；版权年 `© Renault 2017-2026` 排除。Rafale `hypnotic … 300 ch` 无后缀→官网无年款。
- **坑（边界）**：① **T3E** série limitée「1 980 exemplaires」预告，`modelData:{"engines":[]}` 无 pricedVersion/modelURI→`官网无价格`/BEV/官网无年款；② **SpaceNomad** JSON-LD `price:"undefined"`、TC2 product 404、`mtc=EA1`→400 `Specification EA1 in mtc EA1 is unknown.`、configurateur/brochure 404→`未核实`/Diesel(Blue dCi)/官网无年款；③ **MOBILIZE DUO** 属 Mobilize 品牌（mobilize.fr 仅 old-models 库存）→不入 Renault 表。
- **会话级值**：BASE / VECxxx_FRAN / mtc 现取勿复用。
- **实测**：2026-11-11 首采；2026-11-13 打开配置器逐座位配置 + 19 车系全量复检刷新
- **来源**：`https://www.renault.fr`（APP_STATE）；`https://fr.co.rplug.renault.com/pricelist/<BASE>`(PVC)；`/pres/<BASE>`(版本名)；`/category/<BASE>`(燃油/在售集)；`/c/<BASE>/A` 及 `impact[].possibles[].next`(座位配置节点)；`https://www.renault.fr/vehicules-particuliers/grand-kangoo/pre-configurateur-thermique.html`、`…/pre-configurateur-e-tech.html`(座位选择步)；`…/grand-kangoo-5-places/configurateur.html`、`…/grand-kangoo/configurateur.html`、`https://www.renault.fr/vehicules-electriques/grand-kangoo-e-tech-5-places/configurateur.html`、`…/grand-kangoo-e-tech/configurateur.html`(5/7 座配置器)；`…/grand-kangoo/prix-versions.html`、`…/grand-kangoo-e-tech/prix-versions.html`(Schema.org SRP / startingPrice)
- **原文**：`"priceType":"PVCBONADOBE"`；`à partir de 15 870 €`；`evolution TCe 115 ch - 26`；`"price":"undefined"`；`Specification EA1 in mtc EA1 is unknown.`；`étape 2 - sélectionner le nombre de places`；`GRAND KANGOO ESSENCE OU DIESEL`；`GRAND KANGOO E-TECH ÉLECTRIQUE`；`configurer en version 5 places`；`configurer en version 7 places`；`"label":{"fr":"nombre de places"},"key":"PT1691"` → `"label":{"fr":"5"},"key":"PT1691_5"` / `"label":{"fr":"7"},"key":"PT1691_7"`；`"specCode":"0P3RAN"` / `"specCode":"2P3RAN"`；`sans 2 sièges en rang 3`；`configuration 5 places`（2P3RAN 装备原文）；`"schema:price":"32500.0","schema:priceType":"SRP"`；`"startingPrice":36100` / `"webDisplayPrices":{"displayPrice":36600,"minPriceWithoutBonus":36600}`；车型卡 `places` → `5 ou 7`；`En configuration 5 places, profitez d'un volume de coffre augmenté de 840 L.`；`Tous les passagers profitent d'un confort optimal grâce aux 7 sièges individuels`；`le ludospace familial 7 à 5 places`
- **交付结果**：`Renault_FR_官网价_20261113.xlsx`，**102 条 / 21 个车系名**（19 车系，Grand Kangoo 汽/电各拆 5 places + 7 places）；19 490–63 550 €；BEV 30·HEV 23·Diesel 24·Gasoline 14·Dual Fuel 8·PHEV 3；2026 83·2027 16·官网无年款 3；T3E 官网无价格、SpaceNomad 未核实、Duo 未纳入。首采 `Renault_FR_官网价_20261111.xlsx`（94 条 / 19 车系）漏 Grand Kangoo 5 座产品线，已被本表取代。⚠ 首采另有 7 行 Eco-G 燃油误标「未标注」，根因是 `write_xlsx.js` 的 `fuelClass` 把 `fuel+版本名` 拼接后重判、链里缺双燃料规则（`verify_xlsx.js` 复用同一函数故三道闸自证通过）；2026-11-13 已在混动链前补 `Dual Fuel` 优先判定修复。

---

### Lexus（FR 法国 `www.lexus.fr`：**curl 403（Akamai），真浏览器可开；价格走 TME `cocadap/.../comparegradespecsv2/<model UUID>`，变体价一次拿全**）✅

- **可达性**：`curl`（含 UA / `--ssl-no-revoke`）对 `/` 与 `/robots.txt` 均 **403 `Access Denied`（errors.edgesuite.net）**；browser MCP 正常（实测 2026-11-13）。
- **★ 车型全集（7）**：`/modeles` 写「6 modèles disponibles」= LBX / UX / RZ / NX / RX / LM，另有 **NOUVELLE ES « DISPONIBLE A LA COMMANDE »**（可订，计入）→ 共 7 个车系。**TZ** 写 `TZ PREMIÈRE MONDIALE DISPONIBLE EN 2027`，未来车型、无价 → 不入表。`/modeles/tz-world-premiere` 仅有预告。
- **★ 车型 UUID（现取，勿复用）**：在任一配置器页读 `window.dxp.settings.modelMap` → `model.id`。2026-11-13 实测：LBX `380ca8ce-45ad-40ba-b3a6-6f6389a12c14`、UX `e327f097-aecf-4ea7-92d1-de76664cdc18`、NX `0323fb5f-9bfa-4c22-92ac-fb637f84c451`、RZ `d8ec0864-e0cb-4f08-9e8a-1261ee3b2d22`、RX `ac7ecf2e-0f39-4e44-86b2-9db3e1ce6577`、ES `82bb35a9-e41e-4809-bca8-2be543ec22a3`、LM `4aa28d74-388f-49f2-9fd1-2d7366107901`。
- **★ 取价主源**：`GET https://cocadap.toyota-europe.com/lexus/fr/fr/comparegradespecsv2/<model UUID>`。有 `submodels` 的车型（UX/NX/RZ/ES/LM）走 `submodels[].grades[].bodyTypes[].engines[].transmissions[].wheeldrives[].from.list`；无 `submodels` 的（LBX/RX）走 `grades[].bodyTypes[]...from.list`。**22 条 `from.list` 全部 == `from.listWithDiscount`（无折扣）**；`default` 含金属漆 +1 200 €，**取 `from` 才是裸车起价**。
- **★ 价格口径**：配置器摘要写 `Prix TTC` / `Prix de base`；不含选装（选装/车漆/轮毂另加）。官网未在配置器标注是否含 frais d'immatriculation / mise à la route，交付说明不得推断。
- **车型/版本数（2026-11-13）**：LBX 5（Match Point / Elegant / Relax / Cool / Vibrant Edition）· UX 3（UX 300h 2WD Pack / F SPORT Design / Executive）· NX 4（350h 2WD × Match Point/Executive；450h+ 4WD × Match Point/Executive）· RZ 3（350e Luxe / 500e Executive / 550e F SPORT）· RX 3（450h+ Luxe / F SPORT Design / Executive）· ES 2（300h Luxe / 350e Luxe）· LM 2（350h AWD Executive 7 places / 4 places）。
- **⚠ NX 手册另有库存版**：官方 NX MY26 手册列 `Pack / Pack Business / Luxe / Luxe Plus / F SPORT Executive`，脚注 `*NX Pack, Pack Business, Luxe, Luxe Plus, et F SPORT Executive dans la limite des stocks disponibles`；这些版本**不在在线配置器、手册也不标价** → 无官方变体价，不纳入；在线可配仅 Executive / Match Point。
- **燃油**：LBX/UX/NX 350h/LM `Hybride auto-rechargeable` = HEV；NX 450h+ / RX 450h+ = PHEV；RZ / ES 350e = BEV（ES 配置器逐字 `ELECTRIQUE 4X2 100% Electrique (224 ch), 1AT`；ES 300h 为 `HYBRIDE`）。
- **★ 年款**：LBX/UX 取金融方案脚注 `Lexus LBX Match Point MY26` / `Lexus UX 300h Pack MY26`；NX 取手册封面逐字 `MY26` + 方案脚注 `NX 350h Hybride Match Point MY26`、`NX 450h+ Hybride Rechargeable Match Point MY26`；RZ/RX/ES 取车型页 JSON-LD `vehicleModelDate`（RZ 2026、RX 2027、ES 2026）；**LM 全部位置无 MY**（手册全文无 MY，`vehicleModelDate` 缺失，手册文件名 MY26 仅旁证不采信）→ `官网无年款`。⚠ RX/RZ 手册文件名为 MY27，但内文未印 MY；RZ 页 JSON-LD 为 2026（与文件名冲突，按 JSON-LD），RX 页 JSON-LD 为 2027（与文件名一致）。
- **交付结果**：`Lexus_FR_官网价_20261113.xlsx`，**22 条 / 7 车系**，36 700–155 000 €；燃油 HEV 13 · PHEV 5 · BEV 4；年款 MY26 12 · 2026 5 · 2027 3 · 官网无年款 2。
- **实测**：2026-11-13
- **来源**：`https://www.lexus.fr/modeles`；`https://www.lexus.fr/modeles/{lbx,ux,nx,rz,rx,es,lm}/build`；`https://cocadap.toyota-europe.com/lexus/fr/fr/comparegradespecsv2/<model UUID>`；金融方案 `https://www.lexus.fr/offres/particuliers/{lbx,ux-hybride,nx-hybride,nx-hybride-rechargeable}`；手册 `Brochure-Lexus-NX-MY26-Octobre-2026.pdf`（封面 `MY26`）、`Brochure-Lexus-LM-MY26-janvier-2026.pdf`（内文无 MY）
- **原文**：`(1) Exemple pour un Lexus LBX Match Point MY26 neuf commandé en LLD* ...`；`Modèle présenté : Lexus LBX Match Point MY26 avec peinture métallisée.`；`(11) Exemple pour un Lexus UX 300h Pack MY26 neuf ...`；`Modèle présenté : Lexus UX 300h Executive MY26.`；`MY26`（NX 手册封面）；`(1) Exemple pour un Lexus NX 350h Hybride Match Point MY26 neuf ...`；`"vehicleModelDate": "2027"`（RX）；`"vehicleModelDate": "2026"`（RZ）；`"vehicleModelDate": "2026"`（ES）；NX 手册 `*NX Pack, Pack Business, Luxe, Luxe Plus, et F SPORT Executive dans la limite des stocks disponibles`

---

### Lotus（FR 法国 `www.lotuscars.com/fr-FR`：**curl 200 无 WAF；官方定价 API `ruler/pricing/<MODEL>/FR/<MHP_CODE>` 的 `retailPrice` 才是未折扣 MSRP，车型页卡片价可能是促销展示价**）✅

- **可达性**：`curl` 直通（200，CloudFront + Sitecore JWS + Vue SSR），无需浏览器；配置器是 SPA，但定价是独立 GET API，可直接 curl（2026-11-16 实测）。
- **★ 车型全集（5）**：`/fr-FR` 与产品树 `/products/products/FR` 双证 —— **Eletre X**（PHEV，2 版）· **Eletre**（BEV，6 版）· **Emeya**（BEV，5 版）· **Emira**（Gasoline，6 版）· **Evija**（BEV，1 版，官网无价）。Emira GT4 / Evija X 是赛道车，不在产品树与定价 API，不入表。
- **★ 变体码（产品树 `productAlternatives[].config` 里的 `MHP_*`，`meta.filterName` 是官方名）**：
  - ELETRE 模型下同时含 Eletre X 与 Eletre：`MHP_ELETRE_X_H550` / `MHP_ELETRE_X_H1000` / `MHP_ELETRE_600` / `MHP_ELETRE_600_GT` / `MHP_ELETRE_600_GT_SE` / `MHP_ELETRE_600_SPORT_SE` / `MHP_ELETRE_900_SPORT` / `MHP_ELETRE_900_SPORT_CARBON`
  - `MHP_EMEYA_600_GT` / `MHP_EMEYA_600_GT_SE` / `MHP_EMEYA_600_SPORT_SE` / `MHP_EMEYA_900_SPORT` / `MHP_EMEYA_900_SPORT_CARBON`
  - `MHP_EMIRA_420SPORT` / `MHP_EMIRA_TURBO` / `MHP_EMIRA_TURBO_SE` / `MHP_EMIRA_LINE`（Emira Turbo SE Racing Line）/ `MHP_EMIRA_V6SE` / `MHP_EMIRA_V6LINE`（Emira V6 SE Racing Line）
  - `MHP_EVIJA`（定价 API 返回空 body → 无价）
- **★ 取价主源**：`GET https://configurator.prd.configurator.eu.lotuscars.com/ruler/pricing/<MODEL>/FR/<MHP_CODE>` → `{"currency":"EUR","retailPrice":N,...}`。**采 `retailPrice`（未折扣零售价）**。
- **⚠ Emeya 车型页卡片价是促销展示价**：`/fr-FR/emeya/models` 卡片写 106 490 / 115 290 / 128 090 / 143 790 / 158 590，但定价 API `retailPrice` 分别 109 690 / 118 690 / 131 890 / 147 990 / 163 090（统一 +3 200）；同页 LLD 脚注也写 `tarif constructeur de 109 690,00 €` → **以 API 为准**。Eletre 卡片价与 API 完全一致（101 590…163 090）。
- **★ 价格口径**：定价 API `retailPrice`（EUR），为法国配置器零售价；官网未在配置器逐条标注 TTC/HT 或 frais d'immatriculation，交付说明不推断。Eletre X 是 `hybride rechargeable X-Hybrid`（70 kWh 电池、300 km 电动续航）→ **PHEV**。
- **年款**：产品树 `/products/products/FR`、定价 API、车型页正文均无 `MY` / `millésime` / `modelYear`；页面图片 alt 含 `MY26`（如 `Eletre_MY26_600_900_series_hero_mobile.webp`）但属资源文件名，按规则仅作旁证、不采信 → 全部「官网无年款」。
- **燃油**：Eletre X = PHEV；Eletre / Emeya / Evija = BEV；Emira = Gasoline（Turbo 2.0T / V6）。
- **交付结果**：`Lotus_FR_官网价_20261116.xlsx`，**20 条 / 5 车系**（Eletre X 2 · Eletre 6 · Emeya 5 · Emira 6 · Evija 1），97 990–163 090 € + Evija `官网无价格`；燃油 PHEV 2 · BEV 12 · Gasoline 6。
- **实测**：2026-11-16
- **来源**：`https://www.lotuscars.com/fr-FR`；`https://www.lotuscars.com/fr-FR/{eletre-x,eletre,emeya,emira,evija}/models`；`https://configurator.prd.configurator.eu.lotuscars.com/products/products/FR`；`https://configurator.prd.configurator.eu.lotuscars.com/ruler/pricing/<MODEL>/FR/<MHP_CODE>`
- **原文**：`Disponible à partir de 101 590 €`；`Eletre X H550 Hybride à partir de 990 € par mois`；`Exemple pour une Lotus – Emeya 600 GT au tarif constructeur de 109 690,00 €`；`{"currency":"EUR","wholeSalePrice":109690,"retailPrice":109690,"transferPrice":109690}`；`Le groupe motopropulseur hybride rechargeable X-Hybrid de 1 974 cm³`；`La Lotus Evija n'a pas encore d'homologation européenne.`

---

### Leapmotor（FR 法国 `www.leapmotor.net/fr-fr`：**curl TLS reset，真浏览器可开；Next.js offers payload 的 `originalPrice` 才是目录价，页面 « Prix promotionnel » 是扣 CEE/prime 后的促销价**）✅

- **可达性**：`curl --ssl-no-revoke` 对 `www.leapmotor.net/fr-fr` **TLS 连接被 reset**（Recv failure: Connection was reset），browser MCP 正常（2026-11-16）。
- **★ 车型全集（7 在售）**：T03 · B03X · B05 · B10 · B10 e-Hybrid · C10 · C10 e-Hybrid。**B03**（NOUVELLE B03）只有 « Tenez-moi informé »，未开售、无价 → 不入表；`c10-promax-awd` 菜单项是 404，AWD 实际是 C10 的一个 trim，不单独建车系。
- **★ 价格源（Next.js RSC payload）**：每个车型页的 `OffersCarouselView` 里嵌 `product:{promoPrice, originalPrice, monthlyPrice, name, line, colorName}`。**`originalPrice` = 目录价/建议价；`promoPrice` = 扣 CEE / prime 后的促销价**。页面 hero 的 « à partir de » 与 « Prix promotionnel » 都是促销口径，**不采**。例：B10 Life-Pro `originalPrice 32 400 €` vs `promoPrice 27 750 €`；C10 e-Hybrid Life `originalPrice 39 900 €` vs hero « à partir de 34 380 € »。
- **★ 版本命名**：`product.line` 为 `Life - Pro` / `Life - ProMax` / `Design - ProMax` / `Life - Technologie e-Hybrid` 等；主表按 `{车系} {line 原文}` 拼接（空格替代 `-`），如 `B10 Life Pro`、`B10 Life Technologie e-Hybrid`。
- **交付版本/价（originalPrice，2026-11-16）**：T03 1 条 19 800；B03X 3 条 25 400 / 27 900 / 28 900；B05 3 条 27 400 / 29 900 / 30 900；B10 3 条 29 900 / 32 400 / 33 400；B10 e-Hybrid 2 条 32 400 / 33 400；C10 2 条 42 400 / 44 900；C10 e-Hybrid 2 条 39 900 / 39 900。
- **燃油**：T03 / B03X / B05 / B10 / C10 = BEV；**B10 e-Hybrid / C10 e-Hybrid = REEV** —— 官网逐字 `prolongateur d'autonomie`（range extender），不是普通 PHEV。
- **年款**：Next.js payload、车型页与 offers 数据均无 `modelYear` / `millésime` / `MY`；只有价格生效日 `Tarif conseillé au 12/10/2026`；C10 e-Hybrid 的 DAM 库名 `c10-my27` 是素材路径，按规则仅旁证、不采信 → 全部「官网无年款」。
- **交付结果**：`Leapmotor_FR_官网价_20261116.xlsx`，**16 条 / 7 车系**；19 800–44 900 €；BEV 13 · REEV 3。
- **实测**：2026-11-16
- **来源**：`https://www.leapmotor.net/fr-fr/modeles/{t03,b03x,b05,b10,b10-ehybrid,c10,c10-ehybrid}`（Next.js payload）；`https://www.leapmotor.net/fr-fr/autres-produits/offres/offres-pour-les-particuliers`
- **原文**：`"product":{"promoPrice":"27,750.00 €*","originalPrice":"32,400.00 €","monthlyPrice":"299.00 €**","name":"B10","line":"Life - ProMax"}`；`Tarif conseillé au 12/10/2026. Offre soumise à conditions...`；`Le B10 e-Hybrid incarne parfaitement la mobilité, en alliant électricité et prolongateur d'autonomie.`

---

### Lynk & Co（FR 法国 `me.lynkco.com/fr-fr`：**curl 200；BuyPrices GraphQL 只给 Core 起价，More 价取官方新闻稿；01/02/08 各有 Core/More 两档**）✅

- **可达性**：`curl` 直通 200（Sitecore JSS + React）；页面正文的 `{buyPrice:01-personal}` / `{leasePrice:...}` 占位符不渲染（POST `cd.web.lynkco.biz/api/lynkco-global-portal` 在浏览器内被拦，页面显示空 €）。
- **★ 车型全集（3 车系 × 2 档 = 6）**：`/fr-fr/configure` 与 `/fr-fr/cars/{01,02,08}/specifications` 一致 —— **Lynk & Co 01**（PHEV，261 ch，75 km EV，Core/More）· **Lynk & Co 02**（BEV，445 km，Core/More）· **Lynk & Co 08**（PHEV，200 km EV，Core/More）。
- **★ Core 起价（官方 GraphQL）**：`POST https://cd.web.lynkco.biz/api/lynkco-global-portal?sc_apikey=%7B342919CF-C890-4E9B-AA3B-0FEFAE0F95F1%7D&sc_lang=fr-fr`，query `buyPriceQuery`，rootItem `/sitecore/content/lynkco-global-portal/Global Setting/BuyPrices/BuyPrices`，字段 `model01personal` / `model02personal` / `model08personal`。返回：**01 Core = 41 495 · 02 Core = 35 995 · 08 Core = 53 995**（EUR；business 为空）。**该字段只到车型起价（Core），不含 More**。
- **★ More 价（官方新闻稿/站点）**：01 More = **45 495**（官方法国新闻稿逐字 `En France, la finition Core sera disponible à partir de 41 495 €, tandis que la version More débutera à 45 495 €`）；08 More = **57 995**（官方法国新闻稿逐字 `au prix de 53 995 euros en version Core et de 57 995 euros pour la version More`）；02 More = **39 995**（官方 02 Press Kit 欧价 39 495，法国站 Core 在欧价 35 495 上 +500 为 35 995，More 同幅 39 995；官方瑞士发布与法国第三方同值 39 995）。
- **粒度**：**6 条 / 3 车系（每款 Core + More）**，官方型号名称 `Lynk & Co 01 Core` / `Lynk & Co 01 More` 等。
- **★ 年款**：**02 = MY27**（官方新闻稿逐字 `Model Year 2027 (MY27) update for the Lynk & Co 02`）；01 / 08 车型页、configure、BuyPrices 均无当前 MY，页脚仅历史链接 `01 MY 2021-2024` → 01 / 08「官网无年款」。
- **燃油**：01 / 08 = PHEV；02 = BEV。
- **交付结果**：`Lynk-Co_FR_官网价_20261116.xlsx`，**6 条 / 3 车系**；35 995–57 995 €；PHEV 4 · BEV 2；年款 MY27 2 · 官网无年款 4。
- **实测**：2026-11-16
- **来源**：`https://me.lynkco.com/fr-fr/configure`；`https://me.lynkco.com/fr-fr/cars/{01,02,08}/specifications`；`https://cd.web.lynkco.biz/api/lynkco-global-portal`（BuyPrices）；`https://press.lynkco.com/fr-FR/244335-...`（01 Core/More）；`https://press.lynkco.com/fr-FR/247261-...`（08 Core/More）；`https://press.lynkco.com/en-WW/266772-...`（02 MY27）；02 Press Kit PDF
- **原文**：`{"model01personal":{"value":"41 495"},"model02personal":{"value":"35 995"},"model08personal":{"value":"53 995"}}`；`En France, la finition Core sera disponible à partir de 41 495 €, tandis que la version More débutera à 45 495 €.`；`au prix de 53 995 euros en version Core et de 57 995 euros pour la version More`；`Model Year 2027 (MY27) update for the Lynk & Co 02`

---

### Lamborghini（FR 法国 `www.lamborghini.com/fr-en`：**官网不公布法国 MSRP；配置器 5 个车型全部入表（含 3 个官网标「未开售」的），MSRP 全填 `官网无价格`**）⚠️ 无价格出表

- **可达性**：`curl --ssl-no-revoke` 直通 200（Next.js）；配置器 `configurator.lamborghini.com` 亦 200，但为 SPA，需 `country=fr` 才有法国数据（默认按出口 IP 给 US/中文 cookie 横幅）。
- **★ 配置器车型全集（5）**：**Temerario** · **Revuelto** · **Revuelto SV** · **Urus SE** · **Urus SE Performante**。按 skill「官网列了车型但无官方价 → 填 `官网无价格`、照常出表」，5 个全部出行（5 行）；其中 Temerario / Revuelto SV / Urus SE Performante 车型页逐字 `Le véhicule n'est pas encore proposé à la vente`，交付说明标注「官网标未开售」，但**不因缺价/未开售跳过**。
- **⚠ 不在配置器、不入表**：Temerario Tettonero Capsule / Revuelto Miura 60° Homage 是特别版/one-off；Countach LPI 800-4 / Sian / Fenomeno 属 few-off 已售罄；Asterion / Estoque / Terzo Millennio 是概念车。
- **★ 价格结论：官网不公布**。三类证据：① 车型页 JSON-LD 无 `offers` / `price` 字段；② 配置器（含 `START CONFIGURATION` → `YOUR CAR` → 结账摘要）无任何 €/EUR/amount，只有配置代码（如 `ALX7UF`）与 CO2 等级，购车 CTA 为 « Faire une demande » / `ENQUIRE`；③ 官网新闻/车型页无法国价目表。→ MSRP 全填 `官网无价格`，不拿意大利/英国新闻稿价或 dealer 报价冒充 FR MSRP。
- **年款**：5 个车型的配置器 `ENQUIRE` 表单均逐字给出 `2027 Lamborghini <车型> | <颜色> | <配置码>`，故全部 **2027**；Revuelto 车型页技术表另印 `MY27: 1.77 kg/CV`、`MY27: 1795 kg`、`MY27: High Specific Energy Battery with Cylindrical Cells` 作为旁证。
- **燃油**：5 款官网均标 `High Performance Electrified Vehicle (HPEV)`，V12/V8 + 三电机/电机 → **PHEV**。
- **交付结果**：`Lamborghini_FR_官网价_20261116.xlsx`，**5 条 / 5 车系**，MSRP 全 `官网无价格`；年款 2027 ×5；燃油 PHEV 5。
- **实测**：2026-11-16
- **来源**：`https://configurator.lamborghini.com/configurator/model/{32007-20111/MBV-20007-2027,32006-20111/MBV-21707-2027,32006-20111/MBV-21717-2027,32005-20111/MBV-24717-2027,32005-20111/MBV-24727-2027}?country=fr`（ENQUIRE 表单）；`https://www.lamborghini.com/fr-en/modèles/{temerario-modèles/temerario,revuelto-modèles/revuelto,revuelto-modèles/revuelto-sv,urus/urus-se,urus/urus-se-performante}`
- **原文**：`2027 Lamborghini Temerario | Giallo | ALWNAW`；`2027 Lamborghini Revuelto | Arancio Apodis | ALYFVY`；`2027 Lamborghini Revuelto SV | Azzurro Thetys | ALSFIS`；`2027 Lamborghini URUS SE | Arancio Egon | ALX7UF`；`2027 Lamborghini URUS SE Performante | Giallo Crius | ALL2UO`；`Le véhicule n'est pas encore proposé à la vente. Par conséquent, il n'est pas soumis à la directive 1999/94/CE.`
