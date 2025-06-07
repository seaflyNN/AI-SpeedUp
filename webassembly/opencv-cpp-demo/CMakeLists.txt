cmake_minimum_required(VERSION 3.16)
project(opencv-wasm-demo)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(OpenCV_DIR "${CMAKE_SOURCE_DIR}/3rd/opencv/lib/cmake/opencv4")
# 查找 OpenCV 包
find_package(OpenCV REQUIRED)

add_executable(opencv-wasm-demo
    src/main.cpp
)
# 链接 OpenCV 库
target_link_libraries(opencv-wasm-demo ${OpenCV_LIBS})

# 包含 OpenCV 头文件
target_include_directories(opencv-wasm-demo PRIVATE ${OpenCV_INCLUDE_DIRS})

# 如果是 Emscripten 编译，添加导出函数
if(EMSCRIPTEN)
    set(CMAKE_EXECUTABLE_SUFFIX ".js")
    
    set_target_properties(opencv-wasm-demo PROPERTIES 
        LINK_FLAGS "-s WASM=1 -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 -s EXPORT_NAME=OpenCVModule -s EXPORTED_RUNTIME_METHODS=[ccall,cwrap,FS] -s SINGLE_FILE=1 -s EXPORTED_FUNCTIONS=[_main,_c_foo,_c_bar,_c_processFile,_malloc,_free] -s FORCE_FILESYSTEM=1 --bind"
    )
    
    # 设置输出目录
    set_target_properties(opencv-wasm-demo PROPERTIES
        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/dist"
    )
endif()
