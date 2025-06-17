# 🎬 视频对比工具

一个基于 Vite + SolidJS + Tailwind CSS + DaisyUI 构建的现代化视频对比应用，支持拖动滑块对比两个视频的效果。

## ✨ 功能特性

- 📁 **拖拽上传**: 支持拖拽或点击上传视频文件
- 🎛️ **滑块对比**: 拖动滑块实时对比两个视频
- ▶️ **同步播放**: 两个视频同步播放，便于对比效果
- 🎨 **响应式设计**: 适配不同屏幕尺寸
- 🌙 **主题切换**: 支持明暗主题切换
- 🎯 **格式支持**: 支持 MP4, WebM, AVI 等常见视频格式

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 🎯 使用方法

1. **上传视频**
   - 点击上传区域选择视频文件
   - 或直接拖拽视频文件到上传区域

2. **对比视频**
   - 上传左侧（原始）和右侧（处理后）视频
   - 系统会自动显示对比界面

3. **拖动滑块**
   - 拖动中间的蓝色滑块左右移动
   - 实时查看两个视频的差异

4. **视频控制**
   - 使用播放/暂停按钮控制视频播放
   - 两个视频会保持同步播放

## 🛠️ 技术栈

- **框架**: [SolidJS](https://www.solidjs.com/) - 高性能响应式前端框架
- **构建工具**: [Vite](https://vitejs.dev/) - 快速的前端构建工具
- **样式框架**: [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- **UI组件**: [DaisyUI](https://daisyui.com/) - Tailwind CSS组件库
- **开发语言**: JavaScript/JSX

## 📁 项目结构

```
front/compreVideo/
├── src/
│   ├── components/
│   │   └── VideoComparison.jsx    # 视频对比组件
│   ├── App.jsx                    # 主应用组件
│   ├── index.jsx                  # 应用入口
│   └── index.css                  # 全局样式
├── index.html                     # HTML模板
├── package.json                   # 项目配置
├── vite.config.js                 # Vite配置
├── tailwind.config.js             # Tailwind配置
└── postcss.config.js              # PostCSS配置
```

## 🎨 核心功能实现

### 视频对比算法
- 使用 CSS `clip-path` 属性实现视频分割显示
- 通过鼠标事件监听实现滑块拖拽
- 动态计算滑块位置并更新视频显示区域

### 同步播放
- 监听视频时间更新事件
- 自动同步两个视频的播放进度
- 确保对比效果的准确性

## 🔧 自定义配置

### 修改主题
在 `tailwind.config.js` 中可以添加更多DaisyUI主题：

```javascript
daisyui: {
  themes: ["light", "dark", "cupcake", "forest", "luxury"],
}
```

### 调整视频容器尺寸
在 `VideoComparison.jsx` 中修改容器样式：

```javascript
style="aspect-ratio: 16/9; max-width: 1000px;"
```

## 📝 更新日志

### v1.0.0
- ✅ 基础视频对比功能
- ✅ 拖拽上传支持
- ✅ 同步播放功能
- ✅ 响应式设计
- ✅ 主题切换

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

## �� 许可证

MIT License 