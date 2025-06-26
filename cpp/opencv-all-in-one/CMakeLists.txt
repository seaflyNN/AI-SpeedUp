cmake_minimum_required(VERSION 3.25)

project(ImageProcess VERSION 1.0)

if(MSVC)
  set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")
endif()

include(CTest)
enable_testing()

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# 设置构建类型为Debug，并限制配置类型
set(CMAKE_BUILD_TYPE Debug)
set(CMAKE_CONFIGURATION_TYPES "Debug" CACHE STRING "限制构建配置" FORCE)

# 设置 OpenCV 源码和安装目录
set(OpenCV_SOURCE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/3rd/opencv-4.10.0")
set(OpenCV_INSTALL_DIR "${CMAKE_CURRENT_SOURCE_DIR}/3rd/install")

include(cmake/opencv-cmake-option.cmake)

# 设置 OpenCV 构建目录
set(OpenCV_BUILD_DIR "${CMAKE_BINARY_DIR}/opencv_build")

message("---->${OpenCV_CMAKE_ARGS}")

# 使用 ExternalProject 来自动构建 OpenCV
include(ExternalProject)

ExternalProject_Add(
    OpenCV
    PREFIX ${OpenCV_BUILD_DIR}
    SOURCE_DIR ${OpenCV_SOURCE_DIR}
    CMAKE_ARGS -DCMAKE_INSTALL_PREFIX=${OpenCV_INSTALL_DIR}
               -DCMAKE_BUILD_TYPE=${CMAKE_BUILD_TYPE}
               ${OpenCV_CMAKE_ARGS}
    INSTALL_DIR ${OpenCV_INSTALL_DIR}
)

# 方案2：两阶段编译
# 设置正确的OpenCV路径（指向静态库目录）
set(OpenCV_DIR "${OpenCV_INSTALL_DIR}/x64/vc17/staticlib")

# 检查是否为第一阶段构建（只构建OpenCV）
if(DEFINED BUILDING_OPENCV_ONLY)
    message(STATUS "🔧 第一阶段：仅构建OpenCV...")
    # 第一阶段不执行后续的find_package和主项目配置
    return()
endif()

# 检查OpenCV是否已经正确构建完成
set(OpenCV_STATIC_LIB_DIR "${OpenCV_INSTALL_DIR}/x64/vc17/staticlib")
if(NOT EXISTS "${OpenCV_DIR}/OpenCVConfig.cmake" OR NOT EXISTS "${OpenCV_STATIC_LIB_DIR}")
    message("")
    message("============================================================")
    message("🔧 OpenCV尚未构建或构建不完整！")
    message("")
    message("请按照以下步骤进行两阶段编译：")
    message("")
    message("📋 步骤1：先清理并构建OpenCV")
    message("   rd /s /q build")
    message("   rd /s /q 3rd\\install")
    message("   cmake -S . -B build -DBUILDING_OPENCV_ONLY=ON")
    message("   cmake --build build --target OpenCV")
    message("")
    message("📋 步骤2：重新配置并构建主项目") 
    message("   cmake -S . -B build")
    message("   cmake --build build")
    message("")
    message("💡 提示：或者直接运行 build.bat 脚本")
    message("============================================================")
    message("")
    message(FATAL_ERROR "请先构建OpenCV，然后重新运行cmake配置")
endif()

message("===============================================")
# OpenCV已构建，使用标准find_package
find_package(OpenCV REQUIRED)

message(STATUS "✅ 找到OpenCV版本: ${OpenCV_VERSION}")
message(STATUS "   库文件: ${OpenCV_LIBS}")
message(STATUS "   包含目录: ${OpenCV_INCLUDE_DIRS}")
message(STATUS "   配置文件: ${OpenCV_DIR}/OpenCVConfig.cmake")

# 添加主项目的源文件
add_subdirectory(src)
