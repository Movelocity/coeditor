import MarkdownPreview from '@uiw/react-markdown-preview'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { json } from '@codemirror/lang-json'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import '@uiw/react-markdown-preview/markdown.css'
import { dracula } from '@uiw/codemirror-theme-dracula'

import {EditorView} from '@codemirror/view'
const consolas_font = EditorView.theme({
  ".cm-content": {
    fontFamily: "Consolas, Monaco, Lucida Console, monospace",
    fontSize: "18px"
  },
});

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

  const getLanguageExtension = (suffix: string) => {
    switch (suffix.toLowerCase()) {
      case 'md':
        return markdown()
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return javascript({ jsx: true, typescript: suffix.includes('ts') })
      case 'py':
        return python()
      case 'cpp':
      case 'c':
      case 'h':
        return cpp()
      case 'java':
        return java()
      case 'json':
        return json()
      case 'html':
        return html()
      case 'css':
        return css()
      default:
        return markdown()
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
          <CodeMirror
            value={content}
            height="100%"
            onChange={onChange}
            extensions={[getLanguageExtension(suffix), dracula, consolas_font, EditorView.lineWrapping]}
            theme="dark"
            style={{ fontSize: '12px' }}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightActiveLine: true,
              foldGutter: true,
              autocompletion: true,
              bracketMatching: true,
              closeBrackets: true,
              indentOnInput: true,
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Editor