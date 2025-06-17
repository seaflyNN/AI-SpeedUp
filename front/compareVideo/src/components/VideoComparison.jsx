import { createSignal, onMount, createEffect } from 'solid-js';

function VideoComparison() {
  const [leftVideo, setLeftVideo] = createSignal(null);
  const [rightVideo, setRightVideo] = createSignal(null);
  const [sliderPosition, setSliderPosition] = createSignal(50);
  const [isDragging, setIsDragging] = createSignal(false);
  const [isPlaying, setIsPlaying] = createSignal(false);
  
  let containerRef;
  let leftVideoRef;
  let rightVideoRef;

  // 处理文件上传
  const handleFileUpload = (event, side) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      if (side === 'left') {
        setLeftVideo(url);
      } else {
        setRightVideo(url);
      }
    }
  };

  // 处理拖拽上传
  const handleDrop = (event, side) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('video/')) {
      const url = URL.createObjectURL(files[0]);
      if (side === 'left') {
        setLeftVideo(url);
      } else {
        setRightVideo(url);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // 滑块拖拽逻辑
  const handleMouseDown = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (event) => {
    if (!isDragging() || !containerRef) return;
    
    const rect = containerRef.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 视频同步播放
  const handlePlay = () => {
    if (leftVideoRef && rightVideoRef) {
      leftVideoRef.play();
      rightVideoRef.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (leftVideoRef && rightVideoRef) {
      leftVideoRef.pause();
      rightVideoRef.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (leftVideoRef && rightVideoRef) {
      // 同步视频时间
      if (Math.abs(leftVideoRef.currentTime - rightVideoRef.currentTime) > 0.1) {
        rightVideoRef.currentTime = leftVideoRef.currentTime;
      }
    }
  };

  // 监听滑块位置变化，更新视频显示
  createEffect(() => {
    const position = sliderPosition();
    if (containerRef) {
      const rightVideo = containerRef.querySelector('.video-right');
      if (rightVideo) {
        rightVideo.style.clipPath = `polygon(${position}% 0, 100% 0, 100% 100%, ${position}% 100%)`;
      }
      
      const slider = containerRef.querySelector('.video-comparison-slider');
      if (slider) {
        slider.style.left = `${position}%`;
      }
    }
  });

  onMount(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });

  return (
    <div class="max-w-6xl mx-auto">
      {/* 文件上传区域 */}
      {(!leftVideo() || !rightVideo()) && (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 左侧视频上传 */}
          <div class="space-y-4">
            <h3 class="text-xl font-semibold text-center">原始视频</h3>
            {!leftVideo() ? (
              <div
                class="upload-area p-8 text-center cursor-pointer"
                onDrop={(e) => handleDrop(e, 'left')}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('leftVideoInput').click()}
              >
                <div class="text-4xl mb-4">📹</div>
                <p class="text-lg font-medium mb-2">点击或拖拽上传原始视频</p>
                <p class="text-sm text-gray-500">支持 MP4, WebM, AVI 等格式</p>
                <input
                  id="leftVideoInput"
                  type="file"
                  accept="video/*"
                  class="hidden"
                  onChange={(e) => handleFileUpload(e, 'left')}
                />
              </div>
            ) : (
              <div class="relative">
                <video
                  class="w-full rounded-lg shadow-lg"
                  controls
                  src={leftVideo()}
                >
                  您的浏览器不支持视频播放
                </video>
                <button
                  class="btn btn-sm btn-error absolute top-2 right-2"
                  onClick={() => setLeftVideo(null)}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* 右侧视频上传 */}
          <div class="space-y-4">
            <h3 class="text-xl font-semibold text-center">处理后视频</h3>
            {!rightVideo() ? (
              <div
                class="upload-area p-8 text-center cursor-pointer"
                onDrop={(e) => handleDrop(e, 'right')}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('rightVideoInput').click()}
              >
                <div class="text-4xl mb-4">🎬</div>
                <p class="text-lg font-medium mb-2">点击或拖拽上传处理后视频</p>
                <p class="text-sm text-gray-500">支持 MP4, WebM, AVI 等格式</p>
                <input
                  id="rightVideoInput"
                  type="file"
                  accept="video/*"
                  class="hidden"
                  onChange={(e) => handleFileUpload(e, 'right')}
                />
              </div>
            ) : (
              <div class="relative">
                <video
                  class="w-full rounded-lg shadow-lg"
                  controls
                  src={rightVideo()}
                >
                  您的浏览器不支持视频播放
                </video>
                <button
                  class="btn btn-sm btn-error absolute top-2 right-2"
                  onClick={() => setRightVideo(null)}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 视频对比区域 */}
      {leftVideo() && rightVideo() && (
        <div class="space-y-6">
          <div class="text-center">
            <h3 class="text-2xl font-bold mb-4">视频对比</h3>
            <p class="text-base-content/70">拖动滑块查看两个视频的差异</p>
          </div>

          {/* 对比容器 */}
          <div 
            ref={containerRef}
            class="video-comparison-container mx-auto relative bg-black"
            style="aspect-ratio: 16/9; max-width: 800px;"
          >
            {/* 左侧视频 */}
            <div class="video-left">
              <video
                ref={leftVideoRef}
                class="w-full h-full object-cover"
                src={leftVideo()}
                onTimeUpdate={handleTimeUpdate}
                muted
              />
            </div>

            {/* 右侧视频 */}
            <div class="video-right">
              <video
                ref={rightVideoRef}
                class="w-full h-full object-cover"
                src={rightVideo()}
                muted
              />
            </div>

            {/* 拖拽滑块 */}
            <div
              class="video-comparison-slider"
              onMouseDown={handleMouseDown}
            />
          </div>

          {/* 控制按钮 */}
          <div class="flex justify-center space-x-4">
            <button
              class="btn btn-primary"
              onClick={handlePlay}
              disabled={isPlaying()}
            >
              ▶️ 播放
            </button>
            <button
              class="btn btn-secondary"
              onClick={handlePause}
              disabled={!isPlaying()}
            >
              ⏸️ 暂停
            </button>
            <button
              class="btn btn-outline"
              onClick={() => {
                setLeftVideo(null);
                setRightVideo(null);
                setSliderPosition(50);
              }}
            >
              🔄 重新上传
            </button>
          </div>

          {/* 滑块位置指示 */}
          <div class="text-center">
            <div class="stat bg-base-200 inline-block rounded-lg">
              <div class="stat-title">滑块位置</div>
              <div class="stat-value text-2xl">{Math.round(sliderPosition())}%</div>
              <div class="stat-desc">左侧 {Math.round(sliderPosition())}% / 右侧 {Math.round(100 - sliderPosition())}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoComparison; 