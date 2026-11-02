# 法国 FR — 站点坑位详段

> 市场码 FR · 2 段 · 品牌：Citroën / Mitsubishi
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-10-30 · 文中 snapshotVersion / token / 车型 id 均为当时实测值，必须现取

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
