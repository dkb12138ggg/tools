# 实用工具集合（Utility Tools Website）

一个简洁、隐私优先的在线工具集合网站，基于 React + TypeScript + Vite + Ant Design 构建。所有数据处理均在浏览器本地完成，无需登录。

## 当前功能（MVP + 第二阶段 + 增强）
- JSON 格式化/压缩/校验，定位错误行列，一键复制
- URL 编码/解码，支持中文与特殊字符，支持按行批量处理
- URL 批量对照表与 CSV 导出
- Base64 文本编解码；文件编码为 DataURL，显示体积；URL 安全与去填充
- Base64 批量文本 编码/解码 与 CSV 导出
- 二维码生成：文本/URL/WiFi，纠错等级、尺寸可调；批量按行生成并逐个下载
- 二维码增强：前景/背景色预设与自定义，Logo 上传/圆角/尺寸调节；批量 ZIP 下载（PNG/JPG）
- Hash 生成器：MD5/SHA1/SHA256；文本与文件哈希；大小写切换；对比验证
- 响应式布局（桌面/移动），顶部导航，深色/浅色主题切换

## 快速开始
```bash
npm install
npm run dev
# 构建
npm run build && npm run preview
```

## 技术栈
- React 18 + TypeScript 5
- Vite 构建
- Ant Design 5（UI 组件）
- Redux Toolkit（主题等全局状态）
- 代码分割：重型页面懒加载（二维码/Base64/Hash）

## 目录结构
```
src/
  components/layout/   # 布局与导航
  pages/               # 各工具页面
  store/               # Redux store 与 slice
  utils/               # 通用工具函数
```

## 备注
- PWA Manifest 已配置；若需完整离线支持，可在生产环境中启用 `vite-plugin-pwa` 插件（当前为兼容本地构建暂未启用）。
- 后续计划：二维码生成、Base64 编解码、Hash 生成器、Web Workers 优化等（见 .claude/specs/）。
