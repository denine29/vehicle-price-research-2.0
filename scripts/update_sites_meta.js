#!/usr/bin/env node
/*
重建 sites 知识库的「元信息」：市场文件头 / 索引里的「详段」行 / _map.json
用法:
  node update_sites_meta.js                 # 只同步段数与品牌清单、重建哈希
  node update_sites_meta.js --date 2026-10-30   # 同时把「最后实测」改成该日期
  node update_sites_meta.js --dry           # 只报告将要改什么，不落盘

只改三类元信息，**不动任何段落正文**：
  1. sites/<market>.md 头部：`> 市场码 XX · N 段 · 品牌：…`
  2. sites.md 里：`> 详段：sites/<market>.md（N 段）`
  3. sites/_map.json：段标题 / 行号 / sha256
改完请跑 node check_sites.js 复核。
*/
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REF = path.resolve(__dirname, '..', 'references');
const DIR = path.join(REF, 'sites');
const SITES = path.join(REF, 'sites.md');
const MAP = path.join(DIR, '_map.json');

const argv = process.argv.slice(2);
const dry = argv.includes('--dry');
const di = argv.indexOf('--date');
const newDate = di > -1 ? argv[di + 1] : null;

const normBody = b => {
  const a = b.slice();
  while (a.length && a[a.length - 1].trim() === '') a.pop();
  if (a.length && a[a.length - 1].trim() === '---') { a.pop(); while (a.length && a[a.length - 1].trim() === '') a.pop(); }
  return a;
};
const sha = a => crypto.createHash('sha256').update(a.map(x => x.replace(/\r$/, '')).join('\n')).digest('hex');
const cleanBrand = t => {
  let b = t.split('（')[0].replace(/🇬🇧/g, '').trim();
  b = b.replace(/\s*·.*$/, '');
  b = b.replace(/\s+[—–-]{1,2}\s.*$/, '');
  b = b.replace(/\s+(BE|DE|UK|IN|TH|FR|ES|GR|CL|KR|AU|JP|AR|NZ|PH|India|Bharat|EU\/DE)$/, '');
  return b.replace(/\s+/g, ' ').trim();
};
const clean = s => s.replace(/\s+$/, '');

const siteLines = fs.readFileSync(SITES, 'utf8').split(/\r?\n/);
const sitesNl = fs.readFileSync(SITES, 'utf8').includes('\r\n') ? '\r\n' : '\n';
const map = fs.existsSync(MAP) ? JSON.parse(fs.readFileSync(MAP, 'utf8')) : { markets: {} };
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.md') && !f.startsWith('_'));
const changes = [];
let meta = { generated: new Date().toISOString().slice(0, 10), source: 'references/sites.md', markets: {} };

for (const f of files.sort()) {
  const key = f.replace(/\.md$/, '');
  const fp = path.join(DIR, f);
  const raw = fs.readFileSync(fp, 'utf8');
  const nl = raw.includes('\r\n') ? '\r\n' : '\n';
  const L = raw.split(/\r?\n/);
  if (L[L.length - 1] === '') L.pop();

  const hs = [];
  L.forEach((l, i) => { if (/^### /.test(l)) hs.push(i + 1); });
  const secs = hs.map((s, i) => {
    const e = i + 1 < hs.length ? hs[i + 1] - 1 : L.length;
    const body = normBody(L.slice(s - 1, e));
    return { title: L[s - 1].replace(/^### /, ''), srcLine: s, sha256: sha(body) };
  });
  const brands = [...new Set(secs.map(x => cleanBrand(x.title)).filter(b => b && b !== '其它市场速记'))];
  meta.markets[key] = { file: 'sites/' + f, count: secs.length, brands, sections: secs };

  // 1) 文件头
  const hi = L.findIndex(l => l.startsWith('> 市场码 '));
  if (hi < 0) { console.log('[WARN] ' + f + ' 缺「> 市场码」头部行，跳过头部改写'); }
  else {
    const want = '> 市场码 ' + key.toUpperCase() + ' · ' + secs.length + ' 段 · 品牌：' + brands.join(' / ');
    if (L[hi] !== want) { changes.push(f + ' 头部: ' + secs.length + ' 段'); L[hi] = want; }
  }
  if (newDate) {
    const di2 = L.findIndex(l => l.startsWith('> 最后实测：'));
    if (di2 > -1) {
      const want2 = L[di2].replace(/^> 最后实测：[^·]*/, '> 最后实测：' + newDate + ' ');
      if (L[di2] !== want2) { changes.push(f + ' 实测日期 → ' + newDate); L[di2] = clean(want2); }
    }
  }
  const out = L.join(nl) + nl;
  if (out !== raw && !dry) fs.writeFileSync(fp, out, 'utf8');
}

// 2) sites.md 的「详段」行
let sl = siteLines.slice();
for (let i = 0; i < sl.length; i++) {
  const m = /^> 详段：sites\/([a-z]+)\.md（(\d+) 段）/.exec(sl[i]);
  if (!m) continue;
  const key = m[1];
  const cnt = meta.markets[key] ? meta.markets[key].count : null;
  if (cnt === null) { console.log('[WARN] 索引指向不存在的文件: sites/' + key + '.md'); continue; }
  if (+m[2] !== cnt) { changes.push('sites.md 「' + key + '」详段: ' + m[2] + ' → ' + cnt + ' 段'); sl[i] = '> 详段：sites/' + key + '.md（' + cnt + ' 段）'; }
}
if (!dry && sl.join(sitesNl) !== siteLines.join(sitesNl)) fs.writeFileSync(SITES, sl.join(sitesNl), 'utf8');

// 3) _map.json
const mapOut = JSON.stringify(meta, null, 1);
const oldMap = fs.existsSync(MAP) ? fs.readFileSync(MAP, 'utf8') : '';
if (!dry && mapOut !== oldMap) { fs.writeFileSync(MAP, mapOut, 'utf8'); changes.push('_map.json 重建（' + files.length + ' 个市场，' + Object.values(meta.markets).reduce((a, x) => a + x.count, 0) + ' 段）'); }

// 4) SKILL.md / README.md 的「知识库版本」行——计数是派生数据，不手工维护
const marketsN = files.length;
const sectionsN = Object.values(meta.markets).reduce((a, x) => a + x.count, 0);
const d = new Date();
const today = newDate || `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
for (const doc of ['SKILL.md', 'README.md']) {
  const dp = path.resolve(__dirname, '..', doc);
  if (!fs.existsSync(dp)) continue;
  const raw = fs.readFileSync(dp, 'utf8');
  const want = `知识库版本：${today} · ${marketsN} 市场 / ${sectionsN} 段`;
  if (!/知识库版本：\d{4}-\d{2}-\d{2} · \d+ 市场 \/ \d+ 段/.test(raw)) { console.log('[WARN] ' + doc + ' 找不到「知识库版本」行，未同步计数'); continue; }
  const next = raw.replace(/知识库版本：\d{4}-\d{2}-\d{2} · \d+ 市场 \/ \d+ 段/, want);
  if (next !== raw) {
    if (!dry) fs.writeFileSync(dp, next, 'utf8');
    changes.push(doc + ' 版本行 → ' + today + ' · ' + marketsN + ' 市场 / ' + sectionsN + ' 段');
  }
}

if (changes.length) { console.log((dry ? '[DRY] 将改动 ' : '已更新 ') + changes.length + ' 处：'); changes.forEach(c => console.log('  - ' + c)); }
else console.log('已是最新，无需改动');
console.log('提示：若 check_sites.js 报「孤儿段」，说明索引表缺对应品牌行——请在 sites.md 该市场表手工加一行（结论 + 一句话方法）后重跑。');
