# 把「剧学」发布到 GitHub Pages

这个项目是纯静态网站，不需要服务器、Node.js、数据库或构建命令。发布后，别人通过一个网址就能打开。

## 先理解一件事

GitHub 仓库有两种用途：

- GitHub 仓库：保存和展示全部代码。
- GitHub Pages：把仓库里的静态网站变成一个公开网址。

发布完成后的访问地址通常是：

```text
https://你的GitHub用户名.github.io/仓库名/
```

例如仓库叫 `juxue`：

```text
https://your-name.github.io/juxue/
```

## 上传时最重要的规则

GitHub Pages 最终应该以 `index.html` 所在位置作为站点根目录。

请把当前 `juxue` 文件夹“里面的”这些内容直接放到仓库根目录：

```text
index.html
styles.css
app.js
manifest.webmanifest
service-worker.js
assets/
start.ps1
README.md
DEPLOY.md
```

不要把仓库做成这样：

```text
仓库根目录/
└── outputs/
    └── juxue/
        └── index.html
```

否则 GitHub Pages 打开仓库根网址时找不到首页。若使用命令行的方式，只要先进入 `juxue` 文件夹再执行 Git 命令，就不会犯这个错误。

## 方式一：GitHub Desktop（最省事）

1. 登录 [GitHub](https://github.com)，点击右上角 `+` → `New repository`。
2. 仓库名填写 `juxue`，选择 `Public`，不要勾选自动创建 README，然后点击创建。
3. 安装并登录 [GitHub Desktop](https://desktop.github.com/)。
4. 在 GitHub Desktop 中选择 `File` → `Add local repository`。
5. 选择本机的 `outputs/juxue` 文件夹。
6. 如果它提示这不是 Git 仓库，点击 `create a repository`，保持文件夹为当前 `juxue` 目录。
7. 左下角填写一个提交说明，例如 `Launch Juxue MVP`，点击 `Commit to main`。
8. 点击顶部 `Publish repository`，取消 `Keep this code private`（免费账户发布 Pages 建议使用公开仓库），然后发布。

发布仓库后，按下面的“开启 GitHub Pages”操作。

## 方式二：PowerShell 命令

先在 GitHub 新建一个空仓库，例如：

```text
https://github.com/你的用户名/juxue
```

然后打开 PowerShell，逐行执行：

```powershell
cd "C:\Users\华为\Documents\Codex\2026-10-26\zu\outputs\juxue"

git config --global user.name "你的名字"
git config --global user.email "你的GitHub邮箱"

git init
git add .
git commit -m "Launch Juxue MVP"
git branch -M main

git remote add origin https://github.com/你的用户名/juxue.git
git push -u origin main
```

执行 `git push` 时，Windows 通常会弹出 GitHub 登录窗口。登录并授权后即可上传，不需要把密码或令牌发给任何人。

如果 `git remote add` 提示已经存在，可改用：

```powershell
git remote set-url origin https://github.com/你的用户名/juxue.git
git push -u origin main
```

## 开启 GitHub Pages

仓库上传成功后：

1. 打开 GitHub 仓库页面。
2. 点击 `Settings`。
3. 左侧点击 `Pages`。
4. 在 `Build and deployment` 下，把 `Source` 选为 `Deploy from a branch`。
5. `Branch` 选择 `main`，目录选择 `/(root)`。
6. 点击 `Save`。
7. 等待约 1–3 分钟，刷新页面，顶部会出现 `Visit site` 或公开网址。

以后修改本地文件后，再 `Commit` 并 `Push`，网站会自动更新。

## 把链接发给别人

发布后直接分享类似下面的网址：

```text
https://你的用户名.github.io/juxue/
```

手机也可以用这个网址打开。使用 Chrome、Edge 或 Safari 的“添加到主屏幕 / 安装应用”后，它会更像独立应用。

## 需要提前知道的限制

- GitHub Pages 是公开静态网站，任何拿到链接的人都能访问网页代码。
- 当前版本的收藏、笔记、偏好只保存在每个用户自己的浏览器里，不会上传到 GitHub。
- 不同手机、电脑或浏览器之间目前不会自动同步。
- 用户清除浏览器网站数据后，本地词库也会被清除；可先用应用里的“导出数据”备份。
- 想实现账号登录、跨设备同步或付费功能时，需要另外接入后端服务，GitHub Pages 本身做不到。

## 常见问题

### 打开后是 404

检查仓库根目录是否直接存在 `index.html`，以及 Pages 分支是否选择 `main`、目录是否为 `/(root)`。

### 页面样式丢失

确认 `styles.css`、`app.js` 和整个 `assets` 文件夹已经上传到仓库，并且相对位置没有改变。

### 修改后网址没变

先确认 GitHub Desktop 或命令行已经成功 Push。浏览器可强制刷新 `Ctrl + F5`，GitHub Pages 也可能需要等待几分钟。
