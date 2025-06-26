#include <opencv2/opencv.hpp>
#include <iostream>

int main() {
    std::cout << "OpenCV 版本: " << CV_VERSION << std::endl;
    
    // 创建一个简单的图像
    cv::Mat image = cv::Mat::zeros(300, 400, CV_8UC3);
    
    // 在图像上绘制一些内容
    cv::putText(image, "Hello OpenCV!", cv::Point(50, 150), 
                cv::FONT_HERSHEY_SIMPLEX, 1, cv::Scalar(0, 255, 0), 2);
    
    cv::circle(image, cv::Point(200, 200), 50, cv::Scalar(255, 0, 0), 2);
    
    std::cout << "图像尺寸: " << image.cols << "x" << image.rows << std::endl;
    std::cout << "OpenCV配置成功" << std::endl;
    
    return 0;
}