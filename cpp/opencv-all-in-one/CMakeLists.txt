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

set(OpenCV_DIR "${CMAKE_CURRENT_SOURCE_DIR}/3rd/install/x64/vc17/staticlib")
find_package(OpenCV REQUIRED)

message(STATUS "✅ 找到OpenCV版本: ${OpenCV_VERSION}")
message(STATUS "   库文件: ${OpenCV_LIBS}")
message(STATUS "   包含目录: ${OpenCV_INCLUDE_DIRS}")
message(STATUS "   配置文件: ${OpenCV_DIR}/OpenCVConfig.cmake")

# 添加主项目的源文件
add_subdirectory(src)
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

set(OpenCV_DIR "${CMAKE_CURRENT_SOURCE_DIR}/3rd/install/x64/vc17/staticlib")
find_package(OpenCV REQUIRED)

message(STATUS "✅ 找到OpenCV版本: ${OpenCV_VERSION}")
message(STATUS "   库文件: ${OpenCV_LIBS}")
message(STATUS "   包含目录: ${OpenCV_INCLUDE_DIRS}")
message(STATUS "   配置文件: ${OpenCV_DIR}/OpenCVConfig.cmake")

# 添加主项目的源文件
add_subdirectory(src)
