'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DocumentAccessType, FileItem } from '@/lib/types'
import { fetchUserDocuments } from '@/lib/frontend/docs'
import { FiSearch, FiFile, FiLogOut } from 'react-icons/fi'

// Components
import Sidebar from '@/components/notes/Sidebar'
import Editor from '@/components/notes/Editor'
import Banner from '@/components/notes/Banner'

const NotesPage = () => {
  const [files, setFiles] = useState<FileItem[]>([])
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [accessType, setAccessType] = useState<DocumentAccessType>('public')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadFiles = async () => {
      const response = await fetchUserDocuments(accessType)
      setFiles(response)
    }
    loadFiles()
  }, [accessType])

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Left sidebar */}
      <Sidebar 
        files={files}
        accessType={accessType}
        onAccessTypeChange={setAccessType}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFile={selectedFile}
        onFileSelect={setSelectedFile}
      />

      {/* Right content area */}
      <div className="flex-1 flex flex-col">
        <Banner 
          selectedFile={selectedFile}
        />
        <Editor 
          file={selectedFile}
        />
      </div>
    </div>
  )
}

export default NotesPage
