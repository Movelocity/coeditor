import { useState } from 'react'
import rehypeRewrite from "rehype-rewrite";
import MarkdownPreview from '@uiw/react-markdown-preview'
import CodeEditor from '@uiw/react-textarea-code-editor'
import '@uiw/react-markdown-preview/markdown.css'

// import { WYSIWYG_Editor } from '@/components/wysiwyg/Editor'

interface EditorProps {
  content: string
  onChange: (content: string) => void
  onSave: () => void
  suffix?: string
  isPreview?: boolean
}

const Editor = ({ content, onChange, onSave, suffix = 'md', isPreview = false }: EditorProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault()
      onSave()
    }
  }

  return (
    <div className="flex flex-col h-full relative max-w-full overflow-hidden">
      <div className="flex-1 relative overflow-x-hidden" onKeyDown={handleKeyDown}>
        {suffix === 'md' && isPreview ? (
          <div className="h-full overflow-auto p-4 prose prose-invert max-w-none">
            <MarkdownPreview   
              source={content} 
              style={{ backgroundColor: '#1f2937', color: '#E5E7EB' }}
              className='markdown-preview'
            />
          </div>
        ) : (
          suffix === 'md' ? (
            <CodeEditor
              value={content}
              language="markdown"
              onChange={(e) => onChange(e.target.value)}
              padding={16}
              style={{ fontSize: '16px', backgroundColor: '#1f2937', color: '#E5E7EB', fontFamily: 'Consolas' }}
              placeholder="Start writing..."
              data-color-mode="dark"
              rehypePlugins={[
                [
                  rehypeRewrite,
                  {
                    rewrite: (node:any, index:number, parent:any ) => {
                      // console.log(node.type, node.value, node.properties?.className)
                      if (node.type === "text") {
                        node.value = node.value.replace(/&quot;/g, '"')
                      }
                    }
                  }
                ]
              ]}
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