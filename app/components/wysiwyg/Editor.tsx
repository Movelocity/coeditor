import { useState, useCallback, useRef, useEffect } from 'react';
import Toolbar from './Toolbar';
import Preview from './Preview';
import type { EditorProps } from './types';

const Editor = ({ initialValue = '', onChange, placeholder }: EditorProps) => {
  const [content, setContent] = useState(initialValue);
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback((value: string) => {
    setContent(value);
    onChange?.(value);
  }, [onChange]);

  const handleToolbarAction = useCallback((action: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let newText = '';
    switch (action) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'strikethrough':
        newText = `~~${selectedText}~~`;
        break;
      case 'heading':
        newText = `# ${selectedText}`;
        break;
      case 'list':
        newText = `- ${selectedText}`;
        break;
      case 'code':
        newText = `\`${selectedText}\``;
        break;
      case 'link':
        newText = `[${selectedText}](url)`;
        break;
      default:
        return;
    }

    const newContent = 
      textarea.value.substring(0, start) +
      newText +
      textarea.value.substring(end);

    handleChange(newContent);
    
    // Reset selection
    textarea.focus();
    textarea.setSelectionRange(
      start + newText.length,
      start + newText.length
    );
  }, [handleChange]);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            handleToolbarAction('bold');
            break;
          case 'i':
            e.preventDefault();
            handleToolbarAction('italic');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [handleToolbarAction]);

  return (
    <div className="border rounded-lg shadow-sm bg-gray-800 text-white">
      <div className="flex items-center justify-between border-b">
        <Toolbar onAction={handleToolbarAction} />
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-900"
          aria-label={isPreview ? "Show Editor" : "Show Preview"}
        >
          {isPreview ? "Editor" : "Preview"}
        </button>
      </div>

      <div className="min-h-[300px] ">
        {isPreview ? (
          <Preview content={content} />
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full h-full min-h-[300px] p-4 focus:outline-none resize-y"
            placeholder={placeholder}
            aria-label="Markdown editor"
          />
        )}
      </div>
    </div>
  );
};

export const WYSIWYG_Editor = Editor;