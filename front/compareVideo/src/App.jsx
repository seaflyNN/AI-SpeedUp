import { createSignal, createEffect, onMount } from 'solid-js';
import VideoComparison from './components/VideoComparison';

function App() {
  const [theme, setTheme] = createSignal('light');

  const toggleTheme = () => {
    const newTheme = theme() === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  onMount(() => {
    document.documentElement.setAttribute('data-theme', theme());
  });

  return (
    <div class="min-h-screen bg-base-100">
      {/* 导航栏 */}
      <div class="navbar bg-base-200 shadow-lg">
        <div class="flex-1">
          <a class="btn btn-ghost text-xl font-bold">🎬 视频对比工具</a>
        </div>
        <div class="flex-none">
          <button class="btn btn-square btn-ghost" onClick={toggleTheme}>
            {theme() === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

      {/* 主要内容 */}
      <div class="container mx-auto px-4 py-8">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-primary mb-4">视频对比工具</h1>
          <p class="text-lg text-base-content/70">
            上传两个视频文件，拖动滑块进行对比查看效果
          </p>
        </div>

        <VideoComparison />

        <div class="mt-12 text-center">
          <div class="card bg-base-200 shadow-lg">
            <div class="card-body">
              <h2 class="card-title justify-center">使用说明</h2>
              <div class="text-left space-y-2">
                <p>📁 <strong>上传视频：</strong>点击上传区域或拖拽视频文件到指定区域</p>
                <p>🎛️ <strong>对比视频：</strong>上传两个视频后，拖动中间的滑块进行对比</p>
                <p>▶️ <strong>同步播放：</strong>两个视频会同步播放，方便对比效果</p>
                <p>🎨 <strong>支持格式：</strong>MP4, WebM, AVI等常见视频格式</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer class="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
          <p class="font-semibold">视频对比工具</p>
          <p>使用 Vite + SolidJS + Tailwind CSS + DaisyUI 构建</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 