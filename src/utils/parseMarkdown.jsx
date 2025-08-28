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

// Function to escape HTML special characters
const escapeHtml = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const parseMarkdown = (text, handleCopy, copiedStates, messageIndex) => {
  if (!text) return null;

  // Syntax highlighting function
  const syntaxHighlight = (code, language) => {
    if (!code.trim()) return '<span style="color: #888">Empty code block</span>';

    let highlightedCode = code;

    // Language-specific rules
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

    // Process languages with line comments line-by-line
    if (rule.useLineProcessing && rule.lineCommentChar) {
      const lines = code.split('\n');
      const highlightedLines = lines.map(line => {
        const commentChar = rule.lineCommentChar;
        const commentIndex = line.indexOf(commentChar);

        // Store strings to prevent keyword/variable highlighting inside them
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

          // Highlight code part
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

          // Restore strings with red coloring
          stringPlaceholders.forEach(({ placeholder, content }) => {
            highlightedCodePart = highlightedCodePart.replace(placeholder, `<span style="color: ${rule.stringColor}">${escapeHtml(content)}</span>`);
          });

          // Highlight comment part
          const highlightedCommentPart = `<span style="color: ${rule.commentColor}">${escapeHtml(commentPart)}</span>`;
          return highlightedCodePart + highlightedCommentPart;
        } else {
          // No comment, highlight entire line
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

          // Restore strings with red coloring
          stringPlaceholders.forEach(({ placeholder, content }) => {
            highlightedLine = highlightedLine.replace(placeholder, `<span style="color: ${rule.stringColor}">${escapeHtml(content)}</span>`);
          });

          return highlightedLine;
        }
      });
      highlightedCode = highlightedLines.join('\n');
    } else {
      // For languages without line processing, escape first then highlight
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
      if (rule.headers) {
        highlightedCode = highlightedCode.replace(rule.headers, (match, p1, p2) => `<span style="color: ${rule.headerColor}">${escapeHtml(p2)}</span>`);
      }
      if (rule.inlineCode) {
        highlightedCode = highlightedCode.replace(rule.inlineCode, (match, p1) => `<span style="color: ${rule.codeColor}">${escapeHtml(p1)}</span>`);
      }
      if (rule.links) {
        highlightedCode = highlightedCode.replace(rule.links, (match, p1, p2) => `<span style="color: ${rule.linkColor}">${escapeHtml(p1)}</span>`);
      }

      // Restore strings with red coloring
      stringPlaceholders.forEach(({ placeholder, content }) => {
        highlightedCode = highlightedCode.replace(placeholder, `<span style="color: ${rule.stringColor}">${escapeHtml(content)}</span>`);
      });
    }

    return highlightedCode;
  };

  // Split text by code blocks
  const codeBlockRegex = /```(\w+)?\s*\n?([\s\S]*?)\n?\s*```/g;
  const parts = [];
  let lastIndex = 0;

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
        fontFamily: 'monospace',
        padding: '1rem',
        borderRadius: '8px',
        overflowX: 'auto',
        overflowY: 'auto',
        maxHeight: '300px',
        maxWidth: '100%',
        boxSizing: 'border-box',
        lineHeight: '1.5',
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
        width: '24px',
        height: '24px'
      };

      const tooltipStyle = {
        position: 'absolute',
        top: '-24px',
        right: '0',
        backgroundColor: '#333',
        color: '#fff',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 1
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
            <FiCopy size={14} color="#4b5563" />
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

    // Split text into lines without filtering empty lines
    const lines = part.content.split('\n');
    let i = 0;

    while (i < lines.length) {
      const trimmedLine = lines[i].trim();

      if (!trimmedLine) {
        i++;
        continue;
      }

      // Handle horizontal rule
      if (trimmedLine === '---' || trimmedLine === '⸻') {
        components.push(<hr key={`sep-${idx}-${i}`} style={{ margin: '1rem 0', border: '1px solid #e2e8f0' }} />);
        i++;
        continue;
      }

      // Handle headings
      if (trimmedLine.match(/^\*\*[0-9]+\.\s+.*:\*\*/)) {
        const headingText = trimmedLine.replace(/^\*\*[0-9]+\.\s+/, '').replace(/:\*\*$/, '').trim();
        const emoji = Object.keys(emojiMap).find(key => headingText.includes(key)) ? emojiMap[Object.keys(emojiMap).find(key => headingText.includes(key))] : '';
        components.push(
          <h3 key={`h3-${idx}-${i}`} style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: '1rem 0', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
            {emoji} {headingText}
          </h3>
        );
        i++;
        continue;
      }

      // Handle lists (support both * and -)
      if (trimmedLine.match(/^[-*]\s/)) {  // After trim, no leading space for top level
        // First, find minIndent
        let minIndent = Infinity;
        let j = i;
        while (j < lines.length && lines[j].trim().match(/^[-*]\s/)) {
          const indentMatch = lines[j].match(/^\s*/);
          const thisIndent = indentMatch ? indentMatch[0].length : 0;
          if (thisIndent < minIndent) minIndent = thisIndent;
          j++;
        }

        // Now process the list
        const listRoot = [];
        const levels = [listRoot];
        let currentLevel = 0;

        while (i < lines.length && lines[i].trim().match(/^[-*]\s/)) {
          const currentLine = lines[i];
          const indentMatch = currentLine.match(/^\s*/);
          const indent = indentMatch ? indentMatch[0].length : 0;
          const effectiveIndent = Math.floor((indent - minIndent) / 2);  // Normalize indent levels
          const text = currentLine.replace(/^\s*[-*]\s/, '').trim();

          const parsedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #3b82f6; text-decoration: none; border-bottom: 1px solid #3b82f6;">$1</a>')
            .replace(/`([^`]+)`/g, '<code style="background: #f1f5f9; padding: 2px 4px; border-radius: 4px; color: #1e293b; font-family: monospace">$1</code>');

          // Adjust levels
          while (effectiveIndent < currentLevel) {
            levels.pop();
            currentLevel--;
          }

          if (effectiveIndent > currentLevel) {
            const lastItem = levels[levels.length - 1][levels[levels.length - 1].length - 1];
            if (!lastItem.subitems) {
              lastItem.subitems = [];
            }
            levels.push(lastItem.subitems);
            currentLevel = effectiveIndent;
          }

          // Add item
          const item = { text: parsedText, subitems: null };
          levels[levels.length - 1].push(item);

          i++;
        }

        // Build the React list recursively
        const buildList = (items, depth = 0) => (
          <ul key={`ul-${listCounter++}-${idx}-${depth}`} style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
            {items.map((item, index) => (
              <li key={`li-${listCounter++}-${idx}-${index}`} style={{ margin: '0.25rem 0', color: '#1e293b', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                <span dangerouslySetInnerHTML={{ __html: item.text }} />
                {item.subitems && buildList(item.subitems, depth + 1)}
              </li>
            ))}
          </ul>
        );

        if (listRoot.length > 0) {
          components.push(buildList(listRoot));
        }
        continue;
      }

      // Handle paragraphs: collect consecutive non-blank lines
      let paragraphLines = [lines[i]];
      i++;
      while (i < lines.length && lines[i].trim()) {
        paragraphLines.push(lines[i]);
        i++;
      }

      let paragraph = paragraphLines.join('\n').trim();

      let parsedLine = paragraph
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #3b82f6; text-decoration: none; border-bottom: 1px solid #3b82f6;">$1</a>')
        .replace(/`([^`]+)`/g, '<code style="background: #f1f5f9; padding: 2px 4px; border-radius: 4px; color: #1e293b; font-family: monospace">$1</code>');

      Object.keys(emojiMap).forEach(key => {
        if (parsedLine.includes(key)) {
          parsedLine = `${emojiMap[key]} ${parsedLine}`;
        }
      });

      components.push(
        <p key={`p-${idx}-${i}`} style={{ margin: '0.5rem 0', color: '#1e293b', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
          <span dangerouslySetInnerHTML={{ __html: parsedLine }} />
        </p>
      );
    }
  });

  return components;
};

export default parseMarkdown;
