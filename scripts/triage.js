#!/usr/bin/env node
/*
站点可达性分诊（Node 版，无需 Python / Playwright）
用法:
  node triage.js <url|域名> [更多...]

输出每个域的 DNS / HTTP / robots / TCP / TLS，并给结论：
  403（含 robots.txt）  -> 整站 IP 级封锁，止损
  HTTP 403 但 robots 正常 -> 应用层 WAF，试真浏览器或换路径
  TCP 通 + TLS read 0 bytes -> SNI 级封锁
  curl 000 + exit 35     -> Schannel 吊销检查失败（Windows），加 --ssl-no-revoke（本脚本已默认）
  200/301/302            -> 可直连，继续找价格源
*/
const { spawnSync } = require('child_process');
const dns = require('dns');
const net = require('net');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const IS_WIN = process.platform === 'win32';

function curl(url, timeout = 20) {
  const out = IS_WIN ? 'NUL' : '/dev/null';
  const args = ['-s', '-o', out, '-w', '%{http_code}', '-A', UA, '--max-time', String(timeout)];
  if (IS_WIN) args.push('--ssl-no-revoke');
  args.push(url);
  const r = spawnSync('curl', args, { encoding: 'utf8' });
  return { code: (r.stdout || '').trim() || '000', exit: r.status, err: (r.stderr || '').trim() };
}

function tls(host, timeout = 15000) {
  const r = spawnSync('openssl', ['s_client', '-connect', host + ':443', '-servername', host],
    { input: '', encoding: 'utf8', timeout });
  const s = (r.stdout || '') + (r.stderr || '');
  return {
    connected: /CONNECTED/.test(s),
    reset: /read 0 bytes|unexpected eof|no peer certificate/i.test(s),
  };
}

function tcp(ip, port = 443, timeout = 8000) {
  return new Promise(resolve => {
    const s = net.connect({ host: ip, port });
    const done = ok => { s.destroy(); resolve(ok); };
    s.setTimeout(timeout);
    s.once('connect', () => done(true));
    s.once('timeout', () => done(false));
    s.once('error', () => done(false));
  });
}

async function lookup(host) {
  try {
    const a = await dns.promises.lookup(host, { all: true });
    return { v4: a.filter(x => x.family === 4).map(x => x.address), v6: a.filter(x => x.family === 6).map(x => x.address) };
  } catch (e) { return { v4: [], v6: [] }; }
}

async function main() {
  const urls = process.argv.slice(2);
  if (!urls.length) { console.error('用法: node triage.js <url|域名> [...]'); process.exit(1); }
  for (let u of urls) {
    if (!/^https?:\/\//.test(u)) u = 'https://' + u;
    const host = new URL(u).hostname;
    console.log('='.repeat(72));
    console.log('URL  : ' + u);
    const ip = await lookup(host);
    console.log('DNS  : v4=' + (ip.v4.join(',') || '-') + '  v6=' + (ip.v6.join(',') || '-'));
    if (!ip.v4.length && !ip.v6.length) { console.log('=> 结论: 域名不解析（NXDOMAIN），确认拼写或换域名'); continue; }

    const http = curl(u);
    const robots = curl(`https://${host}/robots.txt`);
    console.log(`HTTP : ${http.code}${http.exit ? ' (curl exit ' + http.exit + ')' : ''}   robots.txt: ${robots.code}`);
    if (http.err) console.log('curl stderr: ' + http.err.split('\n')[0]);

    const tcpOk = ip.v4.length ? await tcp(ip.v4[0]) : null;
    console.log('TCP 443: ' + (tcpOk === null ? 'skip(只有 v6)' : (tcpOk ? 'OK' : 'FAIL')));
    const t = tls(host);
    console.log(`TLS  : connected=${t.connected}  reset=${t.reset}`);

    if (http.code === '403' && robots.code === '403') console.log('=> 结论: 整站 IP 级封锁（robots 也 403），无解，止损');
    else if (http.code === '403') console.log('=> 结论: 应用层 WAF 403，试真浏览器 / 换路径');
    else if (http.code === '000' && http.exit === 35) console.log('=> 结论: 证书吊销检查失败（Schannel）。已带 --ssl-no-revoke 仍失败则为该域证书链问题，换浏览器复核');
    else if (http.code === '000' && t.connected && t.reset) console.log('=> 结论: TLS 被 RST —— SNI 级封锁，该 API 无解，退回主站粗粒度');
    else if (http.code === '000') console.log('=> 结论: 连接失败（TCP/SNI/超时），看上面 TCP 与 TLS 结果');
    else if (['200', '301', '302'].includes(http.code)) console.log('=> 结论: 可直连，继续定位价格源');
    else console.log('=> 结论: HTTP ' + http.code + '，人工判断');
  }
}

main();
