# 西班牙 ES — 站点坑位详段

> 市场码 ES · 1 段 · 品牌：Audi
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-10-30 · 文中 snapshotVersion / token / 车型 id 均为当时实测值，必须现取

---

### Audi（ES：官网全域 Akamai 封锁，走 Autopista 替代源）

| 项 | 内容 |
|---|---|
| **封锁范围** | `www.audi.es` 首页即 403；`audi.de`/`audi.fr`/`audi.it`/`configurator.audi.com` 同 403；PDF 直链（`/dam/nemo/es/tarifas/...pdf`）亦 403 |
| **可通站点** | `www.audi.com/en`（纯品牌页，**无价格**）、`audi-mediacenter.com`（新闻中心 200）、`mediaservice.audi.com`(200) |
| **判定** | VW Group 对数据中心 IP/自动化流量的**全域策略性封锁**，非单机 IP 问题（三种通道全试过） |
| **替代源** | `https://datos.autopista.es/coches/audi/<slug>/` — Autopista（西班牙 1973 年创刊权威汽车媒体）逐车系版本表 |
| **车系 slug** | `a1 a2-e-tron a3 a5 a6 a6-e-tron a8 e-tron-gt q2 q3 q4 q5 q6 q7 q8 q9`（16 个） |
| **解析法** | 每页唯一 `<table>`，列 = `Versión \| Potencia \| Carrocería \| Precio`；价格格式 `30.300€`（**点号千分位**，需先还原整数再格式化！） |
| **口径验证** | A2 e-tron 四条与 Audi 官方发布稿（经 Europa Press 转发）**逐条吻合**：37.760 / 41.460 / 47.360 / 56.640 |
| **促销陷阱** | `launch edition` 条目 35.760 €（低于官方最低价 2.000 €）→ **促销价，须剔除**；另有 4 条 launch edition 与普通版同价 → **冗余重复行** |
| **容量口径** | Autopista 用**可用容量**（50/58/79 kWh），Audi 官方用**总容量**（52/61/84 kWh）→ 保留原始写法，勿混用 |
| **年款** | Autopista 尾部标 `(2026)` 是**其数据标注，非官网 MY** → 按规则写「官网无年款」 |
| **已知缺口** | A1、Q2 仅有 2020–2024 年份记录（Audi 2026 年已停产，由 A2 e-tron 接替），停销状态须另行核实 |
