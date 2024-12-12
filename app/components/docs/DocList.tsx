import { useEffect, useState, useCallback } from 'react'
import { useApp } from '@/contexts/AppContext'
import { FileItem } from '@/lib/types'
import { fetchUserDocuments, createDocument, renameDocument } from '@/lib/frontend/docs'
import { FiPlus, FiEdit2 } from "react-icons/fi";
import { IoMdDocument } from "react-icons/io";
import { useRouter, useSearchParams } from 'next/navigation'
import cn from 'classnames'
import { checkAuth } from '@/lib/frontend/auth'

interface DocumentListProps {
  onSelect: (path: string) => void
  selectedPath?: string
}

const DocumentList = ({ onSelect, selectedPath }: DocumentListProps) => {
  const { user, setUser } = useApp()
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') as 'public' | 'private' || 'private'
  const [files, setFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [error, setError] = useState<string>()

  const loadDocuments = useCallback(async () => {
    try {
      setIsLoading(true)
      const documents = await fetchUserDocuments(user?.id, mode)
      setFiles(documents)
      setError(undefined)
    } catch (err) {
      setError('Failed to load documents')
      console.error(err)
    } finally {
      setIsLoading(false)
      setIsInitialLoad(false)
    }
  }, [user?.id, mode])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  const handleCreateDocument = async () => {
    try {
      const fileName = prompt('Enter document name:')
      if (!fileName) return

      const path = await createDocument(user?.id, fileName, mode)
      await loadDocuments()
      onSelect(path)
    } catch (err) {
      console.error('Failed to create document:', err)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateDocument()
    } else if (e.key === 'Escape') {
      setError('')
    }
  }

  const handleRenameDocument = async (file: FileItem) => {
    try {
      const newName = prompt('输入新的文件名:', file.name)
      if (!newName || newName === file.name) return

      const oldPath = file.path
      const dirPath = oldPath.substring(0, oldPath.lastIndexOf('/') + 1) || ''
      const newPath = dirPath + newName + (file.suffix ? '.' + file.suffix : '')

      await renameDocument(user?.id, oldPath, newPath, mode)
      await loadDocuments()
      if (selectedPath === oldPath) {
        onSelect(newPath)
      }
    } catch (err: any) {
      console.error('Failed to rename document:', err)
      alert(err.message || '重命名失败')
    }
  }

  const handleTabChange = async (tab: string) => {
    if (tab === 'private') {
      try {
        const authUser = await checkAuth()
        if (authUser.id === 'public') {
          router.push('/auth')
          return
        }
        setUser(authUser)
      } catch (error) {
        router.push('/auth')
        return
      }
    }
    
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('mode', tab)
    router.push(newUrl.href)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-2">
        <div className="grid grid-cols-2 gap-1">
          <button
            className={cn(
              "px-4 py-2 text-sm rounded-md transition-colors",
              mode === 'public' 
                ? "bg-gray-800 text-gray-200" 
                : "text-gray-400 hover:text-gray-300"
            )}
            onClick={() => handleTabChange('public')}
          >
            Public
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm rounded-md transition-colors",
              mode === 'private' 
                ? "bg-gray-800 text-gray-200" 
                : "text-gray-400 hover:text-gray-300"
            )}
            onClick={() => handleTabChange('private')}
          >
            Private
          </button>
        </div>
      </div>
      
      <div className="p-4 space-y-2 flex-1 overflow-y-auto">
        <button
          onClick={handleCreateDocument}
          className="flex items-center space-x-2 w-full p-2 rounded-md hover:bg-gray-700/50 text-gray-400"
        >
          <FiPlus className="w-4 h-4" />
          <span>New Document</span>
        </button>

        {files.map((file) => (
          <div
            key={file.path}
            className={`flex items-center p-2 rounded-md cursor-pointer transition-colors
              ${selectedPath === file.path ? 'bg-gray-700' : 'hover:bg-gray-600/50'}`}
          >
            <div
              onClick={() => onSelect(file.path)}
              className="flex-1 flex items-center"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(file.path)}
            >
              <span className="text-gray-200 truncate flex items-center">
                <IoMdDocument className="w-4 h-4 mr-2" />
                {file.name}
              </span>
              <span className="text-gray-400 text-sm ml-2">{file.suffix}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleRenameDocument(file)
              }}
              className="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-600 rounded"
              title="重命名"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DocumentList 