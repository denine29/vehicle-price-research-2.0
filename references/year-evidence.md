# 年款证据管线（EXPERIMENTAL）

> **当前状态：实验性，不参与稳定交付硬门槛。** 修复并完成真实样本回归前，不得用本管线替代人工复核，也不得把 `coverage.note` 等人工说明当作官网逐字证据。稳定流程见 `SKILL.md` 的年款规则与 `year_basis.json` 要求。

目标：把“年份候选”与“最终年款”分开。脚本只抽证据，模型/人只复核模糊项，最后自动生成「年款依据」副表。

## 已知限制（修复前不得用于自动定年款）

- `MY27 / MY2027 / MY2027.5 / 25.5MY / 26.50` 等写法的规范化匹配尚未完成；
- 整数形式 `modelYear: 2027` 尚未作为高置信显式字段；
- HTML 采集会删除 `<script>`，可能漏掉 JSON-LD / Next.js 结构化年款；
- 多行价格表可能被合并，导致跨车型年份串入；
- 构建器尚未拒绝高置信年份冲突，`coverage.note` 也不等于官网逐字原文。

因此当前只能人工辅助参考，不能把候选结果直接写入最终交付。

## 1. 采集候选

```bash
node scripts/collect_year_evidence.js <page.html|data.json|text.txt|price.pdf> \
  --brand <品牌> --model <车系> \
  --type html|json|text|pdf \
  --url <官方 URL> --locator <页面位置> \
  --out <evidence.json>
```

输出包含：

- `candidates`：年份、分数、原因、逐字原文、±150 字上下文；
- `rejected`：版权年、生效日、活动/奖项年等排除项；
- `summary.accepted`：分数 ≥85 的年份；
- `summary.review`：分数 70–84、需要第二来源或人工复核的年份。

脚本不会把整份 HTML/PDF 回传上下文，只输出精简 JSON。

## 2. 分数与判定

| 证据 | 分数 | 单独定年款 |
|---|---:|---|
| `MY2026` / `Model Year 2026` / `модельный год 2026` | 100 | 是 |
| `2026 г.в.` / `год выпуска 2023` / `2026 года производства`，且绑定车型/trim/价格/库存车 | 95 | 是 |
| `ano/modelo` 双年份 | 98 | 取第二个 |
| 价格表同一行 `2025 2026` 年份列 | 90 | 是 |
| 年份与品牌/车型同句 | 85 | 是 |
| 年份只与价格/trim 同句 | 75 | 需两个独立来源 |
| 文件名、图片名、DAM 路径 MY | 20 | 否 |
| 版权年、生效日、活动期、奖项年、WLTP 数据年 | 0 | 否 |

边界：`Price applicable for 2026 build vehicle` 若只是文档级说明，不采；若它是某一车型/版本价格行的年份，则采。

## 3. 写入最终年份

把复核后的年份写进 `rows.json`。多年款并售时逐行写不同年份；不要把同一车型的所有行强行覆盖成一个年份。

## 4. 生成年款依据

```bash
node scripts/build_year_basis.js rows.json evidence1.json evidence2.json \
  --out year_basis.json \
  --coverage coverage.json
```

`coverage.json` 用于证明“官网无年款”查全过：

```json
[
  {
    "brand": "JAC",
    "model": "Kangoo",
    "checked": ["page", "configurator", "pdf_none"],
    "urls": ["https://example.com/kangoo"],
    "note": "车型页、配置器均无年份；官网无关联规格表/价目表"
  }
]
```

`checked` 必须同时含 `page`、`configurator`、`pdf` 或 `pdf_none`。有 70–84 分候选时，需人工复核并在 coverage 写 `reviewed_low_confidence: true`。

构建器会拒绝：

- 写了年份但无高置信证据；
- 写「官网无年款」但缺来源覆盖；
- 写「官网无年款」但存在 ≥85 分年份候选；
- 同一车型有低置信候选却未复核。

## 5. 真实校准

- Tenet：`TENET T7 2026 г.в.` → 2026；
- Avatr：`… на автомобили 2026 года производства` → 2026；
- Yangwang：`Год выпуска 2023` → 2023；
- Soueast S07：价目表 `2025 2026` 两列 → 2025/2026 分行；
- JAC NO：`Gjeldende fra Januar 2026` → 生效日，排除；
- Lotus NO：`MY26_...webp` → 文件名，排除；
- Subaru UK：Price Breakdown 无年份 → 查全后写「官网无年款」；
- Škoda UK：`Edition 30` 是 trim 名，不是年份。

## 6. 自测与交付

```bash
node scripts/selftest_year_evidence.js
node scripts/verify_xlsx.js <xlsx> rows.json --basis year_basis.json --money comma --date YYYYMMDD
```

自测覆盖正例、反例、双年份、图片文件名、构建器缺证据/缺覆盖拦截。
