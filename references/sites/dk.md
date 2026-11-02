# 丹麦 DK — 站点坑位详段

> 市场码 DK · 4 段 · 品牌：Citroën / CUPRA / MG / Nissan
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-10-30 · 文中 snapshotVersion / token / 车型 id 均为当时实测值，必须现取

---

### Citroën（DK 丹麦 `www.citroen.dk`：主站通，但价格 API 在我方出口被路由阻断）❌

**结论：主站完全可访问，但价格数据源 `pricelists-api.cars4ever.eu` 我方出口走不通 → 拿不到价格。**

> ⚠ 与比利时站**架构完全不同**：BE 走 `sccf` 静态库（同一主机，页面内 fetch 即可）；**DK 走 `cars4ever.eu` 独立 SaaS**（第三方域，独立网络路径）。

| 项 | 内容 |
|---|---|
| 主站 `www.citroen.dk` | ✅ **200**（Akamai `23.214.22.230`，`robots.txt` 200）—— Adobe AEM（`x-dispatcher`/`x-vhost: publish`） |
| 站点性质 | **纯 C 端电车站**：`ë-C3` / `ë-C3 Aircross` / `ë-C4` / `ë-C5 Aircross` / `ë-Berlingo` / `ë-SpaceTourer`；商用车 `Berlingo Van`/`Jumpy Van`/`Jumper` 在 `/erhverv/varevogne/`。**无燃油乘用车**（丹麦市场 Citroën 只卖电车） |
| 价格页 | `/information/prislister/<slug>-priser_specs.html`（如 `e-c3-priser_specs.html`）—— **正文空壳，价格靠 iframe 渲染** |
| **★ 价格 widget（iframe）** | `https://price-list-public.cars4ever.eu/?brand=citroen&businessType=retail&modelCode=<CODE>&configuratorUrl=...`（从 `<iframe data-src-default="...">` 提取，需二次 `html.unescape`） |
| **★ 真源端点** | **`GET https://pricelists-api.cars4ever.eu/api/models/{modelCode}/{businessType}`**（如 `/api/models/Ny_%C3%AB-C3/retail`）——**无需鉴权**，由 widget 内 axios（`baseURL=QD` 常量）发起 |
| **❌ 阻断点** | `pricelists-api.cars4ever.eu` → **Azure 丹麦东部** `9.205.42.0`（`waws-prod-dke-003-0baa.denmarkeast.cloudapp.azure.com`）→ **TCP 443 我方出口 BLOCKED**（`/dev/tcp` 测不通、curl `000`、IPv4/IPv6 均不通） |
| **⚠ 假阳性陷阱（务必记住）** | 浏览器里 `on('request')` **能看到该请求被发出**，但**永远收不到 `response`，也收不到 `requestfailed`** —— 这是 **TCP 黑洞**（连接挂死）的典型特征。**"请求已发出" ≠ "能拿到数据"**；必须验证到 **RESP 或至少 err/warn** 才算真通 |
| **对照证明非我方 IP 被封** | `price-list-public.cars4ever.eu`（`150.171.110.68`，Azure Front Door）**200 通**；`brand-config.cars4ever.eu`（同 IP 段）**200 通**；`20.105.224.35:443` **OPEN** → **不是全站 IP 拉黑，是特定 Azure 区域 IP 的路由不可达** |
| **连官网自己也渲染不出** | 在真实 `www.citroen.dk/information/prislister/e-c3-priser_specs.html` 页面里，widget 同样只发请求不收响应、iframe 空白（`innerText` 为空）→ **在我方网络下，官网用户视角的表格也是空的**，并非我方抓取姿势问题 |
| **DSL API 旁证（另一条死路）** | 首页嵌入 `dsl.api.stla-aws.net/v1/trimdetails/d1/citroen/denmark/dk/configdetails` → **CloudFront 403**（`Request blocked`），带 Referer/Origin/UA 均无效 |
| `interaction.citroen.dk`（配置器） | 需 `modelCodes` 参数；本项目未深入（价格已定位在 cars4ever，无必要） |
| **多品牌共享平台** | `brand-config.cars4ever.eu/api/brand-websites.json` 列出丹麦全部 Stellantis 品牌（peugeot/citroen/ds/opel/fiat/jeep/alfaRomeo/mitsubishi/hongqi/voyah/navor/leapmotor/exlantix/skyworth）→ **该 API 若可通，是一次性覆盖多品牌的钥匙**（可惜网络不通） |
| 交付结果 | **未产出**（数据源不可达） |

**★ widget 激活姿势（供将来网络恢复时复用）**

widget 不在被 iframe 嵌入时不会发请求。本地复现需自建宿主页并注入 `window.xprops`：

```html
<script>window.xprops={brand:'citroen',modelCode:'Ny_ë-C3',businessType:'retail',
  originalLocation:'https://www.citroen.dk/...'};</script>
<iframe src="https://price-list-public.cars4ever.eu/?brand=citroen&businessType=retail&modelCode=Ny_%C3%AB-C3"></iframe>
```

- `modelCode` 从官方价格页 `<iframe data-src-default>` 里取（形如 `Ny_ë-C3`）
- `brand-config.cars4ever.eu/api/brands.json` 给出全部品牌 code

> **排查心法**：遇到"请求发出却无响应"时，**别急着报成功**。用 `/dev/tcp/<ip>/443` 直连测端口，并检查 `on('response')` 是否真的触发过。同域名的其它子域（如 `brand-config`）能通，说明是**特定 IP/区域的路由阻断**，而非整体封锁。

---

### CUPRA（DK 丹麦 `www.cupraofficial.dk`：全站按 IP 封锁，无解）❌

**结论：采集失败，无可用绕行路径。与 SEAT 是同一套 WAF 策略、同一个错误页模板。**

| 探测项 | 结果 |
|---|---|
| `curl -4 https://www.cupraofficial.dk/` | **403 `Request Denied`**，响应体 **261 字节**，**直接回显我方 IP** `Client IP : 43.142.67.79` |
| Playwright headed + xvfb | **403**（出口 IP 变 `101.35.42.136`，**动态出口 IP 同样被拦** → 按 IP 段而非单个 IP 封） |
| `/robots.txt` · `/sitemap.xml` · `/favicon.ico` | **全 403**（连 robots 都拒 → 确认整站按 IP 拦，非路径/指纹问题） |
| `/modeller` · `/biler` | 403 |
| 换 UA（Mac Safari / Googlebot / curl）· HTTP/1.1 · 补全浏览器头 | **全 403** → 换 UA 是徒劳 |
| IPv6 | 不通（000） |

**403 响应头特征（识别这套 WAF 的指纹）**

```
HTTP/1.1 403 Forbidden
Content-Length: 261
Access-Control-Allow-Origin: *
x-req-uri: /
x-rewrite: /
Alt-Svc: h3=":443"; ma=93600
```

> `Access-Control-Allow-Origin: *` + `x-req-uri` + `x-rewrite` + `Request Denied` 错误页 + 回显 `Client IP` + `Event ID` = **与 SEAT 段完全同款**。见到这组特征即可判定：IP 级封锁，**直接止损**。

**域名解析与跳转链（已闭合，无后门）**

| 域名 | IP / 归属 | 状态 |
|---|---|---|
| `www.cupraofficial.dk` | `23.210.216.171` — **Akamai**（`e320677.dscb.akamaiedge.net`） | **403**（真站，被拦） |
| `cupra.dk`（apex） | `20.105.224.35` — Azure + **Microsoft-IIS/10.0** | 301 → `www.cupra.dk` |
| `www.cupra.dk` | 同上 IIS | 301 → `www.cupraofficial.dk` → **最终仍 403** |
| `api.cupraofficial.dk` | **NXDOMAIN** | 不存在（BE 的 `api.cupra.be` 解法在 DK **无对应**） |
| `cupradanmark.dk` | `195.249.218.79`（CSP 里暴露的域名） | 连接 **000**（不通） |
| `www.cupraofficial.se` / `.no` / `.com` | — | **全 403**（同一 WAF 策略覆盖多市场） |

**关键对照 —— 直接推翻「是我方 IP 质量差」的假设**

| 对照项 | 结果 | 说明 |
|---|---|---|
| `api.cupra.be`（比利时，**已知可用**） | **404**（不是 403） | 404 = 服务端正常应答，仅路径不存在 → **我方 IP 在 CUPRA 体系里完全没被拉黑** |
| `www.cupra.be` | **308** | 正常重定向 |
| `www.cupraofficial.dk` | **403** | 同一 IP、同一时刻 → **是 DK 站特有的封锁策略** |

> **这不是 IP 质量问题**。同一个出口 IP 访问 CUPRA 比利时服务端应答正常（404/308），访问 CUPRA 丹麦被拒（403）。**封锁由站点侧按市场/域名策略施加**。

**⚠ `cupra.dk` ≠ 价格站（别被 IIS 200 骗进去）**
`cupra.dk` 解析到 Azure IIS，**不被 WAF 拦**，一度看起来像可利用入口，实际是**企业用车跳板站**：`/modeller/` → 跳 `/firmabil/` → **404**，无 C 端车型价格。且它最终仍 301 回 `www.cupraofficial.dk` 被拦。

**第三方源（可访问但不符合口径，不采）**
`nordiskbil.com`（有 Tavascan / Raval 丹麦价）、`biler.nu` 均可访问 —— 但 **AGENTS.md 要求「官网官方建议零售价」**，经销商/媒体源不采。

**绕行结论**
- curl、浏览器、换 UA、换路径、换邻站（SE/NO/COM）、API 子域、CSP 泄露域名 —— **全部试过，全部失败**
- 唯一可行路径：**请在本地浏览器打开官网取数**（`Export HAR` / `Save page as` / `Copy as cURL` 回传），或**换一个可访问的邻站市场**
- **不主动采第三方源**

> **心法复用（与 SEAT 段同）**：`robots.txt` 都 403 → 整站 IP 级封锁；先做**跨市场对照**（同一 IP 访问同品牌别的市场是否正常）来区分「我被打黑」与「该站策略」，再决定止损还是继续挖。

---

### MG（DK 丹麦 `www.mgmotors.dk`：Cloudflare 但不拦，WordPress + 经销商配置器）✅

| 项 | 内容 |
|---|---|
| **可达性** | `curl -4` 直连 **200**，无需浏览器（注意必须 `-4`） |
| **★ 站性质** | **Nellemann 经销商平台**（`nellemannapi.dk`）+ WordPress `mgmotors-configurator` 插件；后台数据源 `nellemann.cloud12.structpim.com`（StructPIM），**不是 MG 官方直营** |
| **车系总览** | `https://www.mgmotors.dk/modeller/` → 8 车系（注意 `/biler` 会重定向到库存页，`/biler/` 才是车系列表） |
| **车系页** | `https://www.mgmotors.dk/biler/<slug>/`：只有「fra xxx kr」起价，**版本不全** |
| **★ 真源（配置器）** | `https://mgmotors.dk/bestil/<slug>/` 页面内 **`data-react-props="{...}"`**（HTML 转义）→ `json.loads(html.unescape(...))`，含 `engineTransmissions[]` **全部版本 + 绝对价** |
| **★ 价格字段** | `engineTransmissions[].prices[]` 里 **`price_type == "SuggestedRetailPrice"`**（官方建议零售价 ✔）<br>取 `original_price`（= 未折扣 SRP）优先；`price` 是含促销后的价 |
| **★ 促销陷阱** | `campaign_retail_prices[]` 非空 → `price` 是折后价，**不采**。实证：MGS5 EV Comfort Long Range `price=199999` / `original_price=224999` / campaign value=199999 → **取 224999** |
| **★ 多条 SRP 记录** | 同一版本可能有 **2-3 条 `SuggestedRetailPrice`**（调价历史，如 249999/224999/224999）→ 取 `original_price` 最稳，勿盲目取第一条 |
| **型号名拼法** | `variant.name` + `engineTransmissions[].raw_name`（续航/发动机）拼接，如 `Comfort` + `Standard Range` = `Comfort Standard Range`；HS 特殊：`Luxury 1.5 T-GDI PHEV Automatic 272hk` |
| **年款** | `engineTransmissions[].model_year`（**真实年款**，非版权年）：MG4/IM5/IM6 = 2026/2027，MGS5/MGS6/HS = 2025，Cyberster = 2024 |
| **车系拆分** | 官网 gamma 页把 **MG4 EV** 与 **MG4 EV Urban** 列独立卡片（价格区间不重叠）→ 分开成两个车系 |
| **渲染坑** | 订购页含大量 DoubleClick/GA 脚本，`networkidle`/`domcontentloaded` **必超时** → 用 `waitUntil:'commit'` + 拦截第三方域名（只放行 `mgmotors.dk`）+ 等 25s |
| **slug 清单** | `mg4-ev` `mg4-ev-urban` `mgs5-ev` `mgs6-ev` `mg-im5` `mg-im6` `mg-cyberster` `hs` |
| **交付结果** | **19 条 / 8 车系**（2026-10-08，8 列含燃油分类；HS 为 PHEV，其余 BEV） |

**抓取骨架**：
```js
// 只放行 mgmotors.dk，其余 abort，否则广告脚本卡死
await pg.route('**/*', r => /mgmotors\.dk/.test(r.request().url()) ? r.continue() : r.abort());
pg.goto(`https://mgmotors.dk/bestil/${slug}/`, {waitUntil:'commit', timeout:90000}).catch(()=>{});
await pg.waitForTimeout(25000);
fs.writeFileSync(`render_${slug}.html`, await pg.content());
```
```python
# 解析
d = json.loads(html.unescape(re.search(r'data-react-props="([^"]+)"', h).group(1)))
for et in d['engineTransmissions']:
    msrp = et['original_price']          # 未折扣 SRP
    if et.get('campaign_retail_prices'): # 有促销 → original_price 仍正确
        pass
```

> ⚠️ **该站无官方价格表 PDF**（仅质保书），版本价只在配置器里，**必须走 `data-react-props`**。

---

### Nissan（DK 丹麦 `www.nissan.dk`：**采集失败，IP 级风控**）❌

| 项 | 内容 |
|---|---|
| **现象** | `curl -4` 返回 **403**，正文是丹麦语维护页 *"Site under vedligeholdelse"*；**浏览器同 IP 也一样**，疑似站点挂了 |
| **★ 真相** | **不是站点维护，是我们的出口 IP 被 CloudFront 风控**。用户在本地（丹麦/欧洲 IP）访问**完全正常** |
| **★ 识别特征** | ① `x-cache: Error from cloudfront` + `x-amz-cf-pop: FRA56`（边缘按 IP 策略拒绝，**源站若真挂应是 5xx**）<br>② 全站 403 含 `robots.txt` / `sitemap.xml`<br>③ 页面 `last-modified` 是**几个月前**（本次 2026-03-13）、`age` 数万秒 → 静态缓存维护页 |
| **★ IPv6 假死** | `www.nissan.dk` 解析出**全是 IPv6**，curl 默认优先 v6 会直接 **000**（像"域名不存在"）→ 必须先试 **`curl -4`** 再看真实状态码 |
| **其它域名** | `build.nissan.dk`（希腊站配置器解法）在 DK **NXDOMAIN**；`configurator.`/`dk.`/`assets.` 子域均不存在 |
| **API 旁路** | `api.nissan.dk` 存在（AWS 都柏林，**不过 CloudFront**），返回 Apigee 网关报错 `ecommerce_vhost_sslrouter` → **不拦 IP**，但需要正确的 proxy base path（未破解） |
| **结论** | 本环境**无法采集**；需用户本地取数（Export HTML / Copy as cURL）或换邻站 |
