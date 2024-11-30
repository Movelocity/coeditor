import { useState, useCallback } from 'react'

interface ResizableProps {
  leftPanel: React.ReactNode
  rightPanel: React.ReactNode
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
}

export const Resizable = ({ leftPanel, rightPanel, collapsed, onCollapse }: ResizableProps) => {
  const [width, setWidth] = useState(300)
  const [isResizing, setIsResizing] = useState(false)

  const handleMouseDown = useCallback(() => {
    setIsResizing(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isResizing) return
    const newWidth = e.clientX
    setWidth(Math.max(200, Math.min(newWidth, 600)))
  }, [isResizing])

  return (
    <div 
      className="flex h-[calc(90vh-1rem)]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className={`transition-all duration-300 ${
          collapsed ? 'w-0 overflow-hidden' : ''
        }`}
        style={{ width: collapsed ? 0 : width }}
      >
        {leftPanel}
      </div>
      
      <div
        className="w-1 bg-gray-800 hover:bg-sky-600 cursor-col-resize flex items-center"
        onMouseDown={handleMouseDown}
      >
        <button
          onClick={() => onCollapse(!collapsed)}
          className="w-4 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center"
        >
        </button>
      </div>

      <div className="flex-1">
        {rightPanel}
      </div>
    </div>
  )
} 