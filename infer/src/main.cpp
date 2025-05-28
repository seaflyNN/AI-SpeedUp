#include "logger.h"
#include "utils.h"
#include <NvInfer.h>
#include <cuda_runtime_api.h>
#include <iostream>
#include <vector>
#include <memory>
#include <chrono>
#include <cstdlib>
#include <algorithm>

class TensorRTInference
{
private:
    nvinfer1::IRuntime* mRuntime;
    nvinfer1::ICudaEngine* mEngine;
    nvinfer1::IExecutionContext* mContext;
    cudaStream_t mStream;
    
public:
    TensorRTInference() : mRuntime(nullptr), mEngine(nullptr), mContext(nullptr), mStream(nullptr) {}
    
    ~TensorRTInference()
    {
        if (mContext)
        {
            mContext = nullptr; // TensorRT 10.x uses reference counting
        }
        if (mEngine)
        {
            mEngine = nullptr; // TensorRT 10.x uses reference counting
        }
        if (mRuntime)
        {
            mRuntime = nullptr; // TensorRT 10.x uses reference counting
        }
        if (mStream)
        {
            cudaStreamDestroy(mStream);
        }
    }
    
    bool loadEngine(const std::string& engineFile)
    {
        try
        {
            std::cout << "Loading engine file: " << engineFile << std::endl;
            
            // Load engine file
            auto engineData = loadEngineFile(engineFile);
            std::cout << "Engine file size: " << engineData.size() << " bytes" << std::endl;
            
            // Create runtime
            mRuntime = nvinfer1::createInferRuntime(gLogger);
            if (!mRuntime)
            {
                std::cerr << "Failed to create TensorRT runtime" << std::endl;
                return false;
            }
            
            // Deserialize engine
            mEngine = mRuntime->deserializeCudaEngine(engineData.data(), engineData.size());
            if (!mEngine)
            {
                std::cerr << "Failed to deserialize CUDA engine" << std::endl;
                return false;
            }
            
            // Create execution context
            mContext = mEngine->createExecutionContext();
            if (!mContext)
            {
                std::cerr << "Failed to create execution context" << std::endl;
                return false;
            }
            
            // Create CUDA stream
            if (cudaStreamCreate(&mStream) != cudaSuccess)
            {
                std::cerr << "Failed to create CUDA stream" << std::endl;
                return false;
            }
            
            std::cout << "Engine loaded successfully!" << std::endl;
            return true;
        }
        catch (const std::exception& e)
        {
            std::cerr << "Error loading engine: " << e.what() << std::endl;
            return false;
        }
    }
    
    void printEngineInfo()
    {
        if (!mEngine)
        {
            std::cout << "Engine not loaded" << std::endl;
            return;
        }
        
        std::cout << "\n=== Engine Information ===" << std::endl;
        std::cout << "Engine name: " << mEngine->getName() << std::endl;
        std::cout << "Number of I/O tensors: " << mEngine->getNbIOTensors() << std::endl;
        
        // Print all tensor information
        for (int i = 0; i < mEngine->getNbIOTensors(); i++)
        {
            const char* tensorName = mEngine->getIOTensorName(i);
            auto tensorMode = mEngine->getTensorIOMode(tensorName);
            auto dataType = mEngine->getTensorDataType(tensorName);
            auto dims = mEngine->getTensorShape(tensorName);
            
            std::cout << "\nTensor " << i << ":" << std::endl;
            std::cout << "  Name: " << tensorName << std::endl;
            std::cout << "  Type: " << (tensorMode == nvinfer1::TensorIOMode::kINPUT ? "Input" : "Output") << std::endl;
            std::cout << "  Data type: " << static_cast<int>(dataType) << std::endl;
            printDims(dims, "  Shape");
            
            if (tensorMode == nvinfer1::TensorIOMode::kINPUT)
            {
                std::cout << "  Size: " << getTensorSize(dims, dataType) << " bytes" << std::endl;
            }
        }
    }
    
    bool runInference()
    {
        if (!mEngine || !mContext)
        {
            std::cerr << "Engine or context not initialized" << std::endl;
            return false;
        }
        
        std::cout << "\n=== Starting Inference ===" << std::endl;
        
        try
        {
            // Get input and output tensor information
            std::vector<void*> deviceBuffers;
            std::vector<void*> hostBuffers;
            
            for (int i = 0; i < mEngine->getNbIOTensors(); i++)
            {
                const char* tensorName = mEngine->getIOTensorName(i);
                auto tensorMode = mEngine->getTensorIOMode(tensorName);
                auto dataType = mEngine->getTensorDataType(tensorName);
                auto dims = mEngine->getTensorShape(tensorName);
                
                size_t tensorSize = getTensorSize(dims, dataType);
                
                // Allocate device memory
                void* deviceBuffer = nullptr;
                if (cudaMalloc(&deviceBuffer, tensorSize) != cudaSuccess)
                {
                    std::cerr << "Failed to allocate device memory for tensor: " << tensorName << std::endl;
                    return false;
                }
                deviceBuffers.push_back(deviceBuffer);
                
                // Set tensor address
                mContext->setTensorAddress(tensorName, deviceBuffer);
                
                if (tensorMode == nvinfer1::TensorIOMode::kINPUT)
                {
                    // Allocate host memory for input tensor and initialize with random data
                    void* hostBuffer = malloc(tensorSize);
                    if (!hostBuffer)
                    {
                        std::cerr << "Failed to allocate host memory for tensor: " << tensorName << std::endl;
                        return false;
                    }
                    
                    // Fill input with random data (in real applications this should be actual input data)
                    if (dataType == nvinfer1::DataType::kFLOAT)
                    {
                        float* floatBuffer = static_cast<float*>(hostBuffer);
                        size_t numElements = tensorSize / sizeof(float);
                        for (size_t j = 0; j < numElements; j++)
                        {
                            floatBuffer[j] = static_cast<float>(rand()) / RAND_MAX;
                        }
                    }
                    
                    hostBuffers.push_back(hostBuffer);
                    
                    // Copy data from host to device
                    if (cudaMemcpyAsync(deviceBuffer, hostBuffer, tensorSize, 
                                      cudaMemcpyHostToDevice, mStream) != cudaSuccess)
                    {
                        std::cerr << "Failed to copy input data to device" << std::endl;
                        return false;
                    }
                    
                    std::cout << "Input tensor '" << tensorName << "' data prepared (" << tensorSize << " bytes)" << std::endl;
                }
                else
                {
                    // Allocate host memory for output
                    void* hostBuffer = malloc(tensorSize);
                    if (!hostBuffer)
                    {
                        std::cerr << "Failed to allocate output host memory for tensor: " << tensorName << std::endl;
                        return false;
                    }
                    hostBuffers.push_back(hostBuffer);
                    
                    std::cout << "Output tensor '" << tensorName << "' buffer allocated (" << tensorSize << " bytes)" << std::endl;
                }
            }
            
            // Execute inference
            std::cout << "Executing inference..." << std::endl;
            auto start = std::chrono::high_resolution_clock::now();
            
            bool success = mContext->enqueueV3(mStream);
            if (!success)
            {
                std::cerr << "Inference execution failed" << std::endl;
                return false;
            }
            
            // Wait for GPU to complete
            if (cudaStreamSynchronize(mStream) != cudaSuccess)
            {
                std::cerr << "Failed to wait for GPU completion" << std::endl;
                return false;
            }
            
            auto end = std::chrono::high_resolution_clock::now();
            auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);
            
            std::cout << "Inference completed! Time taken: " << duration.count() << " ms" << std::endl;
            
            // Copy output data back to host
            int outputIndex = 0;
            for (int i = 0; i < mEngine->getNbIOTensors(); i++)
            {
                const char* tensorName = mEngine->getIOTensorName(i);
                auto tensorMode = mEngine->getTensorIOMode(tensorName);
                
                if (tensorMode == nvinfer1::TensorIOMode::kOUTPUT)
                {
                    auto dataType = mEngine->getTensorDataType(tensorName);
                    auto dims = mEngine->getTensorShape(tensorName);
                    size_t tensorSize = getTensorSize(dims, dataType);
                    
                    if (cudaMemcpyAsync(hostBuffers[outputIndex], deviceBuffers[i], tensorSize,
                                      cudaMemcpyDeviceToHost, mStream) != cudaSuccess)
                    {
                        std::cerr << "Failed to copy output data" << std::endl;
                        return false;
                    }
                    
                    cudaStreamSynchronize(mStream);
                    
                    std::cout << "Output tensor '" << tensorName << "' data retrieved" << std::endl;
                    
                    // Print first few elements of output data (if float type)
                    if (dataType == nvinfer1::DataType::kFLOAT)
                    {
                        float* output = static_cast<float*>(hostBuffers[outputIndex]);
                        size_t numElements = tensorSize / sizeof(float);
                        size_t printCount = std::min(static_cast<size_t>(10), numElements);
                        
                        std::cout << "  First " << printCount << " output values: ";
                        for (size_t j = 0; j < printCount; j++)
                        {
                            std::cout << output[j] << " ";
                        }
                        std::cout << std::endl;
                    }
                    
                    outputIndex++;
                }
            }
            
            // Clean up memory
            for (void* buffer : deviceBuffers)
            {
                cudaFree(buffer);
            }
            
            for (void* buffer : hostBuffers)
            {
                free(buffer);
            }
            
            return true;
        }
        catch (const std::exception& e)
        {
            std::cerr << "Error during inference: " << e.what() << std::endl;
            return false;
        }
    }
};

int main()
{
    std::cout << "TensorRT C++ Demo" << std::endl;
    std::cout << "=================" << std::endl;
    
    // Check CUDA devices
    int deviceCount = 0;
    cudaError_t error = cudaGetDeviceCount(&deviceCount);
    if (error != cudaSuccess || deviceCount == 0)
    {
        std::cerr << "No CUDA devices found or CUDA initialization failed" << std::endl;
        return -1;
    }
    
    std::cout << "Found " << deviceCount << " CUDA device(s)" << std::endl;
    
    // Get device information
    cudaDeviceProp prop;
    cudaGetDeviceProperties(&prop, 0);
    std::cout << "Using device: " << prop.name << std::endl;
    
    // Create inference object
    TensorRTInference inference;
    
    // Load engine file
    std::string engineFile = "model/resnet_engine_intro.engine";
    if (!inference.loadEngine(engineFile))
    {
        std::cerr << "Failed to load engine" << std::endl;
        return -1;
    }
    
    // Print engine information
    inference.printEngineInfo();
    
    // Run inference
    if (!inference.runInference())
    {
        std::cerr << "Inference failed" << std::endl;
        return -1;
    }
    
    std::cout << "\nProgram completed successfully!" << std::endl;
    return 0;
} 