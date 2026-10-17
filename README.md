# どこでもデスクとどこでもメッシュ

人間とAIの仕事場「どこでもデスク」と、仕事場同士をつなぐ中庭「どこでもメッシュ」を紹介する12枚のWebスライドです。役所の各課を入口に、全体図と一つの仕事を往復して説明します。

Agy Full Editionのデザイン・本文を収録しています。鳥羽市の実在課名を借りた説明用の仮例で、実際の導入事例や事務分掌を示すものではありません。

## 見る・操作する

**[スライドを開く](https://desk-mesh.monku.ai/)**

手元で開く場合：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

ブラウザで `http://127.0.0.1:8000/` を開きます。

- 前へ・次へ：画面のボタン、左右キー、PageUp / PageDown。Spaceでも次へ進めます。
- 最初・最後：Home / End。
- 全体図：専用ボタンで3枚目へ。
- テーマ：ライト / ダークを切り替えます。
- 全画面：操作ボタンを含めて表示します。再度ボタンを押すかEscで終了します。対応はブラウザによります。
- `#6` などのURL末尾で、任意のページを直接開けます。

狭い画面では縦にスクロールして読めます。ボタンやリンクにフォーカスがある間は、それぞれの通常のキーボード操作を優先します。

## ファイルと配信

編集する原本は `index.html`。JavaScriptや図を含む単体HTMLで、ビルド用のJavaScript依存パッケージはありません。Google FontsからInter / BIZ UDPGothicを読み込み、接続できない場合は端末のフォントで表示します。

```sh
python3 tools/build.py
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

`dist/` には公開用のHTML、ファビコン、404ページ、ヘッダー設定だけをコピーします。README・検証用ファイル・Git情報は配信対象に含めません。Cloudflare Pagesの設定は [DEPLOYMENT.md](DEPLOYMENT.md) を参照してください。

Cloudflare Pagesで配信します。GitHubの`main`へのpushでビルドと本番配備が起動します。

## 検証

[VALIDATION.md](VALIDATION.md) に確認範囲を記載しています。ブラウザ検証はPlaywrightをインストールした開発環境から `tests/browser.mjs` で再実行できます。成果物の表示にはPlaywrightは不要です。

## 関連資料

- [どこでもデスク](https://github.com/kentaroid-bot/Dokodemo-Desk)
- [どこでもメッシュ](https://github.com/kentaroid-bot/dokodemo-mesh)
- [思考と境界の探求](https://github.com/kentaroid-bot/boundaries-of-thought)

## ライセンス

[MIT License](LICENSE)。制作・構成：Kentaroid、Agy、Codex / Monku_AI contributors。参照先の文書や外部配信フォントには各提供元のライセンスが適用されます。
