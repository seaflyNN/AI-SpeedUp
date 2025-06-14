# 快速开始

本指南将帮助您快速上手 CRM 系统。

## 系统要求

- Node.js 16.0 或更高版本
- npm 7.0 或更高版本
- 现代浏览器（Chrome、Firefox、Safari、Edge）

## 安装步骤

1. 克隆项目仓库
```bash
git clone https://github.com/your-org/crm-project.git
cd crm-project
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的配置信息
```

4. 启动开发服务器
```bash
npm run dev
```

## 基本使用

### 登录系统

1. 访问 `http://localhost:3000`
2. 使用默认账号登录：
   - 用户名：admin
   - 密码：admin123

### 创建客户

1. 点击左侧菜单的"客户管理"
2. 点击"新建客户"按钮
3. 填写客户信息
4. 点击"保存"

### 创建销售机会

1. 在客户详情页面
2. 点击"新建销售机会"
3. 填写机会信息
4. 设置跟进计划

## 下一步

- 查看[功能特性](/guide/features)了解系统完整功能
- 阅读[最佳实践](/guide/best-practices)提升使用效率
- 参考[API 文档](/api/overview)进行系统集成 