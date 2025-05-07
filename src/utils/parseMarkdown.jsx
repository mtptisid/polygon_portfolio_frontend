import React from 'react';
import { FiCopy } from 'react-icons/fi';

const emojiMap = {
  'Building': '🚀',
  'Understand': '🎯',
  'Focus': '✨',
  'Visual': '🎨',
  'Color': '🎨',
  'Typography': '🔤',
  'Imagery': '🖼️',
  'Spacing': '📐',
  'Consistency': '🎯',
  'Animations': '🎬',
  'Inspiration': '🛠️',
  'Platform': '📱',
  'short': '🎯',
  'What': '🤔',
  'Good': '🎉'
};

// Enhanced HTML escaping to prevent XSS
const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Syntax highlighting for code blocks
const syntaxHighlight = (code, language) => {
  if (!code.trim()) return '<span style="color: #888">Empty code block</span>';

  const rules = {
    python: {
      useLineProcessing: true,
      lineCommentChar: '#',
      keywords: /\b(def|class|if|else|elif|for|while|return|import|from|as|try|except|with|in|is|not|and|or|True|False|None)\b/g,
      comments: /#.*$/gm,
      variables: /def\s+(\w+)/g,
      strings: /"(\\"|[^"])*"|'(\\'|[^'])*'/g,
      keywordColor: '#5aabed',
      commentColor: '#008000',
      variableColor: '#f0bd24',
      stringColor: '#d6321c'
    },
    bash: {
      useLineProcessing: true,
      lineCommentChar: '#',
      keywords: /\b(if|then|else|fi|for|while|do|done|case|esac|function|export|source|echo|read|set|unset|alias|declare|typeset|local|shift|test|eval|exec)\b/g,
      comments: /#.*$/gm,
      shebangs: /#!\/bin\/(bash|sh)/g,
      variables: /(\$[\w@]+|\${[\w@]+})/g,
      strings: /"(\\"|[^"])*"|'(\\'|[^'])*'/g,
      keywordColor: '#6a0dad',
      commentColor: '#008000',
      shebangColor: '#008000',
      variableColor: '#87ceeb',
      stringColor: '#ff0000'
    },
    javascript: {
      keywords: /\b(function|const|let|var|if|else|for|while|return|import|export|from|as|try|catch|new|this|true|false|null|undefined)\b/g,
      comments: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
      variables: /(const|let|var)\s+(\w+)/g,
      strings: /"(\\"|[^"])*"|'(\\'|[^'])*'/g,
      keywordColor: '#6a0dad',
      commentColor: '#008000',
      variableColor: '#87ceeb',
      stringColor: '#ff0000'
    },
    java: {
      keywords: /\b(public|private|protected|class|interface|void|int|double|float|boolean|if|else|for|while|return|new|try|catch|throw|throws|static|final|abstract|synchronized)\b/g,
      comments: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
      variables: /(int|double|float|boolean)\s+(\w+)/g,
      strings: /"(\\"|[^"])*"|'(\\'|[^'])*'/g,
      keywordColor: '#6a0dad',
      commentColor: '#008000',
      variableColor: '#87ceeb',
      stringColor: '#ff0000'
    },
    html: {
      keywords: /\b(div|span|p|h1|h2|h3|h4|h5|h6|a|img|ul|ol|li|table|tr|td|th|form|input|section|article|header|footer|nav|main|aside)\b/g,
      comments: /<!--[\s\S]*?-->/gm,
      strings: /"(\\"|[^"])*"|'(\\'|[^'])*'/g,
      keywordColor: '#6a0dad',
      commentColor: '#008000',
      stringColor: '#ff0000'
    },
    cpp: {
      keywords: /\b(int|double|float|char|void|class|struct|namespace|public|private|protected|if|else|for|while|return|new|delete|try|catch|throw|using|const|static|virtual)\b/g,
      comments: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
      variables: /(int|double|float|char)\s+(\w+)/g,
      strings: /"(\\"|[^"])*"|'(\\'|[^'])*'/g,
      keywordColor: '#6a0dad',
      commentColor: '#008000',
      variableColor: '#87ceeb',
      stringColor: '#ff0000'
    },
    ruby: {
      useLineProcessing: true,
      lineCommentChar: '#',
      keywords: /\b(def|class|module|if|else|elsif|for|while|return|require|include|extend|begin|rescue|ensure|end|true|false|nil)\b/g,
      comments: /#.*$/gm,
      variables: /def\s+(\w+)/g,
      strings: /"(\\"|[^"])*"|'(\\'|[^'])*'/g,
      keywordColor: '#6a0dad',
      commentColor: '#008000',
      variableColor: '#87ceeb',
      stringColor: '#ff0000'
    },
    go: {
      keywords: /\b(func|package|import|type|struct|interface|if|else|for|range|return|go|defer|chan|map|const|var|true|false|nil)\b/g,
      comments: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
      variables: /(var|const)\s+(\w+)/g,
      strings: /"(\\"|[^"])*"|'(\\'|[^'])*'/g,
      keywordColor: '#6a0dad',
      commentColor: '#008000',
      variableColor: '#87ceeb',
      stringColor: '#ff0000'
    },
    php: {
      keywords: /\b(function|class|if|else|for|while|return|echo|print|new|try|catch|public|private|protected|static|const|global|namespace)\b/g,
      comments: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(#.*$)/gm,
      variables: /\$(\w+)/g,
      strings: /"(\\"|[^"])*"|'(\\'|[^'])*'/g,
      keywordColor: '#6a0dad',
      commentColor: '#008000',
      variableColor: '#87ceeb',
      stringColor: '#ff0000'
    },
    css: {
      properties: /\b(color|background|margin|padding|border|font|display|flex|grid|position|width|height|top|right|bottom|left)\b/g,
      comments: /\/\*[\s\S]*?\*\//gm,
      strings: /"(\\"|[^"])*"|'(\\'|[^'])*'/g,
      propertyColor: '#6a0dad',
      commentColor: '#008000',
      stringColor: '#ff0000'
    },
    sql: {
      keywords: /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|LEFT|RIGHT|INNER|OUTER|GROUP|BY|ORDER|HAVING|CREATE|TABLE|INDEX|VIEW|PROCEDURE|FUNCTION|TRIGGER|PRIMARY|FOREIGN|KEY)\b/g,
      comments: /(--.*$)|(\/\*[\s\S]*?\*\/)/gm,
      strings: /"(\\"|[^"])*"|'(\\'|[^'])*'/g,
      keywordColor: '#6a0dad',
      commentColor: '#008000',
      stringColor: '#ff0000'
    },
    json: {
      strings: /"(\\"|[^"])*"/g,
      stringColor: '#ff0000'
    },
    yaml: {
      useLineProcessing: true,
      lineCommentChar: '#',
      comments: /#.*$/gm,
      strings: /"(\\"|[^"])*"|'(\\'|[^'])*'/g,
      commentColor: '#008000',
      stringColor: '#ff0000'
    },
    markdown: {
      headers: /^(#{1,6})\s+(.*)$/gm,
      inlineCode: /`([^`]+)`/g,
      links: /\[([^\]]+)\]\(([^)]+)\)/g,
      headerColor: '#6a0dad',
      codeColor: '#1e293b',
      linkColor: '#3b82f6'
    }
  };

  const rule = rules[language] || {
    strings: /"(\\"|[^"])*"|'(\\'|[^'])*'/g,
    stringColor: '#ff0000'
  };

  let highlightedCode = code;

  if (rule.useLineProcessing && rule.lineCommentChar) {
    const lines = code.split('\n');
    highlightedCode = lines.map(line => {
      const commentIndex = line.indexOf(rule.lineCommentChar);
      let stringPlaceholders = [];
      let placeholderIndex = 0;
      let tempCodePart = line;

      if (rule.strings) {
        tempCodePart = tempCodePart.replace(rule.strings, (match) => {
          const placeholder = `@@STRING${placeholderIndex}@@`;
          stringPlaceholders.push({ placeholder, content: match });
          placeholderIndex++;
          return placeholder;
        });
      }

      if (commentIndex !== -1) {
        const codePart = tempCodePart.slice(0, commentIndex);
        const commentPart = line.slice(commentIndex);
        let highlightedCodePart = escapeHtml(codePart);

        if (rule.shebangs && line.startsWith('#!')) {
          highlightedCodePart = highlightedCodePart.replace(rule.shebangs, (match) => `<span style="color: ${rule.shebangColor}">${escapeHtml(match)}</span>`);
        }
        if (rule.keywords) {
          highlightedCodePart = highlightedCodePart.replace(rule.keywords, (match) => `<span style="color: ${rule.keywordColor}">${escapeHtml(match)}</span>`);
        }
        if (rule.variables) {
          highlightedCodePart = highlightedCodePart.replace(rule.variables, (match, p1, p2) => {
            const varName = p2 || p1;
            return match.replace(varName, `<span style="color: ${rule.variableColor}">${escapeHtml(varName)}</span>`);
          });
        }

        stringPlaceholders.forEach(({ placeholder, content }) => {
          highlightedCodePart = highlightedCodePart.replace(placeholder, `<span style="color: ${rule.stringColor}">${escapeHtml(content)}</span>`);
        });

        return `${highlightedCodePart}<span style="color: ${rule.commentColor}">${escapeHtml(commentPart)}</span>`;
      } else {
        let highlightedLine = escapeHtml(tempCodePart);
        if (rule.shebangs && line.startsWith('#!')) {
          highlightedLine = highlightedLine.replace(rule.shebangs, (match) => `<span style="color: ${rule.shebangColor}">${escapeHtml(match)}</span>`);
        }
        if (rule.keywords) {
          highlightedLine = highlightedLine.replace(rule.keywords, (match) => `<span style="color: ${rule.keywordColor}">${escapeHtml(match)}</span>`);
        }
        if (rule.variables) {
          highlightedLine = highlightedLine.replace(rule.variables, (match, p1, p2) => {
            const varName = p2 || p1;
            return match.replace(varName, `<span style="color: ${rule.variableColor}">${escapeHtml(varName)}</span>`);
          });
        }

        stringPlaceholders.forEach(({ placeholder, content }) => {
          highlightedLine = highlightedLine.replace(placeholder, `<span style="color: ${rule.stringColor}">${escapeHtml(content)}</span>`);
        });

        return highlightedLine;
      }
    }).join('\n');
  } else {
    let stringPlaceholders = [];
    let placeholderIndex = 0;
    let tempCode = highlightedCode;

    if (rule.strings) {
      tempCode = tempCode.replace(rule.strings, (match) => {
        const placeholder = `@@STRING${placeholderIndex}@@`;
        stringPlaceholders.push({ placeholder, content: match });
        placeholderIndex++;
        return placeholder;
      });
    }

    highlightedCode = escapeHtml(tempCode);
    if (rule.comments) {
      highlightedCode = highlightedCode.replace(rule.comments, (match) => `<span style="color: ${rule.commentColor}">${escapeHtml(match)}</span>`);
    }
    if (rule.shebangs) {
      highlightedCode = highlightedCode.replace(rule.shebangs, (match) => `<span style="color: ${rule.shebangColor}">${escapeHtml(match)}</span>`);
    }
    if (rule.keywords) {
      highlightedCode = highlightedCode.replace(rule.keywords, (match) => `<span style="color: ${rule.keywordColor}">${escapeHtml(match)}</span>`);
    } else if (rule.properties) {
      highlightedCode = highlightedCode.replace(rule.properties, (match) => `<span style="color: ${rule.propertyColor}">${escapeHtml(match)}</span>`);
    }
    if (rule.variables) {
      highlightedCode = highlightedCode.replace(rule.variables, (match, p1, p2) => {
        const varName = p2 || p1;
        return match.replace(varName, `<span style="color: ${rule.variableColor}">${escapeHtml(varName)}</span>`);
      });
    }

    stringPlaceholders.forEach(({ placeholder, content }) => {
      highlightedCode = highlightedCode.replace(placeholder, `<span style="color: ${rule.stringColor}">${escapeHtml(content)}</span>`);
    });
  }

  return highlightedCode;
};

const parseMarkdown = (text, handleCopy, copiedStates, messageIndex) => {
  if (!text) return null;

  // Split text by code blocks and blockquotes
  const codeBlockRegex = /```(\w+)?\s*\n?([\s\S]*?)\n?\s*```/g;
  const blockquoteRegex = /^>\s*(.*)$/gm;
  const parts = [];
  let lastIndex = 0;

  // Handle code blocks
  let match;
  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({
      type: 'code',
      language: match[1] ? match[1].toLowerCase() : '',
      content: match[2].trim()
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  const components = [];
  let listCounter = 0;
  let codeBlockCounter = 0;

  parts.forEach((part, idx) => {
    if (part.type === 'code') {
      const codeBlockId = `code-block-${messageIndex}-${idx}-${codeBlockCounter++}`;
      const highlightedCode = syntaxHighlight(part.content, part.language);

      const codeStyle = {
        background: '#2d2d2d',
        color: '#ffffff',
        fontFamily: '"Fira Code", monospace',
        padding: '1rem',
        borderRadius: '8px',
        overflowX: 'auto',
        overflowY: 'auto',
        maxHeight: '400px',
        maxWidth: '100%',
        boxSizing: 'border-box',
        lineHeight: '1.6',
        border: '1px solid #444444',
        margin: '0.5rem 0',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      };

      const codeInnerStyle = {
        maxWidth: '100%',
        boxSizing: 'border-box',
        whiteSpace: 'pre-wrap',
        display: 'block'
      };

      const copyButtonStyle = {
        position: 'absolute',
        top: '8px',
        right: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.3rem',
        borderRadius: '6px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        width: '28px',
        height: '28px'
      };

      const tooltipStyle = {
        position: 'absolute',
        top: '-28px',
        right: '0',
        backgroundColor: '#333',
        color: '#fff',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 1,
        whiteSpace: 'nowrap'
      };

      components.push(
        <div key={codeBlockId} style={{ position: 'relative', maxWidth: '100%', boxSizing: 'border-box' }}>
          <pre style={codeStyle}>
            <code style={codeInnerStyle} dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          </pre>
          <button
            style={copyButtonStyle}
            onClick={() => handleCopy(part.content, codeBlockId)}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
            aria-label="Copy code"
          >
            <FiCopy size={16} color="#4b5563" />
          </button>
          {copiedStates[codeBlockId] && (
            <span style={tooltipStyle}>
              Copied!
            </span>
          )}
        </div>
      );
      return;
    }

    // Split text into paragraphs and blockquotes
    const paragraphs = part.content.split('\n\n').filter(p => p.trim());
    paragraphs.forEach((para, paraIdx) => {
      // Handle horizontal rules
      if (para.trim() === '---' || para.trim() === '⸻') {
        components.push(<hr key={`sep-${idx}-${paraIdx}`} style={{ margin: '1rem 0', border: '1px solid #e2e8f0' }} />);
        return;
      }

      // Handle headings (# to ######)
      const headingMatch = para.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2].trim();
        const Tag = `h${level}`;
        const emoji = Object.keys(emojiMap).find(key => text.includes(key)) ? emojiMap[Object.keys(emojiMap).find(key => text.includes(key))] : '';
        components.push(
          <Tag
            key={`h${level}-${idx}-${paraIdx}`}
            style={{
              fontSize: `${2 - level * 0.2}rem`,
              fontWeight: '600',
              color: '#1e293b',
              margin: '1rem 0',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          >
            {emoji} {text}
          </Tag>
        );
        return;
      }

      // Handle blockquotes
      if (para.match(/^>\s*/)) {
        const lines = para.split('\n').map(line => line.replace(/^>\s*/, '').trim()).filter(line => line);
        components.push(
          <blockquote
            key={`blockquote-${idx}-${paraIdx}`}
            style={{
              borderLeft: '4px solid #3b82f6',
              padding: '0.5rem 1rem',
              margin: '1rem 0',
              background: '#f8fafc',
              color: '#1e293b',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          >
            {lines.map((line, lineIdx) => {
              const parsedLine = parseInlineMarkdown(line);
              return (
                <p key={`blockquote-line-${idx}-${paraIdx}-${lineIdx}`} style={{ margin: '0.5rem 0' }}>
                  <span dangerouslySetInnerHTML={{ __html: parsedLine }} />
                </p>
              );
            })}
          </blockquote>
        );
        return;
      }

      // Handle numbered headings (e.g., **1. Heading:**)
      if (para.match(/^\*\*[0-9]+\.\s+.*:\*\*/)) {
        const headingText = para.replace(/^\*\*[0-9]+\.\s+/, '').replace(/:\*\*$/, '').trim();
        const emoji = Object.keys(emojiMap).find(key => headingText.includes(key)) ? emojiMap[Object.keys(emojiMap).find(key => headingText.includes(key))] : '';
        components.push(
          <h3
            key={`h3-${idx}-${paraIdx}`}
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1e293b',
              margin: '1rem 0',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          >
            {emoji} {headingText}
          </h3>
        );
        return;
      }

      // Handle lists
      if (para.match(/^\s*(\*|-)\s/)) {
        const items = para.split('\n').filter(line => line.trim());
        const listItems = [];
        let currentList = [];

        items.forEach((item, i) => {
          const indent = item.match(/^\s*/)[0].length / 2;
          const text = item.replace(/^\s*(\*|-)\s/, '').trim();
          const parsedText = parseInlineMarkdown(text);

          if (indent === 0) {
            if (currentList.length) {
              listItems.push(
                <ul key={`ul-${listCounter}-${idx}-${paraIdx}-${i}`} style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  {currentList}
                </ul>
              );
              currentList = [];
              listCounter++;
            }
            currentList.push(
              <li
                key={`li-${listCounter}-${idx}-${paraIdx}-${i}`}
                style={{ margin: '0.25rem 0', color: '#1e293b', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
              >
                <span dangerouslySetInnerHTML={{ __html: parsedText }} />
              </li>
            );
          } else {
            currentList.push(
              <li
                key={`li-${listCounter}-${idx}-${paraIdx}-${i}`}
                style={{
                  margin: '0.25rem 0',
                  color: '#1e293b',
                  paddingLeft: `${indent * 1}rem`,
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}
              >
                <span dangerouslySetInnerHTML={{ __html: parsedText }} />
              </li>
            );
          }
        });

        if (currentList.length) {
          listItems.push(
            <ul key={`ul-${listCounter}-${idx}-${paraIdx}-final`} style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              {currentList}
            </ul>
          );
          listCounter++;
        }
        components.push(...listItems);
        return;
      }

      // Handle paragraphs
      const parsedPara = parseInlineMarkdown(para);
      const emoji = Object.keys(emojiMap).find(key => para.includes(key)) ? emojiMap[Object.keys(emojiMap).find(key => para.includes(key))] : '';
      components.push(
        <p
          key={`p-${idx}-${paraIdx}`}
          style={{ margin: '0.5rem 0', color: '#1e293b', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
        >
          {emoji && <span>{emoji} </span>}
          <span dangerouslySetInnerHTML={{ __html: parsedPara }} />
        </p>
      );
    });
  });

  // Inline Markdown parsing function
  const parseInlineMarkdown = (text) => {
    let parsed = escapeHtml(text);
    parsed = parsed
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #3b82f6; text-decoration: none; border-bottom: 1px solid #3b82f6;">$1</a>')
      .replace(/`([^`]+)`/g, '<code style="background: #f1f5f9; padding: 2px 4px; border-radius: 4px; color: #1e293b; font-family: monospace">$1</code>');
    return parsed;
  };

  return components;
};

export default parseMarkdown;
