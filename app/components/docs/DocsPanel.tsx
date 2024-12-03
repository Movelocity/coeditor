'use client'
import { useState, useEffect } from 'react'
import DocumentList from '@/components/docs/DocList'
import DocumentEditor from '@/components/docs/DocEditor'
import { Resizable } from "@/components/ui/Resizable"

interface DocsPanelProps {
  type?: 'public' | 'private'
}

const DocsPanel = ({ type = 'private' }: DocsPanelProps) => {
  const [selectedDoc, setSelectedDoc] = useState<string | undefined>(undefined)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // reset selected doc when type changes
  useEffect(() => {
    setSelectedDoc('')
  }, [type])

  const handleSelectDoc = (path: string) => {
    console.log('select doc', path)
    setSelectedDoc(path)
  }

  return (
    <div className="h-[calc(100vh-theme(spacing.32))]">
      <Resizable
        collapsed={isCollapsed}
        onCollapse={setIsCollapsed}
        leftPanel={
          <div className="h-full bg-gray-900 rounded-l-lg relative">
            <DocumentList 
              onSelect={handleSelectDoc} 
              selectedPath={selectedDoc}
              type={type}
            />
          </div>
        }
        rightPanel={
          <div className="h-full bg-gray-800 rounded-lg overflow-hidden">
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

export default DocsPanel 