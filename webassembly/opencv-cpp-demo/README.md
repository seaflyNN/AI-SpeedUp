# OpenCV WebAssembly 演示项目

这是一个使用 C++ 和 OpenCV 构建的 WebAssembly 项目，可以在浏览器中进行实时图像处理。

## 项目结构

```
webassembly/opencv-cpp-demo/
├── 3rd/
│   └── opencv-4.11/           # OpenCV 库文件
├── src/
│   ├── main.cpp              # 主程序入口
│   ├── opencv_interface.h    # 接口头文件
│   └── opencv_interface.cpp  # 接口实现
├── build/                    # 构建输出目录
├── dist/                     # 最终输出目录
├── CMakeLists.txt           # CMake 配置文件
├── build.sh                 # Linux/Mac 构建脚本
├── build.bat                # Windows 构建脚本
├── test.html                # 测试网页
└── README.md                # 说明文档
```

## 功能特性

### 已实现的功能

1. **基础图像处理**
   - 高斯模糊
   - Canny 边缘检测
   - 中值滤波
   - 形态学操作

2. **图像变换**
   - 图像缩放
   - 图像旋转
   - 图像翻转

3. **颜色空间转换**
   - BGR 到灰度
   - BGR 到 RGB
   - BGR 到 HSV

4. **阈值处理**
   - 二值化
   - 自适应阈值

### 导出的 JavaScript 接口

- `initialize()` - 初始化模块
- `processImage()` - 通用图像处理函数
- `createMat()` - 创建 Mat 对象
- `destroyMat()` - 销毁 Mat 对象
- `getMatData()` - 获取 Mat 数据
- `applyGaussianBlur()` - 高斯模糊
- `applyCanny()` - Canny 边缘检测
- `resize()` - 图像缩放
- `rotate()` - 图像旋转
- `convertColor()` - 颜色空间转换
- `threshold()` - 阈值处理

## 环境要求

1. **Emscripten SDK**
   ```bash
   # 安装 Emscripten
   git clone https://github.com/emscripten-core/emsdk.git
   cd emsdk
   ./emsdk install latest
   ./emsdk activate latest
   source ./emsdk_env.sh
   ```

2. **CMake** (版本 3.16 或更高)

3. **OpenCV 4.11** (已包含在 3rd 目录中)

## 构建步骤

### Linux/Mac

```bash
# 确保已激活 Emscripten 环境
source /path/to/emsdk/emsdk_env.sh

# 运行构建脚本
chmod +x build.sh
./build.sh
```

### Windows

```batch
# 确保已激活 Emscripten 环境
call "C:\path\to\emsdk\emsdk_env.bat"

# 运行构建脚本
build.bat
```

### 手动构建

```bash
# 创建构建目录
mkdir build && cd build

# 配置 CMake
emcmake cmake .. -DCMAKE_BUILD_TYPE=Release

# 编译
emmake make -j4
```

## 使用方法

1. **构建项目**
   ```bash
   ./build.sh
   ```

2. **启动本地服务器**
   ```bash
   # 使用 Python
   python -m http.server 8000
   
   # 或使用 Node.js
   npx http-server
   ```

3. **打开浏览器**
   访问 `http://localhost:8000/test.html`

4. **测试功能**
   - 上传图片
   - 选择处理类型
   - 调整参数
   - 查看处理结果

## JavaScript 使用示例

```javascript
// 加载 WebAssembly 模块
const module = await OpenCVModule();

// 初始化
module.initialize();

// 创建 Mat 对象
const matId = module.createMat(640, 480, module.CV_8UC3);

// 应用高斯模糊
module.applyGaussianBlur(matId, 15, 2.0, 2.0);

// 应用 Canny 边缘检测
module.applyCanny(matId, 100, 200);

// 获取处理结果
const data = module.getMatData(matId);
const width = module.getMatWidth(matId);
const height = module.getMatHeight(matId);

// 清理资源
module.destroyMat(matId);
```

## 性能优化

1. **编译优化**
   - 使用 `-O3` 优化级别
   - 启用 SIMD 指令
   - 内存对齐优化

2. **内存管理**
   - 及时释放 Mat 对象
   - 使用内存池
   - 避免内存碎片

3. **算法优化**
   - 选择合适的算法参数
   - 避免不必要的数据拷贝
   - 使用 OpenCV 的优化函数

## 扩展功能

### 添加新的图像处理函数

1. 在 `opencv_interface.h` 中声明函数
2. 在 `opencv_interface.cpp` 中实现函数
3. 在 `main.cpp` 的 `EMSCRIPTEN_BINDINGS` 中导出函数
4. 重新编译项目

### 示例：添加直方图均衡化

```cpp
// opencv_interface.h
int equalizeHist(int matId);

// opencv_interface.cpp
int equalizeHist(int matId) {
    auto mat = MatManager::getMat(matId);
    if (!mat) return -1;
    
    try {
        cv::Mat gray;
        if (mat->channels() > 1) {
            cv::cvtColor(*mat, gray, cv::COLOR_BGR2GRAY);
        } else {
            gray = *mat;
        }
        cv::equalizeHist(gray, *mat);
        return 0;
    } catch (...) {
        return -1;
    }
}

// main.cpp
EMSCRIPTEN_BINDINGS(opencv_module) {
    // ... 其他绑定
    function("equalizeHist", &equalizeHist);
}
```

## 故障排除

### 常见问题

1. **编译错误**
   - 检查 Emscripten 环境是否正确激活
   - 确认 OpenCV 库路径正确
   - 验证 CMake 版本是否符合要求

2. **运行时错误**
   - 检查浏览器开发者工具的控制台
   - 确认 WebAssembly 文件加载成功
   - 验证函数调用参数是否正确

3. **性能问题**
   - 检查是否使用了 Release 模式编译
   - 优化图像尺寸
   - 减少不必要的数据转换

## 许可证

本项目基于 MIT 许可证开源。

## 贡献

 