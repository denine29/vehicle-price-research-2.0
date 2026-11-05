#!/usr/bin/env node
/*
交付前回读校验：直接读成品 XLSX，核对结构 + 与源数据逐行比对。
用法:
  node verify_xlsx.js <xlsx> [rows.json] [--basis year_basis.json] [--money euro] [--date YYYYMMDD]
  不给 rows.json 时只做结构校验（适合检查别人/COM 生成的表）
退出码: 0 全过 / 1 有错误
*/
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { fmtPrice, fuelClass, parsePrice } = require('./write_xlsx');

const HEADER = ['品牌', '官网车型名称', '官网型号名称', '年款', '官网MSRP', '是否停销', '数据日期', '燃油分类'];
const H2 = ['品牌', '官网车型名称', '年款', '覆盖型号数', '年款依据（判定过程）', '官网原文（逐字）', '来源位置'];
const FUELS = ['Gasoline', 'Diesel', 'MHEV', 'HEV', 'PHEV', 'REEV', 'BEV', 'FCV', 'LPG', 'Dual Fuel', '未标注'];
const MARKS = ['官网无价格', '未核实'];

const argv = process.argv.slice(2);
const opts = {}, pos = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a.startsWith('--')) { const v = (i + 1 < argv.length && !argv[i + 1].startsWith('--')) ? argv[++i] : true; opts[a.slice(2)] = v; }
  else pos.push(a);
}
const xlsxPath = pos[0];
const rowsPath = pos[1] || null;
const basisPath = opts.basis || null;
const money = opts.money || null;
const wantDate = opts.date || null;
const skipSheet2 = !!opts['skip-sheet2'];
if (!xlsxPath) { console.error('用法: node verify_xlsx.js <xlsx> [rows.json] [--basis b.json] [--money euro] [--date YYYYMMDD]'); process.exit(1); }

const errs = [], warns = [];
const add = (m) => errs.push(m);
const cellText = c => {
  const v = c.value;
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') {
    if (v.richText) return v.richText.map(x => x.text).join('');
    if (v.text) return String(v.text);
    if (v.result !== undefined) return String(v.result);
    if (v.hyperlink) return String(v.text || v.hyperlink);
  }
  return String(v);
};
const autoRange = ws => {
  const a = ws.autoFilter;
  if (!a) return null;
  if (typeof a === 'string') return a;
  const f = a.from, t = a.to;
  if (!f || !t) return null;
  const L = n => String.fromCharCode(64 + n);
  return `${L(f.column)}${f.row}:${L(t.column)}${t.row}`;
};

(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  const ws = wb.getWorksheet('官网价');
  if (!ws) { console.log('[FAIL] 找不到「官网价」工作表，实际: ' + wb.worksheets.map(w => w.name).join(', ')); process.exit(1); }
  if (!skipSheet2 && wb.worksheets.length !== 2) add(`工作表数 ${wb.worksheets.length} ≠ 2（应为 官网价 + 年款依据）`);
  const ws2 = skipSheet2 ? null : wb.getWorksheet('年款依据');
  if (!skipSheet2 && !ws2) add('缺「年款依据」副表');

  // ===== 结构 =====
  const last = ws.lastRow ? ws.lastRow.number : 0;
  const cols = ws.columnCount || 0;
  for (let c = 1; c <= 8; c++) {
    const got = cellText(ws.getCell(1, c)).trim();
    if (got !== HEADER[c - 1]) add(`表头第${c}列: "${got}" ≠ "${HEADER[c - 1]}"`);
  }
  if (cols !== 8) add(`列数 ${cols} ≠ 8`);
  const dataRows = last - 1;
  if (dataRows < 1) add('主表没有数据行');

  let frozen = false, af = null;
  const views = ws.views || [];
  if (views.some(v => v.state === 'frozen' && (v.ySplit || 0) >= 1)) frozen = true;
  if (!frozen) add('首行未冻结');
  af = autoRange(ws);
  const wantAf = `A1:H${last}`;
  if (!af) add('未设置自动筛选');
  else if (af !== wantAf) add(`筛选范围 ${af} ≠ ${wantAf}`);

  for (let r = 2; r <= last; r++) {
    const e = ws.getCell(r, 5);
    if (e.numFmt !== '@') add(`第${r}行 E 列格式 ${JSON.stringify(e.numFmt)} ≠ "@"`);
    const price = cellText(e).trim();
    if (!price) add(`第${r}行 MSRP 为空`);
    else if (!MARKS.includes(price)) {
      if (/[€$£฿¥]/.test(price)) add(`第${r}行 MSRP 含货币符号: ${price}`);
      else if (!/^[\d.,]+$/.test(price)) add(`第${r}行 MSRP 不是数字文本: ${price}`);
    }
    for (let c = 1; c <= 3; c++) if (!cellText(ws.getCell(r, c)).trim()) add(`第${r}行 第${c}列「${HEADER[c - 1]}」为空`);
    const fuel = cellText(ws.getCell(r, 8)).trim();
    if (!FUELS.includes(fuel)) add(`第${r}行 燃油分类取值非法: ${fuel}`);
    const d = cellText(ws.getCell(r, 7)).trim();
    if (!/^\d{8}$/.test(d)) add(`第${r}行 数据日期不是 YYYYMMDD 文本: ${d}`);
    else if (wantDate && d !== wantDate) add(`第${r}行 数据日期 ${d} ≠ ${wantDate}`);
  }

  // ===== 与源数据比对 =====
  if (rowsPath) {
    const rows = JSON.parse(fs.readFileSync(rowsPath, 'utf8').replace(/^\uFEFF/, ''));
    if (rows.length !== dataRows) add(`行数 ${dataRows} ≠ 源 ${rows.length}`);
    const n = Math.min(rows.length, dataRows);
    for (let i = 0; i < n; i++) {
      const r = rows[i], R = i + 2;
      const exp = [
        r.brand ?? '', r.model ?? '', r.version ?? '', r.year || '官网无年款',
        null,
        r.discontinued || '否',
        wantDate || cellText(ws.getCell(R, 7)).trim(),
        fuelClass([r.fuel, r.version].filter(Boolean).join(' ')),
      ];
      for (let c = 1; c <= 8; c++) {
        if (c === 5) continue;
        const got = cellText(ws.getCell(R, c)).trim();
        if (got !== String(exp[c - 1])) add(`第${R}行第${c}列: "${got}" ≠ "${exp[c - 1]}"`);
      }
      const gotP = cellText(ws.getCell(R, 5)).trim();
      if (money) {
        const want = typeof r.price === 'number' || r.price !== undefined ? fmtPrice(r.price, money) : '';
        if (gotP !== want) add(`第${R}行 MSRP: "${gotP}" ≠ "${want}"`);
      } else {
        const bothNum = !MARKS.includes(gotP) && !MARKS.includes(String(r.price));
        if (bothNum) {
          try { if (Math.abs(parsePrice(gotP) - parsePrice(r.price)) > 0.005) add(`第${R}行 MSRP 数值不符: ${gotP} vs ${r.price}`); }
          catch (e) { add(`第${R}行 MSRP 无法解析: ${gotP} / ${r.price}`); }
        } else if (gotP !== String(r.price)) add(`第${R}行 MSRP: "${gotP}" ≠ "${r.price}"`);
      }
    }
  } else warns.push('未给 rows.json：只做了结构校验，未与源数据逐行比对');

  // ===== 副表 =====
  if (ws2) {
    for (let c = 1; c <= 7; c++) {
      const got = cellText(ws2.getCell(1, c)).trim();
      if (got !== H2[c - 1]) add(`副表表头第${c}列: "${got}" ≠ "${H2[c - 1]}"`);
    }
    if ((ws2.columnCount || 0) !== 7) add(`副表列数 ${ws2.columnCount} ≠ 7`);
    const l2 = ws2.lastRow ? ws2.lastRow.number : 0;
    let sum = 0;
    for (let r = 2; r <= l2; r++) {
      const n = Number(cellText(ws2.getCell(r, 4)));
      if (!Number.isFinite(n)) add(`副表第${r}行 覆盖型号数不是数字`);
      else sum += n;
      if (!cellText(ws2.getCell(r, 6)).trim()) add(`副表第${r}行 缺「官网原文（逐字）」`);
      if (!cellText(ws2.getCell(r, 7)).trim()) add(`副表第${r}行 缺「来源位置」`);
    }
    if (sum !== dataRows) add(`副表覆盖型号数合计 ${sum} ≠ 主表行数 ${dataRows}`);
    if (basisPath) {
      const basis = JSON.parse(fs.readFileSync(basisPath, 'utf8').replace(/^\uFEFF/, ''));
      const groups = new Map();
      for (const r of (rowsPath ? JSON.parse(fs.readFileSync(rowsPath, 'utf8').replace(/^\uFEFF/, '')) : [])) {
        const k = [r.brand ?? '', r.model ?? '', r.year || '官网无年款'].join('||');
        groups.set(k, (groups.get(k) || 0) + 1);
      }
      const seen = new Set();
      for (const b of basis) {
        const k = [b.brand ?? '', b.model ?? '', b.year || '官网无年款'].join('||');
        if (seen.has(k)) add(`副表分组重复: ${k}`);
        seen.add(k);
        if (rowsPath && !groups.has(k)) add(`副表分组在主表不存在: ${k}`);
      }
      if (rowsPath) for (const k of groups.keys()) if (!seen.has(k)) add(`主表分组未被副表覆盖: ${k}`);
    }
  }

  console.log(`文件: ${path.basename(xlsxPath)}`);
  console.log(`主表: ${dataRows} 行 × ${cols} 列 · 冻结=${frozen} · 筛选=${af || '无'} · 副表=${ws2 ? (ws2.lastRow ? ws2.lastRow.number - 1 : 0) + ' 行' : '缺'}`);
  warns.forEach(w => console.log('[WARN] ' + w));
  if (errs.length) { console.log(`\n[FAIL] ${errs.length} 项:`); errs.slice(0, 30).forEach(e => console.log('  - ' + e)); process.exit(1); }
  console.log('[PASS] 结构与数据一致');
})().catch(e => { console.error('[FAIL] ' + e.message); process.exit(1); });
