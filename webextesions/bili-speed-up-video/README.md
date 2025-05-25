# 🎬 Bili Speed Up Video

一个Chrome浏览器插件，用于通过键盘快捷键控制视频倍速播放。

## ✨ 功能特性

- 🎮 **键盘快捷键控制**：使用快捷键快速调整视频播放速度
- 🎯 **多网站支持**：支持B站、YouTube、优酷、爱奇艺等主流视频网站
- 🎨 **美观界面**：现代化的弹出窗口界面，操作简单直观
- ⚡ **速度预设**：提供常用的播放速度预设按钮
- 💾 **设置保存**：可选择记住播放速度设置
- 🔔 **实时通知**：播放速度变化时显示通知提示

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + Shift + ↑` | 加速播放 |
| `Ctrl + Shift + ↓` | 减速播放 |
| `Ctrl + Shift + R` | 重置播放速度 |

## 🎯 支持的网站

- 🅱️ **哔哩哔哩** (bilibili.com)
- 📺 **YouTube** (youtube.com)
- 🎬 **优酷** (youku.com)
- 🎭 **爱奇艺** (iqiyi.com)
- 🎪 **腾讯视频** (qq.com)
- 🌐 **其他HTML5视频网站**

## 🚀 安装方法

### 开发者模式安装

1. 打开Chrome浏览器，进入 `chrome://extensions/`
2. 开启右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `bili-speed-up-video` 文件夹
5. 插件安装完成！

### 使用方法

1. 打开任意视频网站（如B站、YouTube等）
2. 播放视频
3. 使用快捷键或点击插件图标进行控制

## 🛠️ 开发调试

### 项目结构

```
bili-speed-up-video/
├── manifest.json          # 插件配置文件
├── background.js          # 后台脚本
├── content.js            # 内容脚本
├── popup.html            # 弹出窗口HTML
├── popup.css             # 弹出窗口样式
├── popup.js              # 弹出窗口脚本
├── icons/                # 图标文件夹
├── README.md             # 项目说明
└── DEVELOPMENT.md        # 开发指南
```

### 调试方法

1. **后台脚本调试**：
   - 进入 `chrome://extensions/`
   - 找到插件，点击"检查视图 service worker"
   - 在控制台查看后台脚本日志

2. **内容脚本调试**：
   - 在视频页面按 `F12` 打开开发者工具
   - 在控制台查看内容脚本日志

3. **弹出窗口调试**：
   - 右键点击插件图标
   - 选择"检查弹出内容"
   - 在控制台查看弹出窗口日志

### 修改代码后重新加载

1. 进入 `chrome://extensions/`
2. 找到插件，点击刷新按钮
3. 重新加载相关页面测试

## 🔧 自定义开发

### 扩展倍速控制逻辑

在 `content.js` 文件中找到 `CustomSpeedControl` 类：

```javascript
class CustomSpeedControl {
  constructor() {
    // 在这里添加您的初始化逻辑
  }

  customSpeedUp(video) {
    // 实现您的自定义加速逻辑
  }

  customSpeedDown(video) {
    // 实现您的自定义减速逻辑
  }

  siteSpecificOptimization(hostname) {
    // 针对不同网站实现特定的优化逻辑
  }
}
```

### 添加新的快捷键

在 `manifest.json` 中的 `commands` 部分添加新的快捷键：

```json
{
  "commands": {
    "your-custom-command": {
      "suggested_key": {
        "default": "Ctrl+Shift+X"
      },
      "description": "您的自定义功能"
    }
  }
}
```

然后在 `background.js` 和 `content.js` 中添加相应的处理逻辑。

### 自定义弹出窗口

在 `popup.js` 文件中找到 `CustomPopupFeatures` 类：

```javascript
class CustomPopupFeatures {
  addCustomUI() {
    // 添加您的自定义UI组件
  }

  addCustomSettings() {
    // 添加您的自定义设置选项
  }

  addCustomActions() {
    // 添加您的自定义快捷操作
  }
}
```

## 📝 技术栈

- **Manifest V3**：使用最新的Chrome扩展API
- **Vanilla JavaScript**：原生JavaScript，无外部依赖
- **CSS3**：现代化的样式设计
- **Chrome Extension APIs**：
  - `chrome.commands`：快捷键管理
  - `chrome.tabs`：标签页操作
  - `chrome.runtime`：消息传递
  - `chrome.storage`：设置存储

## 🐛 常见问题

### Q: 快捷键不生效？
A: 请确保：
1. 插件已正确安装并启用
2. 当前页面包含视频元素
3. 快捷键没有与其他插件冲突

### Q: 某些网站不支持？
A: 插件支持所有使用HTML5 `<video>` 标签的网站。如果某个网站不支持，可能是因为：
1. 网站使用了特殊的视频播放器
2. 网站有安全限制
3. 视频元素动态加载较慢

### Q: 如何添加新网站支持？
A: 在 `content.js` 的 `siteSpecificOptimization` 方法中添加针对特定网站的逻辑。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- GitHub Issues
- 邮箱反馈
- Chrome网上应用店评价

---

**享受您的视频观看体验！** 🎉 