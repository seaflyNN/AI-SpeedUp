@echo off
echo TensorRT C++ Demo 构建脚本
echo ========================

:: 检查是否存在build目录
if not exist build (
    echo 创建build目录...
    mkdir build
)

:: 进入build目录
cd build

:: 生成CMake项目文件
echo 生成CMake项目文件...
cmake .. -G "Visual Studio 17 2022" -A x64

:: 检查CMake是否成功
if %ERRORLEVEL% neq 0 (
    echo CMake生成失败，尝试使用Visual Studio 2019...
    cmake .. -G "Visual Studio 16 2019" -A x64
    if %ERRORLEVEL% neq 0 (
        echo CMake生成失败！请检查环境配置。
        pause
        exit /b 1
    )
)

:: 编译项目
echo 编译项目...
cmake --build . --config Release

:: 检查编译是否成功
if %ERRORLEVEL% neq 0 (
    echo 编译失败！请检查错误信息。
    pause
    exit /b 1
)

echo.
echo 构建成功！
echo 可执行文件位置: build\Release\tensorrt_demo.exe
echo.
echo 按任意键运行程序...
pause > nul

:: 运行程序
cd ..
.\build\Release\tensorrt_demo.exe

pause 