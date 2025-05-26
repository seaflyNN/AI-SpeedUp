import QtQuick
import QtQuick.Controls

// 优化的侧边栏组件
Rectangle {
    id: sideBar
    
    // 组件属性
    property alias model: menuListView.model             // 菜单数据模型
    property alias currentIndex: menuListView.currentIndex // 当前选中项
    property string currentUrl: ""                       // 当前加载的URL
    property bool collapsed: false                       // 是否折叠
    property int itemHeight: 45                          // 菜单项高度
    
    // 颜色属性
    property color backgroundColor: "#343a40"            // 背景色
    property color textColor: "#ffffff"                  // 文本颜色
    property color activeItemColor: "#007bff"            // 选中项颜色
    property color hoverColor: Qt.rgba(1, 1, 1, 0.1)     // 悬停颜色
    property color separatorColor: Qt.rgba(1, 1, 1, 0.1) // 分隔线颜色
    property color headerColor: Qt.rgba(1, 1, 1, 0.05)   // 标题背景色
    property color headerTextColor: Qt.rgba(1, 1, 1, 0.6) // 标题文本色
    
    // 信号
    signal itemClicked(int index, string url)
    
    // 响应式宽度
    width: collapsed ? 60 : 200
    color: backgroundColor
    
    Behavior on width {
        NumberAnimation { 
            duration: 200
            easing.type: Easing.InOutQuad
        }
    }
    
    // 折叠按钮
    Rectangle {
        id: collapseBtn
        anchors.top: parent.top
        anchors.right: parent.right
        anchors.margins: 8
        width: 24
        height: 24
        radius: 4
        color: Qt.rgba(1, 1, 1, 0.1)
        
        Text {
            anchors.centerIn: parent
            text: sideBar.collapsed ? "→" : "←"
            color: textColor
            font.pixelSize: 12
        }
        
        MouseArea {
            anchors.fill: parent
            onClicked: {
                sideBar.collapsed = !sideBar.collapsed
            }
        }
    }
    
    // 菜单列表
    ListView {
        id: menuListView
        anchors.fill: parent
        anchors.topMargin: 40  // 为折叠按钮留出空间
        anchors.bottomMargin: 10
        spacing: 2
        clip: true
        
        // 性能优化
        cacheBuffer: 200
        reuseItems: true
        
        // 滚动条
        ScrollBar.vertical: ScrollBar {
            active: true
            policy: ScrollBar.AsNeeded
        }
        
        // 菜单项委托
        delegate: Item {
            id: menuItem
            width: ListView.view.width
            // 根据类型调整高度
            height: model.type === "separator" ? 10 : 
                   model.type === "header" ? 30 : itemHeight
            
            // 分隔线
            Rectangle {
                visible: model.type === "separator"
                anchors.centerIn: parent
                width: parent.width - 20
                height: 1
                color: separatorColor
            }
            
            // 分组标题
            Rectangle {
                visible: model.type === "header"
                anchors.fill: parent
                color: headerColor
                
                Text {
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.left: parent.left
                    anchors.leftMargin: 15
                    text: model.name || ""
                    font.pixelSize: 12
                    font.capitalization: Font.AllUppercase
                    color: headerTextColor
                    elide: Text.ElideRight
                    visible: !sideBar.collapsed
                }
            }
            
            // 普通菜单项
            Rectangle {
                id: itemRect
                visible: model.type === "item" || model.type === undefined
                anchors.fill: parent
                anchors.leftMargin: 5
                anchors.rightMargin: 5
                radius: 4
                color: ListView.isCurrentItem ? activeItemColor : 
                       itemMouseArea.containsMouse ? hoverColor : "transparent"
                
                // 颜色过渡动画
                Behavior on color {
                    ColorAnimation { duration: 100 }
                }
                
                Row {
                    anchors.fill: parent
                    anchors.leftMargin: 12
                    anchors.rightMargin: 8
                    spacing: 12
                    
                    // 图标
                    Rectangle {
                        width: 22
                        height: 22
                        anchors.verticalCenter: parent.verticalCenter
                        color: "transparent"
                        
                        Text {
                            anchors.centerIn: parent
                            text: getIconText(model.icon)
                            color: textColor
                            font.pixelSize: 16
                        }
                    }
                    
                    // 文本 (仅在非折叠状态显示)
                    Text {
                        text: model.name || ""
                        anchors.verticalCenter: parent.verticalCenter
                        font.pixelSize: 14
                        color: textColor
                        visible: !sideBar.collapsed
                        elide: Text.ElideRight
                        width: parent.width - 50
                    }
                }
                
                // 点击和悬停处理
                MouseArea {
                    id: itemMouseArea
                    anchors.fill: parent
                    hoverEnabled: true
                    
                    onClicked: {
                        menuListView.currentIndex = index
                        var url = model.url || model.componentUrl || ""
                        sideBar.currentUrl = url
                        sideBar.itemClicked(index, url)
                    }
                }
            }
        }
    }
    
    // 辅助函数 - 获取图标文本
    function getIconText(iconName) {
        if (!iconName) return "◆"
        
        switch(iconName) {
            case "function": return "🔍"
            case "settings": return "⚙️"
            case "about": return "ℹ️"
            default: return "◆"
        }
    }
} 