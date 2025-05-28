@echo off
echo Running TensorRT Demo...

REM 设置环境路径
set PATH=D:\software\develop\TensorRT-10.11.0.33\lib;%PATH%
set PATH=C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.6\bin;%PATH%

REM 检查文件是否存在
if not exist "build\Release\tensorrt_demo.exe" (
    echo Error: tensorrt_demo.exe not found!
    echo Please make sure the project is built successfully.
    pause
    exit /b 1
)

if not exist "model\resnet_engine_intro.engine" (
    echo Error: Engine file not found!
    echo Please make sure model\resnet_engine_intro.engine exists.
    pause
    exit /b 1
)

REM 运行程序
echo Starting TensorRT Demo...
echo Engine file: model\resnet_engine_intro.engine
echo.
build\Release\tensorrt_demo.exe

echo.
echo Program finished. Press any key to continue...
pause 