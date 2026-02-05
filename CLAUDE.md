# CLAUDE.md — Evere 公式Webサイト & 法務ページ（App Store先行）

## 0) 目的
Evere（割り勘・精算アプリ）の App Store リリースに必要な「プライバシーポリシーURL」等を満たすため、
公式Webサイト（LP + ガイド + 法務ページ + サポート導線）を作成し、Cloudflare Pages で公開する。

**重要**
- このフェーズは **App Storeのみ**（Google Playは今は出さない。将来リリース予定）
- プライバシーポリシーは **公開URLで閲覧可能**（ログイン不要・地理制限なし）

---

## 1) すでに決まっている方針
### 技術
- サイト：**Astro + Starlight**
- ホスティング：**Cloudflare Pages**
- リポジトリ：アプリ本体とは別 repo で管理
  - GitHub repo：`evere-site`（public）
  - ローカル配置：`/Users/imada/projects/evere/site`
- アプリ本体はすでに：`/Users/imada/projects/evere/app`

### 多言語（ルーティング）
対応言語とルート（法務ページも同様に用意）：
- `ja`, `en`, `th`, `ko`, `zh-hans`, `zh-hant`

URL方針：
- 言語別ページ：
  - `/{lang}/privacy/`
  - `/{lang}/terms/`
  - `/{lang}/docs/...`
  - `/{lang}/support/`
  - `/{lang}/roadmap/`
  - `/{lang}/`（各言語トップ/LP）
- App Store登録用の共通入口：
  - `/privacy` → 端末言語の自動判定 + 手動切替 → `/{lang}/privacy/`へ誘導

フォールバック：
- 判定できない場合は **英語（en）** をデフォルト

---

## 2) Claude Code に依頼するタスク
### A) リポジトリ & ローカル準備
- repo を `/Users/imada/projects/evere/site` に clone 済みにする
- パッケージマネージャは npm か pnpm のどちらかに統一し、READMEに明記

### B) Astro + Starlight 初期化
- Starlight サイトを初期化
- `npm run build`（または pnpm 相当）で `dist` が生成されること
- 最低限のブランド設定（プレースホルダーでOK）
  - サイト名：Evere
  - タグライン（暫定）：Split bills easily across currencies.（後で変更可）

### C) 情報設計（ページ構成）
まず日本語は内容を作り込み、他言語はプレースホルダーでも良いが「ルートは必ず存在」させる：
- LP（トップ）
  - `/{lang}/`
- Docs（使い方ガイド）
  - `/{lang}/docs/` で基本構造を作成：
    - はじめに / Getting Started
    - 支払い追加
    - 分割モード（Equal / Ratio / Manual）
    - 精算（精算済みバッジ、snapshot / settlement_time の概念）
    - プロジェクト & 通貨
    - トラブルシュート / FAQ
- 法務
  - `/{lang}/privacy/`（プライバシーポリシー）
  - `/{lang}/terms/`（利用規約）
  - `/privacy`（共通入口：自動判定 + 手動切替）
- Support（FAQ優先→問い合わせ）
  - `/{lang}/support/`
  - 問い合わせは `mailto:[support_email]`（不明ならプレースホルダー）
- Roadmap / Feature Requests
  - `/{lang}/roadmap/`（GitHub Discussions/Issues へ誘導）
  - リンク：`[github_feature_request_url]`（不明ならプレースホルダー）

### D) 多言語UX
- ヘッダー/ナビ等に言語切替UIを設置（シンプルで分かりやすく）
- ナビ/サイドバーが全言語で破綻しないこと

### E) SEO（最小限）
- 可能な範囲で canonical / hreflang
- 基本のmeta/OGPプレースホルダー
- `robots.txt` と `sitemap` を壊さない

### F) Cloudflare Pages デプロイ前提
- Cloudflare Pagesで以下設定でデプロイできる状態にする：
  - Build command：`npm run build`
  - Output directory：`dist`
- READMEに「Cloudflare Pagesでのデプロイ設定」を明記

### G) commit & push
- `main` にコミットして push まで行う

---

## 3) プライバシーポリシー：必ず「事実抽出 → 文章化」（推測禁止）
### 大原則
**推測しない。**
収集データ、利用SDK、第三者提供先などは **コード/設定から確定できた事実だけ**を書く。

### 手順1 — 文章を書く前に Fact Sheet を作る
`docs/legal/fact-sheet.md`（等）を作成し、以下をまとめる：
- 収集・保存しているデータ種別（アプリ入力、識別子、ログ等）
- 利用目的
- 委託先/第三者（利用しているサービス一覧：確定分のみ）
- Push通知：使用しているか（削除した可能性があるので必ず確認）
- 課金/サブスク：使用しているか
- 分析/クラッシュ：使用しているか
- データ保持/削除：実装済みか、未実装か
- ユーザー権利（閲覧/削除等）：実装に基づく
- 問い合わせ窓口（不明ならプレースホルダー）
- 不明点/TODO（本文とは別枠）

**この Fact Sheet に載った内容だけを使って**、プライバシーポリシー本文を生成する。

### 手順2 — 事実確認の調査対象
#### アプリ側（ローカル）
パス：`/Users/imada/projects/evere/app`

最低限確認：
- `package.json`（導入SDKの有無）
  - Supabase関連
  - Push（`expo-notifications`等）
  - 課金（RevenueCat等）
  - 分析SDK
  - クラッシュ/エラー監視（例：Sentry等）
- `app.json` / `app.config.*` / Expo plugin設定
- Supabaseクライアント初期化・Auth方式（匿名/Apple/Google/メール等）
- 添付アップロード（Storage利用、EXIF除去等）
- 外部API（為替等：ExchangeRate-APIなど）
#### Web側（このrepo）
- Analytics/Cookie等は **入れていないなら書かない**
- 後で入れる場合は Fact Sheet を更新してからポリシー更新

### 手順3 — Fact Sheetから本文生成
- `/{lang}/privacy/` を6言語分作成
- 各言語の意味は揃える（固有名詞は一致）
- 「最終更新日」を必ず表示
- 不明点は本文に書かない（Fact SheetのTODOへ）

### 禁止例（やりがちなので注意）
- 「広告IDを収集します」などの断定（確認できないなら書かない）
- 「Sentry/GA/RevenueCat/Expo Pushを使っています」など（未確認なら書かない）
- 「今後導入予定」など未来の話（書かない）
- 秘密情報（キー/トークン）を本文やrepoにコミット（絶対NG）

---

## 4) 許容するプレースホルダー
後で人が埋める前提で、以下はプレースホルダー可：
- `[support_email]`
- `[business_name]`
- `[github_feature_request_url]`
- `[site_url_after_deploy]`

※ただし、値を勝手に作らない。必ずプレースホルダーのまま残す。

---

## 5) 成果物要件
完了時点で必須：
- 上記のルートが動く Astro + Starlight サイト
- `/privacy` 共通入口から言語別PPへ到達できる
- `fact-sheet.md` が先に作られている（本文より先）
- Cloudflare Pagesで `dist` 配信できる
- READMEに以下を明記：
  - ローカル起動
  - ビルド
  - Cloudflare Pagesデプロイ設定（build / dist）
  - 法務更新手順（Fact Sheet更新 → 本文更新）

---

## 6) 補足
- この repo は public。秘密情報は置かない。
- 目的は App Store 対応とユーザーの信頼確保。
- 見た目より「分かりやすさ」と「更新のしやすさ」を優先。
