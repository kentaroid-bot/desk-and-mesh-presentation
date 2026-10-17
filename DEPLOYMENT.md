# Cloudflare Pagesの配信設定

単体HTMLの静的配信としてCloudflare Pagesを使用します。独立プロジェクトで、`desk-mesh.monku.ai`だけをこのプロジェクトへ接続しています。

## 設定値

| 項目 | 値 |
|---|---|
| リポジトリ | `kentaroid-bot/desk-and-mesh-presentation` |
| Pagesプロジェクト | `desk-and-mesh-presentation` |
| Framework preset | None |
| Production branch | `main` |
| Build command | `python3 tools/build.py` |
| Build output directory | `dist` |
| Root directory | リポジトリルート |
| 必要な環境変数 | なし |

ビルドは公開ファイルを限定してコピーするだけです。Pagesの静的HTML配信を使用するため、Workerコード、Functions、wrangler設定は不要です。ヘッダーは `dist/_headers` に含め、毎回の再検証を許すキャッシュ設定にしています。404.htmlを置き、存在しないパスはスライドの別名として配信しません。

## 公開URL

[desk-mesh.monku.ai](https://desk-mesh.monku.ai/)

`og:url`とcanonical URLは上記URLにそろえます。Pages標準URL `https://desk-and-mesh-presentation.pages.dev/` も利用できます。

## 更新時の順序

1. 対象コミットのレビューを完了し、公開実施の承認を確認。
2. ローカルでビルド・検証し、レビュー済みの版をmainへ送信。
3. Pagesが上の設定でビルドし、対象コミットの配備成功を確認。
4. 発行URLで12枚の移動、ファビコン、404、ヘッダー、スマートフォン表示を再確認。
5. 独自ドメインを採用する場合は追加設定し、実URLをメタデータへ反映。

Git連携はmainの本番配備を有効にし、プレビューブランチ配備とPRコメントは無効にしています。ビルドはPagesが行い、GitHub Actionsや配備用の秘密情報はこのリポジトリに設定していません。

既存のmonku.ai等は別の配信構成として保持し、本サイトのビルドから操作しません。

## 公式資料

2026-10-17確認。

- [Static HTML](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)
- [Headers](https://developers.cloudflare.com/pages/configuration/headers/)
