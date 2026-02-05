# Evere Official Website

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

公式Webサイト（LP + ガイド + 法務ページ + サポート）for [Evere](https://github.com/[github_repo_url]) - カップル/グループの割り勘・精算アプリ

## 概要

このリポジトリは、EvereアプリのApp Storeリリースに必要な「プライバシーポリシーURL」等を満たすための公式Webサイトです。

- **技術スタック**: Astro + Starlight
- **ホスティング**: Cloudflare Pages
- **多言語対応**: 日本語, English, ไทย, 한국어, 简体中文, 繁體中文

## プロジェクト構成

```
.
├── public/                # 静的アセット（ファビコン等）
├── src/
│   ├── assets/            # 画像等のアセット
│   ├── content/
│   │   └── docs/          # ドキュメント（.md/.mdx）
│   │       ├── legal/     # 法務ページ（英語）
│   │       ├── ja/        # 日本語
│   │       ├── th/        # タイ語
│   │       ├── ko/        # 韓国語
│   │       ├── zh-hans/   # 簡体中文
│   │       └── zh-hant/   # 繁體中文
│   └── content.config.ts
├── docs/
│   └── legal/
│       └── fact-sheet.md  # プライバシーポリシー作成用の事実確認シート
├── astro.config.mjs       # Astro設定
├── package.json
├── tsconfig.json
└── CLAUDE.md              # 開発仕様書
```

## コマンド

すべてのコマンドは、プロジェクトルートから実行してください：

| コマンド                   | 説明                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | 依存関係のインストール                            |
| `npm run dev`             | ローカル開発サーバー起動 (`localhost:4321`)      |
| `npm run build`           | 本番用サイトを `./dist/` にビルド                |
| `npm run preview`         | ビルドしたサイトをローカルでプレビュー             |
| `npm run astro ...`       | Astro CLI コマンド実行                          |
| `npm run astro -- --help` | Astro CLI ヘルプ表示                            |

## ローカル起動

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

開発サーバーが `http://localhost:4321` で起動します。

## ビルド

```bash
# 本番用ビルド
npm run build
```

ビルド成果物は `dist/` ディレクトリに生成されます。

## Cloudflare Pagesデプロイ設定

Cloudflare Pagesでのデプロイ設定：

- **Framework preset**: Astro
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node version**: 18.x or later

### 環境変数

特に設定不要です。

## 法務ページの更新手順

**重要**: プライバシーポリシー等の法務ページを更新する際は、必ず以下の手順に従ってください。

### 1. Fact Sheetを更新

まず、`docs/legal/fact-sheet.md` を更新します。

- **推測禁止**: アプリのコードから確認できた事実のみを記載
- **新機能追加時**: 収集データ、第三者サービス等を追記
- **SDK変更時**: 利用サービスの追加・削除を反映

### 2. 本文を更新

Fact Sheetの内容に基づいて、各言語のプライバシーポリシーを更新します：

- `src/content/docs/legal/privacy.md` (English)
- `src/content/docs/ja/legal/privacy.md` (日本語)
- `src/content/docs/th/legal/privacy.md` (ไทย)
- `src/content/docs/ko/legal/privacy.md` (한국어)
- `src/content/docs/zh-hans/legal/privacy.md` (简体中文)
- `src/content/docs/zh-hant/legal/privacy.md` (繁體中文)

**注意**:
- 確認できた事実のみを記載
- 推測や未来の予定は記載しない
- 最終更新日を必ず更新

### 3. コミット & デプロイ

```bash
git add .
git commit -m "docs: Update privacy policy"
git push
```

Cloudflare Pagesが自動的にデプロイします。

## プレースホルダーの置き換え

以下のプレースホルダーは、実際の値が確定次第、置き換えてください：

- `[support_email]`: サポートメールアドレス
- `[business_name]`: 事業者名
- `[github_repo_url]`: GitHubリポジトリURL
- `[github_feature_request_url]`: GitHub Issues URL

## ライセンス

このリポジトリは public です。秘密情報は置かないでください。

## 参考リンク

- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Documentation](https://docs.astro.build)
- [Cloudflare Pages](https://pages.cloudflare.com/)
