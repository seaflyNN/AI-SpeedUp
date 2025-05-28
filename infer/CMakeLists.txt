cmake_minimum_required(VERSION 3.12)
project(TensorRT_Demo)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# TensorRT路径
set(TENSORRT_ROOT "D:/software/develop/TensorRT-10.11.0.33")
set(CUDA_TOOLKIT_ROOT_DIR "C:/Program Files/NVIDIA GPU Computing Toolkit/CUDA/v12.6")

# 查找CUDA
find_package(CUDA REQUIRED)

# 包含目录
include_directories(${TENSORRT_ROOT}/include)
include_directories(${CUDA_TOOLKIT_ROOT_DIR}/include)

# 库目录
link_directories(${TENSORRT_ROOT}/lib)
link_directories(${CUDA_TOOLKIT_ROOT_DIR}/lib/x64)

# 添加调试信息
message(STATUS "TensorRT root: ${TENSORRT_ROOT}")
message(STATUS "CUDA root: ${CUDA_TOOLKIT_ROOT_DIR}")

# 检查TensorRT 10.x的库文件 - 使用新的命名规范
if(EXISTS "${TENSORRT_ROOT}/lib/nvinfer_10.lib")
    message(STATUS "Found nvinfer_10.lib")
else()
    message(WARNING "nvinfer_10.lib not found in ${TENSORRT_ROOT}/lib")
endif()

if(EXISTS "${CUDA_TOOLKIT_ROOT_DIR}/lib/x64/cudart.lib")
    message(STATUS "Found cudart.lib")
else()
    message(WARNING "cudart.lib not found in ${CUDA_TOOLKIT_ROOT_DIR}/lib/x64")
endif()

# Hello World测试程序
add_executable(hello_test
    src/hello_test.cpp
)

# 简单CUDA测试程序
add_executable(simple_test
    src/simple_test.cpp
)

target_link_libraries(simple_test
    cudart
)

# CUDA完整测试程序
add_executable(cuda_test
    src/cuda_only_test.cpp
)

target_link_libraries(cuda_test
    cudart
)

# TensorRT主程序 - 使用TensorRT 10.x的库名称
add_executable(tensorrt_demo
    src/main.cpp
    src/logger.cpp
    src/utils.cpp
)

# 链接TensorRT 10.x库 - 使用正确的库名称
target_link_libraries(tensorrt_demo
    nvinfer_10
    nvonnxparser_10
    cudart
)

# 设置运行时库路径
if(WIN32)
    set_target_properties(tensorrt_demo PROPERTIES
        VS_DEBUGGER_ENVIRONMENT "PATH=${TENSORRT_ROOT}/lib;${CUDA_TOOLKIT_ROOT_DIR}/bin;$ENV{PATH}")
    set_target_properties(simple_test PROPERTIES
        VS_DEBUGGER_ENVIRONMENT "PATH=${TENSORRT_ROOT}/lib;${CUDA_TOOLKIT_ROOT_DIR}/bin;$ENV{PATH}")
    set_target_properties(cuda_test PROPERTIES
        VS_DEBUGGER_ENVIRONMENT "PATH=${TENSORRT_ROOT}/lib;${CUDA_TOOLKIT_ROOT_DIR}/bin;$ENV{PATH}")
    set_target_properties(hello_test PROPERTIES
        VS_DEBUGGER_ENVIRONMENT "PATH=${TENSORRT_ROOT}/lib;${CUDA_TOOLKIT_ROOT_DIR}/bin;$ENV{PATH}")
endif() 