chcp 65001
@echo off

echo 删除build-x64目录
rd /s /q build-x64
echo 删除build-x86目录
rd /s /q build-x86
echo 删除3rd/install目录
rd /s /q 3rd/install

echo "省略--prefix ./3rd/install/Debug"

echo 开始编译OpenCV x64

cmake -S ./3rd/opencv-4.10.0 -B build-x64 -A x64 -DBUILD_SHARED_LIBS=OFF -DBUILD_opencv_js=OFF -DBUILD_LIST=core,imgproc,imgcodecs -DBUILD_EXAMPLES=OFF -DBUILD_TESTS=OFF -DBUILD_PERF_TESTS=OFF -DBUILD_DOCS=OFF -DBUILD_opencv_apps=OFF -DBUILD_opencv_python_bindings_generator=OFF -DBUILD_opencv_ts=OFF -DBUILD_WITH_DEBUG_INFO=OFF -DWITH_ITT=OFF -DWITH_OPENCL=OFF -DWITH_TBB=OFF -DWITH_IPP=OFF -DWITH_QT=OFF -DWITH_GTK=OFF -DWITH_OPENGL=OFF -DWITH_FFMPEG=OFF -DWITH_JPEG=ON -DWITH_PNG=ON -DWITH_WEBP=OFF -DWITH_TIFF=OFF -DWITH_1394=OFF -DWITH_V4L=OFF -DWITH_GSTREAMER=OFF -DWITH_PROTOBUF=OFF -DWITH_ADE=OFF -D WITH_ZLIB=OFF -DCMAKE_INSTALL_PREFIX=./3rd/install

cmake --build build-x64 --config Release
cmake --build build-x64 --config Debug
cmake --install build-x64 --config Release
cmake --install build-x64 --config Debug

echo 开始编译OpenCV x86
cmake -S ./3rd/opencv-4.10.0 -B build-x86 -A Win32 -DBUILD_SHARED_LIBS=OFF -DBUILD_opencv_js=OFF -DBUILD_LIST=core,imgproc,imgcodecs -DBUILD_EXAMPLES=OFF -DBUILD_TESTS=OFF -DBUILD_PERF_TESTS=OFF -DBUILD_DOCS=OFF -DBUILD_opencv_apps=OFF -DBUILD_opencv_python_bindings_generator=OFF -DBUILD_opencv_ts=OFF -DBUILD_WITH_DEBUG_INFO=OFF -DWITH_ITT=OFF -DWITH_OPENCL=OFF -DWITH_TBB=OFF -DWITH_IPP=OFF -DWITH_QT=OFF -DWITH_GTK=OFF -DWITH_OPENGL=OFF -DWITH_FFMPEG=OFF -DWITH_JPEG=ON -DWITH_PNG=ON -DWITH_WEBP=OFF -DWITH_TIFF=OFF -DWITH_1394=OFF -DWITH_V4L=OFF -DWITH_GSTREAMER=OFF -DWITH_PROTOBUF=OFF -DWITH_ADE=OFF -D WITH_ZLIB=OFF -DCMAKE_INSTALL_PREFIX=./3rd/install

cmake --build build-x86 --config Release
cmake --build build-x86 --config Debug
cmake --install build-x86 --config Release
cmake --install build-x86 --config Debug


