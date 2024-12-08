import { FileItem } from '@/lib/types'
import { API_BASE_PATH } from '@/lib/constants'

type DocumentMode = 'public' | 'private'

export const fetchUserDocuments = async (userId: string | undefined, mode: DocumentMode = 'private'): Promise<FileItem[]> => {
  if (!userId && mode === 'private') {
    throw new Error('UserId is required for private documents')
  }
  const response = await fetch(`${API_BASE_PATH}/docs/${userId || 'public'}/list?mode=${mode}`)
  if (!response.ok) {
    throw new Error('Failed to fetch documents')
  }
  const data = await response.json()
  return data.files
}

export const fetchDocument = async (userId: string | undefined, path: string, mode: DocumentMode = 'private'): Promise<string> => {
  if (!userId && mode === 'private') {
    throw new Error('UserId is required for private documents')
  }
  const response = await fetch(`${API_BASE_PATH}/docs/${userId || 'public'}/${path}?mode=${mode}`)
  if (!response.ok) {
    throw new Error('Failed to load document')
  }
  const data = await response.json()
  return data.content
}

export const saveDocument = async (userId: string | undefined, path: string, content: string, mode: DocumentMode = 'private'): Promise<void> => {
  if (!userId && mode === 'private') {
    throw new Error('UserId is required for private documents')
  }
  const response = await fetch(`${API_BASE_PATH}/docs/${userId || 'public'}/${path}?mode=${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  })
  
  if (!response.ok) {
    throw new Error('Failed to save document')
  }
}

export const createDocument = async (userId: string | undefined, fileName: string, mode: DocumentMode = 'private'): Promise<string> => {
  if (!userId && mode === 'private') {
    throw new Error('UserId is required for private documents')
  }
  const path = fileName.includes('.') ? fileName : `${fileName}.md`

  // Create initial content with a title and basic structure
  const initialContent = `# ${fileName}\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`

  const response = await fetch(`${API_BASE_PATH}/docs/${userId || 'public'}/${path}?mode=${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: initialContent })
  })

  if (!response.ok) {
    throw new Error('Failed to create document')
  }

  return path
}

export const renameDocument = async (userId: string | undefined, oldPath: string, newPath: string, mode: DocumentMode = 'private'): Promise<void> => {
  if (!userId && mode === 'private') {
    throw new Error('UserId is required for private documents')
  }
  const response = await fetch(`${API_BASE_PATH}/docs/${userId || 'public'}/rename?mode=${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldPath, newPath })
  })
  
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || 'Failed to rename document')
  }
} 