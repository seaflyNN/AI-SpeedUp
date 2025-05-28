#include "utils.h"
#include <fstream>
#include <iostream>
#include <stdexcept>

std::vector<char> loadEngineFile(const std::string& engineFile)
{
    std::ifstream file(engineFile, std::ios::binary | std::ios::ate);
    if (!file.is_open())
    {
        throw std::runtime_error("无法打开引擎文件: " + engineFile);
    }

    std::streamsize fileSize = file.tellg();
    file.seekg(0, std::ios::beg);

    std::vector<char> buffer(fileSize);
    if (!file.read(buffer.data(), fileSize))
    {
        throw std::runtime_error("读取引擎文件失败: " + engineFile);
    }

    return buffer;
}

size_t getElementSize(nvinfer1::DataType dataType)
{
    switch (dataType)
    {
    case nvinfer1::DataType::kFLOAT: return 4;
    case nvinfer1::DataType::kHALF: return 2;
    case nvinfer1::DataType::kINT8: return 1;
    case nvinfer1::DataType::kINT32: return 4;
    case nvinfer1::DataType::kBOOL: return 1;
    case nvinfer1::DataType::kUINT8: return 1;
    case nvinfer1::DataType::kFP8: return 1;
    default: return 0;
    }
}

size_t getTensorSize(const nvinfer1::Dims& dims, nvinfer1::DataType dataType)
{
    size_t size = 1;
    for (int i = 0; i < dims.nbDims; i++)
    {
        size *= dims.d[i];
    }
    return size * getElementSize(dataType);
}

void printDims(const nvinfer1::Dims& dims, const std::string& name)
{
    std::cout << name << " 维度: [";
    for (int i = 0; i < dims.nbDims; i++)
    {
        std::cout << dims.d[i];
        if (i < dims.nbDims - 1) std::cout << ", ";
    }
    std::cout << "]" << std::endl;
} 