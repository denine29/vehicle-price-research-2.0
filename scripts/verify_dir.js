#!/usr/bin/env node
/*
交付目录级校验（逐文件结构校验之外的另一道闸）
用法: node verify_dir.js <交付目录>

查的是「单文件校验永远发现不了」的问题：
  1) 同一品牌出现多份文件（_v2/_v3、同日重抓、多日期）
  2) 文件名不合规（缺 _官网价_ / 带 _vN / 独立「年款」单表）
  3) 行集包含：A 的「品牌|车型|型号」全部出现在 B 里（集团汇总表 ⊃ 子品牌表等重复交付）
  4) 工作簿缺「官网价」或「年款依据」sheet
  5) 年款列含 /、空值；数据日期为空或与文件名日期不一致
退出码: 0 全过 / 1 有错误
*/
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { YEAR_OK } = require('./write_xlsx');

const DIR = process.argv[2];
if (!DIR) { console.error('用法: node verify_dir.js <交付目录>'); process.exit(1); }
const abs = path.resolve(DIR);
if (!fs.existsSync(abs)) { console.error('[FAIL] 目录不存在: ' + abs); process.exit(1); }

const cellText = c => {
  const v = c.value;
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') {
    if (v.richText) return v.richText.map(x => x.text).join('');
    if (v.text !== undefined) return String(v.text);
    if (v.result !== undefined) return String(v.result);
  }
  return String(v);
};

(async () => {
  const files = fs.readdirSync(abs).filter(f => /\.xlsx$/i.test(f) && !f.startsWith('~$'));
  const errs = [], warns = [];
  const info = [];

  for (const f of files) {
    const vN = /_v\d+\.xlsx$/i.test(f);
    const wantsPrice = /_官网价_/.test(f);
    const isYearOnly = /年款/.test(f) && !wantsPrice;
    if (vN) errs.push(`${f}: 文件名带 _vN（交付目录只留最终版）`);
    else if (isYearOnly) errs.push(`${f}: 独立「年款」单表，不是标准工作簿`);
    else if (!wantsPrice) warns.push(`${f}: 文件名不含「_官网价_」`);

    let wb;
    try { wb = new ExcelJS.Workbook(); await wb.xlsx.readFile(path.join(abs, f)); }
    catch (e) { errs.push(`${f}: 打不开（${e.message}）`); continue; }
    const ws = wb.getWorksheet('官网价');
    if (!ws) { errs.push(`${f}: 缺「官网价」sheet（实际: ${wb.worksheets.map(w => w.name).join(', ')}）`); continue; }
    if (!wb.getWorksheet('年款依据')) errs.push(`${f}: 缺「年款依据」副表`);

    const brands = new Set(), keys = new Set(), dates = new Set();
    let rows = 0;
    for (let r = 2; r <= (ws.lastRow ? ws.lastRow.number : 1); r++) {
      const brand = cellText(ws.getCell(r, 1)).trim();
      const model = cellText(ws.getCell(r, 2)).trim();
      const version = cellText(ws.getCell(r, 3)).trim();
      const year = cellText(ws.getCell(r, 4)).trim();
      const date = cellText(ws.getCell(r, 7)).trim();
      if (!brand && !model && !version) continue;
      rows++;
      brands.add(brand);
      keys.add([brand, model, version].join('|'));
      if (date) dates.add(date);
      if (!YEAR_OK.test(year)) errs.push(`${f} 第${r}行 年款非法: "${year}"`);
    }
    if (!rows) errs.push(`${f}: 没有数据行`);
    for (const d of dates) if (!/^\d{8}$/.test(d)) errs.push(`${f}: 数据日期不是 YYYYMMDD 文本: "${d}"`);
    if (dates.size > 1) errs.push(`${f}: 数据日期不统一 ${[...dates].join('/')}`);
    const fn = /_(\d{8})(?:_v\d+)?\.xlsx$/i.exec(f);
    if (!dates.size) errs.push(`${f}: 数据日期为空`);
    else if (fn && !dates.has(fn[1])) errs.push(`${f}: 数据日期 ${[...dates][0]} ≠ 文件名 ${fn[1]}`);
    info.push({ f, rows, brands, keys });
  }

  // 同品牌多文件
  const byBrand = new Map();
  for (const it of info) for (const b of it.brands) {
    if (!byBrand.has(b)) byBrand.set(b, []);
    byBrand.get(b).push(it.f);
  }
  for (const [b, list] of byBrand) if (list.length > 1) errs.push(`品牌「${b}」有 ${list.length} 份文件: ${list.join(' / ')}`);

  // 行集包含（跨文件重复交付）
  for (let i = 0; i < info.length; i++) for (let j = 0; j < info.length; j++) {
    if (i === j) continue;
    const A = info[i], B = info[j];
    if (A.keys.size < 2 || A.keys.size > B.keys.size) continue;
    let sub = true;
    for (const k of A.keys) if (!B.keys.has(k)) { sub = false; break; }
    if (sub) {
      if (A.keys.size === B.keys.size && i > j) continue;  // 行集完全相同只报一次
      errs.push(`重复交付: ${A.f} 的 ${A.keys.size} 行全部包含在 ${B.f} 里`);
    }
  }

  for (const it of info) console.log(String(it.rows).padStart(3) + ' 行 · ' + [...it.brands].join(',') + '  ' + it.f);
  console.log(`\n目录: ${abs}\n文件 ${files.length} 个 · 品牌 ${byBrand.size} 个`);
  warns.forEach(w => console.log('[WARN] ' + w));
  if (errs.length) { console.log(`\n[FAIL] ${errs.length} 项:`); errs.forEach(e => console.log('  - ' + e)); process.exit(1); }
  console.log('[PASS] 目录无重复品牌 / 无 _vN / 无重复交付 / 年款与日期格式合规（逐文件细项仍需 verify_xlsx）');
})().catch(e => { console.error('[FAIL] ' + e.message); process.exit(1); });
