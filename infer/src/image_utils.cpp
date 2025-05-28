#include "image_utils.h"
#include <opencv2/opencv.hpp>
#include <iostream>

std::vector<float> ImageProcessor::loadAndPreprocessImage(
    const std::string& imagePath,
    int width,
    int height, 
    int channels,
    bool normalize)
{
    std::vector<float> result;
    
    try 
    {
        // 1. 加载图片
        cv::Mat image = cv::imread(imagePath);
        if (image.empty()) 
        {
            std::cerr << "Failed to load image: " << imagePath << std::endl;
            return result;
        }
        
        std::cout << "Loaded image: " << imagePath << " (" 
                  << image.cols << "x" << image.rows << ")" << std::endl;
        
        // 2. 调整大小到目标尺寸
        cv::Mat resized;
        cv::resize(image, resized, cv::Size(width, height));
        
        // 3. 转换BGR到RGB并重排为CHW格式
        result = bgrToRgbChw(resized.data, width, height);
        
        // 4. 归一化处理
        if (normalize) 
        {
            normalizeImage(result);
            // 对于ResNet，通常还需要ImageNet标准化
            imagenetNormalize(result, channels);
        }
        
        std::cout << "Image preprocessed successfully. Data size: " 
                  << result.size() << " elements" << std::endl;
    }
    catch (const std::exception& e) 
    {
        std::cerr << "Error processing image: " << e.what() << std::endl;
        result.clear();
    }
    
    return result;
}

std::vector<float> ImageProcessor::bgrToRgbChw(
    const unsigned char* bgrData,
    int width,
    int height)
{
    std::vector<float> result(width * height * 3);
    
    // 转换BGR (HWC) 到 RGB (CHW)
    // CHW格式: [R通道所有像素][G通道所有像素][B通道所有像素]
    for (int h = 0; h < height; h++) 
    {
        for (int w = 0; w < width; w++) 
        {
            int hwc_idx = (h * width + w) * 3;  // BGR像素起始位置
            int chw_base = h * width + w;       // CHW中的位置基数
            
            // BGR -> RGB，同时转换为CHW格式
            result[chw_base] = static_cast<float>(bgrData[hwc_idx + 2]);                    // R通道
            result[width * height + chw_base] = static_cast<float>(bgrData[hwc_idx + 1]);   // G通道  
            result[2 * width * height + chw_base] = static_cast<float>(bgrData[hwc_idx]);   // B通道
        }
    }
    
    return result;
}

void ImageProcessor::normalizeImage(std::vector<float>& data) 
{
    // 将像素值从[0, 255]归一化到[0.0, 1.0]
    for (float& pixel : data) 
    {
        pixel = pixel / 255.0f;
    }
}

void ImageProcessor::imagenetNormalize(std::vector<float>& data, int channels) 
{
    if (channels != 3) 
    {
        std::cerr << "ImageNet normalization only supports 3-channel images" << std::endl;
        return;
    }
    
    // ImageNet标准化参数
    const float mean[3] = {0.485f, 0.456f, 0.406f};  // RGB均值
    const float std[3] = {0.229f, 0.224f, 0.225f};   // RGB标准差
    
    size_t channel_size = data.size() / 3;
    
    // 对每个通道分别进行标准化: (pixel - mean) / std
    for (int c = 0; c < 3; c++) 
    {
        for (size_t i = 0; i < channel_size; i++) 
        {
            size_t idx = c * channel_size + i;
            data[idx] = (data[idx] - mean[c]) / std[c];
        }
    }
} 