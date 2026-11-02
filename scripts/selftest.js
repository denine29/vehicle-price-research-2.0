#!/usr/bin/env node
/*
write_xlsx.js 自测（不需要 exceljs、不需要网络）
用法: node selftest.js
原理: 临时目录里放一份 write_xlsx.js + 桩模块 exceljs（只记录要写的单元格），
      跑几组夹具并逐格比对，同时检查该出现的 [WARN] 是否出现。
*/
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const STUB = [
  "const fs = require('fs');",
  "class Cell { constructor(v) { this.value = v; } }",
  "class Row {",
  "  constructor(vals) { this.cells = vals.map(v => new Cell(v)); }",
  "  eachCell(opts, cb) { if (typeof opts === 'function') { cb = opts; } this.cells.forEach((c, i) => cb(c, i + 1)); }",
  "}",
  "class WS {",
  "  constructor(name) { this.name = name; this.rows = []; this._cols = []; }",
  "  set columns(v) {} set views(v) {} set autoFilter(v) {}",
  "  get rowCount() { return this.rows.length; }",
  "  addRow(arr) { const r = new Row(arr); this.rows.push(r); return r; }",
  "  eachRow(cb) { this.rows.forEach((r, i) => cb(r, i + 1)); }",
  "  getColumn(i) { return this._cols[i] || (this._cols[i] = {}); }",
  "}",
  "class WB {",
  "  constructor() { this.sheets = []; }",
  "  addWorksheet(n) { const ws = new WS(n); this.sheets.push(ws); return ws; }",
  "  get xlsx() { return { writeFile: async (f) => { fs.writeFileSync(f + '.dump.json', JSON.stringify(this.sheets.map(s => ({ name: s.name, rows: s.rows.map(r => r.cells.map(c => String(c.value))) })))); } }; }",
  "}",
  "module.exports = { Workbook: WB };",
].join('\n');

const date = '20261029';
const HEADER = ['品牌', '官网车型名称', '官网型号名称', '年款', '官网MSRP', '是否停销', '数据日期', '燃油分类'];
const CASES = [];
CASES.push({
  name: 'euro + 官网原串 + 未核实',
  rows: [
    { brand: 'Škoda', model: 'Fabia', version: '1,0 TSI 5v Man. Active', year: 'MY2027', price: '21.505,00', discontinued: '否', fuel: 'Benzine' },
    { brand: 'Škoda', model: 'Enyaq', version: '82 kWh 1v 4x4 RS', year: 'MY2027', price: '70.655,00', discontinued: '否', fuel: 'Elektrisch' },
    { brand: 'Škoda', model: 'Superb Limo', version: '2,0 TDI DSG7 Active', year: 'MY2027', price: '未核实', discontinued: '否', fuel: 'Diesel' },
  ],
  args: ['--money', 'euro'],
  expect: [
    ['Škoda', 'Fabia', '1,0 TSI 5v Man. Active', 'MY2027', '21.505,00', '否', date, 'Gasoline'],
    ['Škoda', 'Enyaq', '82 kWh 1v 4x4 RS', 'MY2027', '70.655,00', '否', date, 'BEV'],
    ['Škoda', 'Superb Limo', '2,0 TDI DSG7 Active', 'MY2027', '未核实', '否', date, 'Diesel'],
  ],
  warns: ['未传 --year-basis'],
});

CASES.push({
  name: 'comma + 混动优先级 + iV 大小写',
  rows: [
    { brand: 'Ford', model: 'Puma', version: 'Titanium 1.0L EcoBoost Hybrid (mHEV) 125PS', year: 'MY27', price: 31870, discontinued: '否', fuel: 'Benzine' },
    { brand: 'Ford', model: 'Puma', version: '1,5 TSI iV DSG6', year: 'MY27', price: 42000, discontinued: '否', fuel: 'Benzine/Hybride' },
    { brand: 'Ford', model: 'Puma', version: '2,0 TDI IV', year: 'MY27', price: 38000, discontinued: '否', fuel: 'Diesel' },
    { brand: 'Ford', model: 'Puma', version: 'Golf IV', year: 'MY27', price: 30000, discontinued: '否', fuel: 'Diesel' },
  ],
  args: ['--money', 'comma'],
  expect: [
    ['Ford', 'Puma', 'Titanium 1.0L EcoBoost Hybrid (mHEV) 125PS', 'MY27', '31,870', '否', date, 'MHEV'],
    ['Ford', 'Puma', '1,5 TSI iV DSG6', 'MY27', '42,000', '否', date, 'PHEV'],
    ['Ford', 'Puma', '2,0 TDI IV', 'MY27', '38,000', '否', date, 'Diesel'],
    ['Ford', 'Puma', 'Golf IV', 'MY27', '30,000', '否', date, 'Diesel'],
  ],
  warns: [],
});

CASES.push({
  name: 'lakh 千分位',
  rows: [
    { brand: 'Porsche', model: '911', version: '911 Carrera', year: 'MY2027', price: 2112900, discontinued: '否', fuel: 'Gasoline' },
    { brand: 'Porsche', model: '911', version: '911 Carrera S', year: 'MY2027', price: '2,11,29,000', discontinued: '否', fuel: 'Gasoline' },
  ],
  args: ['--money', 'lakh'],
  expect: [
    ['Porsche', '911', '911 Carrera', 'MY2027', '21,12,900', '否', date, 'Gasoline'],
    ['Porsche', '911', '911 Carrera S', 'MY2027', '2,11,29,000', '否', date, 'Gasoline'],
  ],
  warns: [],
});
CASES.push({
  name: '年款依据副表 + 重复分组告警',
  rows: [
    { brand: 'X', model: 'A', version: 'v1', year: 'MY2027', price: 1000, discontinued: '否', fuel: 'Benzine' },
    { brand: 'X', model: 'A', version: 'v2', year: 'MY2027', price: 2000, discontinued: '否', fuel: 'Benzine' },
  ],
  args: ['--money', 'euro'],
  basis: [
    { brand: 'X', model: 'A', year: 'MY2027', basis: 'b', quote: 'q', source: 's' },
    { brand: 'X', model: 'A', year: 'MY2027', basis: 'b', quote: 'q', source: 's' },
  ],
  expect: [
    ['X', 'A', 'v1', 'MY2027', '1.000,00', '否', date, 'Gasoline'],
    ['X', 'A', 'v2', 'MY2027', '2.000,00', '否', date, 'Gasoline'],
  ],
  warns: ['同一分组出现多次'],
  sheet2: ['品牌', '官网车型名称', '年款', '覆盖型号数', '年款依据（判定过程）', '官网原文（逐字）', '来源位置'],
});

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vpr-selftest-'));
fs.copyFileSync(path.join(__dirname, 'write_xlsx.js'), path.join(dir, 'write_xlsx.js'));
fs.mkdirSync(path.join(dir, 'node_modules', 'exceljs'), { recursive: true });
fs.writeFileSync(path.join(dir, 'node_modules', 'exceljs', 'index.js'), STUB);

let failed = 0;
CASES.forEach((c, idx) => {
  const rowsPath = path.join(dir, 'rows-' + idx + '.json');
  fs.writeFileSync(rowsPath, JSON.stringify(c.rows));
  const outPrefix = path.join(dir, 'out-' + idx);
  const args = [path.join(dir, 'write_xlsx.js'), rowsPath, outPrefix, '--date', date].concat(c.args);
  if (c.basis) {
    const bp = path.join(dir, 'basis-' + idx + '.json');
    fs.writeFileSync(bp, JSON.stringify(c.basis));
    args.push('--year-basis', bp);
  }
  const r = spawnSync(process.execPath, args, { encoding: 'utf8' });
  const logs = (r.stdout || '') + (r.stderr || '');
  const problems = [];
  if (r.status !== 0) problems.push('退出码 ' + r.status + '：' + logs.trim());

  let dump = null;
  try { dump = JSON.parse(fs.readFileSync(outPrefix + '.xlsx.dump.json', 'utf8')); }
  catch (e) { problems.push('没有生成输出'); }

  if (dump) {
    const got = dump[0].rows;
    const want = [HEADER].concat(c.expect);
    if (got.length !== want.length) problems.push('行数 ' + got.length + ' ≠ 期望 ' + want.length);
    const n = Math.min(got.length, want.length);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < 8; j++) {
        if (got[i][j] !== want[i][j]) problems.push('第' + (i + 1) + '行第' + (j + 1) + '列: ' + JSON.stringify(got[i][j]) + ' ≠ ' + JSON.stringify(want[i][j]));
      }
    }
    if (c.sheet2) {
      const s2 = dump[1];
      if (!s2) problems.push('缺少第二张表');
      else if (JSON.stringify(s2.rows[0]) !== JSON.stringify(c.sheet2)) problems.push('副表表头不符: ' + JSON.stringify(s2.rows[0]));
    }
  }
  c.warns.forEach(w => { if (logs.indexOf(w) < 0) problems.push('缺少预期告警: ' + w); });

  if (problems.length) {
    failed++;
    console.log('✘ ' + c.name);
    problems.slice(0, 8).forEach(p => console.log('   - ' + p));
  } else {
    console.log('✔ ' + c.name);
  }
});

fs.rmSync(dir, { recursive: true, force: true });
console.log(failed ? '\n' + failed + '/' + CASES.length + ' 组失败' : '\n全部通过（' + CASES.length + '/' + CASES.length + '）');
process.exit(failed ? 1 : 0);
