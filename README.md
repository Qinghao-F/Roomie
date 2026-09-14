# Roomie 首页版本 v1

这是 Roomie 当前可交互首页的完整、独立项目。网页运行所需的源码、配置和图片都在本文件夹内；不会引用上一级 `素材` 文件夹。

## 在线访问

GitHub Pages：<https://qinghao-f.github.io/Roomie/>

## 目录约定

- `src/`：React 页面、交互和样式。
- `public/assets/`：页面使用的全部首页素材，按「第一批_核心素材」与「第二批_装饰与功能素材」分类。
- `package.json`、`package-lock.json`、`vite.config.mjs`：本地开发和构建配置。

图片地址统一通过 Vite 的站点基础路径生成：开发环境为 `./assets/...`，部署到 GitHub Pages 的仓库子路径时也会正确解析；不使用电脑上的 `/Users/...` 文件路径。

## 独立运行

在本文件夹内执行：

```bash
npm ci
npm run dev
```

构建静态部署文件：

```bash
npm run build
```

构建结果位于 `dist/client/`。`node_modules/` 和 `dist/` 都是可再生目录，不需要提交到 Git。
