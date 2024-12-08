'use client'
import { useState, useEffect, useRef } from 'react'
import DocumentList from '@/components/docs/DocList'
import DocumentEditor from '@/components/docs/DocEditor'
import { Resizable } from "@/components/ui/Resizable"
import Banner from '@/components/Banner'
import { useApp } from '@/contexts/AppContext'
import { useRouter } from 'next/navigation'
import cn from 'classnames'
import { FaChevronLeft } from "react-icons/fa";

interface DocsPanelProps {
  type?: 'public' | 'private'
}

const DocsPanel = ({ type = 'private' }: DocsPanelProps) => {
  const { user } = useApp()
  const [selectedDoc, setSelectedDoc] = useState<string | undefined>(undefined)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isNarrowScreen, setIsNarrowScreen] = useState(false)
  const userManualToggle = useRef(false)
  const router = useRouter()

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

  const handleTabChange = (tab: string) => {
    if (tab === 'private' && !user?.username) {
      router.push('/auth')
      return
    }
  }

  return (
    <div className="h-[100vh]">
      <Resizable
        collapsed={isCollapsed}
        onCollapse={handleCollapse}
        leftPanel={
          <div className="h-full bg-gray-900 rounded-l-lg relative flex flex-col">
            <div className="p-2 border-b border-gray-800 flex flex-col gap-2">
              <div className="flex items-center justify-between p-2">
                <h1 className="text-lg font-semibold text-gray-200">CoEditor</h1>
                <button
                  onClick={() => handleCollapse(true)}
                  className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center touch-manipulation z-10"
                  aria-label="Collapse panel"
                >
                  <FaChevronLeft className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <button
                  className={cn(
                    "px-4 py-2 text-sm rounded-md transition-colors",
                    type === 'public' 
                      ? "bg-gray-800 text-gray-200" 
                      : "text-gray-400 hover:text-gray-300"
                  )}
                  onClick={() => handleTabChange('public')}
                >
                  Public
                </button>
                <button
                  className={cn(
                    "px-4 py-2 text-sm rounded-md transition-colors",
                    type === 'private' 
                      ? "bg-gray-800 text-gray-200" 
                      : "text-gray-400 hover:text-gray-300"
                  )}
                  onClick={() => handleTabChange('private')}
                >
                  Private
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <DocumentList 
                onSelect={handleSelectDoc} 
                selectedPath={selectedDoc}
                type={type}
              />
            </div>
          </div>
        }
        rightPanel={
          <div className="h-full bg-gray-800 rounded-lg flex flex-col">
            <Banner 
              title={selectedDoc}
              description="记录您的想法和灵感"
              username={user?.username}
              showChevron={isCollapsed}
              onChevronClick={() => handleCollapse(false)}
            />
            <div className="flex-1 overflow-y-auto">
              {selectedDoc ? (
                <DocumentEditor path={selectedDoc} type={type} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Select a document to edit
                </div>
              )}
            </div>
          </div>
        }
      />
    </div>
  )
}

export default DocsPanel 