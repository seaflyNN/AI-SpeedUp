import QtQuick
import QtQuick.Window
import QtQuick.Controls

// 圆角窗口组件
Rectangle {
    id: roundedWindow

    // 组件属性
    property Window parentWindow: null    // 父窗口引用
    property int windowRadius: 8          // 窗口圆角半径
    property int titleBarHeight: 40       // 标题栏高度
    property string windowTitle: ""       // 窗口标题
    property bool showTitleText: false    // 是否显示标题文本

    // 颜色属性
    property color borderColor: Qt.rgba(0, 0, 0, 0.1)  // 边框颜色
    property color titleBarColor: "transparent"        // 标题栏颜色
    property color titleTextColor: "#212529"           // 标题文本颜色

    // 控制按钮颜色
    property color minimizeButtonColor: "#FFB71C"      // 最小化按钮颜色
    property color maximizeButtonColor: "#28CA42"      // 最大化按钮颜色
    property color closeButtonColor: "#FF5F57"         // 关闭按钮颜色

    // 是否显示各个控制按钮
    property bool showMinimizeButton: true
    property bool showMaximizeButton: true
    property bool showCloseButton: true

    // 信号
    signal titleBarDoubleClicked

    // 属性设置
    radius: windowRadius
    border.width: 1
    border.color: borderColor

    // 标题栏拖动区域
    Rectangle {
        id: titleBar
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        height: titleBarHeight
        color: titleBarColor
        radius: windowRadius

        // 仅顶部保持圆角
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.bottom: parent.bottom
            height: windowRadius
            color: titleBarColor
        }

        // 标题文本
        // Text {
        //     visible: showTitleText
        //     anchors.verticalCenter: parent.verticalCenter
        //     anchors.left: parent.left
        //     anchors.leftMargin: 15
        //     text: windowTitle
        //     color: titleTextColor
        //     font.pixelSize: 14
        // }

        // 拖动区域
        MouseArea {
            id: dragArea
            anchors.fill: parent
            property point clickPos: "0,0"

            onPressed: {
                clickPos = Qt.point(mouse.x, mouse.y);
            }

            onPositionChanged: {
                if (pressed && parentWindow) {
                    var delta = Qt.point(mouse.x - clickPos.x, mouse.y - clickPos.y);
                    parentWindow.x += delta.x;
                    parentWindow.y += delta.y;
                }
            }

            // 双击标题栏切换最大化/还原
            onDoubleClicked: {
                titleBarDoubleClicked();
                if (parentWindow) {
                    if (parentWindow.visibility === Window.Maximized) {
                        parentWindow.showNormal();
                    } else {
                        parentWindow.showMaximized();
                    }
                }
            }
        }

        // 窗口控制按钮
        Row {
            anchors.top: parent.top
            anchors.right: parent.right
            anchors.margins: 10
            spacing: 10

            // 最小化按钮
            Rectangle {
                visible: showMinimizeButton
                width: 16
                height: 16
                radius: 8
                color: minimizeButtonColor

                MouseArea {
                    anchors.fill: parent
                    onClicked: {
                        if (parentWindow)
                            parentWindow.showMinimized();
                    }
                }
            }

            // 最大化/还原按钮
            Rectangle {
                visible: showMaximizeButton
                width: 16
                height: 16
                radius: 8
                color: maximizeButtonColor

                MouseArea {
                    anchors.fill: parent
                    onClicked: {
                        if (parentWindow) {
                            if (parentWindow.visibility === Window.Maximized) {
                                parentWindow.showNormal();
                            } else {
                                parentWindow.showMaximized();
                            }
                        }
                    }
                }
            }

            // 关闭按钮
            Rectangle {
                visible: showCloseButton
                width: 16
                height: 16
                radius: 8
                color: closeButtonColor

                MouseArea {
                    anchors.fill: parent
                    onClicked: {
                        if (parentWindow) {
                            parentWindow.close();
                        } else {
                            Qt.quit();
                        }
                    }
                }
            }
        }
    }

    // 内容区域容器
    Item {
        id: contentContainer
        anchors.fill: parent
        anchors.topMargin: titleBarHeight

        // 内容在此处添加
        default property alias content: contentContainer.data
    }
}
