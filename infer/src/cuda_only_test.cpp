#include <iostream>
#include <cuda_runtime.h>
#include <vector>

int main()
{
    std::cout << "CUDA Only Test Program" << std::endl;
    std::cout << "======================" << std::endl;
    
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
        std::cout << "\nDevice " << i << ": " << prop.name << std::endl;
        std::cout << "  Compute capability: " << prop.major << "." << prop.minor << std::endl;
        std::cout << "  Global memory: " << prop.totalGlobalMem / (1024 * 1024) << " MB" << std::endl;
        std::cout << "  Max threads per block: " << prop.maxThreadsPerBlock << std::endl;
    }
    
    // 简单的内存分配测试
    std::cout << "\n=== Memory Test ===" << std::endl;
    
    const size_t arraySize = 1000;
    const size_t memSize = arraySize * sizeof(float);
    
    // 主机内存
    std::vector<float> hostArray(arraySize, 1.0f);
    std::vector<float> resultArray(arraySize, 0.0f);
    
    // 设备内存
    float* deviceArray = nullptr;
    error = cudaMalloc(&deviceArray, memSize);
    if (error != cudaSuccess)
    {
        std::cerr << "Failed to allocate device memory: " << cudaGetErrorString(error) << std::endl;
        return -1;
    }
    
    // 复制数据到设备
    error = cudaMemcpy(deviceArray, hostArray.data(), memSize, cudaMemcpyHostToDevice);
    if (error != cudaSuccess)
    {
        std::cerr << "Failed to copy data to device: " << cudaGetErrorString(error) << std::endl;
        cudaFree(deviceArray);
        return -1;
    }
    
    // 复制数据回主机
    error = cudaMemcpy(resultArray.data(), deviceArray, memSize, cudaMemcpyDeviceToHost);
    if (error != cudaSuccess)
    {
        std::cerr << "Failed to copy data from device: " << cudaGetErrorString(error) << std::endl;
        cudaFree(deviceArray);
        return -1;
    }
    
    // 验证结果
    bool success = true;
    for (size_t i = 0; i < arraySize; i++)
    {
        if (resultArray[i] != 1.0f)
        {
            success = false;
            break;
        }
    }
    
    if (success)
    {
        std::cout << "Memory test PASSED: " << arraySize << " elements copied successfully" << std::endl;
    }
    else
    {
        std::cout << "Memory test FAILED" << std::endl;
    }
    
    // 清理
    cudaFree(deviceArray);
    
    std::cout << "\nCUDA test completed successfully!" << std::endl;
    return 0;
} 