# 🛠️ 开发指南

本文档为开发者提供详细的开发和调试指南。

## 📋 开发环境要求

- Chrome浏览器 88+ 版本
- 基本的JavaScript、HTML、CSS知识
- 了解Chrome扩展开发基础

## 🏗️ 项目架构

### 核心文件说明

| 文件 | 作用 | 说明 |
|------|------|------|
| `manifest.json` | 插件配置 | 定义插件权限、快捷键、内容脚本等 |
| `background.js` | 后台脚本 | 处理快捷键命令，管理插件生命周期 |
| `content.js` | 内容脚本 | 注入到网页中，直接操作视频元素 |
| `popup.html/css/js` | 弹出窗口 | 插件的用户界面 |

### 消息传递机制

```
用户按快捷键 → background.js → content.js → 操作视频元素
                    ↓
弹出窗口 ← popup.js ← 状态更新消息
```

## 🎯 核心代码分析

### 1. 插件配置核心 (manifest.json)

```json
{
  "manifest_version": 3,
  "permissions": ["activeTab", "scripting", "storage"],
  "host_permissions": ["*://*/*"],
  "commands": {
    "speed-up": {
      "suggested_key": { "default": "Ctrl+Shift+Up" },
      "description": "加速播放"
    }
  },
  "content_scripts": [{
    "matches": ["*://*/*"],
    "js": ["content.js"],
    "run_at": "document_end"
  }]
}
```

**核心要点：**
- 使用 Manifest V3 最新标准
- `activeTab` 权限允许访问当前标签页
- `scripting` 权限支持动态脚本注入
- `storage` 权限用于保存用户设置
- 通配符 `*://*/*` 支持所有网站

### 2. 后台服务工作者核心 (background.js)

```javascript
// 核心：快捷键命令监听器
chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  try {
    // 尝试发送消息到内容脚本
    await chrome.tabs.sendMessage(tab.id, {
      action: 'speed-control',
      command: command
    });
  } catch (error) {
    // 内容脚本未加载时，动态注入
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
    
    // 等待初始化后重新发送消息
    setTimeout(async () => {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'speed-control',
        command: command
      });
    }, 1000);
  }
});
```

**核心要点：**
- 监听快捷键命令并转发到内容脚本
- 智能处理内容脚本未加载的情况
- 使用动态脚本注入确保功能可用
- 错误处理和重试机制

### 3. 视频控制核心 (content.js)

#### 3.1 VideoSpeedController 主控制器

```javascript
class VideoSpeedController {
  constructor() {
    this.currentSpeed = 1.0;
    this.speedLevels = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0];
    this.currentSpeedIndex = 3; // 默认1.0倍速
  }

  // 核心：查找视频元素算法
  findVideoElement() {
    const videos = document.querySelectorAll('video');
    
    // 优先返回正在播放的视频
    for (const video of videos) {
      if (!video.paused && video.currentTime > 0) {
        return video;
      }
    }
    
    // 返回第一个视频元素
    return videos.length > 0 ? videos[0] : null;
  }

  // 核心：播放速度控制
  setVideoSpeed(video, speed) {
    try {
      video.playbackRate = speed;
      this.currentSpeed = speed;
      this.showSpeedNotification(`播放速度: ${speed}x`);
      this.notifyBackground('speed-changed', { speed });
    } catch (error) {
      console.error('设置播放速度失败:', error);
    }
  }
}
```

#### 3.2 消息处理核心

```javascript
// 核心：消息监听和处理
setupMessageListener() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
      case 'speed-control':
        this.handleSpeedCommand(request.command);
        break;
      case 'set-speed':
        const video = this.findVideoElement();
        if (video) {
          this.setVideoSpeed(video, request.speed);
          sendResponse({ success: true, speed: request.speed });
        } else {
          sendResponse({ success: false, error: 'Video not found' });
        }
        break;
      case 'check-video':
        const videoElement = this.findVideoElement();
        sendResponse({ 
          success: true, 
          hasVideo: !!videoElement,
          speed: videoElement?.playbackRate || 1.0
        });
        break;
    }
  });
}
```

#### 3.3 DOM监听核心

```javascript
// 核心：动态视频元素检测
detectVideoElements() {
  // 使用MutationObserver监听DOM变化
  const observer = new MutationObserver(() => {
    this.checkForVideos();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
```

### 4. 弹出窗口交互核心 (popup.js)

#### 4.1 PopupController 主控制器

```javascript
class PopupController {
  constructor() {
    this.currentSpeed = 1.0;
    this.isVideoDetected = false;
  }

  // 核心：与内容脚本通信
  async sendSpeedCommand(command) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.tabs.sendMessage(tab.id, {
      action: 'speed-control',
      command: command
    });
  }

  // 核心：预设速度设置
  async setPresetSpeed(speed) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.tabs.sendMessage(tab.id, {
      action: 'set-speed',
      speed: speed
    });
    
    this.updateSpeedDisplay(speed);
    this.updateActivePreset(speed);
  }
}
```

#### 4.2 设置管理核心

```javascript
// 核心：设置持久化
async loadSettings() {
  const settings = await chrome.storage.sync.get({
    showNotifications: true,
    rememberSpeed: false,
    lastSpeed: 1.0
  });
  
  // 应用设置到UI
  document.getElementById('show-notifications').checked = settings.showNotifications;
  document.getElementById('remember-speed').checked = settings.rememberSpeed;
}

async saveSetting(key, value) {
  await chrome.storage.sync.set({ [key]: value });
}
```

### 5. 核心算法详解

#### 5.1 视频元素智能检测算法

```javascript
/**
 * 多层级视频检测策略：
 * 1. 优先检测正在播放的视频
 * 2. 检测有音频轨道的视频
 * 3. 检测可见的视频元素
 * 4. 返回第一个视频元素
 */
findVideoElement() {
  const videos = Array.from(document.querySelectorAll('video'));
  
  // 第一优先级：正在播放的视频
  const playingVideo = videos.find(v => !v.paused && v.currentTime > 0);
  if (playingVideo) return playingVideo;
  
  // 第二优先级：有音频的视频
  const audioVideo = videos.find(v => v.volume > 0 && !v.muted);
  if (audioVideo) return audioVideo;
  
  // 第三优先级：可见的视频
  const visibleVideo = videos.find(v => {
    const rect = v.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
  if (visibleVideo) return visibleVideo;
  
  // 最后返回第一个视频
  return videos[0] || null;
}
```

#### 5.2 速度级别管理算法

```javascript
/**
 * 智能速度调节算法：
 * - 预定义常用速度级别
 * - 支持递增/递减操作
 * - 边界检查和提示
 */
class SpeedManager {
  constructor() {
    this.speedLevels = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0];
    this.currentIndex = 3; // 1.0x
  }
  
  speedUp() {
    if (this.currentIndex < this.speedLevels.length - 1) {
      this.currentIndex++;
      return this.speedLevels[this.currentIndex];
    }
    return null; // 已达最大速度
  }
  
  speedDown() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.speedLevels[this.currentIndex];
    }
    return null; // 已达最小速度
  }
}
```

#### 5.3 消息传递可靠性算法

```javascript
/**
 * 可靠消息传递机制：
 * 1. 尝试直接发送消息
 * 2. 失败时注入内容脚本
 * 3. 延迟重试确保成功
 */
async sendReliableMessage(tabId, message) {
  try {
    // 第一次尝试
    return await chrome.tabs.sendMessage(tabId, message);
  } catch (error) {
    // 注入内容脚本
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    });
    
    // 等待初始化后重试
    await new Promise(resolve => setTimeout(resolve, 1000));
    return await chrome.tabs.sendMessage(tabId, message);
  }
}
```

### 6. 扩展性设计

#### 6.1 自定义控制接口

```javascript
/**
 * 预留的自定义扩展接口
 * 开发者可以继承此类实现特定功能
 */
class CustomSpeedControl {
  constructor() {
    // 自定义初始化逻辑
  }

  customSpeedUp(video) {
    // 实现自定义加速逻辑
    // 例如：非线性速度调节、特殊网站适配等
  }

  siteSpecificOptimization(hostname) {
    // 针对特定网站的优化
    switch (hostname) {
      case 'www.bilibili.com':
        return this.optimizeForBilibili();
      case 'www.youtube.com':
        return this.optimizeForYouTube();
    }
  }
}
```

#### 6.2 插件化架构

```javascript
/**
 * 插件化设计模式
 * 支持功能模块的动态加载和扩展
 */
class PluginManager {
  constructor() {
    this.plugins = new Map();
  }
  
  registerPlugin(name, plugin) {
    this.plugins.set(name, plugin);
  }
  
  executePlugin(name, method, ...args) {
    const plugin = this.plugins.get(name);
    if (plugin && typeof plugin[method] === 'function') {
      return plugin[method](...args);
    }
  }
}
```

### 7. 性能优化核心

#### 7.1 防抖和节流机制

```javascript
/**
 * 防抖处理 - 避免频繁操作
 */
class PerformanceOptimizer {
  constructor() {
    this.debounceTimers = new Map();
    this.throttleTimers = new Map();
  }
  
  // 防抖：延迟执行，重复调用会重置计时器
  debounce(key, func, delay = 300) {
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }
    
    const timer = setTimeout(() => {
      func();
      this.debounceTimers.delete(key);
    }, delay);
    
    this.debounceTimers.set(key, timer);
  }
  
  // 节流：限制执行频率
  throttle(key, func, delay = 100) {
    if (this.throttleTimers.has(key)) {
      return;
    }
    
    func();
    const timer = setTimeout(() => {
      this.throttleTimers.delete(key);
    }, delay);
    
    this.throttleTimers.set(key, timer);
  }
}

// 实际应用
const optimizer = new PerformanceOptimizer();

// 防抖处理快捷键连击
function handleSpeedCommand(command) {
  optimizer.debounce('speed-control', () => {
    this.executeSpeedCommand(command);
  }, 200);
}
```

#### 7.2 内存管理和清理

```javascript
/**
 * 内存管理核心
 * 防止内存泄漏和优化性能
 */
class MemoryManager {
  constructor() {
    this.observers = [];
    this.timers = [];
    this.listeners = [];
  }
  
  // 注册需要清理的资源
  registerObserver(observer) {
    this.observers.push(observer);
  }
  
  registerTimer(timer) {
    this.timers.push(timer);
  }
  
  registerListener(element, event, handler) {
    element.addEventListener(event, handler);
    this.listeners.push({ element, event, handler });
  }
  
  // 清理所有资源
  cleanup() {
    // 清理观察者
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    
    // 清理定时器
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers = [];
    
    // 清理事件监听器
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.listeners = [];
  }
}
```

### 8. 错误处理和容错机制

#### 8.1 全局错误处理器

```javascript
/**
 * 全局错误处理核心
 * 确保插件在各种异常情况下仍能正常工作
 */
class ErrorHandler {
  constructor() {
    this.errorCount = 0;
    this.maxErrors = 10;
    this.setupGlobalHandlers();
  }
  
  setupGlobalHandlers() {
    // 捕获未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError('Promise Rejection', event.reason);
      event.preventDefault();
    });
    
    // 捕获全局错误
    window.addEventListener('error', (event) => {
      this.handleError('Global Error', event.error);
    });
  }
  
  handleError(type, error) {
    this.errorCount++;
    
    console.error(`[${type}]`, error);
    
    // 错误过多时停止功能
    if (this.errorCount > this.maxErrors) {
      console.warn('错误过多，暂停插件功能');
      this.disablePlugin();
    }
    
    // 发送错误报告到后台
    this.reportError(type, error);
  }
  
  reportError(type, error) {
    try {
      chrome.runtime.sendMessage({
        action: 'error-report',
        type: type,
        error: error.toString(),
        stack: error.stack,
        timestamp: Date.now()
      });
    } catch (e) {
      console.error('无法发送错误报告:', e);
    }
  }
}
```

#### 8.2 安全的API调用包装器

```javascript
/**
 * 安全API调用包装器
 * 处理Chrome扩展API的各种异常情况
 */
class SafeAPIWrapper {
  static async safeTabsQuery(queryInfo) {
    try {
      return await chrome.tabs.query(queryInfo);
    } catch (error) {
      console.error('tabs.query 失败:', error);
      return [];
    }
  }
  
  static async safeSendMessage(tabId, message) {
    try {
      return await chrome.tabs.sendMessage(tabId, message);
    } catch (error) {
      if (error.message.includes('Could not establish connection')) {
        console.log('内容脚本未加载，尝试注入...');
        return await this.injectAndSend(tabId, message);
      }
      throw error;
    }
  }
  
  static async injectAndSend(tabId, message) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
      });
      
      // 等待脚本初始化
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return await chrome.tabs.sendMessage(tabId, message);
    } catch (error) {
      console.error('脚本注入失败:', error);
      throw new Error('无法在此页面中运行插件');
    }
  }
}
```

### 9. 兼容性处理核心

#### 9.1 浏览器兼容性检测

```javascript
/**
 * 浏览器兼容性检测和适配
 */
class CompatibilityChecker {
  constructor() {
    this.browserInfo = this.detectBrowser();
    this.features = this.checkFeatures();
  }
  
  detectBrowser() {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Chrome')) {
      const match = userAgent.match(/Chrome\/(\d+)/);
      return {
        name: 'Chrome',
        version: match ? parseInt(match[1]) : 0
      };
    }
    
    if (userAgent.includes('Firefox')) {
      const match = userAgent.match(/Firefox\/(\d+)/);
      return {
        name: 'Firefox',
        version: match ? parseInt(match[1]) : 0
      };
    }
    
    return { name: 'Unknown', version: 0 };
  }
  
  checkFeatures() {
    return {
      manifestV3: typeof chrome.action !== 'undefined',
      scripting: typeof chrome.scripting !== 'undefined',
      storage: typeof chrome.storage !== 'undefined',
      commands: typeof chrome.commands !== 'undefined'
    };
  }
  
  isCompatible() {
    if (this.browserInfo.name === 'Chrome' && this.browserInfo.version >= 88) {
      return this.features.manifestV3 && this.features.scripting;
    }
    return false;
  }
}
```

#### 9.2 网站特定适配器

```javascript
/**
 * 网站特定适配器
 * 针对不同视频网站的特殊处理
 */
class SiteAdapter {
  constructor() {
    this.adapters = new Map([
      ['bilibili.com', new BilibiliAdapter()],
      ['youtube.com', new YouTubeAdapter()],
      ['youku.com', new YoukuAdapter()],
      ['iqiyi.com', new IqiyiAdapter()]
    ]);
  }
  
  getAdapter(hostname) {
    for (const [site, adapter] of this.adapters) {
      if (hostname.includes(site)) {
        return adapter;
      }
    }
    return new DefaultAdapter();
  }
}

// B站适配器
class BilibiliAdapter {
  findVideoElement() {
    // B站特定的视频选择器
    return document.querySelector('.bilibili-player-video video') ||
           document.querySelector('video');
  }
  
  getPlayerContainer() {
    return document.querySelector('.bilibili-player');
  }
  
  isFullscreen() {
    return document.querySelector('.bilibili-player-video-wrap.mode-fullscreen') !== null;
  }
}

// YouTube适配器
class YouTubeAdapter {
  findVideoElement() {
    return document.querySelector('.video-stream') ||
           document.querySelector('video');
  }
  
  getPlayerContainer() {
    return document.querySelector('#movie_player');
  }
  
  isFullscreen() {
    return document.fullscreenElement !== null;
  }
}
```

### 10. 数据持久化核心

#### 10.1 设置管理系统

```javascript
/**
 * 设置管理系统
 * 处理用户配置的存储和同步
 */
class SettingsManager {
  constructor() {
    this.defaultSettings = {
      speedLevels: [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0],
      defaultSpeed: 1.0,
      showNotifications: true,
      rememberSpeed: false,
      notificationDuration: 3000,
      keyboardShortcuts: {
        speedUp: 'Ctrl+Shift+Up',
        speedDown: 'Ctrl+Shift+Down',
        reset: 'Ctrl+Shift+R'
      }
    };
  }
  
  async loadSettings() {
    try {
      const stored = await chrome.storage.sync.get(this.defaultSettings);
      return { ...this.defaultSettings, ...stored };
    } catch (error) {
      console.error('加载设置失败:', error);
      return this.defaultSettings;
    }
  }
  
  async saveSettings(settings) {
    try {
      await chrome.storage.sync.set(settings);
      console.log('设置已保存');
    } catch (error) {
      console.error('保存设置失败:', error);
      throw error;
    }
  }
  
  async resetSettings() {
    try {
      await chrome.storage.sync.clear();
      await this.saveSettings(this.defaultSettings);
      console.log('设置已重置');
    } catch (error) {
      console.error('重置设置失败:', error);
      throw error;
    }
  }
}
```

#### 10.2 缓存管理

```javascript
/**
 * 缓存管理系统
 * 优化性能和减少重复计算
 */
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100;
    this.ttl = 5 * 60 * 1000; // 5分钟TTL
  }
  
  set(key, value, customTTL = null) {
    const expiry = Date.now() + (customTTL || this.ttl);
    
    // 清理过期缓存
    this.cleanup();
    
    // 如果缓存已满，删除最旧的条目
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, { value, expiry });
  }
  
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}
```

## 🎯 核心代码总结

### 技术架构优势

1. **模块化设计**
   - 清晰的职责分离：后台脚本处理命令，内容脚本操作DOM，弹出窗口提供UI
   - 松耦合架构：各模块通过消息传递通信，便于维护和扩展
   - 可扩展性：预留自定义接口，支持功能扩展

2. **健壮性保障**
   - 多层错误处理：全局错误捕获、API调用包装、异常恢复机制
   - 兼容性适配：支持多种浏览器和网站的特殊处理
   - 资源管理：防止内存泄漏，优化性能表现

3. **用户体验优化**
   - 智能视频检测：多策略查找最合适的视频元素
   - 流畅交互：防抖节流机制避免操作冲突
   - 即时反馈：实时通知和状态更新

### 核心技术栈

| 技术 | 用途 | 核心价值 |
|------|------|----------|
| **Manifest V3** | 插件配置 | 最新标准，更好的安全性和性能 |
| **Service Worker** | 后台处理 | 事件驱动，资源高效利用 |
| **Content Scripts** | DOM操作 | 直接访问页面元素，实现核心功能 |
| **Chrome APIs** | 系统集成 | 快捷键、存储、标签页管理 |
| **MutationObserver** | DOM监听 | 动态检测页面变化 |
| **Promise/Async** | 异步处理 | 现代化的异步编程模式 |

### 关键设计模式

1. **观察者模式**
   ```javascript
   // DOM变化监听
   const observer = new MutationObserver(callback);
   observer.observe(document.body, { childList: true, subtree: true });
   ```

2. **策略模式**
   ```javascript
   // 不同网站的适配策略
   class SiteAdapter {
     getAdapter(hostname) {
       return this.adapters.get(hostname) || new DefaultAdapter();
     }
   }
   ```

3. **单例模式**
   ```javascript
   // 全局控制器实例
   class VideoSpeedController {
     constructor() {
       if (VideoSpeedController.instance) {
         return VideoSpeedController.instance;
       }
       VideoSpeedController.instance = this;
     }
   }
   ```

4. **工厂模式**
   ```javascript
   // 错误处理器工厂
   class ErrorHandlerFactory {
     static create(type) {
       switch (type) {
         case 'api': return new APIErrorHandler();
         case 'dom': return new DOMErrorHandler();
         default: return new GenericErrorHandler();
       }
     }
   }
   ```

### 性能优化要点

1. **减少DOM查询**
   - 缓存视频元素引用
   - 使用事件委托减少监听器数量

2. **异步操作优化**
   - 使用Promise.all并行处理
   - 合理使用setTimeout避免阻塞

3. **内存管理**
   - 及时清理事件监听器
   - 断开MutationObserver连接

4. **网络请求优化**
   - 批量处理消息传递
   - 使用缓存减少重复请求

### 安全性考虑

1. **权限最小化**
   - 只请求必要的权限
   - 使用activeTab而非全局权限

2. **输入验证**
   - 验证速度值范围
   - 检查消息格式合法性

3. **错误隔离**
   - 防止单个错误影响整体功能
   - 限制错误重试次数

### 扩展开发建议

1. **添加新功能时**
   - 遵循现有的模块化架构
   - 使用统一的错误处理机制
   - 考虑向后兼容性

2. **性能优化时**
   - 使用性能分析工具
   - 关注内存使用情况
   - 测试不同网站的兼容性

3. **调试技巧**
   - 使用Chrome DevTools的扩展调试功能
   - 添加详细的日志输出
   - 模拟各种异常情况

这个项目的核心代码体现了现代Chrome扩展开发的最佳实践，通过合理的架构设计和技术选型，实现了功能强大、性能优秀、用户体验良好的视频倍速控制插件。

## 🔧 开发流程

### 1. 环境搭建

```bash
# 克隆或下载项目
cd bili-speed-up-video

# 在Chrome中加载插件
# 1. 打开 chrome://extensions/
# 2. 开启开发者模式
# 3. 点击"加载已解压的扩展程序"
# 4. 选择项目文件夹
```

### 2. 调试方法

#### 后台脚本调试
```javascript
// 在 background.js 中添加调试日志
console.log('调试信息:', data);

// 查看日志：
// chrome://extensions/ → 找到插件 → 点击"检查视图 service worker"
```

#### 内容脚本调试
```javascript
// 在 content.js 中添加调试日志
console.log('视频元素:', video);

// 查看日志：
// 在视频页面按F12 → Console标签
```

#### 弹出窗口调试
```javascript
// 在 popup.js 中添加调试日志
console.log('弹出窗口状态:', state);

// 查看日志：
// 右键插件图标 → "检查弹出内容"
```

### 3. 代码修改后重新加载

1. 修改代码后，进入 `chrome://extensions/`
2. 找到插件，点击刷新按钮 🔄
3. 重新加载测试页面

## 🎯 核心功能实现

### 快捷键处理流程

```javascript
// 1. manifest.json 中定义快捷键
{
  "commands": {
    "speed-up": {
      "suggested_key": { "default": "Ctrl+Shift+Up" },
      "description": "加速播放"
    }
  }
}

// 2. background.js 监听快捷键
chrome.commands.onCommand.addListener((command) => {
  // 发送消息到内容脚本
  chrome.tabs.sendMessage(tabId, { action: 'speed-control', command });
});

// 3. content.js 处理消息
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'speed-control') {
    handleSpeedCommand(request.command);
  }
});
```

### 视频元素检测

```javascript
// 查找视频元素的策略
function findVideoElement() {
  const videos = document.querySelectorAll('video');
  
  // 优先返回正在播放的视频
  for (const video of videos) {
    if (!video.paused && video.currentTime > 0) {
      return video;
    }
  }
  
  // 返回第一个视频元素
  return videos[0] || null;
}
```

### 播放速度控制

```javascript
// 设置播放速度
function setVideoSpeed(video, speed) {
  try {
    video.playbackRate = speed;
    showSpeedNotification(`播放速度: ${speed}x`);
  } catch (error) {
    console.error('设置播放速度失败:', error);
  }
}
```

## 🔌 扩展开发

### 添加新的快捷键

1. **在 manifest.json 中添加命令**：
```json
{
  "commands": {
    "toggle-play": {
      "suggested_key": { "default": "Ctrl+Shift+Space" },
      "description": "播放/暂停"
    }
  }
}
```

2. **在 background.js 中处理命令**：
```javascript
chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case 'toggle-play':
      // 发送播放/暂停命令
      break;
  }
});
```

3. **在 content.js 中实现功能**：
```javascript
function togglePlay(video) {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}
```

### 针对特定网站优化

```javascript
// 在 content.js 中添加网站特定逻辑
function siteSpecificOptimization() {
  const hostname = window.location.hostname;
  
  switch (hostname) {
    case 'www.bilibili.com':
      // B站特定的视频元素选择器
      return document.querySelector('.bilibili-player-video video');
    
    case 'www.youtube.com':
      // YouTube特定逻辑
      return document.querySelector('.video-stream');
    
    default:
      // 通用逻辑
      return document.querySelector('video');
  }
}
```

### 添加新的UI组件

```javascript
// 在 popup.js 中添加自定义UI
class CustomPopupFeatures {
  addVolumeControl() {
    const volumeSection = document.createElement('div');
    volumeSection.className = 'volume-section';
    volumeSection.innerHTML = `
      <h3>🔊 音量控制</h3>
      <input type="range" id="volume-slider" min="0" max="100" value="100">
    `;
    
    document.querySelector('.main').appendChild(volumeSection);
    
    // 添加事件监听器
    document.getElementById('volume-slider').addEventListener('input', (e) => {
      this.setVolume(e.target.value / 100);
    });
  }
}
```

## 🧪 测试指南

### 功能测试清单

- [ ] 快捷键在不同网站上是否正常工作
- [ ] 弹出窗口界面是否正确显示
- [ ] 速度预设按钮是否生效
- [ ] 设置是否能正确保存和加载
- [ ] 通知提示是否正常显示

### 兼容性测试

测试以下网站的兼容性：
- [ ] 哔哩哔哩 (bilibili.com)
- [ ] YouTube (youtube.com)
- [ ] 优酷 (youku.com)
- [ ] 爱奇艺 (iqiyi.com)
- [ ] 腾讯视频 (v.qq.com)

### 性能测试

- [ ] 插件是否影响页面加载速度
- [ ] 内存使用是否合理
- [ ] CPU占用是否正常

## 🐛 常见开发问题

### Q: 内容脚本无法注入？
A: 检查 manifest.json 中的 `host_permissions` 和 `content_scripts` 配置。

### Q: 快捷键冲突？
A: 在 `chrome://extensions/shortcuts` 中检查和修改快捷键设置。

### Q: 消息传递失败？
A: 确保发送消息时标签页ID正确，并且内容脚本已加载。

### Q: 视频元素找不到？
A: 使用 `MutationObserver` 监听DOM变化，等待视频元素加载。

## 📦 打包发布

### 准备发布

1. **清理代码**：
   - 移除调试日志
   - 优化代码性能
   - 检查代码规范

2. **更新版本号**：
   ```json
   {
     "version": "1.0.1"
   }
   ```

3. **准备图标**：
   - 16x16, 32x32, 48x48, 128x128 像素的PNG图标
   - 放置在 `icons/` 文件夹中

4. **打包插件**：
   ```bash
   # 压缩整个项目文件夹为ZIP文件
   zip -r bili-speed-up-video.zip bili-speed-up-video/
   ```

### 发布到Chrome网上应用店

1. 访问 [Chrome开发者控制台](https://chrome.google.com/webstore/devconsole/)
2. 上传ZIP文件
3. 填写插件信息
4. 提交审核

## 🔄 版本管理

### 版本号规则
- 主版本号：重大功能更新
- 次版本号：新功能添加
- 修订号：Bug修复

### 更新日志格式
```markdown
## [1.0.1] - 2024-01-15
### 新增
- 添加音量控制功能

### 修复
- 修复YouTube兼容性问题

### 优化
- 提升性能表现
```

## 📚 参考资料

- [Chrome扩展开发文档](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 迁移指南](https://developer.chrome.com/docs/extensions/migrating/)
- [Chrome扩展API参考](https://developer.chrome.com/docs/extensions/reference/)

---

**祝您开发愉快！** 🚀 