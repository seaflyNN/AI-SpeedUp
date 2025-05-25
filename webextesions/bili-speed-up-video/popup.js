/**
 * Popup 脚本文件
 * Popup Script
 */

class PopupController {
    constructor() {
        this.currentSpeed = 1.0;
        this.isVideoDetected = false;
        this.init();
    }

    /**
     * 初始化弹出窗口
     */
    init() {
        console.log('Popup 初始化');
        this.setupEventListeners();
        this.loadSettings();
        this.updateVideoStatus();
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 手动控制按钮
        document.getElementById('speed-up').addEventListener('click', () => {
            this.sendSpeedCommand('speed-up');
        });

        document.getElementById('speed-down').addEventListener('click', () => {
            this.sendSpeedCommand('speed-down');
        });

        document.getElementById('speed-reset').addEventListener('click', () => {
            this.sendSpeedCommand('speed-reset');
        });

        // 速度预设按钮
        document.querySelectorAll('.btn-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const speed = parseFloat(e.target.dataset.speed);
                this.setPresetSpeed(speed);
            });
        });

        // 设置选项
        document.getElementById('show-notifications').addEventListener('change', (e) => {
            this.saveSetting('showNotifications', e.target.checked);
        });

        document.getElementById('remember-speed').addEventListener('change', (e) => {
            this.saveSetting('rememberSpeed', e.target.checked);
        });

        // 帮助和反馈链接
        document.getElementById('help-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.showHelp();
        });

        document.getElementById('feedback-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.showFeedback();
        });
    }

    /**
     * 发送速度控制命令到内容脚本
     * @param {string} command - 命令类型
     */
    async sendSpeedCommand(command) {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (!tab) {
                console.error('无法获取当前标签页');
                return;
            }

            await chrome.tabs.sendMessage(tab.id, {
                action: 'speed-control',
                command: command
            });

            console.log('已发送速度控制命令:', command);

        } catch (error) {
            console.error('发送命令失败:', error);
            this.showError('无法控制视频播放速度，请确保页面中有视频元素');
        }
    }

    /**
     * 设置预设速度
     * @param {number} speed - 目标速度
     */
    async setPresetSpeed(speed) {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (!tab) {
                console.error('无法获取当前标签页');
                return;
            }

            await chrome.tabs.sendMessage(tab.id, {
                action: 'set-speed',
                speed: speed
            });

            this.updateSpeedDisplay(speed);
            this.updateActivePreset(speed);

            console.log('已设置预设速度:', speed);

        } catch (error) {
            console.error('设置预设速度失败:', error);
            this.showError('无法设置播放速度');
        }
    }

    /**
     * 更新速度显示
     * @param {number} speed - 当前速度
     */
    updateSpeedDisplay(speed) {
        this.currentSpeed = speed;
        document.getElementById('current-speed').textContent = `${speed}x`;
    }

    /**
     * 更新活动的预设按钮
     * @param {number} speed - 当前速度
     */
    updateActivePreset(speed) {
        document.querySelectorAll('.btn-preset').forEach(btn => {
            btn.classList.remove('active');
            if (parseFloat(btn.dataset.speed) === speed) {
                btn.classList.add('active');
            }
        });
    }

    /**
     * 更新视频状态
     */
    async updateVideoStatus() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (!tab) {
                document.getElementById('video-status').textContent = '无法获取标签页';
                return;
            }

            // 检查是否为支持的网站
            const supportedSites = ['bilibili.com', 'youtube.com', 'youku.com', 'iqiyi.com', 'qq.com'];
            const hostname = new URL(tab.url).hostname;
            const isSupported = supportedSites.some(site => hostname.includes(site));

            if (isSupported) {
                document.getElementById('video-status').textContent = '支持的网站';
                document.getElementById('video-status').style.color = '#28a745';
            } else {
                document.getElementById('video-status').textContent = '通用模式';
                document.getElementById('video-status').style.color = '#ffc107';
            }

            // 尝试检测视频元素
            try {
                await chrome.tabs.sendMessage(tab.id, {
                    action: 'check-video'
                });
            } catch (error) {
                // 内容脚本可能还未加载
                console.log('内容脚本未就绪');
            }

        } catch (error) {
            console.error('更新视频状态失败:', error);
            document.getElementById('video-status').textContent = '检测失败';
            document.getElementById('video-status').style.color = '#dc3545';
        }
    }

    /**
     * 加载设置
     */
    async loadSettings() {
        try {
            const settings = await chrome.storage.sync.get({
                showNotifications: true,
                rememberSpeed: false,
                lastSpeed: 1.0
            });

            document.getElementById('show-notifications').checked = settings.showNotifications;
            document.getElementById('remember-speed').checked = settings.rememberSpeed;

            if (settings.rememberSpeed) {
                this.updateSpeedDisplay(settings.lastSpeed);
                this.updateActivePreset(settings.lastSpeed);
            }

        } catch (error) {
            console.error('加载设置失败:', error);
        }
    }

    /**
     * 保存设置
     * @param {string} key - 设置键
     * @param {any} value - 设置值
     */
    async saveSetting(key, value) {
        try {
            await chrome.storage.sync.set({ [key]: value });
            console.log('设置已保存:', key, value);
        } catch (error) {
            console.error('保存设置失败:', error);
        }
    }

    /**
     * 显示错误消息
     * @param {string} message - 错误消息
     */
    showError(message) {
        // 创建错误提示
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      right: 10px;
      background: #dc3545;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    `;

        document.body.appendChild(errorDiv);

        // 3秒后移除
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 3000);
    }

    /**
     * 显示帮助信息
     */
    showHelp() {
        const helpContent = `
      🎬 Bili Speed Up Video 使用帮助

      ⌨️ 快捷键：
      • Ctrl + Shift + ↑：加速播放
      • Ctrl + Shift + ↓：减速播放  
      • Ctrl + Shift + R：重置速度

      🎮 手动控制：
      • 点击加速/减速按钮
      • 使用速度预设按钮

      ⚙️ 设置：
      • 显示速度通知：控制是否显示速度变化提示
      • 记住播放速度：保存上次使用的播放速度

      📝 支持的网站：
      • 哔哩哔哩 (bilibili.com)
      • YouTube (youtube.com)
      • 优酷 (youku.com)
      • 爱奇艺 (iqiyi.com)
      • 腾讯视频 (qq.com)
      • 其他包含HTML5视频的网站
    `;

        alert(helpContent);
    }

    /**
     * 显示反馈信息
     */
    showFeedback() {
        const feedbackContent = `
      📧 反馈与建议

      如果您在使用过程中遇到问题或有改进建议，
      请通过以下方式联系我们：

      • GitHub Issues
      • 邮箱反馈
      • Chrome 网上应用店评价

      感谢您的使用和支持！
    `;

        alert(feedbackContent);
    }
}

// 监听来自后台脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Popup 收到消息:', request);

    switch (request.action) {
        case 'speed-changed':
            if (window.popupController) {
                window.popupController.updateSpeedDisplay(request.speed);
                window.popupController.updateActivePreset(request.speed);
            }
            break;

        case 'video-detected':
            document.getElementById('video-status').textContent = '已检测到视频';
            document.getElementById('video-status').style.color = '#28a745';
            break;

        case 'video-not-found':
            document.getElementById('video-status').textContent = '未找到视频';
            document.getElementById('video-status').style.color = '#dc3545';
            break;
    }

    sendResponse({ success: true });
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.popupController = new PopupController();
});

// TODO: 在这里添加您的自定义弹出窗口功能
// 您可以扩展PopupController类或添加新的功能

/**
 * 自定义弹出窗口接口 - 供您实现具体功能
 * Custom Popup Interface - For your implementation
 */
class CustomPopupFeatures {
    constructor() {
        // TODO: 在这里添加您的初始化逻辑
    }

    /**
     * 自定义UI组件
     */
    addCustomUI() {
        // TODO: 添加您的自定义UI组件
        console.log('自定义UI组件 - 待实现');
    }

    /**
     * 自定义设置选项
     */
    addCustomSettings() {
        // TODO: 添加您的自定义设置选项
        console.log('自定义设置选项 - 待实现');
    }

    /**
     * 自定义快捷操作
     */
    addCustomActions() {
        // TODO: 添加您的自定义快捷操作
        console.log('自定义快捷操作 - 待实现');
    }
}

// 导出类供其他模块使用
window.PopupController = PopupController;
window.CustomPopupFeatures = CustomPopupFeatures;
