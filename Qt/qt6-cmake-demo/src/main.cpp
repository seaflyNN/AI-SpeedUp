#include <QGuiApplication>
#include <QIcon>
#include <QQmlApplicationEngine>
#include <QQuickWindow>
#include <QQuickStyle>

int main(int argc, char *argv[])
{
    // 设置高DPI缩放
    QGuiApplication::setHighDpiScaleFactorRoundingPolicy(Qt::HighDpiScaleFactorRoundingPolicy::PassThrough);
    
    // 创建应用程序
    QGuiApplication app(argc, argv);
    
    // 应用程序信息
    app.setApplicationName("HelloQml");
    app.setOrganizationName("HelloOrg");
    app.setOrganizationDomain("hello.org");
    
    // 设置应用图标
    app.setWindowIcon(QIcon(":/assets/gfx/logo.svg"));
    
    // 设置应用主题样式 (可选)
    QQuickStyle::setStyle("Material");
    
    // 创建QML引擎
    QQmlApplicationEngine engine;
    
    // 添加导入路径
    engine.addImportPath(":/");
    engine.addImportPath(":/HelloQml");
    
    // 加载主QML文件
    engine.loadFromModule("HelloQml", "Main");
    
    // 检查是否成功加载
    if (engine.rootObjects().isEmpty()) {
        qWarning() << "无法初始化QML引擎!";
        return -1;
    }
    
    return app.exec();
} 