/**
 * 内容脚本 - 视频倍速播放控制
 * Content Script - Video Speed Control
 */

class VideoSpeedController {
    constructor() {
        this.currentSpeed = 1.0;
        this.speedLevels = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0];
        this.currentSpeedIndex = 3; // 默认1.0倍速
        this.init();
    }

    /**
     * 初始化控制器
     */
    init() {
        console.log('VideoSpeedController 初始化');
        this.setupMessageListener();
        this.detectVideoElements();
    }

    /**
     * 设置消息监听器
     */
    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            console.log('内容脚本收到消息:', request);
            
            if (request.action === 'speed-control') {
                this.handleSpeedCommand(request.command);
                sendResponse({ success: true });
            } else if (request.action === 'set-speed') {
                // 处理预设速度设置
                const video = this.findVideoElement();
                if (video) {
                    this.setVideoSpeed(video, request.speed);
                    sendResponse({ success: true, speed: request.speed });
                } else {
                    this.notifyBackground('video-not-found');
                    sendResponse({ success: false, error: 'Video not found' });
                }
            } else if (request.action === 'check-video') {
                // 检查视频元素
                const video = this.findVideoElement();
                if (video) {
                    this.notifyBackground('video-detected', { 
                        speed: video.playbackRate,
                        paused: video.paused,
                        currentTime: video.currentTime
                    });
                    sendResponse({ success: true, hasVideo: true });
                } else {
                    this.notifyBackground('video-not-found');
                    sendResponse({ success: true, hasVideo: false });
                }
            }
        });
    }

    /**
     * 处理速度控制命令
     * @param {string} command - 命令类型
     */
    handleSpeedCommand(command) {
        const video = this.findVideoElement();

        if (!video) {
            console.warn('未找到视频元素');
            this.notifyBackground('video-not-found');
            return;
        }

        switch (command) {
            case 'speed-up':
                this.speedUp(video);
                break;
            case 'speed-down':
                this.speedDown(video);
                break;
            case 'speed-reset':
                this.resetSpeed(video);
                break;
            default:
                console.warn('未知命令:', command);
        }
    }

    /**
     * 查找页面中的视频元素
     * @returns {HTMLVideoElement|null} 视频元素
     */
    findVideoElement() {
        // 优先查找当前正在播放的视频
        const videos = document.querySelectorAll('video');

        // 查找正在播放的视频
        for (const video of videos) {
            if (!video.paused && video.currentTime > 0) {
                return video;
            }
        }

        // 如果没有正在播放的视频，返回第一个视频元素
        return videos.length > 0 ? videos[0] : null;
    }

    /**
     * 加速播放
     * @param {HTMLVideoElement} video - 视频元素
     */
    speedUp(video) {
        if (this.currentSpeedIndex < this.speedLevels.length - 1) {
            this.currentSpeedIndex++;
            this.setVideoSpeed(video, this.speedLevels[this.currentSpeedIndex]);
        } else {
            console.log('已达到最大播放速度');
            this.showSpeedNotification('已达到最大播放速度');
        }
    }

    /**
     * 减速播放
     * @param {HTMLVideoElement} video - 视频元素
     */
    speedDown(video) {
        if (this.currentSpeedIndex > 0) {
            this.currentSpeedIndex--;
            this.setVideoSpeed(video, this.speedLevels[this.currentSpeedIndex]);
        } else {
            console.log('已达到最小播放速度');
            this.showSpeedNotification('已达到最小播放速度');
        }
    }

    /**
     * 重置播放速度
     * @param {HTMLVideoElement} video - 视频元素
     */
    resetSpeed(video) {
        this.currentSpeedIndex = 3; // 重置为1.0倍速
        this.setVideoSpeed(video, this.speedLevels[this.currentSpeedIndex]);
    }

    /**
     * 设置视频播放速度
     * @param {HTMLVideoElement} video - 视频元素
     * @param {number} speed - 播放速度
     */
    setVideoSpeed(video, speed) {
        try {
            video.playbackRate = speed;
            this.currentSpeed = speed;

            console.log(`播放速度已设置为: ${speed}x`);
            this.showSpeedNotification(`播放速度: ${speed}x`);

            // 通知后台脚本
            this.notifyBackground('speed-changed', { speed: speed });

        } catch (error) {
            console.error('设置播放速度失败:', error);
        }
    }

    /**
     * 显示速度通知
     * @param {string} message - 通知消息
     */
    showSpeedNotification(message) {
        // 移除现有的通知
        const existingNotification = document.getElementById('speed-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 创建新的通知元素
        const notification = document.createElement('div');
        notification.id = 'speed-notification';
        notification.textContent = message;
        notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      font-size: 14px;
      font-family: Arial, sans-serif;
      z-index: 10000;
      transition: opacity 0.3s ease;
    `;

        document.body.appendChild(notification);

        // 3秒后自动移除通知
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    /**
     * 通知后台脚本
     * @param {string} action - 动作类型
     * @param {object} data - 附加数据
     */
    notifyBackground(action, data = {}) {
        chrome.runtime.sendMessage({
            action: action,
            ...data
        }).catch(error => {
            console.error('发送消息到后台脚本失败:', error);
        });
    }

    /**
     * 检测页面中的视频元素
     */
    detectVideoElements() {
        // 立即检测
        this.checkForVideos();

        // 使用MutationObserver监听DOM变化
        const observer = new MutationObserver(() => {
            this.checkForVideos();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * 检查页面中的视频元素
     */
    checkForVideos() {
        const videos = document.querySelectorAll('video');
        if (videos.length > 0) {
            console.log(`检测到 ${videos.length} 个视频元素`);
        }
    }
}

// 页面加载完成后初始化控制器
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new VideoSpeedController();
    });
} else {
    new VideoSpeedController();
}

// TODO: 在这里添加您的自定义倍速播放逻辑
// 您可以扩展VideoSpeedController类或添加新的功能

/**
 * 自定义倍速播放接口 - 供您实现具体功能
 * Custom Speed Control Interface - For your implementation
 */
class CustomSpeedControl {
    constructor() {
        // TODO: 在这里添加您的初始化逻辑
    }

    /**
     * 自定义加速逻辑
     * @param {HTMLVideoElement} video - 视频元素
     */
    customSpeedUp(video) {
        // TODO: 实现您的自定义加速逻辑
        console.log('自定义加速逻辑 - 待实现');
    }

    /**
     * 自定义减速逻辑
     * @param {HTMLVideoElement} video - 视频元素
     */
    customSpeedDown(video) {
        // TODO: 实现您的自定义减速逻辑
        console.log('自定义减速逻辑 - 待实现');
    }

    /**
     * 针对特定网站的优化
     * @param {string} hostname - 网站域名
     */
    siteSpecificOptimization(hostname) {
        // TODO: 针对不同网站实现特定的优化逻辑
        switch (hostname) {
            case 'www.bilibili.com':
                // B站特定逻辑
                break;
            case 'www.youtube.com':
                // YouTube特定逻辑
                break;
            default:
                // 通用逻辑
                break;
        }
    }
}

// 导出类供其他模块使用
window.VideoSpeedController = VideoSpeedController;
window.CustomSpeedControl = CustomSpeedControl;
