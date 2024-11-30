export interface User {
  id: string
  username: string
  email: string
  password: string
  createdAt: string
}

export type LoginForm = {
  username: string
  password: string
}

export type RegisterForm = LoginForm 

export type FileItem = {
  name: string;
  type: 'file' | 'directory';
  path: string;
}