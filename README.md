# vehicle-price-research

> 知识库版本：2026-11-18 · 17 市场 / 144 段 · 交付前跑 `node scripts/check_all.js`（生成器自测 + 知识库一致性）

「品牌 × 市场」官网 MSRP 采集 → 统一 8 列 XLSX（+ 年款依据副表）。

## 开工前（任何 agent 都要先做这三步）

1. 读 `SKILL.md`（规则、口径、自检清单）。
2. 读 `references/sites.md`（**索引 + 通用方法**，约 260 行）。
3. 按索引里的「详段」只读**对应市场文件** `references/sites/<market>.md`，不要整读、不要只看索引就动手。

## 收工前（两个硬门槛，未通过不算完成）

```bash
node scripts/selftest.js        # 生成器 5 组夹具，逐格比对
node scripts/check_sites.js     # 知识库：索引↔市场文件的段数/覆盖/围栏/哈希
node scripts/verify_xlsx.js <xlsx> <rows.json> --basis year_basis.json --money euro --date YYYYMMDD  # 成品回读
node scripts/verify_dir.js <交付目录>   # 目录级：同品牌多文件 / _vN / 重复交付 / 年款·日期格式
```

交付前还要按 SKILL.md 第六节做**回读校验**（行数 / 8 列 / E 列 `@` / 冻结 / 筛选 / 逐行 0 差异）。

## 结构

```
SKILL.md                主规则（格式 / 口径 / 流程 / 反爬 A–E / 自检清单）
references/sites.md     索引 + 通用方法 + 止损判定（约 260 行）
references/sites/*.md   分市场详段（be/de/…/br/global）+ _map.json + _template.md
scripts/                triage.js（分诊）/ write_xlsx.js（唯一生成器）/ selftest.js / check_sites.js / update_sites_meta.js / verify_xlsx.js / verify_dir.js
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

**DLP 干扰（2026-11-18 实测）**：本机 DLP 会让同一个 xlsx 被 git 与 node/curl 读出不同的尾部字节（常见差 4 个零字节），`ls -l` 显示的是 4K 对齐后的分配大小。判断文件是否损坏请用 Excel/exceljs 打开或跑 `verify_xlsx`，**不要按字节数或二进制 diff 下结论**。
`write_xlsx.js` 的依赖 exceljs **已内置在 `scripts/node_modules`**，直接 `cd scripts && node write_xlsx.js …` 即可；只有该目录被清理时才需要 `npm i exceljs`。

## 离线依赖（GitHub 仓库里）

仓库的 `vendor/node_modules.tar.gz` 是 exceljs 4.4.0 及其依赖的打包（约 7.5 MB，内容与本地 `scripts/node_modules` 一致）。clone 后解压即可离线运行：

```bash
tar -xzf vendor/node_modules.tar.gz -C scripts/
node scripts/selftest.js
```

> 为什么不直接提交 `scripts/node_modules/` 目录：里面 5889 个文件，走 GitHub API 单次提交不现实；打包成一个文件更稳。也可以忽略它，在 `scripts/` 下 `npm i exceljs`。
