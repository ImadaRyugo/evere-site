// OGP画像の生成（6言語 + デフォルト）
// - ヒーローと完全に同じ見た目にするため、Chrome本体（ヘッドレス）でHTMLを
//   スクリーンショットして生成する。フォントの選択・太さの解決（例: Hiragino W7）が
//   sharp/librsvg では再現できないため、サイトと同じレンダリングエンジンを使う
// - デザインはLPヒーローと同じ（#f5f5f7 / #17181d、weight 680、縦グラデ、letter-spacing）
// - キャッチコピーは src/i18n/lp.ts の hero.title と必ず揃えること
// - 生成はローカル（Mac + Google Chrome）で行い public/ にコミットする
// 実行: npm run og
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const iconUrl = pathToFileURL(path.join(root, 'src', 'assets', 'cta-app-icon.png'));
const instrumentUrl = pathToFileURL(path.join(root, 'scripts', 'fonts', 'InstrumentSans.ttf'));

if (!fs.existsSync(CHROME)) {
	console.error('Google Chrome が見つかりません（OG画像の生成に必要です）');
	process.exit(1);
}

const W = 1200;
const H = 630;

// キャッチコピー（hero.title）と、html lang（フォントフォールバックをサイトと揃えるのに必要）
const LOCALES = {
	en: { lang: 'en', size: 60, lines: ['Spending for two,', 'splitting for everyone.'] },
	ja: { lang: 'ja', size: 58, lines: ['ふたりの支出も、', 'みんなでの割り勘も。'] },
	th: { lang: 'th', size: 56, lines: ['ทั้งรายจ่ายของสองคน', 'และหารบิลกันทุกคน'] },
	ko: { lang: 'ko', size: 58, lines: ['둘의 지출도,', '다 함께 더치페이도.'] },
	'zh-hans': { lang: 'zh-CN', size: 56, lines: ['两个人的支出也好，', '大家一起分摊也好。'] },
	'zh-hant': { lang: 'zh-TW', size: 56, lines: ['兩個人的支出也好，', '大家一起分攤也好。'] },
};

// 背景に散らす通貨記号。誰でも分かる記号だけに絞る（英文字入り・マイナー通貨は不可）
const SYMBOLS = ['¥', '$', '€', '£', '₩', '฿', '¢'];

// 固定シードの擬似乱数（mulberry32）。全言語で同じ配置になり、再生成しても差分が出ない
function mulberry32(seed) {
	return function () {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

// ポアソンディスク風のランダム散布。
// 完全ランダムだと重なりや空白の偏りが出るので、最小距離だけ保証して自然なばらつきにする。
// 近く（半径220px以内）に同じ記号が来ないように選ぶ
function scatterSpans() {
	const rand = mulberry32(20260721);
	const MIN_DIST = 120;
	const COUNT = 28;
	const MARGIN = 30;
	const points = [];
	let attempts = 0;
	while (points.length < COUNT && attempts < 5000) {
		attempts++;
		const x = Math.round(MARGIN + rand() * (W - MARGIN * 2));
		const y = Math.round(MARGIN + rand() * (H - MARGIN * 2));
		if (points.some((p) => (p.x - x) ** 2 + (p.y - y) ** 2 < MIN_DIST ** 2)) continue;
		// 近く（半径220px以内）に同じ記号が来ないよう選び直す（候補が尽きたら諦めて採用）
		let sym = SYMBOLS[Math.floor(rand() * SYMBOLS.length)];
		for (
			let tries = 0;
			tries < SYMBOLS.length &&
			points.some((p) => p.sym === sym && (p.x - x) ** 2 + (p.y - y) ** 2 < 220 ** 2);
			tries++
		) {
			sym = SYMBOLS[Math.floor(rand() * SYMBOLS.length)];
		}
		points.push({ x, y, sym });
	}
	return points
		.map(({ x, y, sym }) => {
			const size = Math.round(20 + rand() * 16);
			const rot = Math.round(-18 + rand() * 36);
			return `<span class="sym" style="left:${x}px;top:${y}px;font-size:${size}px;transform:translate(-50%,-100%) rotate(${rot}deg)">${sym}</span>`;
		})
		.join('\n\t\t');
}

// 行末の約物（、。，など）はグリフが左半分に寄っていて、そのままセンタリングすると
// 行全体が左に寄って見える。負のmarginで約物の余白ぶんを中央計算から除外する
function renderLine(line) {
	const m = line.match(/^(.*?)([、。，．]|[,.])$/);
	if (!m) return line;
	const hang = /[、。，．]/.test(m[2]) ? '-0.5em' : '-0.2em';
	return `${m[1]}<span style="margin-right:${hang}">${m[2]}</span>`;
}

function pageHtml({ lang, size, lines }) {
	return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<style>
	/* サイトの --lp-font と同じスタック（Latin は Instrument Sans、他はシステムフォント） */
	@font-face {
		font-family: 'Instrument Sans Variable';
		src: url('${instrumentUrl.href}') format('truetype');
		font-weight: 100 900;
	}
	* { margin: 0; padding: 0; }
	body {
		width: ${W}px;
		height: ${H}px;
		overflow: hidden;
		position: relative;
		background: #f5f5f7;
		font-family:
			'Instrument Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI',
			'Hiragino Sans', 'Yu Gothic UI', 'Apple SD Gothic Neo', 'Noto Sans KR',
			'PingFang SC', 'PingFang TC', 'Microsoft JhengHei', 'Noto Sans Thai', sans-serif;
	}
	.sym {
		position: absolute;
		font-weight: 600;
		color: rgba(23, 24, 29, 0.055);
	}
	.card {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.icon {
		margin-top: 112px;
		width: 128px;
		height: 128px;
		filter: drop-shadow(0 10px 24px rgba(23, 24, 29, 0.2));
	}
	/* .lp-hero-title と同じ（weight 680 / letter-spacing / 縦グラデ） */
	h1 {
		/* fit-content幅だと行末約物の負マージンで幅が縮み折り返すため全幅にする */
		width: 100%;
		white-space: nowrap;
		margin-top: 60px;
		font-size: ${size}px;
		font-weight: 680;
		letter-spacing: -0.03em;
		line-height: 1.35;
		text-align: center;
	}
	h1 .line {
		display: block;
		background: linear-gradient(180deg, #17181d 30%, rgba(23, 24, 29, 0.6));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		color: transparent;
		padding-bottom: 0.08em;
	}
	.domain {
		position: absolute;
		bottom: 62px;
		left: 0;
		right: 0;
		text-align: center;
		font-size: 26px;
		font-weight: 500;
		color: rgba(23, 24, 29, 0.44);
	}
</style>
</head>
<body>
	${scatterSpans()}
	<div class="card">
		<img class="icon" src="${iconUrl.href}" alt="">
		<h1><span class="line">${renderLine(lines[0])}</span><span class="line">${renderLine(lines[1])}</span></h1>
		<div class="domain">evereapp.com</div>
	</div>
</body>
</html>`;
}

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'evere-og-'));

for (const [locale, conf] of Object.entries(LOCALES)) {
	const htmlPath = path.join(tmpDir, `og-${locale}.html`);
	fs.writeFileSync(htmlPath, pageHtml(conf));
	const out = path.join(outDir, `og-${locale}.png`);
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
	console.log(`og-${locale}.png generated`);
}

// 言語不明ページ（ルート / privacy / terms の共通入口）用のデフォルトは英語版
fs.copyFileSync(path.join(outDir, 'og-en.png'), path.join(outDir, 'og.png'));
console.log('og.png (default = en) generated');
