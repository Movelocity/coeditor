import { type ToolbarButton } from './types';

const toolbarButtons: ToolbarButton[] = [
  { icon: '**', label: 'Bold', action: 'bold', shortcut: 'Ctrl+B' },
  { icon: '*', label: 'Italic', action: 'italic', shortcut: 'Ctrl+I' },
  { icon: '~~', label: 'Strikethrough', action: 'strikethrough' },
  { icon: '#', label: 'Heading', action: 'heading' },
  { icon: '-', label: 'List', action: 'list' },
  { icon: '`', label: 'Code', action: 'code' },
  { icon: '[]', label: 'Link', action: 'link' },
];

const Toolbar = ({
  onAction,
}: {
  onAction: (action: string) => void;
}) => {
  return (
    <div className="flex items-center gap-2 p-2 border-b ">
      {toolbarButtons.map((button) => (
        <button
          key={button.action}
          onClick={() => onAction(button.action)}
          className="p-2 hover:bg-gray-900 rounded-md transition-colors"
          aria-label={button.label}
          title={button.shortcut ? `${button.label} (${button.shortcut})` : button.label}
          tabIndex={0}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
};

export default Toolbar; 