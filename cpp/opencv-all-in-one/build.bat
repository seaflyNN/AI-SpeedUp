chcp 65001

@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo 🚀 OpenCV 项目自动构建脚本
echo ============================================================
echo.

:: 清理之前的构建（避免兼容性问题）
echo 🧹 清理之前的构建产物...
if exist "build" (
    echo    删除 build 目录...
    rd /s /q build
)
if exist "3rd\install" (
    echo    删除 OpenCV 安装目录...
    rd /s /q 3rd\install
)

echo 📋 第一阶段：配置项目并构建 OpenCV...
echo.

:: 第一阶段配置项目（仅构建OpenCV）
cmake -S . -B build -DBUILDING_OPENCV_ONLY=ON
if !errorlevel! neq 0 (
    echo ❌ CMake 配置失败！
    goto :error
)

:: 构建 OpenCV Debug 版本
echo 🔧 正在构建 OpenCV Debug 版本（这可能需要较长时间）...
cmake --build build --target OpenCV --config Debug
if !errorlevel! neq 0 (
    echo ❌ OpenCV Debug 版本构建失败！
    goto :error
)

echo.
echo ✅ OpenCV Debug 版本构建完成！
echo.

:: 构建 OpenCV Release 版本
echo 🔧 正在构建 OpenCV Release 版本（这可能需要较长时间）...
cmake --build build --target OpenCV --config Release
if !errorlevel! neq 0 (
    echo ❌ OpenCV Release 版本构建失败！
    goto :error
)

echo.
echo ✅ OpenCV Debug 和 Release 版本构建完成！
echo.

echo 📋 第二阶段：重新配置并构建主项目...
echo.

:: 清理构建目录以避免缓存问题
rd /s /q build

:: 重新配置项目（支持多配置）
cmake -S . -B build
if !errorlevel! neq 0 (
    echo ❌ 重新配置失败！
    goto :error
)

:: 构建主项目 Debug 版本
echo 🔧 构建主项目 Debug 版本...
cmake --build build --config Debug
if !errorlevel! neq 0 (
    echo ❌ 主项目 Debug 版本构建失败！
    goto :error
)

:: 构建主项目 Release 版本
echo 🔧 构建主项目 Release 版本...
cmake --build build --config Release
if !errorlevel! neq 0 (
    echo ❌ 主项目 Release 版本构建失败！
    goto :error
)

echo.
echo ============================================================
echo 🎉 构建成功完成！
echo.
echo 💡 可执行文件位置：
echo    Debug 版本:   %cd%\build\src\Debug\main.exe
echo    Release 版本: %cd%\build\src\Release\main.exe
echo.
echo 🚀 运行程序：
echo    Debug 版本:   .\build\src\Debug\main.exe
echo    Release 版本: .\build\src\Release\main.exe
echo.
echo 📚 OpenCV 库文件：
echo    Debug 库:     %cd%\3rd\install\x64\vc17\staticlib\*4100d.lib
echo    Release 库:   %cd%\3rd\install\x64\vc17\staticlib\*4100.lib
echo ============================================================
echo.

goto :end

:error
echo.
echo ============================================================
echo ❌ 构建过程中出现错误！
echo.
echo 💡 常见问题解决方案：
echo    1. 确保已安装 Visual Studio 和 CMake
echo    2. 检查网络连接（OpenCV 可能需要下载依赖）
echo    3. 删除 build 目录后重新运行
echo ============================================================
echo.
exit /b 1

:end
echo 按任意键退出...
pause >nul
