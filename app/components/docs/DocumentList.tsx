import { useEffect, useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { FileItem } from '@/lib/types'
import { fetchUserDocuments, createDocument } from '@/lib/api/docs'
import { PlusIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'

interface DocumentListProps {
  onSelect: (path: string | null) => void
  selectedPath: string | null
  type: 'public' | 'private'
}

const DocumentList = ({ onSelect, selectedPath, type }: DocumentListProps) => {
  const { user } = useApp()
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFiles = async () => {
      if (!user) return
      try {
        const files = await fetchUserDocuments(user.id)
        setFiles(files)
      } catch (error) {
        console.error('Failed to fetch files:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [user])

  const handleCreate = async () => {
    if (!user) return
    const trimmedFileName = newFileName.trim()
    if (!trimmedFileName) {
      setError('File name cannot be empty')
      return
    }

    try {
      const path = await createDocument(user.id, trimmedFileName)
      // Add new file to the list immediately
      setFiles(prev => [{
        path,
        name: trimmedFileName,
        type: 'file'
      }, ...prev])
      setNewFileName('')
      setIsCreating(false)
      setError('')
      onSelect(path) // Select the newly created document
    } catch (error) {
      setError('Failed to create document')
      console.error('Failed to create document:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate()
    } else if (e.key === 'Escape') {
      setIsCreating(false)
      setNewFileName('')
      setError('')
    }
  }

  if (loading) {
    return <div className="text-gray-400 p-4">Loading documents...</div>
  }

  return (
    <div className="p-4 space-y-2 h-full overflow-y-auto">
      {/* New Document Button */}
      {!isCreating ? (
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 w-full p-2 rounded-md hover:bg-gray-800/50 text-gray-400"
        >
          <PlusIcon className="w-4 h-4" />
          <span>New Document</span>
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter document name"
              className="flex-1 bg-gray-700 text-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
            <button
              onClick={handleCreate}
              className="p-1 hover:bg-gray-700 rounded"
              aria-label="Create document"
            >
              <CheckIcon className="w-4 h-4 text-green-500" />
            </button>
            <button
              onClick={() => {
                setIsCreating(false)
                setNewFileName('')
                setError('')
              }}
              className="p-1 hover:bg-gray-700 rounded"
              aria-label="Cancel"
            >
              <XMarkIcon className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
      )}

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