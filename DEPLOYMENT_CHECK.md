# デプロイ後確認手順

Cloudflare Pagesにデプロイ後、以下のURLが期待通り動作するか確認してください。

## 修正内容のサマリー

### 変更点
- **全言語を明示的なパスに配置**: 英語版も `/en/` サブディレクトリに移動
- **言語選択の保存**: localStorageで選択した言語を保存し、次回訪問時に優先
- **リダイレクトページの改善**: `/privacy` と `/terms` がlocalStorage優先で動作

### URL構造
- `/privacy` → リダイレクトページ（保存言語 > ブラウザ言語 > 英語）
- `/en/privacy/` → 英語版コンテンツ（リダイレクトなし）
- `/ja/privacy/` → 日本語版コンテンツ（リダイレクトなし）
- 他の言語も同様

## 必須確認項目

### 1. 言語選択の保存・優先順位

**初回アクセス（localStorage未設定）:**
```
/privacy → ブラウザ言語に応じて /ja/privacy/ または /en/privacy/ などにリダイレクト
```

**言語切り替え後（localStorage設定あり）:**
1. `/ja/privacy/` にアクセス（日本語を選択）
2. `/privacy` にアクセス → `/ja/privacy/` にリダイレクト（保存された言語が優先）
3. 言語切り替えUIで「English」を選択 → `/en/privacy/` に移動
4. `/privacy` にアクセス → `/en/privacy/` にリダイレクト（保存された言語が優先）

### 2. 各言語ページの直接アクセス

各言語ページに直接アクセスして、リダイレクトされずに表示されることを確認：
```
/en/privacy/ (英語) - リダイレクトなしで表示
/ja/privacy/ (日本語) - リダイレクトなしで表示
/ko/privacy/ (韓国語) - リダイレクトなしで表示
... など
```

### 3. JavaScript無効時

```
/privacy → /en/privacy/ にリダイレクト（noscript meta refreshによる）
/terms → /en/terms/ にリダイレクト
```

## App Store / Google Play用URL

**推奨（共通入口）:**
- Privacy Policy: `https://your-domain.pages.dev/privacy`
- Terms of Service: `https://your-domain.pages.dev/terms`

**直リンク（特定言語）:**
- English: `https://your-domain.pages.dev/en/privacy/`
- Japanese: `https://your-domain.pages.dev/ja/privacy/`

## localStorage確認方法

開発者ツール（F12） > Application > Local Storage で `evere_preferred_lang` の値を確認

## トラブルシューティング

### 言語選択が保存されない
- JavaScriptが有効か確認
- プライベート/シークレットモードではlocalStorageが無効

### 常に特定言語にリダイレクトされる
- localStorageをクリア: `localStorage.removeItem('evere_preferred_lang')`
