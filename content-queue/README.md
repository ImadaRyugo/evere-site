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
title: "記事タイトル" # H1・一覧カードにも出る。ja/ko/zh:全角32字 / en:60字 / th:全角換算35 が上限
description: "メタディスクリプション（検索結果・OGPに使われる）"
pubDate: 2026-07-20
tags: ["warikan"] # 先頭のタグが記事のアクセント色になる（色相表は lp.css）
emoji: "💱" # 一覧カード・記事ヘッダーのアイコン（任意）
ctaSub: "「返して」は言わなくていい。Evereなら「精算しよ」で済みます。" # 記事末尾CTAの一文
---
```

`ctaSub` を省略すると、トップページと同じ「無料・登録不要。」にフォールバックする。

**`ctaSub` の書き方には基準がある**（機能説明ではなく記事の痛点から入る / 日本語26〜38字 /
記事ごとに型を変える / Evereを入れるが「Evereなら」で揃えない）。
**書く前に必ず `docs/blog/article-ideas.md` の「記事末尾CTAの一言」節を読むこと。**
記事本文の執筆ルール（太字5〜8回、構成を型で散らす、Pros/Cons足場の禁止など）も同ファイルにある。

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
