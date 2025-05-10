# 电商平台 - 前后端分离架构

这是一个基于前后端分离架构的电商平台，后端使用NestJS构建API服务，前端使用React和Ant Design构建用户界面。

## 项目结构

```
/e-commerce-platform/         # 后端API服务 (NestJS)
/e-commerce-platform-frontend/ # 前端应用 (React)
```

## 技术栈

### 后端
- NestJS - Node.js框架
- TypeORM - 对象关系映射
- PostgreSQL - 数据库
- JWT - 用户认证
- bcryptjs - 密码加密

### 前端
- React - 前端框架
- TypeScript - 类型检查
- React Router - 路由管理
- Ant Design - UI组件库
- Axios - HTTP请求

## 功能特性

- 用户认证（注册/登录）
- 商品浏览与搜索
- 商品分类
- 购物车管理
- 订单处理
- 用户中心
- 支付集成

## 如何运行

### 后端API服务

```bash
# 进入后端目录
cd e-commerce-platform

# 安装依赖
npm install

# 启动开发服务器
npm run start:dev

# API服务将在 http://localhost:3000 运行
```

### 前端应用

```bash
# 进入前端目录
cd e-commerce-platform-frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 前端应用将在 http://localhost:5173 运行
```

## API文档

API文档可通过Swagger访问：http://localhost:3000/api

## 开发指南

### 后端开发

1. 创建新模块：`nest g module module-name`
2. 创建控制器：`nest g controller module-name`
3. 创建服务：`nest g service module-name`
4. 创建实体：在`src/entities`目录中创建

### 前端开发

1. 组件应放在`src/components`目录
2. 页面应放在`src/pages`目录
3. API调用应放在`src/api`目录
4. 共享hooks应放在`src/hooks`目录
5. 工具函数应放在`src/utils`目录

## 部署

### 后端部署

```bash
# 构建生产版本
cd e-commerce-platform
npm run build

# 运行生产版本
npm run start:prod
```

### 前端部署

```bash
# 构建生产版本
cd e-commerce-platform-frontend
npm run build

# 产生的静态文件在 dist 目录中，可以部署到任何静态服务器
``` 