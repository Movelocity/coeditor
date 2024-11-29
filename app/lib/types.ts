export type User = {
  id: string
  username: string
  password: string // 实际项目中应该存储加密后的密码
  createdAt: string
}

export type LoginForm = {
  username: string
  password: string
}

export type RegisterForm = LoginForm 