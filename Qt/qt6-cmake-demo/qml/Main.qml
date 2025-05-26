import QtQuick
import QtQuick.Window
import QtQuick.Controls
import QtQuick.Layouts

ApplicationWindow {
    id: mainWindow
    visible: true
    width: 640
    height: 480
    title: qsTr("Hello QML")

    // 圆角设置
    property int windowRadius: 8

    // 设置为无边框窗口，并允许透明背景
    flags: Qt.FramelessWindowHint | Qt.Window
    color: "transparent"

    // 边缘调整大小的参数
    property int resizeMargin: 5
    property int minWidth: 320
    property int minHeight: 240

    // 设置颜色
    property color primaryColor: "#007bff"
    property color backgroundColor: "#f8f9fa"
    property color textColor: "#212529"
    property color menuBackgroundColor: "#343a40"
    property color menuTextColor: "#ffffff"
    property color menuActiveColor: "#007bff"

    // 当前活动组件URL
    property string activeComponentUrl: ""
    
    // 响应式布局参数
    property bool isNarrowScreen: width < 800
    property bool sideBarCollapsed: false

    // 使用自定义圆角窗口组件
    RoundedWindow {
        id: mainRoundedWindow
        anchors.fill: parent
        color: backgroundColor
        windowRadius: mainWindow.windowRadius
        parentWindow: mainWindow
        titleBarHeight: 40
        borderColor: Qt.rgba(0, 0, 0, 0.1)
        windowTitle: mainWindow.title
        showTitleText: false // 不显示标题文本

        // 主内容区域
        Item {
            anchors.fill: parent
            clip: true  // 裁剪超出区域的内容
            
            // 改为侧边栏与内容区并列的布局
            // 优化后的侧边栏 - 从顶部开始
            SideBar {
                id: sideBar
                height: parent.height
                width: collapsed ? 60 : 200
                anchors.left: parent.left
                anchors.top: parent.top
                radius: windowRadius
                model: menuModel
                backgroundColor: menuBackgroundColor
                textColor: menuTextColor
                activeItemColor: menuActiveColor
                
                // 响应窗口大小变化
                collapsed: mainWindow.sideBarCollapsed
                
                // 监听选择事件，加载对应组件
                onItemClicked: function(index, url) {
                    // 加载选中项的组件
                    contentLoader.source = url
                }
                
                // 根据窗口宽度自动调整
                Connections {
                    target: mainWindow
                    function onWidthChanged() {
                        if (mainWindow.width < 600 && !sideBar.collapsed) {
                            mainWindow.sideBarCollapsed = true
                        } else if (mainWindow.width > 1000 && sideBar.collapsed) {
                            mainWindow.sideBarCollapsed = false
                        }
                    }
                }
            }

            // 右侧内容区 - 从标题栏下方开始
            Rectangle {
                anchors.left: sideBar.right
                anchors.right: parent.right
                anchors.top: parent.top
                anchors.topMargin: mainRoundedWindow.titleBarHeight // 只在内容区预留标题栏空间
                anchors.bottom: parent.bottom
                color: "transparent"

                // 内容加载器
                Loader {
                    id: contentLoader
                    anchors.fill: parent
                    anchors.margins: 15
                    source: ""

                    // 默认内容 - 当没有加载组件时显示
                    Rectangle {
                        anchors.fill: parent
                        visible: contentLoader.status !== Loader.Ready
                        color: "transparent"

                        Text {
                            anchors.centerIn: parent
                            text: "请从左侧菜单中选择功能"
                            font.pixelSize: 18
                            color: textColor
                        }
                    }
                }
            }
        }
    }
    
    // 使用自定义窗口大小调整组件
    WindowResizer {
        anchors.fill: parent
        targetWindow: mainWindow
        margin: resizeMargin
        z: 1000 // 确保在最上层
    }

    // 菜单数据模型
    ListModel {
        id: menuModel
        // 初始菜单项
        Component.onCompleted: {
            // 添加主要功能分组
            append({
                type: "header",
                name: "主要功能"
            });
            append({
                type: "item",
                name: "功能模块",
                icon: "function",
                componentUrl: "components/function.qml"
            });
            
            // 添加分隔线
            append({
                type: "separator"
            });
            
            // 添加系统分组
            append({
                type: "header",
                name: "系统"
            });
            append({
                type: "item",
                name: "设置",
                icon: "settings",
                componentUrl: "components/settings.qml"
            });
            append({
                type: "item",
                name: "关于",
                icon: "about",
                componentUrl: "components/about.qml"
            });
        }
    }

    // 退出应用程序的快捷键
    Shortcut {
        sequences: [StandardKey.Quit, StandardKey.Close]
        onActivated: Qt.quit()
    }
}
