#!/usr/bin/env node
/* EXPERIMENTAL：年款证据管线自测；不访问网络，不使用 exceljs。 */
const { extractCandidates, stripHtml } = require('./collect_year_evidence');
const { buildYearBasis } = require('./build_year_basis');

let passed = 0;
function ok(name, cond) {
  if (!cond) throw new Error(name);
  passed++;
  console.log('[PASS] ' + name);
}
function throws(name, fn) {
  let failed = false;
  try { fn(); } catch (_) { failed = true; }
  ok(name, failed);
}
function ev(brand, model, year, score = 95, url = 'https://example.test/model') {
  return {
    brand, model,
    source: { type: 'page', url, locator: 'fixture' },
    candidates: [{ year, score, reason: score >= 85 ? 'vehicle_year' : 'year_near_price', raw: `${brand} ${model} ${year}`, context: `${brand} ${model} ${year}` }],
    rejected: [],
  };
}

const tenet = extractCandidates('TENET T7 2026 г.в. комплектации Актив Передний привод … 2 680 000 руб.', 'TENET', 'T7');
ok('Tenet 2026 г.в. → 2026', tenet.summary.accepted.includes('2026'));

const avatr = extractCandidates('Рекомендованная розничная цена на автомобили 2026 года производства, руб. с НДС 6 990 000 ₽', 'AVATR', '11');
ok('Avatr 2026 года производства → 2026', avatr.summary.accepted.includes('2026'));

const yangwang = extractCandidates('Yangwang U8 Год выпуска 2023 Пробег 1 км', 'Yangwang', 'U8');
ok('Yangwang Год выпуска 2023 → 2023', yangwang.summary.accepted.includes('2023'));

const jac = extractCandidates('Prisliste 1/2026 Gjeldende fra Januar 2026', 'JAC', 'Kangoo');
ok('JAC 生效日不当年款', jac.summary.accepted.length === 0 && jac.rejected.some(x => x.reason === 'effective_date'));

const copy = extractCandidates('© 2026 JAC. All rights reserved.', 'JAC', 'Kangoo');
ok('版权年不当年款', copy.summary.accepted.length === 0 && copy.rejected.some(x => x.reason === 'copyright'));

const cols = extractCandidates('Комплектация Престиж 2025 2026 3 399 000 3 399 000', 'Soueast', 'S07');
ok('价格表 2025/2026 两列 → 两年份', cols.summary.accepted.includes('2025') && cols.summary.accepted.includes('2026'));

const img = extractCandidates(stripHtml('<img src="MY26_600_900_series_hero.webp">'), 'Lotus', 'Eletre');
ok('图片文件名 MY26 不进入可见文本证据', img.candidates.length === 0);

const rows = [{ brand: 'TENET', model: 'T7', year: '2026' }];
const basis = buildYearBasis(rows, [ev('TENET', 'T7', '2026')], []);
ok('builder 用高置信证据生成依据', basis.length === 1 && basis[0].year === '2026' && basis[0].quote.includes('2026'));

throws('builder 拒绝无证据年款', () => buildYearBasis(rows, [], []));
throws('builder 拒绝缺覆盖的官网无年款', () => buildYearBasis([{ brand: 'JAC', model: 'Kangoo', year: '官网无年款' }], [], []));
const noYear = buildYearBasis(
  [{ brand: 'JAC', model: 'Kangoo', year: '官网无年款' }],
  [],
  [{ brand: 'JAC', model: 'Kangoo', checked: ['page', 'configurator', 'pdf_none'], urls: ['https://example.test/kangoo'], note: '三处均无车辆年份' }]
);
ok('builder 接受完整覆盖的官网无年款', noYear.length === 1 && noYear[0].year === '官网无年款');

const ratios = extractCandidates('Ratio 01/03 40/20 60/40', 'Test', 'Model');
ok('比例/日期分式不当年款', ratios.summary.accepted.length === 0);
const news = extractCandidates('Latest news Škoda Fabia 2025 Read more', 'Škoda', 'Fabia');
ok('新闻日期不绑定车型年款', news.summary.accepted.length === 0);
const footer = extractCandidates('Subaru Crosstrek Privacy Notice Cookies Policy 2026', 'Subaru', 'Crosstrek');
ok('页脚法律年份不绑定车型年款', footer.summary.accepted.length === 0);
const legal = extractCandidates('TENET T7 лицензия банка от 11.08.2015 № 1481 ОГРН 1027700132195', 'TENET', 'T7');
ok('许可证/注册号日期不绑定车型年款', legal.summary.accepted.length === 0);
const founding = extractCandidates('О бренде AVATR, основанный в 2018 году', 'AVATR', '11');
ok('品牌成立年不绑定车型年款', founding.summary.accepted.length === 0);
const finance = extractCandidates('AVATR 11 2025-2026 года производства в кредит', 'AVATR', '11');
ok('金融方案只保留明确车辆年份候选', finance.summary.accepted.includes('2026') && !finance.summary.accepted.includes('2025'));
const prize = extractCandidates('Subaru Crosstrek prize draw Winners 21st July 2025', 'Subaru', 'Crosstrek');
ok('抽奖日期不绑定车型年款', prize.summary.accepted.length === 0);

console.log(`[OK] ${passed} 项自测全部通过`);
