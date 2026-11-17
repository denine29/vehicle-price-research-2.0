#!/usr/bin/env node
/*
把采集结果写成 vehicle-price-research 规定的 8 列 XLSX。

用法：
  node write_xlsx.js <rows.json> <输出前缀> --date YYYYMMDD [--money euro|lakh|comma|comma2] [--year-basis <year_basis.json>]

year_basis.json（可选，写了就在工作簿里加「年款依据」副表）：
  [{"brand","model","year","basis","quote","source"}, ...]
  按 brand+model+year 分组，覆盖型号数由主表自动统计；有主表行未被覆盖会告警。

rows.json: [{"brand","model","version","year","price","discontinued","fuel"}, ...]
  price 为数字（可带 "1.234,56" 这类千分位串）；格式化方式由 --money 决定（默认 comma）
    euro  -> 28.220,00   （欧元区，点千分位、逗号小数）
    comma -> 102,700     （美元/英镑/泰铢等，四舍五入到整数）
    comma2-> 106,230.27  （澳元等需要保留分的上路价：逗号千分位 + 两位小数）
    lakh  -> 2,11,29,000 （印度 lakh 分组）
  单元格只放数字，不带货币符号
  year 缺省 -> 官网无年款；discontinued 缺省 -> 否；fuel 缺省 -> 未标注
*/
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const FUEL = {
  gasoline: 'Gasoline', diesel: 'Diesel', mhev: 'MHEV', fcv: 'FCV', lpg: 'LPG',
  bev: 'BEV', 'dual fuel': 'Dual Fuel', phev: 'PHEV', hev: 'HEV', reev: 'REEV',
  汽油: 'Gasoline', 柴油: 'Diesel', 轻混: 'MHEV', 燃料电池: 'FCV', 液化石油气: 'LPG',
  纯电: 'BEV', 双燃料: 'Dual Fuel', 插电式混合动力: 'PHEV', 非插电式混合动力: 'HEV', 增成型电动: 'REEV',
};
const ALIAS = {
  petrol: 'Gasoline', benzine: 'Gasoline', gas: 'Gasoline', essence: 'Gasoline',
  electric: 'BEV', elektrisch: 'BEV', ev: 'BEV', hybrid: 'HEV', hybride: 'HEV',
  'mild hybrid': 'MHEV', 'plug-in hybrid': 'PHEV', 'plug in hybrid': 'PHEV',
  cng: 'LPG', 'fuel cell': 'FCV', hydrogen: 'FCV', 'range extender': 'REEV', erev: 'REEV',
};

// 混动族先于燃料词判定：复合标签（如 Benzine/Hybride）不能被 benzine 抢走；按 SKILL.md 对照表优先级逐字命中即停
// iV 要求大小写敏感（Škoda 写法），否则 "Golf IV"/"TDI IV" 会被误判成 PHEV
const HYBRID_STEPS = [
  ['PHEV', s => /plug[\s-]?in|\bphev\b|rechargeable|插电/i.test(s) || /\biV\b/.test(s) || /\bTSI\s+IV\b/i.test(s)],
  ['REEV', s => /range[\s-]?extender|\breev\b|\berev\b|增程/i.test(s)],
  ['MHEV', s => /\bm-?hev\b|\bmild\b|\b48\s?v\b|微混|轻混/i.test(s)],
  ['HEV', s => /hybrid|hybride|híbrido|\bhev\b/i.test(s)],
];
const FUEL_WORDS = [
  [/\bbev\b|electric|elektrisch|纯电/i, 'BEV'],
  [/hydrogen|fuel[\s-]?cell|燃料电池/i, 'FCV'],
  [/\blpg\b|\bcng\b|液化石油气/i, 'LPG'],
  [/diesel|柴油/i, 'Diesel'],
  [/petrol|benzine|gasoline|essence|汽油/i, 'Gasoline'],
];

function fuelClass(v) {
  if (!v) return '未标注';
  const s = String(v).trim();
  const low = s.toLowerCase();
  if (FUEL[low]) return FUEL[low];
  if (Object.values(FUEL).includes(s)) return s;
  if (ALIAS[low]) return ALIAS[low];
  // 双燃料（汽油+燃气两套燃料）不是混动，必须先于混动链判定；否则复合串里的已判对标签会被丢成「未标注」
  if (/\bdual[\s-]?fuel\b|双燃料|\bbi[\s-]?fuel\b/i.test(s)) return 'Dual Fuel';
  for (const [name, test] of HYBRID_STEPS) if (test(s)) return name;
  for (const [re, name] of FUEL_WORDS) if (re.test(s)) return name;
  return '未标注';
}

// 价格解析：数字直接可用；字符串按分隔符位置判断欧洲/美式写法，避免把 28.220 解析成 28.22
//   1.234,56 / 28.220 / 1.229.000 -> 欧式（点千分位、逗号小数）
//   1,234.56 / 102,700 / 1,229,000 -> 美式（逗号千分位、点小数）
function parsePrice(p) {
  if (typeof p === 'number') {
    if (!Number.isFinite(p)) throw new Error('price 不是有限数字: ' + p);
    return p;
  }
  const s = String(p).trim();
  const digits = s.replace(/[^\d.,-]/g, '');
  if (!digits) throw new Error('price 里没有数字: ' + p);
  const hasComma = digits.includes(','), hasDot = digits.includes('.');
  let norm;
  if (hasComma && hasDot) {
    norm = digits.lastIndexOf(',') > digits.lastIndexOf('.')
      ? digits.replace(/\./g, '').replace(',', '.')   // 欧式：最后一个是小数点
      : digits.replace(/,/g, '');                      // 美式
  } else if (hasComma) {
    // 逗号既可能是美式千分位（102,700），也可能是印度 lakh（2,11,29,000）
    const thousands = /^\d{1,3}(,\d{3})+$/.test(digits) || /^\d{1,2}(,\d{2})+,\d{3}$/.test(digits);
    norm = thousands ? digits.replace(/,/g, '') : digits.replace(',', '.');
  } else if (hasDot) {
    norm = /^\d{1,3}(\.\d{3})+$/.test(digits) ? digits.replace(/\./g, '') : digits;
  } else {
    norm = digits;
  }
  const n = Number(norm);
  if (!Number.isFinite(n)) throw new Error('price 无法解析: ' + p);
  return n;
}

function fmtPrice(p, mode) {
  // 官网有车型但无价格时，price 是文字标记（如「官网无价格」「未核实」），原样输出
  if (typeof p === 'string' && !/\d/.test(p)) return p.trim();
  const n = parsePrice(p);
  if (mode === 'euro') {
    const [ip, dp] = n.toFixed(2).split('.');
    return ip.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + dp;
  }
  if (mode === 'comma2') {
    const [ip, dp] = n.toFixed(2).split('.');
    return ip.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + dp;
  }
  if (mode === 'lakh') {
    const s = String(Math.round(n));
    if (s.length <= 3) return s;
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    return rest + ',' + last3;
  }
  return Math.round(n).toLocaleString('en-US');
}

// 旗标任意位置；--flag 后跟非 -- 开头的值即取值，否则为 true
function parseArgs(argv) {
  const opts = {}, pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('--')) { opts[a.slice(2)] = next; i++; }
      else opts[a.slice(2)] = true;
    } else pos.push(a);
  }
  return { opts, pos };
}

function localDate() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));  // 兼容带 BOM 的导出文件
}

async function main() {
  const { opts, pos } = parseArgs(process.argv.slice(2));
  const [inp, prefix] = pos;
  if (!inp || !prefix) {
    console.error('用法: node write_xlsx.js <rows.json> <输出前缀> --date YYYYMMDD [--money euro|lakh|comma] [--year-basis <year_basis.json>]');
    process.exit(1);
  }
  const arg = (k, d) => (opts[k.replace(/^--/, '')] !== undefined ? opts[k.replace(/^--/, '')] : d);
  const dateArg = arg('--date', null);
  if (dateArg === true) { console.error('[FAIL] --date 后面缺少值（应形如 --date 20261029）'); process.exit(1); }
  const date = dateArg || localDate();
  const moneyArg = arg('--money', null);
  const money = moneyArg || 'comma';
  if (!moneyArg) console.warn('[WARN] 未指定 --money，按 comma（逗号千分位）处理；欧元区请传 --money euro');

  const rows = readJson(inp);
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('官网价');
  const widths = { A: 16, B: 20, C: 62, D: 14, E: 16, F: 10, G: 12, H: 12 };

  ws.columns = [
    { width: widths.A }, { width: widths.B }, { width: widths.C }, { width: widths.D },
    { width: widths.E }, { width: widths.F }, { width: widths.G }, { width: widths.H },
  ];
  ws.addRow(['品牌', '官网车型名称', '官网型号名称', '年款', '官网MSRP', '是否停销', '数据日期', '燃油分类']).eachCell(c => {
    c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } };
    c.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  for (const r of rows) {
    ws.addRow([
      r.brand ?? '',
      r.model ?? '',
      r.version ?? '',
      r.year || '官网无年款',
      fmtPrice(r.price, money),
      r.discontinued || '否',
      date,
      fuelClass([r.fuel, r.version].filter(Boolean).join(' ')),
    ]);
  }

  const thin = { style: 'thin', color: { argb: 'FFBFBFBF' } };
  ws.eachRow((row, i) => {
    row.eachCell({ includeEmpty: true }, (cell, col) => {
      cell.border = { top: thin, left: thin, bottom: thin, right: thin };
      if (i === 1) return;
      if (col === 5) {                       // MSRP 文本格式
        cell.numFmt = '@';
        cell.alignment = { horizontal: 'right' };
      } else if ([4, 6, 7, 8].includes(col)) {
        cell.alignment = { horizontal: 'center' };
      }
    });
  });

  ws.views = [{ state: 'frozen', ySplit: 1 }];
  ws.autoFilter = { from: 'A1', to: `H${ws.rowCount}` };

  const basisPath = arg('--year-basis', null);
  if (basisPath) {
    const basis = readJson(basisPath);
    const rowCount = new Map();
    for (const r of rows) {
      const k = [r.brand ?? '', r.model ?? '', r.year || '官网无年款'].join('||');
      rowCount.set(k, (rowCount.get(k) || 0) + 1);
    }

    const ws2 = wb.addWorksheet('年款依据');
    [14, 28, 14, 10, 70, 52, 60].forEach((w, i) => { ws2.getColumn(i + 1).width = w; });
    ws2.addRow(['品牌', '官网车型名称', '年款', '覆盖型号数', '年款依据（判定过程）', '官网原文（逐字）', '来源位置']).eachCell(c => {
      c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } };
      c.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    const covered = new Set();
    const seen = new Map();
    for (const b of basis) {
      const k = [b.brand ?? '', b.model ?? '', b.year || '官网无年款'].join('||');
      seen.set(k, (seen.get(k) || 0) + 1);
      covered.add(k);
      ws2.addRow([
        b.brand ?? '', b.model ?? '', b.year || '官网无年款',
        rowCount.get(k) ?? 0, b.basis ?? '', b.quote ?? '', b.source ?? '',
      ]);
    }

    ws2.eachRow((row, i) => {
      row.eachCell({ includeEmpty: true }, (cell, col) => {
        cell.border = { top: thin, left: thin, bottom: thin, right: thin };
        if (i === 1) return;
        cell.alignment = [3, 4].includes(col)
          ? { horizontal: 'center', vertical: 'top' }
          : { vertical: 'top', wrapText: true };
      });
    });
    ws2.views = [{ state: 'frozen', ySplit: 1 }];
    ws2.autoFilter = { from: 'A1', to: `G${ws2.rowCount}` };

    const missing = [...rowCount.keys()].filter(k => !covered.has(k));
    if (missing.length) console.warn('[WARN] 年款依据未覆盖主表分组: ' + missing.join(' ; '));
    const dupes = [...seen.entries()].filter(([, n]) => n > 1).map(([k]) => k);
    if (dupes.length) console.warn('[WARN] 年款依据里同一分组出现多次（覆盖型号数会重复计）: ' + dupes.join(' ; '));
    const orphan = [...covered].filter(k => !rowCount.has(k));
    if (orphan.length) console.warn('[WARN] 年款依据里的分组在主表中不存在: ' + orphan.join(' ; '));
    const sum = [...covered].reduce((a, k) => a + (rowCount.get(k) ?? 0), 0);
    if (sum !== rows.length) console.warn(`[WARN] 覆盖型号数合计 ${sum} ≠ 主表行数 ${rows.length}`);
  } else {
    console.warn('[WARN] 未传 --year-basis，工作簿缺少「年款依据」副表（规范要求必带）');
  }

  const out = prefix.endsWith('.xlsx') ? prefix : prefix + '.xlsx';
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  await wb.xlsx.writeFile(out);
  console.log(`[OK] ${rows.length} 行 -> ${out}`);
}

if (require.main === module) {
  main().catch(e => { console.error('[FAIL]', e.message); process.exit(1); });
}
module.exports = { fuelClass, fmtPrice, parsePrice };
