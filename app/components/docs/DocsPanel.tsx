'use client'
import { useState, useEffect, useRef } from 'react'
import DocumentList from '@/components/docs/DocList'
import DocumentEditor from '@/components/docs/DocEditor'
import { Resizable } from "@/components/ui/Resizable"

interface DocsPanelProps {
  type?: 'public' | 'private'
}

const DocsPanel = ({ type = 'private' }: DocsPanelProps) => {
  const [selectedDoc, setSelectedDoc] = useState<string | undefined>(undefined)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isNarrowScreen, setIsNarrowScreen] = useState(false)
  const userManualToggle = useRef(false)

  // Check screen width on mount and window resize
  useEffect(() => {
    const checkScreenWidth = () => {
      setIsNarrowScreen(window.innerWidth < 768)
    }
    
    checkScreenWidth()
    window.addEventListener('resize', checkScreenWidth)
    return () => window.removeEventListener('resize', checkScreenWidth)
  }, [])

  // reset selected doc when type changes
  useEffect(() => {
    setSelectedDoc('')
  }, [type])

  // Auto collapse on narrow screen when doc is selected
  useEffect(() => {
    if (selectedDoc && isNarrowScreen && !userManualToggle.current) {
      setIsCollapsed(true)
    }
  }, [selectedDoc, isNarrowScreen])

  const handleSelectDoc = (path: string) => {
    console.log('select doc', path)
    setSelectedDoc(path)
  }

  const handleCollapse = (collapsed: boolean) => {
    userManualToggle.current = true
    setIsCollapsed(collapsed)
    // Reset the manual toggle flag after a short delay
    setTimeout(() => {
      userManualToggle.current = false
    }, 100)
  }

  return (
    <div className="h-[calc(100vh-theme(spacing.32))]">
      <Resizable
        collapsed={isCollapsed}
        onCollapse={handleCollapse}
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
          <div className="h-full bg-gray-800 rounded-lg overflow-y-scroll">
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