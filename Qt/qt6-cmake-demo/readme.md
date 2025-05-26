
cmake -S . -B build -DCMAKE_PREFIX_PATH=D:\software\Qt\Qt6.9\6.9.0\msvc2022_64
cmake --build build --config Release
# prefix必须为绝对路径
cmake --install build --config Release --prefix=D:/code/qt-cmake-serials/qt6-cmake-demo/install
