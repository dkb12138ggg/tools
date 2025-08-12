# 🛠️ Utility Tools Collection

> A simple, privacy-first collection of online utilities where all data processing is done locally in your browser, no login required.

[English](README_EN.md) | [中文](README.md)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-purple)](https://vitejs.dev/)

## ✨ Core Features

### 📝 Text Processing Tools
- **JSON Formatter** - Format, compress, validate JSON with precise error location
- **URL Encoder/Decoder** - Support Chinese & special characters, batch processing, CSV export
- **Base64 Encoder/Decoder** - Text/file encoding, DataURL generation, batch processing

### 🔐 Security Tools
- **Hash Generator** - MD5/SHA1/SHA256, support text & files, comparison validation
- **QR Code Generator** - Text/URL/WiFi, custom styles, batch generate ZIP downloads

### 🎨 Interface Features
- 📱 Fully responsive design (desktop/mobile)
- 🌙 Dark/light theme toggle
- 🚀 PWA support for offline use
- 🔒 Privacy-first, all processing done locally

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Development Mode
```bash
npm run dev
```
Visit `http://localhost:5173` to view the app

### Production Build
```bash
npm run build
npm run preview
```

### Code Linting
```bash
npm run lint
```

## 🏗️ Technical Architecture

### Core Tech Stack
```
React 19.1      # Frontend framework
TypeScript 5.8  # Type system
Vite 7.1        # Build tool
Ant Design 5    # UI component library
Redux Toolkit   # State management
```

### Key Dependencies
- `crypto-js` - Hash algorithm implementation
- `qrcode.react` - QR code generation
- `jszip` - Batch file packaging
- `ajv` - JSON Schema validation

### Code Organization
```
src/
├── components/
│   └── layout/          # App layout components
├── pages/               # Tool page components
│   ├── JsonFormatter.tsx
│   ├── UrlEncoder.tsx
│   ├── Base64Tool.tsx
│   ├── HashGenerator.tsx
│   ├── QrGenerator.tsx
│   └── Home.tsx
├── store/               # Redux state management
│   ├── index.ts
│   └── uiSlice.ts
├── utils/               # Utility functions
│   ├── json.ts
│   ├── base64.ts
│   └── hash.ts
└── types/               # TypeScript type definitions
```

## 🔧 Design Principles

This project strictly adheres to the following programming principles:

- **KISS (Keep It Simple)** - Interface is clean and intuitive, avoiding unnecessary complexity
- **YAGNI (You Aren't Gonna Need It)** - Only implement currently needed functionality
- **DRY (Don't Repeat Yourself)** - Reuse components and utility functions, avoid code duplication
- **SOLID Principles** - Single responsibility, open-closed, interface segregation and other OOP design principles

## 🌐 Deployment

### GitHub Pages Deployment
The project is configured with GitHub Actions for automatic deployment to GitHub Pages:

```yaml
# .github/workflows/deploy.yml configured
# Automatically builds and deploys on every push to main branch
```

### Local Preview Build
```bash
npm run build
npm run preview
```

## 📋 Development Roadmap

- [x] Basic tool pages implementation
- [x] Responsive layout and theme toggle
- [x] PWA basic configuration
- [ ] Web Workers optimization for large file processing
- [ ] More utility tools integration
- [ ] Internationalization support

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Submit a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 💡 Support & Feedback

If this project helps you, please give it a ⭐️ Star!

For any questions or suggestions, feel free to submit an [Issue](../../issues) or [Pull Request](../../pulls).