#include <iostream>

#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <emscripten.h>
#endif

void foo(uint8_t *data, int width, int height, int channels) {
    std::cout << "foo" << std::endl;
    std::cout << "width: " << width << std::endl;
    std::cout << "height: " << height << std::endl;
    std::cout << "channels: " << channels << std::endl;
    std::cout << "data: " << data << std::endl;
}

// 为JavaScript提供的包装函数
#ifdef __EMSCRIPTEN__
void foo_wrapper(int data_ptr, int width, int height, int channels) {
    uint8_t* data = reinterpret_cast<uint8_t*>(data_ptr);
    foo(data, width, height, channels);
}

// 使用Emscripten的绑定系统导出函数
EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::function("foo", &foo_wrapper);
}

// 也可以使用C风格的导出（可选）
extern "C" {
    EMSCRIPTEN_KEEPALIVE
    void c_foo(uint8_t *data, int width, int height, int channels) {
        foo(data, width, height, channels);
    }
}
#endif

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}