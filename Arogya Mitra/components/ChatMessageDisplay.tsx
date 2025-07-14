
import React from 'react';
import { GroundingSource } from '../types';

interface ChatMessageDisplayProps {
  text: string;
  sources?: GroundingSource[];
}

// Helper function to apply inline Markdown to a string and return HTML
const renderInlineMarkdownHTML = (text: string): string => {
  let html = text;
  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic: *text*
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Note: For more complex Markdown, a dedicated library might be better,
  // but for simple bold/italic, this is often sufficient.
  return html;
};

const ChatMessageDisplay: React.FC<ChatMessageDisplayProps> = ({ text, sources }) => {
  const processLine = (line: string, index: number): React.ReactNode => {
    // Headings
    if (line.startsWith('### ')) {
      const content = line.substring(4);
      return <h3 key={index} className="text-lg font-semibold mt-2 mb-1 text-neutral-dark" dangerouslySetInnerHTML={{ __html: renderInlineMarkdownHTML(content) }}></h3>;
    }
    if (line.startsWith('## ')) {
      const content = line.substring(3);
      return <h2 key={index} className="text-xl font-semibold mt-3 mb-1 text-neutral-dark" dangerouslySetInnerHTML={{ __html: renderInlineMarkdownHTML(content) }}></h2>;
    }
    if (line.startsWith('# ')) {
      const content = line.substring(2);
      return <h1 key={index} className="text-2xl font-semibold mt-4 mb-2 text-neutral-dark" dangerouslySetInnerHTML={{ __html: renderInlineMarkdownHTML(content) }}></h1>;
    }

    // Unordered List items
    if (line.startsWith('* ') || line.startsWith('- ')) {
      const content = line.substring(2);
      return (
        <p key={index} className="ml-4 my-1 text-neutral-dark">
          <span className="mr-2">&bull;</span>
          <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdownHTML(content) }} />
        </p>
      );
    }

    // Ordered list items
    const orderedListMatch = line.match(/^(\s*)(\d+\.)\s(.*)/);
    if (orderedListMatch) {
      const [, , marker, content] = orderedListMatch;
      return (
        <p key={index} className="ml-4 my-1 text-neutral-dark">
          <span className="mr-2">{marker}</span>
          <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdownHTML(content) }} />
        </p>
      );
    }

    // Default: treat as a paragraph
    const paragraphContentHTML = renderInlineMarkdownHTML(line);
    if (paragraphContentHTML.trim() === '') {
      return <br key={index} />;
    }
    return <p key={index} className="my-1.5 text-neutral-dark leading-relaxed" dangerouslySetInnerHTML={{ __html: paragraphContentHTML }}></p>;
  };

  const sections = text.split(/\n{2,}/); // Split by two or more newlines for paragraphs/sections

  return (
    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-2">
          {section.split('\n').map((line, lineIndex) => processLine(line, lineIndex))}
        </div>
      ))}
      {sources && sources.length > 0 && (
        <div className="mt-4 pt-3 border-t border-neutral-light">
          <h4 className="text-sm font-semibold text-neutral-dark mb-1">Sources:</h4>
          <ul className="list-disc list-inside text-sm">
            {sources.map((source, idx) => (
              source.web && (
                <li key={idx}>
                  <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-primary-DEFAULT hover:text-primary-dark underline">
                    {source.web.title || source.web.uri}
                  </a>
                </li>
              )
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatMessageDisplay;
