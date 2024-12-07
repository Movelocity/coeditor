import { useState, useCallback } from 'react'
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
// import { ChevronLeft, ChevronRight } from 'react-icons'

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

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsResizing(true)
  }, [])

  const handleTouchEnd = useCallback(() => {
    setIsResizing(false)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isResizing) return
    const touch = e.touches[0]
    const newWidth = touch.clientX
    setWidth(Math.max(200, Math.min(newWidth, 600)))
  }, [isResizing])

  return (
    <div 
      className="flex h-[calc(90vh-1rem)]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
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
        className="w-1 bg-gray-800 hover:bg-sky-600 cursor-col-resize flex items-center relative"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <button
          onClick={() => onCollapse(!collapsed)}
          className="absolute -right-4 w-8 h-16 bg-gray-700 hover:bg-gray-600 rounded-r-lg flex items-center justify-center touch-manipulation"
          aria-label={collapsed ? "Expand panel" : "Collapse panel"}
        >
          {collapsed ? (
            <FaCircleChevronRight className="w-5 h-5 text-gray-300" />
          ) : (
            <FaCircleChevronLeft className="w-5 h-5 text-gray-300" />
          )}
        </button>
      </div>

      <div className="flex-1">
        {rightPanel}
      </div>
    </div>
  )
} 