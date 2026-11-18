# 巴西 BR — 站点坑位详段

> 市场码 BR · 26 段 · 品牌：Agrale / Effa Motors / Ram / Troller / Jeep / MINI / BMW / Audi / Porsche / Avatr / Aston Martin / Mercedes-Benz / Honda / Peugeot / Volkswagen / Toyota / Ford / GAC / Aion / Hyptec / BYD / Fiat / ZEEKR / Geely / Land Rover / JAC Motors / Jaguar / Ferrari
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-11-17 · 文中接口参数 / token / 车型 id 均为当时实测值，必须现取

## 巴西跨品牌规则（2026-11-18 首批 41 份成品复盘）

- **价格口径**：采 `Preço Público Sugerido` / `Preço de Venda` / `Preço Total`；`Preço promocional`、`Ofertas`、`taxa 0%`、`bônus` 后的价一律不采。`a partir de` 若是官网唯一价 = **起价**，按车系级交付并在交付说明注明。
- **千分位**：点号千分位 + 逗号小数，保留官网小数位（多为 `,00`），无货币符号：`139.990,00`。
- **年款**：官网常用 `ano/modelo`（`26/27`、`2026/2027`）。主表年款只写**模型年（第二个）**（`26/27→2027`、`26/26→2026`），双年份原文逐字进副表「官网原文」；主表/副表年款列都不得含 `/`。
- **品牌归属**：`gacgroup.com/pt-br` 同时卖 GAC / Aion / Hyptec → **按品牌拆表**；集团汇总表仅客户明确要求时交，文件名标 `_集团`，不与子品牌表同目录共存。
- **交付目录**：一个品牌只留一份最终文件；`_vN`、同日重抓、独立「年款」单表都是中间态（首批 41 份里 12 份是重复/中间态，GAC-Group 与三份子品牌表行集完全重叠）。

---

### Agrale（BR 巴西 `www.agrale.com.br`：**官网全站不公布价格；37 个在售产品型号，MSRP 全填 `官网无价格`**）⚠️ 无价格出表

- **可达性**：`curl --ssl-no-revoke` 直通 200（PHP SSR，无 WAF）；产品页 `/pt/produtos/{caminhoes,tratores,chassis-para-onibus,utilitarios}` 均 200。
- **★ 在售范围（37）**：Caminhões 8 · Tratores 13 · Chassis para Ônibus 7 · Utilitários 9（含 4 款民用 Marruá + 5 款军用 Viatura）。**A 26.000 标 `Pré-Venda`**，可订，计入；无配置器、无价格总表。
- **★ 取价结论：官网不标价**。全站产品页无 `R$` / `preço` / `valor` / `a partir de` 价格字段；只有规格参数与 `Rede Agrale` / `Fale Conosco` 入口。首页唯一 `R$ 450 mil` 是**融资额度**，不是车价 → MSRP 全填 `官网无价格`。
- **年款**：产品页/页脚无 `MY` / `modelYear` / `ano modelo`；`© Agrale S.A 2025` 是版权年 → 全部「官网无年款」。
- **燃油**：Caminhões / Tratores / Chassis / Utilitários 均 Diesel；型号名带 `Gás` 的 3 款（A 11.000 Gás、MA 11.0 Gás、Trator Rebocador 4100 Gás）按 **LPG（CNG）** 归，官网未再细分。
- **交付结果**：`Agrale_BR_官网价_20261117.xlsx`，**37 条 / 4 大类**，MSRP 全 `官网无价格`；年款全「官网无年款」；Diesel 34 · LPG 3。
- **实测**：2026-11-17
- **来源**：`https://www.agrale.com.br/pt/produtos/caminhoes`；`…/tratores`；`…/chassis-para-onibus`；`…/utilitarios`
- **原文**：`Tratores, Caminhões, Chassis, Utilitários e Motores`；`Rede Agrale`；`Fale Conosco`；`Crédito de até R$ 450 mil, taxas a partir de 1,5% a.a. e até 7 anos para pagar.`（融资，不是车价）

---

### Effa Motors（BR 巴西 `www.effamotors.com.br`：**Wix 站点；4 款核心 utilitários 均不公布价格，只有 WhatsApp 销售入口**）⚠️ 无价格出表

- **可达性**：`curl --ssl-no-revoke` 直通 200（Wix/Thunderbolt SSR）；`/v21`、`/v22`、`/v25` 均 200。
- **★ 在售范围（4）**：`NOSSOS VEÍCULOS` 菜单只列 **Picape V21 · Picape V21 Baú · Picape V22 · Furgão V25**；首页底部 `BAÚ ISOTÉRMICO / GAIOLA / SUPORTE DE VIDRO` 是货箱/上装类型，不是独立车系。
- **★ 取价结论：官网不标价**。产品页无 `R$` / `preço` / `valor` / `a partir de`；只有 `Ficha Técnica` PDF 与 `Quer comprar um EFFA? Utilize o botão do WhatsApp para falar diretamente com nossa equipe de vendas.` → MSRP 全填 `官网无价格`。
- **年款**：全站无 `MY` / `modelYear` / `ano modelo` → 全部「官网无年款」。
- **燃油**：V21 / V21 Baú / V22 / V25 的 Ficha Técnica 均写 `MOTOR 1.5L – DOHC 16V`、`Gasolina (E22)` → **Gasoline**。
- **交付结果**：`Effa-Motors_BR_官网价_20261117.xlsx`，**4 条 / 4 车型**，MSRP 全 `官网无价格`；年款全「官网无年款」；燃油全 Gasoline。
- **实测**：2026-11-17
- **来源**：`https://www.effamotors.com.br/`；`…/v21`；`…/v22`；`…/v25`；各车型 Ficha Técnica PDF
- **原文**：`NOSSOS VEÍCULOS`；`Quer comprar um EFFA? Utilize o botão do WhatsApp para falar diretamente com nossa equipe de vendas.`；`Combustível Gasolina (E22)`

---

### Ram（BR 巴西 `www.ram.com.br`：curl 403；配置器静态价格 API 直出全量目录价，⚠ 预约接口是促销价）✅

- **可达性**：`curl` 对 `www.ram.com.br` 返回 **403**（Akamai），真浏览器可开；配置器背后的 `mvs-service` / `price-service`（`*.k8s.fcalatam.com.br`）可**同源 fetch**。
- **在售车系（5）**：`/picapes.html` 与首页卡 = **Rampage · Dakota · 1500 · 2500 · 3500**；配置器 `picapes/<model>/monte.html`。
- **★ 版本全集**：`GET https://mvs-service.k8s.fcalatam.com.br/mvs?brand=RAM&model=<code>&year=<year>&market=pt-BR&versionsShown=&excludeGrouped=true&includeInactive=false` → `code` / `versionName` / `year` / `fuel` / `engine` / `fullDescription`。车型码：**Rampage 591 · Dakota 539 · 1500 575 · 2500 570 · 3500 573**。
- **★ 目录价（采这个）**：`GET https://price-service.k8s.fcalatam.com.br/price?mvsCode=<code>&year=<year>&country=BR&state=SP&city=S%C3%A3o+Paulo` → `price` = 未折扣目录价，与配置器版本卡 `De: R$ …` 逐一吻合。
- **⚠ 促销接口**：`GET /price/reservation?mvsCode=…&coatingCode=&colorCode=<c>&year=…&country=BR` 返回的是**促销价**（`price`），法务文案里同时写 `no valor à vista de: R$ X, por: R$ Y`——X 才是目录价、Y 是促销价；**不要用 reservation 的 `price`**。
- **⚠ 必须给巴西州/市**：页面默认按浏览器定位（实测落到 US-OR），版本卡会显示 `Valor indisponível no momento`；直接调 `/price` 时带 `state=SP&city=São Paulo` 即可。
- **年款与旧年款过滤**：取 mvs 的 `year` 字段；当前 UI 组 = **Rampage/Dakota 2027**、**1500/2500/3500 2026**。⚠ Dakota 的 `versionName` 里 Warlock/Laramie/Night 仍带旧字串 `2026`，但 code 以 `…11` 结尾、`seriesCode=1`，属 2027 组；2026 组（`…10`）是旧年款库存，按“旧年款过滤”不入表。Rampage 2026 组（Bighorn/R/T 2026）同理过滤。
- **燃油**：`Diesel` → Diesel；`Gas` / `Flex`（2.0 Turbo Flex）→ **Gasoline**（封闭词表无乙醇/Flex 项，不写 Dual Fuel）。
- **版本名**：用配置器卡面逐字（如 `RAMPAGE BIG HORN 2.2 DIESEL 2027`、`DAKOTA LARAMIE NIGHT EDITION 2.2 DIESEL AT`）；Dakota 卡面不带年式，年款取 mvs `year`。
- **价格格式**：巴西原生 `R$ 230.990,00` → 表内 `230.990,00`（`--money euro`，不带符号）。
- **交付结果**：`Ram_BR_官网价_20261117.xlsx`，**16 条 / 5 车系**（Rampage 5 · Dakota 4 · 1500 3 · 2500 2 · 3500 2），230 990–679 990；燃油 Diesel 11 · Gasoline 5。
- **实测**：2026-11-17
- **来源**：`https://www.ram.com.br/picapes.html`；`https://www.ram.com.br/picapes/<model>/monte.html`；`https://mvs-service.k8s.fcalatam.com.br/mvs?...`；`https://price-service.k8s.fcalatam.com.br/price?...&state=SP&city=S%C3%A3o+Paulo`
- **原文**：`De: R$ 285.990,00` / `POR: R$ 249.990,00`（Dakota Big Horn）；`no valor à vista de: R$ 230.990,00, por: R$ 199.990,00`（Rampage Big Horn 法务文案）；`"year":"2027"`（mvs）

---

### Troller（BR 巴西 `www.troller.com.br`：仅留档站点，官方已宣布 2021-09 停产，全站无价）✅

- **可达性**：`curl` 200；`/conheca-o-carro` 展示 **Troller T4**，两个版本 **XLT MT / XLT AT**（3.2L Diesel 200 cv，4x4）。
- **★ 停销依据**：官方 `/comunicado` 逐字 `A Ford encerrará a produção de veículos Troller ao final de setembro [2021] e a produção de peças ao final de novembro de 2021`；官网仅保留服务/配件/召回页面。
- **价格**：车型页、配置页、全站均 **0 个价格字段**（`/monte-o-seu` 已 404）→ `官网无价格`；是否停销 = **是**。
- **年款**：全站无 `ano-modelo` / `ano` 标注 → `官网无年款`（2021 是停产时间，不是年款）。
- **交付结果**：`Troller_BR_官网价_20261117.xlsx`，**2 条 / 1 车系**（T4 XLT MT · XLT AT），均为 `官网无价格` / 停销。
- **实测**：2026-11-17
- **来源**：`https://www.troller.com.br/conheca-o-carro`；`https://www.troller.com.br/comunicado`
- **原文**：`A Ford encerrará a produção de veículos Troller ao final de setembro e a produção de peças ao final de novembro de 2021`

---

### Jeep（BR 巴西 `www.jeep.com.br`：curl 直通；MVS 版本 + price-service 目录价一次拿全）✅

- **可达性**：`curl`（含 `--ssl-no-revoke`）对首页/车型页/`robots.txt` 均 **200**，无 WAF；sitemap `https://www.jeep.com.br/sitemap.xml` 可读。
- **在售车系（6）**：`Renegade`（model **611**，MY2027）· `Compass`（**675**，2027）· `Commander`（**671**，2027）· `Avenger`（**657**，2027）· `Wrangler`（**685**，2026）· `Gladiator`（**559**，2026）。`/wrangler.html`、`/gladiator.html` 在 sitemap 内，猜 `/wrangler/` 会 404。
- **★ 版本全集**：`GET https://mvs-service.k8s.fcalatam.com.br/mvs?brand=JEEP&model=<model>&year=<year>&market=pt-BR&versionsShown=&excludeGrouped=true&includeInactive=false` → `code` / `versionName` / `year` / `fuel` / `engine`。
- **★ 目录价（采这个）**：`GET https://price-service.k8s.fcalatam.com.br/price?mvsCode=<code>&country=BR&year=<year>` → 顶层 `price` = 该版本 MSRP（BRL）。⚠ 参数是 **`country=BR`**，传 `market=` 会 400（报 `Parameter conditions "mvsCode, country, year" ... not met`）；`parts[]` 是选装/配件价，不是车价。
- **⚠ 促销/金融**：车型页大量 `R$` 是 **financiamento**（entrada + 24 parcelas、valor final、IOF、tarifa），不是 MSRP；只取 price-service 顶层 `price`。
- **燃油**：MVS `fuel`：`Flex` → Gasoline（巴西乙醇/汽油双燃料按官网常规归 Gasoline，不归 Dual Fuel）；`Flex Hybrid` → MHEV；`Diesel` → Diesel。
- **年款**：MVS 逐版本 `year` 字段即年款（2027/2026），车型页 `monte` 链接 `year=` 与之一致。
- **命名（以配置器为准）**：取 `monte.html#versao` 版本卡逐字文本，不拼 MVS `engine`。Compass：`COMPASS SPORT FLEX 2027` / `COMPASS LONGITUDE FLEX 2027` / `COMPASS BLACKHAWK HURRICANE FLEX 2027` / `COMPASS LONGITUDE NIGHT EAGLE MHEV 2027` / `COMPASS SERIE S MHEV 2027`（**前三个带 FLEX，后两个只写 MHEV**，与配置器一致）；Commander Blackhawk 为 `COMMANDER BLACKHAWK HURRICANE 4X4 FLEX`（4X4 在 FLEX 前）；Wrangler 为 `WRANGLER RUBICON 4X4`；Avenger 的 Longitude 卡原文就是 `LONGITUDE T200 MHEV CVT`（无 AVENGER 前缀，照留）。⚠ 配置器卡价格因浏览器定位显示 `Valor indisponível no momento`，价格仍取同一配置器后端的 price-service。
- **交付结果**：`Jeep_BR_官网价_20261112.xlsx`（最终版；v1/v2 已归档），**20 条 / 6 车系**（RENEGADE 5 · COMPASS 5 · COMMANDER 5 · AVENGER 3 · WRANGLER 1 · GLADIATOR 1），119 990–529 990 BRL；燃油 Gasoline 10 · MHEV 9 · Diesel 1。
- **实测**：2026-11-12
- **来源**：`https://www.jeep.com.br/sitemap.xml`；`https://mvs-service.k8s.fcalatam.com.br/mvs?...`；`https://price-service.k8s.fcalatam.com.br/price?...`
- **原文**：`"year":"2027"`；`"fuel":"Flex Hybrid"`；`"versionName":"COMPASS LONGITUDE NIGHT EAGLE MHEV 2027"`；`"price":174990.0`

---

### MINI（BR 巴西 `www.mini.com.br` 官方价格表 PDF：**Ano/Modelo 列明确，18 个版本逐条有价**）✅

- **可达性**：`www.mini.com.br` curl **000**（BMW Akamai），但价格 PDF 可在真浏览器/CDP 内同源 fetch；Legal 页挂当月 PDF 链接。
- **★ 主源（用户指定）**：官方价格表 PDF `https://www.mini.com.br/content/dam/MINI/marketBR/mini_com_br/pdf/mini_tabela_de_precos_outubro_2026.pdf.asset.1791306327823.pdf`，第 1 页逐字 `MINI BRASIL Preços Públicos válidos para o período de 01/10/2026 à 31/10/2026.`；表列 = `Modelo | Versão | Ano/Modelo | Preço Publico Sugerido`。
- **★ 年款**：直接取 PDF 的 **Ano/Modelo 单值**（2026 或 2027），不拼 ano_fabr/ano_modl；例：Cooper E 2026、Cooper S 3P Exclusive 2027、JCW 2027、Aceman E 2026、JCW Countryman ALL4 Exclusive 2027。
- **★ 版本/价格（18）**：Cooper E 264 990/2026 · Cooper SE 314 990/2026 · JCW E 349 990/2026 · Cooper S 3P Exclusive 274 990/2027 · 3P - Top 314 990/2027 · 3P Sport 324 990/2026 · JCW 364 990/2027 · JCW Victory Edition 389 990/2027 · JCW GP Inspired 394 990/2027 · Cooper S Cabrio 349 990/2026 · JCW Cabrio 389 990/2026 · Cooper S 5P Exclusive 289 990/2027 · 5P Top 329 990/2027 · Aceman E 275 990/2026 · Aceman SE 325 990/2026 · JCW Aceman E 359 990/2026 · JCW Countryman ALL4 Exclusive 399 990/2027 · JCW Countryman ALL4 439 990/2026。
- **交叉核对（不覆盖主源）**：mini4u 计算器 `POST /calc/api/<nid>/info` 与 mini.com.br 车型页促销条款只作核对；⚠ mini4u 年款多为 `2025/2026` pair、促销条款为 `2025/2026`–`2026/2027`，与官方价目表单值 2026/2027 不一致时**以价格表 PDF 为准**。实测 Cooper SE：mini4u 显示 `A partir de R$ 310.990,00`（其 API `ano_fabr/ano_modl=2025/2026`），官方 2026-10 价目表为 `MINI Cooper SE 2026 R$ 314.990` → 差 4 000，属模拟器旧表/库存年款口径，不是 `Preço Público Sugerido`。
- **燃油**：Cooper E/SE、JCW E、Aceman E/SE、JCW Aceman E = BEV；其余 12 条 Gasoline。
- **交付结果**：`MINI_BR_官网价_20261117.xlsx`（最终版；v1 与 20261112 已归档），**18 条 / 12 个型号组**，264 990–439 990 BRL；燃油 BEV 6 · Gasoline 12。
- **实测**：2026-11-17
- **来源**：`https://www.mini.com.br/content/dam/MINI/marketBR/mini_com_br/pdf/mini_tabela_de_precos_outubro_2026.pdf.asset.1791306327823.pdf`（第 1 页）；`https://www.mini.com.br/pt_BR/home/footer/Legal.html`
- **原文**：`MINI BRASIL Preços Públicos válidos para o período de 01/10/2026 à 31/10/2026.`；`MINI Cooper E 2026 R$ 264.990`；`MINI Cooper S 3P Exclusive 2027 R$ 274.990`；`MINI JCW Countryman ALL4 Exclusive 2027 R$ 399.990`；`Os preços público sugeridos não consideram valores de pintura e/ou opcionais.`

---

### BMW（BR 巴西 `www.bmw.com.br/pt`：**curl TLS reset，真浏览器可开；all-models 卡片隐藏报价条款逐版本写 `ano/modelo`，与配置一一对应**）✅

- **可达性**：`curl --ssl-no-revoke` 对 `www.bmw.com.br` 连接被 reset（与 BMW IN 类似的边缘拦截）；browser MCP 正常（2026-11-17）。
- **★ 在售全集**：`/pt/all-models.html` 卡片区（`.cmp-allmodelscard`）共 32 张；其中 23 张有价卡展开为 **30 个有价配置**（X1、320i、M4、M3、M2 各卡内含 2–3 个配置），加 2 个 `Novo` 无价版 = **32 条 / 20 车系**。`Condições Especiais` 区重复前 5 张卡（同内容同价），按配置名+价去重。
- **★ 取价源（隐藏报价条款，不是只看 `A partir de`）**：每张卡 `textContent` 内含逐配置价格句：`*Preço público sugerido da versão <版本>, ano/modelo <YYYY/YYYY>, de R$ <价>, para pagamento à vista, pintura sólida. Frete incluso.` —— **一句同时给「具体配置 + 年款 + 售价」，一一对应**。可见的 `A partir de R$` 只是该卡最低配起价（X1 卡最低 GP、M4 卡最低 Competition），**不能代表卡内其他配置**。
- **⚠ 不要拿金融库存条款当年款**：同卡还有 `Condições válidas para o BMW X5 ..., 2025/2025 e 2025/2026 -0 km` 这类清库/金融批次说明，可能列出多个旧年款；只取 `Preço público sugerido ... ano/modelo` 那一句。
- **★ 配置器交叉核对（2026-11-17，售价以配置器为准）**：`configure.bmw.com.br` 页面文本在 **shadow DOM**，`document.body.innerText` 返回空；要递归 `shadowRoot` 读 `CON-MODAL-LINE-SELECTION`（点 `Ver todas as versões do modelo`）。核对一致：X1 334.950 / 367.950 / 389.950 · 320i 356.950 / 369.950 / 391.950 · 330e 467.950 · M4 915.950 / 1.022.950 · X3 528.950 / 659.950 · Série 2 334.950 / 492.950 · Série 1 462.950。⚠ 配置器线名会串：X2 的 `X2 M35i xDrive` 标 415.950、`Modelos M` 标 545.950；M3 有 3 条线（`Modelos M` 894.950、`M3 Competition` 897.950、`M3 Competition Track` 1.003.950）；M2 只露 `M2 Coupe Track` 740.950。**售价按 skill 优先级取配置器**（M3 Competition 897.950 / Track 1.003.950；M2 Track 740.950）；配置器无 ano/modelo，**年款仍取 all-models 报价句**；配置器未露出的线（如 M2 Coupé 690.950）用 all-models 价并注明。
- **★ 版本 / 价 / 年款（2026-11-17）**：X5 xDrive50e M Sport 868.950（2026/2026）· X3 M50 xDrive 659.950 · X3 30 xDrive M Sport 528.950（2026/2027）· X1 sDrive20i GP 334.950 / X Line 367.950 / M Sport 389.950（2026/2027）· 320i GP 356.950（2025/2026）· 320i Sport GP 369.950 / 320i M Sport 391.950 / 330e M Sport 467.950（2026/2026）· M235 xDrive 492.950 · 220 M Sport 334.950（2026/2026）· iX3 50 xDrive 587.950（2026/2027）· iX2 xDrive30 M Sport 495.950（2026/2027）· iX1 xDrive30 M Sport 485.950（2025/2026）· i7 xDrive60 M Sport 1.373.950（2025/2026）· i4 eDrive40 M Sport 582.950（2025/2025）· 530e M Sport 647.950（2025/2026）· X7 xDrive40i M Sport 1.033.950（2025/2026）· X6 xDrive40i M Sport 892.950（2026/2026）· X2 xDrive20i M Sport 415.950（2026/2027）· X2 M35i xDrive 545.950（2026/2026）· M4 Competition 915.950 / M4 Competition Track 1.022.950（2026/2027）· 420i Cabrio M Sport 514.950（2026/2026）· M3 Competition 897.950 / M3 Competition Track 1.003.950（2026/2026）· M2 Coupé 690.950 / M2 Coupé Track 740.950（2026/2027）· M135 xDrive 462.950（2026/2027）；**BMW iX5 60 xDrive / 新 BMW X5 无价**（卡片仅 `Novo` + `Saiba mais`，无报价条款）→ `官网无价格` + `官网无年款`。
- **燃油**：PHEV 3（X5 50e、530e、330e）· BEV 6（iX3、iX2、iX1、i7、i4、iX5）· Gasoline 23。
- **交付结果**：`BMW_BR_官网价_20261117.xlsx`，**32 条 / 20 车系**；R$ 334.950–1.373.950；2 条 `官网无价格`；年款按官方 `ano/modelo` 对（2025/2025–2026/2027）逐配置填写。
- **实测**：2026-11-17
- **来源**：`https://www.bmw.com.br/pt/all-models.html`（卡片 `textContent` 的 `Preço público sugerido` 段）；`https://www.bmw.com.br/pt_BR/configurador.html`（交叉核对）
- **原文**：`*Preço público sugerido da versão X5 xDrive50e M Sport, ano/modelo 2026/2026, de R$ 868.950, para pagamento à vista, pintura sólida. Frete incluso.`；`Preço público sugerido da versão X1 sDrive20i X Line, ano/modelo 2026/2027, de R$ 367.950`；`Preço público sugerido da versão 320i GP, ano/modelo 2025/2026, de R$ 356.950`；`SUV Novo iX5 Elétrico Saiba mais`

---

### Audi（BR 巴西 `www.audi.com.br/pt`：**curl 403 Akamai，真浏览器可开；总览页 serialized-onegraph-store 给 20 个 carline + minPrice，配置器逐版本给 BRL 价**）✅

- **可达性**：`curl --ssl-no-revoke` 对 `www.audi.com.br` 403 Akamai；browser MCP 正常（2026-11-17）。
- **★ 在售全集（20 carline / 26 版本）**：`/pt/models/` 的分组写 A3 3 · A5 2 · A6 e-tron 2 · Q3 2 · Q5 4 · Q6 e-tron 3 · Q7 1 · Q8 2 · e-tron GT 1；页面 `<script type="x-feature-hub/serialized-onegraph-store">` 递归 `__typename==="CarlineStructureCarline"` 得 20 个 `identifier.id` + `name` + `prices.minPrice` + 配置器 URL。
- **★ 变体价（配置器逐页）**：`/pt/models/<series>/<slug>/configure/` 的 `Etapa 1` 版本卡给 `版本名 + BRL 价格`；用页面 `innerText` 的 `Versão e motorização` 段正则 `([^\n]+)\n\s*BRL\s*([\d.]+,\d{2})`，选项/颜色/“Preço total” 用 stop 词截断。26 个版本全部与总览页 `minPrice` 对得上。
- **★ 年款**：页面正文无 `Ano modelo`；官方 carline identifier 带年份（`a3limo-2026-8Y`、`a6avantetron-2027-GH`），配置器 `pr` 参数同年（A3 `…_2026`、A6 Avant e-tron `…_2027`）→ 19 个 carline 记 2026，A6 Avant e-tron 记 2027。
- **燃油**：A6 Sportback/Avant e-tron、Q6 e-tron、Q6 Sportback e-tron、SQ6 Sportback e-tron、RS e-tron GT performance = BEV；其余 TFSI = Gasoline。
- **交付结果**：`Audi_BR_官网价_20261117.xlsx`，**26 条 / 20 carline**；R$ 314.990–1.339.990；BEV 6 · Gasoline 20。
- **实测**：2026-11-17
- **来源**：`https://www.audi.com.br/pt/models/`；`https://www.audi.com.br/pt/models/<series>/<slug>/configure/`；`https://www.audi.com.br/pt/models/a3/a3-sedan-new/configure/?pr=8YMBUG1MASGEA3_2026%7CA2A2%7CAO`
- **原文**：`serialized-onegraph-store` → `a3limo-2026-8Y` / `minPrice: R$ 314.990,00`；配置器 `Advanced 40 TFSI S tronic BRL 314.990,00`；`a6avantetron-2027-GH` / `pr=GH5AC81MASGEA5_2027…`

---

### Porsche（BR 巴西 `www.porsche.com/brazil/pt`：**主站/配置器 curl 403，官方对比站 `compare.porsche.com/pt-BR` curl 200 可拿全量 40 款**）✅

- **可达性**：`www.porsche.com` 与 `configurator.porsche.com` 对 curl 均 403（后者 919 B 错误页）；`compare.porsche.com/pt-BR` 用 `curl --ssl-no-revoke` 200（约 1.38 MB SSR 全量）。浏览器可开配置器（`browser-use` 正常，2026-11-17）。
- **★ 在售全集（5 车系 / 40 版本）**：官方对比站按车系筛选计数 `911 (12) / Taycan (5) / Panamera (4) / Macan (4) / Cayenne (15)`，同一页 SSR 正好渲染 40 张车型卡（`cursor-pointer  bg-surface`），与计数逐一对上。前一次抓取只渲染 24 张（少了 Cayenne 与 Macan Turbo），**重抓一次拿到 40 张** —— 少卡时先重抓，不要按缺卡出表。
- **★ 取价源（官方对比卡）**：每卡 `<h4 class="prose-heading-md">车型名</h4><p …>De R$ 990.000,00</p>`。⚠ `R$` 与金额之间是 **U+00A0 不换行空格**，正则必须写 `De R\$[\s\u00a0]*([\d.]+,\d{2})`，用普通空格会 0 命中。
- **★ 交叉核对（配置器）**：`configurator.porsche.com/pt-BR/mode/model/<code>` 的 loader 数据与页面金额逐条对上（本轮抽验 25/31 条，含 `9YAAV1 = R$ 900.000,00`）。配置器页顶逐字写明口径：`Valores não incluem frete doméstico. Preços públicos sugeridos. Valores válidos para versões básicas "Pacote Brasil".` → 采「Preços públicos sugeridos」裸车 MSRP，**不含巴西国内运费**。
- **★ 无价 9 款**：911 GT3（992812）/ 911 GT3 Pacote Touring（992822）/ 911 GT3 S/C（992892）与 Cayenne Electric 6 款（X1AAA1 / X1ABB1 / X1ACD1 / X1BAA1 / X1BBB1 / X1BCD1）。对比卡无 `De R$` 段；配置器页 `document.body.innerText` 全文 0 个 `R$`，CTA 为 `Solicitar veículo`（不是 `Comprar`）→ `官网无价格`。
- **★ 年款**：对比卡年份标签 `<p-tag>2027</p-tag>` / `2026`；39 款 2027、Macan 4 为 2026。卡标题里偶带 `(2027)` 后缀（Taycan / Macan / Cayenne / GT3），是年份重复标注，型号名去掉该后缀、年份入「年款」列。
- **燃油**：官方卡标签 `Gasolina` 15 / `Elétrico` 15 / `Híbrido` 10；`Elétrico`→BEV；`E-Hybrid` 车型（Panamera E-Hybrid 4 + Cayenne E-Hybrid 6）= PHEV；`Híbrido` 10 条全部是 E-Hybrid；其余 `Gasolina`（含 911 T-Hybrid 的 GTS，官方仍标 Gasolina）= Gasoline。
- **交付结果**：`Porsche_BR_官网价_20261117.xlsx`，**40 条 / 5 车系**；R$ 690.000–2.210.000；BEV 15 · PHEV 10 · Gasoline 15；9 条 `官网无价格`；年款 39×2027 + Macan 4 2026。
- **实测**：2026-11-17
- **来源**：`https://compare.porsche.com/pt-BR`（车型卡 + 车系计数）；`https://configurator.porsche.com/pt-BR/mode/model/<code>`（交叉核对/无价判定）
- **原文**：`De R$ 990.000,00`；`Taycan GTS (2027)`；`Híbrido` / `Elétrico` / `Gasolina`；`Valores não incluem frete doméstico. Preços públicos sugeridos. Valores válidos para versões básicas "Pacote Brasil".`；`Solicitar veículo`

---

### Avatr（BR 巴西 `avatr.caoachangan.com.br`：CAOA AVATR 官方进口商站；curl 403，真浏览器读 AVATR 11 两个座位版起价）✅

- **站点性质**：`avatr.caoachangan.com.br` 是 CAOA CHANGAN 的 AVATR 官方进口商站点（页脚 `© Copyright 2026. CAOA AVATR.`），不是 avatr.com 直营；巴西市场官方渠道即此站。
- **可达性**：`curl` 403（WAF），真浏览器可开；`/novos/avatr-11` 为唯一车型页。
- **在售范围（1 车系 / 2 版本）**：**AVATR 11**，按座位数分 **4 lugares / 5 lugares**；无配置器，CTA 为 `Solicite Cotação`。
- **★ 价格**：车型页逐字 `4 lugares: A partir de R$ 619.900`、`5 lugares: A partir de R$ 599.990`；页面无 `De/Por` 折扣字样 → 按目录起价采。
- **年款**：全站无 `ano-modelo` / `MY` / `ano` 标注；页脚 `© Copyright 2026` 是版权年 → `官网无年款`。
- **燃油**：`Bateria de íons 116 kWh`、`578 cv`、WLTP 710 km → **BEV**。
- **交付结果**：`Avatr_BR_官网价_20261117.xlsx`，**2 条 / 1 车系**，599 990–619 900 BRL；燃油全 BEV。
- **实测**：2026-11-17
- **来源**：`https://avatr.caoachangan.com.br/novos/avatr-11`
- **原文**：`4 lugares: A partir de R$ 619.900`；`5 lugares: A partir de R$ 599.990`；`© Copyright 2026. CAOA AVATR.`

---

### Aston Martin（BR 巴西 `configurator.astonmartin.com/BR`：以巴西配置器车型清单为准；公开会话不渲染价格，声明由经销商定价）⚠️ 无价格出表

- **站点性质**：巴西市场配置器 `/BR/model-select`；`GET /models/products/BR` 返回 **16 个衍生版商品**（按 family 分组：Valen / Valhalla / DBX / Vantage / DB12 / Vanquish）。
- **★ 价格结论**：公开会话（未选经销商）**不渲染任何价格**——模板里的 `model-select__pricing` 由 `mhpIfShowPricing` 控制，`isPricingVisible$()` 需要 `uiState.pricingData`（dealer pricing）才显示；免责声明逐字 `Any purchase is subject to the terms and conditions of sale (including price) issued by the particular dealer.` → 全表 `官网无价格`。
- **★ 在售范围（BR 配置器的 16 衍生版 / 6 车系）**：Valen 1（Valen）· Valhalla 2（Valhalla · Valhalla Spider）· DBX 3（DBX GT · DBX S · DBX707）· Vantage 4（Vantage Coupe · Vantage Roadster · Vantage S Coupe · Vantage S Roadster）· DB12 4（DB12 Coupe · DB12 Volante · DB12 S Coupe · DB12 S Volante）· Vanquish 2（Vanquish Coupe · Vanquish Volante）。⚠ 与全球导航不同：BR 配置器**不含** Valkyrie / Valour / Valiant / 25th·60th 周年特别版；含基础 DB12、Vantage、DBX S。
- **年款**：`/models/products/BR` 与配置页只有 `modelCode` / `DERIVATIVE_NAME`，无 `year` / `MY` / `ano modelo`；`© Aston Martin 2026` 是版权年 → `官网无年款`。
- **燃油**：DBX/Vantage/DB12/Vanquish/Valen = Gasoline（V8/V12）；**Valhalla = PHEV**（官方 `plug-in hybrid`）。
- **交付结果**：`AstonMartin_BR_官网价_20261117.xlsx`，**16 条 / 6 车系**，MSRP 全 `官网无价格`；年款全 `官网无年款`；Gasoline 14 · PHEV 2。
- **实测**：2026-11-17
- **来源**：`https://configurator.astonmartin.com/BR/model-select/M224/AM390`；`https://configurator.astonmartin.com/models/products/BR`；`https://configurator.astonmartin.com/static/assets/translations/en.json`
- **原文**：`Any purchase is subject to the terms and conditions of sale (including price) issued by the particular dealer.`；`"modelCode":"M224"`；`"DERIVATIVE_NAME":"Valen"`

---

### Mercedes-Benz（BR 巴西 `www2.mercedes-benz.com.br`：**curl 403，但 vmos + owcc API 直通；36 个 motorization 逐条有价与 ano/modelo**）✅

- **可达性**：站点 curl **403**（Akamai）；API 域 `api.oneweb.mercedes-benz.com` curl **200**，带 `Referer: https://www2.mercedes-benz.com.br/` 即可。
- **★ 车型全集**：`GET https://api.oneweb.mercedes-benz.com/vmos-api/v1/data/BR/pt/OWF/live?subContext=CONFIGURATOR`（17 个 `vehiclesData`：A Hatchback / C Sedan / GLS / GLA / CLA Limousine / GLC / GLC Coupé / AMG GT 4-door / S Longo / G / GLE Coupé / CLA Coupé / E Sedan / AMG GT Coupé / SL / GLB / GLE）。语言必须是 **`pt`**（`pt_BR` 404）。
- **★ 版本级（优先）**：`GET https://api.oneweb.mercedes-benz.com/owcc-backend/api/v3/pt_BR/CCci/291767b9/entry?proposedStep=MOTORIZATION&typeClass=<series>`；`typeClass` 用 vmos 的 `modelSeries`，带 `-fl` 的要去后缀（W177-fl→W177、X167-fl→X167 等）。返回 `motorizations.tiles[]`：`name`（如 `C 200 AMG Line 26/26`）、`priceInformation.basePrice.price`、`tags[] fuelType`、`modelYear`。
- **★ 年款**：取 tile `name` 末尾 `ano/modelo`（`26/26`→2026/2026、`26/27`→2026/2027、`25/26`→2025/2026）；`modelYear` 的 `806/807/X25` 是销售代码，不是年份。无后缀的 tile（S 580、部分 GLC 53）记 `官网无年款`。
- **★ 燃油**：`tags fuelType`：`Gasolina`→Gasoline、`Diesel`→Diesel、`Híbrido (Gasolina)` 且名称含 `E PERFORMANCE`→**PHEV**（AMG 插混）、其余 `Híbrido`→HEV；`Elétrico`→BEV（本市场暂无）。
- **交付结果**：`Mercedes-Benz_BR_官网价_20261117.xlsx`，**36 条 / 17 车系**，329 900–2 337 900 BRL；燃油 Gasoline 28 · PHEV 6 · Diesel 2；年款 2025/2026–2026/2027 + 3 条无年款。
- **实测**：2026-11-17
- **来源**：`https://api.oneweb.mercedes-benz.com/vmos-api/v1/data/BR/pt/OWF/live?subContext=CONFIGURATOR`；`https://api.oneweb.mercedes-benz.com/owcc-backend/api/v3/pt_BR/CCci/291767b9/entry?proposedStep=MOTORIZATION&typeClass=W206`
- **原文**：`"name":"C 200 AMG Line 26/26"`；`"price":396900`；`"fuelType","value":"Gasolina"`；`"name":"Mercedes-AMG C 63 S E PERFORMANCE 26/26","value":"Híbrido (Gasolina)"`

---

### Honda（BR 巴西 `www.honda.com.br`：**curl 403；选 SP 后调用官方产品 API 可拿 21 个版本全部价格**）✅

- **可达性**：`curl` 对首页/车型页/`robots.txt` 均 **403**（Akamai）；真浏览器/CDP 可开。页面顶部 location-picker 默认/可选 **SP (São Paulo)**；选中后版本价由官方 API 返回。
- **在售车系（10）**：City Sedan · City Hatchback · Prelude · WR-V · HR-V · Civic Advanced Hybrid · ZR-V · Accord Advanced Hybrid · Civic Type R · CR-V Advanced Hybrid；版本 4/5/1/2/4/1/1/1/1/1 = **21 个版本**。
- **★ 价格真源（关键）**：`GET /automoveis/api/produtos/completo?modelo=<machine_name>&uf=SP&timestamp=YYYY_M_D_H` → `<model>.version_features[].colors[].pps.SP.field_pps_preco`；每个版本取**所有颜色中的最低价**（= 页面「A partir de」的纯色价，金属漆 +1 900/2 200 不含）。machine_name：`citysedan` `cityhatchback` `prelude` `wrv` `hrv` `civichibrido` `zrv` `accordhibrido` `civictyper` `crvhibrido`。
- **★ 价格（SP，BRL）**：City Sedan 117 700–154 300 · City Hatchback 117 700–156 400 · Prelude 380 000 · WR-V 149 900–154 900 · HR-V 166 400–214 000 · Civic 266 500 · ZR-V 215 100 · Accord 333 000 · Civic Type R 430 500 · CR-V 353 500。
- **★ 年款（Texto Legal → MY）**：每个车型页底部 `Texto Legal: *As informações contempladas nesta página se referem ao modelo <Model>, ano/modelo YYYY/YYYY.`；按用户规则取**第二个年份**：2025/2026→MY2026、2026/2026→MY2026、2026/2027→MY2027。实测：City Sedan 2026/2027→MY2027 · City Hatchback 2026/2027→MY2027 · Prelude 2026/2026→MY2026 · WR-V 2026/2027→MY2027 · HR-V 2026/2027→MY2027 · Civic 2025/2026→MY2026 · ZR-V 2025/2026→MY2026 · Accord 2025/2026→MY2026 · Civic Type-R 2025/2026→MY2026 · CR-V 2026/2026→MY2026。**不按发布年份/生产年份/页面日期推算**。
- **燃油**：Prelude / Civic / Accord / CR-V = HEV；City Sedan/Hatchback、WR-V、HR-V、ZR-V、Civic Type R = Gasoline。
- **⚠ 页面占位**：未选州时版本卡显示 `A partir de R$ i`、banner `R$ 000.000,00`；这是未定位，不是无价。
- **交付结果**：`Honda_BR_官网价_20261117.xlsx`（最终版；v1/v2 已归档），**21 条 / 10 车系**，117 700–430 500 BRL；燃油 Gasoline 17 · HEV 4；年款 MY2026 6 个车型（Prelude/Civic/ZR-V/Accord/Civic Type R/CR-V）+ MY2027 4 个车型（City Sedan/City Hatchback/WR-V/HR-V）。独立年款表（5 列）是中间态，已归档不交付。
- **实测**：2026-11-17
- **来源**：`https://www.honda.com.br/automoveis/citysedan`；`https://www.honda.com.br/automoveis/api/produtos/completo?modelo=citysedan&uf=SP&timestamp=2026_11_17_10`（其余 machine_name 同上）
- **原文**：`Você está em: SP (São Paulo)`；`"field_pps_estado":"SP","field_pps_preco":"154300.00"`；`modelo City versão EX ... ano/modelo 26/27`

---

### Peugeot（BR 巴西 `www.peugeot.com.br`：**主站 curl 403；真浏览器可开；`monte.html` 的「1. VERSÃO」版本卡逐版本给 MSRP，版本名尾部即 ano/modelo**）✅

- **可达性**：`peugeot.com.br` 302 → `carros.peugeot.com.br/`，curl 403；browser MCP 正常（2026-11-17）。
- **★ 在售全集（5 车系 / 13 版本）**：208（STYLE 1.0 MT / ALLURE T200 AT / GT T200 MHEV AT）· 2008（ACTIVE T200 AT / ALLURE T200 AT / GT T200 MHEV AT）· Partner Rapid（BUSINESS PACK）· Expert（CARGO / VITRE）· Boxer（L3H2 FURGÃO / L3H2 CARGO / COMFORT 17+1 / LUXO 15+1）。
- **★ 取价源（配置器 `monte.html`）**：`https://www.peugeot.com.br/gama/<modelo>/monte.html` → 「1. VERSÃO」列出全部版本 + 版本价（`R$ 103.990,00`），右侧摘要另给 `De:`/`POR:`；**取版本卡价 / De 价，不取 POR 促销价**（208 STYLE 有 89.990 与出租车 75.890 两档促销；2008 GT POR 162.990，版本价 179.990 → 用 179.990）。
- **★ 年款**：版本名尾部直接带 ano/modelo：208/2008 `26/27`、Partner Rapid `26/26`、Expert `26/27` 与 `26/26`、Boxer `25/26`；年款列照写。
- **燃油**：208/2008 的 T200（含 Style/Allure/Active）= Flex → Gasoline；GT T200 MHEV = MHEV；Partner Rapid 1.3 Flex → Gasoline；Expert/Boxer 官方 `2.2 Turbo Diesel` → Diesel。
- **交付结果**：`Peugeot_BR_官网价_20261117.xlsx`，**13 条 / 5 车系**；R$ 103.990–384.990；Gasoline 5 · MHEV 2 · Diesel 6。
- **实测**：2026-11-17
- **来源**：`https://www.peugeot.com.br/gama/peugeot-208/monte.html`；`.../peugeot-2008/monte.html`；`.../peugeot-partner-rapid/monte.html`；`.../peugeot-expert/monte.html`；`.../peugeot-boxer/monte.html`；燃油证据：`peugeot-boxer.html` / `peugeot-expert.html`
- **原文**：`208 STYLE 1.0 MT 26/27 R$ 103.990,00`；`2008 GT T200 MHEV AT 26/27 R$ 179.990,00`；`PARTNER RAPID BUSINESS PACK 26/26 R$ 130.990,00`；`EXPERT CARGO 26/27 R$ 233.590,00`；`BOXER L3H2 CARGO 25/26 R$ 295.990,00`；`Novo motor 2.2 Turbo Diesel`

---

### Volkswagen（BR 巴西 `www.vw.com.br`：**配置器 app 逐版本给 `Preço Total`，完整车型名尾部 `Modelo 2027`；compare 页最多并排 3 个配置**）✅

- **可达性**：`www.vw.com.br` curl 200（AEM SSR），但车型页/总览页 HTML **不含价格**；`configurador.html` 为 JS 应用，价格在选完版本/动力后出现（2026-11-17）。
- **★ 在售全集（12 carline / 35 版本）**：Tiguan（R-Line）· Tera（MPI/Comfort/High/**170 TSI**）· Nivus（Sense/Comfortline/Highline/GTS）· T-Cross（Sense/200 TSI/Comfortline/Highline/Extreme）· Taos（Comfortline/Highline）· Polo Track（Polo Track/Polo Robust）· Polo（Sense/Highline）· Virtus（Sense/TSI AT/Comfortline/Highline/Exclusive）· Jetta（GLI）· Saveiro（Robust CS 100% Etanol/Robust CS/Robust CD/Trendline CS/Extreme CD）· Amarok（V6 Comfortline/Highline/Extreme）· ID.4（Pro）。`Tukan` 仅 `Lançamento`、无配置器；`Golf GTI` 页面 404/无 carline → 均未纳入。
- **⚠ 结构 JSON 会漏 trim（2026-11-18 踩过）**：`model-structure.mofa.json` 的 Tera 只有 3 个 trim（31600/31602/31603），**实际配置器 carline 页是 4 个版本**，漏了 `Tera 170 TSI`（salesGroupId **31601**，`/tera/tera-tsi.app`，R$ 124.290）。structure JSON 只能当索引用，**全集必须以 `<carline>.app` 的「N versões」逐车清点**（Tiguan/Nivus/T-Cross/Taos/Polo Track/Polo/Virtus/Jetta/Saveiro/Amarok/ID.4 清点结果与 JSON 一致）。
- **★ 车型结构源**：`https://www.vw.com.br/pt/tools/model-structure.mofa.json` 给 carlineId + salesGroupId + trimId；`.../model-structure.mofa-cardata.json` 给 `data` 的 nodeId 路径（如 `/tera/tera-mpi`、`/t-cross--carline-/t-cross-highline`）。用它拼配置器 engine 页 URL。
- **★ 取价源（配置器 engine 步）**：`https://www.vw.com.br/pt/configurador.html/__app/<cardata路径>.app?category-app=private&carlineId-app=<id>&salesGroupId-app=<id>&trimName-app=<trim>` → 页面出现 `Preço Total R$ …` 与完整车型名；URL 会回填 `modelId-app` / `modelYear-app`。同页出现两个 `Preço Total` 时（默认油漆加价）**取较低的基价**（Nivus GTS 193.290 vs 194.390；T-Cross Extreme 193.490 vs 194.590）。
- **★ compare 页**：`/pt/compare.html?configurations-app=[…]` 可并排比较，**最多 3 个配置**（第 4 个起被丢弃）；同页给 `R$ … incl. VAT`、完整车型名与 `Modelo 2027`，适合一次拿 2–3 个版本；组合不合法时页面空白，改用 engine 页逐个取。
- **★ 年款**：完整车型名尾部 `Modelo 2027` / `Modelo 2026`（Amarok 为 2026，其余 34 条 2027）；不推断。
- **燃油**：`Gasolina` / `Total Flex` / `Etanol` → Gasoline（巴西 Flex/乙醇按既有 BR 口径归 Gasoline，不写 Dual Fuel）；`Diesel`（Amarok 3.0 V6 TDI）→ Diesel；`Elétrico`（ID.4）→ BEV。
- **交付结果**：`Volkswagen_BR_官网价_20261117.xlsx`（最终版；v1 已归档），**35 条 / 12 车系**；R$ 97.990–399.990；Gasoline 31 · Diesel 3 · BEV 1；年款 34×2027 + Amarok 3×2026。
- **实测**：2026-11-17（2026-11-18 补 Tera 170 TSI）
- **来源**：`https://www.vw.com.br/pt/configurador.html`（`<carline>.app` 版本清点）；`https://www.vw.com.br/pt/configurador.html/__app/tera.app`；`https://www.vw.com.br/pt/tools/model-structure.mofa.json`；`https://www.vw.com.br/pt/tools/model-structure.mofa-cardata.json`；`https://www.vw.com.br/pt/compare.html?configurations-app=…`
- **原文**：`Tera` / `4 versões` → `Tera 170 TSI`；`Tera TSI 170 TSI 116 cv Manual de 5 velocidades 4 portas Modelo 2027` / `Preço Total R$ 124.290,00`；`Nivus Sense 200 TSI 128 cv Automática de 6 velocidades Total Flex 4 portas Modelo 2027` / `Preço Total R$ 119.990,00`；`Amarok Extreme 258 cv 3.0 V6 TDI turbo diesel Automática de 8 velocidades Diesel Modelo 2026`；`ID.4 Pro Motor elétrico de 545 Nm 286 cv Automática de 1 velocidade Elétrico 4 portas Modelo 2027`；`Saveiro Robust CS 100% Etanol`

---

### Toyota（BR 巴西 `www.toyota.com.br`：**配置器 Next.js `__NEXT_DATA__` 逐版本给价 + modelYear；PDF 仅交叉核对**）✅

- **可达性**：`curl` 首页/robots **200**；配置器 `/modelos/<slug>/monte` 为 Next.js，浏览器/CDP 打开即可读 `#__NEXT_DATA__`（约 1.25 MB）。
- **★ 取价主源（优先级 1）**：`__NEXT_DATA__` → `props.pageProps.pageBlocks[1].props.models[]`，每个 model 带 `versions[]`；取 `status:true` 且 `modelYear` 存在的版本，价格 = `modelYear.colorWithPrice[].price` 的**最小值**（颜色差 +0～2 430）；页面显示 `Com frete incluso, a partir de R$ …`。任一 `/modelos/<slug>/monte` 页都含全站 17 个车系的 models 数组，但年款/价格以各车系自己的 monte 页为准。
- **⚠ 配置器结构坑**：① `status:false` 的版本没有 `modelYear`/价格（如 Corolla GLi、Hilux CD STD Power Pack MT），**不是在售版本，不入选**；② `upgrade.price` 是“升级到下一版本”的价格，**不是本版本价**，别错拿；③ 版本名只到 trim（`XEi` / `SRX Plus AT` / `S Híbrido`），动力细分在 `modelYear.specs` 文案里，不入型号列。
- **在售范围（17 车系 / 38 版本）**：`/modelos` 导航 17 个车系（Corolla 2 · bZ4X 1 · Yaris Cross 3 · Corolla Cross 3 · SW4 3 · RAV4 3 · Hilux Cabine Dupla 5 · Hilux Cabine Simples 4 · GR Corolla 2 · Corolla Hybrid 2 · Corolla GR-Sport 1 · Corolla Cross GR-Sport 1 · Corolla Cross Hybrid 2 · Hiace 1 · Yaris Cross Hybrid 2 · Hiace Furgão 1 · GR Yaris 2）。
- **与 PDF 的差异（配置器胜出）**：① bZ4X PDF 的 Mono/Dual Tone 两行同为 419 990，实为颜色差异 → 合并 1 行；② PDF 有 Hilux CD `STD Power Pack 4x4` 282 390 MT，配置器只列 5 个 AT 版本（MT `status:false`）→ 不收；③ GR Corolla：配置器 `modelo 2024` Core 416 990 / Circuit 461 990，PDF 写 `Corolla HB Circuit` 399 990 → 取配置器；④ Corolla Cross GR-Sport：配置器 `Combustão` + specs `Motor de 2.0 L … Flex`，PDF 标 `GRS Hybrid` → 取配置器，归 Gasoline。
- **年款**：`modelYear.year` 显式给 2024/2026/2027；GR Corolla 页面标语 `Monte seu GR Corolla modelo 2024`。`katashiki` 尾部 `2626/2627/2324` 可作旁证，但不单独当年款依据。
- **燃油**：`modelYear.fuel` = `Combustão / Híbrido / Plug-in / 100% Elétrico`；再按 specs/车型页细分：Hilux/SW4/Hiace 文案 `diesel` → Diesel；`Flex` → Gasoline；`Híbrido` → HEV；`Plug-in` → PHEV；`100% Elétrico` → BEV。
- **交付结果**：`Toyota_BR_官网价_20261118.xlsx`，**38 条 / 17 车系**，149 990–475 990 BRL；燃油 BEV 1 · PHEV 1 · HEV 8 · Diesel 14 · Gasoline 14；年款 2027 11 条 + 2026 25 条 + 2024 2 条。
- **实测**：2026-11-18
- **来源**：`https://www.toyota.com.br/modelos`；`https://www.toyota.com.br/modelos/corolla/monte`（其余车系同构）；交叉核对 PDF `https://media.toyota.com.br/173965ca-3a5f-40fc-be96-02ecac114b91.pdf`（`OUTUBRO / 2026`，media 域 curl 403）
- **原文**：`"modelYear":{"year":2026,"fuel":"Combustão","katashiki":"MZEA12L-GEXNBG-MF2626"`；`Com frete incluso, a partir de`；`Monte seu GR Corolla modelo 2024`；`Motor de 2.0 L Dual VVT-iE 16 V DOHC Flex`（Corolla Cross GR-Sport）

---

### Ford（BR 巴西 `www.ford.com.br`：**配置器 `.bp-nameplate-data` 逐版本给价 + 标签年款；商用车仅询价**）⚠️ 商用车缺价

- **可达性**：`curl` 首页/robots **403**（Akamai）；真浏览器/CDP 可开。build&price 页 `https://www.ford.com.br/compre-o-seu/monte-o-seu-novo/?nameplate=<id>` 为 Angular，价格与版本在 DOM `.bp-nameplate-data[data-json]`，无需抓 XHR。
- **★ 取价主源（优先级 1）**：`JSON.parse(.bp-nameplate-data.getAttribute('data-json'))` → `models[]` 的 `label` / `price` / `PowerTrain.powerTrain[].name`；`price` 即页面 `Preço Estimado a partir de R$ …`。`powerTrain` 是独立动力字段，标签未含动力时按 `{版本} {Motor}` 拼接。
- **★ nameplate（9 个）**：`Ranger_FBR`（11 版）· `Ranger_Raptor_FBR`（1）· `Mustang_FBR`（1）· `F-150_FBR`（3）· `Maverick_FBR`（4）· `Bronco_Sport_FBR`（1）· `Territory_FBR`（1）· `Mustang-Dark-Horse_FBR`（1）· `Maverick_Hybrid_2025_FBR`（独立 Hybrid 页，与 Maverick 内 Hybrid 重复 → 去重，不重复收）。
- **年款**：model `label` 末尾的 4 位年份逐版本取——Ranger 除 `XL 2.0 CD Diesel 4x4 MT 2026` 外均为 **2027**；Ranger Raptor **2026**；Mustang GT Performance **2025**；Bronco Sport **2026**；Territory **2026**。
- **⚠ 年款坑**：① nameplate `year` 字段会滞后（Bronco 字段 `2025`，但 model 标签与页面均写 `2026`）→ **不采用 nameplate year**；② F-150 / Maverick / Mustang Dark Horse 的 model 标签不带年份，页面唯一出现的 `2025` 是页脚 `Copyright © 2025 Ford Motor Company`，**是版权年不是年款** → 这三组写 `官网无年款`；③ 商用车（Transit 三款 + Transit City + E-Transit）卡片只有 `Consulte sua concessionária Ford`，无 ano/modelo → `官网无年款`（报价链接的 `modelyear` 未显示且 E-Transit 出现 2025/2026 两值，不采用）。
- **价格/版本坑**：① `Maverick Hybrid` 同时出现在 Maverick nameplate 和独立 `Maverick_Hybrid_2025_FBR`，只收一次；② Ranger `Limited 3.0 V6 Diesel 4WD AT + Kit Opcional` 的价含选装 kit，按配置器原标签收并保留 `+ Kit Opcional`；③ F-150 `Lariat` 与 `Lariat Black` 同价 540 000，属不同外观 trim，各出一行；④ Ranger `Black 2.0L 4x2 AT Diesel` 242 600 是 4x2，别与 XL 4x4 混。
- **燃油**：Ranger 标签逐字 `Diesel` → Diesel；Maverick `2.0L Turbo EcoBoost` → Gasoline、`2.5L Atkinson FHEV` → HEV；F-150 `Motor 5.0L V8`、Mustang/Dark Horse `Motor Coyote 5.0L V8`、Ranger Raptor `3.0 V6 Bi-turbo`、Bronco/Territory `EcoBoost` → Gasoline；Transit → Diesel；E-Transit → BEV；Transit City 页面无动力字样 → 未标注。
- **交付结果（2026-11-18 复核后修正）**：目标是 **28 条 / 11 车系**（23 乘用 + 5 商用，商用车 `官网无价格`）。**实际最终交付 `Ford_BR_官网价_20261117.xlsx` 只有 23 条 / 10 车系，且 23 条全部 `官网无年款`**——那份 23 行文件早于年款提取；同日尝试补全的 `Ford_BR_官网价_20261118.xlsx`（28 行）在生成时中断（26/28 行仅品牌+燃油，其余空列），已归档 `_work/archive_20261118_dupes`。**商用车 5 条与全部年款（label 末尾 2027/2026/2025）仍需重采后才能说完成**，见 `_pending.md`。
- **实测**：2026-11-18
- **来源**：`https://www.ford.com.br/compre-o-seu/monte-o-seu-novo/?nameplate=Ranger_FBR`（其余 nameplate 同构）；商用车 `https://www.ford.com.br/todos-os-veiculos/`
- **原文**：`"label":"Bronco Sport Badlands 2.0L Ecoboost 4WD AT 2026"`；`"label":"XL 2.0 CH Diesel 4x4 MT 2027"`；`Preço Estimado a partir de R$ 249.900,00`；`Consulte sua concessionária Ford`；`Copyright © 2025 Ford Motor Company - Todos os direitos reservados`

---

### GAC / Aion / Hyptec（BR 巴西 `www.gacgroup.com/pt-br`：Nuxt 配置页 `vehicleModels[].salePrice` 逐版本价）✅

- **站点纠偏**：`www.gac.com.br` 本机 TLS 握手失败（`SEC_E_ILLEGAL_MESSAGE`）；`www.aionbrasil.com.br` 打开是**做 AI/数字化服务的 AION BRASIL**，不是汽车品牌。巴西官方车系在 **`www.gacgroup.com/pt-br`**，同站含 GAC / AION / HYPTEC 三个品牌。
- **在售范围（8 车系 / 13 版本）**：GAC = GS3（2）· GS4 Hybrid（2）· GS9（1）；AION = AION UT（2）· AION V（1）· AION ES（1）· AION Y（2）；HYPTEC = HYPTEC HT（2）。
- **★ 取价主源**：车型页的「Comparar versões」→ `/pt-br/configuration/<slug>/<year>`；Nuxt 数据 `window.__NUXT__.data` 内 `vehicleModels[]` 含 **`vehModelName` / `vehStyleCode` / `salePrice`**，`salePrice` 即 BRL 目录价（与车型页 `A partir de: R$ …` 最低版吻合）。slug：`gac-gs9/2026`、`gac-gs3/2024`、`gac-gs4/2024`、`aion-ut/2024`、`aion-v/2024`、`aion-es/2024`、`aion-y/2024`、`hyptec-ht/2024`。
- **⚠ 无价条目**：GS9 ULTRA 的 `salePrice:null`，车型页亦无 `A partir de` → `官网无价格`（GS9 为 2026 HyperHybrid，尚未定价）。
- **年款**：取 `vehStyleCode`（2024；GS9 = 2026），与配置 URL 的年份一致。
- **燃油**：GS3 官方 `ICE (gasolina - E30)` → Gasoline；GS4 Hybrid `HEV (gasolina)` → HEV；GS9 配置表 `Tipo: PHEV + REEV`、车型卡 `powerTypeList:HEV` → 归 **PHEV** 并在交付说明标注官网并列写法；AION UT/V/ES/Y 与 HYPTEC HT 均 `BEV` → BEV。
- **交付结果**：`Aion_BR_官网价_20261118.xlsx` 6 条 / 4 车系；`GAC_BR_官网价_20261118.xlsx` 5 条 / 3 车系；`Hyptec_BR_官网价_20261118.xlsx` 2 条 / 1 车系；三份表合计 **13 条 / 8 车系**；集团合并表 `GAC-Group_BR_官网价_20261118.xlsx`（13 条）与子品牌表行集完全重叠，已归档不交付；价格 139 990–369 990 BRL，GS9 1 条 `官网无价格`。
- **实测**：2026-11-18
- **来源**：`https://www.gacgroup.com/pt-br`；`https://www.gacgroup.com/pt-br/configuration/<slug>/<year>`
- **原文**：`"vehModelName":"ELITE","vehStyleCode":"2024","salePrice":187990`；`A partir de: R$175.990,00`；`"Tipo":["PHEV + REEV"]`

---

### BYD（BR 巴西 `www.byd.com/br`：**乘用车在 byd.com/br（bydbrasil.com.br 是商用车/集团站）；`/br/order-<model>` 版本卡给 `Preço de Venda`，年款分散在 Ofertas / Condições Comerciais**）✅

- **可达性**：`bydbrasil.com.br` curl 200 但只链到 `https://www.byd.com/br` 乘用车；`www.byd.com/br` curl 200，价格/年款需浏览器（2026-11-17）。
- **★ 在售全集（16 车型 / 21 版本）**：Dolphin Mini（GS/GL）· Dolphin（GS/SE）· Dolphin Plus · Han · Seal · Sealion 7 · Tan · Yuan Plus（AWD）· Yuan Pro · Atto 2（GL/GS）· Atto 8 · King（GL/GS）· Shark（GS）· Song Plus（DM-i 1.5T）· Song Plus Premium · Song Pro（GS/GL）。
- **★ 取价源（order 配置器）**：`https://www.byd.com/br/order-<model>`（如 `order-dolphin-mini`、`order-atto-2`、`order-han-ev`、`order-king-dmi`）版本卡（`div.car-version`）切换后读 `Preço de Venda` / `Preço de compra`（部分带 `R$`、部分不带）；该价与 `/ofertas` 的 `De` 一致 → 采它，不采 `Por` 促销（如 Song Pro GL De 196.990 / Por 176.990）。
- **★ 年款**：官网没有统一年款字段，按以下顺序取逐字证据：① `/ofertas` 卡片尾部 `2027`（Dolphin Mini / Dolphin GS / Atto 2 / King）；② `/condicoes` 的 `ano/modelo`（Seal、Yuan Pro、Atto 8、Song Plus、Song Pro 2026/2027；Song Plus Premium、Shark 2025/2026；King GS 2026/2027）；③ Yuan Plus 车型页标题 `BYD Yuan Plus AWD 2026`。**Dolphin SE、Dolphin Plus、Han、Sealion 7、Tan 五款所有官方页面均未印年款** → `官网无年款`（页面 `©️ 2026` 是版权年，已排除）。
- **燃油**：BEV 11（Dolphin Mini/Dolphin/Dolphin Plus/Han/Seal/Sealion 7/Tan/Yuan Plus/Yuan Pro）· PHEV 10（Atto 2、Atto 8、King、Shark、Song Plus、Song Plus Premium、Song Pro；Atto 8 官方 `Sistema híbrido plug-in DM 5.0`）。
- **交付结果**：`BYD_BR_官网价_20261117.xlsx`，**21 条 / 16 车型**；R$ 118.990–559.800；BEV 11 · PHEV 10。
- **实测**：2026-11-17
- **来源**：`https://www.byd.com/br/order-<model>`；`https://www.byd.com/br/ofertas`；`https://www.byd.com/br/condicoes`；`https://www.byd.com/br/car/yuan-plus`
- **原文**：`BYD DOLPHIN MINI GS` / `Preço de Venda R$ 119.990`；`BYD DOLPHIN MINI GL 2027`；`BYD DOLPHIN GS 2027`；`para BYD SEAL, 0km, 2026/2027`；`BYD Yuan Plus AWD 2026`；`©️ 2026 BYD Brasil`

---

### Fiat（BR 巴西 `www.fiat.com.br`：**curl 200；各车型子域 `monte.html` 版本卡给 MVS code + 完整版本名，价格卡显示不可用，改取同后端 price-service**）✅

- **可达性**：`www.fiat.com.br` curl 200；车型子域 `pulse/fastback/toro/titano/strada/500e/mobi/argo/cronos/fiorino/ducato.fiat.com.br/monte.html` 可直开（2026-11-17）。
- **★ 在售全集（11 车型 / 41 版本）**：Pulse 4 · Fastback 5 · Toro 6 · Titano 3 · Strada 7 · 500e 1 · Mobi 2 · Argo 4 · Cronos 4 · Fiorino 1 · Ducato 4。Pulse/Fastback 的 Abarth 与 Híbrido MHEV 是同一 monte 页里的版本，不另开车型。
- **★ 取价源**：`monte.html` 版本卡 `input[name=version]` 的 `value` = MVS code（如 `363ANN1`），`img[alt]` = 完整版本名；页面价格位显示 `Valor indisponível no momento`，**价格取同后端 `https://price-service.k8s.fcalatam.com.br/price?mvsCode=<code>&country=BR&year=<year>` 顶层 `price`**（与 Jeep 同一套 Stellantis 服务；`parts[]` 不是车价）。
- **★ 年款**：版本名尾部有 4 位年份的直接取（Pulse/Fastback/Toro/Strada/Mobi/Argo/Cronos 2027，Argo Trekking/Drive 1.3 AT 2026，500e ICON 2022）；Titano / Fiorino / Ducato 名称不带年份 → 用 MVS `mvs?brand=FIAT&model=<model>&year=<year>` 的逐版本 `year`（Titano 2026、Fiorino 2027、Ducato Maxicargo 2025 / Multi+Minibus 2027）。
- **燃油**：Flex → Gasoline；`MHEV`（Pulse Audace、Fastback Audace/Impetus、Toro Volcano/Ultra）= MHEV；`TURBODIESEL`（Toro Volcano/Ranch 4x4、Titano、Ducato）= Diesel；500e = BEV。
- **⚠ 未纳入**：MVS 2027 存在 `529GGF0 NOVO DUCATO MAXICARGO HEAVY 13M 2.2 DIESEL`（286.990），但 `ducato.fiat.com.br/monte.html` 4 张版本卡未列它 → 按官网在售 UI 不纳入，交付说明备注。
- **交付结果**：`Fiat_BR_官网价_20261117.xlsx`，**41 条 / 11 车型**；R$ 86.490–398.990；Gasoline 26 · MHEV 5 · Diesel 9 · BEV 1。
- **实测**：2026-11-17
- **来源**：各车型 `https://<model>.fiat.com.br/monte.html`；`https://mvs-service.k8s.fcalatam.com.br/mvs?...`；`https://price-service.k8s.fcalatam.com.br/price?...`
- **原文**：`PULSE DRIVE 1.3 MT FLEX 4P 2027`；`TORO RANCH TURBODIESEL 4x4 AT9 2027`；`TITANO ENDURANCE MULTIJET TURBODIESEL MT 4X4` / `"year":"2026"`；`500e ICON 2022`；`NOVO DUCATO MINIBUS LUXO 2.2 DIESEL 4P 16L`

---

### ZEEKR（BR 巴西 `www.zeekr.com.br` → `www.zeekrlife.com/pt-br`：**主站证书过期，curl 需 `-k`；价格只在 `conf.zeekr.com.br` 配置器，按 `?linkCode=` 切车型**）✅

- **可达性**：`zeekr.com.br` 证书过期（`SEC_E_CERT_EXPIRED` / 浏览器 `ERR_CERT_DATE_INVALID`）；实际内容在 `https://www.zeekrlife.com/pt-br`（证书正常）。配置器 `https://conf.zeekr.com.br/` 正常（2026-11-17）。
- **★ 在售全集（3 车型 / 6 版本）**：ZEEKR 001（Premium / Flagship）· ZEEKR 7X（Premium RWD / Flagship AWD）· ZEEKR X（Premium RWD / Flagship AWD）。
- **★ 取价源（配置器）**：`conf.zeekr.com.br` 是 3D 配置器，正文在 canvas 外但 `document.body.innerText` 可读到；车型切换用 `?linkCode=`：001 默认、7X `?linkCode=1197`、X `?linkCode=3`。页面逐字给 `Ano/Modelo 24/25`（或 26/27）+ `Versão` + `<价>.000 BRL`。
- **★ 价格**：001 Premium 495.000 / Flagship 542.000（24/25）· 7X Premium RWD 378.000 / Flagship AWD 468.000（26/27）· X Premium RWD 298.000 / Flagship AWD 338.000（24/25）。燃油全 BEV。
- **⚠ 配置器 API**：`POST https://gateway-pub-hw-em-mx.zeekrlife.com/overseas-app/sales-configurator/querySalesConfigurator` 需 HMAC 签名（`X-HMAC-ACCESS-KEY` / `X-HMAC-SIGNATURE` / `X-HMAC-DIGEST`），公开 Nuxt config 里虽有 `VITE_AK`/`VITE_SK`，但直接手拼严格签名成本高 → **优先读配置器渲染文本**，不要硬调 API。
- **交付结果**：`ZEEKR_BR_官网价_20261117.xlsx`，**6 条 / 3 车型**；R$ 298.000–542.000；BEV 6。
- **实测**：2026-11-17
- **来源**：`https://www.zeekrlife.com/pt-br/models/001`；`https://conf.zeekr.com.br/`；`https://conf.zeekr.com.br/?linkCode=1197`；`https://conf.zeekr.com.br/?linkCode=3`
- **原文**：`ZEEKR 001` / `Ano/Modelo 24/25.` / `Premium 495.000 BRL` / `Flagship 542.000 BRL`；`ZEEKR 7X` / `Ano/Modelo 26/27` / `Premium RWD 378.000 BRL`；`ZEEKR X` / `Ano/Modelo 24/25.` / `Premium RWD 298.000 BRL`

---

### Geely（BR 巴西 `www.geelybrasil.com.br`：**3 车型 / 7 版本；EX2/EX5 价格在 CloudFront 静态配置器，EX5 EM-i 在 pr-17 独立配置器且需区分 De/Por**）✅

- **可达性**：`www.geelybrasil.com.br` curl 200；车型页无价，`monte-o-seu-ex2/` 等页面嵌 CloudFront 配置器。**⚠ 各车型不是同一个配置器版本**：EX2 → `d3ksl4ozrd1trt.cloudfront.net/v13/?model=ex2`；EX5 → `d3ibdg82ywvs0g.cloudfront.net/pr-20/index.html`；EX5 EM-i → `.../pr-17/index.html`。必须以官方 monte 页里**实际 iframe src** 为准；v13 仍可打开 EX5 但显示旧价 205.800/225.800，当前 pr-20 是 207.800/227.800（2026-11-18 实测）。
- **★ 在售全集（3 车型 / 7 版本）**：EX2（PRO / MAX）· EX5（PRO / MAX）· EX5 EM-i（PRO / MAX / ULTRA）。`/monte-o-seu-geely` 过滤计数 `TODOS (3)`、`100% ELÉTRICO (2)`、`SUPER HÍBRIDO PLUG-IN (1)`，与 3 车型一致。
- **★ 全量复核（2026-11-18）**：按官方 monte 页实际 iframe 重读 7 条：EX2 v13 → 124.600 / 137.800；EX5 pr-20 → **207.800 / 227.800**（此前误用 v13 旧价 205.800 / 225.800，已更正）；EX5 EM-i pr-17 → De 199.990 / 219.990 / 244.990（Por 191.490 / 211.490 / 236.490 不采）。
- **★ 取价源**：EX2 v13 配置器逐版本显示 `R$ xxx.xxx,00*`（footer `*Preço Sugerido pelo Fabricante`）：EX2 PRO 124.600 / MAX 137.800。EX5 用官方 monte 页内嵌 **pr-20**：PRO 207.800 / MAX 227.800（与 offer 页 EX5 MAX à vista 227.800 一致）。EX5 EM-i pr-17 摘要逐版本有 `De R$ … por R$ …`：PRO De 199.990 / MAX De 219.990 / ULTRA De 244.990（**采 De，不采 Por 191.490 / 211.490 / 236.490**）。
- **⚠ 年款**：配置器不显示年款；取官方 offer 法律条款逐字 `ano/modelo 26/26`（EX2 MAX / EX5 MAX / EX5 EM-i MAX 三处核对，全部 26/26）。
- **燃油**：EX2/EX5 官方 `100% elétrico` → BEV；EX5 EM-i `Super Híbrida Plug-in` → PHEV。
- **交付结果**：`Geely_BR_官网价_20261118.xlsx`（最终版；v1 已归档），**7 条 / 3 车型**；R$ 124.600–244.990；BEV 4 · PHEV 3。
- **实测**：2026-11-18
- **来源**：`https://www.geelybrasil.com.br/ex2`；`https://www.geelybrasil.com.br/ex5`；`https://www.geelybrasil.com.br/ex5-em-i`；`https://www.geelybrasil.com.br/monte-o-seu-ex5/`（iframe → pr-20）；`https://d3ksl4ozrd1trt.cloudfront.net/v13/?model=ex2`；`https://d3ibdg82ywvs0g.cloudfront.net/pr-20/index.html`；`https://d3ibdg82ywvs0g.cloudfront.net/pr-17/index.html`；`https://www.geelybrasil.com.br/ofertas/oferta-geely-ex2-max`
- **原文**：`GEELY EX2 PRO` / `R$ 124.600,00*`；`GEELY EX2 MAX` / `R$ 137.800,00*`；`GEELY EX5 PRO` / `R$ 207.800,00*`；`GEELY EX5 MAX` / `R$ 227.800,00*`；`GEELY EX5 EM-i` / `PRO R$ 191.490,00*` + `De R$ 199.990,00 por R$ 191.490,00`；`ano/modelo 26/26`

---

### Land Rover（BR 巴西 `www.landrover.com.br` / `www.rangerover.com/pt-br`：**各车型 personalise 配置器逐版本「A partir de」，RESUMO 直接给车型年**）✅

- **可达性**：`www.landrover.com.br` curl 200；乘用车配置器分两域：Range Rover 三款在 `rangerover.com/lr/pt_br/<code>/ipr/personalise/`，Defender/Discovery 在 `landrover.com.br/lr/pt_br/<code>/ipr/personalise/`（2026-11-18）。
- **★ 在售全集（8 车型 / 13 版本）**：Range Rover（Autobiography / SV）· Range Rover Sport（Dynamic SE / Autobiography）· Range Rover Velar（Autobiography）· Defender 110（X-Dynamic HSE / X / Trophy Edition）· Defender 130（X）· Defender 90（X-Dynamic HSE）· Discovery（Metropolitan Edition / Tempest）· Discovery Sport（Landmark）。
- **★ 取价源**：配置器第 1 步 `Modelo` 的版本卡逐字 `A partir de R$ …`；价格是裸车起价，选装另计（页面大量 `R$0`/加价项不采）。
- **★ 年款**：配置器 `RESUMO` 直接拼 `车型 + 版本 + 年份`（如 `Range Rover Autobiography 2027`、`Defender X-Dynamic HSE 2026`），逐字取。
- **燃油**：Range Rover / Sport / Velar 均为 `Híbrido Elétrico Plug-in (PHEV)` → PHEV；Defender 全系 `Híbrido leve a diesel D350` → MHEV（官方轻混柴油）；Discovery 2.0 柴油 → Diesel；Discovery Sport `Flex P250`（Gasolina e Etanol）→ Gasoline。
- **⚠ 边界**：Range Rover GT 只有 `MANTENHA-ME INFORMADO`（未上市）→ 不纳入；Velar 库存页出现 2025 Dynamic HSE（738.786/733.786）但 2026 配置器只有 Autobiography → 以配置器在售版本为准；Defender 110 Trophy Edition 的 Deep Sandglow Yellow / Keswick Green 仅颜色不同、同价 899.990 → 合并 1 行。
- **交付结果**：`Land-Rover_BR_官网价_20261118.xlsx`，**13 条 / 8 车型**；R$ 471.990–2.137.950；PHEV 5 · MHEV 5 · Diesel 2 · Gasoline 1。
- **实测**：2026-11-18
- **来源**：`https://www.rangerover.com/lr/pt_br/l460_/ipr/personalise/`；`.../l461_/_/ipr/personalise/model/`；`.../l560/ipr/personalise/`；`https://www.landrover.com.br/lr/pt_br/l663/_/a-110/ipr/personalise/model/`；`.../a-130/...`；`.../a-90/...`；`https://www.landrover.com.br/lr/pt_br/l462/ipr/personalise/`；`.../l550/ipr/personalise/`
- **原文**：`Range Rover Autobiography 2027` / `A partir de R$1.773.950`；`Range Rover SV 2027` / `A partir de R$2.137.950`；`Range Rover Sport Dynamic SE 2027` / `R$1.040.750`；`Range Rover Velar Autobiography 2026` / `R$769.769`；`Defender X-Dynamic HSE 2026` / `R$844.990`；`Discovery Metropolitan Edition 2026` / `R$797.990`；`Discovery Sport Landmark 2026` / `R$471.990`

---

### JAC Motors（BR 巴西 `www.jacmotors.com.br`：**Elementor 站点，价格客户端注入；CARROS 3 款 + Hunter 皮卡有公开价，VANS/卡车无公开 MSRP**）✅

- **可达性**：`www.jacmotors.com.br` curl 200；车型页价格不在静态 HTML（占位 `De: R$000.000`），必须浏览器渲染后读 `body.innerText`；页面较重，navigate 常 60s 超时，但超时后 `evaluate` 仍可读到已渲染内容（2026-11-18）。
- **★ 在售范围（4 车系 / 5 版本）**：CARROS：E-JS1（25/26、EXT）· E-JS4 · E-J7；PICAPES：Hunter HEAVY DUTY 25/26。VANS（E-JV12/E-JV12 VIP/E-JVCC/E-JS1 CITY CARGO/E-JV5.5/E-JV7L）与 CAMINHÕES（E-JT125/E-JT18/E-JT35/E-JT95/iEV1200T）为商用线，车型页无公开价（E-JV12 仅成本/公里数字）→ 未混入乘用车表。
- **★ 取价源**：官方车型页逐版本 `VALOR` / `De`：
  - E-JS1 25/26：`De: R$132.900` / `Por: R$119.900` → **采 De 132.900**
  - E-JS1 EXT：页面无价格 → `官网无价格`
  - E-JS4：`VALOR R$254.900,00`
  - E-J7：`VALOR R$259.900,00`
  - Hunter HEAVY DUTY 25/26：`R$259.900,00`
- **★ 年款**：E-JS1 25/26 与 Hunter 25/26 取版本名逐字；E-JS1 EXT / E-JS4 / E-J7 页面无 ano/modelo → `官网无年款`（页脚 2026 为版权年）。
- **燃油**：E-JS1/E-JS4/E-J7 = BEV；Hunter = Diesel（2.0 turbodiesel）。
- **交付结果**：`JAC_BR_官网价_20261118.xlsx`，**5 条 / 4 车系**；R$ 132.900–259.900；BEV 4 · Diesel 1；1 条 `官网无价格`。
- **实测**：2026-11-18
- **来源**：`https://www.jacmotors.com.br/carros/`；`https://www.jacmotors.com.br/carros/e-js1/`；`https://www.jacmotors.com.br/carros/e-js4/`；`https://www.jacmotors.com.br/carros/e-j7/`；`https://www.jacmotors.com.br/picapes/hunter/`
- **原文**：`E-JS1 25/26` / `De: R$132.900` / `Por: R$119.900`；`VALOR R$254.900,00`；`VALOR R$259.900,00`；`HEAVY DUTY 25/26` / `R$259.900,00`

---

### Jaguar（BR 巴西：**`jaguar.com.br` 是 Jaguar Equipamentos 工业设备，不是汽车；JLR 巴西官方站 `jaguarbrasil.com.br` → `jaguar.com/pt-br`，当前仅 Type 01 预生产车、无价**）⚠️ 无价格出表

- **⚠ 域名纠偏**：用户给的 `www.jaguar.com.br` 打开是 **Jaguar Equipamentos**（WordPress，工业设备，`<title>Jaguar – Alta Tecnologia`），与 JLR 无关；`www.jaguarbrasil.com.br` 301 → `https://www.jaguar.com/pt-br/index.html`。
- **在售范围（1 车型）**：官方巴西站只剩 `Type 01`（`/pt-br/type-01.html`），页面标注 `O Type 01 é um veículo de pré-produção`；无 F-Pace/E-Pace/I-Pace/F-Type 等旧车型入口。
- **价格**：全站 0 个 `R$` / price 字段 → `官网无价格`；年款无 ano/modelo → `官网无年款`（页脚 2026 为版权年）。燃油 BEV。
- **交付结果**：`Jaguar_BR_官网价_20261118.xlsx`，**1 条 / 1 车型**；`官网无价格` + `官网无年款`。
- **实测**：2026-11-18
- **来源**：`https://www.jaguar.com/pt-br/index.html`；`https://www.jaguar.com/pt-br/type-01.html`；`https://www.jaguarbrasil.com.br`（301 到前者）
- **原文**：`Type 01`；`O Type 01 é um veículo de pré-produção. As especificações podem diferir no lançamento.`；`© JAGUAR LAND ROVER LIMITED 2026`

---

### Ferrari（BR 巴西 `www.ferrari.com/en-BR`：**官网全系不标价；车型页/配置器 0 个价格字段，CTA 只有 ENQUIRE / REQUEST INFORMATION**）⚠️ 无价格出表

- **可达性**：`www.ferrari.com/en-BR` curl 200；车型页 curl 403（919B 错误页），真浏览器可开（2026-11-18）。
- **★ 在售全集（20 车型）**：Range 页 19 款（F80、Luce、12Cilindri、12Cilindri Spider、12Cilindri Manuale、Purosangue、849 Testarossa、849 Testarossa Spider、Amalfi、Amalfi Spider、296 GTB、296 GTS、296 Speciale、296 Speciale A、SF90 XX Stradale、SF90 XX Spider、Daytona SP3、Monza SP1、Monza SP2）+ 配置器独有 **Roma Spider**。
- **★ 无价证据**：Range 页、各车型页、`carconfigurator.ferrari.com/en_EN` 全部 0 个 `R$`/`price` 字段；车型页 CTA 为 `ENQUIRE` / `REQUEST INFORMATION`；配置器只列车型 + `CONFIGURE`，无金额。
- **年款**：无 ano/modelo/modelYear；页脚 2026 为版权年 → 全部 `官网无年款`。
- **燃油**：Gasoline 10（12Cilindri 三款、Purosangue、Amalfi 两款、Daytona SP3、Monza SP1/SP2、Roma Spider）· PHEV 8（296 GTB/GTS/Speciale/Speciale A、849 Testarossa/Spider、SF90 XX Stradale/Spider）· HEV 1（F80，V6 hybrid 无 plug-in 字样）· BEV 1（Luce）。
- **交付结果**：`Ferrari_BR_官网价_20261118.xlsx`，**20 条 / 20 车型**；全部 `官网无价格` + `官网无年款`。
- **实测**：2026-11-18
- **来源**：`https://www.ferrari.com/en-BR/auto/car-range`；`https://www.ferrari.com/en-BR/auto/<model>`；`https://carconfigurator.ferrari.com/en_EN`
- **原文**：`DISCOVER THE FERRARI 12CILINDRI` / `BUILD YOUR OWN` / `REQUEST INFORMATION`；`DISCOVER THE 296 GTB`；`© Ferrari 2026`；配置器 `FERRARI LUCE / 849 TESTAROSSA / … / FERRARI ROMA SPIDER` + `CONFIGURE`
