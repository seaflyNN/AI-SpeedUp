import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

Item {
    id: root
    
    Rectangle {
        anchors.fill: parent
        color: "#f5f5f5"
        radius: 8
        
        ColumnLayout {
            anchors.fill: parent
            anchors.margins: 15
            spacing: 15
            
            // 标题栏
            RowLayout {
                Layout.fillWidth: true
                spacing: 10
                
                Button {
                    text: "← 返回"
                    onClicked: {
                        // 返回上一级页面
                        pageStack.pop()
                    }
                }
                
                Text {
                    text: "子页面"
                    font.pixelSize: 20
                    font.bold: true
                    Layout.fillWidth: true
                    horizontalAlignment: Text.AlignHCenter
                }
                
                // 为了对称添加一个空白项
                Item {
                    width: 50
                }
            }
            
            // 分隔线
            Rectangle {
                Layout.fillWidth: true
                height: 1
                color: "#dddddd"
            }
            
            // 内容区域
            ScrollView {
                Layout.fillWidth: true
                Layout.fillHeight: true
                clip: true
                
                ColumnLayout {
                    width: parent.width
                    spacing: 20
                    
                    Text {
                        text: "这是通过StackView导航到的子页面"
                        font.pixelSize: 16
                        Layout.fillWidth: true
                        wrapMode: Text.WordWrap
                    }
                    
                    Item {
                        Layout.preferredWidth: 200
                        Layout.preferredHeight: 150
                        Layout.alignment: Qt.AlignHCenter
                        
                        Rectangle {
                            anchors.fill: parent
                            color: "#dddddd"
                            
                            Text {
                                anchors.centerIn: parent
                                text: "图片占位区"
                            }
                        }
                    }
                    
                    GroupBox {
                        title: "示例表单"
                        Layout.fillWidth: true
                        
                        GridLayout {
                            columns: 2
                            anchors.fill: parent
                            columnSpacing: 10
                            rowSpacing: 10
                            
                            Label { text: "姓名:" }
                            TextField { Layout.fillWidth: true }
                            
                            Label { text: "年龄:" }
                            SpinBox { 
                                from: 1
                                to: 120
                                value: 25
                            }
                            
                            Label { text: "选择:" }
                            ComboBox {
                                model: ["选项1", "选项2", "选项3"]
                                Layout.fillWidth: true
                            }
                            
                            CheckBox { text: "同意条款" }
                        }
                    }
                    
                    Button {
                        text: "提交表单"
                        Layout.alignment: Qt.AlignHCenter
                    }
                }
            }
        }
    }
}