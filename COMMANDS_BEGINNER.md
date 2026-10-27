# ポートフォリオサイトのコマンド操作マニュアル

この説明書は、Windowsのコマンドプロンプト（黒い画面）を使って、ポートフォリオサイトをローカルで表示し、Gitの設定を確認し、変更をGitHubへ送るための手順です。

## 最初に知っておくこと

- コマンドは、基本的にこのプロジェクトのフォルダーで実行します。
- `C:\Users\...>` のような表示はコマンドプロンプトの目印です。`>` より後ろだけを入力してください。
- コードブロック内の説明用の値は、そのまま入力せず、自分の値に置き換えてください。
- このプロジェクトは現在、VueではなくViteとnpmで動いています。Three.jsを追加する場合も、Vueへ移行しなくてもVite上で利用できます。

## 1. プロジェクトのフォルダーへ移動する

コマンドプロンプトを開き、次を入力します。

```cmd
cd /d "C:\Users\anfum\Documents\portfolio-ankoro"
```

`cd` はフォルダーを移動するコマンドです。`/d` は、必要な場合にドライブ（例：`C:`）も切り替えます。

いまいるフォルダーを確認するには、次を入力します。

```cmd
cd
```

表示に `portfolio-ankoro` が含まれていれば、このプロジェクトのフォルダーにいます。

## 2. Node.js・npm・Gitのバージョンを確認する

```cmd
node --version
npm --version
git --version
```

それぞれのバージョン番号が表示されれば、コマンドを使える状態です。`'node' は、内部コマンドまたは外部コマンド...'` のような表示が出る場合は、Node.jsまたはGitのインストールやPATH設定を確認してください。

## 3. サイトを自分のパソコンで表示する

### 初回セットアップ、または依存パッケージを入れ直すとき

```cmd
npm ci
```

`package-lock.json` に記録された内容に合わせて、必要なパッケージをインストールします。このプロジェクトでは、パッケージの実体は `node_modules` フォルダーに置かれます。

`npm ci` は既存の `node_modules` を作り直します。通常のサイト閲覧のたびに実行する必要はありません。新しい環境での初回セットアップや、依存関係を入れ直したいときに使います。

### 開発用サーバーを起動する

```cmd
npm run dev
```

コマンドプロンプトに `http://localhost:...` のURLが表示されます。そのURLをブラウザーで開くと、ローカルのサイトを確認できます。表示されるURLは端末の出力を使ってください。

サーバーを止めるときは、コマンドプロンプトを選んで `Ctrl` キーを押しながら `C` を押します。

### 公開用のビルドを確認する

まずビルドします。

```cmd
npm run build
```

成功すると、公開用ファイルが `dist` フォルダーに作られます。続けて、そのビルド結果をローカルで確認するには、次を実行します。

```cmd
npm run preview
```

こちらも、コマンドプロンプトに表示されたURLをブラウザーで開きます。終了するときは `Ctrl+C` を押します。

## 4. npmとロックファイル

このプロジェクトではnpmを使い、依存パッケージの記録を `package-lock.json` に保存しています。

| コマンド | 使う場面 |
| --- | --- |
| `npm ci` | ロックファイルどおりに、依存パッケージを入れ直す |
| `npm install パッケージ名` | 新しいパッケージをこのプロジェクトに追加する |
| `npm run dev` | 開発用サイトを起動する |
| `npm run build` | 公開用ファイルを作る |
| `npm run preview` | 公開用ファイルをローカルで確認する |

たとえばThree.jsを追加するときは、プロジェクトのフォルダーで次を実行します。

```cmd
npm install three
```

これにより `package.json` と `package-lock.json` が更新されます。変更をGitに記録するときは、通常この2つのファイルも一緒に記録します。`package-lock.json` は手で編集・削除せず、npmに管理させてください。

このプロジェクトはnpmで管理しているため、特別に移行を決めない限り、npmとpnpmを混ぜて使わないでください。pnpmはnpmの代わりに使える別のパッケージマネージャーで、使う場合はロックファイルも別になります。

## 5. Gitの接続先・ブランチ・作業状態を確認する

```cmd
git status
```

変更したファイルや、まだGitに追加していないファイルを確認します。

```cmd
git branch --show-current
```

現在作業中のブランチ名を確認します。

```cmd
git remote -v
```

GitHub上の接続先と接続方式を確認します。現在このプロジェクトの接続先はHTTPS形式です。

```text
https://github.com/Anna-SA2002/portfolio-ankoro.git
```

URLが `https://` で始まればHTTPS接続、`git@github.com:` で始まればSSH接続です。

## 6. コミットに記録される名前・メールアドレスを確認する

```cmd
git config user.name
git config user.email
```

これは**コミットの作者情報**です。GitHubへpushするときに認証するアカウントとは別の設定です。

どの設定ファイルから値を読んだかも確認できます。

```cmd
git config --show-origin --get user.name
git config --show-origin --get user.email
```

このリポジトリだけ私用の名前・メールアドレスにする場合は、次のように設定します。引用符の中は、ご自身のGitHub表示名と、GitHubに登録・確認済みのメールアドレスに置き換えてください。

```cmd
git config --local user.name "自分の名前"
git config --local user.email "自分のメールアドレス"
```

`--local` はこのリポジトリだけに適用する指定です。仕事用リポジトリなど、他のプロジェクトの設定は変更しません。

## 7. GitHubへpushするときに使うアカウントを確認する

Git Credential Manager（GCM）に保存されているGitHubアカウントを一覧表示します。

```cmd
git credential-manager github list
```

ここに表示されるのは、GCMが利用できるアカウントです。表示されただけでは、このリポジトリでどのアカウントが選ばれるかや、コミットの作者名までは分かりません。

このリポジトリでHTTPS認証に使うGitHubユーザー名を指定する例です。

```cmd
git config --local credential.https://github.com.username Anna-SA2002
```

設定値を確認します。

```cmd
git config --local --get credential.https://github.com.username
```

これは認証に使うアカウントの指定で、`user.name` / `user.email` の設定とは役割が違います。実際のpush時はGCMが保存済みの認証情報を使い、必要に応じてブラウザーでサインインを求めます。パスワードやトークンをリモートURLやコマンドに書かないでください。

## 8. 変更をコミットしてGitHubへ送る

変更したファイルを確認します。

```cmd
git status
```

Gitに記録するファイルを追加します。たとえば `index.html` だけを追加する場合は次のとおりです。

```cmd
git add index.html
```

`git add .` は現在のフォルダー以下の変更をまとめて追加します。意図しないファイルも含まれることがあるため、初心者のうちは `git status` で確認してから、必要なファイルを個別に追加してください。

コミット対象をもう一度確認します。

```cmd
git diff --cached
```

問題なければコミットします。メッセージは変更内容に合わせて書き換えます。

```cmd
git commit -m "コマンド操作マニュアルを追加"
```

GitHubへ送るコマンドは、すでに送信先ブランチが設定されていれば次のとおりです。

```cmd
git push
```

ブランチを初めてGitHubへ送る場合は、現在のブランチ名を `git branch --show-current` で確認してから、次の形で送ります。

```cmd
git push -u origin ブランチ名
```

たとえば、この説明書を作成した時点の作業ブランチは `main-update-2.0` です。自分の画面のブランチ名が異なる場合は、実際の表示に合わせてください。

## 9. GitHub Pagesへの公開について

このプロジェクトのGitHub Actions設定は、`main` ブランチへのpushで公開処理を開始します。別のブランチへpushしただけでは、通常は公開サイトに反映されません。

この説明書を作成した時点では、作業ブランチは `main-update-2.0` でした。ブランチをGitHubに送ることと、`main` に変更を反映してサイトを公開することは別の操作です。公開が目的の場合は、ブランチ名と変更内容を確認してから、GitHub上で `main` へのPull Requestを作成・マージするなど、リポジトリの手順に従ってください。

## 10. HTTPSとSSHの確認

現在の接続方式を調べるには、次を実行します。

```cmd
git remote -v
```

このリポジトリはHTTPS接続のため、push時の認証にはGCMを使えます。SSHへ切り替えるには、先にSSH鍵を作成してGitHubへ登録する必要があります。現状のHTTPS接続で問題なく使えているなら、SSH切り替えコマンドを実行する必要はありません。

## よく使うコマンド一覧

```cmd
cd /d "C:\Users\anfum\Documents\portfolio-ankoro"
git status
git branch --show-current
git remote -v
git config user.name
git config user.email
git credential-manager github list
npm ci
npm run dev
npm run build
npm run preview
```

## 公式資料

- [Git Credential Manager: 複数アカウントの使い分け](https://github.com/git-ecosystem/git-credential-manager/blob/main/docs/multiple-users.md)
- [Git公式ドキュメント: 認証情報の設定](https://git-scm.com/docs/gitcredentials)
- [Git公式ドキュメント: git config](https://git-scm.com/docs/git-config)
