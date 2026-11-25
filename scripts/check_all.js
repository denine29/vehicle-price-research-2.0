#!/usr/bin/env node
/*
一条命令跑完交付前的两道稳定机械闸：
  node check_all.js
  1) selftest.js   —— 生成器 9 组夹具
  2) check_sites.js —— 索引/段数/围栏/哈希 + 证据欠账计数
  实验性 selftest_year_evidence.js 不属于当前稳定门槛。
退出码: 0 全过 / 1 有失败
*/
const { spawnSync } = require('child_process');
const path = require('path');

const here = __dirname;
let failed = 0;
for (const f of ['selftest.js', 'check_sites.js']) {
  console.log('\n===== ' + f + ' =====');
  const r = spawnSync(process.execPath, [path.join(here, f)], { stdio: 'inherit' });
  if (r.status !== 0) failed++;
}
console.log(failed ? '\n[FAIL] ' + failed + ' 项未通过' : '\n[PASS] 两道闸全过（成品仍需 verify_xlsx 回读）');
process.exit(failed ? 1 : 0);
