# 比利时 BE — 站点坑位详段

> 市场码 BE · 11 段 · 品牌：CUPRA / KGM / KG Mobility / Citroën / Škoda / Volvo / SEAT / Hyundai / Mitsubishi / MG / Maxus
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-10-30 · 文中 snapshotVersion / token / 车型 id 均为当时实测值，必须现取

---

### CUPRA（BE 比利时）

> 完整坑位见下方详段「CUPRA（BE 比利时 `www.cupra.be/fr`：完全可访问…）✅」。核心：`api.cupra.be/v1/car-configurator/choices/<CARLINE>` 无鉴权，取 `engine.price`、**不取 `priceWithReduction`**，年款在 `engine.model_year`。

---

### KGM / KG Mobility（BE 比利时 `www.kgm.be`：完全开放，Next.js `__NEXT_DATA__` 直读）✅

> KG Mobility（原双龙 SsangYong）比利时站。**全站零封锁**，是近期最省力的站点之一。

| 项 | 内容 |
|---|---|
| **建站** | Vercel + Next.js + Storyblok CMS；`robots.txt` 200 `Allow: /`，Nuxt/Next 双通道均无 WAF |
| **可访问性** | ✅ curl 直连 200，无需 Playwright、无需代理 |
| **车系 URL** | `https://www.kgm.be/nl/configurator/<slug>`（`/nl/modellen/<slug>` 同源） |
| **12 个 slug** | `actyon`, `actyon-hybrid`, `grand-musso`, `korando`, `musso`, `musso-ev`, `rexton`, `tivoli`, `torres`, `torres-evx`, `torres-evx-van`, `torres-hybrid` |
| **★ 真源** | 配置器页 HTML 内嵌 `<script id="__NEXT_DATA__" type="application/json">...</script>` |
| **真源路径** | `props.pageProps.story.content.configurationInfo.configurations[]` |
| **★ 价格字段** | `configurations[].listPrice.priceInclVat` = **官方未折扣目录价（含税）** ← 采这个 |
| **勿采字段** | `previousStartingPrice`、`discounts[]`、`ecobon`、`takeoverPremium`、页面 `Vanaf €`（均为折后/补贴价） |
| **价格口径实证** | Actyon：`48.990 − 2.000(Korting) − 500(Overnamepremie) = 46.490` = 页面 "Vanaf €" ✓，确认 `listPrice` 才是目录价 |
| **车型展示名** | `content.model.name`（官网原文：`Actyon 4x4`、`Torres 4x4`、`Musso EV`、`Grand Musso`）——**勿用 slug 大写推断**（会得到 `ACTYON 4X4`） |
| **型号名组成** | `modelEdition.name`（去年份）+ `engine.fuelType.label` + `engine.wheelDrive.label` + `engine.transmission.label` + `{horsePower} pk` |
| **★ 年款** | 取 `modelEdition.name` 里的 `20\d{2}` → `MY2024` / `MY2025` / `MY2026`；**musso-ev 版名无年份** → 按规则写「官网无年款」 |
| **马力必须并入** | Korando `Platinum Benzine 2WD Manueel` 的 **149 pk 与 163 pk 同为 34.490**，不并马力会被误去重（54 → 52）。并入 `149 pk` / `163 pk` 后零丢失 |
| **其它 API** | `GET /api/configurator/options?modelUuid=<uuid>&locale=nl` 返回版本-选装映射，**不含价格**，抓价格无用 |
| **buildId** | `ALetL--VJqG7Ars8vePHx` |
| **无公开 PDF** | Brochure/CO2 页均为表单申请制（Bynder DAM 后置），无价目 PDF，不要去找 |
| **交付结果** | **54 条 / 12 车系**（2026-09-30） |

**关键代码骨架**：

```python
import re, json, html as H
h = open('configurator.html', encoding='utf-8', errors='ignore').read()
m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', h, re.S)
data = json.loads(H.unescape(m.group(1)))
cfgs = data['props']['pageProps']['story']['content']['configurationInfo']['configurations']
for cf in cfgs:
    incl = (cf.get('listPrice') or {}).get('priceInclVat')   # ★ 目录价，未折扣
    ed   = (cf.get('modelEdition') or {}).get('name') or ''
    ym   = re.search(r'\b(20\d{2})\b', ed)
    year = f'MY{ym.group(1)}' if ym else '官网无年款'
    ed_clean = re.sub(r'\s*\b20\d{2}\b\s*', ' ', ed).strip()
    eng = cf.get('engine') or {}
    parts = [ed_clean,
             (eng.get('fuelType') or {}).get('label'),
             (eng.get('wheelDrive') or {}).get('label'),
             (eng.get('transmission') or {}).get('label')]
    name = ' '.join(x for x in parts if x)
    if eng.get('horsePower'):
        name += f" {eng['horsePower']} pk"
```

**车系分布（54 条）**：Actyon 4x4 1 / Actyon Hybrid 2 / Grand Musso 3 / Korando 10 / Musso 3 / Musso EV 8 / Rexton 3 / Tivoli 10 / Torres 4x4 3 / Torres EVX 6 / Torres EVX Van 1 / Torres Hybrid 4

**样例**：
```
KGM;Actyon 4x4;Actyon Titanium Benzine 4WD Automaat 163 pk;MY2024;48.990;否;20260930
KGM;Tivoli;Tivoli Street Series Benzine 2WD Manueel 163 pk;MY2026;21.990;否;20260930
KGM;Musso EV;Musso EV Bronze Elektrisch 2WD Automaat 207 pk;官网无年款;44.490;否;20260930
```

---

### Citroën（BE 比利时 `www.citroen.be/nl`：Akamai 全域封 curl，但 sccf 静态价格库可直接读）✅

> Stellantis 系。**这是 Stellantis 系里目前唯一完整拿下全量配置价格的市场**——关键是找到了 `sccf` 静态价格库。
> 同集团 Abarth ES 曾因进不去 Omnichannel SPA 只能取车系级 `cataloguePrice`，**本站可下钻到每一个配置**。

| 项 | 内容 |
|---|---|
| **Akamai** | `robots.txt` 403、`curl` 403、`WebFetch` 403（`errors.edgesuite.net`）；**headed Playwright ✅ 200** |
| **★ 关键突破** | **页面内 `await fetch(url)` 不受 Akamai 拦截** —— 任何站内 URL 都能这样拿。打开任一配置器页，在 `pg.evaluate` 里 `fetch` 即可 |
| **配置器入口** | `https://www.citroen.be/nl/omni/configurator/#/?derivedModelCode=VP1CSCA5&grBodyStyle=SILHOU5P&vehicleType=VP`（`derivedModelCode` 来自首页卡片的 `data-vehicle-bbc`/配置器菜单） |
| **★ 真源（sccf 静态库）** | 三步：<br>① `GET /sccf/prod/citroen/publish/data/sccf/scope/3104HCC.json` → `comMods[].nsbpath` + `comMods[].mvss[]`（**versionId → 官方描述**，共 367 条）<br>② `GET /sccf/prod/citroen/publish/data/sccf<nsbpath>/NPE_STANDARD_3104HCC_<CODE>.json`（**每车系一个，全量配置**）<br>③ 取 `priceFragment.vehicles[].getPriceExtendedB2C` |
| **★ 价格字段** | `getPriceExtendedB2C` → `price.vehicle.prices[]`，筛 `priceType == "cataloguePrice"` → **`withTaxesAndFees`**（含税目录价，采这个）<br>勿采 `eStorePrice`（折后电商价，官网页面显示的就是它） |
| **★ 折扣陷阱（2026-09-30 实证）** | `cataloguePrice.withTaxesAndFees − eStorePrice.withTaxesAndFees` **恒等于 `eStorePrice.discounts[].withTaxes` 之和** —— 即差额是**实打实的线上折扣**，不是口径差：<br>· Ami 全 6 版 差 `10,00` ↔ `discounts=[{withTaxes:10.0}]`<br>· C3 燃油/混动版 差 `150,00` ↔ `discounts=[{withTaxes:150.0}]`<br>· ë-C3 纯电版 差 `0,00` ↔ `discounts=[{withTaxes:0.0}]`<br>→ **故 `cataloguePrice` = 未折扣 MSRP，符合采集规则**；官网 \"Vanaf € 8.489,99\" 是折后价（页脚注明*\"prijzen geldig tot het einde van de huidige maand\"*当前月度有效） |
| **⚠️ 勿误判为口径差** | 曾一度把差额解释成「B2C eStorePrice（基础配置价）vs cataloguePrice（全配置目录价）的口径差」，**已证伪**：差额与 `discounts` 字段逐一吻合，纯折扣 |
| **versionId → 描述** | scope 的 `comMods[].mvss[]` 里 `{code: versionId, desc: "C3 Hybrid 110 pk Automatic MAX"}` |
| **HTML 实体** | desc 里 `S&amp;amp;amp;S` 是**三重转义** → 循环 `html.unescape()` 4 次还原为 `S&S` |
| **年款** | 官网不标 MY → **全部写「官网无年款」** |
| **车系拆分** | 官网 gamma 页把电动版列**独立卡片**（C3 / ë-C3、C4 / ë-C4、C4 X / ë-C4 X、C5 Aircross / ë-C5 Aircross、C3 Aircross / ë-C3 Aircross）→ 依据 desc 的 `ë-` 前缀拆分车系 |
| **15 个 sccf 配置组** | `QNEW_AMI`(6) `VP1CSCA5`(19) `VPAC0101`(20) `VP__1CLE`(11) `VP1CLPA4`(9) `VP1CRESY`(14) `CV2CX250`(156) `eBerling`(21) `K0_SPAVP`(10) `K0_COMBI`(3) `K0_OMQD0`(2) `CV002CK0`(51) `CV002CK9`(31) `K9_MPVAC`(4) `VU1CSCK0`(1) |
| **★ 车系名权威来源** | **`scope.comMods[].desc`** 就是官网车系名（形如 `(ë-)C3` / `New (ë-)C5 Aircross` / `Berlingo Van` / `(ë)-C3 Aircross`）→ **勿用 desc 切首词猜**（会切出 `New` / `SPECIALE` 等假车系名） |
| **车系拆分规则** | 官网 gamma 页电动版列独立卡片 → 依 desc 的 `ë-`/`e-` 前缀拆成 `ë-` 组；但商用 van 特殊：`ë-Berlingo Van` 独立于 `Berlingo Van`，`ë-Jumpy Combi` 独立于 `Jumpy Combi`，`VU1CSCK0` 为 `ë-C3 Van`（1 条） |
| **★ 同名不同价陷阱** | 存在 **2 条同名不同价** 的版本（`Berlingo Van MAX ... Verhoogd Laadvermogen Diesel 130pk Manueel`：`2CK91CNP4KB0A0C0`=32.619,49 / `2CK91ANP4KB0A0C0`=32.195,99）→ **不可按 desc 去重**（会丢 1 条，358→357）；**必须用 `versionId` 做主键** |
| **分组自洽校验** | 全部 `ë-`/`e-` 组必为 `BEV`，其余组为 `Diesel/Gasoline/HEV/PHEV` → **0 冲突**即分组正确（正交验证） |
| **燃油分布（2026-09-30）** | Diesel 212 / BEV 101 / HEV 27 / Gasoline 15 / PHEV 3 = **358** |
| **文件体积警示** | `CV2CX250`（Jumper）单个 **47 MB**、`CV002CK0`（Jumpy）**13.9 MB** → `resp.text()` **绝不设大小上限**，用 `fs.writeFileSync` 直接落盘 |
| **Omnichannel API 旁证** | 页面另有 `api.omnichannel.stla-aws.net/pricing/v1/vehicle`（POST，传 `version/trim/color` 返回同一结构），但**需逐配置调用**、还要 token；**不如直接读 sccf** |
| **交付结果** | **358 条 / 24 车系**（2026-09-30，8 列含燃油分类；15 个 sccf 组 → 按电动版拆出 24 个展示车系） |

**抓取骨架**：

```js
// 在已打开的配置器页里执行
const res = await pg.evaluate(async () => {
  const base = 'https://www.citroen.be/sccf/prod/citroen/publish/data/sccf';
  const out = { files: {} };
  const sc = JSON.parse(await (await fetch(base + '/scope/3104HCC.json')).text());
  out.scope = sc;
  for (const cm of sc.comMods) {
    const code = cm.nsbpath.split('/')[3];
    const url = `${base}${cm.nsbpath}/NPE_STANDARD_3104HCC_${code}.json`;
    out.files[code] = await (await fetch(url)).text();   // 47MB 也能拿
  }
  return out;
});
```

**解析骨架**：

```python
rows = json.load(open('scope.json'))['comMods']
DESC = {m['code']: m['desc'] for cm in rows for m in cm.get('mvss', [])}
for v in obj['priceFragment']['vehicles']:
    d = json.loads(v['getPriceExtendedB2C'])
    for p in d['price']['vehicle']['prices']:
        if p['priceType'] == 'cataloguePrice':
            price = p['withTaxesAndFees']       # ★ 含税目录价
    desc = DESC[v['versionId']]                 # 官方型号名
```

**车系分布（358 条）**：Jumper 156 / Jumpy 51 / Berlingo Van 35 / Berlingo 21 / C3 Aircross 14 / C5 Aircross 14 / SpaceTourer 13 / C3 10 / ë-C3 9 / AMI 6 / ë-C3 Aircross 6 / ë-C4 6 / C4 5 / ë-C4 X 5 / C4 X 4 / Holidays 2 / C3 Van 1

**样例**：
```
Citroën;C3 C4 Hybrid 110 pk Automatic YOU;官网无年款;19.689,99;否;20260930
Citroën;ë-C3;ë-C3 Electric 113 pk Urban Range PLUS;官网无年款;23.789,99;否;20260930
Citroën;AMI;Ami Rip Curl Sunset;官网无年款;9.299,99;否;20260930
```

---

### Škoda（BE 比利时 `nl.skoda.be`：配置器 API 逆出，权威目录价）

**站点结构**
- 官网 `nl.skoda.be` 车型页含三类价格模块：`derivative-introduction`（车系起价）、`DerivativeOverviewModule`（型号价）、`Trims`（配置等级名，**无价**）
- 车型页 `callToActionLinks.cta1.url` 指向配置器入口：
  `https://clg.skoda-auto.com/api/link?bid=202&bodyCode=<bc>&carLine=<cl>&culture=nl-BE&instanceName=BEL&mbv=<mbv>&modelCode=<mc>&pageGroup=Website&salesProgram=BEL&tool=CC3`
- `clg.skoda-auto.com/api/link` 是 **302 重定向服务**，真实配置器：
  `https://cc.skoda-auto.com/bel/nl-BE/start-configuration?mbvCode=...&salesGroup=...&modelcode=...&pagegroup=Website&salesprogram=BEL`

**配置器 API（从主 JS bundle 逆出）**
- 主包 `https://cc.skoda-auto.com/static/js/main.7a2e9075.js`（10.2 MB webpack）
- 逆出常量：`API_URLS_PRICE = https://cc.skoda-auto.com/c3popr`（价格服务）、`API_URLS_WEBAPI = https://cc.skoda-auto.com/c3pobe`（业务服务）

| 端点 | 用途 |
|---|---|
| `POST /c3pobe/version` | 取 `snapshotVersion`。**body `{"country":"BEL"}`（键小写、必须 ISO3）**；空 body 报 "A non-empty request body is required"；2 位 `BE` 报 "minimum length of '3'"；返回 JSON 字符串需 `JSON.parse` 两次 |
| `GET /c3pobe/WebModel/Find?culture=nl-BE&country=BEL&snapshotVersion=<sv>&modelClass=<mc>&modelYear=<year>` | **型号清单关键端点**，返回 `{models:[...]}`，每条含 `id`/`mbvCode`/`engineName`/`fuelTypeName`/`transmissionName`/`trimLineName`/`marketingName`/`trimlineId`/`carlineCode` |
| `POST /c3popr/v3/GetAllPrices` | **权威目录价**。body `{ModelId, Extras:[], ColorCode, InteriorCode, Settings:{IncludeModelPrice:true,...}, snapshotVersion, TrimlineId}` → `modelPrice.price`（**目录价 Catalogusprijs**）、`priceOriginal`、`discounts`（空数组=无折扣）、`totalPrice` |
| `POST /c3popr/v3/GetTrimlinesPrices` | ⚠️ **返回促销价（action price），不是目录价**。Fabia Family 返回 21.125 而目录价为 25.290 → **BE 禁用**（AU 市场例外：同一端点返回 MRDP，见 `sites/au.md`） |
| `POST /c3pobe/configuration/startConfiguration` | body `{appId:99,country:"BEL",culture:"nl-BE",mbvCode,salesGroup,snapshotVersion}` → `expireSuggestion.modelId`（如 `BEL;skoda;2027;PJ3DJ4;0;GYO1YO1;mda...;nl-BE;;60004;60004`） |

**调用要点（踩坑）**
- **必须在浏览器上下文内 fetch**：curl 直连报 `Invalid use - 100` / `Application error`（缺 session）。用 Playwright `pg.evaluate` 在 `cc.skoda-auto.com` 页面内执行
- **`mbv` 不唯一**：同动力同 `mbvCode` 会有多个配置等级（trim），价格不同 → **禁止用 `mbv` 做 key 对齐**，`GetAllPrices` 必须传 `TrimlineId` 区分
- **批量 evaluate 会 EPIPE 崩溃**（单次串行 370 请求 → Node 崩溃且不落盘）→ 拆成 step1（取清单）/step2（取价），**每车系独立进程、逐车系落盘**
- **`modelClass` 可能覆盖多个车系**：`NW` 同时返回 Kamiq + Scala（`carline 61003/61004`，23+23=46 行）→ 用 `marketingName` 区分，**注意去重**（重复抓取同 modelClass 会产生完全相同的文件）
- **同名 SKU 变体**：同一「车系+发动机+变速+配置等级」可能对应多个 `mbvCode`/子车系代码，价格不同（Octavia Limo `1,5 TSI 6v Man. Selection` 有 37.285 与 40.775 两条）→ 出表时用 `id` 段10/11（子车系代码）或 `mbv` 追加后缀保持唯一

**HTML 解析陷阱**
- `data-props="{&quot;...&quot;}"` 中的 `&quot;` 会让正则 `data-props="(.*?)"` **提前截断**（报 `Extra data: line 1 column 4182`）→ 必须用「配对结束引号扫描」（找后跟空格 `/` `>` 换行的引号）再 `html.unescape`
- `re.search(r'data-module="DerivativeOverviewModule"')` 会命中 **CSS 文件名** → 须严格匹配完整属性

**数据源三层次**
1. 车型页内嵌模块（3 类，见上）
2. 官方价格表 PDF（`Prijslijst`/`Verkoopsmap`，`download-file` 模块给 `https://nl.skoda.be/_doc/<uuid>`）
3. **官方配置器 API（权威源，本次采用）**

**价格表 PDF 双形态**
- 文本层可解析（6 份）：Fabia/Kamiq/Scala/Octavia/Epiq/Peaq → `pdftotext -layout` 精确解析
- 纯图片层（5 份）：Elroq/Enyaq/Enyaq Coupé/Karoq/Kodiaq（2116 张内嵌图、ToUnicode 损坏）→ 只能 OCR，且多为旧年款 → **弃用**
- PDF 页脚含版本标识（如 `MY2027 24/02/2026`）

**本次结论**
- `snapshotVersion = b430ec84-8285-4697-83a0-3782f5fa8beb`，`dataVersion = mda20260924074943`
- 全部 11 个 modelClass **均为 modelYear=2027**（探测 2024–2028 只有 2027 有数据）→ 年款统一 `MY2027`
- 配置器 14 个车系 / 324 条可用条目（312 有价 + 12 配置器无价）；价格表辅助 98 条
- 逐条校验 `modelPrice == priceOriginal` 且 `discounts == []` → 确认**均为未折扣目录价**

#### 🔁 2026-10-20 补充：**Skoda UK（`www.skoda.co.uk`）— 同一套 API，但市场码/口径都不同**

| 项 | 比利时 | **英国** |
|---|---|---|
| 市场码 | `BEL` / `nl-BE` | **`GBR` / `en-GB`**（bid=210）|
| `snapshotVersion` | `b430ec84-…` | **`eea24cd4-ea3e-486e-819b-6afce33b31ae`** |
| modelYear | 2027 | **也是 2027**（⚠ 车型页 CC3 深链写的是 `modelYear=2026`，**是旧参数，别信**；只有 2025/2026 会返回 500 `The specified blob does not exist.`）|
| **价格字段** | `modelPrice.price == priceOriginal` | **两者不等**：`priceOriginal` = 车价，`modelPrice.price` = **OTR 价**（含 `FixedOTROffset` 665 delivery+首注册 + `coTax` 455 VED）。官网 "From* £21,240" 对应的是 **`modelPrice.price`** → **英国取 `modelPrice.price`** |
| 车型页路径 | `/models/<line>/<model>` | **`/new-cars/<line>/<range>`**（`/models/<x>` 只有 Fabia 能用）|

**★ 英国 10 个 modelClass 实测（133 条 / 12 车系）**

| modelCode | 车系 | 条数 |
|---|---|---|
| `PJ` | Fabia Hatch | 16 |
| `NW` | **Kamiq + Scala 共用**（`NWK` 会 400）| 14 + 14 |
| `NU` | Karoq | 18 |
| `PS` | Kodiaq | 19 |
| `PV` | **Octavia Hatch + Estate 共用** | 13 + 13 |
| `PY` | Elroq | 7 |
| `5A` | **Enyaq + Enyaq Coupé 共用** | 7 + 4 |
| `PX` | Epiq | 3 |
| `PZ` | Peaq | 5 |

> ⚠ **modelClass 会一码多车系**（`NW` / `PV` / `5A`），必须用返回里的 `carlineName` 拆，否则 Kamiq 和 Scala 会混成一堆。
> ⚠ **车型页 URL 里的 `modelCode` 不可尽信**：Kamiq 页写 `NWK`，但 API 只认 `NW`。
> **交付**：`Skoda_UK_官网价_20261020.xlsx`，133 条，MY2027，Gasoline 67 / BEV 26 / Diesel 21 / MHEV 15 / PHEV 4，`discounts` 全为空。

---

### Volvo（BE 比利时 `volvocars.com/nl-be`：Akamai 拦 headless，必须 xvfb + headed Chromium）

**核心坑：Akamai 按 headless 指纹拦截**

| 方式 | 结果 |
|---|---|
| `curl`（任意 UA/语言） | **403 Access Denied**（Akamai `errors.edgesuite.net`） |
| Playwright **headless** | **403** |
| Playwright **headed + xvfb-run** | **200 ✅** |

```bash
xvfb-run -a --server-args="-screen 0 1600x1000x24" node script.js
```
- 必须 `headless: false`；`xvfb-run` 提供虚拟 X server（沙箱无 `$DISPLAY`）
- 配合 `--disable-blink-features=AutomationControlled` + `addInitScript` 伪装 `navigator.webdriver`
- 域名 IP 分级：`www.volvocars.com` → Akamai（23.45.12.58，封锁）；apex `volvocars.com` → nginx 301 回 www

**配置器与价格接口**

| 端点 | 说明 |
|---|---|
| `/nl-be/cars/<model>/` | 车型详情页（Next.js，`self.__next_f` flight 数据） |
| `/nl-be/build/<model>/` | **官方配置器**，含「Kies uw uitvoering」（版本）/「Kies uw niveau」（配置等级）/「Kies uw aandrijving」（动力） |
| `POST /api/order/prices` | **官方价格总表**。body `{"deployEnv":"prod","market":"nl-be","siteSlug":"nl-be","locale":"nl-BE","clientName":"pdps"}`，header `x-client-name: pdps`、`Content-Type: text/plain;charset=UTF-8`（**注意是 text/plain 不是 application/json**）；GET 返 405，空 body 返 422 |
| `GET /static/site-navigation/data/nl-be/cars-by-market-data.<hash>.json` | 官方在售车型清单（12 条，含 `modelYear`/`carType.code`/渲染图） |
| `GET /static/site-navigation/data/nl-be/cars-menu-data.<hash>.json` | 导航车型菜单 |

**`/api/order/prices` 返回结构**
```json
{ "prices": {
    "ex30-electric": {
      "cash": "€ 36.270",          // ← 车系「Vanaf」起价
      "includesTax": true,
      "modelYears": { "2027": {"cash": "€ 36.270"} },   // 按年款
      "editions": { "black-edition": {"cash": "€ 43.644"} }
} } }
```
- 覆盖 14 个 slug，但其中 `c40-electric`≡`ec40-electric`、`xc40-electric`≡`ex40-electric` 是**旧名别名**（`sourcePrefix` 指向同一实体），**须去重**
- ⚠️ **`cash` 是「Vanaf」起价，对带 Business Edition 的车系等于折扣价**（见下）

**型号名与配置等级（关键）**
- 页面 DOM 文本结构（`\u00a0` 需先归一化为普通空格）：
  ```
  Kies uw uitvoering          ← 版本区
  EX30
  Vanaf € 36.270
  EX30 Black Edition
  Vanaf € 43.644
  Kies uw niveau              ← 配置等级区
  Essential
  € 38.290
  Core
  € 39.900
  ```
- 配置等级名称不统一：`Essential / Core / Plus / Ultra`（通用）+ `Core Business Edition / Plus Business Edition / Ultra Business Edition`（EX30/EC40/EX40 专有）+ `X Launch Edition`（EX60）+ `X Limited Edition`（V60）
- 版本区与等级区**必须分段切**：等级区从 `Kies uw niveau` 起、到 `Vergelijken` 或 `Uw aandrijving` 止，否则会把车漆/选装包价格混入
- 动力区块标题两种写法：`Uw aandrijving` 与 `Kies uw aandrijving` → 正则用 `/(Kies uw|Uw) aandrijving/`；标题后第 1 项即动力名（如 `P5 Elektrisch (BEV)`、`B5 AWD Mild-hybride (MHEV)`、`T8 AWD Long range Plug-in hybride (PHEV)`、`Single Motor`）

**促销陷阱：Business Edition**

配置器免责声明原文：
> *"Prijzen incl. btw. De vermelde prijzen van de Business Editions zijn **inclusief voordeel Business Edition en premie**. Het Business Edition-aanbod is geldig voor zowel professionelen als particulieren en tot en met 31/03/2026."*

实测折扣幅度（EX30，2026-09）：Core `39.900`→`36.270`、Plus `42.600`→`38.970`、Ultra `51.850`→`47.010`（**降 3.630–4.840 €**）。
→ **Business Edition 一律剔除**，只采标准等级价；这也解释了为何 `/api/order/prices` 的 `cash`（36.270）低于配置器标准等级价（38.290）。

另有 `Tijdelijke aanbiedingen`（临时优惠横幅）与 `Geniet van ongeziene promoties`（现货促销）文案，均非 MSRP。

**年款（官网原始标记）**

| 年款 | 车型 |
|---|---|
| `MY2027` | EX30 / EX60 / EX90 / ES90 / V60 / XC90 |
| `MY2027.5` | EC40 / EX40 / XC40 / XC60 |

来自 `cars-by-market-data` 的 `carKeyExpanded.modelYear`（配置器另以 `commercialModelYear.name` 标 `2027.5`）。

**本次结论（2026-09-28，v2 补全版）**

⚠️ **重要：官方价格表 PDF 才是权威完整源，配置器 API 只显示单一动力分支，会严重漏条**（v1 仅 46 条 → v2 达 132 条）。

**官方价格表页面：`/nl-be/l/prijslijsten/`**（Prijslijsten = 价格表）
- 页面内 21 个 PDF 链接，全部托管在 **`azure-eu-assets.contentstack.com`（Contentstack CDN）→ 不受 Akamai 限制，可 `curl` 直下 ✅**
- 19 份 PDF 中：**16 份是价格表**（`prijslijst-*.pdf` / `Prijslijst_*.pdf`），3 份是宣传单（`leaflet-business-edition` / `leaflet-v60-limited-edition` / `XC60_Black_Edition_2luik_*`，均为折扣价或重复款，不采）
- 抓链接：headed Chromium 打开页面 → 收集 `a[href$=".pdf"]`；或直接读页面 HTML 里的 contentstack URL

**16 份价格表与车系/年款映射（`PDF_MAP`）**

| PDF stem | 车系 | 年款 |
|---|---|---|
| `prijslijst-ex30-cc` | EX30（含 CC / Black Edition） | MY2027 |
| `prijslijst-ex40-my27.5` | EX40 | MY2027.5 |
| `prijslijst-ex40-electric` | EX40（stock） | MY2027 |
| `prijslijst-ec40-my27.5` | EC40 | MY2027.5 |
| `prijslijst-ec40` | EC40（stock） | MY2027 |
| `prijslijst-ex60` | EX60 | MY2027 |
| `prijslijst-ex60-cross-country` | EX60 Cross Country | MY2028 |
| `prijslijst-ex90` | EX90 | MY2027.5 |
| `prijslijst-es90` | ES90 | MY2027 |
| `prijslijst-xc40-my27.5` | XC40 | MY2027.5 |
| `prijslijst-xc40-limited-edition` | XC40 Limited Edition | MY2027 |
| `prijslijst-xc60-my27.5` | XC60 | MY2027.5 |
| `Prijslijst_XC60_MY27_v2_BEnl_010426` | XC60（stock） | MY2027 |
| `prijslijst-xc90-my27.5` | XC90 | MY2027.5 |
| `Prijslijst_XC90_MY27_v2_BEnl_010426` | XC90（stock） | MY2027 |
| `prijslijst-v60` | V60 | MY2027 |

**PDF 价格矩阵结构**（`pdftotext -layout` 最干净）
- 表头：`Motoren | Overbrenging | Design | Edition | Vermogen pk/kW | CO2-uitstoot | Catalogusprijs € excl. btw | Catalogusprijs € incl. btw [| Nettoprijs* € incl. btw]`
- **取 `Catalogusprijs € incl. btw` 列**（含税目录价）；**严禁取 `Nettoprijs*` 列**
- 表格按配置等级分块：`ESSENTIAL / CORE / PLUS / ULTRA`（+ `LAUNCH EDITION` / `FIRST EDITION` 版块）

**核心坑 1：V60 的 `Nettoprijs*` 折扣列（极易取错，低报 8k+）**
```
Mild hybrid benzine  B4  7-traps DCT  Base  Limited Edition  197/145  143-156  43.247,93  52.330  38.990
                                                                        ↑excl     ↑incl    ↑Netto折扣
```
- V60 表格有**三个价格列**，`Nettoprijs* € incl. btw` 列头与 `Catalogusprijs € incl. btw` 列头**都写作 `€ incl. btw`**
- 脚注：`* Prijs inclusief kortingen`（含折扣）
- **正确价 = 中间那列 `52.330`**；配置器显示的是 `38.990` 折扣价 → 这就是 v1 低报的根因之一

**核心坑 2：列定位必须用 bbox，不能只用正则**
- `pdftotext -bbox` 取词坐标 → 按 `y` 聚簇成行（行距约 4.5pt）→ 行内按 `x0` 排序还原阅读序（否则词序错乱）
- `x_incl` 取**最左**的 `€ incl.` 列（排除 Nettoprijs 第二列）；`Nettoprijs*` 的 x 用**该词自身的 x**（不是行首词 x，行首常是别的列）
- 关键校验：`x_excl(403) < x_incl(454) < x_net(505)`

**核心坑 3：必须过滤的非车型行**
- 保修行：`3 JAAR OF 100.000 KM` / `8 JAAR OF 160.000 KM`（价格列会误显示为 160000）
- 装备价值行：`Totale waarde uitrusting` / `specifieke XC60 Ultra uitrusting` / `naar keuze`
- 选装包：`LAUNCH EDITION PACK` / `Metaalkleur` / `Donkergetinte achterruiten` / `module met 25.600 pixels`
- 过滤式：`BAD_RE = Totale waarde|uitrusting|naar keuze|JAAR OF|\d{3}\.\d{3}\s*KM|PACK|Metaalkleur|...`

**核心坑 4：型号名组装（词序错乱）**
- 表格列顺序：`动力类型(x≈55) | 动力代号(x≈129) | 变速箱(x≈200) | 设计版(x≈262) | 技术数据(x≥316) | 价格`
- 纯电车型（EX30/EX40/EC40/EX90/ES90/EX60）与混动车型列数不同、x 阈值不同 → **不能用固定 x 阈值切分**
- 改用**语义切分**：技术数据 token 用正则 `^[\d,\.\-–/]+$` 识别并剔除；剩余文字 token 中 `DESIGN_RE`（`Bright of Dark|Black Edition|Cross Country|Limited Edition|Launch Edition|First Edition|Bright|Dark|Base`）命中归设计版，其余归动力名
- 最终型号名 = `动力名 + 设计版 + 配置等级`，如：
  ```
  Plug-in hybrid benzine T8 AWD Long Range 8-traps automaat Bright of Dark ULTRA
  P5 Long Range RWD Black Edition PLUS
  Mild hybrid benzine B4 7-traps DCT Base Limited Edition CORE
  ```

**交付结果（2026-09-28）**
- **132 条**（v1 仅 46 条），覆盖 16 个 PDF 车系、年款 MY2027(75) / MY2027.5(55) / MY2028(2)
- 车系分布：EC40 20 / EX40 22 / EX30 13 / XC60 16 / XC90 20 / EX90 9 / XC40 14 / ES90 6 / EX60 8 / V60 4
- 脚本：`/tmp/vv2/parse4.py`（bbox 列坐标解析）→ `/tmp/vv2/build.py`（语义切分组装）→ `/tmp/vv2/out.py`（出表）

- 与 `/api/order/prices` 交叉核对：无 Business Edition 的 7 个车系**逐条吻合**；3 个有 Business Edition 的车系按规则取标准价（高于 API 的折扣「Vanaf」价）

**v3 重跑修正（2026-09-29）**

用户反馈「还是缺了很多」。重跑后定位：**数量没缺（132=132），缺的是「型号名里的 Design/Edition 列」**——v2 的型号名把 `Dark / Black Edition / Bright of Dark / Cross Country` 全丢了，
导致出现 **同名不同价的重复行**（如 XC40 `Mild hybrid benzine B3 PLUS` 出现两次：47.490 / 49.190，实际是 `Dark PLUS` 与 `Black Edition PLUS`）。

**根因：Design / Edition 列的位置随车型变化，不能用固定位置切**
| 车型 | 列序（Design 相对位置） |
|---|---|
| XC40 | `Motoren \| Vermogen \| **Design** \| CO2 \| excl \| incl`（Design 在 pk/kW **之后**） |
| XC60 | `Motoren \| Overbrenging \| **Design** \| Vermogen \| CO2 \| …`（Design 在 **之前**） |
| V60 | `Motoren \| Overbrenging \| **Design** \| **Edition** \| Vermogen \| …` |
| EX30 | `Motoren(P5) \| **Design** \| Vermogen \| …` |
| EX90 | `Motoren \| Aandrijving \| **Design** \| Vermogen \| …`（表头写 `Aandrijving` 不是 `Motoren`） |

**正确解法：按「封闭取值集合」提取，不按位置**
```python
DESIGN_MULTI = ['Bright of Dark','Black Edition','Cross Country','Limited Edition']
DESIGN_ONE   = ['Dark','Bright','Base']
# 从 excl 价格之前的 token 流中，先取 Edition(Limited Edition)，再取 Design(多词优先)
```
再剔除纯数字/范围/破折号噪声 token（`^[\d\.,/–—\-\s]+$` 与孤立的 `–`）。

**年款必须从 PDF 封面读，不能从文件名推**
- `prijslijst-ex60-cross-country.pdf` 封面写 `Modeljaar 2028`（文件名无年款线索）
- 正则：`re.search(r"[Mm]odeljaar\s*'?(\d{2,4}(?:\.\d)?)", text)`；两位年份补 `20`

**EX60 / EX60 CC 的复合等级名**
- EX60 分块标题是 `PLUS LAUNCH EDITION` / `ULTRA LAUNCH EDITION`（不是单 `LAUNCH EDITION`）
- EX60 CC 是 `PLUS FIRST EDITION` / `ULTRA FIRST EDITION`
- → `LEVELS` 集合必须包含复合名，否则 `PLUS`/`ULTRA` 前缀丢失，导致同名不同价

**促销 leaflet 一律剔除（本次逐一核验）**
`/nl-be/l/prijslijsten/` 页面除 16 份正价目表外，还有以下 **折扣/B2B 促销册**，价格均含 `TOTAAL VOORDEEL`（折扣），**不采**：
| Leaflet | 内容 | 判别依据 |
|---|---|---|
| `leaflet-business-edition` / `leaflet-ex30-ex40-ec40-business-edition` | Business Edition（**VOOR PROFESSIONELEN** B2B） | 标 `Totaal voordeel professionelen -12.066` |
| `leaflet-xc60-black-edition-my27.5` | XC60 Black Edition MY27.5 | `TOTAAL VOORDEEL -11.098` |
| `leaflet-xc40-urban-edition` | XC40 Urban Edition | `Totaal voordeel Urban Edition` |
| `leaflet-xc40-b3_b4-limited-edition` | XC40 Limited Edition（旧） | `TOTAAL VOORDEEL -13.061` |
| `leaflet-v60-limited-edition` | V60 Limited Edition | `TOTAAL VOORDEEL -11.024` |
| `leaflet-ex60` | EX60 Launch Edition | `UW EX60 ... 46.400`（低于正价表 62.990） |
| `XC60_Black_Edition_2luik_MY27` | XC60 Black Edition MY27 双折页 | `TOTAAL VOORDEEL -14.845` |

→ 正价目表 `prijslijst-*` 内部**已含** Black Edition / Cross Country / Limited Edition 行的**目录价**（如 EX30 `P5 Long Range Black Edition PLUS 49.290`），无需从 leaflet 补。

**v3 交付（2026-09-29）：132 条 / 12 车系，零同名歧义**
- 每行由 `车型+型号名+等级+年款` 唯一确定（`同名同级同年款不同价 = 0`）
- XC60/XC90 各有两版 PDF（MY2027 与 MY2027.5），年款不同 → 同名属正常，非重复
- 脚本：`/tmp/volvo/v5.py`（封闭取值集合提取）→ `mkfinal2.py`（出表）
- ⚠️ PDF 下载必须校验 `tail -c 2048 f | grep -q "%%EOF"`（首次下载 EX30 9.5MB 截断，实为 12.7MB，`pdftotext` 返回 0 字符）

**v4 重跑（2026-10-29，Windows 本机、无 xvfb）**
- 本机无 `xvfb-run`（Windows）→ **改用 browser-use 真浏览器**打开 `/nl-be/l/prijslijsten/`：curl 仍 403，真浏览器 200，可直接 `evaluate_script` 取链接
- ⚠ **卡片链接是懒渲染**：只取 `a[href]` 会漏一半。正确姿势是按锚文本筛 `a.innerText.trim()==='prijslijst'` 并向上找卡片标题（首个以 `Volvo ` 开头的行），一次拿全 16 条 `车系 → PDF` 映射
- 16 份 `prijslijst-*` 在 `azure-eu-assets.contentstack.com`，**curl 直下 200**，无需 Playwright；下载后逐份校验 `%%EOF`
- 解析换 `pdftotext -table -f 3 -l 3`（xpdf 4.00，**无 `-bbox`**）→ 价目表整页一行一版本，比 `-layout` 干净得多，不再需要 bbox 坐标聚类：行形如 `动力名 | Design | 变速箱 | 功率 | 电池 | … | excl | incl`
- **取价规则**：先命中 `\d{1,3}(\.\d{3})+,\d{2}`（excl），再取其后**第一个** `\d{1,3}(\.\d{3})+`（incl）→ 天然跳过 V60 的 `Nettoprijs*` 第三列（折扣价）
- 过滤：含 `PACK` / `|` 的行（如 `PB108 | LAUNCH EDITION PACK 1.480`）、纯数字/范围/`•`/`�` 噪声 token
- 型号名 = `动力名 + Design/Edition + 等级`（等级取分块标题 `ESSENTIAL/CORE/PLUS/ULTRA`，含 `PLUS LAUNCH EDITION`/`ULTRA FIRST EDITION` 复合名）；`AWD/RWD` 若版本名里已有一个，末尾重复的那个丢掉（`P8 Performance AWD Dark AWD` → `P8 Performance AWD Dark`）
- 交叉验证：官网车型页 `Vanaf € X (incl. btw)` 与价目表 incl 列**逐条吻合**（EX30 38.290/39.900/42.600/51.850；XC60 56.490 且页面标 `2027.5 /Modeljaar`）；V60 车型页显示 38.990/42.990 是 `Nettoprijs*` 折扣价，**不可采**
- 复采结果仍 **132 条 / 16 组**（与 v3 一致），年款全部来自封面 `Aanbevolen prijzen Modeljaar …`：MY2027(75) / MY2027.5(55) / MY2028(2)

**v5 配置器逐条核对（2026-10-29，用户真机 Chrome + browser-use）**

目的：确认「价目表 Catalogusprijs incl. btw」与官方配置器同源，而非价目表过期。

| 手法 | 说明 |
|---|---|
| 打开 | `https://www.volvocars.com/nl-be/build/<slug>/`，真机 Chrome 200；**11 个车系 12 个页面**逐一渲染 |
| 读值 | 按区块标题定位：`document.querySelectorAll('div.pb-2xl')` 内取 `h1..h4` 文本 → 取 `Kies uw niveau` / `Kies uw aandrijving` 区块里的 `button[role=radio]` 文本 |
| 无点击数 | 等级价全部首屏渲染，无需点击；动力切换价以 `+€ X` 显示在动力卡片上（如 EC40 `P5 Long Range +€ 3.000`、EX60 `P10 +€ 3.000 / P12 +€ 9.000`、EX90 `Twin Motor +€ 5.500`） |
| 批量 | 同源 `fetch('/nl-be/build/<slug>/')` 取 HTML（1.2–1.4 MB）再解析 flight 里的 `"equipmentLevels"`；⚠ 直接取 `"amount"` 偶有 ±1 噪声（XC60 Plus 显示 61.990 但 amount 解析成 61989），**以 DOM 文本为准** |

**结果：12 个车系页面中 11 个、共 35 个标准等级价与价目表 incl 列逐条相等（0 差异），仅 V60 例外**

| 车系（配置器 slug） | 配置器等级价 | 价目表 | 差 |
|---|---|---|---|
| EX30（ex30-electric） | 38.290 / 39.900 / 42.600 / 51.850 | 同 | 0 |
| EX40（ex40-electric） | 48.990 / 50.990 / 52.990 / 59.490 | 同 | 0 |
| EC40（ec40-electric） | 51.490 / 53.490 / 59.490 | 同 | 0 |
| XC40（xc40） | 44.490 / 47.490 / 50.490 | 同（MY27.5） | 0 |
| XC60 B5（xc60） | 56.490 / 61.990 / 65.990 | 同 | 0 |
| XC60 T6（xc60-hybrid） | 66.990 / 68.590 / 73.790 / 78.190 | 同 | 0 |
| XC90 B5（xc90） | 81.990 / 84.990 / 90.990 | 同 | 0 |
| XC90 T8（xc90-hybrid） | 95.490 / 98.990 / 103.490 | 同 | 0 |
| EX90（ex90-electric） | 84.490 / 89.990 / 101.990 | 同 | 0 |
| ES90（es90-electric） | 72.490 / 75.490 / 81.490 | 同 | 0 |
| EX60（ex60-electric） | Plus 62.990 / Ultra 69.890 | 同 | 0 |
| V60（v60） | **Core LE 38.990 / Plus LE 42.990** | Core 47.090 / Plus 53.090 | **−8.100 / −10.100** |

**Business Edition 促销等级（EX30 / EX40 / EC40 专有，全部不得采）**

| 车系 | 标准等级价 | Business Edition 价 | 差额 |
|---|---|---|---|
| EX30 | Core 39.900 / Plus 42.600 / Ultra 51.850 | 36.270 / 38.970 / 47.010 | −3.630 / −3.630 / −4.840 |
| EX40 | Core 50.990 / Plus 52.990 / Ultra 59.490 | 48.570 / 50.570 / 57.070 | −2.420 ×3 |
| EC40 | Core 51.490 / Plus 53.490 / Ultra 59.490 | 49.070 / 51.070 / 57.070 | −2.420 ×3 |

`/api/order/prices` 的 `cash`（= 车系页「Vanaf」）恰好等于各车系**最低促销价**：EX30 36.270、EX40 48.570、EC40 49.070、V60 38.990；其余 8 个车系等于标准最低价 → 再次印证 `cash` 不可作 MSRP。

**V60 专项（结论最硬的反例）**
- 配置器只卖 `Core Limited Edition 38.990` / `Plus Limited Edition 42.990`，页面同时出现 `Tijdelijke aanbiedingen (1)` 与 `Inbegrepen in pakket - Limited Edition`
- 价目表：`B4 Base CORE 47.090`、`B4 Base Limited Edition CORE 52.330`、`B4 Dark PLUS 53.090`、`B4 Dark Limited Edition PLUS 58.140`
- 即配置器的 "Limited Edition" 标签下挂的是 Core/Plus 的折扣价（47.090−8.100=38.990、53.090−10.100≈42.990），若用它出表会整系低报 8–10k

**覆盖度差异（配置器首屏共 46 个等级价 = 35 标准 + 9 Business Edition + 2 V60 促销，vs 价目表 132 行）**
- EX30：配置器只有 Essential/Core/Plus/Ultra 四档，**无 Long Range 选项、无 P8**；价目表的 `P5 Long Range Dark CORE 45.150`、`P5 Long Range Dark PLUS 48.100`、`P8 AWD … ULTRA 54.550/55.390/55.390` 共 5 行配置器给不出
- XC40：配置器只给 MY27.5（Core/Plus/Ultra）；价目表的 MY2027 `B3 Base ESSENTIAL 40.450` 等 7 行为 stock 价目表内容
- EX60 Cross Country：配置器卡片存在但**不显示价格**；价目表 MY2028 有 2 行
- 结论：价目表是唯一完整源，配置器仅能做「同口径抽样校验」，不可作全量源

**v6 修正（2026-10-30）：型号名改用配置器动力全名**

用户指正：EC40 配置器 `Kies uw aandrijving` 写的是 `P5 Elektrisch (BEV)` / `P5 Long Range Elektrisch (BEV)`，而 v1–v5 表里照抄了价目表 `Motoren` 列的 `P5` / `P5 Long Range` 短代号 → 违反 SKILL「动力名权威源 = 配置器选择动力的字段，价目表只供价格」。已重出：**79/132 行改名，价格与年款未动**。

| 价目表 Motoren 列 | 表内改为（配置器逐字） | 改动行数 |
|---|---|---|
| `P5` | `P5 Elektrisch (BEV)` | 27（EX30 10 / EX40 9 / EC40 8） |

> 上表只列「族根」，实际按前缀替换，`P5 Long Range` → `P5 Long Range Elektrisch (BEV)`（17 行）

| 价目表 Motoren 列 | 表内改为（配置器逐字） | 改动行数 |
|---|---|---|
| `B3` | `B3 Mild-hybride (MHEV)` | 11（XC40） |
| `B4` | `B4 Mild-hybride (MHEV)` | 7（V60 4 / XC40 3） |
| `B5 AWD` | `B5 AWD Mild-hybride (MHEV)` | 16（XC60 6 / XC90 10） |
| `T6 AWD Long Range` | `T6 AWD Groot rijbereik Plug-in hybride (PHEV)` | 4（XC60） |
| `T8 AWD Long Range` | `T8 AWD Groot rijbereik Plug-in hybride (PHEV)` | 6（XC90） |
| `P6` | `P6 Elektrisch (BEV)` | 2（EX60） |
| `P10` | `P10 AWD Elektrisch (BEV)` | 4（EX60 2 / EX60 CC 2） |
| `P12` | `P12 AWD Elektrisch (BEV)` | 2（EX60） |

**配置器没有、保留价目表原写法的 53 行**：`P8 AWD`（EX30 3）、`P8 Performance AWD`（EX40/EC40 4）、`Twin Motor Performance`（7）、`Single Motor` / `Single Motor Extended Range`（MY2027 stock，22）、`T6 AWD` / `T8 AWD`（MY2027 stock，10）、`Twin Motor AWD`（8）。stock 表的 `T6 AWD` 与 2027.5 的 `T6 AWD Long Range` 功率同为 335/247，仅是沃尔沃换了写法，**不自行补 Long Range**。

**EX60 Cross Country 的取法**：它不是一个独立 slug，而是 `ex60-electric` 配置器「Kies uw uitvoering」里的版本卡；点选后 URL 变 `?ccid=ZX4wLmNyb3NzLWNvdW50cnk=`，`Kies uw niveau` 给出 `Plus First Edition 68.990` / `Ultra First Edition 75.890`，动力 `P10 AWD Elektrisch (BEV)` —— 与 MY2028 价目表两行吻合。

**年款双版本的口径（用户问过）**：价目表页每个车系有「NEW Volvo X」与「Volvo X (stock only)」两张卡：

| 卡片 | PDF | 封面 |
|---|---|---|
| NEW Volvo EC40 | `prijslijst-ec40-my27.5.pdf` | `10 september 2026 - Aanbevolen prijzen Modeljaar 2027.5` |
| Volvo EC40 (stock only) | `prijslijst-ec40` | `1 april 2026 - Aanbevolen prijzen Modeljaar 2027` |

车型页写 `2027.5 /Modeljaar`（当前可订），stock 卡是库存车（页面脚注 `MY27 Stock only`）。两套都是官网在刊价目表 → **都入表、用年款区分**（EC40/EX40/XC40/XC60/XC90 各两套，共 46 行 stock）。

**交付（2026-10-30）**：`Volvo_BE_官网价_20261030.xlsx`，132 行 / 16 组，`verify_xlsx.js` PASS（8 列 / E 列 `@` / 冻结 / 筛选 `A1:H133` / 副表 16 行 / 逐行 0 差异）。

---

### SEAT（BE 比利时 `www.seat.be/fr`：curl 全 403，但**真机 Chrome 可采**）✅

**结论（2026-10-29 实测）：本机 curl / 无头浏览器仍 403（IP 信誉问题），但用户真机 Chrome 打开正常、配置器可点可读 → 用真浏览器（browser-use MCP）采配置器，67 条 / 4 车系全量到手。**

> 教训：之前的「无解」结论只在**本机 IP + headless** 前提下成立。同一个站，换真机浏览器就通了 —— **IP 级 403 ≠ 站点不可采**，先在用户真浏览器上试一次再定生死。

| 探测项（本机） | 结果 |
|---|---|
| `curl www.seat.be/fr`、`robots.txt`、`sitemap.xml` | 仍 **403 Request Denied** |
| Playwright headless | 仍 403 |
| **用户真机 Chrome（browser-use）** | ✅ 200，配置器完整可用 |

**采集路径（SPA 六步配置器，只用到第 2、3 步）**

```
https://www.seat.be/fr/configurator/w/version?carlineGroup=CARLINE-GROUP-<CODE>&wf=seat-be-fr
```

| carlineGroup | 车系（配置器内名） | 备注 |
|---|---|---|
| `CARLINE-GROUP-KJG` | New Ibiza | 6 个 finition |
| `CARLINE-GROUP-KJP` | New Arona | 6 个 finition |
| `CARLINE-GROUP-KLG` | Leon 5d | 3 个 finition |
| `CARLINE-GROUP-KLD` | Leon Break | 3 个 finition |
| `CARLINE-GROUP-KHP` | Ateca | ❌ 直接 302 回第 1 步 `w/model`（已停产，配置器内不存在） |

- 第 2 步 `Finition` 每张卡 = 一个 finition 的 `Prix à partir de`；点击后客户端跳到
  `w/engine?wf=seat-be-fr&carline=CARLINE-xxxx`（carline 变成 finition 级：Leon 三个 finition 分别是 `KLG2` / `3bcd2beb-…` / `KLG5`）
- 第 3 步 `Motorisation` 每个卡 = `{排量机种} {功率} · 燃料 · 变速箱 · Prix à partir de`，即**该 finition + 该发动机的 tarifs conseillés TVAC**
- **价格口径**：配置器法律声明原文 "les tarifs conseillés TVAC indiqués sur le Configurateur" → 取此价。模型页/顶部导航的 `À partir de … € *` 是**促销价**（含以旧换新补贴），差 3k 以上（Ibiza 导航 16.995 vs 配置器 20.110），**不可采**

**选择器 / 抓取写法**

```js
// 第 2 步
document.querySelectorAll('[data-testid="version-selector__card"]')        // 每张 finition 卡
  .querySelector('[data-testid="version-selector__carline-name"]')          // finition 名
  .querySelector('[data-testid="price-from__value"]')                       // "29.820 €"
// 第 3 步
document.querySelectorAll('[data-testid="seat_engine_selector_card-main-card"]').map(c => c.innerText)
```

engine 卡 innerText 逐行拆：`1.5 | TSI | 115ch | ( | 85KW | ) | … | Type de carburant | Essence | … | Boîte de vitesse | 6 vitesses | - | Manuelle | … | Prix à partir de | 30.730 €`
→ 发动机名取前 3 行拼接，燃料取 `Type de carburant` 次行，变速箱取 `Boîte de vitesse` 到 `Consommation…` 之间。

**踩坑（都踩过）**

1. **版本卡渲染很慢且分批出现**：绝不能「等到 count>0 就点」。实测先出 1 张、几秒后才补齐 6 张；抢跑会漏掉 finition（Leon 从 3 个变 1 个）。正确做法：轮询到数量**连续两次不变**再多等 1.5s，或直接 `sleep(7000~8000)`。引擎卡同理，点完要等 6–8s。
2. **点 finition 是客户端路由**（不整页刷新），所以一次 `evaluate_script` 里「点卡 → sleep → 抓引擎卡」可以连贯完成，但**单次脚本别超过 ~10s**（工具 15s 超时），长循环要拆成多次调用。
3. **回退只能用 `history.back()` + 等 6–7s**；`data-testid="arrow-left"` 点了没反应。回退后同样要等卡片补齐。
4. **直接开 `w/engine?...&carline=CARLINE-xxx` 打不开**（0 台车）：引擎列表依赖前序步骤写入的会话状态，必须从 version 步骤点进去。
5. **`0 moteur(s) disponible(s)` 是真实状态**：Arona `FR Edition`（`CARLINE-KJP5`）6 次复测都是 0 台，随后自动弹回第 1 步。该 finition 只能取第 2 步的 finition 起价（32.190 €），车型名不带发动机、燃油写「未标注」。
6. **型号名必须带变速箱**：同一 finition 下 `1.0 TSI 116ch` 有 7 速手/自两条同价不同价（Ibiza FR Edition 28.900 / 30.540），不写变速箱无法区分。写法 `{finition} {发动机} {变速箱}`，变速箱按页面原文（Ibiza/Leon 用 `6 vitesses Manuelle`，Arona 用 `6 rapports Manuelle`）。
7. **年款**：配置器六步与车系页**全站无 MY / millésime / Model Year**，只有页脚 `© 2026 SEAT`（版权年，不采）；carline 代码 `KLG2/KLG5` 是内部代号 → 一律「官网无年款」。

**结果与交叉验证（2026-10-29）**

- 67 条 / 4 车系：New Ibiza 17、New Arona 14、Leon 5d 18、Leon Break 18
- 燃油：Gasoline 42 / MHEV 12（`eTSI` = 48V 轻混）/ Diesel 12 / 未标注 1（Arona FR Edition）
- **Ateca 不入表**：车系页明写 "Notre SUV emblématique ne fait plus partie de la gamme actuelle"，配置器已无该 carline，导航上的 28.255 € 属促销起价 → 按「已停产且官网无价」处理
- 交叉验证：配置器第 1 步四车系 `Prix à partir de` = 20.110 / 23.095 / 29.820 / 30.930，与各车系最低配行**逐条吻合**

**历史探测记录（本机 IP 仍适用）**

| 探测项 | 结果 |
|---|---|
| `curl www.seat.be/fr` | **403 Request Denied**（`Event ID` + `Client IP`，Imperva/Akamai 风格错误页） |
| Playwright **headed + xvfb** | **403**（按 IP 而非指纹封） |
| 换 UA / 换 Accept-Language / 换 Mac UA | 403 |
| IPv6 | 不通（000） |
| `www.seat.be/robots.txt`、`/sitemap.xml`、`/api` | **全 403**（连 robots 都拒 → 确认整站按 IP 拦） |
| 其他市场（`seat.fr` / `seat.de` / `seat.co.uk` / `seat.es` / `seat.it` / `seat.nl` / `seat.pt` / `seat.ch` / `seat.com`） | **全部 403**（同一 WAF 策略） |

**域名解析分级（重要）**

| 域名 | IP | 归属 | 状态 |
|---|---|---|---|
| `www.seat.be` | `23.219.160.164` | **Akamai**（`e320677.dscb.akamaiedge.net`，edgekey `cupraofficial.com`） | 403 拦截 |
| `seat.be`（apex） | `13.248.159.164` | AWS ELB | 301 → `https://www.seat.be:443/fr`（但跳到 www 后仍 403） |

- 试过 `--resolve www.seat.be:443:13.248.159.164`（用 apex IP 直连）→ **404**（ELB 不认该 Host）
- ~~SEAT 与 CUPRA 共用 edgekey `cupraofficial.com.edgekey.net` → CUPRA 系站点大概率同样被拦~~
  → **该推断已被实测推翻**：CUPRA 比利时（`www.cupra.be`）**完全可访问**，走的是 Azure 独立 IP `20.105.216.33`，与 SEAT 的 Akamai 节点无关。**不要因为同属一个集团就预判封锁**——每个品牌独立起 triage 实测。

**排查心法**：先测 `robots.txt`。若连 `robots.txt` 都 403，说明是**IP 级封锁**而非路径/指纹问题——但**先拿到用户真机浏览器结果再判「无解」**：SEAT BE 在本机 curl/headless 全 403，真机 Chrome 却能完整跑配置器。真机也不通才止损。

---

### CUPRA（BE 比利时 `www.cupra.be/fr`：完全可访问，官方 API 直连）✅

**结论：93 条全量采到，含配置等级 × 动力。本集团站点里最好采的一个。**

| 项目 | 状态 |
|---|---|
| 主站 `www.cupra.be` | ✅ 200（Azure IP `20.105.216.33`，`robots.txt` 200）——与 SEAT 完全不同 |
| **官方价格 API** | ✅ `api.cupra.be`，**无鉴权**，curl 直可达 |
| 车系数 | 7 个：RAVAL / FORMENTOR / TERRAMAR / BORN / TAVASCAN / LEON / LEON BREAK |

**核心端点（唯一需要的一个）**

```bash
GET https://api.cupra.be/v1/car-configurator/choices/<CARLINE>?lang=FR&sales_type=B2C
# 必须带 header：Referer: https://www.cupra.be/fr/
```

返回 `[{engine:{...}, interiors, paints, packs, options, wheels}]`，其中 `engine` 字段：

| 字段 | 含义 | 采不采 |
|---|---|---|
| `name` | 完整官方型号名（配置等级 + 动力 + 变速箱），如 `VZ5 2.5 TSI 390ch (287kW) DSG 4Drive 7v` | ✅ 直接作「官网型号名称」 |
| **`price`** | **官方目录价** | ✅ **采这个** |
| `priceWithReduction` | 折扣/促销价 | ❌ **不采**（陷阱，见下） |
| `model_year` | 年款，本季全部 `2027` | ✅ |
| `power` / `fuel_type` / `top_speed` / `autonomy` / `liters_per_100km` / `wh_per_km` / `grams_per_km` | 规格 | 备注用 |
| `id` / `model_code_extension` | 内部码 | — |

**⚠ 折扣价陷阱（CUPRA 必看）**
93 条里 **92 条** `price ≠ priceWithReduction`，差幅可达 **9.000 €**：

```
FORMENTOR  Impulse 1.5 TSI 150ch (110kW) Manuelle 6v
           price = 41.714,98   ← 采这个（MSRP）
           priceWithReduction = 32.714,97   ← 促销价，不采
```

**合法 carline 白名单**（传错会返回 400，message 里会列出全部合法值）

```
FORMENTOR, BORN, LEON, LEONBREAK, TAVASCAN, TERRAMAR, RAVAL
```

- 注意是 `LEONBREAK`（无空格、无连字符），但**官网展示名为 `LEON BREAK`**（带空格）
- `LEON-SPORTSTOURER` 无效 → 400（Sportstourer 就在 `LEONBREAK` 里）
- 一次请求即可拿到该车系全部配置 × 动力组合，无需逐车型爬

**其他端点（非必需）**

| 端点 | 内容 | 陷阱 |
|---|---|---|
| `GET https://www.cupra.be/api/global-financing-products?type=prices&language=FR&salesType=B2C` | 全站金融价 | ⚠ 同时含 `price`/`discount_price`，**仍是折扣口径，别混用** |
| `GET https://api.cupra.be/v1/car-configurator/cupra-params?cupra_code=<code>` | 配置器参数 | — |
| `GET https://api.cupra.be/v1/car-configurator/prices?cupra_code=<code>&lang=FR` | 金融 | — |
| `GET https://api.cupra.be/v1/car-configurator/standards?cupra_code=<code>&lang=FR` | 标准装备 | — |
| `GET https://api.cupra.be/v1/feature-flags` | 特性开关 | — |
| `GET https://www.cupra.be/api/navigation?language=FR&type=header&salesType=B2C` | 站内导航 | — |
| `/_next/data/<buildId>/fr/B2C.json` | Next.js 数据 | — |

- 配置器入口：`/fr/configurateur/personnalisation/<slug>?cupra_code=<code>`
- 配置器页显式显示 `Total incl. TVA 26.460,01 €`，可与 API `price` 交叉验证
- 架构：Next.js，后端 `api.cupra.be`（独立子域，无鉴权）

**为什么这个采到了、SEAT 没采到**：两者同属品牌体系，但 CUPRA BE 是 Dieteren 运营、落在 Azure 独立 IP 且无 WAF 拦截；SEAT 落在 Akamai 且执行 IP 黑名单。**结论：集团归属 ≠ 封锁状态，一律 triage 实测。**

---

### Hyundai（BE 比利时 `www.hyundai.com/be/nl.html`：**页面内 fetch 可打通 PAPI**，1 车系 1 请求拿全量）✅

**结论：可拿全量（uitvoering × 动力 × 车身），22 个配置器 / 141 条，2026-10-29 交付。**

| 项目 | 状态 |
|---|---|
| 主站 `www.hyundai.com/be/nl` | ✅ 200 |
| curl → `org-eu-www.hyundai.com` | ❌ 仍 SNI 级 RST（历史记录见下，至今未变） |
| **页面内 `fetch()` → `org-eu-www.hyundai.com/eu/papi`** | ✅ **200，返回 GraphQL 数据**（2026-10 早期曾判「全封」，实测可从 `www.hyundai.com` 源 `fetch`） |
| 官方价格表 PDF | ❌ 无直链（`/be/nl/tools/brochures.html` 是表单申请制） |

**★ 取价字段（一次请求 = 一个车系的完整价格表）**

```js
// 在任意轻量页（如 /be/nl/cookies.html）的控制台/evaluate 里跑；不要在配置器页跑（见坑 1）
POST https://org-eu-www.hyundai.com/eu/papi
Content-Type: application/json
{"query":"query T($country:TrimmedString!,$language:TrimmedString!,$modelId:TrimmedString!,$service:TrimmedString!){
   hppFscs2(country:$country,language:$language,modelId:$modelId,service:$service){
     fsc bodytype bodytypeNm trimNm trimSort powertrainNm fscPrice discount1Price } }",
 "variables":{"country":"be","language":"nl","modelId":"SW|S6||","service":"S03"}}
```

- **`fscPrice` = Aanbevolen catalogusprijs（含 VAT 的建议零售价，即 MSRP）**；`discount1Price` = 官网活动折扣（"Actie"）
- 校验式：`Huidig aanbod = fscPrice − discount1Price`（i20 Twist：22.695 − 2.000 = 20.695，与 `#/summary` 完全吻合）
- **不要用**车系页/车型卡片的 `Vanaf €`：它是促销起价，比 `fscPrice` 还低约 1.000–2.000（i20 19.695 vs 22.695）
- 配置器 `#/trims` 卡片上的「Vanaf」= `fscPrice`（tooltip「Inclusief BTW, exclusief aflever- en transportkosten, **exclusief kortingen**」）；卡片上的「Uw configuratie」= 折后价（tooltip「Netto promoprijs…」）
- `service`：比利时=`S03`（荷兰本土=`S04`，JS 里 `_n?"S04":"S03"`）

**`modelId` 从配置器页 HTML 的 `data-config` JSON 里取**（`<div id="root" data-config='{"country":"be","language":"nl","modelId":"SW|S6||",...}'>`），格式 `<车型码>|<车身码>|<电动码>|`：

| 车系 | slug | modelId | 车系 | slug | modelId |
|---|---|---|---|---|---|
| i10 | `new-i10` | `GQ\|S6\|\|` | TUCSON | `tucson` | `GT\|*\|\|` |
| INSTER | `inster` | `6X\|S5\|\|` | TUCSON Hybrid | `tucson-hybrid` | `JF\|*\|EV1\|` |
| i20 | `new-i20` | `SW\|S6\|\|` | TUCSON PHEV | `tucson-plug-in-hybrid` | `JF\|*\|EV2\|` |
| BAYON | `bayon` | `SW\|W5\|\|` | SANTA FE Hybrid | `santa-fe-plug-in-hybrid/configurator-hev` | `HK\|*\|EV1\|` |
| i30 | `i30` | `G4\|S6\|\|` | SANTA FE PHEV | `santa-fe-plug-in-hybrid/configurator-phev` | `HK\|*\|EV2\|` |
| i30 Wagon | `i30-wagon` | `G4\|W5\|\|` | IONIQ 3 | `ioniq-3` | `6J` |
| KONA | `kona` | `1E\|W5\|\|` | IONIQ 5 | `ioniq-5` | `GI\|*\|\|` |
| KONA Hybrid | `kona/configurator-hev` | `1Y\|W5\|EV1\|` | IONIQ 5 N | `ioniq5-n` | `9I\|W5\|\|` |
| KONA Electric | `kona-electric` | `7F\|W5\|\|` | IONIQ 6 | `ioniq6` | `AL` |
| | | | IONIQ 6 N | `ioniq6-n/new-ioniq-6-n-configurator` | `8D` |
| | | | IONIQ 9 | `ioniq9` | `GO\|*\|\|` |
| | | | STARIA People Electric | `staria-people-electric` | `MZ\|*\|\|` |
| | | | STARIA Cargo Electric | `staria-cargo-electric` | `MZ\|F3\|\|AVSD0` |

**去重口径**：同一 `trimNm + powertrainNm + bodytype` 会出多行（颜色/选装包组合）→ **按这三元组分组取 `min(fscPrice)`** = 该版本基础配置价。已用 UI 卡片逐条回验：i20 / INSTER / KONA Hybrid 的「Vanaf」全部 1:1 吻合。

**车身（bodytype）**：只有多车身车系需要拼进型号名，UI 用座位数：

| 车系 | bodytype → bodytypeNm | UI 文案（拼进型号名用） |
|---|---|---|
| SANTA FE Hybrid / PHEV | `W5` = Wagon 5 DR / `W7` = Wagon 7 Seats | `5-zit` / `7-zit` |
| IONIQ 9 | `W6` = Wagon 6 Seats / `W7` = Wagon 7 Seats | `6 zitplaatsen` / `7 zitplaatsen` |
| STARIA People Electric | `B7` = Wagon 7 Seat / `B9` = Wagon 9 Seat | `7 zitplaatsen` / `9 zitplaatsen` |

**坑**

1. **配置器页会卡死 `evaluate_script`**（15s 超时，连 `document.title` 都超时）→ **所有 in-page fetch 都在轻量页（`/be/nl/cookies.html`）里跑**；配置器页只用来读 `data-config`（用 `fetch(html)` 静态读，不渲染）
2. 车系页 `Vanaf` ≠ MSRP（含未显示的活动折扣），见上
3. `hppFscs2` 的报错被服务端统一遮成 `{"errors":[{"message":"Internal server error"}]}`（introspection 也关）→ 查字段名只能翻 3.4 MB 的 `car-configurator-hpp2.<hash>.js`（fragment 是 JS 字符串，`fragment PriceFragment on hppFscs2Type` 等）
4. KONA（燃油）的 `powertrainNm` 带车型前缀「KONA 5d 1.6 T-GDi 150」→ 拼名前剥掉 `KONA 5d `
5. INSTER 的电池写法不统一：`42 kWh` 与 `49kWh` 混用（原样保留）
6. **NEXO 有页面但无价**：`/be/nl/modellen/nexo.html` 无配置器、全页 0 个 € 价格 → 按 2026-10-30 三档规则应写 `官网无价格` **并照常出行**（FCV；2026-10-29 的 141 条交付按旧口径未含此车系，补采时需加回）
7. 年款：配置器 / PAPI / 页脚均无 MY 字段（页脚只有 `Copyright 2023. Korean Motor Company, Hyundai Belux.`）→ 全部 `官网无年款`

**交付（2026-10-29）**：22 车系 / **141 行**；燃油 Gasoline 48 / BEV 53 / HEV 25 / PHEV 10 / MHEV 5（TUCSON 1.6 CRDi 136 48v 按轻混记 MHEV）

---

**以下为 2026-10 早期的探测记录（当时结论「PAPI 被 SNI 级封锁」，现已推翻，保留作判定参考）**

**当时结论：可拿到车系起价，拿不到完整价格表（配置等级 × 动力）。（已被上文 ✅ 方案推翻）**

| 项目 | 状态 |
|---|---|
| 主站 `www.hyundai.com/be/nl` | ✅ 200（Cloudflare，`104.18.13.38`） |
| 车型清单（20 车系） | ✅ `/be/nl/modellen.html` |
| 各车系配置器 URL | ✅ `/be/nl/modellen/<slug>/configurator.html` |
| 车系起价 `Vanaf € xx.xxx` | ✅ 车型页 SSR 可 curl |
| **完整价格（配置等级×动力）** | ❌ 依赖 `org-eu-www.hyundai.com/eu/papi`，**被封** |
| 官方价格表 PDF | ❌ 无直链（`/be/nl/tools/brochures.html` 是**表单申请制**，填邮箱才发链接） |

**架构**

```
www.hyundai.com/be/nl/...          ← AEM 站点（/etc.clientlibs/hyundai-wwn3/）
  └─ 配置器页内嵌 iframe: tnegaesalasia-orp.astara.com/index.widget.html?brand=hyundai&country=be&lang=nl
                                    （Astara 提供的「AI 销售助手」widget，不含车辆价格目录）
  └─ 主框架直连官方 PAPI:
       POST https://org-eu-www.hyundai.com/eu/papi     ← GraphQL，价格字段在此
       POST https://org-eu-www.hyundai.com/eu/graphql   ← hppFscs2，含 fscPrice/discountNPrice
```

**PAPI 契约（已完整逆出，供有可用出口时复用）**

```json
POST https://org-eu-www.hyundai.com/eu/papi
Content-Type: application/json
Referer: https://www.hyundai.com/

{"query":"query Trims($country:TrimmedString!,...){ hppTrimEquipments(...){trimId equipNm} hppFscs2(...){trimId trimName trimSort} ...FscsQueryFragment }",
 "variables":{"country":"be","language":"nl","modelId":"6X|S5||","service":"S03",
              "isFscsLoaded":true,"isNotNlMarket":true,"isTRMarket":false}}
```

- `modelId` 格式：`<车型码>|<版本码>||`（如 `6X|S5||` = INSTER 某配置）
- `service: "S03"`（比利时）、`country: "be"`、`language: "nl"`
- 价格字段：`basePrice` / `discountPrice` / `customerSaving` / `totalAmt` / `totalAmtWODisc` / `vatAmt`
- `hppPriceDetailListTR` 是土耳其市场专用（`isTRMarket`），比利时用 `FscsQueryFragment`

**封锁特征（关键判定依据）**

| 检测 | 结果 |
|---|---|
| `org-eu-www.hyundai.com` 解析 | `185.106.8.43`（**独立 IP**，非 Cloudflare） |
| TCP 443 | ✅ 通（`/dev/tcp` 可连） |
| **TLS 握手** | ❌ **立即 RST**（`openssl s_client` → `unexpected eof while reading`，`read 0 bytes`） |
| 浏览器内 | `net::ERR_CONNECTION_CLOSED` |
| `curl` | exit 35（SSL 层） |

→ 判定：**按 IP 的 SNI 级封锁**（TCP 能连、TLS 被 reset）。

**已试无效的绕行**

- 换 UA / headed 浏览器 / `--disable-blink-features=AutomationControlled` → 仍 `ERR_CONNECTION_CLOSED`
- 页面内 `fetch`（车型页 & 配置器页 & Astara iframe 内）→ 全部 `Failed to fetch`
- 其他区域域名 `org-www.hyundai.com` / `org-eu.hyundai.com` / `eu-www.hyundai.com` / `org-be-www.hyundai.com` → **均不解析**（NXDOMAIN）
- `org.hyundai.com`（`101.1.53.88`，TLS 正常）→ **无 `/eu/papi`**（404，是另一台服务器）
- `www.hyundai.be`（`188.93.153.172`，TLS 正常）→ 仅 **301** 跳回 `www.hyundai.com`，无独立数据
- Astara widget API（`func-agentorchestrator-aisalesagent-sw-pro-01.azurewebsites.net`）→ **可访问**（`/api/session-token` → Bearer → `/api/get-services-config` 返 200），但只有 `CONVERSATIONAL`/`BRAND` 等服务开关，**无车辆价格目录**

**行为特征**：配置器 URL 在 `#/trims`（正常）与 `#/error` 之间随机切换；`#/error` 时 DOM 为空、无价格。实测 `#/trims` 时也只渲染导航壳（「Kies jouw uitvoering」），**版本卡片与价格始终为空** —— 因为数据源 PAPI 拉不到。

**可采到的官方起价（16 条，`Vanaf` 口径，含税）**

| 车系 | 起价 € | 车系 | 起价 € |
|---|---|---|---|
| i10 | 16.949 | IONIQ 3 | 29.995 |
| i20 | 19.695 | KONA Electric | 31.349 |
| BAYON | 21.645 | TUCSON | 32.049 |
| i30 | 22.199 | IONIQ 5 | 40.199 |
| i30 Wagon | 23.199 | IONIQ 6 | 43.199 |
| INSTER | 23.349 | SANTA FE Hybrid | 56.295 |
| KONA | 26.499 | SANTA FE PHEV | 63.295 |
| | | IONIQ 9 | 64.995 |
| | | IONIQ 5 N | 74.445 |
| | | IONIQ 6 N | 75.445 |

**slug 修正（车型页 404 时用）**：`kona-hev` → `all-new-kona`；`tucson-hev` → `tucson-hybrid`；`tucson-phev` → `tucson-plug-in-hybrid`；`santa-fe-hev` → `santa-fe-hybrid`；`santa-fe-phev` → `santa-fe-plug-in-hybrid`

---

### Mitsubishi BE（比利时 `www.mitsubishi-motors.be/nl`：**mipulse GraphQL APQ，价格藏在配置器摘要 HTML 里**）✅

- **★ 数据源**：`https://www-graphql.prod.mipulse.co/prod/graphql`，Apollo **persisted query**，GET 拼 `?operationName=<op>&variables=<enc>&extensions=<enc {"persistedQuery":{"version":1,"sha256Hash":"<hash>"}}>`。`getModelSelector` 给车系/车型清单，`getSummary` 给单车型摘要。完整 query 文档也内嵌在 `js_mmc.*.js` 里，可改 POST。
- **★ variables 必须带 `url`**：`{market:"be",language:"nl",path:"/be/nl/aanschaf/configure/configurator",selection:{model,vehicle,year,url}}`。漏 `url` 会报 `Cannot read properties of undefined (reading 'replace'/'indexOf')`。
- **★ 价格位置（关键）**：`getSummary → getSummarySelector.summary.model.description` 是 HTML 串，内含 `Aanbevolen catalogusprijs: € 30.790`、`Herfstvoordeel: - € 2.000`、`Vanafprijs exclusief metaalkleur: € 28.790`。**`model.price.value` 是促销价，别取。**
- **★ 促销结构**：每车系一个固定 `herfstvoordeel`（ASX 2.000 / Grandis 2.500+2.000 / Eclipse Cross 4.000 / Outlander PHEV 6.000），逐 trim 校验「目录价 − 促销 = 页显价」全部吻合。
- **★ 无价目表**：`/nl/campagne/prijslijst-*` 页面渲染为空，全站无 PDF；`/nl/brochuredownload` 只回链这些页 → 不要再找 PDF。
- **★ 年款**：站内不印 MY；模型页路由 `/be/nl/modellen/asx/2025`、配置器 `year` 参数、`getModelSelector.models[].year` 三处一致，才据此写年份。

---

### MG BE（比利时 `www.mgmotor.be/nl`：**Craft CMS + Alpine，配置器 HTML 内嵌产品 JSON**）✅

- **★ 车型范围**：导航 16 项，其中 15 个有配置器；`MG GO! Concept` 无配置器、全站无价 → 概念车，不入表（交付说明列名）。
- **★ 老版配置器**（hs / hs-hev / hs-phev / mg3 / mg3-hev / mg4 / mg4-urban / mgs5 / mgs6 / mgs9-phev / zs / zs-hev）：`<configurator-payment-options :editions="...">`，属性是 **HTML 转义 JSON**，标签属性换行 → 先定位标签再找 `:editions=`，切到下一个 `"` 再 `JSON.parse`。取 `field_commercePrivatePaymentOptions[0].field_paymentOption_basePrice`（`field_paymentOption_paymentName = "Aanbevolen catalogusprijs"`），`promotions[].field_priceImpactNonMetallic` 是折扣。
- **★ 新版配置器**（IM5 / IM6 / CYBERSTER，仅 `/nl/model/<slug>/configurator`，`/nl/configurator/<slug>` 会回落到国家选择页）：`editions[].prices.cash` = 目录价，`promotions[].discount` = 折扣，`calculationDiscount` 为空串。
- **★ 口径校验**：每车系「basePrice − Σpromotions」逐条等于车型页 `Vanaf € X`（促销价），12 个车系全中；IM5/IM6 再减 4.000 正好等于首页 Lanceringsaanbod。
- **★ 坑**：`zs`（汽油 ZS）配置器条目 sku 写成 `zs-hev-comfort-1`、价格 25.285 与 ZS Hybrid+ Standard 同值，但促销 −5.286 后 = 页面 19.999，可确认是汽油 ZS Comfort 的真实目录价，不是串数据。
- **★ 年款**：全站无 modeljaar/bouwjaar/MY；页面 2026 均为活动期（01/09–30/11）或版权年 → `官网无年款`。

---

### Maxus BE（比利时 `www.maxusmotors.be/nl`：**Next.js `__NEXT_DATA__` 直读，价格字段最规整**）✅

- **★ 数据源**：`/nl/modellen/<slug>` 与 `/nl/configurator/<slug>` 的 `<script id="__NEXT_DATA__">` → `props.pageProps.story.content.configurationInfo.configurations[]`；两处条数一致，配置器页也带全量。
- **★ 取价**：`listPrice.priceInclVat`（UI 翻译键 `configurator.pricedetails.listprice` = **"Catalogusprijs"**），`discounts[].price` 是活动折扣；`referenceConfiguration.priceInfo.totalPrice` 是折后价，**不取**。
- **★ 在售范围**：`/nl/configurator` 页首行 `7 Resultaten` = eDELIVER 5 / DELIVER 7 / DELIVER 9 / T60 MAX / eDELIVER 7 / eDELIVER 9 / eTERRON 9。`eDELIVER 3` 仍在导航与 `/nl/modellen/edeliver3`，但 `configurationInfo` 为 null、无价格、不在 7 个结果与价目清单里 → 视作停供，不入表（交付说明列名）。
- **★ 含税**：页面同时给 `excl. BTW` / `incl. BTW`（×1,21），取 incl；URL 上的 `?priceexclvat=true` 只是切显示。
- **★ 坑**：`DELIVER 9` 有一个 CMS 条目名 `Deliver9 Luxury 2024`，图片素材名 `deliver9-my24-*` —— 都不是 MY 标示，不能当成年款。
- **★ 价目 PDF 不存在**：`/nl/prijslijsten` 只收表单邮件发送，别去找 PDF。
- **★ 年款**：无 modeljaar/bouwjaar/MY；页面 2026 只有活动期 `Actie geldig van 01-10-2026 tot en met 31-10-2026.` → `官网无年款`。
