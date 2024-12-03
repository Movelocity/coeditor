import { marked } from 'marked';

const Preview = ({ content }: { content: string }) => {
  const htmlContent = marked(content);

  return (
    <div 
      className="h-full prose max-w-none p-4"
      style={{ color: '#E5E7EB', backgroundColor: '#1f2937' }}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default Preview; 