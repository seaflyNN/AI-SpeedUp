# OpenCV WebAssembly 演示项目

这是一个使用 OpenCV WebAssembly + React + Tailwind CSS + Vite 构建的最简单图像显示应用。

## 功能特性

- ✅ 使用 Vite 作为构建工具
- ✅ React 18 + TypeScript
- ✅ Tailwind CSS 样式框架
- ✅ OpenCV.js 图像处理
- ✅ 文件拖拽上传
- ✅ 图像加载和显示
- ✅ 响应式设计

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **图像处理**: OpenCV.js (WebAssembly)
- **开发语言**: TypeScript

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── App.tsx          # 主应用组件
├── index.css        # Tailwind CSS 样式
├── main.tsx         # 应用入口点
└── vite-env.d.ts    # Vite 类型定义
```

## 使用说明

1. 打开应用后，等待 OpenCV.js 加载完成
2. 点击上传区域选择图片文件
3. 选择图片后，应用会使用 OpenCV 处理并显示图像
4. 支持常见的图片格式：PNG, JPG, JPEG

## 特点

- **最小化设计**: 遵循前端最佳实践，只实现核心功能
- **类型安全**: 全面的 TypeScript 支持
- **响应式布局**: 使用 Tailwind CSS 实现现代化 UI
- **性能优化**: 使用 Vite 实现快速开发和构建
- **内存管理**: 正确释放 OpenCV Mat 对象，避免内存泄漏

## 技术说明

本项目直接从 OpenCV 官方 CDN 加载 OpenCV.js，避免了复杂的本地构建过程。图像处理使用 OpenCV 的 `imread` 和 `imshow` 函数，实现最简单的图像显示功能。
