// content-queue/ の記事を公開前に検証する。
//
// publish-queue.mjs は「動かすだけ」で中身を見ないので、frontmatter の壊れや
// 言語間の不一致はビルド時か公開後まで気づけない。ここで先に落とす。
//
//   node scripts/check-queue.mjs
//
// 検証項目は docs/blog/article-ideas.md の執筆ルールに対応している。

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const QUEUE = 'content-queue';
const PUBLISHED = 'src/content/blog';
const LANGS = ['ja', 'en', 'th', 'ko', 'zh-hans', 'zh-hant'];

// lp.css の色相表にあるタグだけが tags[0] になれる（無いと既定のグリーンに落ちる）
const HUES = new Set([
	'currency', 'settlement', 'communication', 'travel',
	'group', 'how-to', 'couple', 'cohabitation', 'party',
]);

// SERPで切れないタイトル上限。全角を2、半角を1として数える。
// タイ文字は非ASCIIだがこの尺度では実際の表示幅より重く出るため、
// 検証済みの公開記事の実測最大（132）を上限にしている。
const TITLE_LIMIT = { ja: 64, ko: 64, 'zh-hans': 64, 'zh-hant': 64, en: 60, th: 132 };

const problems = [];
const warnings = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

const width = (s) => [...s].reduce((n, c) => n + (/[\x00-\x7F]/.test(c) ? 1 : 2), 0);

// frontmatter は "key: value" の1行1項目しか使っていないので簡易パーサで足りる
function parse(raw, where) {
	if (!raw.startsWith('---\n')) {
		fail(where, 'frontmatter が --- で始まっていない');
		return null;
	}
	const end = raw.indexOf('\n---\n', 4);
	if (end === -1) {
		fail(where, 'frontmatter の終端 --- が無い');
		return null;
	}
	const data = {};
	for (const line of raw.slice(4, end).split('\n')) {
		if (!line.trim()) continue;
		const m = line.match(/^([a-zA-Z]+):\s*(.*)$/);
		if (!m) {
			fail(where, `frontmatter の行を解釈できない: ${line}`);
			continue;
		}
		const [, key, rest] = m;
		if (rest.startsWith('[')) {
			// tags: ["a", "b"]
			if (!/^\[(\s*"[^"]*"\s*,?)*\s*\]$/.test(rest)) {
				fail(where, `${key} の配列が壊れている: ${rest}`);
				continue;
			}
			data[key] = [...rest.matchAll(/"([^"]*)"/g)].map((x) => x[1]);
		} else if (rest.startsWith('"')) {
			// 値の途中に裸の " があると YAML が壊れる。前後1文字だけが " であること
			if (!/^"[^"]*"$/.test(rest)) {
				fail(where, `${key} の文字列に裸のダブルクォートがある: ${rest}`);
				continue;
			}
			data[key] = rest.slice(1, -1);
		} else {
			data[key] = rest;
		}
	}
	return { data, body: raw.slice(end + 5) };
}

// 公開済み記事の slug（記事間リンクの検証に使う）
const publishedSlugs = new Set(
	existsSync(join(PUBLISHED, 'ja'))
		? readdirSync(join(PUBLISHED, 'ja')).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
		: []
);

const entries = readdirSync(QUEUE)
	.filter((d) => /^\d{4}-\d{2}-\d{2}-/.test(d))
	.sort();

if (entries.length === 0) {
	console.log('[check-queue] キューが空です');
	process.exit(0);
}

// キュー内の slug と、その公開順（先に出るものにしかリンクできない）
const queueOrder = new Map(entries.map((d, i) => [d.replace(/^\d{4}-\d{2}-\d{2}-/, ''), i]));

for (const [index, dir] of entries.entries()) {
	const slug = dir.replace(/^\d{4}-\d{2}-\d{2}-/, '');
	const dirDate = dir.slice(0, 10);
	const perLang = {};

	for (const lang of LANGS) {
		const path = join(QUEUE, dir, `${lang}.md`);
		const where = `${dir}/${lang}.md`;
		if (!existsSync(path)) {
			fail(dir, `${lang}.md が無い`);
			continue;
		}
		const parsed = parse(readFileSync(path, 'utf8'), where);
		if (!parsed) continue;
		const { data, body } = parsed;

		for (const key of ['title', 'description', 'pubDate', 'tags', 'emoji', 'ctaSub']) {
			if (data[key] === undefined) warn(where, `${key} が無い`);
		}
		if (data.pubDate !== dirDate) fail(where, `pubDate ${data.pubDate} がディレクトリ名の日付 ${dirDate} と違う`);
		if (data.tags && !HUES.has(data.tags[0])) fail(where, `tags[0] "${data.tags[0]}" に色相が定義されていない`);
		if (data.title && width(data.title) > TITLE_LIMIT[lang]) {
			fail(where, `タイトルが長い（${width(data.title)} > ${TITLE_LIMIT[lang]}）`);
		}
		if (!data.ctaSub?.includes('Evere')) fail(where, 'ctaSub に Evere が入っていない');

		// 太字は5〜8回（初稿15回がAIっぽさの主因だった）
		const bold = (body.match(/\*\*/g) ?? []).length / 2;
		if (bold < 5 || bold > 8) warn(where, `太字が ${bold} 箇所（基準は5〜8）`);

		// 日本語・韓国語・タイ語の本文でダッシュは使わない
		if (['ja', 'ko', 'th'].includes(lang) && /[—–]/.test(body)) {
			fail(where, '本文にダッシュがある');
		}
		// 中国語の本文は 「」 を使う（既存記事の表記に合わせる）
		if (lang.startsWith('zh') && body.includes('"')) {
			fail(where, '本文に ASCII のダブルクォートがある');
		}

		// 記事間リンクは必ず先に公開されるものへ
		for (const [, linked] of body.matchAll(new RegExp(`/${lang}/blog/([a-z0-9-]+)/`, 'g'))) {
			if (publishedSlugs.has(linked)) continue;
			const pos = queueOrder.get(linked);
			if (pos === undefined) fail(where, `存在しない記事へのリンク: ${linked}`);
			else if (pos >= index) fail(where, `後に公開される記事へリンクしている: ${linked}`);
		}
		// 言語プレフィックスの取り違え
		for (const [, other] of body.matchAll(/\/([a-z-]+)\/(?:blog|docs)\//g)) {
			if (other !== lang) fail(where, `別言語のリンクが混ざっている: /${other}/`);
		}

		perLang[lang] = {
			tags: (data.tags ?? []).join(','),
			emoji: data.emoji ?? '',
			headings: (body.match(/^## /gm) ?? []).length,
			faq: /^## .*(よくある質問|Common questions|자주 묻는 질문|คำถามที่พบบ่อย|常见问题|常見問題)/m.test(body),
		};
	}

	// 同じ slug なら言語をまたいで構造が揃っていること
	const base = perLang.ja;
	if (!base) continue;
	for (const lang of LANGS) {
		const cur = perLang[lang];
		if (!cur || lang === 'ja') continue;
		const where = `${dir}/${lang}.md`;
		if (cur.tags !== base.tags) fail(where, `tags が ja と違う（${cur.tags} vs ${base.tags}）`);
		if (cur.emoji !== base.emoji) fail(where, `emoji が ja と違う（${cur.emoji} vs ${base.emoji}）`);
		if (cur.headings !== base.headings) fail(where, `H2の数が ja と違う（${cur.headings} vs ${base.headings}）`);
		if (cur.faq !== base.faq) fail(where, `FAQの有無が ja と違う（${cur.faq} vs ${base.faq}）`);
	}
	console.log(`  ${dir}  H2:${base.headings}  FAQ:${base.faq ? 'あり' : 'なし'}  ${base.emoji} [${base.tags}]`);
}

console.log(`\n[check-queue] ${entries.length} 本 / ${entries.length * 6} ファイルを検証`);
if (warnings.length) {
	console.log(`\n警告 ${warnings.length} 件:`);
	for (const w of warnings) console.log(`  ! ${w}`);
}
if (problems.length) {
	console.log(`\nエラー ${problems.length} 件:`);
	for (const p of problems) console.log(`  x ${p}`);
	process.exit(1);
}
console.log('エラーなし');
