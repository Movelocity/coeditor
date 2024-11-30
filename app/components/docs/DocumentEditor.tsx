import { useState, useEffect, useCallback } from 'react'
import { useApp } from '@/contexts/AppContext'
import { fetchDocument, saveDocument } from '@/lib/frontend/docs'

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

  useEffect(() => {
    const loadDocument = async () => {
      if (!path || !user?.id) return
      try {
        setIsLoading(true)
        console.log("fetching document", user?.id, path, type)
        const documentContent = await fetchDocument(user?.id, path, type)
        setContent(documentContent)
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
    try {
      setIsSaving(true)
      await saveDocument(user?.id, path, content, type)
    } catch (err) {
      console.error('Failed to save document:', err)
    } finally {
      setIsSaving(false)
    }
  }, [content, path, user?.id, type])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-full text-gray-400">Loading document...</div>
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-200 truncate">{path}</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-sm mb-4">{error}</div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 p-4 bg-gray-800 text-gray-200 rounded-md resize-none focus:outline-none font-['Consolas']"
        placeholder="Start writing..."
        spellCheck={false}
      />
    </div>
  )
}

export default DocumentEditor 