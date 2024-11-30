'use client'
import { useState } from 'react'
import DocumentList from '@/components/docs/DocumentList'
import DocumentEditor from '@/components/docs/DocumentEditor'
import NewDocumentButton from '@/components/docs/NewDocumentButton'
import { useApp } from '@/contexts/AppContext'
import { Resizable } from "@/components/ui/Resizable"

const DocumentsPage = () => {
  const { user } = useApp()
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (!user) {
    return (
      <div className="text-center text-gray-400">
        Please login to access documents
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-theme(spacing.16))]">
      <Resizable
        collapsed={isCollapsed}
        onCollapse={setIsCollapsed}
        leftPanel={
          <div className="h-full bg-gray-900 rounded-lg relative">
            <div className="flex flex-row items-center justify-end px-2 py-1 ">
              <NewDocumentButton onCreated={path => setSelectedDoc(path)} />
            </div>
            <DocumentList onSelect={setSelectedDoc} selectedPath={selectedDoc} />
          </div>
        }
        rightPanel={
          <div className="h-full bg-gray-900 rounded-lg overflow-hidden">
            {selectedDoc ? (
              <DocumentEditor path={selectedDoc} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a document to edit
              </div>
            )}
          </div>
        }
      />
    </div>
  )
}

export default DocumentsPage 