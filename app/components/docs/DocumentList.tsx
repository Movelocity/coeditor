import { useEffect, useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { FileItem } from '@/lib/types'
import { fetchUserDocuments } from '@/request/docs'

interface DocumentListProps {
  onSelect: (path: string) => void
  selectedPath: string | null
}

const DocumentList = ({ onSelect, selectedPath }: DocumentListProps) => {
  const { user } = useApp()
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <div className="text-gray-400">Loading documents...</div>
  }

  return (
    <div className="p-4 space-y-2 h-full overflow-y-auto">
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