# AI4LA：景观设计 AI 工作流博客

这是一个可直接发布到 GitHub Pages 的 Astro 静态网站。包含首页、六个工作流程栏目、文章列表、文章详情和 About 页面。网站为黑白极简设计，支持手机与电脑阅读。六篇文章是**示例内容**，请在正式对外推广前替换或核查。

**第一次建站请先读 [START_HERE.md](START_HERE.md)。**它用 Windows 和 GitHub Desktop 的图形界面逐步说明解压、上传、预览、发布及绑定 Spaceship 域名。下面保留适合熟悉命令行的简版说明。

## 1. 需要准备什么

- 一个 GitHub 账号。
- 已在 Spaceship 购买的域名。本文用 `example.com` 示范，请替换成你自己的域名。
- 图形界面上传可用 GitHub Desktop；只在电脑上预览时才需要 Node.js 24 和 npm。下面的命令行上传方式另需 Git。

域名注册商和网站托管方可以不同。Spaceship 持有域名；GitHub 存放代码；GitHub Pages 托管构建好的网页。

## 2. 本地打开和修改

在本项目文件夹运行：

```bash
npm ci
npm run dev
```

终端会显示本地地址，通常为 `http://localhost:4321/`。修改文件后浏览器会自动刷新。正式构建：

```bash
npm run build
npm run preview
```

构建的网页保存在 `dist/`，不需要手动上传这个文件夹。

## 3. 项目结构

```text
src/
  content/articles/       每篇文章一个 Markdown 文件
  content.config.ts       文章字段规则
  data/stages.ts          六个栏目名称与说明
  layouts/Base.astro      公共页眉、页脚和元数据
  pages/                 首页、栏目、文章与 About
  styles/global.css      所有黑白样式
public/favicon.svg       浏览器图标
.github/workflows/deploy.yml  GitHub Pages 自动发布
```

### 添加文章

复制 `src/content/articles/site-notes.md` 并改名，例如 `shade-analysis.md`。修改文件最上方的字段和正文：

```md
---
title: "How to map shade on a campus"
description: "A practical workflow for comparing shade across walking routes."
stage: analysis
published: 2026-09-23
---

## What the task is

Write the article here.
```

`stage` 必须是 `research`、`analysis`、`concept`、`development`、`visualization` 或 `communication`。文件名会成为 URL，例如 `/articles/shade-analysis/`。更改栏目名称和说明用 `src/data/stages.ts`；更改标题和首页文字用 `src/pages/index.astro`。

## 4. 上传到 GitHub

1. 在 GitHub 新建一个**公开**仓库，比如 `ai4la-site`。不要勾选自动添加 README，以免第一次上传时产生冲突。
2. 在项目文件夹运行以下命令，替换你的 GitHub 用户名和仓库名：

```bash
git init
git branch -M main
git add .
git commit -m "Create AI4LA website"
git remote add origin https://github.com/YOUR-USERNAME/ai4la-site.git
git push -u origin main
```

GitHub 可能要求通过浏览器登录或使用个人访问令牌。不要把令牌写进项目文件。

3. 在 GitHub 仓库的 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。仓库已有 `.github/workflows/deploy.yml`，向 `main` 推送代码会自动安装、构建并发布。
4. 到 **Actions** 页面检查 `Deploy to GitHub Pages` 是否成功。

## 5. 绑定 Spaceship 域名

建议以根域名 `example.com` 为主，同时让 `www.example.com` 跳转到根域名。

1. 先在 GitHub 仓库 **Settings → Pages → Custom domain** 填 `example.com` 并保存。若 GitHub 提供域名所有权验证，按其给出的 TXT 记录完成验证。
2. 确认域名当前使用的 nameservers。如果仍由 Spaceship 管理 DNS，到 Spaceship 的 **Advanced DNS**；如果已经改用其他 DNS 服务，应在那里修改记录。
3. 在当前 DNS 管理平台添加以下记录。将 CNAME 的用户名换成你自己的 GitHub 用户名；不要在 CNAME 目标后添加仓库名。

| 类型 | 主机名 | 值 |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | YOUR-USERNAME.github.io |

如果 `@` 或 `www` 已有冲突的网站 A/CNAME 记录，应先核对再替换。保留邮件用的 MX、SPF、DKIM 等记录。不要创建 `*.example.com` 通配 CNAME。

4. 在 GitHub 仓库 **Settings → Secrets and variables → Actions → Variables** 添加 `SITE_URL`，值为 `https://example.com`。如果添加 `BASE_PATH`，值设为 `/`；不添加也默认为 `/`。
5. 到 **Actions** 手动运行 `Deploy to GitHub Pages` 一次，确保新网址写入网页的 canonical 链接。
6. 等 DNS 生效后，在 GitHub **Settings → Pages** 勾选 **Enforce HTTPS**。打开根域名和 `www`，确认其中一个会跳转到你指定的主域名。DNS 和 HTTPS 有时需要等待一段时间。

如果你暂时**只**在 `https://YOUR-USERNAME.github.io/ai4la-site/` 预览，尚未绑定自己的域名，设置 `SITE_URL=https://YOUR-USERNAME.github.io`，以及 `BASE_PATH=/ai4la-site/`，然后重新运行工作流。绑定自有域名后把两项改回上面的值。

> GitHub Actions 发布时无需在仓库里维护 `CNAME` 文件。自定义域名从 GitHub Pages 设置中配置。

## 6. 日常更新

编辑或新增 Markdown 文章 → 本地运行 `npm run build` → `git add .` → `git commit -m "Add article"` → `git push`。GitHub Actions 会发布更新。

## 官方参考

- [Astro：内容集合](https://docs.astro.build/en/guides/content-collections/)
- [Astro：部署到 GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [GitHub：配置自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Spaceship：DNS 管理](https://www.spaceship.com/blog/dd-dns-management-a-deep-dive/)
