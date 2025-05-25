/**
 * 后台脚本 - 处理键盘快捷键命令
 * Background Script - Handle keyboard shortcut commands
 */

// 监听键盘快捷键命令
chrome.commands.onCommand.addListener(async (command) => {
    console.log('收到快捷键命令:', command);

    try {
        // 获取当前活动标签页
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab) {
            console.error('无法获取当前标签页');
            return;
        }

        // 尝试向内容脚本发送消息
        try {
            await chrome.tabs.sendMessage(tab.id, {
                action: 'speed-control',
                command: command
            });
            console.log('✅ 消息发送成功');
        } catch (error) {
            console.log('❌ 内容脚本未加载，尝试注入...');
            
            // 如果消息发送失败，尝试注入内容脚本
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content.js']
                });
                
                console.log('✅ 内容脚本注入成功，等待初始化...');
                
                // 等待脚本初始化完成后重新发送消息
                setTimeout(async () => {
                    try {
                        await chrome.tabs.sendMessage(tab.id, {
                            action: 'speed-control',
                            command: command
                        });
                        console.log('✅ 重新发送消息成功');
                    } catch (retryError) {
                        console.error('❌ 重新发送消息失败:', retryError);
                    }
                }, 1000); // 增加等待时间到1秒
                
            } catch (injectError) {
                console.error('❌ 注入内容脚本失败:', injectError);
                console.log('请检查页面是否支持脚本注入');
            }
        }

    } catch (error) {
        console.error('❌ 处理快捷键命令失败:', error);
    }
});

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('后台脚本收到消息:', request);

    // 处理不同类型的消息
    switch (request.action) {
        case 'speed-changed':
            console.log('播放速度已更改为:', request.speed);
            // 这里可以添加通知或其他逻辑
            break;

        case 'video-not-found':
            console.warn('未找到视频元素');
            // 可以显示通知给用户
            break;

        default:
            console.log('未知消息类型:', request.action);
    }

    // 发送响应
    sendResponse({ success: true });
});

// 插件安装或启动时的初始化
chrome.runtime.onInstalled.addListener(() => {
    console.log('Bili Speed Up Video 插件已安装');
});

// 插件启动时的初始化
chrome.runtime.onStartup.addListener(() => {
    console.log('Bili Speed Up Video 插件已启动');
});
