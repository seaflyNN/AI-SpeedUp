# TensorRT C++ Demo

基于NVIDIA TensorRT官方教程的CMake版本C++ demo项目。

## 项目状态

✅ **CUDA环境测试成功** - 检测到 NVIDIA GeForce RTX 4070 Laptop GPU
✅ **基本构建系统工作正常** 
✅ **TensorRT主程序成功运行** - 完整的推理流程工作正常！

## 环境配置

- **TensorRT**: D:\software\develop\TensorRT-10.11.0.33
- **CUDA**: C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.6
- **GPU**: NVIDIA GeForce RTX 4070 Laptop GPU (Compute Capability 8.9)

## 项目结构

```
tensorRT-demo/
├── src/                     # 源代码目录
│   ├── main.cpp            # TensorRT主程序 ✅
│   ├── logger.h/cpp        # TensorRT日志器 ✅
│   ├── utils.h/cpp         # 工具函数 ✅
│   ├── hello_test.cpp      # Hello World测试 ✅
│   ├── simple_test.cpp     # 简单CUDA测试 ✅
│   └── cuda_only_test.cpp  # 完整CUDA测试 ✅
├── model/                   # 模型文件目录
│   └── resnet_engine_intro.engine  # ResNet引擎文件 (125MB) ✅
├── build/                   # 构建目录
│   └── Release/            # 发布版本可执行文件
│       ├── tensorrt_demo.exe ✅ TensorRT主程序
│       ├── hello_test.exe  ✅ 基本C++测试
│       ├── simple_test.exe ✅ 简单CUDA测试
│       └── cuda_test.exe   ✅ 完整CUDA测试
├── CMakeLists.txt          # CMake配置文件 ✅
├── run_cuda_test.bat       # CUDA测试运行脚本 ✅
├── run_tensorrt_demo.bat   # TensorRT主程序运行脚本 ✅
└── README.md              # 项目说明文档
```

## 成功运行的程序

### 1. 🚀 TensorRT主程序 (tensorrt_demo.exe)

**完整的TensorRT推理演示！**

```bash
# 运行TensorRT主程序
.\run_tensorrt_demo.bat
```

**运行结果示例:**
```
TensorRT C++ Demo
=================
Found 1 CUDA device(s)
Using device: NVIDIA GeForce RTX 4070 Laptop GPU
Loading engine file: model/resnet_engine_intro.engine
Engine file size: 130912892 bytes
Engine loaded successfully!

=== Engine Information ===
Engine name: Unnamed Network 0
Number of I/O tensors: 2

Tensor 0:
  Name: gpu_0/data_0
  Type: Input
  Data type: 0
  Shape 维度: [1, 3, 224, 224]
  Size: 602112 bytes

Tensor 1:
  Name: gpu_0/softmax_1
  Type: Output
  Data type: 0
  Shape 维度: [1, 1000]

=== Starting Inference ===
Input tensor 'gpu_0/data_0' data prepared (602112 bytes)
Output tensor 'gpu_0/softmax_1' buffer allocated (4000 bytes)
Executing inference...
Inference completed! Time taken: 28 ms
Output tensor 'gpu_0/softmax_1' data retrieved
  First 10 output values: 1.77423e-05 0.000367393 0.000454442 ...

Program completed successfully!
```

### 2. CUDA环境测试 (cuda_test.exe)

```bash
# 运行CUDA测试
.\run_cuda_test.bat
```

**输出示例:**
```
CUDA Only Test Program
======================
Found 1 CUDA device(s)

Device 0: NVIDIA GeForce RTX 4070 Laptop GPU
  Compute capability: 8.9
  Global memory: 8187 MB
  Max threads per block: 1024

=== Memory Test ===
Memory test PASSED: 1000 elements copied successfully

CUDA test completed successfully!
```

### 3. Hello World测试 (hello_test.exe)

基本C++程序测试，验证编译环境正常。

### 4. 简单CUDA测试 (simple_test.exe)

检测CUDA设备信息的简化版本。

## 构建说明

### 要求

- Windows 10/11
- Visual Studio 2019/2022
- CMake 3.12+
- CUDA Toolkit 12.6
- TensorRT 10.11.0.33

### 构建步骤

1. **克隆项目**
```bash
git clone <your-repo>
cd tensorRT-demo
```

2. **配置构建**
```bash
mkdir build
cd build
cmake ..
```

3. **编译项目**
```bash
cmake --build . --config Release
```

4. **运行演示**
```bash
# 运行完整TensorRT演示
.\run_tensorrt_demo.bat

# 或运行CUDA测试
.\run_cuda_test.bat
```

## 主要特性

### TensorRTInference类 ✅

- ✅ 引擎文件加载和反序列化 (130MB ResNet模型)
- ✅ 执行上下文创建和管理
- ✅ 完整的内存管理和错误处理
- ✅ 推理执行和性能测量 (28ms推理时间)
- ✅ 输入输出张量处理

### 工具函数 ✅

- `loadEngineFile()` - 加载引擎文件
- `getTensorSize()` - 计算张量大小
- `printDims()` - 打印维度信息
- `getElementSize()` - 获取元素大小

### 性能表现

- **模型**: ResNet (1000类分类)
- **输入**: 224x224x3 RGB图像 (602KB)
- **输出**: 1000维概率分布 (4KB)
- **推理时间**: ~28ms (NVIDIA RTX 4070 Laptop GPU)
- **引擎大小**: 130MB

## 技术亮点

1. **现代C++设计** - 原始指针管理适配TensorRT 10.x引用计数
2. **完整错误处理** - 包含详细的错误检查和异常处理
3. **性能测量** - 精确的推理时间测量
4. **内存管理** - CUDA内存分配和GPU-CPU数据传输
5. **模块化设计** - 清晰的代码结构和功能分离

## 故障排除

### 常见问题

1. **CUDA测试失败**
   - 确保安装了NVIDIA显卡驱动
   - 检查CUDA Toolkit安装

2. **编译错误**
   - 检查Visual Studio版本兼容性
   - 确认CMake路径配置正确

3. **库链接错误**
   - 验证TensorRT安装路径
   - 使用正确的TensorRT 10.x库名称 (nvinfer_10.lib)

## 使用自定义模型

要使用自己的TensorRT引擎文件：

1. 将`.engine`文件放入`model/`目录
2. 修改`main.cpp`中的文件路径：
```cpp
std::string engineFile = "model/your_model.engine";
```
3. 重新编译并运行

## 性能优化建议

- 使用FP16精度提升推理速度
- 启用动态batch size支持
- 考虑使用TensorRT的优化配置文件
- 针对特定GPU架构优化

## 相关资源

- [TensorRT官方文档](https://docs.nvidia.com/deeplearning/tensorrt/)
- [TensorRT样例代码](https://github.com/NVIDIA/TensorRT)
- [CUDA编程指南](https://docs.nvidia.com/cuda/)

## 许可证

本项目遵循MIT许可证。详情请参见LICENSE文件。

---

🎉 **项目完成！** 所有组件都成功运行，包括完整的TensorRT推理流程。 