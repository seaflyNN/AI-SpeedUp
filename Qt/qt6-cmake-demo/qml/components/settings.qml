import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

Rectangle {
    id: settingsPage
    color: "transparent"
    
    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 20
        spacing: 20
        
        // 标题
        Text {
            text: "设置"
            font.pixelSize: 24
            font.bold: true
            color: mainWindow.textColor
            Layout.alignment: Qt.AlignHCenter
        }
        
        // 设置选项
        Rectangle {
            Layout.fillWidth: true
            height: 200
            color: "#ffffff"
            radius: 8
            
            ColumnLayout {
                anchors.fill: parent
                anchors.margins: 15
                spacing: 15
                
                // 主题设置
                RowLayout {
                    Layout.fillWidth: true
                    
                    Text {
                        text: "深色主题"
                        font.pixelSize: 16
                        color: mainWindow.textColor
                    }
                    
                    Item { Layout.fillWidth: true }
                    
                    Switch {
                        checked: false
                    }
                }
                
                // 字体大小设置
                RowLayout {
                    Layout.fillWidth: true
                    
                    Text {
                        text: "字体大小"
                        font.pixelSize: 16
                        color: mainWindow.textColor
                    }
                    
                    Item { Layout.fillWidth: true }
                    
                    ComboBox {
                        model: ["小", "中", "大"]
                        currentIndex: 1
                    }
                }
                
                // 语言设置
                RowLayout {
                    Layout.fillWidth: true
                    
                    Text {
                        text: "语言"
                        font.pixelSize: 16
                        color: mainWindow.textColor
                    }
                    
                    Item { Layout.fillWidth: true }
                    
                    ComboBox {
                        model: ["中文", "English"]
                        currentIndex: 0
                    }
                }
            }
        }
        
        // 填充剩余空间
        Item {
            Layout.fillHeight: true
        }
    }
} 