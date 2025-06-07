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

    # 编译优化选项（注释说明已集成）
    target_compile_options(opencv-wasm-demo PRIVATE
        -Oz                        # 更激进的体积优化
        -flto                      # Link-Time Optimization
        -fno-exceptions            # 如果未用 try/catch
        # -fno-rtti                  # 不使用 C++ RTTI
        -ffunction-sections
        -fdata-sections
        -fvisibility=hidden
        -DOPENCV_DISABLE_THREAD_SUPPORT  # 精简 OpenCV 的线程依赖
        -DWASM_EXPORT              # 如果你代码中使用这个宏控制导出
    )

    target_link_options(opencv-wasm-demo PRIVATE
        -flto
        --gc-sections
        -Wl,--strip-all
    )
    
    # 设置输出目录
    set_target_properties(opencv-wasm-demo PROPERTIES
        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/dist"
    )
endif()
