# 希腊 GR — 站点坑位详段

> 市场码 GR · 1 段 · 品牌：Nissan
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-10-30 · 文中 snapshotVersion / token / 车型 id 均为当时实测值，必须现取

---

### Nissan（GR 希腊：主站 Akamai 403，`build.nissan.gr` 配置器可直连）✅

| 项 | 内容 |
|---|---|
| **主站** | `www.nissan.gr` — **Akamai IP 级封锁**（403 + 固定 65324/64227 字节错误页），换 UA/headers 均无效 |
| **可用源** | `build.nissan.gr` 配置器（服务端 HTML 直出，**可直接 curl**） |
| **官方价格表** | LTPF PDF（`ΛΤΠΦ`/`ΛTPF` = 建议零售价；`ΤΙΜΗ ΑΠΟ` = 起价） |
| **坑** | ① 版本 slug 用**下划线**（`n_connecta`、`techna_plus`）；② 车系名含连字符（`X-Trail`）正则要用 `([\w\-]+)`；③ 两者价差大，**配置器优先** |
