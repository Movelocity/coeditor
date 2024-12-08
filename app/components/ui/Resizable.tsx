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
    const containerRect = e.currentTarget.getBoundingClientRect()
    const maxWidth = containerRect.width * 0.8 // Limit to 80% of container width
    const newWidth = e.clientX - containerRect.left
    setWidth(Math.max(200, Math.min(newWidth, maxWidth)))
  }, [isResizing])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsResizing(true)
  }, [])

  const handleTouchEnd = useCallback(() => {
    setIsResizing(false)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isResizing) return
    const containerRect = e.currentTarget.getBoundingClientRect()
    const maxWidth = containerRect.width * 0.8 // Limit to 80% of container width
    const touch = e.touches[0]
    const newWidth = touch.clientX - containerRect.left
    setWidth(Math.max(200, Math.min(newWidth, maxWidth)))
  }, [isResizing])

  return (
    <div 
      className="flex h-full"
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
      />

      <div className="flex-1">
        {rightPanel}
      </div>
    </div>
  )
} 