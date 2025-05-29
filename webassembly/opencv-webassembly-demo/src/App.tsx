import React, { useState, useRef, useEffect } from 'react';

// 声明全局cv对象类型
declare global {
  interface Window {
    cv: any;
    opencvLoading?: boolean;
  }
}

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 加载OpenCV.js
    const loadOpenCV = () => {
      // 检查是否已经加载完成
      if (window.cv && window.cv.Mat) {
        console.log('OpenCV.js already loaded');
        setIsLoaded(true);
        setDebugInfo('OpenCV.js 已准备就绪');
        return;
      }

      // 检查是否正在加载中
      if (window.opencvLoading) {
        console.log('OpenCV.js is already loading');
        setDebugInfo('OpenCV.js 正在加载中...');
        // 等待加载完成
        const checkCV = () => {
          if (window.cv && window.cv.Mat) {
            console.log('OpenCV.js is ready from existing loading');
            setIsLoaded(true);
            setDebugInfo('OpenCV.js 已准备就绪');
            window.opencvLoading = false;
          } else {
            setTimeout(checkCV, 100);
          }
        };
        checkCV();
        return;
      }

      // 检查是否已经存在script标签
      const existingScript = document.querySelector('script[src*="opencv.js"]');
      if (existingScript) {
        console.log('OpenCV.js script already exists');
        setDebugInfo('OpenCV.js 脚本已存在，等待初始化...');
        window.opencvLoading = true;
        // 等待现有脚本完成加载
        const checkCV = () => {
          if (window.cv && window.cv.Mat) {
            console.log('OpenCV.js is ready from existing script');
            setIsLoaded(true);
            setDebugInfo('OpenCV.js 已准备就绪');
            window.opencvLoading = false;
          } else {
            setTimeout(checkCV, 100);
          }
        };
        checkCV();
        return;
      }

      // 标记正在加载
      window.opencvLoading = true;
      setDebugInfo('正在加载 OpenCV.js...');
      
      // 创建script标签加载OpenCV.js
      const script = document.createElement('script');
      script.src = 'https://docs.opencv.org/4.7.0/opencv.js';
      script.async = true;
      script.id = 'opencv-script'; // 添加ID以便识别
      
      script.onload = () => {
        setDebugInfo('OpenCV.js 脚本已加载，等待初始化...');
        // 等待OpenCV初始化
        const checkCV = () => {
          if (window.cv && window.cv.Mat) {
            console.log('OpenCV.js is ready');
            setIsLoaded(true);
            setDebugInfo('OpenCV.js 已准备就绪');
            window.opencvLoading = false;
          } else if (window.cv && window.cv.onRuntimeInitialized) {
            window.cv.onRuntimeInitialized = () => {
              console.log('OpenCV.js is ready');
              setIsLoaded(true);
              setDebugInfo('OpenCV.js 已准备就绪');
              window.opencvLoading = false;
            };
          } else {
            // 继续检查
            setTimeout(checkCV, 100);
          }
        };
        checkCV();
      };
      
      script.onerror = () => {
        console.error('Failed to load OpenCV.js');
        setDebugInfo('OpenCV.js 加载失败');
        window.opencvLoading = false;
      };
      
      document.head.appendChild(script);
    };

    loadOpenCV();

    // 清理函数 - 组件卸载时不需要移除script，因为其他组件可能还在使用
    return () => {
      // 清理操作（如果需要）
    };
  }, []); // 空依赖数组确保只运行一次

  // 处理图片URL变化
  useEffect(() => {
    if (imageUrl && imageRef.current) {
      console.log('Setting image src to:', imageUrl);
      
      const img = imageRef.current;
      
      // 设置加载事件监听器
      const handleLoad = () => {
        console.log('Image loaded successfully:', {
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          src: img.src
        });
        setDebugInfo('图片加载完成');
      };
      
      const handleError = (e: string | Event) => {
        console.error('Image failed to load:', e);
        setDebugInfo('图片加载失败');
      };
      
      img.onload = handleLoad;
      img.onerror = handleError;
      
      // 设置src
      img.src = imageUrl;
      
      // 清理函数
      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }
  }, [imageUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      console.log('File selected:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      setSelectedFile(file);
      setImageLoaded(false);
      setDebugInfo(`选择了文件: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);
      
      // 清除旧的URL
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      
      // 创建新的URL
      const url = URL.createObjectURL(file);
      console.log('Created blob URL:', url);
      setImageUrl(url);
      
    } else {
      console.log('Invalid file selected:', file);
      setDebugInfo('请选择有效的图片文件');
    }
  };

  const handleImageLoad = () => {
    console.log('Image loaded, processing with OpenCV...');
    setDebugInfo('图片已加载，正在处理...');
    
    if (!isLoaded) {
      setDebugInfo('OpenCV 尚未加载完成');
      return;
    }
    
    if (!window.cv) {
      setDebugInfo('OpenCV 对象不可用');
      return;
    }
    
    if (!imageRef.current || !canvasRef.current) {
      setDebugInfo('图片或画布元素不可用');
      return;
    }

    // 添加超时处理
    const processingTimeout = setTimeout(() => {
      setDebugInfo('处理超时，请尝试重新选择图片');
    }, 10000); // 10秒超时

    try {
      const cv = window.cv;
      const img = imageRef.current;
      const canvas = canvasRef.current;
      
      console.log('Image dimensions:', img.naturalWidth, 'x', img.naturalHeight);
      console.log('Image complete:', img.complete);
      console.log('Image src:', img.src);
      
      setDebugInfo(`图片尺寸: ${img.naturalWidth} x ${img.naturalHeight}`);
      
      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        setDebugInfo('图片尺寸无效，请检查图片文件');
        clearTimeout(processingTimeout);
        return;
      }
      
      // 设置canvas尺寸
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      console.log('Canvas dimensions set:', canvas.width, 'x', canvas.height);
      setDebugInfo('正在创建 OpenCV Mat...');
      
      // 创建OpenCV Mat
      const mat = cv.imread(img);
      console.log('Mat created:', mat.rows, 'x', mat.cols, 'channels:', mat.channels());
      setDebugInfo(`Mat 创建成功: ${mat.rows} x ${mat.cols}, 通道数: ${mat.channels()}`);
      
      if (mat.empty()) {
        setDebugInfo('创建的 Mat 对象为空');
        mat.delete();
        clearTimeout(processingTimeout);
        return;
      }
      
      setDebugInfo('正在显示图片到 Canvas...');
      
      // 直接显示原图
      cv.imshow(canvas, mat);
      console.log('Image displayed on canvas');
      
      // 清理内存
      mat.delete();
      console.log('Mat deleted, processing complete');
      
      clearTimeout(processingTimeout);
      setImageLoaded(true);
      setDebugInfo('图片处理完成');
      
    } catch (error) {
      console.error('OpenCV processing error:', error);
      clearTimeout(processingTimeout);
      setDebugInfo(`处理错误: ${error instanceof Error ? error.message : String(error)}`);
      
      // 如果是重复注册错误，建议刷新页面
      if (error instanceof Error && error.message.includes('register')) {
        setDebugInfo('检测到 OpenCV 重复注册错误，请刷新页面重试');
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resetProcessing = () => {
    setSelectedFile(null);
    setImageLoaded(false);
    setDebugInfo('已重置，可以重新选择图片');
    
    // 清理canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const fallbackDisplayImage = (retryCount = 0) => {
    console.log(`=== Fallback Display Image Started (attempt ${retryCount + 1}) ===`);
    
    if (!imageRef.current || !canvasRef.current) {
      console.error('Missing elements:', {
        imageRef: !!imageRef.current,
        canvasRef: !!canvasRef.current
      });
      setDebugInfo('无法使用fallback方法：缺少必要元素');
      return;
    }

    const img = imageRef.current;
    const canvas = canvasRef.current;
    
    console.log('Image element details:', {
      src: img.src,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
      width: img.width,
      height: img.height
    });

    // 检查图片是否已加载且有有效尺寸
    if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
      if (retryCount >= 50) { // 最多重试5秒 (50 * 100ms)
        console.error('Image load timeout after 5 seconds');
        setDebugInfo('图片加载超时，请检查图片文件');
        return;
      }
      
      console.log(`Image not ready, waiting for load... (attempt ${retryCount + 1})`);
      setDebugInfo(`等待图片加载... (${retryCount + 1}/50)`);
      
      // 等待图片加载
      setTimeout(() => {
        fallbackDisplayImage(retryCount + 1);
      }, 100);
      return;
    }

    try {
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Cannot get 2D context from canvas');
        setDebugInfo('无法获取Canvas 2D上下文');
        return;
      }

      console.log('Canvas context obtained successfully');

      // 设置canvas尺寸
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      console.log('Canvas dimensions set:', {
        width: canvas.width,
        height: canvas.height
      });

      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      console.log('Canvas cleared');

      // 使用Canvas 2D API绘制图片
      ctx.drawImage(img, 0, 0);
      console.log('Image drawn to canvas successfully');
      
      // 验证绘制结果（只在有尺寸时获取像素数据）
      if (canvas.width > 0 && canvas.height > 0) {
        const imageData = ctx.getImageData(0, 0, Math.min(10, canvas.width), Math.min(10, canvas.height));
        console.log('Sample pixel data (first few pixels):', Array.from(imageData.data.slice(0, 12)));
      }
      
      setImageLoaded(true);
      setDebugInfo('使用Canvas 2D API显示图片成功');
      console.log('=== Fallback Display Image Completed Successfully ===');
      
    } catch (error) {
      console.error('=== Fallback Display Image Error ===');
      console.error('Error details:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      setDebugInfo(`Fallback方法失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const retryProcessing = () => {
    if (imageRef.current && selectedFile) {
      setImageLoaded(false);
      setDebugInfo('重新处理图片...');
      // 触发重新处理
      setTimeout(() => handleImageLoad(), 100);
    }
  };

  const tryFallback = () => {
    setDebugInfo('尝试使用fallback方法...');
    fallbackDisplayImage(0); // 重置重试计数
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            OpenCV WebAssembly 图像显示器
          </h1>
          <p className="text-gray-600">
            选择一张图片文件来加载和显示
          </p>
        </div>

        {/* OpenCV加载状态 */}
        <div className="mb-6 text-center">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isLoaded 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isLoaded ? 'bg-green-400' : 'bg-yellow-400'
            }`}></div>
            {isLoaded ? 'OpenCV 已加载' : '正在加载 OpenCV...'}
          </div>
        </div>

        {/* 调试信息 */}
        {debugInfo && (
          <div className="mb-4 text-center">
            <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
              {debugInfo}
            </div>
            {/* 添加操作按钮 */}
            {(debugInfo.includes('超时') || debugInfo.includes('错误') || debugInfo.includes('处理图片...')) && (
              <div className="mt-2 space-x-2">
                <button
                  onClick={retryProcessing}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  重试处理
                </button>
                <button
                  onClick={tryFallback}
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                >
                  简单显示
                </button>
                <button
                  onClick={resetProcessing}
                  className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                >
                  重置
                </button>
                {debugInfo.includes('重复注册') && (
                  <button
                    onClick={() => window.location.reload()}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                  >
                    刷新页面
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 文件选择区域 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div 
            onClick={triggerFileInput}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <svg 
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              stroke="currentColor" 
              fill="none" 
              viewBox="0 0 48 48"
            >
              <path 
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                strokeWidth={2} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            <p className="text-gray-600 mb-2">
              点击这里选择图片文件
            </p>
            <p className="text-sm text-gray-500">
              支持 PNG, JPG, JPEG 格式
            </p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {selectedFile && (
            <div className="mt-4 text-sm text-gray-600">
              已选择: {selectedFile.name}
            </div>
          )}
        </div>

        {/* 图像显示区域 */}
        {selectedFile && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              图像显示
            </h2>
            
            {/* 原始图片显示 - 用于调试 */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">原始图片（调试用）：</h3>
              <img
                ref={imageRef}
                src={imageUrl}
                onLoad={handleImageLoad}
                onError={(e) => {
                  console.error('Image load error:', e);
                  setDebugInfo('图片加载失败');
                }}
                className="max-w-xs h-auto border border-gray-300 rounded"
                alt="Source"
                style={{ display: imageUrl ? 'block' : 'none' }}
              />
              {/* 显示图片状态 */}
              <div className="mt-1 text-xs text-gray-500">
                {imageRef.current ? (
                  `状态: ${imageRef.current.complete ? '已加载' : '加载中'} | 
                   尺寸: ${imageRef.current.naturalWidth || 0} x ${imageRef.current.naturalHeight || 0}`
                ) : '图片元素未找到'}
              </div>
            </div>
            
            {/* 显示区域 */}
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-700 mb-2">OpenCV 处理后：</h3>
              
              {/* 直接添加操作按钮 */}
              <div className="mb-4 space-x-2">
                <button
                  onClick={tryFallback}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  使用简单显示
                </button>
                <button
                  onClick={retryProcessing}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  重试OpenCV
                </button>
                <button
                  onClick={resetProcessing}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  重置
                </button>
              </div>
              
              {!isLoaded && (
                <div className="py-8 text-gray-500">
                  等待 OpenCV 加载完成...
                </div>
              )}
              
              {isLoaded && !imageLoaded && (
                <div className="py-8 text-gray-500">
                  正在处理图片...
                </div>
              )}
              
              {/* OpenCV处理后的canvas */}
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto border border-gray-300 rounded-lg shadow-sm"
                style={{ display: imageLoaded ? 'block' : 'none', margin: '0 auto' }}
              />
              
              {/* 如果处理失败，显示fallback */}
              {isLoaded && !imageLoaded && debugInfo.includes('错误') && (
                <div className="py-4 text-red-500">
                  OpenCV 处理失败，但您可以看到上方的原始图片
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
