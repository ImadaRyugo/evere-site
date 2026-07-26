// Instagram 画像生成ツールキット（Evere）
// ------------------------------------------------------------
// 方式は gen-og.mjs と同じ: ヘッドレスChromeでHTMLを実寸スクショ → sharp で仕上げ。
// フォントの選択・太さの解決がサイトと完全に一致するのが狙い。
//
// このファイルは2層構成:
//   ① エンジン … 再利用可能な部品（Chromeスクショ / グラデ / ディザ / パレット等）。基本さわらない。
//   ② デザイン … 各投稿の固有部分。新デザインを作るときは main() だけ書き換える。
//
// 過去の学び（消さないこと）:
//   - グリッドは 3:4（1080×1440）で書き出すとプロフィールでクロップされない。4:5 だと左右が3%切れる。
//   - グラデ地は「8bitに丸める“前”」にディザを混ぜないと、Instagram 再圧縮で帯（バンディング）が
//     復活する。丸めた後にノイズを足しても消えない（→ smoothGradient）。
//   - 手持ちフォンのモックを合成する場合、フォンは傾いていて上端の丸みで測ると位置がブレる。
//     画面内の固定ランドマーク（例: ステータスバーの時刻テキスト左上）で合わせること。
//     モックごとに幅・縦横比が微妙に違うこともある（必要なら横だけ非等倍で合わせる）。
//
// 実行: npm run ig  … 下の main()（サンプル）を書き出す
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// 出力先。既定は gitignore 済みの ./ig（= Web には公開されない一時置き場）。
// iCloud 等サイト外の素材フォルダへ直接書き出したい時は、環境変数 IG_OUT で指定する:
//   IG_OUT="/path/to/Evere/Instagram/固定フィード/_生成raw" npm run ig
const OUT_DIR = process.env.IG_OUT || path.join(root, 'ig');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// サイトと共有する素材
const ICON = pathToFileURL(path.join(root, 'src', 'assets', 'cta-app-icon.png'));
const FONT = pathToFileURL(path.join(root, 'scripts', 'fonts', 'InstrumentSans.ttf'));

// Evere の配色（lp.css と一致）。新デザインもこれを使えばサイトとズレない
const PALETTE = {
	ink: '#0b0c0e', // ダーク地
	paper: '#f5f5f7', // ライト地
	onDark: '#f4f4f5', // ダーク地の文字
	onLight: '#17181d', // ライト地の文字
	green: '#1e9e50', // 精算グリーン（アクセント）
};

const RENDER_SCALE = 2; // 2xで撮って等倍に落とす（1x直撮りより字面が締まる）

if (!fs.existsSync(CHROME)) {
	console.error('Google Chrome が見つかりません（画像生成に必要）');
	process.exit(1);
}
fs.mkdirSync(OUT_DIR, { recursive: true });
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'evere-ig-'));

// ============================================================
//  ① エンジン（再利用可能。基本さわらない）
// ============================================================

/** HTML を width×height の PNG にする。2xで撮って等倍へ。
 *  返り値は resize 済みの sharp インスタンス（.png().toFile() や .raw() を呼ぶ）。
 *  transparent:true で地を透過（グラデ等を後ろに敷きたい時）。 */
async function renderHtml(html, { width, height, transparent = false }) {
	const base = path.join(tmpDir, `r-${Math.random().toString(36).slice(2)}`);
	fs.writeFileSync(`${base}.html`, html);
	execFileSync(CHROME, [
		'--headless',
		'--disable-gpu',
		'--hide-scrollbars',
		`--force-device-scale-factor=${RENDER_SCALE}`,
		`--window-size=${width},${height}`,
		'--virtual-time-budget=5000',
		...(transparent ? ['--default-background-color=00000000'] : []),
		`--screenshot=${base}.png`,
		pathToFileURL(`${base}.html`).href,
	]);
	return sharp(`${base}.png`).resize(width, height, { fit: 'fill' });
}

/** サイトと同じフォント解決を保証する共通 <head>。各デザインの先頭に差し込む。 */
function baseHead() {
	return `<meta charset="utf-8"><style>
	@font-face { font-family:'Instrument Sans Variable'; src:url('${FONT.href}') format('truetype'); font-weight:100 900; }
	* { margin:0; padding:0; box-sizing:border-box; }
	body {
		font-family:'Instrument Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI',
			'Hiragino Sans', 'Yu Gothic UI', sans-serif;
		font-feature-settings:'palt' 1; -webkit-font-smoothing:antialiased;
	}
	</style>`;
}

/** 固定シード乱数（再実行しても同じ絵になる）。 */
function mulberry32(seed) {
	return function () {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** バンディングの出ない縦グラデを生成（生RGBバッファ）。
 *  要点: 8bitに丸める“前”にTPDFディザを混ぜる。丸めた後にノイズを足しても帯は消えない。
 *  amp は Instagram 再圧縮に耐える下限として ±4 が実測の目安（色幅が狭いグラデほど必要）。
 *  stops: [[r,g,b, 位置0..1], ...] を上→下の順で。 */
function smoothGradient({ stops, width, height, amp = 4, seed = 20260722 }) {
	const rand = mulberry32(seed);
	const buf = Buffer.alloc(width * height * 3);
	for (let y = 0; y < height; y++) {
		const p = y / (height - 1);
		let i = 0;
		while (i < stops.length - 2 && stops[i + 1][3] < p) i++;
		const a = stops[i];
		const b = stops[i + 1];
		const f = (p - a[3]) / (b[3] - a[3]);
		for (let x = 0; x < width; x++) {
			const noise = (rand() + rand() - 1) * amp;
			for (let c = 0; c < 3; c++) {
				const v = Math.round(a[c] + (b[c] - a[c]) * f + noise);
				buf[(y * width + x) * 3 + c] = v < 0 ? 0 : v > 255 ? 255 : v;
			}
		}
	}
	return { data: buf, info: { width, height, channels: 3 } };
}

/** 生RGB(A)バッファにTPDFディザを直接かける（グラデを撮った素材の帯対策）。
 *  ベタ塗りには使わない（圧縮が効かずファイルが膨らむだけ）。 */
function ditherInPlace(data, amp = 4, seed = 20260722) {
	const rand = mulberry32(seed);
	for (let n = 0; n < data.length; n++) {
		data[n] = Math.max(0, Math.min(255, Math.round(data[n] + (rand() + rand() - 1) * amp)));
	}
	return data;
}

/** 幅に対する％で寸法を書く（デザインを解像度非依存にしたい時）。cqw(8, 1080) → 86.4 */
const cqw = (pct, width) => +(pct * (width / 100)).toFixed(2);

/** Evere らしい通貨記号の地紋（HTMLの span 群を返す）。地の上に薄く重ねる想定。使いたい時だけ。 */
function currencyScatter({ width, height, seed = 20260721, count = 60, opacity = 0.055 } = {}) {
	const SYMS = ['¥', '$', '€', '£', '₩', '฿', '¢'];
	const rand = mulberry32(seed);
	const pts = [];
	let guard = 0;
	while (pts.length < count && guard++ < 20000) {
		const x = 40 + rand() * (width - 80);
		const y = 40 + rand() * (height - 80);
		if (pts.some((q) => (q.x - x) ** 2 + (q.y - y) ** 2 < 108 ** 2)) continue;
		pts.push({
			x,
			y,
			sym: SYMS[Math.floor(rand() * SYMS.length)],
			size: cqw(1.67 + rand() * 1.4, width),
			rot: -18 + rand() * 36,
		});
	}
	return pts
		.map(
			(p) =>
				`<span style="position:absolute;left:${p.x.toFixed(1)}px;top:${p.y.toFixed(1)}px;font-size:${p.size}px;font-weight:600;color:rgba(23,24,29,${opacity});transform:translate(-50%,-50%) rotate(${p.rot.toFixed(1)}deg)">${p.sym}</span>`
		)
		.join('');
}

// ============================================================
//  ② デザイン（各投稿の固有部分）
//  ↓ 新しいデザインを作るときは、この main() を丸ごと書き換える。エンジンは触らない。
//  以下はエンジンの使い方の最小サンプル（① ダーク地の見出し ② セージのグラデ地）。
// ============================================================
async function main() {
	const W = 1080;
	const H = 1350; // 4:5 フィード標準（3枚組グリッドなら 1080×1440）

	// 例① ダーク地に アイコン＋見出し（palette / font / icon の確認）
	{
		const html = `<!doctype html><html lang="ja"><head>${baseHead()}</head>
		<body style="width:${W}px;height:${H}px;background:${PALETTE.ink};color:${PALETTE.onDark};position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:${cqw(8, W)}px">
			<img src="${ICON.href}" style="width:${cqw(13, W)}px;height:${cqw(13, W)}px;display:block;margin-bottom:${cqw(4, W)}px">
			<h1 style="font-size:${cqw(11, W)}px;font-weight:660;letter-spacing:-0.03em;line-height:1.15">Spending for two,<br>splitting for everyone.</h1>
		</body></html>`;
		await (await renderHtml(html, { width: W, height: H }))
			.png({ compressionLevel: 9 })
			.toFile(path.join(OUT_DIR, 'example-dark.png'));
		console.log('example-dark.png');
	}

	// 例② バンディングの出ないセージのグラデ地に、透過で撮った文字を重ねる
	//     （地は Chrome に描かせず sharp 側で作る → 帯が出ない）
	{
		const stops = [
			[197, 210, 210, 0],
			[204, 215, 217, 0.5],
			[219, 223, 224, 1],
		];
		const bg = smoothGradient({ stops, width: W, height: H });
		const html = `<!doctype html><html lang="ja"><head>${baseHead()}</head>
		<body style="width:${W}px;height:${H}px;background:transparent;color:${PALETTE.onLight};position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:${cqw(8, W)}px">
			<h1 style="font-size:${cqw(11, W)}px;font-weight:660;letter-spacing:-0.03em;line-height:1.15">Spending for two,<br>splitting for everyone.</h1>
		</body></html>`;
		const text = await (await renderHtml(html, { width: W, height: H, transparent: true }))
			.png()
			.toBuffer();
		await sharp(bg.data, { raw: bg.info })
			.composite([{ input: text }])
			.removeAlpha()
			.png({ compressionLevel: 9 })
			.toFile(path.join(OUT_DIR, 'example-gradient.png'));
		console.log('example-gradient.png');
	}

	console.log(`\n${OUT_DIR} に出力しました（サンプル）。新デザインは main() を書き換えてください。`);
}

// エンジン内で使う可能性のある部品を、未使用でも参照だけ残す（新デザインで使う）
void ditherInPlace;
void currencyScatter;
void PALETTE.green;

main();
