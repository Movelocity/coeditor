# 认证系统技术文档

## 功能概述

当前项目实现了基础的用户认证系统，包含以下功能：
- 用户注册
- 用户登录
- 用户登出
- 会话持久化
- 认证状态检查

## 技术实现

### 1. 数据存储
- 使用本地文件系统存储用户数据 (`DATA_DIR/users.json`)
- 用户模型包含: id、username、password、createdAt

### 2. 认证流程
#### 注册流程
1. 客户端发送 POST 请求到 `/api/auth/register`
2. 服务端验证用户名是否已存在
3. 创建新用户并保存到文件系统

#### 登录流程
1. 客户端发送 POST 请求到 `/api/auth/login`
2. 服务端验证用户名和密码
3. 验证成功后设置 HttpOnly Cookie (user_id)
4. 返回用户信息给客户端

#### 登出流程
1. 客户端发送 POST 请求到 `/api/auth/logout`
2. 服务端清除 user_id cookie

### 3. 状态管理
- 使用 React Context (AppContext) 管理全局认证状态
- 通过 useApp hook 提供认证相关的方法和状态

## 数据流
```mermaid
graph TD
A[客户端] -->|登录请求| B[/api/auth/login]
B -->|验证凭据| C[auth.ts]
C -->|读取用户数据| D[(本地文件系统)]
B -->|设置Cookie| E[HTTP Cookie]
B -->|返回用户信息| A
A -->|状态更新| F[AppContext]
```

## 当前存在的问题

1. 安全性问题
   - 密码明文存储
   - 缺少密码强度验证
   - 缺少请求频率限制
   - 缺少 CSRF 保护

2. 可靠性问题
   - 文件系统存储可能存在并发问题
   - 缺少数据备份机制
   - 缺少错误重试机制

3. 可扩展性问题
   - 本地文件存储不适合分布式部署
   - 缺少用户会话管理
   - 缺少权限控制系统

## 优化建议

### 短期优化

1. 安全加强：
```typescript
// 添加密码加密
import bcrypt from 'bcryptjs'
    const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}
```
2. 添加输入验证：
```typescript
const validatePassword = (password: string) => {
    return password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
}
```

3. 添加请求频率限制：
```typescript
import rateLimit from 'express-rate-limit'
const authLimiter = rateLimit({
    windowMs: 15 60 1000, // 15分钟
    max: 5 // 限制5次尝试
})
```

### 长期优化

1. 数据存储升级
   - 迁移到关系型数据库 (如 PostgreSQL)
   - 使用 Redis 进行会话管理
   - 实现数据备份机制

2. 认证机制升级
   - 实现 JWT 或 Session 认证
   - 添加 OAuth 2.0 支持
   - 实现双因素认证 (2FA)

3. 架构优化
   - 引入用户角色和权限系统
   - 实现分布式会话管理
   - 添加审计日志系统

## API 参考

### 注册接口
- 路径: `/api/auth/register`
- 方法: POST
- 请求体:
  ```json
  {
    "username": string,
    "password": string
  }
  ```

### 登录接口
- 路径: `/api/auth/login`
- 方法: POST
- 请求体:
  ```json
  {
    "username": string,
    "password": string
  }
  ```

### 登出接口
- 路径: `/api/auth/logout`
- 方法: POST

### 状态检查接口
- 路径: `/api/auth/check`
- 方法: GET

结语
当前认证系统实现了基础的功能，但从安全性和可扩展性方面还有较大的提升空间。建议按照优化建议逐步改进，使系统更加健壮和安全。
对于新加入的开发人员，建议首先熟悉 AppContext 的使用方式，了解认证状态的管理流程，然后再深入了解后端 API 的实现细节。