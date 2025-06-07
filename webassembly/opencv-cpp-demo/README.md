# OpenCV WebAssembly 图像处理演示

这个项目展示了如何在WebAssembly中处理图像文件，提供了两种不同的接口来处理图像。

## 编译
```sh
# 激活 emsdk 环境
emcmake cmake .. -DCMAKE_BUILD_TYPE=Release ; cmake --build .
```

## 功能特性

### 1. `bar` 接口 - 内存数据处理
- 直接处理图像的二进制数据
- 适用于任何来源的图片（文件上传、网络下载等）
- 使用 `cv::imdecode` 解码图像数据

### 2. `processFile` 接口 - 虚拟文件系统处理
- 通过文件路径处理图像
- 需要先将文件写入Emscripten的虚拟文件系统
- 使用传统的 `cv::imread` 读取文件
- 包含完整的图像处理流程：灰度转换、高斯模糊、边缘检测

## 构建项目

### 前置要求
- Emscripten SDK
- OpenCV (通过Emscripten构建)
- CMake

### 构建步骤
1. 确保Emscripten环境已设置
2. 运行构建脚本：
```bash
chmod +x build.sh
./build.sh
```

## 使用方法

### 1. 基本使用
```javascript
// 等待模块加载
const module = await OpenCVModule();

// 创建文件处理器
const fileHandler = new OpenCVFileHandler(module);
```

### 2. 使用 bar 接口处理文件
```javascript
// 通过文件输入获取文件
const file = fileInput.files[0];
const arrayBuffer = await file.arrayBuffer();
const uint8Array = new Uint8Array(arrayBuffer);

// 分配WASM内存
const dataPtr = module._malloc(uint8Array.length);
module.HEAPU8.set(uint8Array, dataPtr);

// 调用处理函数
module.bar(dataPtr, uint8Array.length);

// 释放内存
module._free(dataPtr);
```

### 3. 使用 processFile 接口处理文件
```javascript
// 读取文件数据
const arrayBuffer = await file.arrayBuffer();
const uint8Array = new Uint8Array(arrayBuffer);

// 写入虚拟文件系统
const filename = '/tmp/image.png';
module.FS.writeFile(filename, uint8Array);

// 调用处理函数
module.processFile(filename);

// 读取处理后的文件
const processedFilename = filename + '_processed.png';
if (module.FS.analyzePath(processedFilename).exists) {
    const processedData = module.FS.readFile(processedFilename);
    // 使用处理后的数据...
}
```

## 接口说明

### C++ 接口

#### `void bar(uint8_t *data, int data_length)`
- 处理内存中的图像数据
- 参数：
  - `data`: 图像数据指针
  - `data_length`: 数据长度

#### `void processFile(const char* filepath)`
- 处理虚拟文件系统中的图像文件
- 参数：
  - `filepath`: 文件路径
- 功能：
  - 加载图像
  - 转换为灰度图
  - 应用高斯模糊
  - 进行边缘检测
  - 保存处理后的图像

### JavaScript 接口

#### 通过 Emscripten 绑定
```javascript
module.bar(dataPtr, dataLength);
module.processFile(filepath);
```

#### 通过 C 风格导出
```javascript
module.ccall('c_bar', null, ['number', 'number'], [dataPtr, dataLength]);
module.ccall('c_processFile', null, ['string'], [filepath]);
```

## 文件结构
```
opencv-cpp-demo/
├── src/
│   └── main.cpp          # 主要的C++代码
├── CMakeLists.txt        # CMake配置
├── build.sh              # 构建脚本
├── file-handler.js       # JavaScript文件处理工具
├── index.html            # 演示页面
└── README.md             # 说明文档
```

## 运行演示

1. 构建项目后，使用HTTP服务器运行：
```bash
python -m http.server 8000
# 或者
npx serve .
```

2. 在浏览器中打开 `http://localhost:8000/index.html`

3. 选择图像文件并测试不同的处理接口

## 注意事项

1. **CORS限制**: 需要通过HTTP服务器运行，不能直接打开HTML文件
2. **内存管理**: 使用`bar`接口时记得释放分配的内存
3. **文件格式**: 支持PNG、JPEG、GIF、BMP等常见图像格式
4. **虚拟文件系统**: `processFile`接口依赖Emscripten的虚拟文件系统

## 扩展功能

你可以轻松扩展现有接口：

1. 在`processFile`函数中添加更多图像处理算法
2. 添加新的接口处理特定的图像处理任务
3. 实现图像结果的返回机制
4. 添加批量处理功能 