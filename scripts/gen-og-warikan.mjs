// 割り勘計算ツール（/ja/tools/warikan/）専用のOGP画像を生成する
// - gen-og.mjs と同じく Chrome 本体（ヘッドレス）で HTML を撮影する（日本語フォントの太さを再現するため）
// - 左に見出し、右にツールと同じ黒いEvere端末（計算結果と精算済みスタンプ）を置く
// - 共有リンクは # 以降に入力が入るだけでサーバーには届かないため、画像は結果ごとに変えられない。
//   どの結果を共有しても同じ画像になる前提で、例の数字を見せる
// - 生成はローカル（Mac + Google Chrome）で行い public/ にコミットする
// 実行: npm run og:warikan
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const iconUrl = pathToFileURL(path.join(root, 'src', 'assets', 'cta-app-icon.png'));
const instrumentUrl = pathToFileURL(path.join(root, 'scripts', 'fonts', 'InstrumentSans.ttf'));
const out = path.join(root, 'public', 'og-warikan.png');

if (!fs.existsSync(CHROME)) {
	console.error('Google Chrome が見つかりません（OG画像の生成に必要です）');
	process.exit(1);
}

const W = 1200;
const H = 630;

const rows = [
	{ n: 1, label: '1人目', tag: '差額を調整', amount: '3,200' },
	{ n: 2, label: '2人目', amount: '3,400' },
	{ n: 3, label: '3人目', amount: '3,400' },
];

const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<style>
	@font-face {
		font-family: 'Instrument Sans Variable';
		src: url('${instrumentUrl.href}') format('truetype');
		font-weight: 100 900;
	}
	* { margin: 0; padding: 0; box-sizing: border-box; }
	body {
		width: ${W}px;
		height: ${H}px;
		overflow: hidden;
		position: relative;
		background: #f5f5f7;
		color: #17181d;
		font-family: 'Instrument Sans Variable', -apple-system, BlinkMacSystemFont, 'Hiragino Sans', sans-serif;
	}
	/* LPヒーローと同じドットグリッド */
	body::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: radial-gradient(rgba(23, 24, 29, 0.13) 1.2px, transparent 1.2px);
		background-size: 30px 30px;
		mask-image: radial-gradient(ellipse 70% 80% at 25% 40%, black 30%, transparent 80%);
	}
	.sym {
		position: absolute;
		font-weight: 600;
		color: rgba(23, 24, 29, 0.07);
	}
	.copy {
		position: absolute;
		left: 84px;
		top: 0;
		bottom: 0;
		width: 520px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 14px;
		font-size: 30px;
		font-weight: 650;
		letter-spacing: -0.01em;
	}
	.brand img {
		width: 56px;
		height: 56px;
		filter: drop-shadow(0 6px 14px rgba(23, 24, 29, 0.18));
	}
	h1 {
		margin-top: 34px;
		font-size: 108px;
		font-weight: 700;
		letter-spacing: -0.05em;
		line-height: 1;
		font-feature-settings: 'palt';
		background: linear-gradient(180deg, #17181d 35%, rgba(23, 24, 29, 0.6));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		padding-bottom: 0.06em;
	}
	.lead {
		margin-top: 26px;
		font-size: 30px;
		font-weight: 600;
		line-height: 1.55;
		color: rgba(23, 24, 29, 0.62);
		font-feature-settings: 'palt';
	}
	.domain {
		margin-top: 34px;
		font-size: 24px;
		font-weight: 550;
		color: rgba(23, 24, 29, 0.42);
	}
	/* ツールと同じ黒いEvere端末 */
	.device {
		position: absolute;
		right: 70px;
		top: 70px;
		width: 470px;
		padding: 30px 30px 34px;
		border-radius: 46px;
		background: #101116;
		color: #f5f7fa;
		box-shadow: 0 50px 90px -30px rgba(0, 0, 0, 0.55);
		transform: rotate(-2deg);
	}
	.kicker { font-size: 20px; font-weight: 650; color: #9ba3af; }
	.big {
		margin-top: 8px;
		display: flex;
		align-items: baseline;
		font-size: 112px;
		font-weight: 700;
		letter-spacing: -0.045em;
		line-height: 1;
	}
	.big span { font-size: 0.42em; color: #9ba3af; margin-right: 6px; letter-spacing: 0; }
	.bar { display: flex; gap: 5px; height: 12px; margin-top: 26px; }
	.bar i { flex: 1; border-radius: 99px; background: #f5f7fa; }
	.bar i:nth-child(2) { background: #9ba3af; }
	.bar i:first-child { flex: 0.94; background: repeating-linear-gradient(-45deg, #f5f7fa 0 4px, transparent 4px 8px); box-shadow: inset 0 0 0 1.5px #f5f7fa; }
	.row {
		display: flex;
		align-items: center;
		gap: 14px;
		height: 66px;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		font-size: 24px;
		font-weight: 650;
	}
	.rows { margin-top: 18px; }
	.rows .row:first-child { border-top: 0; }
	.av {
		width: 40px; height: 40px; border-radius: 99px;
		display: grid; place-items: center;
		font-size: 18px; font-weight: 700;
	}
	.av1 { background: #f4f4f5; color: #101116; }
	.av2 { background: #a1a5b0; color: #101116; }
	.av3 { background: #474a55; color: #f5f7fa; }
	.tag { font-size: 15px; font-weight: 600; padding: 3px 10px; border-radius: 99px; background: rgba(255,255,255,0.06); color: #9ba3af; }
	.amt { margin-left: auto; font-size: 27px; font-weight: 700; letter-spacing: -0.02em; }
	/* ツールと同じ「ちょうど割った額との差」 */
	.diff {
		margin-top: 8px;
		padding-top: 16px;
		border-top: 1.5px dashed rgba(255, 255, 255, 0.18);
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 16px;
		font-weight: 650;
		color: #9ba3af;
		white-space: nowrap;
	}
	.chip { padding: 6px 12px; border-radius: 99px; background: rgba(255, 255, 255, 0.06); white-space: nowrap; }
	.chip b { margin-left: 6px; color: #f5f7fa; font-weight: 700; }
	/* アプリの精算画面と同じスタンプ表現（サイトのブランド色＝精算グリーン） */
	.stamp {
		position: absolute;
		right: -26px;
		top: 54px;
		padding: 8px 20px;
		border: 4px solid #1e9e50;
		border-radius: 12px;
		background: rgba(245, 245, 247, 0.92);
		color: #1e9e50;
		font-size: 30px;
		font-weight: 900;
		letter-spacing: 0.08em;
		transform: rotate(12deg);
		box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.35);
	}
</style>
</head>
<body>
	<span class="sym" style="left:560px;top:40px;font-size:44px;transform:rotate(-12deg)">¥</span>
	<span class="sym" style="left:40px;top:520px;font-size:38px;transform:rotate(14deg)">$</span>
	<span class="sym" style="left:610px;top:520px;font-size:34px;transform:rotate(-8deg)">€</span>
	<span class="sym" style="left:470px;top:300px;font-size:28px;transform:rotate(10deg)">฿</span>
	<div class="copy">
		<div class="brand"><img src="${iconUrl.href}" alt="">Evere</div>
		<h1>割り勘計算</h1>
		<p class="lead">金額と人数を入れるだけ。<br>端数も、立て替えの精算も。</p>
		<p class="domain">evereapp.com</p>
	</div>
	<div class="device">
		<div class="kicker">1人あたり</div>
		<div class="big"><span>¥</span>3,400</div>
		<div class="bar"><i></i><i></i><i></i></div>
		<div class="rows">
			${rows
				.map(
					(r) =>
						`<div class="row"><span class="av av${r.n}">${r.n}</span>${r.label}${r.tag ? `<span class="tag">${r.tag}</span>` : ''}<span class="amt">¥${r.amount}</span></div>`,
				)
				.join('')}
		</div>
		<div class="diff">ちょうどより<span class="chip">2〜3人目<b>+67円</b></span><span class="chip">1人目<b>−133円</b></span></div>
		<div class="stamp">精算済み</div>
	</div>
</body>
</html>`;

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'evere-og-warikan-'));
const htmlPath = path.join(tmpDir, 'og-warikan.html');
fs.writeFileSync(htmlPath, html);
execFileSync(CHROME, [
	'--headless',
	'--disable-gpu',
	'--hide-scrollbars',
	'--force-device-scale-factor=1',
	`--window-size=${W},${H}`,
	'--virtual-time-budget=5000',
	`--screenshot=${out}`,
	pathToFileURL(htmlPath).href,
]);
fs.rmSync(tmpDir, { recursive: true, force: true });
console.log('og-warikan.png generated');
