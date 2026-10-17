# Cloudflare Pagesへの配信準備

単体HTMLの静的配信としてCloudflare Pagesを選定。アカウント、DNS、既存サイトへの変更はまだ行っていません。

## 設定値

| 項目 | 値 |
|---|---|
| リポジトリ候補 | `kentaroid-bot/desk-and-mesh-presentation` |
| Framework preset | None |
| Production branch | `main` |
| Build command | `python3 tools/build.py` |
| Build output directory | `dist` |
| Root directory | リポジトリルート |
| 必要な環境変数 | なし |

ビルドは公開ファイルを限定してコピーするだけです。Pagesの静的HTML配信を使用するため、Workerコード、Functions、wrangler設定は不要です。ヘッダーは `dist/_headers` に含め、毎回の再検証を許すキャッシュ設定にしています。404.htmlを置き、存在しないパスはスライドの別名として配信しません。

## URL候補

- `desk-and-mesh.pages.dev`：Pagesプロジェクト名の候補。利用可能性はプロジェクト作成時に確認。
- `presentation.dokodemodesk.monku.ai`：独自ドメインの候補。本人の選択後、Cloudflareで対応するDNSと証明書を設定。

どちらも未取得・未配備です。実URLが確定してから `og:url` とcanonical URLを追加します。OGPのタイトル・概要・言語は準備済みです。

## 公開時の順序

1. 対象コミットのレビューを完了し、公開実施の承認を確認。
2. GitHubリモートを新規作成し、レビュー済みの版を送信。
3. Pagesとリポジトリを接続し、上の設定でビルド。
4. 発行URLで12枚の移動、ファビコン、404、ヘッダー、スマートフォン表示を再確認。
5. 独自ドメインを採用する場合は追加設定し、実URLをメタデータへ反映。

Git連携を有効にすると対象ブランチへのpushが配備を起動します。プレビューブランチの配備範囲も公開作業時に確認します。このリポジトリに自動配備用のCIは設定していません。

既存のmonku.ai等は別の配信構成として保持し、本サイトのビルドから操作しません。

## 公式資料

2026-10-17確認。

- [Static HTML](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)
- [Headers](https://developers.cloudflare.com/pages/configuration/headers/)
