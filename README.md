# HabitTracker

シンプルな習慣記録Webアプリ (PWA対応)

特徴:
- 5つの習慣 (順序固定): tennis, メリオール, 小田急使用, 英語学習, コナ散歩
- ボタンは文字無し。押下で「した」を記録（内部で 'x' を用いる）
- 週表示は1画面に1週間分、月曜始まり。土日は日付が赤。
- ローカルストレージに保存、ブラウザを閉じても記録は残る。
- 履歴一覧を別ビューで表示。履歴は月ごとのカラム表示、記録無い日も表示。
- export/import JSON機能 (export JSON / import JSON ボタン)
- レスポンシブ対応 (スマホでも見やすい)
- toISOString() を使わずローカル時刻で yyyy-mm-dd を生成
- PWA（manifest + simple service worker）
- GitHubへアップロード可能な構成

使い方:
1. `index.html` をブラウザで開く。PWA対応ブラウザならインストール可能。
2. export/import ボタンでJSONを保存・読み込み可能。

カラー定義（styles.cssの :root）:
- --color-today: #e6f7ff （今日の背景：淡いスカイブルー）
- --color-checked: #4caf50 （チェック済み：緑）
- --color-weekend: #ffe6e6 （土日の日付は赤み）
- --color-accent: #0066cc （アクセント：青）

---
このZIPにはすべてのファイルが含まれます。


## v2 changes
- 履歴表示を月ごとに表形式（table）で表示するように変更しました。
- JSONインポートは確認後、**完全上書き**（既存データは削除）する仕様に変更しました。
