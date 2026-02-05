# Evere Privacy Policy - Fact Sheet

**最終更新**: 2025-02-03
**調査対象**: `/Users/imada/projects/evere/app/apps/mobile`

---

## 1. 収集・保存しているデータ

### 1.1 アカウント情報
- **ユーザーID**: Supabase Auth（UUID）
- **認証方法**:
  - 匿名認証（Guest）
  - Apple Sign In（Apple ID）
  - Google Sign In（Google アカウント）
  - メール/パスワード
  - Link Identity（匿名→メール昇格）
- **プロフィール情報**:
  - 表示名（display_name）
  - アクセントカラー（accent_color）
  - Pro ステータス（is_pro）
  - オンボーディング完了フラグ（has_onboarded）

**保存先**: Supabase Postgres (`profiles` テーブル)

### 1.2 プロジェクト・支払いデータ
- **プロジェクト情報**:
  - プロジェクト名
  - 基準通貨
  - 参加者名リスト
  - 精算状態
- **支払い情報**:
  - タイトル
  - 金額・通貨
  - カテゴリ
  - 支払日
  - メモ
  - 分割モード（Equal/Ratio/Manual）
  - 分割金額・比率
  - レシート画像（任意）
  - 精算状態

**保存先**: Supabase Postgres (`projects`, `expenses`, `expense_splits`, `members` テーブル)

### 1.3 画像データ
- **レシート画像**:
  - 圧縮処理: 最大幅1920px、JPEG圧縮率0.8
  - EXIF情報: JPEG形式での保存により自動的に除去
  - 保存先: Supabase Storage（private bucket: `expense-receipts`）
  - オフライン時: ローカルファイルシステム（一時保存）

**処理**: `expo-image-manipulator` によるリサイズ・圧縮

### 1.4 デバイストークン（Push通知用）
- **収集データ**:
  - Expo Push Token
  - プラットフォーム（iOS/Android/Web）
  - ユーザーID
  - 通知有効化フラグ（push_enabled）

**保存先**: Supabase Postgres (`device_tokens` テーブル)
**実装**: `expo-notifications`, `expo-device`

### 1.5 ローカルキャッシュ（オフライン用）
- **SQLite（端末内）**:
  - 為替レートキャッシュ（TTL: 70分）
  - 支払いデータ（オフライン同期用）
- **AsyncStorage（端末内）**:
  - 認証セッション（Supabase Auth）

---

## 2. データの利用目的

1. **サービス提供**:
   - 割り勘・精算機能の提供
   - マルチ通貨換算（為替レート）
   - プロジェクト共有・招待機能
   - オフライン対応（ローカルキャッシュ）

2. **認証・アクセス制御**:
   - ユーザー認証（匿名/Apple/Google/メール）
   - プロジェクトへのアクセス権限管理

3. **通知**:
   - プロジェクト招待通知
   - 支払い追加通知
   - （実装状況: コードに実装済み）

4. **エラー監視・クラッシュレポート**:
   - Sentry によるエラー追跡
   - パフォーマンス監視
   - セッションリプレイ（エラー発生時: 100%、通常セッション: 10%）

5. **課金・サブスク管理**:
   - RevenueCat によるアプリ内課金（Pro 機能）
   - （注: 現在APIキーがプレースホルダーのため、実際の運用開始前に要確認）

6. **広告配信**:
   - Google AdMob（バナー広告、インタースティシャル広告）
   - コンテンツレーティング: G（全年齢対象）

---

## 3. 委託先・第三者サービス

### 3.1 バックエンド・インフラ
- **Supabase** (米国):
  - 認証（Auth）
  - データベース（Postgres）
  - ストレージ（Storage）
  - Edge Functions
  - Realtime
  - 役割: サービスの中核基盤

### 3.2 エラー監視・分析
- **Sentry** (米国):
  - クラッシュレポート
  - エラー追跡
  - パフォーマンス監視
  - セッションリプレイ
  - 役割: アプリ品質向上

### 3.3 Push通知
- **Expo Push Notification Service** (米国):
  - Push通知配信
  - 役割: プロジェクト招待・更新通知

### 3.4 課金
- **RevenueCat** (米国):
  - アプリ内課金管理
  - サブスク状態同期
  - 役割: Pro 機能の提供
  - （注: 現在設定中、運用開始前に要確認）

### 3.5 広告配信
- **Google AdMob** (米国):
  - バナー広告配信
  - インタースティシャル広告配信
  - 役割: 無料版の収益化

### 3.6 外部API
- **ExchangeRate-API**:
  - 為替レート取得
  - アクセス方法: Supabase Edge Function 経由
  - 更新頻度: 1時間に1回（Supabase Cron）
  - キャッシュTTL: 70分

### 3.7 OAuth認証プロバイダ
- **Apple** (Sign in with Apple)
- **Google** (Google Sign-In)

---

## 4. データ保持・削除

### 4.1 データ保持期間
- **アクティブユーザー**: 無期限（サービス利用中）
- **非アクティブユーザー**: （未定義・TODO）
- **オフラインキャッシュ**:
  - 為替レート: 70分
  - 支払いデータ: 同期完了後削除

### 4.2 データ削除
- **アカウント削除機能**: 未確認（TODO: 実装状況を確認）
- **プロジェクト削除**: 未確認（TODO: 実装状況を確認）
- **レシート画像削除**: 実装済み（`deleteExpenseImage` 関数）

---

## 5. ユーザーの権利

### 5.1 アクセス権
- データ閲覧: アプリ内で可能
- データエクスポート: 未確認（TODO: 実装状況を確認）

### 5.2 修正権
- プロフィール編集: 実装済み
- 支払い編集: 実装済み

### 5.3 削除権
- 個別支払い削除: 実装済み
- アカウント削除: 未確認（TODO: 実装状況を確認）

### 5.4 通知設定
- Push通知の有効化/無効化: 実装済み
- デバイストークン削除: 実装済み

---

## 6. セキュリティ

### 6.1 通信
- HTTPS通信: ○（Supabase, Sentry, ExchangeRate-API）
- タイムアウト設定: 10秒（Supabase）

### 6.2 アクセス制御
- Row Level Security (RLS): ○（Supabase Postgres）
  - オーナーまたはメンバーのみがプロジェクトにアクセス可能
- Private Storage Bucket: ○（レシート画像）
  - 署名付きURL（有効期限: 1時間）

### 6.3 画像処理
- EXIF除去: ○（JPEG形式での保存により自動）
- 圧縮: ○（最大幅1920px、圧縮率0.8）

---

## 7. Cookie・トラッキング

### 7.1 Webサイト（本サイト）
- **未実装**: 現在は Cookie・Analytics なし
- （TODO: 将来導入する場合は Fact Sheet 更新）

### 7.2 モバイルアプリ
- **広告識別子**: Google AdMob が使用する可能性あり（確認必要）
- **Analytics SDK**: 未実装（TanStack Query はローカルのみ）

---

## 8. 対象年齢・児童対応

- **コンテンツレーティング**: G（全年齢対象）
- **COPPA対応**: `tagForChildDirectedTreatment: false`（AdMob設定）
- **年齢制限**: 特に設定なし（TODO: App Store / Google Play 登録時に確認）

---

## 9. 問い合わせ窓口

- **メール**: [support_email] (TODO: 実際のメールアドレスを設定)
- **GitHub Issues**: [github_feature_request_url] (TODO: 実際のURLを設定)

---

## 10. 不明点・TODO

### 調査が必要な項目
1. **アカウント削除機能**: 実装されているか？
2. **データエクスポート機能**: 実装されているか？
3. **非アクティブユーザーのデータ保持期間**: 定義されているか？
4. **Google AdMob の広告識別子**: 実際に収集されているか？（コード上は設定されているが、運用実態を確認）
5. **RevenueCat の運用状況**: APIキーがプレースホルダーのため、実際の運用開始時期を確認
6. **App Store / Google Play のプライバシー質問票**: 登録時に追加で必要な情報があるか？

### プレースホルダー（本文では使用禁止）
- `[support_email]`: サポートメールアドレス
- `[business_name]`: 事業者名（個人/法人）
- `[github_feature_request_url]`: GitHub リポジトリURL
- `[site_url_after_deploy]`: デプロイ後のサイトURL

---

## 11. 調査対象ファイル（参照）

- `apps/mobile/package.json`: 依存SDK一覧
- `apps/mobile/app.config.ts`: Expo設定、プラグイン
- `apps/mobile/lib/supabase.ts`: Supabase初期化
- `apps/mobile/lib/sentry.ts`: Sentry初期化
- `apps/mobile/lib/billing.ts`: RevenueCat設定
- `apps/mobile/lib/admob.ts`: AdMob設定
- `apps/mobile/lib/notifications.ts`: Push通知実装
- `apps/mobile/lib/storage/uploadImage.ts`: 画像処理
- `apps/mobile/lib/api/fx.ts`: 為替API
- `apps/mobile/lib/auth/`: 認証関連
- `apps/mobile/app/(auth)/sign-in.tsx`: サインイン画面
- `apps/mobile/app/(auth)/link-email.tsx`: メール昇格画面

---

**注意**: このFact Sheetは、プライバシーポリシー本文を作成する前の調査結果をまとめたものです。本文には**確認できた事実のみ**を記載し、推測や未来の予定は記載しないでください。
