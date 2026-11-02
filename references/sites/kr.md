# 韩国 KR — 站点坑位详段

> 市场码 KR · 1 段 · 品牌：KG Mobility / KGM
> 返回索引 [../sites.md](../sites.md)（含通用方法 / 止损判定 / 集团级套路）
> 最后实测：2026-10-30 · 文中 snapshotVersion / token / 车型 id 均为当时实测值，必须现取

---

### KG Mobility / KGM（韩国 `www.kg-mobility.com`：主 HTML 被地理屏蔽，**挖 JS bundle 直取无鉴权 API**）✅

**结论：官网首页 HTML 对大陆出口 IP 返回「空壳」（只有 `<head>`，无 `<body>`、无 `#app`），但 `/assets/*.js` 与 `/attached/*.pdf` 可 curl 直连；真实后端 `web.kg-mobility.com` 全通且**无需鉴权**。实测交付 62 条 trim 级价格。**

| 项 | 内容 |
|---|---|
| 连通性 | ⚠️ `https://www.kg-mobility.com/` curl **HTTP 000**（TLS 握手成功、之后无 HTTP 响应）；`https://web.kg-mobility.com/` curl **200** |
| **★ 空壳页判别（关键）** | Playwright 拿到的 DOM 仅 `4894 B`：`<head>` 完整、`</head></html>` 直接结束、**无 `<body>`、无 `#app`**；但监听网络可见 `GET /assets/index-QYD-0y8d.js → 200`。→ **静态资源放行、主 HTML 被地理性裁剪**，不要以为是 SPA 没渲染，直接去挖 JS bundle |
| **★ JS bundle 可 curl** | `curl https://www.kg-mobility.com/assets/index-QYD-0y8d.js` → **200，1.5 MB**（首页 000 但 assets 通，很反直觉） |
| **★ API base（从 bundle 挖出）** | bundle 内 `__vite_import_meta_env__={VITE_API_BASE_PATH:"/api", VITE_API_SERVER_URL:"https://web.kg-mobility.com"}`，且 `getOriginBasePath()`：`{"/api"→"/app","/erms-api"→"/erms","/search-api"→"/kgm"}` → **实际 base = `https://web.kg-mobility.com/app`** |
| **★ SERVICE_PATH 映射** | `{LOGIN:"/login",MEMBER:"/member",DISPLAY:"/display",ESTIMATE:"/estimate",VEHICLE:"/vehicle",SUBSIDY:"/subsidy",...}`，拼在 base 之后 |
| **★ 在售车型清单** | `GET /app/display/getPlpModelList.do` → `body.typeList[].modelList[]{dispCatNo,modelNm,modelCd,price,flag,eleccarYn,estimateCatNo}`（分 SUV / 픽업트럭&밴 两类，首页车系卡片数据源）|
| **★ 车型详情 + 官方 PDF** | `GET /app/display/getCarDetailContents.do?dispCatNo=<id>` → `body.keyVisual.fileList[]{title:"카탈로그"/"가격표", fileUrl}`（**官方价格表 PDF = 판매가격权威源**）|
| **★ 报价车型清单** | `GET /app/estimate/getCarModelList.do` → `body[]{modelCd,modelName,engineInfo,carType,categoryNo}`（比 PLP 更全，含 밴 / 롱데크 / 7인승 细分，**carType 是单字母码，必须带回**）|
| **★ trim 级价格（核心）** | `GET /app/estimate/getCarModelTrimList.do?modelCd=<3位车系码>&carType=<单字母>` → `body[]{homepageTrimNm,className,oilName,oilCd,gearName,driveCd,carSuplAmt,carCdType,carCd}`。**两参数缺一即报 9103「요청 파라미터 값이 잘못되었습니다」** |
| **★ 价格口径（重要）** | `carSuplAmt` = 官网 PDF 的「**판매 가격**」（**세제혜택 적용 전**原价，含 VAT）。而 PLP 的 `price` / 车型页 `시작가격 ...부터(세제혜택 후)` 是**扣掉税制优惠后**的起价。**按"不采折扣/补贴价"规则取 `carSuplAmt`**：混动差 100 万韩元、纯电差 239 万韩元，已验证 7 份 PDF 完全一致 |
| 无鉴权端点差异 | `getDispModelList.do` 返回 `9100 인증이 필요합니다`；本任务未用到的历史车型接口不必碰 |
| 历史车型码 | `GET /app/vehicle/getVehicleList.do` → `[]` 无参返回 `carCode/carType/carNm`（含已停产 코란도·렉스턴·체어맨 等，**仅作对照，勿入交付**）|
| **⚠ Actyon 价格表缺失** | `dispCatNo=200000100010018/…016` 的 `fileUrl` 是占位符 `https://www.kg-mobility.com/actyon_p`（返回 3202 B 的 SPA 壳）→ **PDF 拿不到，改用 trim API 的 `carSuplAmt`**（已与其它 PDF 校验过口径）|
| **⚠ 后处理坑** | ① `className` 的 `_4월/_9월/_12월` 是**排产月标记**，非年款，去掉 ② `className` 的 `S `/`L ` 前缀 = 스탠다드/롱 데크标记 ③ `경유`=柴油（与 `디젤` 同义，`oilCd` 都是 D），前缀需归一 ④ `carCdType=="2"` 且 `className` 含 `(투톤)` = 双色车身同价重复项，**剔除** ⑤ `TAXI` trim（如 `TAXI_12월 48,040,000`）**不在官方零售价格表 PDF 内**，剔除 |
| **★ 年款判定** | 仅 `가격표` PDF 封面标题明确写年份的才算：`토레스 EVX 2027`（FL5）、`무쏘 EV 2027`（OP5）→ `MY2027`；其余封面只写 `뉴 토레스` / `뉴 토레스 하이브리드` / `렉스턴 뉴 아레나` / `무쏘` / `더 뉴 티볼리` → **官网无年款，严禁按发布新闻推断** |
| **★ 车系 × modelCd（13 个在售）** | `MC5` 액티언(3617만↑) · `MD5` 액티언 하이브리드(3895만↑) · `MW5` 토레스(2996만↑) · `MY5` 토레스 하이브리드(3302만↑) · `FL5` 토레스 EVX(4602만↑) · `MV2` 토레스 밴(2815만↑) · `FL2` 토레스 EVX 밴(4520만↑) · `UP5` 무쏘(스탠다드 데크) · `UH5` 무쏘(롱 데크) · `OP5` 무쏘 EV(4850만↑) · `GL5` 렉스턴 뉴 아레나(5인승) · `GL7` 렉스턴 뉴 아레나(7인승) · `XW5` 티볼리(2097만↑) |
| **★ 燃料映射** | `가솔린`(G)→`Gasoline`、`디젤`/`경유`(D)→`Diesel`、`하이브리드`(H)→`HEV`、`전기`(E)→`BEV` |
| 促销页干扰 | `/od/promotion/monthly-benefits?modelCd=XX` 是「이달의 구매 혜택」，数字是**含当月金融优惠的「부터」起价**，**不要采**；WebFetch 能正常渲染该页（说明它是 SSR，而首页是空壳） |

> 📌 **通用教训**：**curl 首页 000 但 curl `/assets/xxx.js` 200 → 是「主 HTML 被地理裁剪」，不是整站封锁**。此时正确动作是**下载 JS bundle，grep `VITE_*` / `SERVICE_PATH` / `baseURL` / `createInstance` 找到真实 API 域名与路径**，往往后端域名（如 `web.*`）完全不受地理限制。同类案例：IM Motors（Next.js 挖 `__NEXT_DATA__`）。
