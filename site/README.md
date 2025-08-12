# 🛠️ 实用工具集合

> 一个简洁、隐私优先的在线工具集合网站，所有数据处理均在浏览器本地完成，无需登录。

[中文](README.md) | [English](README_EN.md)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-purple)](https://vitejs.dev/)

## ✨ 核心功能

### 📝 文本处理工具
- **JSON 格式化器** - 格式化、压缩、校验JSON，精准定位错误位置
- **URL 编解码器** - 支持中文与特殊字符，批量处理，CSV导出
- **Base64 编解码** - 文本/文件编码，DataURL生成，批量处理

### 🔐 安全工具
- **Hash 生成器** - MD5/SHA1/SHA256，支持文本与文件，对比验证
- **二维码生成器** - 文本/URL/WiFi，自定义样式，批量生成ZIP下载

### 🎨 界面特性
- 📱 完全响应式设计（桌面/移动端适配）
- 🌙 深色/浅色主题切换
- 🚀 PWA支持，可离线使用
- 🔒 隐私优先，所有处理本地完成

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
访问 `http://localhost:5173` 查看应用

### 生产构建
```bash
npm run build
npm run preview
```

### 代码检查
```bash
npm run lint
```

## 🏗️ 技术架构

### 核心技术栈
```
React 19.1      # 前端框架
TypeScript 5.8  # 类型系统
Vite 7.1        # 构建工具
Ant Design 5    # UI组件库
Redux Toolkit   # 状态管理
```

### 关键依赖
- `crypto-js` - 哈希算法实现
- `qrcode.react` - 二维码生成
- `jszip` - 批量文件打包
- `ajv` - JSON Schema 验证

### 代码组织
```
src/
├── components/
│   └── layout/          # 应用布局组件
├── pages/               # 工具页面组件
│   ├── JsonFormatter.tsx
│   ├── UrlEncoder.tsx
│   ├── Base64Tool.tsx
│   ├── HashGenerator.tsx
│   ├── QrGenerator.tsx
│   └── Home.tsx
├── store/               # Redux状态管理
│   ├── index.ts
│   └── uiSlice.ts
├── utils/               # 工具函数
│   ├── json.ts
│   ├── base64.ts
│   └── hash.ts
└── types/               # TypeScript类型定义
```

## 🔧 设计原则

本项目严格遵循以下编程原则：

- **KISS (Keep It Simple)** - 界面简洁直观，避免不必要的复杂性
- **YAGNI (You Aren't Gonna Need It)** - 只实现当前明确需要的功能
- **DRY (Don't Repeat Yourself)** - 复用组件和工具函数，避免代码重复
- **SOLID 原则** - 单一职责、开放封闭、接口隔离等面向对象设计原则

## 🌐 部署说明

### GitHub Pages 部署
项目配置了 GitHub Actions 自动部署到 GitHub Pages：

```yaml
# .github/workflows/deploy.yml 已配置
# 每次推送到 main 分支自动构建并部署
```

### 本地预览构建
```bash
npm run build
npm run preview
```

## 📋 开发计划

- [x] 基础工具页面实现
- [x] 响应式布局和主题切换
- [x] PWA 基础配置
- [ ] Web Workers 优化大文件处理
- [ ] 更多实用工具集成
- [ ] 国际化支持

## 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源协议。

## 💡 支持与反馈

如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！

有任何问题或建议，欢迎提交 [Issue](../../issues) 或 [Pull Request](../../pulls)。
