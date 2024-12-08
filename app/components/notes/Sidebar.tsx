import { DocumentAccessType, FileItem } from '@/lib/types'
import { FiSearch, FiFolder, FiFile } from 'react-icons/fi'

interface SidebarProps {
  files: FileItem[]
  accessType: DocumentAccessType
  searchQuery: string
  selectedFile: FileItem | null
  onAccessTypeChange: (type: DocumentAccessType) => void
  onSearchChange: (query: string) => void
  onFileSelect: (file: FileItem) => void
}

const Sidebar = ({
  files,
  accessType,
  searchQuery,
  selectedFile,
  onAccessTypeChange,
  onSearchChange,
  onFileSelect,
}: SidebarProps) => {
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-64 border-r border-gray-700 flex flex-col">
      {/* Workspace switcher */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => onAccessTypeChange('public')}
            className={`flex-1 px-3 py-2 rounded ${
              accessType === 'public'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Public
          </button>
          <button
            onClick={() => onAccessTypeChange('private')}
            className={`flex-1 px-3 py-2 rounded ${
              accessType === 'private'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Private
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500 text-gray-100"
          />
        </div>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {filteredFiles.map((file) => (
            <button
              key={file.path}
              onClick={() => onFileSelect(file)}
              className={`w-full flex items-center px-3 py-2 rounded mb-1 ${
                selectedFile?.path === file.path
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              {file.type === 'directory' ? (
                <FiFolder className="mr-2" />
              ) : (
                <FiFile className="mr-2" />
              )}
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar 