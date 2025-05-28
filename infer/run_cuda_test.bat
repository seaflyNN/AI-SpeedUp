@echo off
echo Running CUDA Test...

REM 设置CUDA路径
set PATH=C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.6\bin;%PATH%

REM 检查文件是否存在
if not exist "build\Release\cuda_test.exe" (
    echo Error: cuda_test.exe not found!
    pause
    exit /b 1
)

REM 运行程序
echo Starting cuda_test.exe...
build\Release\cuda_test.exe

echo.
echo Program finished. Press any key to continue...
pause 