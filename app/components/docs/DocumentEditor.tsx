import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { fetchDocument, saveDocument } from '@/lib/frontend/docs'

interface DocumentEditorProps {
  path: string
  onSave?: () => void
}

const DocumentEditor = ({ path, onSave }: DocumentEditorProps) => {
  const { user } = useApp()
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchDoc = async () => {
      if (!user) return
      setLoading(true)
      
      try {
        const content = await fetchDocument(user.id, path)
        setContent(content)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load document')
      } finally {
        setLoading(false)
      }
    }

    fetchDoc()
  }, [path, user])

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (content !== '') {
        handleSave()
      }
    }, 30*1000)

    return () => clearInterval(autoSaveInterval)
  }, [content])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setError('')

    try {
      await saveDocument(user.id, path, content)
      onSave?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full text-gray-400">Loading document...</div>
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-200 truncate">{path}</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
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