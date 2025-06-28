#ifndef INTERFACE_H
#define INTERFACE_H

// Windows DLL 导出/导入宏定义
#ifdef _WIN32
    #ifdef BUILDING_DLL
        #define API_EXPORT __declspec(dllexport)
    #else
        #define API_EXPORT __declspec(dllimport)
    #endif
#else
    #define API_EXPORT
#endif

#ifdef __cplusplus
extern "C" {
#endif

struct param {
  int type{0};   // 0:锐化, 1:对比度, 2:饱和度, 3:亮度
  int value{50}; // 0-100, 50为默认值
};

API_EXPORT void processrgb(param p, unsigned char *input_rgb, int width, int height,
                          int stride, int *output_width, int *output_hight,
                          int *output_stride, unsigned char **output_rgb);

#ifdef __cplusplus
}
#endif

#endif // INTERFACE_H