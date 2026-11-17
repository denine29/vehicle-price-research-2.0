# 待复核知识（_pending）

> 只放「有线索但还没逐字验证」的内容；每条写：日期 / 来源 URL / 待验证点。
> 确认后合并进对应 `<market>.md` 的段，并从本文件删除。
> 以 `_` 开头 → 不参与索引与 `check_sites`/update_sites_meta 校验，不会污染正式库。

## 待复核

| 日期 | 市场 | 品牌/主题 | 线索 | 还缺什么 | 来源 |
|---|---|---|---|---|---|
| 2026-11-10 | JP | McLaren 参考价 | 官方经销商/媒体口径：Artura ¥33,000,000、Artura Spider ¥36,500,000（税込）；750S ¥39,300,000、750S Spider ¥43,000,000（2023-08 日本发表，含 3 年服务包）；GTS ¥29,700,000〜（McLaren Tokyo）/ ¥29,800,000（McLaren Azabu）；788HS 英国 £450,000、日本导入未定 | 经销商站 `mclaren-tokyo.com` curl 全 000（TLS/SNI 不可达），未直连复核；官网无价，按 skill 不入主表 | `https://mclaren-tokyo.com/gts`、`/artura_spider`；`https://mclaren-hakko.com/new-artura-spider/`；`https://www.autocar.jp/post/955364`（均 WebSearch 摘要） |
| 2026-11-10 | JP | McLaren Artura 2022 官方发表价 | 官方新闻 PDF 摘要 `価格は標準仕様で ¥29,650,000-(税込) 〜` | PDF 现走 curl 404（press 站对 curl 返回 3175B SPA 壳），未直连复核；2024 经销商口径已升至 ¥33,000,000，故不入表 | `https://cars.mclaren.press/assets/documents/original/14066-…FN1.pdf`（WebSearch 摘要） |
| 2026-11-11 | FR | Ford Transit Custom / Transit Courier / Transit Connect 商用线 | 本次穷举覆盖 TTS（Transit+E-Transit，90）、CHQ（Tourneo Courier+E-Courier，9）、CFJ（Tourneo Connect，16）、TTU（Tourneo Custom+E-Custom，42）；Tourneo 三车型已全量入 v3 | 未收 Transit Custom / E-Transit Custom、Transit Courier / E-Transit Courier、Transit Connect、Transit City、Ranger Raptor 等其余商用车型 — 若需要再按同一复合码法补 | `https://www.ford.fr/utilitaires-et-pick-up` |

| 2026-11-16 | FR | Mazda / GAC | 已交付 `Mazda_FR`（123 行）、`GAC_FR`，但 `fr.md` 至今无对应知识段 | 回写价格源/年款/坑 | `Desktop/ALL DATA/往期/法国/data` |

| 2026-11-16 | DE | Chevrolet / Mitsubishi / Togg | 交付目录有成品，`de.md` 无对应知识段 | 回写价格源/年款/坑 | `Desktop/德国/datas` |
| 2026-11-16 | US | Lexus | 交付目录有成品，`us.md` 无对应知识段 | 回写价格源/年款/坑 | `Desktop/ALL DATA/往期/美国/data` |

## 证据欠账（旧段，缺 URL/日期；动到哪段就顺手补哪段）

| 市场 | 段 | 缺什么 |
|---|---|---|
| de | Aston Martin DE / Elaris DE | URL；Elaris 破产依据 |
| global | Aston Martin / 其它市场速记 | URL；日期 |
| in | Ford India / Porsche India | URL |
| th | Chevrolet / Tata Motors / Tesla | URL；Tata/Tesla 缺日期 |
