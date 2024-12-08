import { AuthResponse, ApiResponse } from '@/lib/types'
import { API_BASE_PATH } from '@/lib/constants'

/**
 * API请求错误
 */
export class ApiError extends Error {
  constructor(message: string, public status: number = 500) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * 用户登录
 * @param email - 用户邮箱
 * @param password - 用户密码
 * @returns 包含用户信息和认证令牌的响应
 * @throws {ApiError} 当登录失败时抛出
 */
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_PATH}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data: ApiResponse<AuthResponse> = await response.json()

  if (!response.ok) {
    throw new ApiError(data.error || '登录失败', response.status)
  }

  return data.data as AuthResponse
}

/**
 * 用户注册
 * @param email - 用户邮箱
 * @param username - 用户名
 * @param password - 用户密码
 * @returns 包含用户信息和认证令牌的响应
 * @throws {ApiError} 当注册失败时抛出
 */
export const register = async (email: string, username: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_PATH}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, username, password }),
  })

  const data: ApiResponse<AuthResponse> = await response.json()

  if (!response.ok) {
    throw new ApiError(data.error || '注册失败', response.status)
  }

  return data.data as AuthResponse
}

/**
 * 检查用户是否已登录
 * @returns 如果已登录返回true，否则返回false
 */
export const checkAuth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_PATH}/auth/check`)
    return response.ok
  } catch {
    return false
  }
}

/**
 * 用户登出
 * @returns 如果登出成功返回true
 */
export const logout = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_PATH}/auth/logout`, {
      method: 'POST'
    })
    return response.ok
  } catch {
    return false
  }
} 