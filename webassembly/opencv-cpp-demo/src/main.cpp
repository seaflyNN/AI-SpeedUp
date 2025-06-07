#include <iostream>
#include <fstream>
#include <vector>
#include <algorithm>
#include <cstdio>

#include <opencv2/opencv.hpp>

#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <emscripten.h>
#endif

void foo(uint8_t *data, int width, int height, int channels) {
    std::cout << "foo" << std::endl;
    std::cout << "width: " << width << std::endl;
    std::cout << "height: " << height << std::endl;
    std::cout << "channels: " << channels << std::endl;
    std::cout << "data: " << data << std::endl;
}

void bar(uint8_t *data, int data_length) {
    std::cout << "bar function called" << std::endl;
    std::cout << "data length: " << data_length << std::endl;
    
    if (data_length <= 0) {
        std::cout << "Invalid data length" << std::endl;
        return;
    }
    
    // 将数据转换为cv::Mat
    std::vector<uint8_t> buffer(data, data + data_length);
    cv::Mat image = cv::imdecode(buffer, cv::IMREAD_COLOR);
    
    if (image.empty()) {
        std::cout << "Failed to decode image" << std::endl;
        return;
    }
    
    std::cout << "Image decoded successfully" << std::endl;
    std::cout << "Image size: " << image.size() << std::endl;
    std::cout << "Image channels: " << image.channels() << std::endl;
    
    // 这里可以添加你的图像处理逻辑
    // 例如：
    cv::Mat gray;
    cv::cvtColor(image, gray, cv::COLOR_BGR2GRAY);
    std::cout << "Converted to grayscale" << std::endl;
}

// 新增：直接处理文件路径的接口（适用于预加载到虚拟文件系统的文件）
void processFile(const char* filepath) {
    std::cout << "processFile function called" << std::endl;
    std::cout << "filepath: " << filepath << std::endl;
    
    // 尝试使用OpenCV读取文件（从虚拟文件系统）
    cv::Mat image = cv::imread(filepath);
    
    if (image.empty()) {
        std::cout << "Failed to load image from: " << filepath << std::endl;
        std::cout << "Make sure the file is preloaded into the virtual filesystem" << std::endl;
        return;
    }
    
    std::cout << "Image loaded successfully from: " << filepath << std::endl;
    std::cout << "Image size: " << image.size() << std::endl;
    std::cout << "Image channels: " << image.channels() << std::endl;
    
    // 图像处理逻辑
    cv::Mat gray, blurred, edges;
    
    // 转换为灰度图
    cv::cvtColor(image, gray, cv::COLOR_BGR2GRAY);
    std::cout << "Converted to grayscale" << std::endl;
    
    // 高斯模糊
    cv::GaussianBlur(gray, blurred, cv::Size(15, 15), 0);
    std::cout << "Applied Gaussian blur" << std::endl;
    
    // 边缘检测
    cv::Canny(blurred, edges, 50, 150);
    std::cout << "Applied Canny edge detection" << std::endl;
    
    // 可以在这里保存处理后的图像到虚拟文件系统
    std::string output_path = std::string(filepath) + "_processed.png";
    cv::imwrite(output_path, edges);
    std::cout << "Processed image saved to: " << output_path << std::endl;
}

// 为JavaScript提供的包装函数
#ifdef __EMSCRIPTEN__
void foo_wrapper(int data_ptr, int width, int height, int channels) {
    uint8_t* data = reinterpret_cast<uint8_t*>(data_ptr);
    foo(data, width, height, channels);
}

void bar_wrapper(int data_ptr, int data_length) {
    uint8_t* data = reinterpret_cast<uint8_t*>(data_ptr);
    bar(data, data_length);
}

void processFile_wrapper(const std::string& filepath) {
    processFile(filepath.c_str());
}

// 使用Emscripten的绑定系统导出函数
EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::function("foo", &foo_wrapper);
    emscripten::function("bar", &bar_wrapper);
    emscripten::function("processFile", &processFile_wrapper);
}

// 也可以使用C风格的导出（可选）
extern "C" {
    EMSCRIPTEN_KEEPALIVE
    void c_foo(uint8_t *data, int width, int height, int channels) {
        foo(data, width, height, channels);
    }
    
    EMSCRIPTEN_KEEPALIVE
    void c_bar(uint8_t *data, int data_length) {
        bar(data, data_length);
    }
    
    EMSCRIPTEN_KEEPALIVE
    void c_processFile(const char* filepath) {
        processFile(filepath);
    }
}
#endif

int main() {
    std::cout << "OpenCV WebAssembly Demo initialized!" << std::endl;
    std::cout << "Use the 'bar' function to process image files from JavaScript." << std::endl;
    return 0;
}