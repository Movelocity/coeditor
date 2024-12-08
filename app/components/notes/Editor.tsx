import { useEffect, useState } from 'react'
import { FileItem, DocumentAccessType } from '@/lib/types'
import { fetchDocument, saveDocument } from '@/lib/frontend/docs'
import { useApp } from '@/contexts/AppContext'

interface EditorProps {
  file: FileItem | null
}

const Editor = ({ file }: EditorProps) => {
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const { user } = useApp()
  const userId = user?.id || 'public'

  useEffect(() => {
    const loadContent = async () => {
      if (file) {
        const content = await fetchDocument(userId, file.path)
        setContent(content)
      } else {
        setContent('')
      }
    }
    loadContent()
  }, [file, userId])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  const handleSave = async () => {
    if (!file) return

    setIsSaving(true)
    try {
      await saveDocument(userId, file.path, content)
    } finally {
      setIsSaving(false)
    }
  }

  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a file to start editing
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="flex-1 relative">
        <textarea
          value={content}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full resize-none bg-gray-800 text-gray-100 p-4 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
          placeholder="Start typing..."
        />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-4 py-2 rounded ${
            isSaving
              ? 'bg-gray-700 text-gray-400'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default Editor 