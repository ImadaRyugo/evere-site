# content-queue — ブログ公開待ちキュー

公開待ちのブログ記事を置くフォルダ。**ここに置いた記事はビルドされない**
（ビルド対象は `src/content/blog/` のみ）。

## 置き方

1エントリ = 1ディレクトリ。ディレクトリ名は `YYYY-MM-DD-slug` 形式
（日付は**公開順を決めるためのソートキー**。実際の公開日は公開時に自動で上書きされる）。
中に言語ごとの Markdown を `{lang}.md` という名前で入れる（存在する言語だけでよい）:

```
content-queue/
  2026-07-20-couple-warikan-app/
    ja.md
    en.md
  2026-07-21-multi-currency-travel/
    ja.md
```

各ファイルの frontmatter（`pubDate` は仮の日付でOK。公開時に自動更新される）:

```yaml
---
title: "記事タイトル"
description: "メタディスクリプション（検索結果・OGPに使われる）"
pubDate: 2026-07-20
tags: ["warikan"]
---
```

`slug` はディレクトリ名の日付以降の部分がそのまま URL になる
（例: `/ja/blog/couple-warikan-app/`）。同じ slug の言語ファイル同士は
hreflang で自動的に相互リンクされる。

## 公開のしくみ

`scripts/publish-queue.mjs` が1日1回実行され、キュー先頭（名前昇順）の
1エントリを `src/content/blog/{lang}/{slug}.md` へ移動 → `pubDate` を
当日（Asia/Tokyo）に更新 → commit → push する。
main への push で Cloudflare Pages が自動ビルド・公開する。

- キューが空: 何もせず正常終了
- 同日の二重実行: 当日公開済み記事を検知してスキップ（安全）
- 手動テスト: `node scripts/publish-queue.mjs --dry-run`
