#!/usr/bin/env node
// ブログ公開キューの消化スクリプト。
//
//   node scripts/publish-queue.mjs [--dry-run]
//
// content-queue/ の先頭（ファイル名昇順）のエントリ1件を
// src/content/blog/{lang}/{slug}.md へ移動し、pubDate を今日
// （Asia/Tokyo）に書き換えて commit & push する。
//
// 設計上の保証:
// - キューが空なら何もせず正常終了（exit 0）
// - 同じ日に2回実行されても2本目は公開しない（今日の pubDate を持つ
//   記事が既にあればスキップ）→ 二重実行・リトライに安全
// - 移動先に同名ファイルが既にあれば上書きせずエラー終了

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const QUEUE_DIR = path.join(ROOT, 'content-queue');
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const LOCALES = ['en', 'ja', 'th', 'ko', 'zh-hans', 'zh-hant'];
const DRY_RUN = process.argv.includes('--dry-run');

const log = (msg) => console.log(`[publish-queue] ${msg}`);

function git(...args) {
	return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
}

// 今日の日付（Asia/Tokyo、YYYY-MM-DD）
const today = new Intl.DateTimeFormat('en-CA', {
	timeZone: 'Asia/Tokyo',
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
}).format(new Date());

// --- ガード1: 今日すでに公開済みなら何もしない（二重実行対策） ---
const publishedToday = LOCALES.flatMap((lang) => {
	const dir = path.join(BLOG_DIR, lang);
	if (!fs.existsSync(dir)) return [];
	return fs
		.readdirSync(dir)
		.filter((f) => f.endsWith('.md'))
		.filter((f) => {
			const src = fs.readFileSync(path.join(dir, f), 'utf8');
			return new RegExp(`^pubDate:\\s*["']?${today}`, 'm').test(src);
		})
		.map((f) => `${lang}/${f}`);
});
if (publishedToday.length > 0) {
	log(`already published today (${today}): ${publishedToday[0]} — nothing to do`);
	process.exit(0);
}

// --- キューの先頭エントリを取得 ---
const entries = fs.existsSync(QUEUE_DIR)
	? fs
			.readdirSync(QUEUE_DIR)
			.filter(
				(d) =>
					/^\d{4}-\d{2}-\d{2}-[a-z0-9][a-z0-9-]*$/.test(d) &&
					fs.statSync(path.join(QUEUE_DIR, d)).isDirectory(),
			)
			.sort()
	: [];

if (entries.length === 0) {
	log('queue is empty — nothing to do');
	process.exit(0);
}

const entry = entries[0];
const slug = entry.replace(/^\d{4}-\d{2}-\d{2}-/, '');
const entryDir = path.join(QUEUE_DIR, entry);

const langFiles = fs
	.readdirSync(entryDir)
	.filter((f) => LOCALES.includes(f.replace(/\.md$/, '')) && f.endsWith('.md'));

if (langFiles.length === 0) {
	console.error(`[publish-queue] ERROR: ${entry} has no {lang}.md files (expected e.g. ja.md, en.md)`);
	process.exit(1);
}

// --- ガード2: 移動先の衝突チェック（全件確認してから書く） ---
for (const f of langFiles) {
	const lang = f.replace(/\.md$/, '');
	const dest = path.join(BLOG_DIR, lang, `${slug}.md`);
	if (fs.existsSync(dest)) {
		console.error(`[publish-queue] ERROR: destination already exists: ${path.relative(ROOT, dest)}`);
		process.exit(1);
	}
}

log(`publishing "${entry}" → slug "${slug}" (${langFiles.map((f) => f.replace(/\.md$/, '')).join(', ')}), pubDate=${today}`);

if (DRY_RUN) {
	log('dry-run: no files moved, no commit');
	process.exit(0);
}

// --- リモートの最新を取り込んでから作業（push失敗の予防） ---
git('pull', '--rebase', '--autostash', 'origin', 'main');

// --- 移動 + pubDate 書き換え ---
const movedPaths = [];
for (const f of langFiles) {
	const lang = f.replace(/\.md$/, '');
	const src = path.join(entryDir, f);
	const dest = path.join(BLOG_DIR, lang, `${slug}.md`);
	let body = fs.readFileSync(src, 'utf8');
	if (/^pubDate:.*$/m.test(body)) {
		body = body.replace(/^pubDate:.*$/m, `pubDate: ${today}`);
	} else {
		// pubDate が無い場合は frontmatter の先頭に挿入
		body = body.replace(/^---\n/, `---\npubDate: ${today}\n`);
	}
	fs.mkdirSync(path.dirname(dest), { recursive: true });
	fs.writeFileSync(dest, body);
	fs.rmSync(src);
	movedPaths.push(path.relative(ROOT, dest));
}
fs.rmSync(entryDir, { recursive: true });

// --- commit & push（このスクリプトが触ったパスだけをステージ） ---
git('add', '--', 'content-queue', ...movedPaths);
git(
	'commit',
	'-m',
	`chore(blog): publish ${slug} (${today})\n\nCo-Authored-By: Claude Fable 5 <noreply@anthropic.com>`,
);
git('push', 'origin', 'main');

log(`done: published ${slug} (${movedPaths.length} locale(s)) and pushed to main`);
