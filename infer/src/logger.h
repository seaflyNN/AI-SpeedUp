#ifndef LOGGER_H
#define LOGGER_H

#include <NvInfer.h>
#include <iostream>
#include <string>

class Logger : public nvinfer1::ILogger
{
public:
    void log(Severity severity, const char* msg) noexcept override
    {
        // 只显示警告和错误
        if (severity <= Severity::kWARNING)
        {
            std::cout << "[" << severityToString(severity) << "] " << msg << std::endl;
        }
    }

private:
    std::string severityToString(Severity severity)
    {
        switch (severity)
        {
        case Severity::kINTERNAL_ERROR: return "INTERNAL_ERROR";
        case Severity::kERROR: return "ERROR";
        case Severity::kWARNING: return "WARNING";
        case Severity::kINFO: return "INFO";
        case Severity::kVERBOSE: return "VERBOSE";
        default: return "UNKNOWN";
        }
    }
};

extern Logger gLogger;

#endif // LOGGER_H 