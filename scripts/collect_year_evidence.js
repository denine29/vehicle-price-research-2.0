#!/usr/bin/env node
/*
 * EXPERIMENTAL：年款候选证据采集器；当前不参与稳定交付硬门槛。
 * 只抽“年份 + 上下文 + 来源”，不替人做最终判定。
 * 用法:
 *   node collect_year_evidence.js <html|json|txt|pdf> --brand <brand> --model <model>
 *     [--type html|json|text|pdf] [--url <url>] [--locator <locator>] [--out <json>]
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REJECT = [
  [/©|copyright|all rights reserved|все права защищены/i, 'copyright'],
  [/gjeldende fra|prisliste fra|price valid from|prices?\s+(?:are\s+)?valid\s+from|as at|date as at/i, 'effective_date'],
  [/действует с|цена\s+(?:от|действительна)|скидк[аи]\s+до|акция\s+(?:до|действует)/i, 'offer_date'],
  [/award|награда|победител|car of the year|auto express/i, 'award_year'],
  [/2025 KGM range|WLTP\s+(?:data|range)/i, 'data_year'],
  [/лицензи|license|патент|trademark|свидетельств|регистрационн\w*\s+номер|\bИНН\b|\bОГРН\b/i, 'legal_date'],
  [/privacy|cookies|terms|modern slavery|franchising|legal notice/i, 'legal_footer'],
  [/latest news|read more|press release|newsroom|\bwrc\b|anniversary|years with/i, 'news_date'],
  [/основанн|founded|brand history|о бренде/i, 'brand_history'],
  [/кредит|credit|финанс|банк|предложение распространяется|программ/i, 'finance_offer'],
  [/prize draw|winner|tickets|competition|\bdraw\b/i, 'promotion_date'],
];

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

function stripHtml(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<template[\s\S]*?<\/template>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' ')
  ).replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\s+/g, ' ').trim();
}

function normalize(s) {
  return String(s || '').replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\s+/g, ' ').trim();
}

function around(text, index, len, before = 150, after = 170) {
  return normalize(text.slice(Math.max(0, index - before), Math.min(text.length, index + len + after)));
}

function rejectReason(text, index, len) {
  const local = text.slice(Math.max(0, index - 110), Math.min(text.length, index + len + 110));
  for (const [re, reason] of REJECT) if (re.test(local)) return reason;
  return null;
}

function expandYear(y) {
  if (/^\d{2}$/.test(y)) return String(2000 + +y);
  return y;
}

function extractCandidates(input, brand, model) {
  const text = normalize(input);
  const candidates = [];
  const rejected = [];
  const seen = new Set();
  const explicitRanges = [];
  const b = normalize(brand).toLowerCase();
  const m = normalize(model).toLowerCase();

  const add = (year, score, reason, raw, index, len, extra = {}) => {
    year = expandYear(year);
    const key = `${year}|${score}|${reason}|${normalize(raw)}`;
    if (seen.has(key)) return;
    seen.add(key);
    const item = { year, score, reason, raw: normalize(raw), context: around(text, index, len), ...extra };
    candidates.push(item);
  };
  const reject = (year, reason, raw, index, len) => {
    const key = `${year}|${reason}|${normalize(raw)}`;
    if (seen.has(key)) return;
    seen.add(key);
    rejected.push({ year: expandYear(year), reason, raw: normalize(raw), context: around(text, index, len) });
  };
  const markExplicit = (index, len) => explicitRanges.push([index, index + len]);

  // 1) 明确年款字段
  const patterns = [
    [/\bMY\s*(20\d{2})\b/gi, 100, 'explicit_my'],
    [/\bMY\s*(\d{2})\b/g, 100, 'explicit_my'],
    [/model\s+year\s*[:=]?\s*(20\d{2})/gi, 100, 'model_year'],
    [/модельн\w*\s+год\w*\s*[:=]?\s*(20\d{2})/gi, 100, 'model_year_ru'],
    [/год\s+выпуска\s*[:=]?\s*(20\d{2})/gi, 95, 'vehicle_year_ru'],
    [/(20\d{2})\s*г\.\s*в\.?/gi, 95, 'vehicle_year_ru'],
    [/(20\d{2})\s+года\s+(?:производства|выпуска)/gi, 95, 'vehicle_year_ru'],
    [/(20\d{2})\s+год\s+производства/gi, 95, 'vehicle_year_ru'],
    [/(?:marketing-model-year|modelYear|model_year)\s*["']?\s*[:=]\s*["']?(20\d{2}\.\d{2})/gi, 100, 'decimal_model_year'],
  ];
  for (const [re, score, reason] of patterns) {
    re.lastIndex = 0;
    let match;
    while ((match = re.exec(text))) {
      markExplicit(match.index, match[0].length);
      const rr = rejectReason(text, match.index, match[0].length);
      if (rr && score < 95) reject(match[1], rr, match[0], match.index, match[0].length);
      else add(match[1], score, reason, match[0], match.index, match[0].length);
    }
  }

  // 2) 双年份：年款列取第二个，原文整体保留
  const dual = /\b(?:20(\d{2})|(2[0-9]|3[0-9]))\s*\/\s*(?:20(\d{2})|(2[0-9]|3[0-9]))\b/g;
  let dm;
  while ((dm = dual.exec(text))) {
    const y1 = dm[1] ? `20${dm[1]}` : expandYear(dm[2]);
    const y2 = dm[3] ? `20${dm[3]}` : expandYear(dm[4]);
    markExplicit(dm.index, dm[0].length);
    const rr = rejectReason(text, dm.index, dm[0].length);
    if (rr) reject(y2, rr, dm[0], dm.index, dm[0].length);
    else add(y2, 98, 'dual_year_second', dm[0], dm.index, dm[0].length, { years: [y1, y2] });
  }

  // 3) 价格表/规格表里的年份列（同一行至少两个不同年份）
  const lines = text.split(/(?<=[。！？；])\s+|\n+/);
  for (const line of lines) {
    if (!line || line.length > 400) continue;
    const ys = [...new Set((line.match(/\b20\d{2}\b/g) || []))];
    if (ys.length < 2) continue;
    const idx = text.indexOf(line);
    const rr = rejectReason(text, idx, line.length);
    for (const y of ys) {
      if (rr) reject(y, rr, line, idx, line.length);
      else add(y, 90, 'year_columns', line, idx, line.length, { years: ys });
    }
  }

  // 4) 年份与品牌/车型/价格同句：按语义绑定打分
  const years = /\b20\d{2}\b/g;
  let ym;
  while ((ym = years.exec(text))) {
    if (explicitRanges.some(([a, z]) => ym.index >= a && ym.index < z)) continue;
    const ctx = around(text, ym.index, 4, 150, 170);
    const rr = rejectReason(text, ym.index, 4);
    if (rr) { reject(ym[0], rr, ctx, ym.index, 4); continue; }
    const low = ctx.toLowerCase();
    const hasModel = (b && low.includes(b)) || (m && low.includes(m));
    const hasPrice = /price|цена|£|\$|€|₽|руб|trim|комплектац|from\s|fra\s/i.test(ctx);
    if (hasModel) add(ym[0], 85, 'year_bound_to_model', ctx, ym.index, 4);
    else if (hasPrice) add(ym[0], 75, 'year_near_price', ctx, ym.index, 4);
    else reject(ym[0], 'unbound_year', ctx, ym.index, 4);
  }

  candidates.sort((a, z) => z.score - a.score || a.year.localeCompare(z.year));
  const accepted = [...new Set(candidates.filter(c => c.score >= 85).map(c => c.year))];
  const review = [...new Set(candidates.filter(c => c.score >= 70 && c.score < 85).map(c => c.year))];
  return {
    brand,
    model,
    candidates: candidates.slice(0, 12),
    rejected: rejected.slice(0, 12),
    summary: { accepted, review },
  };
}

function parseArgs(argv) {
  const opts = {}, pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const v = argv[i + 1];
      if (v !== undefined && !v.startsWith('--')) { opts[a.slice(2)] = v; i++; }
      else opts[a.slice(2)] = true;
    } else pos.push(a);
  }
  return { opts, pos };
}

function readInput(file, type) {
  const ext = path.extname(file).toLowerCase();
  const kind = type || (ext === '.pdf' ? 'pdf' : ext === '.html' || ext === '.htm' ? 'html' : ext === '.json' ? 'json' : 'text');
  if (kind === 'pdf') {
    const txt = execFileSync('pdftotext', ['-layout', file, '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    return { text: txt, kind };
  }
  const raw = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  return { text: kind === 'html' ? stripHtml(raw) : raw, kind };
}

function main() {
  const { opts, pos } = parseArgs(process.argv.slice(2));
  const [file] = pos;
  if (!file || !opts.brand || !opts.model) {
    console.error('用法: node collect_year_evidence.js <html|json|txt|pdf> --brand <brand> --model <model> [--type html|json|text|pdf] [--url <url>] [--locator <locator>] [--out <json>]');
    process.exit(1);
  }
  try {
    const { text, kind } = readInput(file, opts.type);
    const result = extractCandidates(text, opts.brand, opts.model);
    result.source = { type: kind, url: opts.url || file, locator: opts.locator || (kind === 'pdf' ? 'PDF 全文' : '页面可见文本') };
    const out = JSON.stringify(result, null, 2);
    if (opts.out) { fs.writeFileSync(opts.out, out + '\n', 'utf8'); console.log(`[OK] ${result.candidates.length} 个候选 / ${result.rejected.length} 个排除 -> ${opts.out}`); }
    else console.log(out);
  } catch (e) {
    console.error('[FAIL] ' + e.message);
    process.exit(1);
  }
}

if (require.main === module) main();
module.exports = { extractCandidates, stripHtml, normalize };
