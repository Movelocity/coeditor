import { FileItem } from '@/lib/types'
import { API_BASE_PATH } from '@/lib/constants'

const getUserIdForRequest = (userId: string | undefined, type: 'public' | 'private'): string => {
  if (type === 'public') return 'public'
  return userId || 'public'
}

export const fetchUserDocuments = async (userId: string | undefined, type: 'public' | 'private' = 'private'): Promise<FileItem[]> => {
  const requestUserId = getUserIdForRequest(userId, type)
  const response = await fetch(`${API_BASE_PATH}/docs/${requestUserId}/list`)
  if (!response.ok) {
    throw new Error('Failed to fetch documents')
  }
  const data = await response.json()
  return data.files
}

export const fetchDocument = async (userId: string | undefined, path: string, type: 'public' | 'private' = 'private'): Promise<string> => {
  const requestUserId = getUserIdForRequest(userId, type)
  const response = await fetch(`${API_BASE_PATH}/docs/${requestUserId}/${path}`)
  if (!response.ok) {
    throw new Error('Failed to load document')
  }
  const data = await response.json()
  return data.content
}

export const saveDocument = async (userId: string | undefined, path: string, content: string, type: 'public' | 'private' = 'private'): Promise<void> => {
  const requestUserId = getUserIdForRequest(userId, type)
  const response = await fetch(`${API_BASE_PATH}/docs/${requestUserId}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  })
  
  if (!response.ok) {
    throw new Error('Failed to save document')
  }
}

export const createDocument = async (userId: string | undefined, fileName: string, type: 'public' | 'private' = 'private'): Promise<string> => {
  const requestUserId = getUserIdForRequest(userId, type)
  const path = fileName.includes('.') ? fileName : `${fileName}.md`

  const response = await fetch(`${API_BASE_PATH}/docs/${requestUserId}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: path })
  })

  if (!response.ok) {
    throw new Error('Failed to create document')
  }

  return path
}

export const renameDocument = async (userId: string | undefined, oldPath: string, newPath: string, type: 'public' | 'private' = 'private'): Promise<void> => {
  const requestUserId = getUserIdForRequest(userId, type)
  const response = await fetch(`${API_BASE_PATH}/docs/${requestUserId}/rename`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldPath, newPath })
  })
  
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || 'Failed to rename document')
  }
} 