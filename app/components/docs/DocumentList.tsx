import { useEffect, useState, useCallback } from 'react'
import { useApp } from '@/contexts/AppContext'
import { FileItem } from '@/lib/types'
import { fetchUserDocuments, createDocument } from '@/lib/frontend/docs'
import { PlusIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'

interface DocumentListProps {
  onSelect: (path: string) => void
  selectedPath?: string
  type: 'public' | 'private'
}

const DocumentList = ({ onSelect, selectedPath, type }: DocumentListProps) => {
  const { user } = useApp()
  const [files, setFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>()

  const loadDocuments = useCallback(async () => {
    try {
      setIsLoading(true)
      const documents = await fetchUserDocuments(user?.id, type)
      setFiles(documents)
      setError(undefined)
    } catch (err) {
      setError('Failed to load documents')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, type])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  const handleCreateDocument = async () => {
    try {
      const fileName = prompt('Enter document name:')
      if (!fileName) return

      const path = await createDocument(user?.id, fileName, type)
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

  if (isLoading) {
    return <div className="text-gray-400 p-4">Loading documents...</div>
  }

  return (
    <div className="p-4 space-y-2 h-full overflow-y-auto">
      {/* New Document Button */}
      <button
        onClick={handleCreateDocument}
        className="flex items-center space-x-2 w-full p-2 rounded-md hover:bg-gray-800/50 text-gray-400"
      >
        <PlusIcon className="w-4 h-4" />
        <span>New Document</span>
      </button>

      {/* Document List */}
      {files.map((file) => (
        <div
          key={file.path}
          onClick={() => onSelect(file.path)}
          className={`flex items-center p-2 rounded-md cursor-pointer transition-colors
            ${selectedPath === file.path ? 'bg-gray-800' : 'hover:bg-gray-800/50'}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelect(file.path)}
        >
          <span className="text-gray-200 truncate flex-1">{file.name}</span>
          <span className="text-gray-400 text-sm ml-2">{file.type}</span>
        </div>
      ))}
    </div>
  )
}

export default DocumentList 