import { AuthResponse, ApiResponse, SimpleUser } from '@/lib/types'
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
 * 检查用户是否已登录并获取用户信息
 * @returns 用户信息，如果未登录则返回公共用户
 * @throws {ApiError} 当验证失败时抛出
 */
export const checkAuth = async (): Promise<SimpleUser> => {
  try {
    const response = await fetch(`${API_BASE_PATH}/auth/check`)
    const data: ApiResponse<SimpleUser> = await response.json()
    
    if (!response.ok) {
      throw new ApiError(data.error || '验证失败', response.status)
    }
    
    return data.data || { id: 'public', username: '' }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    return { id: 'public', username: '' }
  }
}

/**
 * 用户登出
 * @returns 如果登出成功返回true
 * @throws {ApiError} 当登出失败时抛出
 */
export const logout = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_PATH}/auth/logout`, {
      method: 'POST'
    })
    
    if (!response.ok) {
      throw new ApiError('登出失败', response.status)
    }
    
    return true
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('登出失败', 500)
  }
}

/**
 * 获取当前认证令牌
 * @returns 认证令牌，如果不存在则返回null
 */
export const getAuthToken = (): string | null => {
  const cookies = document.cookie.split(';')
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='))
  return tokenCookie ? tokenCookie.split('=')[1] : null
} 