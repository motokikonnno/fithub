# FitHub
### 概要
エンジニア向けの筋トレ記録アプリ

## 目次
- [システム構成](#use-tech-1)
- [ER図](#use-tech-2)
- [使用技術](#use-tech-3)
- [ディレクトリ構成](#use-tech-4)

<h2 id="use-tech-1">システム構成</h2>

![FitHubシステム構成図](https://github.com/motokikonnno/fithub/assets/80935829/3ebed1df-703b-48fa-a96e-626bfe538e23)

<h2 id="use-tech-2">ER図</h2>

![FitHub_ER図](https://github.com/motokikonnno/fithub/assets/80935829/2af5048b-725f-4021-9799-7dc242e01cb4)

<h2 id="use-tech-3">使用技術</h2>

### フロントエンド
- Next.js(v.13.4)
- TypeScript 使用
- スタイリングは CSS Modules (Scss)
- SGとSSRを使用 

### サーバーサイド
- Prisma

### ストレージ
- firebaseStorage

### 認証
- NextAuth(Google,GitHubアカウント認証)

### ホスティング

- Vercel (フロントエンド)
- PlanetScale(データベース)

### 外部サービス
- SendGrid
- GoogleAnalytics4

<h2 id="use-tech-4">ディレクトリ構成</h2>

```
prisma/
public/
    ├─icons
src/
    ├─components
        ├─card
        ├─item
        ├─layouts
        ├─list
        ├─pages
    ├─hooks(カスタムフック)
    ├─lib(ライブラリ)
        ├─api
    ├─models(factory設置)
    ├─pages
        ├─api
        ├─invitation
        ├─repository
        ├─team
        ├─user
    ├─repositories(repository設置)
    ├─services(データ整形)
    ├─styles
        ├─components
          ├─card
          ├─item
          ├─layouts
          ├─list
          ├─pages
    ├─types
    ├─utils(共通で使用できる関数)
```
