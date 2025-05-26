cmake_minimum_required(VERSION 3.20)

project(HelloQml VERSION 1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_INCLUDE_CURRENT_DIR ON)

string(TIMESTAMP CURRENT_TIMESTAMP "%s" UTC)
set(APP_NAME ${CMAKE_PROJECT_NAME})
set(APP_VERSION ${CMAKE_PROJECT_VERSION})
set(APP_VERSION_CODE ${TIMESTAMP})

################################################################################

message(STATUS "[CMAKE]   CMAKE_VERSION             = ${CMAKE_VERSION}")
message(STATUS "[CMAKE]   CMAKE_PREFIX_PATH         = ${CMAKE_PREFIX_PATH}")
message(STATUS "[SYSTEM]  (HOST) SYSTEM NAME        = ${CMAKE_HOST_SYSTEM_NAME}")
message(STATUS "[SYSTEM]  (HOST) SYSTEM VERSION     = ${CMAKE_HOST_SYSTEM_VERSION}")
message(STATUS "[SYSTEM]  (TARGET) SYSTEM NAME      = ${CMAKE_SYSTEM_NAME}")
message(STATUS "[SYSTEM]  (TARGET) SYSTEM VERSION   = ${CMAKE_SYSTEM_VERSION}")
message(STATUS "[PROJECT] SOURCE_DIR                = ${CMAKE_SOURCE_DIR}")
message(STATUS "[PROJECT] BUILD_TYPE                = ${CMAKE_BUILD_TYPE}")

################################################################################

find_package(Qt6 REQUIRED COMPONENTS Core Gui Svg Qml Quick QuickControls2)
find_package(Qt6 REQUIRED COMPONENTS LinguistTools)

qt_standard_project_setup(REQUIRES 6.5
                          I18N_SOURCE_LANGUAGE en
                          I18N_TRANSLATED_LANGUAGES zh)

qt_policy(SET QTP0001 NEW)
qt_policy(SET QTP0002 NEW)
qt_policy(SET QTP0003 NEW) # Qt 6.7

# 确保已知该策略
if (QT_KNOWN_POLICY_QTP0004)
    # 将行为设为 NEW，让 CMake 为每个子目录生成 qmldir
    qt_policy(SET QTP0004 NEW)
endif()

# Set app icons
if(CMAKE_SYSTEM_NAME STREQUAL "Windows")
    set(app_icon_windows "${CMAKE_SOURCE_DIR}/assets/windows/${CMAKE_PROJECT_NAME}.rc")
elseif(CMAKE_SYSTEM_NAME STREQUAL "Darwin")
    set(app_icon_macos "${CMAKE_SOURCE_DIR}/assets/macos/${CMAKE_PROJECT_NAME}.icns")
endif()

qt_add_executable(${CMAKE_PROJECT_NAME}
    src/main.cpp
    assets/assets.qrc
    ${app_icon_windows}
    ${app_icon_macos}
)

# qt资源系统定义了虚拟路由 /HelloQml
# 需要在导入路径 engine.addImportPath(":/HelloQml")
qt_add_qml_module(${CMAKE_PROJECT_NAME}
    URI ${CMAKE_PROJECT_NAME}
    VERSION 1.0
    RESOURCE_PREFIX "/HelloQml"
    NO_PLUGIN
    QML_FILES
        qml/Main.qml
        qml/HelloScreen.qml
        qml/components/function.qml
        qml/components/settings.qml
        qml/components/about.qml
        qml/components/WindowResizer.qml
        qml/components/RoundedWindow.qml
        qml/components/SideBar.qml
        qml/components/SubPage.qml
        qml/components/BusinessComponent.qml
    IMPORT_PATH "${CMAKE_SOURCE_DIR}"
)

# qt资源系统定义了虚拟路由 /i18n
# 需要在导入路径 engine.addImportPath(":/i18n")
qt_add_translations(${CMAKE_PROJECT_NAME}
    TS_FILE_BASE ${CMAKE_PROJECT_NAME}
    TS_FILE_DIR ${CMAKE_SOURCE_DIR}/i18n/
    RESOURCE_PREFIX "/i18n"
)

################################################################################

# Qt libraries
target_link_libraries(${CMAKE_PROJECT_NAME} PRIVATE
    Qt6::Core
    Qt6::Gui
    Qt6::Svg
    Qt6::Qml
    Qt6::Quick
    Qt6::QuickControls2
)

################################################################################

## Windows
if(CMAKE_SYSTEM_NAME STREQUAL "Windows")
    set_target_properties(${CMAKE_PROJECT_NAME} PROPERTIES
        WIN32_EXECUTABLE ON
    )
endif()

## Release build? Set "no debug" macros
if(CMAKE_BUILD_TYPE STREQUAL Release)
    target_compile_definitions(${CMAKE_PROJECT_NAME} PRIVATE
        NDEBUG
        QT_NO_DEBUG
        QT_NO_DEBUG_OUTPUT
    )
endif()

################################################################################

# Output directories
set_target_properties(${CMAKE_PROJECT_NAME} PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/bin"
)

# Install
install(TARGETS ${CMAKE_PROJECT_NAME}
    BUNDLE DESTINATION "${CMAKE_SOURCE_DIR}/bin"
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
)

# Deploy script
qt_generate_deploy_qml_app_script(
    TARGET ${CMAKE_PROJECT_NAME}
    OUTPUT_SCRIPT deploy_script
    MACOS_BUNDLE_POST_BUILD
    NO_UNSUPPORTED_PLATFORM_ERROR
    DEPLOY_USER_QML_MODULES_ON_UNSUPPORTED_PLATFORM
)
install(SCRIPT ${deploy_script})

################################################################################ 