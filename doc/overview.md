# CoEditor3 项目概述

## 项目简介
CoEditor3 是一个在线笔记编辑应用，允许用户创建和管理个人笔记。项目采用现代化的技术栈，提供安全的用户认证和文件管理功能。

## 核心功能
- 用户认证系统（登录/注册）
- 笔记管理（公开/私人）
- 文件系统集成
- 主题切换（明/暗模式）

## 技术栈
- **前端框架**: Next.js (App Router)
- **编程语言**: TypeScript
- **样式方案**: TailwindCSS
- **状态管理**: React Context
- **认证方案**: JWT + HttpOnly Cookie
- **文件存储**: 本地文件系统

## 项目结构
```
app/
├── api/                # API 路由
│   ├── auth/          # 认证相关接口
│   └── docs/          # 文档操作接口
├── components/        # React 组件
│   └── auth/          # 认证相关组件
├── contexts/          # React Context
├── lib/              # 工具函数和类型定义
└── page.tsx          # 主页面
```

## 核心模块

### 1. 认证系统
认证系统实现了完整的用户管理功能：
- 用户注册和登录
- JWT token 管理
- 会话持久化
- 安全登出

相关代码：
```typescript:app/lib/auth.ts
startLine: 1
endLine: 126
```

### 2. 文件系统
实现了用户文件的管理功能：
- 文件读写操作
- 目录遍历
- 用户隔离存储

相关代码：
```typescript:app/lib/userFiles.ts
startLine: 1
endLine: 63
```

### 3. 状态管理
使用 React Context 实现全局状态管理：
- 用户认证状态
- 主题切换
- 全局错误处理

相关代码：
```typescript:app/contexts/AppContext.tsx
startLine: 1
endLine: 81
```

## 安全特性
- 使用 HttpOnly Cookie 存储认证令牌
- JWT 令牌验证
- 路由级别的权限控制
- 用户数据隔离

## 开发环境配置
- 支持开发环境超级用户
- 本地文件系统存储
- TypeScript 严格模式
- ESLint 代码规范检查

## 部署说明
项目可以部署到 Vercel 平台，支持以下环境变量配置：
- `JWT_SECRET`: JWT 签名密钥
- `DATA_DIR`: 数据存储目录
- `SUPER_USER_USERNAME`: 超级用户用户名（仅开发环境）
- `SUPER_USER_PASSWORD`: 超级用户密码（仅开发环境）