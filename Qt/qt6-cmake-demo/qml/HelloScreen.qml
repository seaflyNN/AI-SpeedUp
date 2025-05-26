import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

Item {
    id: root
    
    RowLayout {
        anchors.fill: parent
        spacing: 20
        
        ColumnLayout {
            Layout.alignment: Qt.AlignVCenter
            Layout.preferredWidth: Math.min(parent.width * 0.5, 400)
            spacing: 20
            
            // Logo
            Image {
                Layout.alignment: Qt.AlignHCenter
                source: "qrc:/assets/gfx/logo.svg"
                width: 120
                height: 120
                fillMode: Image.PreserveAspectFit
                
                // 如果图片不存在，显示一个圆形代替
                Rectangle {
                    visible: parent.status !== Image.Ready
                    anchors.fill: parent
                    radius: width / 2
                    color: mainWindow.primaryColor
                    
                    Text {
                        anchors.centerIn: parent
                        text: "QML"
                        color: "white"
                        font.pixelSize: 32
                        font.bold: true
                    }
                }
            }
            
            // 标题
            Label {
                Layout.alignment: Qt.AlignHCenter
                text: qsTr("Hello QML World!")
                font.pixelSize: 32
                font.bold: true
                color: mainWindow.textColor
            }
            
            // 描述文本
            Label {
                Layout.alignment: Qt.AlignHCenter
                Layout.fillWidth: true
                text: qsTr("欢迎使用QML和CMake构建的应用程序!")
                wrapMode: Text.WordWrap
                horizontalAlignment: Text.AlignHCenter
                color: mainWindow.textColor
                font.pixelSize: 16
            }
            
            // 按钮
            Button {
                Layout.alignment: Qt.AlignHCenter
                Layout.topMargin: 20
                text: qsTr("点击我")
                
                background: Rectangle {
                    implicitWidth: 120
                    implicitHeight: 40
                    color: parent.down ? Qt.darker(mainWindow.primaryColor, 1.2) : 
                        parent.hovered ? Qt.lighter(mainWindow.primaryColor, 1.1) : mainWindow.primaryColor
                    radius: 4
                }
                
                contentItem: Text {
                    text: parent.text
                    font.pixelSize: 14
                    color: "white"
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                }
                
                onClicked: {
                    messageLabel.visible = true
                }
            }

            // 消息标签
            Label {
                id: messageLabel
                Layout.alignment: Qt.AlignHCenter
                Layout.topMargin: 20
                text: qsTr("🎉 恭喜! 您已成功运行此应用程序!")
                color: "green"
                font.pixelSize: 14
                visible: false
            }

            
            Button {
                id: button_2
                Layout.alignment: Qt.AlignHCenter
                Layout.topMargin: 40
                text: qsTr("click me")
                // onClicked: {
                //     messageLabel.visible = true
                // }
            }
        }
        
        ColumnLayout {
            Layout.alignment: Qt.AlignVCenter
            Layout.preferredWidth: Math.min(parent.width * 0.5, 400)
            spacing: 20
            
            // 这里可以添加右侧部分的内容
            Label {
                Layout.alignment: Qt.AlignHCenter
                text: qsTr("右侧面板")
                font.pixelSize: 24
                font.bold: true
                color: mainWindow.textColor
            }
        }
    }
} 