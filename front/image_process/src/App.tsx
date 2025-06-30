import { createSignal, onMount, onCleanup } from "solid-js";
import { getCurrentWindow, DragDropEvent } from "@tauri-apps/api/window";

function App() {
  const [isDragOver, setIsDragOver] = createSignal(false);
  const [files, setFiles] = createSignal<(File | string)[]>([]);
  const [uploadStatus, setUploadStatus] = createSignal<string>("");

  onMount(async () => {
    const unlisten = await getCurrentWindow().onDragDropEvent((event) => {
      const payload = event.payload as DragDropEvent;
      switch (payload.type) {
        case "over":
          setIsDragOver(true);
          break;
        case "drop": {
          setIsDragOver(false);
          const imgPaths = payload.paths.filter((p: string) => /\.(jpe?g|png|gif|webp)$/i.test(p));
          if (imgPaths.length) {
            setFiles(imgPaths);
            setUploadStatus(`已选择 ${imgPaths.length} 个图片文件`);
          } else {
            setUploadStatus("请拖拽图片文件");
          }
          break;
        }
        case "leave":
          setIsDragOver(false);
      }
    });
    onCleanup(unlisten);
  });

  const handleFileInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      const selectedFiles = Array.from(input.files);
      const imageFiles = selectedFiles.filter(file => 
        file.type.startsWith('image/')
      );
      setFiles(imageFiles);
      setUploadStatus(`已选择 ${imageFiles.length} 个图片文件`);
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setUploadStatus("");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 兼容 fileDropEnabled=false 的情况（前端直接拿到 File 对象）
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer?.files || []);
    const imageFiles = droppedFiles.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length) {
      setFiles(imageFiles);
      setUploadStatus(`已选择 ${imageFiles.length} 个图片文件`);
    } else if (droppedFiles.length) {
      setUploadStatus("请拖拽图片文件");
    }
  };

  return (
    <div class="min-h-screen bg-base-100 p-8">
      <div class="max-w-4xl mx-auto">
        {/* Header */}
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-primary mb-2">图片处理工具</h1>
          <p class="text-base-content/70">拖拽图片文件开始处理</p>
        </div>

        {/* Drop Zone */}
        <div
          class={`
            border-2 border-dashed border-base-300 rounded-lg p-12 text-center transition-all duration-300
            ${isDragOver() ? 'drag-active border-primary bg-primary/5' : ''}
            hover:border-primary/50 hover:bg-base-200/50 cursor-pointer
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <div class="flex flex-col items-center gap-4">
            <div class="text-6xl text-base-content/30">📷</div>
            <div>
              <p class="text-xl font-semibold text-base-content">
                将图片文件拖拽到这里
              </p>
              <p class="text-base-content/70 mt-2">
                或点击选择文件
              </p>
            </div>
            <div class="badge badge-outline">
              支持 JPG, PNG, GIF, WebP 等格式
            </div>
          </div>
          
          <input
            id="file-input"
            type="file"
            multiple
            accept="image/*"
            class="hidden"
            onChange={handleFileInput}
          />
        </div>

        {/* Status */}
        {uploadStatus() && (
          <div class="alert alert-info mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{uploadStatus()}</span>
          </div>
        )}

        {/* File List */}
        {files().length > 0 && (
          <div class="mt-8">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold">选中的文件</h2>
              <button class="btn btn-outline btn-sm" onClick={clearFiles}>
                清空列表
              </button>
            </div>
            
            <div class="grid gap-4">
              {files().map((file, index) => {
                const name = typeof file === "string" ? file.split(/[\\/]/).pop() : file.name;
                const size = typeof file === "string" ? undefined : file.size;
                const type = typeof file === "string" ? "" : file.type;
                return (
                  <div class="card bg-base-200 shadow-sm">
                    <div class="card-body p-4">
                      <div class="flex items-center gap-4">
                        <div class="avatar">
                          <div class="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
                            <span class="text-primary font-bold">
                              {name?.split('.').pop()?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        
                        <div class="flex-1">
                          <h3 class="font-semibold text-base-content truncate">
                            {name}
                          </h3>
                          {size !== undefined && (
                            <div class="text-sm text-base-content/70">
                              大小: {formatFileSize(size)} | 类型: {type}
                            </div>
                          )}
                        </div>
                        
                        <div class="badge badge-primary">
                          #{index + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div class="flex gap-4 mt-6 justify-center">
              <button class="btn btn-primary btn-lg">
                开始处理
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              <button class="btn btn-outline btn-lg">
                预览
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 