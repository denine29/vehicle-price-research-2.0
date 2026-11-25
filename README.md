# vehicle-price-research

> 知识库版本：2026-11-25 · 19 市场 / 187 段 · 交付前跑 `node scripts/check_all.js`（生成器自测 + 知识库一致性）

「品牌 × 市场」官网 MSRP 采集 → 统一 8 列 XLSX（+ 年款依据副表）。

## 开工前（任何 agent 都要先做这三步）

1. 读 `SKILL.md`（规则、口径、自检清单）。
2. 在 `references/sites.md` 定位**目标市场块 + 通用方法 + 止损判定**，不要整读索引。
3. 按索引里的「详段」只读**对应市场文件** `references/sites/<market>.md`，不要整读、不要只看索引就动手。

## 收工前（两个硬门槛，未通过不算完成）

```bash
node scripts/selftest.js        # 生成器 9 组夹具，逐格比对
node scripts/check_sites.js     # 知识库：索引↔市场文件的段数/覆盖/围栏/哈希
node scripts/verify_xlsx.js <xlsx> <rows.json> --basis year_basis.json --money euro --date YYYYMMDD  # 成品回读
node scripts/verify_dir.js <交付目录>   # 目录级：同品牌多文件 / _vN / 重复交付 / 年款·日期格式
```

交付前还要按 SKILL.md 第六节做**回读校验**（行数 / 8 列 / E 列 `@` / 冻结 / 筛选 / 逐行 0 差异）。

> 年款证据管线（`collect_year_evidence.js` / `build_year_basis.js`）当前为**实验性可选工具**，不属于稳定交付硬门槛；稳定流程仍由人工复核年份并编写 `year_basis.json`。

## 结构

```
SKILL.md                主规则（格式 / 口径 / 流程 / 反爬 A–E / 自检清单）
references/sites.md     索引 + 通用方法 + 止损判定（按市场分段读）
references/sites/*.md   分市场详段 + _map.json + _template.md
references/year-evidence.md  实验性年款候选管线说明（非稳定门槛）
scripts/                triage.js / write_xlsx.js / selftest.js / check_sites.js / update_sites_meta.js / verify_xlsx.js / verify_dir.js
scripts/*year_evidence.js / build_year_basis.js  实验性年款工具（非稳定门槛）
examples/               12 份真实交付样例（5 份现行规范 + 7 份 legacy）+ README
```

## 维护知识库（加新站 / 新国家）

```bash
# 1) 追加段到对应市场文件末尾（模板 references/sites/_template.md）
# 2) 在 references/sites.md 的市场表加一行（品牌 / 结论 / 一句话方法）
node scripts/update_sites_meta.js     # 同步段数、品牌清单、_map.json 哈希 + SKILL/README 版本行（不动正文）
node scripts/check_sites.js           # 复核；报「孤儿段」= 索引缺品牌行
```

## 环境

Windows 本机：无 Python / 无 npm 网络；用 `curl --ssl-no-revoke`、`node scripts/triage.js`、browser MCP 取数。

**DLP 干扰（2026-11-18 / 2026-11-25 实测）**：本机 DLP 可能改写 xlsx 尾部字节，也可能让复制进来的 `tar.gz` 长度不变但 gzip 校验失败；office-excel MCP 对部分成品会返回 `QODER_OFFICE_XLSX_ARCHIVE_INVALID`。判断文件是否损坏请用 Excel/exceljs 打开或跑 `verify_xlsx`，归档用 `tar -tzf` 校验，**不要按字节数或二进制 diff 下结论**。
`write_xlsx.js` 的依赖 exceljs **已内置在 `scripts/node_modules`**，直接 `cd scripts && node write_xlsx.js …` 即可；只有该目录被清理时才需要 `npm i exceljs`。

## 离线依赖（GitHub 发布副本）

GitHub 发布副本提供 `vendor/node_modules.tar.gz`（exceljs 4.4.0 及依赖，约 7.5 MB）。clone 后先校验归档，再解压：

```bash
tar -tzf vendor/node_modules.tar.gz >/dev/null && tar -xzf vendor/node_modules.tar.gz -C scripts/
node scripts/selftest.js
```

本机工作区可能因 DLP 不保留该归档，或复制后 gzip 校验失败；此时直接使用已内置的 `scripts/node_modules`。如果该目录也被清理，删除损坏的 vendor 包后在 `scripts/` 下运行 `npm i exceljs`。
