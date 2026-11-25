# 安装与速查（vehicle-price-research）

## 安装

把整个 `vehicle-price-research/` 目录放进 agent 的 skills 目录：

```bash
# Qoder（用户级 / 项目级）
cp -r vehicle-price-research ~/.qoder-cn/skills/
# 或放进项目的 .qoder/skills/vehicle-price-research/
# CodeBuddy / Claude Code
cp -r vehicle-price-research ~/.codebuddy/skills/
cp -r vehicle-price-research ~/.claude/skills/
```

重启会话后生效。触发方式：发一个汽车品牌官网链接，或说「查某品牌某市场官网价格」。

## 这个 skill 干什么

输入「品牌 × 市场」官网 URL → 输出**官方 MSRP 的统一 8 列 XLSX**。

数据源**只用官网**（官网页面 / 官方 API / 官方 PDF 价目表），第三方来源必须标注且优先不用。

## 输出格式（8 列 + 年款依据副表，只出 XLSX）

```
品牌 | 官网车型名称 | 官网型号名称 | 年款 | 官网MSRP | 是否停销 | 数据日期 | 燃油分类
```

工作簿固定 **2 个 sheet**：`官网价`（上表 8 列）+ `年款依据`（品牌 / 车型 / 年款 / 覆盖型号数 / 判定过程 / 逐字原文 / 来源位置）。年款依据的覆盖型号数合计必须 = 主表行数。

| 列 | 规则 |
|---|---|
| 官网型号名称 | **发动机/动力必须并入此列**，用官网原始写法（`4*4` 不写 `4x4`） |
| 年款 | 官网把年份绑定到具体车辆/版本/价格就写（`MY` / `Model Year`、俄语 `год выпуска` / `2026 г.в.`、价目表年份列等）；小数模型年按原值照写；没标写「官网无年款」，**严禁推断** |
| 官网MSRP | 按市场原生千分位（欧元 `28.220,00` / 美元英镑 `102,700` / 挪威俄罗斯 `630 500`），**不带货币符号**，单元格**文本格式** |
| 燃油分类 | 英文原名：`Gasoline` `Diesel` `MHEV` `HEV` `PHEV` `BEV` `FCV` `LPG` `Dual Fuel` `REEV` |

⚠ 官网写 "Hybrid" 不等于 HEV：48V 轻混 → **MHEV**；插电 → **PHEV**。

## 三条最常踩的坑

1. **促销价不能采。** 官网总览页的 `from £X` 常是 Promotional Price / 含政府补贴价。真价先在配置器（`catalogAmount` / 价格 API）里找，配置器拿不到再用官方 PDF 价目表。
2. **「站点难进」≠「数据难拿」。** 页面 403 时先抓一次 XHR 清单，把 API 拎出来直连；API 被 WAF 拦就改「浏览器内 fetch」。
3. **配置器只是纯壳时，车系级就是终局。** 判别：页面 < 30 KB、无价格类 XHR、车型页只有一个 `from £X`。

## 目录结构

```
vehicle-price-research/
├── SKILL.md                     主规则：格式 / 口径 / 流程 / 反爬按症状查表（A–E 五组）
├── INSTALL.md                   本文件
├── examples/                    ★ 5 份现行规范样例（双 sheet）+ legacy/ 7 份历史单 sheet + README
├── references/
│   ├── sites.md                 索引 + 通用方法 + 止损判定（按市场分段读）
│   ├── sites/                   分市场详段（清单见 _map.json）+ _template.md
│   │                            + _map.json（段→文件映射）+ _template.md（新市场/新站模板）
│   ├── workflow.md              给不支持 skill 的 agent 用的可复制提示词模板
│   └── year-evidence.md         实验性年款候选管线说明（非稳定门槛）
└── scripts/
    ├── triage.js                 ★ 站点可达性分诊（Node 版，Windows/无 Python 环境用这个）
    ├── triage.py                 同上的 Python 版（需 python3 + openssl）
    ├── fetch_pdf.py             Akamai 拦 PDF 的破封脚本（先 ctx.request.get，再回退浏览器内 fetch）
    ├── write_xlsx.js            ★ 唯一生成器：8 列 + 副表（exceljs 已内置在 scripts/node_modules）
    ├── selftest.js              ★ 生成器自测（9 组夹具，不需要 exceljs/网络）：`node selftest.js`
    ├── check_all.js             ★ 一条命令跑 selftest + check_sites（交付前闸门）
    ├── update_sites_meta.js     ★ 知识库元信息同步（段数/品牌清单/_map.json 哈希，不动正文）
    ├── check_sites.js           ★ 知识库一致性检查：`node check_sites.js`（索引/段数/围栏/哈希）
    ├── verify_xlsx.js          ★ 成品回读校验（结构 + 年款/日期格式 + 与 rows.json 逐行比对）
    ├── verify_dir.js           ★ 交付目录级校验（同品牌多文件 / _vN / 重复交付）
    ├── collect_year_evidence.js / build_year_basis.js / selftest_year_evidence.js  实验性年款工具（非稳定门槛）
    └── format_output.py         旧版生成器（单 sheet / 仅欧元），已被 write_xlsx.js 取代
```

## examples/ 里有什么

先看 **5 份现行规范**（8 列 + 年款依据 7 列，可逐项对照）；`legacy/` 里是 7 份历史单 sheet 样例，只看主表写法。

| 文件 | 条数 | 看点 |
|---|---|---|
| `CUPRA_BE` | 93 | **现行规范**；配置器 API 直取；BEV/Gasoline/MHEV/PHEV 四类按型号名逐字判定；年款取接口 `model_year` |
| `Subaru_BE` | 13 | **现行规范**；两个官方源交叉且逐车系集合相等；年款依据逐字引 PDF 脚注；含税 `×1,21` 反算 |
| `Mazda_FR` | 123 | **现行规范**；欧元点千分位；2026/2027 双年款；型号名原样并入动力/变速箱/驱动 |
| `Mercedes-Benz_BR` | 36 | **现行规范**；BRL 点千分位 `139.990,00`；2025/2026/2027 并售 + 3 条官网无年款；`ano/modelo` 归一（`26/27→2027`） |
| `Kia_AU` | 98 | **现行规范**；澳元上路价保留分（`--money comma2`）；年款取车型页标题（`2026 Kia …`）；22 组年款依据 |
| `legacy/Mercedes-Benz_UK` | 403 | 规模上限；同名车系按动力拆分（`CLA` / `CLA Electric`） |
| `legacy/Skoda_UK` | 133 | 全量 `MY2027`；五种动力并存 |
| `legacy/Ford_UK` | 129 | 48V 轻混归 **MHEV**；价格来自官方 PDF |
| `legacy/Peugeot_UK` | 109 | 五类动力混排，动力标识并入型号名 |
| `legacy/Cadillac_US`（配置器版） | 114 | `MY2027`/`MY2026`/`MY2025` **三代并售**；价格含运费 |
| `legacy/Porsche_IN` | 20 | 印度 lakh 千分位 `2,11,29,000` |
| `legacy/Hyundai_UK` | 17 | **车系级**（官网只公开到这一层）的正确交付样式 |

`examples/README.md` 逐份说明了「要你看什么」，末尾还列了 6 条反面教材（促销价、税制优惠价、`totalAmount`、颜色加价、EMI 月供、硬凑变体）。


## 怎么用 sites 知识库最快

1. 打开 `references/sites.md`，只读**目标市场块 + 通用方法 + 止损判定**，不要整读索引。
2. 按市场找到品牌行，看结论（✅/⚠️/❌）和一句话方法，再按该表末尾的「详段：sites/<market>.md」去读**对应市场文件**（`grep -n "<品牌>"`）。
3. 索引里没有的新站，按 `## 数据源定位方法（通用）` 走：配置器 → 车型页 From → 官方价格表补全；采完追加到市场文件（模板 `sites/_template.md`）+ 索引加一行，跑 `node scripts/check_sites.js`。

> ⚠️ 索引只是路由，**不要只看索引就动手**：字段名、正则、失败过程都在市场文件里。

## 已覆盖市场

以 `references/sites/_map.json` 为准；运行 `node scripts/check_sites.js` 可查看每个市场的索引行、段数与证据欠账。当前版本行中的市场数/段数由 `update_sites_meta.js` 自动同步，不在本文手写枚举。
