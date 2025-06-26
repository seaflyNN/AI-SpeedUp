add_executable(main main.cpp)
target_link_libraries(main PRIVATE ${OpenCV_LIBS})
target_include_directories(main PRIVATE ${OpenCV_INCLUDE_DIRS})
