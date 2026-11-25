#!/usr/bin/env node
/*
 * EXPERIMENTAL：从 rows.json + 年款候选证据生成 year_basis.json。
 * 当前不参与稳定交付硬门槛；修复并完成真实样本回归前不得作为唯一依据。
 * 缺证据、缺来源覆盖、低置信候选未复核时会 FAIL，避免“无年款”凭记忆写。
 * 用法:
 *   node build_year_basis.js <rows.json> <evidence1.json> [evidence2.json ...]
 *     --out <year_basis.json> [--coverage <coverage.json>]
 */
const fs = require('fs');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
}

function key(brand, model) {
  return `${brand ?? ''}||${model ?? ''}`;
}

function normalizeCoverage(input) {
  const map = new Map();
  const arr = Array.isArray(input) ? input : Object.entries(input || {}).map(([k, v]) => ({ brand: k.split('||')[0], model: k.split('||')[1], ...v }));
  for (const c of arr) map.set(key(c.brand, c.model), c);
  return map;
}

function hasFullCoverage(c) {
  const checked = new Set((c?.checked || []).map(x => String(x).toLowerCase()));
  return checked.has('page') && checked.has('configurator') && (checked.has('pdf') || checked.has('pdf_none'));
}

function buildYearBasis(rows, evidenceList, coverageInput = []) {
  if (!Array.isArray(rows)) throw new Error('rows.json 必须是数组');
  const evidence = new Map();
  for (const e of evidenceList) {
    const k = key(e.brand, e.model);
    if (!evidence.has(k)) evidence.set(k, []);
    evidence.get(k).push(e);
  }
  const coverage = normalizeCoverage(coverageInput);
  const groups = new Map();
  for (const r of rows) {
    const k = `${key(r.brand, r.model)}||${r.year || '官网无年款'}`;
    if (!groups.has(k)) groups.set(k, { brand: r.brand ?? '', model: r.model ?? '', year: r.year || '官网无年款', count: 0 });
    groups.get(k).count++;
  }

  const out = [];
  for (const g of groups.values()) {
    const evs = evidence.get(key(g.brand, g.model)) || [];
    const allCandidates = evs.flatMap(e => (e.candidates || []).map(c => ({ ...c, source: e.source || {} })));
    if (g.year === '官网无年款') {
      const cov = coverage.get(key(g.brand, g.model));
      if (!hasFullCoverage(cov)) throw new Error(`${g.brand} ${g.model} 写「官网无年款」但缺来源覆盖（需 page + configurator + pdf/pdf_none）`);
      const strong = allCandidates.filter(c => c.score >= 85);
      const review = allCandidates.filter(c => c.score >= 70 && c.score < 85);
      if (strong.length) throw new Error(`${g.brand} ${g.model} 写「官网无年款」但存在高置信年份: ${[...new Set(strong.map(c => c.year))].join('/')}`);
      if (review.length && !cov.reviewed_low_confidence) throw new Error(`${g.brand} ${g.model} 有低置信年份候选，需人工复核并在 coverage 标 reviewed_low_confidence:true`);
      const urls = cov.urls || evs.map(e => e.source?.url).filter(Boolean);
      out.push({
        brand: g.brand,
        model: g.model,
        year: g.year,
        basis: `已查 ${(cov.checked || []).join(' / ')}，无车辆绑定年份；排除版权年、价格生效日、活动/奖项年`,
        quote: cov.note || '查过车型页、配置器与官方 PDF（或确认无 PDF），未发现车辆年份字段',
        source: urls.join('；') || '见 coverage 来源清单',
      });
      continue;
    }

    const matched = allCandidates.filter(c => c.year === g.year);
    const strong = matched.filter(c => c.score >= 85);
    const twoMedium = new Set(matched.filter(c => c.score >= 70).map(c => c.source?.url || c.source?.locator || 'unknown')).size >= 2;
    if (!strong.length && !twoMedium) throw new Error(`${g.brand} ${g.model} 年款 ${g.year} 缺高置信证据（或两个独立中置信来源）`);
    matched.sort((a, z) => z.score - a.score);
    const top = matched.slice(0, 2);
    const reasons = [...new Set(top.map(c => c.reason))].join(', ');
    const sourceTypes = [...new Set(top.map(c => c.source?.type || 'unknown'))].join(', ');
    out.push({
      brand: g.brand,
      model: g.model,
      year: g.year,
      basis: `年份由 ${sourceTypes} 证据绑定到车型/版本/价格（${reasons}）`,
      quote: top.map(c => c.raw).filter(Boolean).join('；'),
      source: top.map(c => `${c.source?.url || '未知 URL'}（${c.source?.locator || c.reason}）`).join('；'),
    });
  }
  return out;
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

function main() {
  const { opts, pos } = parseArgs(process.argv.slice(2));
  const [rowsPath, ...evidencePaths] = pos;
  if (!rowsPath || !evidencePaths.length) {
    console.error('用法: node build_year_basis.js <rows.json> <evidence1.json> [evidence2.json ...] --out <year_basis.json> [--coverage <coverage.json>]');
    process.exit(1);
  }
  try {
    const rows = readJson(rowsPath);
    const evidence = evidencePaths.map(readJson);
    const coverage = opts.coverage ? readJson(opts.coverage) : [];
    const basis = buildYearBasis(rows, evidence, coverage);
    const out = opts.out || 'year_basis.json';
    fs.writeFileSync(out, JSON.stringify(basis, null, 2) + '\n', 'utf8');
    console.log(`[OK] ${basis.length} 组年款依据 -> ${out}`);
  } catch (e) {
    console.error('[FAIL] ' + e.message);
    process.exit(1);
  }
}

if (require.main === module) main();
module.exports = { buildYearBasis, hasFullCoverage };
