import { useState, useMemo, useEffect } from 'react';
import { FiEdit2, FiCheck, FiX, FiCopy } from 'react-icons/fi';
import parseMarkdown from '../utils/parseMarkdown';

const ChatContainer = ({ messages, setMessages, examplePrompts, selectedChatId, styles, onExamplePromptClick, onSendMessage }) => {
  const [editingMessageIndex, setEditingMessageIndex] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [copiedStates, setCopiedStates] = useState({});
  const [copiedUserStates, setCopiedUserStates] = useState({});

  const parseUserMessage = (text) => {
    return text.split('\n').map((line, index) => (
      <span key={`user-line-${index}`}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const handleCopy = (code, codeBlockId) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedStates(prev => ({ ...prev, [codeBlockId]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [codeBlockId]: false }));
      }, 2000);
    });
  };

  const handleCopyUserMessage = (content, messageId) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedUserStates(prev => ({ ...prev, [messageId]: true }));
      setTimeout(() => {
        setCopiedUserStates(prev => ({ ...prev, [messageId]: false }));
      }, 2000);
    });
  };

  const parsedMessages = useMemo(() => {
    const parsed = messages.map((msg, index) => {
      const content = msg.isUser
        ? parseUserMessage(msg.content)
        : parseMarkdown(msg.content, handleCopy, copiedStates, index);
      console.log(`Parsed message ${index}:`, { isUser: msg.isUser, content });
      return { content, isUser: msg.isUser };
    });
    console.log('Parsed messages:', parsed);
    return parsed;
  }, [messages, copiedStates]);

  useEffect(() => {
    messages.forEach((msg, index) => {
      if (msg.isUser && editingMessageIndex !== index) {
        console.log(`User message at index ${index} should render buttons. isUser: ${msg.isUser}, editingMessageIndex: ${editingMessageIndex}`);
      }
    });
  }, [messages, editingMessageIndex]);

  const handleEditStart = (index) => {
    setEditingMessageIndex(index);
    setEditContent(messages[index].content);
  };

  const handleEditSave = (index) => {
    const editedContent = editContent;
    setMessages(prev => {
      const updatedMessages = prev.map((msg, i) => 
        i === index ? { ...msg, content: editedContent } : msg
      );
      return updatedMessages.slice(0, index + 1); // Remove messages after the edited one
    });
    setEditingMessageIndex(null);
    setEditContent('');
    onSendMessage(editedContent); // Send the edited message as a new prompt
  };

  const handleEditCancel = () => {
    setEditingMessageIndex(null);
    setEditContent('');
  };

  const handleEditKeyDown = (e, index) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSave(index);
    }
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    width: '24px',
    height: '24px',
    padding: '4px',
    borderRadius: '50%',
    opacity: 1,
    visibility: 'visible',
    border: '1px solid #e5e7eb'
  };

  return (
    <div style={{ ...styles.chatContainer, padding: '2rem 1.5rem' }}>
      {selectedChatId === null && messages.length === 0 && examplePrompts.map((prompt, idx) => (
        <div
          key={`prompt-${idx}`}
          style={styles.examplePrompt}
          onClick={() => onExamplePromptClick(prompt)}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
        >
          {prompt}
        </div>
      ))}
      {messages.map((msg, index) => {
        const messageId = `user-message-${index}`;
        return (
          <div
            key={`message-${index}`}
            style={{
              maxWidth: '900px',
              width: '100%',
              display: 'flex',
              justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
              marginBottom: '1.5rem',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isUser ? 'flex-end' : 'flex-start' }}>
              <div
                style={{
                  ...msg.isUser ? styles.userMessage : styles.botMessage,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  padding: '1.25rem'
                }}
              >
                {msg.isUser && editingMessageIndex === index ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onKeyDown={(e) => handleEditKeyDown(e, index)}
                      style={{
                        ...styles.messageInput,
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        minHeight: '60px',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                      autoFocus
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        style={{
                          ...buttonStyle,
                          backgroundColor: '#3b82f6',
                          border: 'none',
                        }}
                        onClick={() => handleEditSave(index)}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                        aria-label="Save edit"
                      >
                        <FiCheck size={16} color="white" />
                      </button>
                      <button
                        style={buttonStyle}
                        onClick={handleEditCancel}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        aria-label="Cancel edit"
                      >
                        <FiX size={16} color="#6b7280" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ lineHeight: '1.6' }}>
                    {parsedMessages[index]?.content || 'Error rendering message'}
                  </div>
                )}
              </div>
              {msg.isUser && editingMessageIndex !== index && (
                <div
                  style={{
                    marginTop: '12px',
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'flex-end',
                    maxWidth: '80%',
                    width: '100%',
                    zIndex: 20,
                    position: 'relative',
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <button
                      style={buttonStyle}
                      onClick={() => handleCopyUserMessage(msg.content, messageId)}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f3f4f6';
                        e.target.style.color = '#1e293b';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#6b7280';
                      }}
                      aria-label="Copy message"
                    >
                      <FiCopy size={16} color="#6b7280" />
                    </button>
                    {copiedUserStates[messageId] && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-28px',
                          right: '0',
                          backgroundColor: '#333',
                          color: '#fff',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          zIndex: 1,
                        }}
                      >
                        Copied!
                      </span>
                    )}
                  </div>
                  <button
                    style={buttonStyle}
                    onClick={() => handleEditStart(index)}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f3f4f6';
                      e.target.style.color = '#1e293b';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#6b7280';
                    }}
                    aria-label="Edit message"
                  >
                    <FiEdit2 size={16} color="#6b7280" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatContainer;