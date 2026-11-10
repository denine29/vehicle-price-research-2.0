---
name: vehicle-price-research
description: 车型官网价格调研与采集。当用户要求"查某品牌某市场官网的价格/MSRP/价格表/价目/Excel/是否停售/车型清单"，或发来某品牌官网链接（如 xxx.es / xxx.gr / xxx.co.nz）时使用。覆盖多市场官方 MSRP 采集、价格口径核对、反爬站点绕过、统一格式 XLSX（8 列含燃油分类）交付。数据源必须为官方。
---

# 车型官网价格调研

为「某品牌 × 某市场」官网抓取全部在售车型**官方建议零售价（MSRP）**，交付统一格式 **XLSX（8 列，含燃油分类）**。

## 何时使用

- 用户发来汽车品牌官网 URL（`xxx.es` / `xxx.gr` / `xxx.co.nz` / `xxx.com.ph` …），默认意图 = 采该站在售车型官方价。
- 用户提到：查 MSRP / 价格表 / 价目 / 是否停售 / 生成 Excel / 核对车型清单。
- 用户说"下一个""继续"并给了新品牌链接 → 延续同一套规则。

---

## 一、输出格式（最高优先级，必须逐字遵守）

> 📂 **拿不准格式长什么样，先打开 `examples/`**：10 份真实交付过的成品 = **3 份现行规范**（`CUPRA_BE` 93 行、`Subaru_BE` 13 行、`Kia_AU` 98 行，8 列 + 年款依据双 sheet）+ **7 份历史单 sheet**（在 `examples/legacy/`，只看主表写法）。`examples/README.md` 说明了每份「要你看什么」，末尾 6 条反面教材。
> ⚠️ `legacy/` 里的只有一张表、sheet 名也不是「官网价」，**不要照抄结构**；新交付一律 2 张表（官网价 + 年款依据 7 列），口径写交付说明。

**只交付 XLSX，固定 8 列（2026-09-30 起生效；CSV 已取消）：**

```
品牌 | 官网车型名称 | 官网型号名称 | 年款 | 官网MSRP | 是否停销 | 数据日期 | 燃油分类
```

| 列 | 写法 |
|---|---|
| **品牌** | 品牌名（Dacia / DS Automobiles / Nissan …） |
| **官网车型名称** | 车系名（SANDERO / DUSTER / DS 3 / N°4） |
| **官网型号名称** | 官方完整版本名，**发动机/动力必须并入此列**，用官网原始写法 |
| **年款** | 官网标 MY/millesime 就原样写（MY2025）；没标一律写「官网无年款」，**严禁推断**（「没标」怎么判定见 §四「年款怎么来」：必须查官方规格表/价格表 PDF 内文） |
| **官网MSRP** | 数字按**该市场货币的原生千分位写法**格式化为文本（不是浮点数），**不带货币符号**（只留数字，不写 €/$/£/฿）；单元格设为**文本格式**<br>· 欧元区：**点号千分位**（`28.220,00`）<br>· 美元 / 英镑：**逗号千分位**（`102,700` / `31,870`）<br>· 泰铢 / 韩元 / 印度：**逗号千分位**（`1,229,000` / `36,170,000`；印度另有 lakh 分组 `2,11,29,000`）<br>· 澳元（drive-away 含分时）：**逗号千分位 + 两位小数**（`106,230.27`；整数价写作 `49,990.00`，与官网显示一致）<br>· **官网列了车型但全站无任何官方价格**：写 `官网无价格`（文本），**照常出表**，不得因缺价跳过品牌 |
| **是否停销** | 在售=`否`；已停售/下架=`是` |
| **数据日期** | 抓取当天，YYYYMMDD |
| **燃油分类** | 取「海外燃料分类」**英文原名**（见下表）；无法判定写「未标注」 |

**三档"没有值"的写法（不得混用，2026-10-30 明确）：**

| 标记 | 用在哪列 | 判据 |
|---|---|---|
| `官网无价格` | 官网MSRP | **该车型**在官方链路（车型页 + 配置器 + 官方 PDF）全链路 0 个价格字段，或官网写明价格由经销商确定 |
| `未核实` | 官网MSRP | 同一官网有价格体系，但**这一条**读不到或口径确认不了（接口该字段缺省、PDF 打不开、只有截图） |
| `未标注` | 燃油分类 | 页面文案 / 燃油字段 / 动力字段三处都判不出动力类型 |

> 三档都**照常逐版本出行**，不跳过；`官网无价格` 与 `未核实` 的区别是「品牌/车型层面没价」vs「这一条拿不到价」。
> MSRP 统一按市场规则格式化（不带货币符号）；官网原文写法只用于回查核对，不直接入表。
> **空结果 ≠ 无价格（2026-11-03 补）**：接口/页面返回空时**先怀疑自己的 key**（modelname、slug、地区/邮编参数），换 key 重试并记下试过哪些 key。只有在官网自己的车型全集里确认该车型存在、且车型页＋配置器＋官方 PDF 三处都无价，才写 `官网无价格`；拿不准就写 `未核实` 并附试过的 key。实例：Hyundai AU 查 `sonata` 得空 → 误记「官网无价格」，正确 key 是 `sonata n line`，官网其实有价。

**发动机并入型号名称的正确写法（用户明确要求，踩过坑）：**

```
✔ Dacia|DUSTER|DUSTER expression tribrid 150 4*4|MY2024|28.220,00|否|20260917|HEV
✘ Dacia|DUSTER|DUSTER expression|MY2024|28.220,00|否|20260917|HEV|三擎混动 150 4x4   ← 错误：单独占列 + 中文翻译 + 4x4 写法

✔ INEOS|Grenadier Station Wagon|Grenadier BMW 3.0L Turbo-Benziner, Reihensechszylinder|MY2027|72.640,00|否|20261026|Gasoline
✘ INEOS|Grenadier Station Wagon|Grenadier 3.0L Turbo-Benziner|MY2027|72.640,00|否|20261026|Gasoline   ← 错误：删掉了 BMW 前缀和 , Reihensechszylinder 后缀
```

要点：
- 用**官网原始动力写法**（`4*4` 不写成 `4x4`；`eco-G 120 auto` 保留大写 G）
- **禁止缩写/改写**：品牌前缀、技术后缀、标点一个都不能删。`BMW 3.0L Turbo-Benziner, Reihensechszylinder` ≠ `3.0L Turbo-Benziner`。**长度不是删词的理由**，觉得太长就照原样留着。
- **多字段版本名**：官网把「版本」和「动力」拆成两个字段时（如配置器 `Version:` + `Motor`），按 `{版本} {动力}` **原文照搬、一个空格连接**，不裁剪、不翻译、不调序。
- **动力名权威源**：以官网**配置器里选择动力的那个字段**为准（Ineos = 第 01 步 `Motor` 单选组）；价目 PDF 只供价格，PDF 的表头/行文不作为动力名依据，两者冲突用配置器。
- 不额外增加"发动机/动力"中文列
- 拼接顺序：`{版本名} {动力}`

### 燃油分类对照表（该列取「海外燃料分类」英文原名）

| 海外燃料分类 | 中文名 | 官网常规分类 |
|---|---|---|
| Gasoline | 汽油 | gasoline / petrol / benzine / essence |
| Diesel | 柴油 | diesel |
| MHEV | 轻混 | hybrid（官网常逐字写 m-HEV / mild / 48V / 微混） |
| FCV | 燃料电池 | hydrogen / fuel cell（也常写 Fuel Cell Electric） |
| LPG | 液化石油气 | LPG / CNG（液化石油气 / 压缩天然气） |
| BEV | 纯电 | electric / elektrisch / EV / 纯电 |
| Dual Fuel | 双燃料 | 汽油+燃气/CNG 两套燃料（**不是混动**，别归 hybrid） |
| PHEV | 插电式混合动力 | hybrid（逐字写 plug-in / iV / 插电 / rechargeable） |
| HEV | 非插电式混合动力 | hybrid（只写混动，且上面几类字样都不出现） |
| REEV | 增成型电动 | hybrid（逐字写 range extender / 增程） |

> 该列是**封闭词表**：只能填 `Gasoline / Diesel / MHEV / HEV / PHEV / REEV / BEV / FCV / LPG / Dual Fuel` 之一，不写中文、不自造值；页面文案、燃油字段、动力字段三处都判不出时写 `未标注`。
> 「官网常规分类」列只说明官网通常怎么写（`hybrid` 一带四），**不能反查**；落名按下面顺序**逐字命中即停**：
> ① `plug-in` / `iV` / `插电` / `rechargeable` → PHEV　② `range extender` / `增程` → REEV
> ③ `m-HEV` / `mild` / `48V` / `微混` → MHEV；或官网给出驱动电机且**全站无纯电续航/纯电模式**（辅助型电机，如 Subaru e-BOXER 12,3 kW）→ MHEV，依据里逐字引该参数
> ④ 只有 `Hybrid` / `Hybride` / `híbrido` 等混动字样 → HEV　⑤ 连混动字样都没有 → 按「官网常规分类」归大类

**交付物**：XLSX（MSRP 单元格**文本格式**，冻结首行，加自动筛选）。
**命名**：`<品牌>_<市场>_官网价_YYYYMMDD.xlsx`，写入**当前环境的工作区目录**（本机为 `/workspace`；其他沙箱可能是 `/data`、`~/output` 等 —— **以你实际可写且用户能取到文件的目录为准**，不要因为找不到 `/workspace` 就中断）。

### 年款依据副表（每个工作簿必带，2026-10-27 起）

工作簿固定 **2 个 sheet**：`官网价`（8 列，格式不变）+ **「年款依据」7 列**（下表）。这张副表只回答一件事：**年款是怎么得出来的**。

> 口径说明（价格取哪一层、哪些版本没纳入、是否含税）**写在交付说明文字里**，不进工作簿。
> 只有在用户**明确要求**把口径写进表时，才**追加第三张「口径与依据」5 列**（`口径项 | 覆盖行数 | 判定依据 | 官网逐字证据 | 来源 URL`）——前两张表的结构与生成逻辑一概不动。

| 列 | 写法 |
|---|---|
| 品牌 | 与主表一致 |
| 官网车型名称 | 与主表一致 |
| 年款 | `MY2027` / `2026` / `官网无年款`（与主表逐字一致） |
| 覆盖型号数 | **工具自动统计**主表同组行数；全部相加必须 = 主表行数 |
| 年款依据（判定过程） | 一句话说明从哪个字段/文件看出来（如 `c2gMillesime → millesime_2025`、配置器 `MODEL YEAR 2026`、PDF 抬头 `MJ27`、API 无 MY 字段） |
| 官网原文（逐字） | **粘贴原文**，保留大小写/标点/引号，不改写（如 `2026 Lucid Air Pure`、`<meta name="modelYear" content="">`） |
| 来源位置 | URL + 具体位置（车型下拉项 / PDF 页码或抬头 / JSON 路径） |

要点：
- **按 `品牌 + 车型 + 年款` 分组**，一行一组，不逐型号重复。
- 采集时就把依据记下来（与价格同批抓），写成 `year_basis.json`；**不要事后回忆**，更不许拿自己写的 `sites.md` 当证据（自证循环）。
- `官网无年款` 也必须有依据：写明查过哪些位置无 MY，并**明确排除版权年**（`© MINI 2026`）、价格生效日期、以及只是产品/版本代号的 `millesime`（Alpine A110 的 `millesime_2015` 即是，不是年款）。
- 生成：`node write_xlsx.js rows.json <前缀> --date YYYYMMDD --money euro --year-basis year_basis.json`（脚本见 `scripts/write_xlsx.js`；**exceljs 已内置在 `scripts/node_modules`，无需 npm**；只有该目录被清理时才需要 `npm i exceljs`）。主表有分组未被依据覆盖时工具会输出 `[WARN]`，必须补齐后再交付。

---

## 二、价格口径（2A 规则）

- 采**不带折扣的官方建议零售价（MSRP）**，含税，**不含选装**。
- **促销价 / 折扣价 / 政府补贴价一律不采**（西班牙 `totalAmount`、希腊 `με προωθητική ενέργεια` 等）；只在说明里备注原价。
- 仅"颜色/轮毂等配置差异"导致的多价，取最低。
- `cash price`（现金价）一般不采；**只有官网唯一报价是现金价时才采**并备注。
- 每条数据必须可回溯到来源 URL。
- **上路价（OTR / drive-away）**：只在用户明确要求、或官网唯一报价形态就是上路价时采；采了必须在交付说明写明包含项（注册 / CTP / 印花税 / dealer delivery）与所用邮编或地区，**不得与裸车 MSRP 混在一张表里当同一口径比较**。
- **官网没标注含税性时**：价格照采照出表，但依据副表必须逐字记下官网对税价的全部表述（如只有 `Aanbevolen catalogusprijs`，或只写 `exclusief leveringskosten en milieubijdrage` 而没提 BTW/VAT）；**不得推断"含税/不含税"**，也不得用价格换算反推（没有 excl./incl. 双列时）。实例：Škoda BE 的 `modelPrice` 官网未标 BTW，双列的 Prijslijst PDF 下载返回 401 → 依据里写"官网未标注"。

### ⚠️ 关键坑：目录价 vs 促销价（Stellantis 系）

DS/Citroën/Peugeot 在线商店的 GraphQL `prices.cash` 同时返回两个价：

```
catalogAmount: 35500.01   ← 官方目录价（MSRP，未折扣）✔ 采这个
totalAmount:   33752.96   ← 促销后价 ✘ 不采
discountAmount: 1747.05   ← 折扣额
```

**一律取 `catalogAmount`（= `baseCatalogAmount`）。**

---

## 三、查价优先级（冲突裁决）

1. **配置器**（配置器基础配置 / 其背后的官方价格 API）
2. 车型型号页 From 卡
3. **官方价格表**（prijslijst / price list / 车型页 Download specs·Brochure·Download price → 常为含全版本的 PDF）
4. 官网新闻稿定价
5. 第三方（必须注明"非官网"，且优先不用）

> **优先级说明（2026-10-26 调整）**：配置器是实时报价，排第一；From 卡次之。前两级只给车系起价或配置器为纯壳时，**用官方价格表补全变体级价格**并备注来源 —— 价格表仍是最全的兜底源，不要因为排第三就跳过。
>
> **冲突裁决：配置器 vs 价格表不一致时，以配置器为准**（配置器是实时报价，价格表可能旧版/口径不同）。配置器未收录的版本才用价格表价并备注来源。
>
> **⚠ 库存/现车页 ≠ 起价页（2026-11-05 补，CUPRA AU 踩过）**：`/stock`、`Find a dealer's inventory`、`Available now` 这类页面给的是**已经配好选装的实车价**，既按代理浮动、又**高于**官网起价（CUPRA 实测：配置器 `LEON VZX SPORTSTOURER 245KW AWD MY26 = 72,490`，而库存卡最低 73,110）。所以**版本名与起价一律以配置器为准**（名称要用它 `SELECT YOUR VARIANT` 那一屏的全名，常带电池容量/驱动形式，如 `… 210KW / 77KWH RWD …`，库存卡上的短行会把这些信息丢掉）；库存页只用来补**配置器里已经下架的年款**（清库 MY24/MY25 这类），并按实车口径备注最低/最高与卡数。
>
> **⚠️ From 卡可能是折后价（2026-10-30 补充）**：车型页/总览页的 `From` / `Vanaf` / `Catalogusprijs` 若脚注写 `na aftrek van commerciële kortingen`、`after discounts`、"含置换补贴"之类，它就是**折后展示价，不是 MSRP**。
> 1. From 卡与配置器目录价**并存** → 一律取配置器，From 只作对齐参考；
> 2. 两者价差 ≥ 3% 时，依据副表**必须**逐字引那句折扣脚注，并写明取的是哪一层；
> 3. 只有配置器无变体价、官网唯一公开粒度就是 From 时，才用 From 出车系级表，并在交付说明标注"官网展示价（可能已扣商业折扣）"。
>
> 实测（2026-10-29）：Škoda BE 车型页 Karoq 24 740 vs 配置器 34 490（差 28%）；Peaq 49 490 = 配置器 49 490（无折扣）。

**价格数字格式统一**：按市场货币原生写法（**不带货币符号**）—— 欧元区用点千分位 `28.220,00`；美元/泰铢/英镑用逗号千分位 `102,700`；澳元上路价保留分用 `106,230.27`（`--money comma2`）。
工具函数：
```python
def eurofmt(p):
    s = f'{float(p):.2f}'
    ip, dp = s.split('.')
    return f'{int(ip):,}'.replace(',', '.') + ',' + dp
# 28220.0 -> '28.220,00'
```

---

## 四、执行流程

1. **探测站点**：可达性、车型导航、价格入口、下载按钮/价格表 PDF。先 `curl` 试，403 就上 Playwright。
2. **定位价格源**：先抓配置器网络请求定位价格 API；配置器不可用或只到车系起价时，看车型页 From 卡；再用官方 PDF/价格表补全变体与缺价版本。
3. **采集**：逐版本采集，记录来源 URL 与口径。
4. **交叉验证**：至少用两个来源核对（如配置器 API vs 页面显示价），冲突时按第三节裁决。
5. **生成 XLSX（8 列，含燃油分类）** 到**工作区目录**（不存在 `/workspace` 就用实际可写目录，如 `/data`）。
6. **交付说明**：数据表 + 口径 / 缺价车型 / 边界说明。
7. **回写知识库**（按 §五「维护」+ 质量闸）：本次坑位写进 `sites/<market>.md`，索引加行 → `update_sites_meta` → `check_sites`；没验证的放 `_pending.md`。

**采集失败时怎么办**（踩过：SEAT BE 全站封锁、Hyundai BE 价格 API 被 SNI 封锁）：
- **不要直接说"采不到"就收工** —— 先分级：是「零数据」还是「部分数据」。
- 若主站可通、只是完整价格拿不到（如 Hyundai BE），**把已得的官方可采数据（车系起价 `Vanaf`）出一份表交付**，并明确标注粒度与缺口，再给出后续选项。
- 优先按 `references/sites.md` 的「止损判定」快速定性，**不要在一棵树上反复调 UI 超过 3 轮**。
- 失败原因写进对应市场文件 `references/sites/<market>.md`，并在 `references/sites.md` 索引加一行，供下次直接复用。

**年款怎么来**（用户问过，务必搞清楚）：
- 配置器 API 里常有 `millesime` / `modelYear` / `MY` 字段 → 确认是**年款**就采；若只是产品/版本代号（Alpine A110 的 `millesime_2015`）不采。
- 官网页面标的 MY/MY25 → 采。
- **⚠ 年款的常规落点是官方规格表 / 价格表 PDF（2026-11-04 补，踩过：Hyundai AU 17 个车型全记「官网无年款」，实际 4 个车型的规格表里印着 MY23/MY25/2026）**
  1. 只查了配置器 + 页面**不算查过年款**：必须逐车型把规格表/价格表 PDF 拉下来抽全文，找 `MY\d\d`、`Model Year`、以及 `〈年份〉〈品牌〉〈车型〉` 这种每页抬头/页脚（例：`Hyundai i30 Sedan N - MY25`、`2026 Hyundai IONIQ 6 N`、`Hyundai QX.V5 Venue - MY23`）。
  2. **只认文档内文印出来的**：PDF **文件名与 DAM 路径里的 MY（`my26-tucson/…`、`MY27_…IONIQ5…`）只作旁证，不得当年款**——文档文件名可能滞后或错标（实测 IONIQ 6 N 文件名写 MY27、内文印 2026，两者冲突取内文）。
  3. 脚注里 `…(base - MY26 onwards)` 这类说明**版本跨 MY**、官网又没逐版本标的 → 整个车型仍记「官网无年款」，把这句逐字留在依据里，不要按脚注给部分行猜年款。
  4. `as at 11/2025`、`date as at August 2026`、`Price applicable for 2026 build vehicle` 都是**文档生效日期/建造年**，不是年款。
  5. **图片型 PDF 抽不到字**（`pdftotext` 只出几字节）→ 依据里写「规格表为图片型，无法抽字，此项证据不足」，仍按「官网无年款」出表，不要靠文件名补。
  6. 站点的 HTML 被 WAF 拦时，**静态资源常放行**（Hyundai AU：页面 `curl` 403，但 `/content/dam/**/*.pdf` 200）→ 先直接试 PDF。
- **页面上的年份若是"版权年"或"交付日期"→ 不是年款**，写「官网无年款」。
  （踩坑：DS 页面 2025 是版权年、2026 是交付期，都不是年款。）
- **⚠ 多年款并售时（北美常见）：必须逐年标注，且「各年款车型清单可能不同」**
  —— 不要用同一年款覆盖全部车型，也不要假设某车型有所有年款。
  例（Cadillac US）：IQ/IQL/XT5/CT4/CT5 只到 MY2026，XT4 只有 MY2025，
  而 ESCALADE 系有 MY2027+MY2026。**逐年把车型列全**，缺的不要编。

---

## 五、反爬与解析（按症状查表）

> **排查顺序**：A 判断能不能采 → B 找数据源 → C 校价格口径 → D 解解析 → E 确认是否该止损。
> 完整坑位与实测字段见 `references/sites.md`（索引）→ `references/sites/<market>.md`（详段）。
>
> **环境适配（2026-10-30）**：下面的 Playwright 代码块需要 Python + Playwright。只有 Node 的环境（如 Windows 本机）改用 `node scripts/triage.js <url>` 分诊、`curl --ssl-no-revoke` 直连、browser MCP 的页面内 `fetch` 抓 XHR/PDF；没有 `pdfinfo`/`tesseract` 时，PDF 版本看 `pdftotext` 首尾页文本，图片型 PDF 直接判"不可解析"并换源。
>
> **知识库结构（2026-10-30 起）**：`references/sites.md` 只是**索引 + 通用方法 + 止损判定**（约 260 行）；每个市场的坑位详段在 `references/sites/<market>.md`（`be/de/in/th/uk/dk/us/fr/es/cl/gr/kr/au/jp/global`，共 15 个）。
> **用法**：先读索引 → **只读对应市场文件**（`grep -n "<品牌>"`）。不要整读，也**不要只看索引就动手**——字段名、正则、坑都在详段里。
> **大文件分段读（2026-11-10）**：市场文件 >150 行时（`be`/`jp`/`au` 都 >200 行），先 `grep -n "^### "` 取段标题与行号，再 `sed -n 'a,bp'` **只读命中的那一段**；不要整读，也不要把整页 HTML / 完整 rows.json 打印进对话。
>
> **维护（交付后必做，不是可选）**：
> 1. **新站（市场文件已存在）**：追加到 `sites/<market>.md` 末尾（模板 `sites/_template.md`），并在 §0 对应市场表加一行。
> 2. **新市场（文件不存在）**：复制 `_template.md` → `sites/<cc>.md` 填头 → 在 `sites.md` §0 新建 `### <国家> <CC>` 表 + 表末 `> 详段：sites/<cc>.md（N 段）`。
> 3. 跑 `node scripts/update_sites_meta.js`（重数段数/品牌/哈希）→ `node scripts/check_sites.js` 必须 PASS。
> 4. 把本次「交付结果」写进对应段（文件名、条数、价格区间、未纳入）。
>
> **回写质量闸（防止把错知识写进库）**：
> 1. 只写本次**亲自验证过**的事实：必须有 官网 URL + 逐字原文 + 实测日期；推断、猜测、失败尝试一律不写。
> 2. 拿不准的写进 `sites/_pending.md`（待复核区，不参与索引与校验），确认后再合并到正式市场文件。
> 3. 每条新增段至少含：`实测：YYYY-MM-DD`、`来源：URL`、`原文："…"`；缺证据视为未完成。
> 4. 交付说明里列出「本次回写了哪些段」，便于人工复核。

### A. 站点打不开 → 先判封锁级别

| 症状 | 判断与做法 |
|---|---|
| **`/robots.txt` 都 403** | 整站 IP 级封锁。换 UA / 浏览器 / IPv6 / 其他市场域都是徒劳 → **立即止损**（SEAT BE） |
| **Akamai 403**（`errors.edgesuite.net`、固定字节错误页） | 先分两种：① **真浏览器能通** → 只拦无指纹（`xvfb-run` + `headless=False` + 去 `navigator.webdriver`）（Volvo TH）；② **有头仍 403** → 出口 IP 黑名单，无解（Tesla TH）。佐证：同域其他子域是否 200 |
| **Cloudflare Error 1009** | **国家级封锁**，页面会写明 `banned the country ... (CN)` → 无解（Tata TH） |
| **TLS 握手立即 RST**（`openssl s_client` → `read 0 bytes`；浏览器 `net::ERR_CONNECTION_CLOSED`） | **SNI 级封锁**（TCP 通、TLS 被断）→ 该 API 无解，退回主站粗粒度数据。配置器在 `#/trims`/`#/error` 间乱跳也是这个原因，别反复调 UI |
| **curl 000 但 TLS 握手成功**（`HTTP/2` 已建流，随后 `INTERNAL_ERROR (err 2)`） | Akamai **HTTP/2 层拒 bot**；`--http1.1` 也是 000，别试 → 直接有头浏览器（MINI IN） |
| **`getent hosts` 只有 IPv6、curl 静默 000** | 该站 v6 不通 → 先 `getent ahostsv4` + `curl -4`；v4 仍时通时断（Akamai 多边缘）就直接 Playwright（BMW IN） |
| **Cloudflare 托管挑战 / `Just a moment`** | 有解但碰运气：stealth context + **`wait_until='commit'`**（`networkidle` 会被挑战页打断）+ 等 15–25s + 仍失败就 `reload()`，通常第 2 轮通过（VinFast IN）。脚本要带重试 |
| **按 IP / 出口国家跳站**（curl 302 → 他国站） | **先别止损**：curl 被国家跳转 ≠ 整站封锁，真实浏览器常能正常打开（Polestar DE：curl 任意路径 302 到 `.cn`，浏览器 `/de/` 全可采）。先用真浏览器复核同一路径；浏览器仍跳 → 才需海外出口或请用户截图 |

### B. 站能开，但不知道价格在哪

| 症状 | 做法 |
|---|---|
| **官网有独立价格总表页**（`/prices/`、`pricelist`、`prijslijst`） | 配置器拿不到变体级时**优先找它** —— 通常一张表全系全配置，SSR 直读（Force Motors）。⚠ 车系名 = 表内**单列行**，别向前找 heading（会串 `Disclaimer:`） |
| **车型页有 `Download specs` / `Brochure` / `Price List` 按钮** | 下载 PDF，常含全部版本 + MSRP（Ford UK `/cars/<model>/pricelist`、Škoda BE） |
| **北美官网 Build & Price 配置器** | **优先用配置器 API，而不是页面 "From" 价** —— 给「trim × 驱动 × 含目的地运费」，更细更权威。抓 `/p/v1/trim` 响应的 `data.trimList`。⚠ 含运费，与页面 MSRP 口径不同，交付须写明（Cadillac US） |
| **价格纯 JS 渲染** | Playwright 渲染；同时**查 SEO/JSON 数据区**（`modelCards`、`formattedValue`、`STANDARD MODELS`）—— 往往比 DOM 好抓 |
| **Next.js / CRA，HTML 里价格零散** | 挖 `/api/`：`grep -ohE '"/api/[a-zA-Z0-9_/-]{3,60}"' <chunk>` → 逐个 curl（常无鉴权）。⚠ 先看分层：后端只回起价 = 官网不公开变体价，别硬挖（Honda IN） |
| **AEM + feature-app 微前端**（`id="XXX"` 锚点 + `CmsFeatureAppLoader` + 永远 "Loading"） | 变体价在**懒加载 BFF**：滚动触发 + **拦截 `*.feature-app.io/bff/*` 响应**。⚠ BFF 需平台注入 token，**手拼 URL 必失败**（VW IN 的 MOFA） |
| **API 域被 WAF 拦 curl**（`.safeline` 拦截页 / curl 000 但浏览器能通） | **改用「浏览器内 fetch」**：Playwright 打开同站主页建指纹，再在页面上下文 `pg.evaluate` 里 `fetch()` 那个 API。WAF 拦的是非浏览器特征，不是 URL（Toyota IN 拿到 89 条全变体价） |
| **页面被掐死但页面能开** | 「站点难进」≠「数据难拿」：**抓一次 XHR 清单，把 API 拎出来直连**（Mercedes IN：页面 403，`vmos-api` 直接 200） |
| **配置器点击失败**（`Element is outside of the viewport`） | 放弃 DOM，直接调 API |
| **配置器 API 要 token，手带反而 404** | token 有租户/路径校验 → **拦截页面自身的响应体**，别抄 token（Jeep IN） |
| **超大厂只给车系起价，但用户要变体级** | 别停在 models/summary：去**配置器后端**（Mercedes `owcc-backend/.../entry?proposedStep=MOTORIZATION&typeClass=<系列>`）。⚠ 不加 `proposedStep` 只回营销预置卡且会重复；参数大小写敏感 |
| **配置器页只有 20–30 KB 纯壳、等 10 秒无价格 XHR** | 官网公开粒度就只到车系起价，**车系级就是正确交付**（Hyundai UK） |
| **未知路径返回首页 HTML**（SPA fallback） | 别把 `/models` `/shop` 的 200 当有效页 —— **比字节数**，与首页同长即 fallback（Lotus US） |

### C. 找到价了，先确认口径对不对

| 症状 | 判断 |
|---|---|
| **同页同时有 `catalogAmount` 与 `totalAmount`** | 取 **`catalogAmount`**（未折扣目录价）；`totalAmount` 是促销价（Stellantis 全系） |
| **总览页写 `from £X`，但官方 PDF 更高** | 页面是 **Promotional Price**（文案含 `Promotional`/`Grant`/`Offer` 即促销）→ 采 PDF。校验法：找**无促销车型**（页面价 == PDF 价）先验口径（Ford UK） |
| **同一品牌「配置器价」≠「车型页价」** | 多半是**配置器数据滞后**（未随调价同步）→ 3 个吻合、1 个差 1.5 Lakh 即锁定，滞后车型改以车型页为准（Jeep Wrangler） |
| **同一套配置器 API，不同国家字段含义不同** | Škoda：比利时 `modelPrice == priceOriginal`（纯车价）；**英国 `modelPrice` 是 OTR 价**（含 delivery + 首注册 + VED）。判别：拿官网 `From* £X` 去对，哪个字段等于 X 用哪个 |
| **官网把「原价」和「税制优惠后价」分开展示** | KGM `시작가격 ...부터(세제혜택 후)` 是**扣购置税优惠**的价；API/PDF 的 `차량공급금액` 才是原价 → 取原价 |
| **PDF 价目表列很多，不知取哪列** | Stellantis 英国 13 列 → 取 **「On The Road MRRP」**；**不取**「Electric Car Grant Deducted」（已扣 £1,500 补贴）。OTR Costs 按动力固定（汽油 1,570 / 混动 1,520 / 插混 1,230 / 纯电 1,125），可反推校验 |
| **车系表里大量「同配置但价格略高」** | 多为**车身颜色/内饰加价**（`[Pearl]`、`[Dual Tone]`、`+20,000`）→ 按关键词剔除，但**保留真实配置差异**（`[7S]`/`[8S]` 座位数、`[LE]` 特别版） |
| **印度价格格式对不上** | 两种：lakh 逗号 `15,70,522` / **空格分组** `₹ 18 19 000` → 正则 `₹\s*([0-9\s]{5,20})`。⚠ `₹39,999` 常是 **EMI 月供**，不是车价 |

### D. 价在里面，但取不出来

| 症状 | 做法 |
|---|---|
| **车型页只有一个起价，JSON 里有 N 个价** | 价是**变体级**：JSON 按序收价格 + **页面轮播标签**收变体名 → 顺序 zip。⚠ **先抽 3–4 个点击交叉验证顺序**再批量（Jeep IN） |
| **轮播/标签只渲染当前项** | DOM 永远只拿到 1 个 → 点一个读一个，或走 JSON。⚠ `locator.click(force=True)`；**去掉 `scroll_into_view_if_needed()`（常超时）**；JS `el.click()` 对 React 无效 |
| **配置器是云渲染 3D**（`Immersive Configurator`、`gorillastreaming`、WebRTC） | 永远渲染不出 → 反查后端 API（找 `pathSegments`/`BASE_URL`/`VITE_*_API_URL`）。⚠ 若 API 只有 `config` 无金额，说明价格在规则引擎里动态算，大概率拿不到（Lotus US） |
| **HTML 全是 `&quot;` 转义 + `"key":[0,value]` 二元组** | Qwik/Nuxt 序列化状态，**不能 `json.loads`** → `html.unescape` 后用「对象块」正则切卡片，再逐字段 `'"key":\[0,"([^"]*)"\]'`（Porsche IN） |
| **`£`/`₹` 遍地都是，分不清哪个是车型价** | 传统车企把全量 grade 内联进配置器页 → **必须以 `gradeName` 做锚点**：`"price":"(\d{4,7})"[^{}]{0,400}?"gradeName":"([^"]{1,40})"`，否则会把 `Fitted price: £1,800`（选装）一起抓进来（Honda UK：50+ 个 £，真 grade 只有 4 个） |
| **PDF 直链 curl 000，但浏览器能拿** | 浏览器内 `fetch` + base64 回传（代码见下）。⚠ **别用文件名判版本**：`..._october-2025.pdf` 的实际内容可能是 2026-08 版 → 读 `pdfinfo Title` |
| **`pdftotext` 只出页码，正文为空** | **图片版 PDF**（`pdfimages -list` 有大量 JPEG）→ `pdftoppm -r 200 -png` → **数每页 `£` 个数定位价格页**（配件表那页最多，别混）→ `tesseract --psm 6` → 用封面 `from £X` 交叉校验 |
| **同一厂商各车型价目表列数完全不同** | 找「恒为最后一个」的列：**On The Road 价恒为该行最后一个「带千分位逗号」的金额**（后面的 BIK `133.18`、CAP Code `57195`、CO2、VED 都不带逗号）。一条规则覆盖 10 份不同版式（Ford UK 129 条） |
| **PDF 里分组标题（trim 名）单独占一行** | 顺序扫描 + **继承状态**（`SWB`/`LWB` 改车身、`Zetec - 8 Seats` 改 trim、价格行归当前组）。⚠ 后半常混入**技术数据表**与特殊版延伸配置，必须**限定只扫主表区间**（Ford Tourneo Custom：52 页里主表只有 line 380-566） |
| **InDesign 在线文档 `inner_text`/`textContent` 取不到字** | 文字是**矢量 path**（`<text>` 节点数 0）→ 截图 + OCR。⚠ 先裁顶部 20% 找 `PRICE LIST` 定位页，别整本 OCR（Peugeot UK） |
| **OCR 表格列坐标因车型而异，硬编码必错** | 用**算术关系定位列**：`Basic + VAT = Total`、`Total + OTRcost = OnTheRoad`，滑窗找同时满足的连续 5 个金额；失败行裁横带放大 2× + `--psm 7`；仍失败取**行内最大金额** |
| **OCR 认不出 trim 标签**（`STYLE`/`GT` 常错位） | 用「**动力重复即新组**」切组；trim 名从 store 的 `configurationOptions.trims` 拿、按价格升序对应（PDF 恒按价格升序）。⚠ 组数必须 == trim 数 |
| **价格前带 `£` 导致正则全漏** | 正则写 `[£$]?\s?(\d{1,3}(?:,\d{3})+\.\d{2})` 并**取 group(1)**；`fullmatch` 直接匹配带符号串会失败 |

### E. 官网确实没有价 → 止损判定

| 情形 | 铁证（任一成立即止损） |
|---|---|
| **品牌已退出该市场** | 导航全是售后 + sitemap 无车型页 + 车型词全文 0 命中（Chevrolet TH、Ford IN）。⚠ 别把「配件调价页」当新车价页 |
| **超豪华品牌策略性不标价** | ① 车型页 `₹/£/$` 0 命中 ② 配置器 CTA 是 `Enquire to buy` ③ 配置器后端 `priceVersion: null`（Bentley IN、Maserati TH、McLaren、IM Motors） |
| **同一代码不同市场策略不同** | 做**对照实验**：`/en-GB` 有价而 `/en-US` 无价 → 是该市场经销商模式，不是工具问题（Lotus US），可放心判定「官网不标价」 |
| **配置器只是纯壳** | 见 B 组：体积 < 30 KB、无价格 XHR、车型页只有一个 `from £X` → **车系级就是终局** |

> **30 秒止损判定**（详见 `references/sites.md` 的「止损判定」段）：
> ① `curl <站>/robots.txt` → 403 即整站封锁；② 多市场域全 403 → 全球无解；③ `openssl s_client` 看 TLS 是否被 RST。

**突破 Akamai PDF 403 的关键代码**（在 Playwright 页面内同源 fetch）：
```python
res = pg.evaluate("""async (u)=>{
  try{
    const r = await fetch(u,{credentials:'include'});
    const b = await r.arrayBuffer();
    const bytes = new Uint8Array(b);
    let s=''; for(let i=0;i<bytes.length;i++) s+=String.fromCharCode(bytes[i]);
    return {ok:r.ok, status:r.status, len:bytes.length, b64:btoa(s)};
  }catch(e){return {err:String(e)}}
}""", url)
# Python 侧：base64.b64decode(res['b64']) 落盘
```

**Playwright 启动模板**（Akamai/Cloudflare 站点必须**有头**；纯 SSR 站可用 `headless=True` 提速）：
```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    br = p.chromium.launch(headless=False,   # 无显示器：xvfb-run -a 包一层
        args=['--no-sandbox','--disable-dev-shm-usage','--disable-blink-features=AutomationControlled'])
    ctx = br.new_context(locale='es-ES',   # 按市场改
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        viewport={'width':1440,'height':1000})
    ctx.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined})")
    pg = ctx.new_page()
```

---

## 六、交付前自检清单

**格式**
- [ ] **8 列**，无多余列（尤其**不能**把发动机单独占一列）
- [ ] 发动机/动力已并入「官网型号名称」，用官网原始写法（`4*4` 不写 `4x4`）
- [ ] **型号名逐字比对**：把每个去重后的「官网型号名称」拿去和抓取原文（配置器 `Version` + `Motor` 的快照）做**子串命中**，全部命中才算过；拼接式按 `{版本} {动力}` 两段分别命中。**不许拿自己写的 `sites.md` 笔记当证据**（自证循环）。
- [ ] **全集闸**：车型清单必须来自官网自有的全集来源（清单接口／导航下拉／sitemap 去重后逐个回页面确认），**不许按 URL 猜 key**；出表前核对「车型数」与「每车型版本数」两处都对得上，返回空的车型要么换 key、要么标「未核实 + 列出试过的 key」
- [ ] **字段闸**：车型名/型号名逐字取**界面渲染文本**；接口里带车身代号或内部码的 `name`（NX4／CN7／MX5／SKU 这类）只能进副表当反查键；界面名由多字段拼成时按界面层级顺序拼（版本组 + 动力 + 变速箱），并保留界面用来区分同名版本的词（如 `N Line Package`）
- [ ] 动力名取自**配置器里“选择动力”的那个字段**原文；价目 PDF 的表头/行文只供价格，不作为动力名依据
- [ ] 燃油分类只填对照表「海外燃料分类」列的英文值（10 个之一，判不出写「未标注」）；混动落名按 ①PHEV ②REEV ③MHEV ④HEV **逐字命中即停**，HEV 只是"只写了混动、拿不到插电/轻混证据"的兜底，不得因"看起来像普通混动"就直接写 HEV
- [ ] 千分位按市场原生写法（欧元点号 / 美元英镑逗号，**不带货币符号**），MSRP 单元格**文本格式**
- [ ] 冻结首行、加自动筛选
- [ ] 工作簿含**「年款依据」副表**（7 列，固定），覆盖型号数合计 = 主表行数（生成时无 `[WARN]`）；口径说明写在交付说明里
- [ ] 每条依据都有**逐字原文 + 来源位置**；`官网无年款` 写明查证范围并排除版权年/生效日期

**数据**
- [ ] **主表 品牌／官网车型名称／官网型号名称 三列不得为空** —— 映射表漏 key 会静默产出空白单元格，且「源数据空、回读比对也空」所以旧版校验照样 [PASS]（2026-11-03 Hyundai AU v1 有 17 行中招；`verify_xlsx.js` 已加空值拦截）
- [ ] 取的是**未折扣 MSRP**（Stellantis 取 `catalogAmount`；Ford 取 PDF 的 OTR，不取 `/cars` 促销价）
- [ ] 年款：官网没标就写「官网无年款」，**未推断**；多年款并售时逐年标注
- [ ] **年款来源闸**：写「官网无年款」之前，必须**逐车型把官方规格表 / 价格表 PDF 抽全文**找 `MY\d\d` / `Model Year` / `〈年份〉〈车型〉` 抬头（内文印出的才算数，**文件名与 DAM 路径里的 MY 只作旁证**）；依据里要写明查过哪些位置、PDF 里的逐字表述或「查过且无」，只查配置器＋页面**不算查过**（2026-11-04 踩过：Hyundai AU 17 个车型全记「官网无年款」，实际 4 个车型的规格表印着 MY23/MY25/2026，共 13 行漏标）
- [ ] **有官网报价**的停售/下架车型入表并标「是」；已停产且官网无价的老车型**不入表**，在交付说明里列名说明
- [ ] **未知价按三档填**（见第一节）：`官网无价格`（该车型在官方链路 0 个价格字段 / 官网写明经销商定价）· `未核实`（同一官网有价格体系但这一条取不到或口径确认不了）；三档都**照常逐版本出行**，不跳过；**不得**拿第三方/媒体/Wayback 归档价冒充官方 MSRP
- [ ] 数据日期列为 **`YYYYMMDD` 文本**（如 `20261030`，不是日期值、不是 `2026-10-30`）
- [ ] 每条可回溯到来源 URL 或 PDF 版本（`pdfinfo Title`）

**交付**
- [ ] XLSX 写入**工作区目录**（`/workspace` 或环境实际可写目录），命名 `<品牌>_<市场>_官网价_YYYYMMDD.xlsx`
- [ ] **生成后回读校验**（不是看一眼就交）：重新打开成品，核对 ⑴ 行数 = 源数据行数 ⑵ 恰好 8 列 ⑶ E 列格式为 `@` ⑷ 首行冻结 ⑸ 自动筛选范围覆盖全表 ⑹ **逐行逐值与源数据比对，0 差异**（发现差异先查口径，不要直接改表）。可直接跑 `node scripts/verify_xlsx.js <xlsx> <rows.json> --basis year_basis.json --money euro --date YYYYMMDD` 一次完成 ⑴–⑹
- [ ] 交付说明写清：**价格口径**（OTR / Ex-showroom / 含税）、**粒度**（车系级 or 变体级）、未纳入车型及原因
- [ ] **知识回写 + 质量闸**：只写带 URL / 逐字原文 / 日期的已验证事实；不确定的进 `sites/_pending.md`；回写后 `update_sites_meta` + `check_sites` 全过；交付说明列出本次回写了哪些段（**没写回不算完成**）
- [ ] **改过生成器 → `node scripts/selftest.js` 全过；改过 sites → `node scripts/check_sites.js` 全过**（这是交付门槛，不是建议）
- [ ] 中间文件已清理（只留最终 XLSX）

---

## 参考文件（本 skill 自包含，不依赖外部路径）

- `references/sites.md` — **索引 + 通用方法 + 止损判定**；详段在 `references/sites/<market>.md`（15 个市场文件，`_map.json` 为机器可读映射）
- `references/workflow.md` — 详细工作流与可复制提示词模板（给不支持 skill 的 agent 用）
- `scripts/triage.js` — **站点可达性分诊（Node 版，优先用这个）**；`triage.py` 是同上的 Python 版
- `scripts/fetch_pdf.py` — Akamai PDF 破封脚本（先 `ctx.request.get`，跨域也能下；再回退浏览器内 fetch）
- `scripts/write_xlsx.js` — **唯一生成器**：8 列 + 副表，`--money euro|comma|lakh`（exceljs 已内置在 `scripts/node_modules`）
- `scripts/selftest.js` — **生成器自测**：4 组夹具逐格比对，不需要 exceljs/网络；改完生成器先跑它
- `scripts/update_sites_meta.js` — **知识库元信息同步**：重数段数、重建品牌清单与 `_map.json` 哈希（不动正文）
- `scripts/check_sites.js` — **知识库一致性检查**：索引↔市场文件的段数/覆盖/围栏/哈希；改完 sites 先跑它
- `scripts/verify_xlsx.js` — **成品回读校验**：结构（8 列/@/冻结/筛选/日期/**品牌·车型·型号三列非空**）+ 与 rows.json 逐行比对；不给 rows.json 时只做结构校验（`--skip-sheet2` 用于旧版 5 列副表）
- `scripts/format_output.py` — **旧版**：只出单 sheet、只支持欧元格式，已被 `write_xlsx.js` 取代，不要用于交付
