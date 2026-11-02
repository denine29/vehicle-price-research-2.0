# 智利 CL — 站点坑位详段

> 市场码 CL · 1 段 · 品牌：Opel
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-10-30 · 文中 snapshotVersion / token / 车型 id 均为当时实测值，必须现取

---

### Opel（CL 智利：Stellantis，curl 被拦但 Playwright 可通）

| 项 | 内容 |
|---|---|
| **curl** | 403 `errors.edgesuite.net`（Akamai） |
| **Playwright** | ✅ **可通**（`locale='es-CL'` + 常规 Chrome UA 即可，无需特殊处理） |
| **报价站陷阱** | `cotizador.opel.cl` 被 Cloudflare 拦（"Cybersecurity Policy Violation"），**不可用**；但主站车型页已有价格，无需它 |
| **车系路径** | `/coches/corsa-models/new-corsa/overview-features.html`、`/coches/mokka.html`、`/coches/crossland.html`、`/coches/grandland.html`、`/coches/modelos-combo-/combo/resumen.html` |
| **关键手法** | 车型页价格区**懒加载** → 必须 `mouse.wheel(0,1200)` 滚动 6–8 次触发，否则 body 只有 800–2400 字符且无价格 |
| **价格提取** | 用 `pg.evaluate` 遍历所有元素取 `innerText`，筛含 `$[\d\.]{6,}` 且长度 <400 的容器 |
| **价格格式** | 智利比索 `$13.990.000`（点号千分位，无小数）；另有 `PIE + 25 CUOTAS DE $193.990` = **分期月供，非车价，勿采** |
| **型号名结构** | `<车系> \| <配置等级> <燃油> <马力>HP <变速箱> \| PRECIO DESDE \| <价格>`，如 `CORSA \| Edition Gasolina 100HP MT` |
| **年款** | 官网未标 MY → 写「官网无年款」 |
| **世代混用** | Grandland 有老款（`GRANDLAND GS Gasolina 130HP MT` 19.990.000）与新款（`NEW GRANDLAND ...` 27.490.000）并存，车系名不同须区分 |
| **无公开价** | `Combo` 为商用车（Cargo van），页面仅 "¡Cotiza ahora!" 询价，**无公开 MSRP** |
| **在售车系** | CORSA / NEW MOKKA / NEW CROSSLAND / NEW GRANDLAND / GRANDLAND；Combo 无价 |
