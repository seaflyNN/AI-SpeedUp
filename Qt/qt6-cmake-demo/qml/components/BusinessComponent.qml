import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
// 在Qt 6中，QtGraphicalEffects已被合并到Qt Quick Effects中
import Qt5Compat.GraphicalEffects

Rectangle {
    id: root
    width: 300
    height: 200
    color: "#f0f0f0"
    radius: 8
    border.color: "#cccccc"
    border.width: 1
    
    // 打印调试信息
    Component.onCompleted: {
        console.log("业务组件已创建")
    }
    
    // 添加阴影效果
    layer.enabled: true
    layer.effect: DropShadow {
        transparentBorder: true
        horizontalOffset: 3
        verticalOffset: 3
        radius: 8.0
        samples: 17
        color: "#80000000"
    }
    
    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 15
        spacing: 10
        
        // 标题和关闭按钮
        RowLayout {
            Layout.fillWidth: true
            
            Text {
                text: "业务组件"
                font.pixelSize: 16
                font.bold: true
                Layout.fillWidth: true
            }
            
            Button {
                text: "×"
                flat: true
                onClicked: {
                    // 关闭组件 - 使用父级引用
                    var loader = parent.parent.parent.parent
                    loader.active = false
                    console.log("关闭业务组件")
                }
            }
        }
        
        // 分隔线
        Rectangle {
            Layout.fillWidth: true
            height: 1
            color: "#dddddd"
        }
        
        // 内容区域
        Text {
            text: "这是一个简单的业务组件，可以根据需要扩展功能。"
            wrapMode: Text.WordWrap
            Layout.fillWidth: true
        }
    }
} 