#ifndef UTILS_H
#define UTILS_H

#include <NvInfer.h>
#include <memory>
#include <vector>
#include <string>

// TensorRT对象智能指针删除器 - TensorRT 10.x版本使用引用计数，不需要手动删除
struct InferDeleter
{
    template <typename T>
    void operator()(T* obj) const
    {
        // TensorRT 10.x版本的对象使用引用计数，会自动管理生命周期
        // 不需要手动调用delete或destroy
    }
};

// 类型别名
using UniquePtr = std::unique_ptr<nvinfer1::ICudaEngine, InferDeleter>;
using RuntimePtr = std::unique_ptr<nvinfer1::IRuntime, InferDeleter>;
using ContextPtr = std::unique_ptr<nvinfer1::IExecutionContext, InferDeleter>;

// 工具函数
std::vector<char> loadEngineFile(const std::string& engineFile);
size_t getElementSize(nvinfer1::DataType dataType);
size_t getTensorSize(const nvinfer1::Dims& dims, nvinfer1::DataType dataType);
void printDims(const nvinfer1::Dims& dims, const std::string& name);

#endif // UTILS_H 