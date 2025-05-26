@echo off
setlocal enabledelayedexpansion

:: Set Qt path
set "QT_PATH=D:/software/Qt/Qt6.9/6.9.0/msvc2022_64"

:: Set build directory
set "BUILD_DIR=build"

:: Set install directory (absolute path)
set "INSTALL_DIR=D:/code/qt-cmake-serials/qt6-cmake-demo/install"

:: Create build directory if it doesn't exist
if not exist "%BUILD_DIR%" mkdir "%BUILD_DIR%"

:: Configure project
echo [INFO] Configuring project...
cmake -S . -B "%BUILD_DIR%" -DCMAKE_PREFIX_PATH="%QT_PATH%"
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Configuration failed!
    exit /b %ERRORLEVEL%
)

:: Build project
echo [INFO] Building project...
cmake --build "%BUILD_DIR%" --config Release
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Build failed!
    exit /b %ERRORLEVEL%
)

:: Install project
echo [INFO] Installing project...
cmake --install "%BUILD_DIR%" --config Release --prefix="%INSTALL_DIR%"
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Installation failed!
    exit /b %ERRORLEVEL%
)

echo [INFO] Build and installation completed successfully!
exit /b 0 