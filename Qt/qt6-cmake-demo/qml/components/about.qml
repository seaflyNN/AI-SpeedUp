import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

Rectangle {
    id: aboutPage
    color: "transparent"
    
    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 20
        spacing: 20
        
        // 标题
        Text {
            text: "关于"
            font.pixelSize: 24
            font.bold: true
            color: mainWindow.textColor
            Layout.alignment: Qt.AlignHCenter
        }
        
        // LOGO区域
        Rectangle {
            Layout.alignment: Qt.AlignHCenter
            width: 100
            height: 100
            radius: 50
            color: mainWindow.primaryColor
            
            Text {
                anchors.centerIn: parent
                text: "QML"
                color: "white"
                font.pixelSize: 24
                font.bold: true
            }
        }
        
        // 应用名称
        Text {
            text: "QML 演示应用"
            font.pixelSize: 20
            font.bold: true
            color: mainWindow.textColor
            Layout.alignment: Qt.AlignHCenter
        }
        
        // 版本信息
        Text {
            text: "版本 1.0.0"
            font.pixelSize: 14
            color: mainWindow.textColor
            Layout.alignment: Qt.AlignHCenter
        }
        
        // 分隔线
        Rectangle {
            Layout.fillWidth: true
            height: 1
            color: "#e0e0e0"
            Layout.topMargin: 10
            Layout.bottomMargin: 10
        }
        
        // 应用描述
        Text {
            text: "这是一个使用Qt QML和CMake构建的演示应用程序。\n该应用展示了如何创建现代化的用户界面，以及如何\n使用QML实现各种功能和交互体验。"
            font.pixelSize: 14
            color: mainWindow.textColor
            Layout.alignment: Qt.AlignHCenter
            horizontalAlignment: Text.AlignHCenter
            wrapMode: Text.WordWrap
            Layout.fillWidth: true
        }
        
        // 版权信息
        Text {
            text: "© 2023 QML Demo. 保留所有权利。"
            font.pixelSize: 12
            color: mainWindow.textColor
            Layout.alignment: Qt.AlignHCenter
            Layout.topMargin: 20
        }
        
        // 填充剩余空间
        Item {
            Layout.fillHeight: true
        }
    }
} 