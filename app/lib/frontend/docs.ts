import { FileItem, DocumentAccessType, ApiResponse } from '@/lib/types'
import { API_BASE_PATH } from '@/lib/constants'
import { ApiError } from './auth'

/**
 * 获取用于请求的用户ID
 * @param userId - 当前用户ID
 * @param type - 文档访问类型
 * @returns 用于请求的用户ID
 */
const getUserIdForRequest = (userId: string | undefined, type: DocumentAccessType): string => {
  if (type === 'public') return 'public'
  return userId || 'public'
}

/**
 * 获取用户文档列表
 * @param userId - 用户ID
 * @param type - 文档访问类型（公开/私有）
 * @returns 文件列表
 * @throws {ApiError} 当获取文档列表失败时抛出
 */
export const fetchUserDocuments = async (
  userId: string | undefined, 
  type: DocumentAccessType = 'private'
): Promise<FileItem[]> => {
  const requestUserId = getUserIdForRequest(userId, type)
  const response = await fetch(`${API_BASE_PATH}/docs/${requestUserId}/list`)
  
  const data: ApiResponse<{ files: FileItem[] }> = await response.json()
  
  if (!response.ok) {
    throw new ApiError(data.error || '获取文档列表失败', response.status)
  }
  
  return data.data?.files || []
}

/**
 * 获取文档内容
 * @param userId - 用户ID
 * @param path - 文档路径
 * @param type - 文档访问类型（公开/私有）
 * @returns 文档内容
 * @throws {ApiError} 当获取文档内容失败时抛出
 */
export const fetchDocument = async (
  userId: string | undefined, 
  path: string, 
  type: DocumentAccessType = 'private'
): Promise<string> => {
  const requestUserId = getUserIdForRequest(userId, type)
  const response = await fetch(`${API_BASE_PATH}/docs/${requestUserId}/${path}`)
  
  const data: ApiResponse<{ content: string }> = await response.json()
  
  if (!response.ok) {
    throw new ApiError(data.error || '获取文档内容失败', response.status)
  }
  
  return data.data?.content || ''
}

/**
 * 保存文档内容
 * @param userId - 用户ID
 * @param path - 文档路径
 * @param content - 文档内容
 * @param type - 文档访问类型（公开/私有）
 * @throws {ApiError} 当保存文档失败时抛出
 */
export const saveDocument = async (
  userId: string | undefined, 
  path: string, 
  content: string, 
  type: DocumentAccessType = 'private'
): Promise<void> => {
  const requestUserId = getUserIdForRequest(userId, type)
  const response = await fetch(`${API_BASE_PATH}/docs/${requestUserId}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  })
  
  const data: ApiResponse = await response.json()
  
  if (!response.ok) {
    throw new ApiError(data.error || '保存文档失败', response.status)
  }
}

/**
 * 创建新文档
 * @param userId - 用户ID
 * @param fileName - 文件名
 * @param type - 文档访问类型（公开/私有）
 * @returns 创建的文档路径
 * @throws {ApiError} 当创建文档失败时抛出
 */
export const createDocument = async (
  userId: string | undefined, 
  fileName: string, 
  type: DocumentAccessType = 'private'
): Promise<string> => {
  const requestUserId = getUserIdForRequest(userId, type)
  const path = fileName.includes('.') ? fileName : `${fileName}.md`

  const response = await fetch(`${API_BASE_PATH}/docs/${requestUserId}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: '' })
  })

  const data: ApiResponse = await response.json()

  if (!response.ok) {
    throw new ApiError(data.error || '创建文档失败', response.status)
  }

  return path
}

/**
 * 重命名文档
 * @param userId - 用户ID
 * @param oldPath - 原文档路径
 * @param newPath - 新文档路径
 * @param type - 文档访问类型（公开/私有）
 * @throws {ApiError} 当重命名文档失败时抛出
 */
export const renameDocument = async (
  userId: string | undefined, 
  oldPath: string, 
  newPath: string, 
  type: DocumentAccessType = 'private'
): Promise<void> => {
  const requestUserId = getUserIdForRequest(userId, type)
  const response = await fetch(`${API_BASE_PATH}/docs/${requestUserId}/rename`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldPath, newPath })
  })
  
  const data: ApiResponse = await response.json()
  
  if (!response.ok) {
    throw new ApiError(data.error || '重命名文档失败', response.status)
  }
} 