# OpenBLAS 矩阵运算演示

这是一个使用 OpenBLAS 库进行矩阵运算的 C++ 演示项目。

## 项目结构

```
blas-demo/
├── CMakeLists.txt      # CMake 配置文件
├── build.bat           # Windows 构建脚本
├── README.md           # 说明文档
└── src/
    └── main.cpp        # 主要源代码
```

## 前置要求

1. **安装 vcpkg**（通过 scoop）：
   ```bash
   scoop install vcpkg
   ```

2. **安装 OpenBLAS**（通过 vcpkg）：
   ```bash
   vcpkg install openblas
   ```
   
   注意：也支持通过 scoop 安装的 OpenBLAS，但推荐使用 vcpkg 方式。

3. **安装 CMake**：
   ```bash
   scoop install cmake
   ```

4. **安装编译器**（任选其一）：
   - Visual Studio 2022 (推荐)
   - MinGW-w64

5. **重要：CMake 工具链配置**
   - 使用 vcpkg 安装的包时，必须告诉 CMake 使用 vcpkg 工具链
   - 工具链文件位置：`%USERPROFILE%\scoop\apps\vcpkg\current\scripts\buildsystems\vcpkg.cmake`

## 构建和运行

### 方法 1：使用构建脚本（推荐）

```bash
# 在项目根目录下运行
./build.bat
```

构建脚本会自动处理：
- vcpkg 工具链配置
- UTF-8 编码设置（解决中文字符编译警告）
- 控制台编码配置

### 方法 2：手动构建

#### 重要：CMake 工具链配置

由于我们使用 vcpkg 安装的 OpenBLAS，需要告诉 CMake 使用 vcpkg 工具链文件：

```bash
# 创建并进入构建目录
mkdir build
cd build

# 配置项目 - 使用 vcpkg 工具链（关键步骤）
cmake .. -DCMAKE_TOOLCHAIN_FILE="%USERPROFILE%\scoop\apps\vcpkg\current\scripts\buildsystems\vcpkg.cmake" -G "Visual Studio 17 2022" -A x64

# 或者使用绝对路径（如果上面的环境变量不工作）
cmake .. -DCMAKE_TOOLCHAIN_FILE=C:\Users\你的用户名\scoop\apps\vcpkg\current\scripts\buildsystems\vcpkg.cmake -G "Visual Studio 17 2022" -A x64

# 编译项目
cmake --build . --config Release

# 运行程序
Release/blas_demo.exe
```

#### 工具链配置说明

1. **为什么需要工具链文件？**
   - vcpkg 安装的包需要特定的 CMake 配置才能被找到
   - 工具链文件告诉 CMake 在哪里寻找 vcpkg 安装的库

2. **工具链文件路径：**
   - 标准路径：`%USERPROFILE%\scoop\apps\vcpkg\current\scripts\buildsystems\vcpkg.cmake`
   - 如果 vcpkg 安装在其他位置，请相应调整路径

3. **验证配置是否正确：**
   - 成功配置时会看到："找到 vcpkg 安装的 OpenBLAS"
   - 失败时会回退到寻找 scoop 安装的版本

#### 其他构建系统

如果使用 MinGW：
```bash
cmake .. -DCMAKE_TOOLCHAIN_FILE="%USERPROFILE%\scoop\apps\vcpkg\current\scripts\buildsystems\vcpkg.cmake" -G "MinGW Makefiles"
cmake --build .
```

## 功能演示

这个项目演示了以下 OpenBLAS 功能：

1. **矩阵乘法** - 使用 `cblas_dgemm` 进行 3×3 矩阵乘法
2. **向量点积** - 使用 `cblas_ddot` 计算两个向量的点积
3. **向量缩放** - 使用 `cblas_dscal` 对向量进行缩放操作

## 输出示例

```
=== OpenBLAS 矩阵运算演示 ===

矩阵 A:
    1.00     2.00     3.00 
    4.00     5.00     6.00 
    7.00     8.00     9.00 

矩阵 B:
    9.00     8.00     7.00 
    6.00     5.00     4.00 
    3.00     2.00     1.00 

结果矩阵 C = A × B:
   30.00    24.00    18.00 
   84.00    69.00    54.00 
  138.00   114.00    90.00 

=== 向量点积演示 ===

向量 x: 1 2 3 4 5 
向量 y: 5 4 3 2 1 
点积 x · y = 35

=== 向量缩放演示 ===

原始向量 z: 1 2 3 4 5 
缩放后 z (× 2.5): 2.5 5 7.5 10 12.5 

OpenBLAS 演示完成！
```

## 故障排除

如果遇到编译问题：

1. **找不到 OpenBLAS**：
   - 确保已通过 vcpkg 安装：`vcpkg install openblas`
   - 检查工具链文件路径是否正确
   - 验证 vcpkg 安装位置：`%USERPROFILE%\scoop\apps\vcpkg\current\`

2. **CMake 配置失败**：
   - 确保使用了正确的工具链文件参数：`-DCMAKE_TOOLCHAIN_FILE=...`
   - 检查工具链文件是否存在：`Test-Path "%USERPROFILE%\scoop\apps\vcpkg\current\scripts\buildsystems\vcpkg.cmake"`
   - 尝试使用绝对路径而不是环境变量

3. **工具链相关错误**：
   - 如果看到 "找不到 OpenBLAS" 错误，检查是否正确设置了工具链
   - 清理构建目录：`Remove-Item -Recurse -Force build`，然后重新配置
   - 确保 vcpkg 和 CMake 版本兼容

4. **链接错误**：
   - 检查是否安装了正确的编译器版本
   - 确保 Visual Studio 或 MinGW 已正确安装
   - 验证目标平台（x64 vs x86）匹配

5. **常见解决方案**：
   ```bash
   # 查看详细的 CMake 配置信息
   cmake .. -DCMAKE_TOOLCHAIN_FILE="%USERPROFILE%\scoop\apps\vcpkg\current\scripts\buildsystems\vcpkg.cmake" --debug-output
   
   # 清理并重新构建
   Remove-Item -Recurse -Force build
   mkdir build
   cd build
   # 然后重新配置
   ```

## 扩展

您可以基于这个项目继续探索：

- 更复杂的矩阵运算（LU 分解、特征值等）
- 性能基准测试
- 与其他 BLAS 实现的对比
- 多线程矩阵运算 