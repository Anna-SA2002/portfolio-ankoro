# Portfolio Ankoro

このリポジトリのコマンド操作は、[初心者向けコマンド操作マニュアル](COMMANDS_BEGINNER.md)を参照してください。

## ローカルでの確認

プロジェクトのフォルダーで `npm ci` を実行してから、`npm run dev` を実行します。表示されたURLをブラウザーで開くと、ローカルのサイトを確認できます。

## 本番リリース

公開先: https://anna-sa2002.github.io/portfolio-ankoro/

1. 最新の `main` を作業ブランチへ取り込み、`npm ci`、`npm audit`、`npm run build` を実行します。
2. `npm run preview` で `/portfolio-ankoro/` 配下の各ページ、作品詳細、画像・動画、プレイリストの曲切り替えを確認します。PCとスマートフォンの幅で表示を確認してください。
3. 作業ブランチから `main` へのPull Requestを作成・マージします。`Deploy Vite site to GitHub Pages` がビルドと公開を実行します。
4. GitHub Actionsの成功と公開サイトへの反映を確認してリリース完了とします。

`dist/` はビルド生成物です。Gitには含めず、GitHub Actionsがロックファイルから生成した成果物を公開します。illustrationページは準備中の表示で公開しています。
