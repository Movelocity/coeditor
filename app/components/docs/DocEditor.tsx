import { useState, useEffect, useCallback, useRef } from 'react'
import { useApp } from '@/contexts/AppContext'
import { fetchDocument, saveDocument } from '@/lib/frontend/docs'
import Editor from './Editor'

interface DocumentEditorProps {
  path: string
  type: 'public' | 'private'
}

const DocumentEditor = ({ path, type }: DocumentEditorProps) => {
  const { user } = useApp()
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const lastSavedContentRef = useRef('')
  const [isPreviewMode, setIsPreviewMode] = useState(true)

  useEffect(() => {
    setHasUnsavedChanges(content !== lastSavedContentRef.current)
  }, [content])

  useEffect(() => {
    if (!hasUnsavedChanges) return

    const autoSaveTimer = setInterval(() => {
      handleSave()
    }, 20000)

    return () => clearInterval(autoSaveTimer)
  }, [hasUnsavedChanges])

  useEffect(() => {
    setContent('')
    setIsLoading(true)
    setError(undefined)
    lastSavedContentRef.current = ''
  }, [path, type])

  const suffix = path.split('.').pop() || ''
  const suffixLength = !suffix ? 0 : suffix.length+1 // +1 for the dot
  useEffect(() => {
    const loadDocument = async () => {
      if (!path || !user?.id) return
      try {
        setIsLoading(true)
        const documentContent = await fetchDocument(user?.id, path, type)
        setContent(documentContent)
        lastSavedContentRef.current = documentContent
        setError(undefined)
      } catch (err) {
        setError('Failed to load document')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadDocument()
  }, [path, user?.id])

  const handleSave = useCallback(async () => {
    if (!hasUnsavedChanges) return
    
    try {
      setIsSaving(true)
      await saveDocument(user?.id, path, content, type)
      lastSavedContentRef.current = content
      setHasUnsavedChanges(false)
    } catch (err) {
      console.error('Failed to save document:', err)
    } finally {
      setIsSaving(false)
    }
  }, [content, path, user?.id, type, hasUnsavedChanges])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
      e.preventDefault()
      setIsPreviewMode(prev => !prev)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (isLoading) {
    return <div className="flex items-center justify-center h-full text-gray-400">Loading document...</div>
  }

  return (
    <div className="flex flex-col h-full max-w-full">
      <div className="flex justify-between items-center pb-4 p-2 border-b border-gray-700 overflow-x-hidden">
        <div className="flex items-baseline gap-2 min-w-0">
          <h2 className="text-xl font-semibold text-gray-200 truncate max-w-[60vw]">{path.slice(0, -suffixLength)}</h2>
          {hasUnsavedChanges ? (
            <span className="text-xs text-gray-500 shrink-0">未保存</span>
          ) : (
            <span className="text-xs text-gray-500 shrink-0">已保存</span>
          )}
          {suffix === 'md' && (
            <button
              onClick={() => setIsPreviewMode(prev => !prev)}
              className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded-sm text-gray-200"
            >
              {isPreviewMode ? '编辑' : '预览'}
            </button>
          )}
        </div>
        <div className="text-xs text-gray-500 shrink-0">
          Ctrl+S 保存 {suffix === 'md' && '| Ctrl+P 预览'}
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm mb-4">{error}</div>
      )}

      <Editor
        content={content}
        onChange={setContent}
        onSave={handleSave}
        suffix={suffix}
        isPreview={isPreviewMode}
      />
    </div>
  )
}

export default DocumentEditor 