# 从零开始：在 Windows 发布 AI4LA 网站

本说明假设你使用 Windows 电脑，域名已在 Spaceship 购买。页面上出现的 `YOUR-USERNAME`、`example.com` 都只是占位符，必须替换为你的 GitHub 用户名和实际域名。**六篇现有文章是示例内容**，正式宣传前请自行检查或替换。

## 一、先认识三个东西

- **Spaceship**：你购买域名的地方。例如 `ai4la.net` 是网址，不包含网站文件。
- **GitHub**：存放网站源代码的地方。“仓库”（repository）可以理解为网上的项目文件夹。
- **GitHub Pages**：把 GitHub 上的代码变成可访问网页的服务。这个项目已经附带自动发布文件。

你会看到几个术语：

- **Node.js**：运行网页开发工具的软件。
- **npm**：随 Node.js 安装的包管理工具。它帮你下载网站项目所需的程序，并运行项目预设的命令。
- **Astro**：这个网站使用的建站程序。
- **终端／命令提示符**：可以输入命令的黑色或白色文字窗口。命令在这里输入，不是在浏览器地址栏里输入。

**发布网站可以先不在电脑上安装 Node.js，也不用运行 npm。**GitHub 的自动发布流程会替你构建网站。想在自己电脑上预览和编辑时，再完成第五部分。

## 二、下载并解压

1. 下载 `AI4LA_site_source.zip`，通常会出现在 Windows 的“下载”文件夹。
2. 在文件资源管理器中右键这个 ZIP → **全部解压缩 / Extract All** → 选择容易找到的位置（例如“文档”）→ **提取**。
3. 打开解压出的文件夹。你应该能直接看到 `README.md`、`package.json`、`astro.config.mjs`，以及 `src`、`public`、`.github` 等文件夹。如果首先看到另一层同名文件夹，就再打开一层。
4. 这里称这个文件夹为“源码文件夹”。不要把 ZIP 本身当作网站上传。

> Windows 通常能看到以点开头的 `.github` 文件夹。如果没看到，检查文件资源管理器的 **查看 → 显示 → 隐藏的项目**。发布流程依赖其中的 `.github/workflows/deploy.yml`。

## 三、用 GitHub Desktop 上传（无需输入 Git 命令）

1. 注册或登录 [GitHub](https://github.com/)。
2. 从 [GitHub Desktop 官网](https://desktop.github.com/)安装并打开 GitHub Desktop，用同一个 GitHub 账号登录。
3. 先确认你的 **GitHub 用户名**：打开 GitHub 网站，点击右上角头像，进入个人主页；网址 `github.com/` 后面的部分就是用户名。它不一定和显示名称相同。
4. 在 GitHub Desktop 选 **File → New repository**。在 **Name** 输入 `YOUR-USERNAME.github.io`，把 `YOUR-USERNAME` 换成刚查到的用户名。例如用户名为 `xiaoyu123`，仓库名就输入 `xiaoyu123.github.io`。大小写与用户名保持一致。
5. 在 **Local path** 选择一个方便找的位置，例如“文档”。点击 **Create repository**。程序会在该位置创建一个同名文件夹。不要勾选自动生成 README；已有源码自带 README。
6. 用文件资源管理器分别打开“源码文件夹”和 GitHub Desktop 刚创建的“仓库文件夹”。按 **Ctrl+A** 选中源码文件夹里面的所有内容，再按 **Ctrl+C**；到仓库文件夹按 **Ctrl+V**。要复制的是**文件夹里面的内容**，使仓库根目录直接看到 `package.json` 和 `src`，而不是把整个源码文件夹塞进去。
7. 回到 GitHub Desktop，在左侧 **Changes** 核对能看到 `package.json`、`src/...` 和 `.github/workflows/deploy.yml`。如果看不到 `deploy.yml`，先检查上一步是否复制完整。
8. 左下角 **Summary** 输入 `Create AI4LA site` → 点击 **Commit to main**。如果显示的分支名称不是 `main`，也可以点击显示的 **Commit to ...**；下一步的发布流程预设使用 `main`，请在 Desktop 的 **Current branch** 确认切到 `main` 后再继续。
9. 点击顶部 **Publish repository**，取消勾选 **Keep this code private**，点击 **Publish Repository**。GitHub Pages 在 GitHub 免费账户上可使用公开仓库。
10. 在 GitHub Desktop 选 **Repository → View on GitHub**。浏览器中能看到你的代码，即说明上传成功。

若你已有同名的 `YOUR-USERNAME.github.io` 仓库，不要覆盖它。改用其他仓库名，并参考根目录 `README.md` 中的 `BASE_PATH` 设置，或先确认现有仓库是否可以用于本网站。

## 四、先用 GitHub 地址发布和检查

1. 打开刚才的 GitHub 仓库网页，点上方 **Settings**。
2. 左侧菜单点 **Pages**。在 **Build and deployment → Source** 选择 **GitHub Actions**。本项目已经包含发布流程，无须选择 GitHub 建议的其他模板。
3. 回到仓库顶部 **Actions**。左侧选 **Deploy to GitHub Pages**，点击 **Run workflow**，选择 `main`，再点击运行按钮。如果刚上传代码就自动开始运行，不需要重复触发。
4. 等任务出现绿色勾号，再到 **Settings → Pages** 查看网站地址。按上述仓库名称，地址通常是 `https://YOUR-USERNAME.github.io/`。点击并检查首页、六个栏目和文章页。

如果任务是红色叉号，打开该次运行记录，查看哪一步报错。尤其检查仓库根目录是否有 `package.json` 和 `.github/workflows/deploy.yml`。不要把 ZIP 文件或外层源码文件夹直接放在仓库根目录。

## 五、可选：在自己电脑预览，理解 npm 命令

如果只想先上线，跳到第六部分。下面是想在电脑上编辑网站时的操作。

1. 打开 [Node.js 官网下载页](https://nodejs.org/en/download)。在 Windows 上下载 **Node.js 24 LTS 的 Windows Installer (.msi)**，按安装程序默认选项完成安装。安装后关闭已打开的终端窗口，再重新打开。
2. 用文件资源管理器打开第三部分创建的**仓库文件夹**。确保这里能直接看到 `package.json`。
3. 点击文件资源管理器顶部的**地址栏**，输入 `cmd`，按回车。会出现“命令提示符”窗口，其光标所在位置就是该文件夹。不需要输入 `cd`。
4. 逐行输入以下命令，每行按一次回车：

```bat
node -v
npm -v
npm ci
npm run dev
```

前两行显示版本号，说明安装成功。`npm ci` 会按 `package-lock.json` 下载所需程序到 `node_modules` 文件夹，第一次可能需要几分钟。`npm run dev` 会启动**仅供你电脑预览**的网站，并在窗口显示一个 `Local:` 地址，通常是 `http://localhost:4321/`。把终端里显示的实际地址复制到浏览器打开。

5. 预览期间，命令提示符窗口要保持打开。结束预览时回到该窗口，按 **Ctrl+C**，若出现 `Terminate batch job (Y/N)?`，输入 `Y` 并按回车。
6. 想检查正式构建是否成功，重新在同一文件夹打开 `cmd`，运行：

```bat
npm run build
```

它会生成 `dist` 文件夹。GitHub 发布时会自行构建，**不要手动把 `node_modules` 或 `dist` 上传到仓库**；项目里的 `.gitignore` 会忽略它们。

如果显示 `'npm' is not recognized`，通常是 Node.js 尚未安装好或终端在安装前就已打开。重新打开 `cmd` 并运行 `node -v`；仍不成功则检查 Node.js 安装。若显示找不到 `package.json`，说明当前不在正确的项目文件夹。

## 六、把 Spaceship 域名接上

这里以 `example.com` 为例；操作时替换成你自己买的域名。

1. 先到 GitHub 仓库 **Settings → Pages → Custom domain**，填 `example.com` 并点击 **Save**。若 GitHub 提示验证域名所有权，按界面给出的 TXT 记录完成验证。
2. 到 Spaceship 检查域名使用的 nameservers。如果仍由 Spaceship 管理 DNS，打开该域名的 **Advanced DNS**。如果你以前把 nameservers 换到 Cloudflare 等服务，应到当前 DNS 服务中加记录。
3. 添加以下五条记录：

| 类型 | 主机名 | 值 |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | YOUR-USERNAME.github.io |

四条 A 记录的 `@` 都指向根域名。CNAME 后面写你真正的 GitHub 用户名，**不加 `https://` 和仓库名**。若 `@` 或 `www` 已有指向旧网站的冲突记录，检查后替换；邮件相关的 MX/TXT 等记录应保留。

4. GitHub 仓库中打开 **Settings → Secrets and variables → Actions → Variables**，点 **New repository variable**。名称填 `SITE_URL`，值填 `https://example.com`（替换为你的真实域名）。`BASE_PATH` 不需要添加，因为这个特殊命名的仓库使用网站根目录。
5. 到 **Actions → Deploy to GitHub Pages → Run workflow**，重新运行一次。等待成功。
6. DNS 生效后在 **Settings → Pages** 开启 **Enforce HTTPS**。检查 `https://example.com` 和 `https://www.example.com`；其中一个应跳转到你在 Custom domain 中选的主域名。DNS 和证书设置可能不会立即完成。

## 七、以后怎样发布新文章

1. 在仓库文件夹打开 `src/content/articles`，复制一篇现有的 `.md` 文章并给新文件一个简短英文文件名，例如 `shade-analysis.md`。
2. 用记事本或 VS Code 打开，修改文件开头的 `title`、`description`、`stage`、`published` 和正文。注意保留开头和结尾的 `---`。例如：

```md
---
title: "Mapping shade along a walking route"
description: "A step-by-step workflow for evaluating summer shade."
stage: analysis
published: 2026-09-24
---

## The question

Write your article here.
```

3. `stage` 只能填写 `research`、`analysis`、`concept`、`development`、`visualization`、`communication` 之一。保存文件。
4. 回到 GitHub Desktop，输入 Summary（例如 `Add shade article`）→ **Commit to main** → **Push origin**。到 GitHub **Actions** 看绿色勾号；成功后网页会更新。

如果只想改首页文字，文件是 `src/pages/index.astro`；想改黑白排版，文件是 `src/styles/global.css`；想改栏目名称，文件是 `src/data/stages.ts`。

## 官方说明

- [Node.js 下载](https://nodejs.org/en/download)
- [GitHub Desktop 创建和发布仓库](https://docs.github.com/en/desktop/overview/creating-your-first-repository-using-github-desktop)
- [GitHub Pages 使用 GitHub Actions 发布](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub Pages 绑定域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
