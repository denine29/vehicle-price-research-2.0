#!/usr/bin/env node
/*
sites 知识库一致性检查（无需依赖）
用法: node check_sites.js

校验:
  1) 索引每个市场都有「详段」指向，且声明段数 == 市场文件实际段数
  2) 市场文件里每个 ### 段都能被该市场的索引行覆盖（防止孤儿段）
  3) 每个文件代码围栏成对（防止 markdown 渲染被吞）
  4) sites/_map.json 里的段哈希与文件当前内容一致（防止拆分后被悄悄改坏）
退出码: 0 全过 / 1 有错误
*/
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REF = path.resolve(__dirname, '..', 'references');
const SITES = path.join(REF, 'sites.md');
const DIR = path.join(REF, 'sites');
const FENCE = String.fromCharCode(96).repeat(3);
const isRow = l => l.startsWith('|') && !l.startsWith('|---') && !l.startsWith('| 品牌');

const norm = s => s.replace(/（[^）]*）/g, '').replace(/[（）()]/g, '').replace(/[\s🇬🇧]/g, '').toLowerCase();
const splitBrands = s => s.split('/').map(x => norm(x)).filter(Boolean);
const ALIAS = { dsde: 'dsautomobiles', kgmobility: 'kgm', 'kgm/kgmobility': 'kgm' };
const hashed = b => {
  const a = b.slice();
  while (a.length && a[a.length - 1].trim() === '') a.pop();
  if (a.length && a[a.length - 1].trim() === '---') { a.pop(); while (a.length && a[a.length - 1].trim() === '') a.pop(); }
  return crypto.createHash('sha256').update(a.map(x => x.replace(/\r$/, '')).join('\n')).digest('hex');
};

const L = fs.readFileSync(SITES, 'utf8').split(/\r?\n/);
const h2 = [], h3 = [];
L.forEach((l, i) => { if (/^## /.test(l)) h2.push(i + 1); if (/^### /.test(l)) h3.push(i + 1); });
const start = h2.find(n => /站点速查/.test(L[n - 1]));
const stop = h2.find(n => n > start && /数据源定位/.test(L[n - 1])) || h3[13];
const blocks = h3.filter(n => n > start && n < stop).map(s => {
  const e = (h3.find(n => n > s) || stop) - 1;
  return { s, e, title: L[s - 1].replace(/^### /, '') };
});
const marketFiles = fs.readdirSync(DIR).filter(f => f.endsWith('.md') && !f.startsWith('_')).length;
if (blocks.length !== marketFiles) console.log('[WARN] 索引市场块数=' + blocks.length + ' ≠ 市场文件数 ' + marketFiles);

const errors = [], warns = [];
const mapPath = path.join(DIR, '_map.json');
const map = fs.existsSync(mapPath) ? JSON.parse(fs.readFileSync(mapPath, 'utf8')) : { markets: {} };
let totalSections = 0, coveredSections = 0, noMeasured = 0, noSource = 0;

for (const b of blocks) {
  const title = b.title;
  const m = /([A-Z]{2})$/.exec(title.replace(/\s+/g, ' ').trim());
  const key = m ? m[1].toLowerCase() : 'global';
  const rows = [];
  let pointer = null;
  for (let n = b.s; n <= b.e; n++) {
    const l = L[n - 1];
    if (isRow(l)) rows.push(l.split('|')[1].trim());
    const pm = /详段：sites\/([a-z]+)\.md（(\d+) 段）/.exec(l);
    if (pm) pointer = { file: pm[1], count: +pm[2] };
  }
  if (!pointer) {
    if (fs.existsSync(path.join(DIR, key + '.md'))) errors.push(`[${key}] 索引缺「详段：sites/${key}.md（N 段）」`);
    else warns.push(`[${key}] 仅有索引、暂无详段文件（新市场首次采集前可接受）`);
    continue;
  }
  if (pointer.file !== key) warns.push(`[${key}] 详段指向 ${pointer.file}.md，与市场码不一致`);

  const fp = path.join(DIR, pointer.file + '.md');
  if (!fs.existsSync(fp)) { errors.push(`[${key}] 详段文件不存在: sites/${pointer.file}.md`); continue; }
  const FL = fs.readFileSync(fp, 'utf8').split(/\r?\n/);
  const hs = [];
  FL.forEach((l, i) => { if (/^### /.test(l)) hs.push(i + 1); });
  if (hs.length !== pointer.count) errors.push(`[${key}] 段数不符: 索引 ${pointer.count} ≠ 文件 ${hs.length}`);
  let f = 0; FL.forEach(l => { if (l.startsWith(FENCE)) f++; });
  if (f % 2) errors.push(`[${key}] 代码围栏不成对（${f} 个）`);

  const indexBrands = new Set();
  rows.forEach(r => splitBrands(r).forEach(x => indexBrands.add(x)));
  hs.forEach((s, i) => {
    totalSections++;
    const eEnd = i + 1 < hs.length ? hs[i + 1] - 1 : FL.length;
    const body = FL.slice(s - 1, eEnd).join(String.fromCharCode(10));
    if (!/实测/.test(body) && !/20..-..-../.test(body)) noMeasured++;
    if (!/来源|https?:/.test(body)) noSource++;
    const t = FL[s - 1].replace(/^### /, '');
    if (/其它市场速记/.test(t)) { coveredSections++; return; }
    const parts = splitBrands(t.split('（')[0]).map(x => ALIAS[x] || x);
    const hit = parts.some(p => [...indexBrands].some(ib => ib.includes(p) || p.includes(ib)));
    if (hit) coveredSections++;
    else errors.push(`[${key}] 孤儿段（索引里没有对应品牌）: ${t.slice(0, 48)}`);
  });

  const mk = map.markets[pointer.file];
  if (mk) {
    hs.forEach((s, i) => {
      const e = i + 1 < hs.length ? hs[i + 1] - 1 : FL.length;
      const h = hashed(FL.slice(s - 1, e));
      if (mk.sections[i] && h !== mk.sections[i].sha256) errors.push(`[${key}] 段 #${i + 1} 内容与 _map.json 不符（被改动过？）`);
    });
  }
  console.log((errors.length ? '… ' : '[OK] ') + key.padEnd(7) + ' 索引行 ' + String(rows.length).padStart(2) + ' · 段 ' + hs.length + ' · ' + FL.length + ' 行');
}

const noDetail = [];
for (const b of blocks) {
  const key = (/([A-Z]{2})$/.exec(b.title.replace(/\s+/g, ' ').trim()) || [, 'global'])[1].toLowerCase();
  let n = 0;
  for (let i = b.s; i <= b.e; i++) if (isRow(L[i - 1])) n++;
  if (n) noDetail.push(key + ':' + n);
}
console.log('\n索引品牌行: ' + noDetail.join(' '));
if (noMeasured) console.log('[WARN] ' + noMeasured + ' 段缺「实测/日期」字段（新段必须补，旧段慢慢补）');
if (noSource) console.log('[WARN] ' + noSource + ' 段缺「来源」字段');
console.log('段覆盖: ' + coveredSections + '/' + totalSections);
warns.forEach(w => console.log('[WARN] ' + w));
if (errors.length) { console.log('\n[FAIL] ' + errors.length + ' 项:'); errors.forEach(e => console.log('  - ' + e)); process.exit(1); }
console.log('[PASS] 索引 / 段数 / 围栏 / 哈希 全部一致');
