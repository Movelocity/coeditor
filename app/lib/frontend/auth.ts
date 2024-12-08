type AuthResponse = {
  user: {
    id: string
    username: string
    email: string
    createdAt: string
  }
  token: string
}
import { API_BASE_PATH } from '@/lib/constants'

export const login = async (email: string, username: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_PATH}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '登录失败')
  }

  return response.json()
}

export const register = async (email: string, username: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_PATH}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, username, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '注册失败')
  }

  return response.json()
}

export type CheckAuthResponse = {
  id: string
  username: string
}

export const checkAuth = async (): Promise<CheckAuthResponse> => {
  const response = await fetch(`${API_BASE_PATH}/auth/check`, {
    method: 'GET',
    credentials: 'include'
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '验证失败')
  }

  return response.json()
} 