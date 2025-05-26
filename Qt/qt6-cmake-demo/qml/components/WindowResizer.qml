import QtQuick
import QtQuick.Window

// 窗口大小调整组件
Item {
    id: resizer
    
    // 组件属性
    property Window targetWindow: null  // 目标窗口
    property int margin: 5              // 大小调整区域宽度
    property bool active: true          // 是否启用调整功能
    
    // 边缘调整区域 - 8个方向全部支持
    
    // 左边缘
    MouseArea {
        visible: active
        width: margin
        anchors.left: parent.left
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        anchors.topMargin: margin
        anchors.bottomMargin: margin
        hoverEnabled: true
        cursorShape: Qt.SizeHorCursor
        
        onPressed: if (targetWindow) targetWindow.startSystemResize(Qt.LeftEdge)
    }
    
    // 右边缘
    MouseArea {
        visible: active
        width: margin
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        anchors.topMargin: margin
        anchors.bottomMargin: margin
        hoverEnabled: true
        cursorShape: Qt.SizeHorCursor
        
        onPressed: if (targetWindow) targetWindow.startSystemResize(Qt.RightEdge)
    }
    
    // 上边缘
    MouseArea {
        visible: active
        height: margin
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.leftMargin: margin
        anchors.rightMargin: margin
        hoverEnabled: true
        cursorShape: Qt.SizeVerCursor
        
        onPressed: if (targetWindow) targetWindow.startSystemResize(Qt.TopEdge)
    }
    
    // 下边缘
    MouseArea {
        visible: active
        height: margin
        anchors.bottom: parent.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.leftMargin: margin
        anchors.rightMargin: margin
        hoverEnabled: true
        cursorShape: Qt.SizeVerCursor
        
        onPressed: if (targetWindow) targetWindow.startSystemResize(Qt.BottomEdge)
    }
    
    // 左上角
    MouseArea {
        visible: active
        width: margin
        height: margin
        anchors.left: parent.left
        anchors.top: parent.top
        hoverEnabled: true
        cursorShape: Qt.SizeFDiagCursor
        
        onPressed: if (targetWindow) targetWindow.startSystemResize(Qt.TopEdge | Qt.LeftEdge)
    }
    
    // 右上角
    MouseArea {
        visible: active
        width: margin
        height: margin
        anchors.right: parent.right
        anchors.top: parent.top
        hoverEnabled: true
        cursorShape: Qt.SizeBDiagCursor
        
        onPressed: if (targetWindow) targetWindow.startSystemResize(Qt.TopEdge | Qt.RightEdge)
    }
    
    // 左下角
    MouseArea {
        visible: active
        width: margin
        height: margin
        anchors.left: parent.left
        anchors.bottom: parent.bottom
        hoverEnabled: true
        cursorShape: Qt.SizeBDiagCursor
        
        onPressed: if (targetWindow) targetWindow.startSystemResize(Qt.BottomEdge | Qt.LeftEdge)
    }
    
    // 右下角
    MouseArea {
        visible: active
        width: margin
        height: margin
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        hoverEnabled: true
        cursorShape: Qt.SizeFDiagCursor
        
        onPressed: if (targetWindow) targetWindow.startSystemResize(Qt.BottomEdge | Qt.RightEdge)
    }
} 