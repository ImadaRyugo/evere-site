# Evere Official Website

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

公式Webサイト（LP + ガイド + 法務ページ + サポート）for [Evere](https://github.com/ImadaRyugo/evenly-mobile) - カップル/グループの割り勘・精算アプリ

## 概要

このリポジトリは、EvereアプリのApp Storeリリースに必要な「プライバシーポリシーURL」等を満たすための公式Webサイトです。

- **技術スタック**: Astro + Starlight
- **ホスティング**: Cloudflare Pages
- **多言語対応**: 日本語, English, ไทย, 한국어, 简体中文, 繁體中文
- **リポジトリ**: https://github.com/ImadaRyugo/evere-site

## 主要機能

### 多言語対応と自動言語検出

- **6言語対応**: 英語、日本語、タイ語、韓国語、簡体字中国語、繁体字中国語
- **言語選択の保存**: localStorageでユーザーの言語選択を保存
- **自動言語検出**: 初回訪問時にブラウザ言語を検出してリダイレクト
- **優先順位**: 保存された言語 > ブラウザ言語 > デフォルト（英語）

### URL構造

| URL | 説明 |
|-----|------|
| `/privacy` | リダイレクトページ（言語検出・保存言語優先） |
| `/terms` | リダイレクトページ（言語検出・保存言語優先） |
| `/en/` | 英語版トップページ |
| `/en/privacy/` | 英語版Privacy Policy |
| `/en/terms/` | 英語版Terms of Service |
| `/ja/privacy/` | 日本語版プライバシーポリシー |
| `/ja/terms/` | 日本語版利用規約 |
| `/ko/*`, `/th/*`, `/zh-hans/*`, `/zh-hant/*` | 他の言語版 |

### App Store / Google Play用URL

審査で使用するURL：
- **Privacy Policy**: `https://your-domain.pages.dev/privacy`
- **Terms of Service**: `https://your-domain.pages.dev/terms`

特定言語へのリンクが必要な場合：
- **English Privacy**: `https://your-domain.pages.dev/en/privacy/`
- **Japanese Privacy**: `https://your-domain.pages.dev/ja/privacy/`

## プロジェクト構成

```
.
├── public/
│   ├── _redirects          # Cloudflare Pages リダイレクト設定
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── content/
│   │   └── docs/
│   │       ├── en/         # 英語版コンテンツ
│   │       │   ├── index.mdx
│   │       │   ├── privacy.md
│   │       │   └── terms.md
│   │       ├── ja/         # 日本語
│   │       ├── ko/         # 韓国語
│   │       ├── th/         # タイ語
│   │       ├── zh-hans/    # 簡体中文
│   │       ├── zh-hant/    # 繁體中文
│   │       └── index.mdx   # ルートトップページ
│   ├── pages/
│   │   ├── privacy.astro   # 言語検出リダイレクトページ
│   │   └── terms.astro     # 言語検出リダイレクトページ
│   └── content.config.ts
├── docs/
│   └── legal/
│       └── fact-sheet.md   # プライバシーポリシー作成用の事実確認シート
├── astro.config.mjs
├── CLAUDE.md               # 開発仕様書
├── DEPLOYMENT_CHECK.md     # デプロイ後確認手順
└── README.md
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

# ローカルでプレビュー
npm run preview
```

ビルド成果物は `dist/` ディレクトリに生成されます。

## Cloudflare Pagesデプロイ

### 初回セットアップ

1. Cloudflare Pagesにログイン
2. "Create a project" を選択
3. GitHubリポジトリを接続（`ImadaRyugo/evere-site`）
4. 以下のビルド設定を入力：

   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: 18.x or later

5. "Save and Deploy" をクリック

### 環境変数

特に設定不要です。

### 自動デプロイ

`main` ブランチへのpushで自動的にデプロイされます。

## 法務ページの更新手順

**重要**: プライバシーポリシー等の法務ページを更新する際は、必ず以下の手順に従ってください。

### 1. Fact Sheetを更新

まず、`docs/legal/fact-sheet.md` を更新します。

- **推測禁止**: アプリのコードから確認できた事実のみを記載
- **新機能追加時**: 収集データ、第三者サービス等を追記
- **SDK変更時**: 利用サービスの追加・削除を反映

### 2. 本文を更新

Fact Sheetの内容に基づいて、各言語のプライバシーポリシーを更新します：

- `src/content/docs/en/privacy.md` (English)
- `src/content/docs/ja/privacy.md` (日本語)
- `src/content/docs/th/privacy.md` (ไทย)
- `src/content/docs/ko/privacy.md` (한국어)
- `src/content/docs/zh-hans/privacy.md` (简体中文)
- `src/content/docs/zh-hant/privacy.md` (繁體中文)

**注意**:
- 確認できた事実のみを記載
- 推測や未来の予定は記載しない
- 最終更新日を必ず更新
- 技術仕様の断定を避け、「may」表現を使用

### 3. コミット & デプロイ

```bash
git add .
git commit -m "docs: Update privacy policy"
git push
```

Cloudflare Pagesが自動的にデプロイします。

## 運営者情報

- **運営者**: Ryugo Imada
- **連絡先**: imadaryugo@gmail.com
- **GitHub**: https://github.com/ImadaRyugo/evenly-mobile
- **Issues**: https://github.com/ImadaRyugo/evenly-mobile/issues

## デプロイ後の確認

デプロイ後は `DEPLOYMENT_CHECK.md` に記載された確認項目をチェックしてください：

- `/privacy` が正常にリダイレクトすること
- `/en/`, `/ja/` などの各言語ページが正常に表示されること
- 言語切り替えが正常に動作すること
- localStorage に言語選択が保存されること

## トラブルシューティング

### ローカル開発で `/en/` が表示されない

問題ありません。すべての言語が `/en/`, `/ja/` などの明示的なパスに配置されているため、ローカル開発でも正常に動作します。

### 言語選択が保存されない

- ブラウザのlocalStorageが有効か確認
- プライベート/シークレットモードでは無効になります

### プレースホルダーの確認

プレースホルダーが残っていないか確認：

```bash
rg "\[support_email\]|\[business_name\]" --type md --type mdx
```

すべてのプレースホルダーは実際の情報に置換済みです。

## ライセンス

このリポジトリは public です。秘密情報は置かないでください。

## 参考リンク

- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Documentation](https://docs.astro.build)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [App Codebase](https://github.com/ImadaRyugo/evenly-mobile)
