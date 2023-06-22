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
    ├─schema.prisma
public/
    ├─icons
src/
    ├─components
        ├─card
          ├─RepositoryCard.tsx
        ├─item
          ├─FileItem.tsx
          ├─FolderItem.tsx
          ├─IssueItem.tsx
          ├─RepositoryList.tsx
        ├─layouts
          ├─AppLayout.tsx
          ├─AuthGuard.tsx
          ├─Footer.tsx
          ├─Header.tsx
          ├─SideBar.tsx
        ├─list
          ├─DropDownList.tsx
          ├─PeopleList.tsx
          ├─RepositoryList.tsx
        ├─pages
          ├─CreateIssue.tsx
          ├─CreateRepository.tsx
          ├─CreateTeam.tsx
          ├─Dashboard.tsx
          ├─InviteConfirm.tsx
          ├─IssueDetail.tsx
          ├─IssueList.tsx
          ├─RepositoryDetail.tsx
          ├─SignIn.tsx
          ├─TeamList.tsx
          ├─TeamProfile.tsx
          ├─UserProfile.tsx
        ├─BreadCrumb.tsx
        ├─InputSearch.tsx
        ├─Loading.tsx
        ├─Modal.tsx
        ├─Pagination.tsx
        ├─PercentageBar.tsx
        ├─SEO.tsx
        ├─Tabs.tsx
        ├─Tiptap.tsx
    ├─hooks
        ├─useFetchActivity.ts
        ├─useFetchCount.ts
        ├─useFetchTeam.ts
        ├─useFetchUser.ts
        ├─useFetchPageView.ts
    ├─lib
        ├─api
          ├─activity.ts
          ├─calendeer.ts
          ├─commit.ts
          ├─count.ts
          ├─current-commit.ts
          ├─file.ts
          ├─folder.ts
          ├─invite.ts
          ├─issue.ts
          ├─mention.ts
          ├─repository.ts
          ├─send-grid.ts
          ├─team-member.ts
          ├─team.ts
          ├─user.ts
        ├─api-client.ts
        ├─firease.ts
        ├─gtag.ts
        ├─prisma.ts
        ├─storageUpload.ts
    ├─models
        ├─Activity.ts
        ├─Calender.ts
        ├─Commit.ts
        ├─Count.ts
        ├─CurrentCommit.ts
        ├─File.ts
        ├─Folder.ts
        ├─Invite.ts
        ├─Issue.ts
        ├─Mention.ts
        ├─Repository.ts
        ├─Team.ts
        ├─TeamMember.ts
        ├─User.ts
    ├─pages
        ├─api
          ├─activity
          ├─auth
          ├─calender
          ├─commit
          ├─count
          ├─current-commit
          ├─file
          ├─folder
          ├─invite
          ├─issue
          ├─mention
          ├─repository
          ├─team
          ├─team-member
          ├─user
        ├─invitation
        ├─repository
        ├─team
        ├─user
        ├─_app.tsx
        ├─_document.tsx
        ├─404.tsx
        ├─index.tsx
        ├─sign_in.tsx
    ├─repositories
        ├─ActivityRepository.ts
        ├─CalenderRepository.ts
        ├─CommitRepository.ts
        ├─CountRepository.ts
        ├─CurrentCommitRepository.ts
        ├─FileRepository.ts
        ├─FolderRepository.ts
        ├─InviteRepository.ts
        ├─IssueRepository.ts
        ├─MentionRepository.ts
        ├─RepositoryRepository.ts
        ├─TeamMemberRepository.ts
        ├─TeamRepository.ts
        ├─UserRepository.ts
    ├─services
        ├─ownerList.ts
        ├─recentSortRepository.ts
    ├─styles
        ├─components
          ├─card
            ├─RepositoryCard.module.scss
          ├─item
            ├─FolderWithFile.module.scss
            ├─IssueItem.module.scss
            ├─RepositoryItem.module.scss
          ├─layouts
            ├─AppLayout.module.scss
            ├─Footer.module.scss
            ├─Header.module.scss
            ├─SideBar.module.scss
          ├─list
            ├─DropDownList.module.scss
            ├─PeopleList.module.scss
            ├─RepositoryList.module.scss
          ├─pages
            ├─404.module.scss
            ├─CreateIssue.module.scss
            ├─CreateRepository.module.scss
            ├─CreateTeam.module.scss
            ├─Dashboard.module.scss
            ├─InviteConfirm.module.scss
            ├─IssueDetail.modules.scss
            ├─IssueList.module.scss
            ├─RepositoryDetail.module.scss
            ├─SignIn.module.scss
            ├─TeamList.module.scss
            ├─TeamProfile.module.scss
            ├─UserProfile.module.scss
          ├─BreadCrumb.module.scss
          ├─InputSearch.module.scss
          ├─Loading.module.scss
          ├─Modal.module.scss
          ├─Pagination.module.scss
          ├─PerventageBar.module.scss
          ├─Tabs.module.scss
          ├─Tiptap.module.scss
        ├─globals.scss
        ├─mixin.scss
    ├─types
        ├─auth-next-page.d.ts
        ├─http.ts
        ├─next-auth.d.ts
        ├─owner.ts
    ├─utils
        ├─changeBodyPerts.ts
        ├─getTime.ts
        ├─queries.ts
    ├─middleware.ts
```
