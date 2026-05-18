# jsonit

URIフラグメント共有付き軽量JSONエディタ。

## ✨ Features

- CodeMirror 6によるシンタックスハイライト付きJSONエディタ
- リアルタイムバリデーション
- 内容をgzip圧縮してURIフラグメントに埋め込み、リンクで共有
- パスワード不要、サーバー不要、ブラウザ上で完結

## 🚀 Getting Started

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス。

## 📦 Scripts

| コマンド       | 説明                      |
|---------------|--------------------------|
| `npm run dev`   | ローカル開発サーバー起動 |
| `npm run build` | 本番ビルド               |
| `npm run preview` | ビルド結果のプレビュー   |
| `npm run test`  | テスト実行               |
| `npm run test:run` | テスト実行（一次性） |
