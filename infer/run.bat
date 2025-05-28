@echo off
echo 运行TensorRT C++ Demo
echo ===================

:: 检查可执行文件是否存在
if not exist "build\Release\tensorrt_demo.exe" (
    echo 可执行文件不存在！请先运行 build.bat 编译项目。
    pause
    exit /b 1
)

:: 检查引擎文件是否存在
if not exist "model\resnet_engine_intro.engine" (
    echo 引擎文件不存在！请确保 model\resnet_engine_intro.engine 文件存在。
    pause
    exit /b 1
)

:: 运行程序
echo 正在运行程序...
echo.
.\build\Release\tensorrt_demo.exe

echo.
echo 程序运行完成。
pause 