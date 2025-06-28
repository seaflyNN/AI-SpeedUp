add_executable(main main.cpp)
target_link_libraries(main PRIVATE ${OpenCV_LIBS})
target_include_directories(main PRIVATE ${OpenCV_INCLUDE_DIRS})

add_library(mylib SHARED mylib.cpp)
target_link_libraries(mylib PRIVATE ${OpenCV_LIBS})
target_include_directories(mylib PRIVATE ${OpenCV_INCLUDE_DIRS})
target_compile_definitions(mylib PRIVATE BUILDING_DLL)
target_include_directories(mylib PRIVATE include)
