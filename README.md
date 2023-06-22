# FitHub
### 概要
エンジニア向けの筋トレ記録アプリ

### 目的
エンジニアが運動習慣を取り入れやすくするため

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

### 外部サービス
- SendGrid
- firebaseStorage(画像保存先)
- GoogleAnalytics4

### 認証
- NextAuth(Google,GitHubアカウント認証)

### ホスティング

- Vercel (フロントエンド)
- PlanetScale(データベース)

<h2 id="use-tech-4">ディレクトリ構成</h2>
