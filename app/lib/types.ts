/**
 * 用户信息接口
 */
export interface User {
  /** 用户唯一标识 */
  id: string
  /** 用户名 */
  username: string
  /** 邮箱地址 */
  email: string
  /** 加密后的密码 */
  password: string
  /** 创建时间 */
  createdAt: string
}

/**
 * 简化的用户信息类型
 * 用于前端展示和基本身份标识
 */
export type SimpleUser = Pick<User, 'id' | 'username'>;

/**
 * 登录表单数据类型
 */
export type LoginForm = {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
}

/**
 * 注册表单数据类型
 * 继承自登录表单
 */
export type RegisterForm = LoginForm 

/**
 * 文件项类型
 */
export type FileItem = {
  /** 文件名 */
  name: string;
  /** 文件后缀 */
  suffix: string;
  /** 类型：文件或目录 */
  type: 'file' | 'directory';
  /** 文件路径 */
  path: string;
  /** 创建时间 */
  createdAt: string;
  /** 最后修改时间 */
  modifiedAt: string;
}

/**
 * 认证响应类型
 */
export type AuthResponse = {
  /** 用户信息 */
  user: Omit<User, 'password'>;
  /** JWT令牌 */
  token: string;
}

/**
 * 文档访问类型
 */
export type DocumentAccessType = 'public' | 'private';

/**
 * API响应基础类型
 */
export type ApiResponse<T = void> = {
  /** 响应数据 */
  data?: T;
  /** 错误信息 */
  error?: string;
  /** HTTP状态码 */
  status?: number;
  /** 操作是否成功 */
  success?: boolean;
}