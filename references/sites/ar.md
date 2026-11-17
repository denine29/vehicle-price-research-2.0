# 阿根廷 AR — 站点坑位详段

> 市场码 AR · 1 段 · 品牌：Ferrari
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-11-12 · 文中 slug / token / 车型 id 均为当时实测值，必须现取

---

### Ferrari AR（阿根廷 `www.ferrari.com/en-AR` → **302 到 `es-AR`**：curl 全通、纯 SSR；全系不公布价格）✅ 无价格

- **可达性**：`curl`（`--ssl-no-revoke` + 常规 UA）对 `www.ferrari.com/en-AR` **200、155 KB**；`/en-AR/robots.txt` 404。`/en-AR/auto/*` 一律 **302 → `/es-AR/auto/*`**（阿根廷只有西语站，`en-AR` 只是入口）。
- **取价源（结论：没有）**：车型页 `/es-AR/auto/<slug>` 全文 **0 个 `price`/`priceCurrency`/`offers` 字段，0 个 €/$/USD/ARS 金额**；配置器 `carconfigurator.ferrari.com/es_ES/ferrari_car_configurator/<slug>`（curl 000，需浏览器）正文也无整车价，只有公司 VAT/股本数字；官网 CTA 只有 `CONFIGURACIÓN` / `SOLICITAR INFORMACIÓN`。→ 19 个车型全部 `官网无价格`。
- **★ 在售全集**：`/es-AR/auto/gama` 的 Next.js `pageData.content.blocks` 共 19 个 `CarBanner`，按页面章节分三组：
  - **Gama**（11）：F80 · Luce · 12Cilindri · 12Cilindri Spider · Purosangue · 849 Testarossa · 849 Testarossa Spider · Amalfi · Amalfi Spider · 296 GTB · 296 GTS
  - **Serie especial**（5）：12Cilindri Manuale · SF90 XX Stradale · SF90 XX Spider · 296 Speciale · 296 Speciale A
  - **Serie Icona**（3）：Daytona SP3 · Monza SP1 · Monza SP2
  - 19 个「DESCUBRE EL …」CTA 与 blocks 一一对应；`elettrica` banner 301 → `ferrari-luce-engineering`，车型页为 `/es-AR/auto/ferrari-luce`。
- **★ slug 前缀坑**：gama 的 block slug 不带前缀，直接拼 `/auto/<slug>` 会 404（`12cilindri`、`12cilindri-spider`、`purosangue`、`amalfi-spider`、`12cilindri-manuale`、`daytona-sp3`、F80 均 404）；正确页是 `ferrari-12cilindri`、`ferrari-12cilindri-spider`、`ferrari-purosangue`、`ferrari-amalfi-spider`、`ferrari-12cilindri-manuale`、`ferrari-daytona-sp3`、`f80`。以页面 `<title>`/CTA 为准。
- **燃油（逐页原文）**：296 GTB/GTS `eléctrico enchufable (PHEV)`；296 Speciale/A `eléctrico enchufable`；849 Testarossa/Spider `PHEV inspirada en el SF90`；SF90 XX `PHEV`；F80 官方标签 `Híbrido`、V6 + MGU-K、**无 enchufable** → **HEV**；Luce → **BEV**；Purosangue V12 的 48V 电机是主动悬架/防倾执行器、非混动 → Gasoline；Amalfi/Amalfi Spider V8、12Cilindri 三款 V12、Daytona SP3/Monza SP1/SP2 V12 → Gasoline。
- **年款**：车型页/配置器均无 `MY` / `millésime` / `anno modello`；页面 JSON `listingData.year`（296 GTB 2021、296 GTS 2022、Purosangue 2022、12Cilindri 2024、F80 2024、849/296 Speciale 2025、Amalfi Spider/Luce 2026、SF90 XX 2023、Daytona 2021、Monza 2018）是**车型上市/列表年份**，界面不显示，不作年款；页脚 `Copyright 2026` 是版权年 → 全部 `官网无年款`。
- **停销**：官网对 19 款均无停售/下架字样；Monza 页仅写 `serie limitada`、Daytona 页 `edición limitada`。按官网口径全部 `否`；交付说明另注 Serie especial / Serie Icona 为限量/配额车型。
- **实测**：2026-11-12
- **来源**：`https://www.ferrari.com/es-AR/auto/gama`；`https://www.ferrari.com/es-AR/auto/{f80,ferrari-luce,ferrari-12cilindri,ferrari-12cilindri-spider,ferrari-purosangue,849-testarossa,849-testarossa-spider,ferrari-amalfi,ferrari-amalfi-spider,296-gtb,296-gts,ferrari-12cilindri-manuale,sf90-xx-stradale,sf90-xx-spider,296-speciale,296-speciale-a,ferrari-daytona-sp3,monza-sp1,monza-sp2}`；`https://carconfigurator.ferrari.com/es_ES/ferrari_car_configurator/296gtb`
- **原文**：`DESCUBRE EL FERRARI F80`；`PHEV`；`eléctrico enchufable o plug-in (PHEV)`；`Híbrido`；`serie limitada`；`edición limitada`；`Copyright 2026 - All rights reserved`
- **交付结果**：`Ferrari_AR_官网价_20261112.xlsx`（桌面），**19 条 / 19 车型**，全部 `官网无价格` + `官网无年款` + `否`；燃油 PHEV 8 · Gasoline 9 · HEV 1 · BEV 1。
