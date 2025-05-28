#include <iostream>
#include <cuda_runtime.h>

int main()
{
    std::cout << "Simple CUDA Test" << std::endl;
    
    // 检查CUDA设备
    int deviceCount = 0;
    cudaError_t error = cudaGetDeviceCount(&deviceCount);
    
    if (error != cudaSuccess)
    {
        std::cerr << "CUDA error: " << cudaGetErrorString(error) << std::endl;
        return -1;
    }
    
    if (deviceCount == 0)
    {
        std::cerr << "No CUDA devices found" << std::endl;
        return -1;
    }
    
    std::cout << "Found " << deviceCount << " CUDA device(s)" << std::endl;
    
    // 获取设备信息
    for (int i = 0; i < deviceCount; i++)
    {
        cudaDeviceProp prop;
        cudaGetDeviceProperties(&prop, i);
        std::cout << "Device " << i << ": " << prop.name << std::endl;
        std::cout << "  Compute capability: " << prop.major << "." << prop.minor << std::endl;
        std::cout << "  Global memory: " << prop.totalGlobalMem / (1024 * 1024) << " MB" << std::endl;
    }
    
    std::cout << "CUDA test completed successfully!" << std::endl;
    return 0;
} 