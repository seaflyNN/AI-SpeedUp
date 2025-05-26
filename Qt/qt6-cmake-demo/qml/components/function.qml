import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import QtQuick.Dialogs

Item {
    id: root
    
    // 创建页面内容
    Item {
        id: mainPage
        anchors.fill: parent
        visible: pageStack.depth === 1 // 仅当StackView为初始页面时显示
        
        ColumnLayout {
            anchors.fill: parent
            anchors.margins: 10
            spacing: 10
            
            Text {
                text: qsTr("function")
                font.pixelSize: 24
                font.bold: true
                color: mainWindow.textColor
            }
            
            Button {
                text: "弹出一个窗口"
                onClicked: {
                    myDialog.open()
                }
            }
            
            Button {
                text: "业务需求新的矩形区域"
                onClicked: {
                    console.log("尝试加载业务组件")
                    customLoader.active = true
                    customLoader.visible = true
                }
            }
            
            Button {
                text: "进入子页面"
                icon.name: "forward"
                onClicked: {
                    // 使用StackView导航到子页面
                    pageStack.push("SubPage.qml")
                }
            }
        }
    }
    
    // 页面堆栈 - 确保页面不会覆盖标题栏
    StackView {
        id: pageStack
        anchors.fill: parent
        initialItem: mainPage
    }
    
    // 对话框
    Dialog {
        id: myDialog
        title: "提示"
        standardButtons: Dialog.Ok | Dialog.Cancel
        
        anchors.centerIn: Overlay.overlay
        modal: true
        closePolicy: Popup.CloseOnEscape
    }
    
    // 业务组件加载器
    Loader {
        id: customLoader
        active: false
        visible: active
        source: "BusinessComponent.qml"
        anchors.centerIn: parent
        z: 10  // 设置较高的z值
        
        // 加载状态监控
        onStatusChanged: {
            if (status == Loader.Ready) {
                console.log("业务组件加载成功")
            } else if (status == Loader.Error) {
                console.log("业务组件加载失败")
            }
        }
    }
}
