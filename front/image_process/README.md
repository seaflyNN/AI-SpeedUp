# Image Process

基于 Tauri 2.0 + SolidJS + DaisyUI 构建的图片处理应用，支持文件拖拽功能。

## 技术栈

- **前端**: SolidJS + TypeScript
- **UI框架**: DaisyUI + Tailwind CSS
- **桌面应用**: Tauri 2.0
- **插件**: tauri-plugin-upload (文件上传功能)

## 功能特性

- ✅ 文件拖拽上传
- ✅ 支持多种图片格式 (JPG, PNG, GIF, WebP)
- ✅ 文件预览和信息展示
- ✅ 现代化UI界面
- 🚧 图片处理功能 (开发中)

## 安装和运行

### 前置要求

- Node.js (推荐 v18+)
- Rust (最新稳定版)
- Windows/macOS/Linux

### 开发环境

1. 安装依赖：
```bash
npm install
```

2. 运行开发服务器：
```bash
npm run tauri dev
```

### 构建生产版本

```bash
npm run tauri build
```

## 使用说明

1. 启动应用后，您会看到一个拖拽区域
2. 将图片文件拖拽到拖拽区域，或点击选择文件
3. 应用会显示选中的文件列表和基本信息
4. 点击"开始处理"按钮进行图片处理（功能开发中）

## 项目结构

```
image_process/
├── src/                 # 前端源码
│   ├── App.tsx         # 主应用组件
│   ├── index.tsx       # 应用入口
│   └── index.css       # 全局样式
├── src-tauri/          # Tauri 后端
│   ├── src/
│   │   ├── main.rs     # 主程序
│   │   └── lib.rs      # 库文件
│   ├── Cargo.toml      # Rust 依赖
│   └── tauri.conf.json # Tauri 配置
├── package.json        # Node.js 依赖
└── README.md          # 项目说明
```

## 开发计划

- [ ] 图片压缩功能
- [ ] 格式转换功能
- [ ] 批量处理
- [ ] 图片滤镜
- [ ] 尺寸调整
- [ ] 水印添加

## 许可证

MIT License 