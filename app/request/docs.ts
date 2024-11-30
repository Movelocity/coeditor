import { FileItem } from '@/lib/types'

export const fetchUserDocuments = async (userId: string): Promise<FileItem[]> => {
  const response = await fetch(`/api/docs/${userId}/list`)
  if (!response.ok) {
    throw new Error('Failed to fetch documents')
  }
  const data = await response.json()
  return data.files
}

export const fetchDocument = async (userId: string, path: string): Promise<string> => {
  const response = await fetch(`/api/docs/${userId}/${path}`)
  if (!response.ok) {
    throw new Error('Failed to load document')
  }
  const data = await response.json()
  return data.content
}

export const saveDocument = async (userId: string, path: string, content: string): Promise<void> => {
  const response = await fetch(`/api/docs/${userId}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  })
  
  if (!response.ok) {
    throw new Error('Failed to save document')
  }
}

export const createDocument = async (userId: string, fileName: string): Promise<string> => {
  // Add .md suffix if no extension exists
  const path = fileName.includes('.') ? fileName : `${fileName}.md`
  
  const response = await fetch(`/api/docs/${userId}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: '' })
  })

  if (!response.ok) {
    throw new Error('Failed to create document')
  }

  return path
} 