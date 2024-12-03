export type ToolbarButton = {
  icon: string;
  label: string;
  action: string;
  shortcut?: string;
}

export type EditorProps = {
  initialValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
} 