import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiSearch, FiCpu, FiPaperclip, FiArrowUpRight, FiArrowDown } from 'react-icons/fi';
import { FaBrain, FaCode, FaUser, FaBriefcase, FaGraduationCap, FaLanguage, FaEnvelope, FaProjectDiagram, FaGithub, FaGlobe, FaTools, FaRobot, FaDollarSign, FaFileDownload } from 'react-icons/fa';
import ChatContainer from './ChatContainer';

const HomePage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('Gemini');
  const [hoveredModel, setHoveredModel] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [displayedPrompts, setDisplayedPrompts] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [promptCycleIndex, setPromptCycleIndex] = useState(0);
  const [tool, setTool] = useState(null);
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);
  const bottomRef = useRef(null);

  const models = ['DeepSeek R1', 'Gemini', 'Groq', 'OpenAI', 'Claude Sonet'];
  const examplePrompts = [
    "What is the total experience of Siddharamayya?",
    "When will Siddharamayya be available to join?",
    "What is Siddharamayya great at technically?",
    "How good is Siddharamayya in AI/ML?",
    "What are Siddharamayya's projects?",
    "What is Siddharamayya's GitHub page?",
    "What is Siddharamayya's portfolio page?",
    "What are Siddharamayya's key skills?",
    "What is Siddharamayya’s educational background?",
    "What is Siddharamayya’s current role at Capgemini?",
    "What languages does Siddharamayya speak?",
    "How can I contact Siddharamayya?",
    "What are Siddharamayya’s interests in AI?",
    "What generative AI projects has Siddharamayya worked on?",
    "What DevOps tools does Siddharamayya use?",
    "What is Siddharamayya’s experience with LLMs?",
    "What AI-powered finance projects has Siddharamayya built?",
    "What is Siddharamayya’s tech stack?",
    "How does Siddharamayya use Docker and Kubernetes?",
    "What are Siddharamayya’s contributions to web development?",
    "Visit Sid's portfolio",
    "Download Resume"
  ];

  const promptIcons = {
    "What is the total experience of Siddharamayya?": { icon: <FaBriefcase size={18} color="#3b82f6" />, emoji: "💼" },
    "When will Siddharamayya be available to join?": { icon: <FaBriefcase size={18} color="#ef4444" />, emoji: "📅" },
    "What is Siddharamayya great at technically?": { icon: <FaTools size={18} color="#10b981" />, emoji: "🛠️" },
    "How good is Siddharamayya in AI/ML?": { icon: <FaBrain size={18} color="#3b82f6" />, emoji: "🤖" },
    "What are Siddharamayya's projects?": { icon: <FaProjectDiagram size={18} color="#8b5cf6" />, emoji: "🚀" },
    "What is Siddharamayya's GitHub page?": { icon: <FaGithub size={18} color="#1e293b" />, emoji: "🐙" },
    "What is Siddharamayya's portfolio page?": { icon: <FaGlobe size={18} color="#10b981" />, emoji: "🌐" },
    "What are Siddharamayya's key skills?": { icon: <FaTools size={18} color="#10b981" />, emoji: "🔧" },
    "What is Siddharamayya’s educational background?": { icon: <FaGraduationCap size={18} color="#8b5cf6" />, emoji: "🎓" },
    "What is Siddharamayya’s current role at Capgemini?": { icon: <FaBriefcase size={18} color="#3b82f6" />, emoji: "🏢" },
    "What languages does Siddharamayya speak?": { icon: <FaLanguage size={18} color="#ef4444" />, emoji: "🗣️" },
    "How can I contact Siddharamayya?": { icon: <FaEnvelope size={18} color="#10b981" />, emoji: "📧" },
    "What are Siddharamayya’s interests in AI?": { icon: <FaBrain size={18} color="#3b82f6" />, emoji: "🧠" },
    "What generative AI projects has Siddharamayya worked on?": { icon: <FaRobot size={18} color="#8b5cf6" />, emoji: "🤖" },
    "What DevOps tools does Siddharamayya use?": { icon: <FaTools size={18} color="#1e293b" />, emoji: "⚙️" },
    "What is Siddharamayya’s experience with LLMs?": { icon: <FaBrain size={18} color="#3b82f6" />, emoji: "📚" },
    "What AI-powered finance projects has Siddharamayya built?": { icon: <FaDollarSign size={18} color="#10b981" />, emoji: "📈" },
    "What is Siddharamayya’s tech stack?": { icon: <FaCode size={18} color="#10b981" />, emoji: "💻" },
    "How does Siddharamayya use Docker and Kubernetes?": { icon: <FaTools size={18} color="#1e293b" />, emoji: "☁️" },
    "What are Siddharamayya’s contributions to web development?": { icon: <FaCode size={18} color="#10b981" />, emoji: "🌐" },
    "Visit Sid's portfolio": { icon: <FaGlobe size={18} color="#d91a89" />, emoji: "🌐" },
    "Download Resume": { icon: <FaFileDownload size={18} color="#f59e0b" />, emoji: "📄" }
  };

  // Shuffle array for random prompt positions
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Cycle through example prompts every 15 seconds
  useEffect(() => {
    const fixedPrompts = ["Visit Sid's portfolio", "Download Resume"];
    const otherPrompts = examplePrompts.filter(prompt => !fixedPrompts.includes(prompt));
    const getRandomPrompts = () => {
      const shuffled = shuffleArray(otherPrompts);
      const selected = shuffled.slice(0, 2);
      return shuffleArray([...fixedPrompts, ...selected]);
    };
    setDisplayedPrompts(getRandomPrompts());
    const interval = setInterval(() => {
      setPromptCycleIndex((prevIndex) => prevIndex + 1);
      setDisplayedPrompts(getRandomPrompts());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch session history on mount
    const fetchHistory = async () => {
      try {
        const response = await fetch('https://portpoliosid.onrender.com/api/ai_chat/history');
        if (!response.ok) throw new Error('Failed to fetch history');
        const history = await response.json();
        setChatHistory(history);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };
    fetchHistory();
  }, []);

  const generateSessionId = () => {
    return Math.floor(10000 + Math.random() * 90000);
  };

  const handleNewChat = () => {
    setSelectedChatId(null);
    setMessages([]);
    setCurrentSessionId(generateSessionId());
    setTool(null);
  };

  const handleSelectChat = (session) => {
    setSelectedChatId(session.session_id);
    setCurrentSessionId(session.session_id);
    setMessages(session.messages.map(msg => ({
      content: msg.content,
      isUser: !msg.is_bot
    })));
    setTool(null);
  };

  const handleSendMessage = async (content, selectedTool = null) => {
    if (!content.trim()) return;

    const userMessage = { content, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setTool(null); // Reset tool after sending

    const sessionId = currentSessionId || generateSessionId();
    if (!currentSessionId) {
      setCurrentSessionId(sessionId);
    }

    const payload = {
      content,
      model: selectedModel.toLowerCase(),
      session_id: sessionId,
      tool: selectedTool
    };

    console.log('Sending payload:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch('https://portpoliosid.onrender.com/api/ai_chat/request', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { content: data.content, isUser: false }]);

      // Update chat history
      const fetchHistory = async () => {
        try {
          const response = await fetch('https://portpoliosid.onrender.com/api/ai_chat/history');
          if (!response.ok) throw new Error('Failed to fetch history');
          const history = await response.json();
          setChatHistory(history);
        } catch (error) {
          console.error('Error fetching history:', error);
        }
      };
      fetchHistory();
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { content: `Error: ${error.message}`, isUser: false }]);
    }
  };

  const handleExamplePrompt = async (prompt) => {
    if (prompt === "Visit Sid's portfolio") {
      window.location.href = 'https://mtptisid.github.io';
    } else if (prompt === "Download Resume") {
      const link = document.createElement('a');
      link.href = '/portfolio/images/Mathapati_Siddharamayya_2025.pdf';
      link.download = 'Mathapati_Siddharamayya_2025.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      await handleSendMessage(prompt);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(message, tool);
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setShowScrollButton(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollButton(!entry.isIntersecting);
      },
      { root: chatContainerRef.current, threshold: 0.1 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [messages.length]);

  // Render header with animations
  const renderHeader = () => {
    const prefix = 'Welcome to my digital workspace.';
    const name = 'Siddharamayya M';
    const description = 'Crafting solutions with AI, data, and code';
    const subdesc = "Select any AI Model and ask for anything.";
    
    return (
      <div style={{ textAlign: 'center', margin: '1rem 0', maxWidth: '1200px', width: '100%' }}>
        <div style={{ fontSize: '30px', color: '#6b7280', marginBottom: '0.5rem' }}>
          {prefix.split('').map((char, index) => (
            <span
              key={index}
              style={{
                animation: `fadeInScale 0.5s ease-in-out ${index * 0.1}s forwards`,
                opacity: 0,
                display: char === ' ' ? 'inline' : 'inline-block'
              }}
            >
              {char}
            </span>
          ))}
        </div>
        <div style={{ fontSize: '44px', fontWeight: '600' }}>
          <a
            href="https://mtptisid.github.io"
            style={{
              textDecoration: 'none',
              display: 'inline-block',
              animation: `fadeInScale 0.5s ease-in-out ${(prefix.length) * 0.05}s forwards, colorBlink 8s ease-in-out infinite, glow 2s ease-in-out infinite`,
              opacity: 0,
              color: '#d91a89'
            }}
          >
            {name}
          </a>
          <span
            style={{
              animation: `fadeInScale 0.5s ease-in-out ${(prefix.length + name.length) * 0.05}s forwards`,
              opacity: 0,
              display: 'inline-block'
            }}
          >
            {' — '}
          </span>
          {description.split('').map((char, index) => (
            <span
              key={index}
              style={{
                animation: `fadeInScale 0.5s ease-in-out ${(prefix.length + name.length + 3 + index) * 0.05}s forwards`,
                opacity: 0,
                display: char === ' ' ? 'inline' : 'inline-block'
              }}
            >
              {char}
            </span>
          ))}
        </div>
        <div style={{ fontSize: '28px', color: '#b4b9c2', marginBottom: '0.5rem', marginTop: '1.5rem' }}>
          {subdesc.split('').map((char, index) => (
            <span
              key={index}
              style={{
                animation: `fadeInScale 0.5s ease-in-out ${index * 0.09}s forwards`,
                opacity: 0,
                display: char === ' ' ? 'inline' : 'inline-block'
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#ffffff',
    },
    sidebar: {
      position: 'fixed',
      top: '60px',
      left: sidebarVisible ? '0' : '-300px',
      width: '250px',
      height: 'calc(100vh - 60px)',
      backgroundColor: '#ffffff',
      color: '#1e293b',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
      boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
      transition: 'left 0.3s ease',
      zIndex: 100,
      borderRight: '1px solid #e5e7eb',
    },
    chatHistoryContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '0.5rem',
      marginTop: '0.5rem',
    },
    chatHistoryItem: {
      padding: '0.5rem',
      borderRadius: '8px',
      cursor: 'pointer',
      marginBottom: '0.5rem',
      backgroundColor: '#f3f4f6',
      transition: 'background-color 0.2s ease',
      fontSize: '14px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    newChatButton: {
      backgroundColor: '#404347',
      color: 'white',
      padding: '0.75rem 1rem',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      fontSize: '20px',
      fontWeight: '500',
      transition: 'background-color 0.2s ease'
    },
    navbar: {
      position: 'fixed',
      width: '99%',
      height: '60px',
      backgroundColor: '#404347',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      top: 0,
      zIndex: 101,
      borderBottom: '1px solid #e5e7eb'
    },
    appName: {
      margin: 0,
      color: '#ffffff',
      fontWeight: '500',
      fontSize: '30px',
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      textShadow: '0 0 3px rgba(255, 255, 255, 0.6)'
    },
    profileLink: {
      color: '#ffffff',
      fontSize: '20px',
      marginRight: '8px',
      fontWeight: '900',
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    promptsContainer: {
      paddingTop: '80px',
      paddingLeft: '1rem',
      paddingRight: '1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      backgroundColor: '#f8fafc',
      minHeight: 'calc(100vh - 60px)',
      overflowY: 'hidden',
      boxSizing: 'border-box',
    },
    chatContainer: {
      margin: '0 1rem',
      padding: '40px 1rem 75px',
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f8fafc',
      maxWidth: '100%',
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      paddingBottom: '80px',
      position: 'relative',
    },
    inputContainer: {
      display: 'flex',
      gap: '0.5rem',
      padding: '1rem',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      justifyContent: 'center',
    },
    queryBar: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      padding: '1rem',
      width: '100%',
      maxWidth: '900px',
      minHeight: '96px',
      gap: '0.5rem',
      position: 'relative',
    },
    inputRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      width: '100%'
    },
    controlsRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      position: 'relative',
    },
    messageInput: {
      flex: 1,
      padding: '0.75rem 1rem',
      border: 'none',
      fontSize: '16px',
      backgroundColor: 'transparent',
      color: '#1e293b',
      outline: 'none',
      resize: 'none',
      minHeight: '40px',
      maxHeight: '120px',
      lineHeight: '1.5',
      overflowY: 'auto'
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      border: '1px solid #e5e7eb',
      backgroundColor: '#ffffff',
      color: '#4b5563',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
      fontSize: '14px',
      fontWeight: '500',
      minWidth: '40px',
      height: '40px',
    },
    isDeepSearchActive: {
      backgroundColor: '#e2e8f0',
      borderColor: '#d1d5db',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    iconButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.5rem',
      borderRadius: '20px',
      border: '1px solid #e5e7eb',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      width: '40px',
      height: '40px',
    },
    modelSelector: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    sendButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.5rem',
      borderRadius: '20px',
      border: 'none',
      backgroundColor: '#404347',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      width: '40px',
      height: '40px',
    },
    scrollButton: {
      position: 'fixed',
      bottom: '120px',
      right: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.5rem',
      borderRadius: '50%',
      border: '1px solid #e5e7eb',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      width: '40px',
      height: '40px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 1000,
    },
    modelDropdownContent: {
      position: 'absolute',
      bottom: '100%',
      right: '0',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      padding: '0.5rem',
      minWidth: '160px',
      zIndex: 103,
      border: '1px solid #e5e7eb'
    },
    dropdownItem: {
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      color: '#1e293b',
      borderRadius: '4px',
      transition: 'background-color 0.2s ease',
      fontSize: '14px',
    },
    userMessage: {
      backgroundColor: '#e9e9e980',
      padding: '1rem',
      borderRadius: '1.5rem',
      marginBottom: '0',
      fontWeight: '450',
      fontSize: '16px',
      maxWidth: '900px',
      width: 'auto',
      alignSelf: 'flex-end',
      border: '2px solid #e9e9e980',
      color: '#1e293b',
      wordBreak: 'break-all',
      overflow: 'hidden',
      boxSizing: 'border-box',
    },
    botMessage: {
      backgroundColor: '#ffffff',
      padding: '1rem',
      borderRadius: '1.5rem',
      marginBottom: '1rem',
      width: '900px',
      overflowX: 'hidden',
      maxWidth: '900px',
      fontWeight: '450',
      fontSize: '16px',
      alignSelf: 'flex-start',
      border: '1px solid #e2e8f0',
      color: '#1e293b',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
      overflow: 'hidden',
      boxSizing: 'border-box',
      whiteSpace: 'pre-wrap',
    },
    examplePrompt: {
      padding: '2rem',
      backgroundColor: '#ffffff',
      color: '#1e293b',
      borderRadius: '20px',
      cursor: 'pointer',
      flex: '1',
      maxWidth: '400px',
      minWidth: '250px',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      border: '1px solid #e5e7eb',
      boxShadow: '0 9px 20px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      overflow: 'hidden',
      outline: 'none',
      position: 'relative',
    },
    promptRow: {
      display: 'flex',
      gap: '0.75rem',
      marginBottom: '0.75rem',
      justifyContent: 'center',
      flexWrap: 'nowrap',
      width: '100%',
      maxWidth: '900px',
      position: 'relative',
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes colorBlink {
            0% { color: #d91a89; }
            25% { color: #3b82f6; }
            50% { color: #10b981; }
            75% { color: #ef4444; }
            100% { color: #d91a89; }
          }
          @keyframes glow {
            0%, 100% { text-shadow: 0 0 3px currentColor, 0 0 8px currentColor; }
            50% { text-shadow: 0 0 8px currentColor, 0 0 10px currentColor; }
          }
        `}
      </style>
      <div
        style={styles.sidebar}
        onMouseLeave={() => setSidebarVisible(false)}
      >
        <button
          style={styles.newChatButton}
          onClick={handleNewChat}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#404347'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#404347'}
        >
          + New Chat
        </button>
        <div style={styles.chatHistoryContainer}>
          {chatHistory.map(session => (
            <div
              key={session.session_id}
              style={{
                ...styles.chatHistoryItem,
                backgroundColor: session.session_id === selectedChatId ? '#e2e8f0' : '#f3f4f6',
              }}
              onClick={() => handleSelectChat(session)}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e8f0'}
              onMouseLeave={(e) => e.target.style.backgroundColor = session.session_id === selectedChatId ? '#e2e8f0' : '#f3f4f6'}
              title={session.messages[0]?.content || 'Empty session'}
            >
              {session.messages[0]?.content.slice(0, 30) || 'Session ' + session.session_id}
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <nav style={styles.navbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              style={styles.newChatButton}
              onClick={() => setSidebarVisible(!sidebarVisible)}
            >
              <FiMessageSquare size={15} />
            </button>
            <div
              onMouseEnter={(e) => e.target.style.color = '#08d7fc'}
              onMouseLeave={(e) => e.target.style.color = '#ffffff'}
            >
              <h1
                style={styles.appName}
                onClick={() => window.location.reload()}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && window.location.reload()}
              >
                PolyGenAI - MultiModal AI
              </h1>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href="https://mtptisid.github.io"
              style={styles.profileLink}
              onMouseEnter={(e) => e.target.style.color = '#08d7fc'}
              onMouseLeave={(e) => e.target.style.color = '#ffffff'}
            >
              <FaUser size={16} />
              Siddharamayya M
            </a>
          </div>
        </nav>
        {messages.length === 0 && (
          <div style={styles.promptsContainer}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              {[...Array(Math.ceil(displayedPrompts.length / 2))].map((_, rowIndex) => (
                <div key={rowIndex} style={styles.promptRow}>
                  {displayedPrompts.slice(rowIndex * 2, rowIndex * 2 + 2).map((prompt, idx) => (
                    <div
                      key={`${promptCycleIndex}-${idx}`}
                      style={styles.examplePrompt}
                      onClick={() => handleExamplePrompt(prompt)}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f3f4f6';
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#ffffff';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 9px 20px rgba(0,0,0,0.15)';
                      }}
                    >
                      {promptIcons[prompt]?.icon || null}
                      <span style={{ flex: 1 }}>
                        {prompt.split('').map((char, charIndex) => (
                          <span
                            key={`${promptCycleIndex}-${idx}-${charIndex}`}
                            style={{
                              animation: `fadeInScale 0.5s ease-in-out ${charIndex * 0.05}s forwards`,
                              opacity: 0,
                              display: char === ' ' ? 'inline' : 'inline-block'
                            }}
                          >
                            {char}
                          </span>
                        ))}
                      </span>
                      <span>{promptIcons[prompt]?.emoji}</span>
                    </div>
                  ))}
                </div>
              ))}
              {renderHeader()}
            </div>
          </div>
        )}
        {messages.length > 0 && (
          <div ref={chatContainerRef} style={styles.chatContainer}>
            <ChatContainer
              messages={messages}
              setMessages={setMessages}
              examplePrompts={messages.length === 0 ? [] : displayedPrompts}
              selectedChatId={selectedChatId}
              styles={styles}
              onExamplePromptClick={handleExamplePrompt}
              onSendMessage={handleSendMessage}
            />
            <div ref={bottomRef} />
          </div>
        )}
        {showScrollButton && (
          <button
            style={styles.scrollButton}
            onClick={scrollToBottom}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
            aria-label="Scroll to bottom"
          >
            <FiArrowDown size={18} color="#4b5563" />
          </button>
        )}
        <div style={styles.inputContainer}>
          <div style={styles.queryBar}>
            <div style={styles.inputRow}>
              <button
                style={styles.iconButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                aria-label="Attach file"
              >
                <FiPaperclip size={18} color="#4b5563" />
              </button>
              <textarea
                ref={textareaRef}
                placeholder="What do you want to know?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                style={styles.messageInput}
              />
              <button
                style={styles.sendButton}
                onClick={() => {
                  handleSendMessage(message, tool);
                  setMessage('');
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#404347'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#404347'}
                aria-label="Send message"
              >
                <FiArrowUpRight size={18} color="white" />
              </button>
            </div>
            <div style={styles.controlsRow}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  style={{
                    ...styles.actionButton,
                    ...(tool === 'SearchWeb' ? styles.isDeepSearchActive : {})
                  }}
                  onClick={() => setTool(tool === 'SearchWeb' ? null : 'SearchWeb')}
                  onMouseEnter={(e) => {
                    if (tool !== 'SearchWeb') e.target.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    if (tool !== 'SearchWeb') e.target.style.backgroundColor = '#ffffff';
                  }}
                  aria-label="DeepSearch"
                >
                  <FiSearch style={{ marginRight: '0.5rem' }} size={18} color="#4b5563" />
                  DeepSearch
                </button>
                <button
                  style={styles.actionButton}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                  aria-label="Think"
                >
                  <FiCpu style={{ marginRight: '0.5rem' }} size={18} color="#4b5563" />
                  Think
                </button>
              </div>
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setHoveredModel(true)}
                onMouseLeave={() => setHoveredModel(false)}
              >
                <div style={styles.modelSelector}>
                  {selectedModel}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
                {hoveredModel && (
                  <div style={styles.modelDropdownContent}>
                    {models.map(model => (
                      <div
                        key={model}
                        style={styles.dropdownItem}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        onClick={() => {
                          setSelectedModel(model);
                          setHoveredModel(false);
                        }}
                      >
                        {model}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
