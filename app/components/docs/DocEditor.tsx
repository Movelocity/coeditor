import { useState, useEffect, useCallback, useRef } from 'react'
import { useApp } from '@/contexts/AppContext'
import { fetchDocument, saveDocument } from '@/lib/frontend/docs'
import Editor from './Editor'

interface DocumentEditorProps {
  path: string
  type: 'public' | 'private'
  isPreviewMode: boolean
  onUnsavedChanges: (hasChanges: boolean) => void
}

const DocumentEditor = ({ path, type, isPreviewMode, onUnsavedChanges }: DocumentEditorProps) => {
  const { user } = useApp()
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [isSaving, setIsSaving] = useState(false)
  const lastSavedContentRef = useRef('')

  useEffect(() => {
    onUnsavedChanges(content !== lastSavedContentRef.current)
  }, [content, onUnsavedChanges])

  useEffect(() => {
    if (content === lastSavedContentRef.current) return

    const autoSaveTimer = setInterval(() => {
      handleSave()
    }, 20000)

    return () => clearInterval(autoSaveTimer)
  }, [content, lastSavedContentRef.current])

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
    if (content === lastSavedContentRef.current) return
    
    try {
      setIsSaving(true)
      await saveDocument(user?.id, path, content, type)
      lastSavedContentRef.current = content
      onUnsavedChanges(false)
    } catch (err) {
      console.error('Failed to save document:', err)
    } finally {
      setIsSaving(false)
    }
  }, [content, path, user?.id, type, onUnsavedChanges])

  if (isLoading) {
    return <div className="flex items-center justify-center h-full text-gray-400">Loading document...</div>
  }

  return (
    <div className="flex flex-col h-full max-w-full relative">
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