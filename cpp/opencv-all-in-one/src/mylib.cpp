#include <interface.h>

#include <filesystem>
#include <iostream>

#include <opencv2/opencv.hpp>

/**
 * 图像锐化处理
 * @param src 输入图像
 * @param value 锐化程度 0-100，50为默认值(不改变)
 * @return 处理后的图像
 */
cv::Mat sharpen(cv::Mat const &src, int value = 50) {
  if (value == 50) {
    return src.clone();
  }

  cv::Mat result;
  cv::Mat kernel;

  if (value > 50) {
    // 锐化核心，value越大锐化程度越强
    float strength = (value - 50) / 50.0f * 2.0f; // 0-2范围
    kernel = (cv::Mat_<float>(3, 3) << 0, -strength, 0, -strength,
              1 + 4 * strength, -strength, 0, -strength, 0);
  } else {
    // 模糊处理，value越小模糊程度越强
    float strength = (50 - value) / 50.0f * 10.0f + 1.0f; // 1-11范围
    cv::GaussianBlur(src, result, cv::Size(0, 0), strength);
    return result;
  }

  cv::filter2D(src, result, src.depth(), kernel);
  return result;
}

/**
 * 对比度调整
 * @param src 输入图像
 * @param value 对比度值 0-100，50为默认值(不改变)
 * @return 处理后的图像
 */
cv::Mat adjustContrast(cv::Mat const &src, int value = 50) {
  if (value == 50) {
    return src.clone();
  }

  cv::Mat result;
  // 将0-100映射到0.1-3.0的对比度系数
  double alpha = value / 50.0;
  if (alpha > 1.0) {
    alpha = 1.0 + (alpha - 1.0) * 2.0; // 50-100映射到1.0-3.0
  } else {
    alpha = 0.1 + alpha * 0.9; // 0-50映射到0.1-1.0
  }

  src.convertTo(result, -1, alpha, 0);
  return result;
}

/**
 * 饱和度调整
 * @param src 输入图像
 * @param value 饱和度值 0-100，50为默认值(不改变)
 * @return 处理后的图像
 */
cv::Mat adjustSaturation(cv::Mat const &src, int value = 50) {
  if (value == 50) {
    return src.clone();
  }

  cv::Mat result;
  cv::Mat hsv;

  // 转换到HSV色彩空间
  cv::cvtColor(src, hsv, cv::COLOR_BGR2HSV);

  // 分离通道
  std::vector<cv::Mat> channels;
  cv::split(hsv, channels);

  // 调整饱和度通道(S通道)
  double saturation_factor = value / 50.0;
  if (saturation_factor > 1.0) {
    saturation_factor =
        1.0 + (saturation_factor - 1.0) * 2.0; // 50-100映射到1.0-3.0
  } else {
    saturation_factor = saturation_factor; // 0-50映射到0.0-1.0
  }

  channels[1].convertTo(channels[1], -1, saturation_factor, 0);

  // 合并通道
  cv::merge(channels, hsv);

  // 转换回BGR色彩空间
  cv::cvtColor(hsv, result, cv::COLOR_HSV2BGR);
  return result;
}

/**
 * 亮度调整
 * @param src 输入图像
 * @param value 亮度值 0-100，50为默认值(不改变)
 * @return 处理后的图像
 */
cv::Mat adjustBrightness(cv::Mat const &src, int value = 50) {
  if (value == 50) {
    return src.clone();
  }

  cv::Mat result;
  // 将0-100映射到-100到+100的亮度偏移
  double beta = (value - 50) * 2.0; // -100到+100

  src.convertTo(result, -1, 1.0, beta);
  return result;
}


void processrgb(param p, unsigned char *input_rgb, int width, int height,
                int stride, int *output_width, int *output_hight,
                int *output_stride, unsigned char **output_rgb) {
  *output_width = width;
  *output_hight = height;
  *output_stride = stride;
  cv::Mat img(height, width, CV_8UC3, input_rgb, stride);
  cv::Mat res;

  if (p.type == 0) {
    res = sharpen(img, p.value);
  } else if (p.type == 1) {
    res = adjustContrast(img, p.value);
  } else if (p.type == 2) {
    res = adjustSaturation(img, p.value);
  } else if (p.type == 3) {
    res = adjustBrightness(img, p.value);
  } else {
    return;
  }
  // copy to output_rgb with stride
  auto buf = static_cast<unsigned char *>(std::malloc(res.rows * stride * 3));
  *output_rgb = buf;
  for (int i = 0; i < res.rows; i++) {
    memcpy(buf + i * stride, res.ptr(i), res.cols * 3);
  }
}
