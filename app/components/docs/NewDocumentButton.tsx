import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { createDocument } from '@/request/docs'

interface NewDocumentButtonProps {
  onCreated?: (path: string) => void
}

const NewDocumentButton = ({ onCreated }: NewDocumentButtonProps) => {
  const { user } = useApp()
  const [isCreating, setIsCreating] = useState(false)
  const [fileName, setFileName] = useState('')

  const handleCreate = async () => {
    if (!user || !fileName.trim()) return

    try {
      const path = await createDocument(user.id, fileName)
      onCreated?.(path)
      setFileName('')
      setIsCreating(false)
    } catch (error) {
      console.error('Failed to create document:', error)
    }
  }

  return (
    <div>
      <button
        onClick={() => setIsCreating(true)}
        className="w-6 h-6 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center"
        aria-label="Create new document"
      >
        +
      </button>

      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Create New Document</h3>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full p-2 bg-gray-700 text-gray-200 rounded-md"
              placeholder="Document name"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-400 hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewDocumentButton 