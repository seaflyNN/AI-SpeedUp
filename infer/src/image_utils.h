#pragma once
#include <string>
#include <vector>

/**
 * 图片处理工具类
 */
class ImageProcessor 
{
public:
    /**
     * 加载图片并预处理为模型输入格式
     * @param imagePath 图片文件路径
     * @param width 目标宽度 (224 for ResNet)
     * @param height 目标高度 (224 for ResNet) 
     * @param channels 通道数 (3 for RGB)
     * @param normalize 是否归一化到[0,1]
     * @return 预处理后的float数据，格式为CHW (channels-height-width)
     */
    static std::vector<float> loadAndPreprocessImage(
        const std::string& imagePath,
        int width = 224,
        int height = 224, 
        int channels = 3,
        bool normalize = true
    );
    
    /**
     * 将BGR图像转换为RGB并重排为CHW格式
     * @param bgrData BGR格式的原始数据 (HWC)
     * @param width 图片宽度
     * @param height 图片高度
     * @return CHW格式的RGB float数据
     */
    static std::vector<float> bgrToRgbChw(
        const unsigned char* bgrData,
        int width,
        int height
    );
    
    /**
     * 对图像数据进行归一化 (0-255 -> 0.0-1.0)
     * @param data 待归一化的数据
     */
    static void normalizeImage(std::vector<float>& data);
    
    /**
     * 使用ImageNet标准参数进行归一化
     * mean = [0.485, 0.456, 0.406], std = [0.229, 0.224, 0.225]
     * @param data CHW格式的图像数据
     * @param channels 通道数
     */
    static void imagenetNormalize(std::vector<float>& data, int channels = 3);
}; 