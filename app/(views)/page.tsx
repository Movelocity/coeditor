'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DocumentAccessType, FileItem } from '@/lib/types'
import { createDocument, fetchUserDocuments } from '@/lib/frontend/docs'
import { FiSearch, FiFile, FiLogOut } from 'react-icons/fi'
import { useAuth } from '@/lib/hooks/useAuth'
import AuthModal from '@/components/auth/AuthModal'

// Components
import Sidebar from '@/components/notes/Sidebar'
import Editor from '@/components/notes/Editor'
import Banner from '@/components/notes/Banner'

const NotesPage = () => {
  const { user, isLoading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [files, setFiles] = useState<FileItem[]>([])
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [accessType, setAccessType] = useState<DocumentAccessType>('public')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!isLoading && !user) {
      setShowAuthModal(true)
    }
  }, [user, isLoading])

  useEffect(() => {
    const loadFiles = async () => {
      const response = await fetchUserDocuments(user?.id, accessType)
      setFiles(response)
    }
    if (accessType === 'public' || user) {
      loadFiles()
    }
  }, [accessType, user])

  const handleCreateNew = async () => {
    if (accessType === 'private' && !user) {
      setShowAuthModal(true)
      return
    }

    const newFile: FileItem = {
      name: 'Untitled Document',
      type: 'file',
      path: `/${accessType}/untitled-${Date.now()}.md`,
      suffix: 'md',
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    }

    try {
      await createDocument(user?.id, newFile.path, accessType)
      setFiles(prev => [newFile, ...prev])
      setSelectedFile(newFile)
    } catch (error) {
      console.error('Failed to create document:', error)
    }
  }

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="text-white">Loading...</div>
    </div>
  }

  return (
    <>
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
          onCreateNew={handleCreateNew}
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

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      )}
    </>
  )
}

export default NotesPage
