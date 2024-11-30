'use client'
import { useState, useEffect } from 'react'
import DocumentList from '@/components/docs/DocumentList'
import DocumentEditor from '@/components/docs/DocumentEditor'
import { Resizable } from "@/components/ui/Resizable"

interface DocumentsEditorProps {
  type?: 'public' | 'private'
}

const DocumentsEditor = ({ type = 'private' }: DocumentsEditorProps) => {
  const [selectedDoc, setSelectedDoc] = useState<string | undefined>(undefined)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // reset selected doc when type changes
  useEffect(() => {
    setSelectedDoc('')
  }, [type])

  return (
    <div className="h-[calc(100vh-theme(spacing.32))]">
      <Resizable
        collapsed={isCollapsed}
        onCollapse={setIsCollapsed}
        leftPanel={
          <div className="h-full bg-gray-900 rounded-lg relative">
            <DocumentList 
              onSelect={setSelectedDoc} 
              selectedPath={selectedDoc}
              type={type}
            />
          </div>
        }
        rightPanel={
          <div className="h-full bg-gray-900 rounded-lg overflow-hidden">
            {selectedDoc ? (
              <DocumentEditor path={selectedDoc} type={type} />
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

export default DocumentsEditor 