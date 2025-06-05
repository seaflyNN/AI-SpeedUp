cmake_minimum_required(VERSION 3.15)
project(blas_demo LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 查找 OpenBLAS - 优先使用 vcpkg 安装的版本
find_package(OpenBLAS CONFIG QUIET)

if(OpenBLAS_FOUND)
    message(STATUS "找到 vcpkg 安装的 OpenBLAS")
    set(OPENBLAS_TARGET OpenBLAS::OpenBLAS)
else()
    # 尝试使用 pkg-config 查找
    find_package(PkgConfig QUIET)
    if(PkgConfig_FOUND)
        pkg_check_modules(OPENBLAS openblas)
    endif()
    
    # 如果 pkg-config 也找不到，尝试手动查找 scoop 安装的版本
    if(NOT OPENBLAS_FOUND AND WIN32)
        message(STATUS "尝试查找 scoop 安装的 OpenBLAS")
        set(OPENBLAS_ROOT "$ENV{USERPROFILE}/scoop/apps/openblas/current")
        if(EXISTS "${OPENBLAS_ROOT}")
            set(OPENBLAS_INCLUDE_DIRS "${OPENBLAS_ROOT}/include")
            if(CMAKE_SIZEOF_VOID_P EQUAL 8)
                set(OPENBLAS_LIBRARIES "${OPENBLAS_ROOT}/lib/libopenblas.lib")
            else()
                set(OPENBLAS_LIBRARIES "${OPENBLAS_ROOT}/lib/libopenblas.lib")
            endif()
            set(OPENBLAS_FOUND TRUE)
        endif()
    endif()
    
    if(NOT OPENBLAS_FOUND)
        message(FATAL_ERROR "找不到 OpenBLAS！请通过以下方式之一安装：\n"
                           "  - vcpkg install openblas\n"
                           "  - scoop install openblas\n"
                           "  - 或手动安装并设置环境变量")
    endif()
endif()

# 添加可执行文件
add_executable(${PROJECT_NAME} src/main.cpp)

# 链接库 - 根据找到的 OpenBLAS 类型使用不同的链接方式
if(TARGET OpenBLAS::OpenBLAS)
    # vcpkg 安装的 OpenBLAS
    target_link_libraries(${PROJECT_NAME} PRIVATE OpenBLAS::OpenBLAS)
    message(STATUS "使用 vcpkg OpenBLAS 目标")
else()
    # 传统方式链接
    target_include_directories(${PROJECT_NAME} PRIVATE ${OPENBLAS_INCLUDE_DIRS})
    target_link_libraries(${PROJECT_NAME} PRIVATE ${OPENBLAS_LIBRARIES})
    message(STATUS "使用传统方式链接 OpenBLAS")
    message(STATUS "OpenBLAS 包含目录: ${OPENBLAS_INCLUDE_DIRS}")
    message(STATUS "OpenBLAS 库: ${OPENBLAS_LIBRARIES}")
endif()

# 设置编译选项
if(MSVC)
    target_compile_options(${PROJECT_NAME} PRIVATE /W4 /utf-8)
else()
    target_compile_options(${PROJECT_NAME} PRIVATE -Wall -Wextra -pedantic -finput-charset=utf-8 -fexec-charset=utf-8)
endif() 