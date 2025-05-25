/**
 * 调试辅助脚本
 * Debug Helper Script
 */

// 在测试页面的控制台中运行此脚本来诊断问题

function debugExtension() {
    console.log('🔍 开始调试 Bili Speed Up Video 插件...');
    
    // 1. 检查Chrome扩展环境
    console.log('1. 检查Chrome扩展环境:');
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        console.log('✅ Chrome扩展环境正常');
        console.log('   - chrome.runtime:', !!chrome.runtime);
        console.log('   - chrome.runtime.id:', chrome.runtime.id);
    } else {
        console.log('❌ Chrome扩展环境异常');
        return;
    }
    
    // 2. 检查视频元素
    console.log('\n2. 检查视频元素:');
    const videos = document.querySelectorAll('video');
    console.log(`   - 找到 ${videos.length} 个视频元素`);
    
    if (videos.length > 0) {
        const video = videos[0];
        console.log('✅ 视频元素信息:');
        console.log('   - 播放状态:', video.paused ? '暂停' : '播放中');
        console.log('   - 当前时间:', video.currentTime);
        console.log('   - 播放速度:', video.playbackRate);
        console.log('   - 视频时长:', video.duration);
    } else {
        console.log('❌ 未找到视频元素');
    }
    
    // 3. 检查插件脚本
    console.log('\n3. 检查插件脚本:');
    if (typeof VideoSpeedController !== 'undefined') {
        console.log('✅ VideoSpeedController 类已加载');
    } else {
        console.log('❌ VideoSpeedController 类未加载');
    }
    
    // 4. 测试消息传递
    console.log('\n4. 测试消息传递:');
    try {
        chrome.runtime.sendMessage({
            action: 'test-message',
            timestamp: Date.now()
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.log('❌ 消息传递失败:', chrome.runtime.lastError.message);
            } else {
                console.log('✅ 消息传递成功:', response);
            }
        });
    } catch (error) {
        console.log('❌ 消息传递异常:', error);
    }
    
    // 5. 手动测试速度控制
    console.log('\n5. 手动测试速度控制:');
    if (videos.length > 0) {
        const video = videos[0];
        console.log('尝试设置播放速度为 1.5x...');
        try {
            video.playbackRate = 1.5;
            console.log('✅ 播放速度设置成功:', video.playbackRate);
        } catch (error) {
            console.log('❌ 播放速度设置失败:', error);
        }
    }
    
    console.log('\n🎯 调试完成！请检查上述输出结果。');
}

// 键盘事件监听器（用于调试）
function debugKeyboardEvents() {
    console.log('🎹 开始监听键盘事件...');
    
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey) {
            console.log(`🔑 检测到快捷键组合: Ctrl + Shift + ${e.key}`);
            console.log('   - keyCode:', e.keyCode);
            console.log('   - code:', e.code);
            console.log('   - key:', e.key);
        }
    });
}

// 自动运行调试
console.log('🚀 调试脚本已加载！');
console.log('运行 debugExtension() 来诊断插件问题');
console.log('运行 debugKeyboardEvents() 来监听键盘事件');

// 如果在测试页面，自动运行调试
if (window.location.pathname.includes('test.html')) {
    setTimeout(() => {
        debugExtension();
        debugKeyboardEvents();
    }, 1000);
} 