# daily-journal-with-ai-reflection

このアプリはElectronとTypeScriptで作成された簡易日記アプリです。日記を入力しローカルに保存し、OpenAI APIを使った振り返り分析を行うことを想定しています。

## 起動方法

1. 依存パッケージをインストールします。
   ```bash
   npm install
   ```
2. TypeScriptをビルドします。
   ```bash
   npm run build
   ```
3. アプリを起動します。
   ```bash
   npm start
   ```

Electronが起動し、テキストエリアに日記を入力して「保存」ボタンを押すと、ユーザーデータフォルダーに日付ごとのテキストファイルとして保存されます。
