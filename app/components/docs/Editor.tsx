import { useState, useEffect } from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview'
import CodeEditor from '@uiw/react-textarea-code-editor'
import '@uiw/react-markdown-preview/markdown.css'
import styles from './Editor.module.css'

import { WYSIWYG_Editor } from '@/components/wysiwyg/Editor'

interface EditorProps {
  content: string
  onChange: (content: string) => void
  onSave: () => void
  suffix?: string
}

const Editor = ({ content, onChange, onSave, suffix = 'md' }: EditorProps) => {
  const [isPreviewMode, setIsPreviewMode] = useState(true)
  const isMarkdown = suffix === 'md'

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault()
      onSave()
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
      console.log('preview')
      e.preventDefault()
      setIsPreviewMode(prev => !prev)
    }
  }

  return (
    <div className="flex flex-col h-full relative">
      {isMarkdown && (
        <div className="flex justify-end items-center pb-4 absolute top-2 right-2 z-10">
          <button
            onClick={() => setIsPreviewMode(prev => !prev)}
            className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded-sm text-gray-200"
          >
            {isPreviewMode ? '编辑' : '预览'}
          </button>
        </div>
      )}

      <div className="flex-1 relative" onKeyDown={handleKeyDown}>
        {isMarkdown && isPreviewMode ? (
          <div className="h-full overflow-auto p-4 prose prose-invert max-w-none">
            <MarkdownPreview   
              source={content} 
              style={{ backgroundColor: '#1f2937', color: '#E5E7EB' }}
              className={styles['markdown-preview']}
            />
          </div>
          // <WYSIWYG_Editor
          //     initialValue={content}
          //     onChange={onChange}
          //     placeholder="Start writing..."
          //   />
        ) : (
          isMarkdown ? (
            <CodeEditor
              value={content}
              language="markdown"
              onChange={(e) => onChange(e.target.value)}
              padding={16}
              style={{ fontSize: '16px', backgroundColor: '#1f2937', color: '#E5E7EB', fontFamily: 'Consolas' }}
              placeholder="Start writing..."
              data-color-mode="dark"
            />
          ) : (
            <textarea
              value={content}
              onChange={(e) => onChange(e.target.value)}
              className="h-full w-full p-4 bg-gray-800 text-gray-200 resize-none focus:outline-none font-['Consolas']"
              placeholder="Start writing..."
              spellCheck={false}
            />
          )
        )}
      </div>
    </div>
  )
}

export default Editor