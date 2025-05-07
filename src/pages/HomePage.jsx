import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiSearch, FiCpu, FiPaperclip, FiArrowUpRight, FiArrowDown, FiTrash2 } from 'react-icons/fi';
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
  const [tool, setTool] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [deleteChatId, setDeleteChatId] = useState(null);
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
    "Visit Siddharamayya's portfolio",
    "Download Resume",
    "Write an Ansible playbook to deploy a web server",
    "Create a Bash script to monitor system resources",
    "Design a machine learning model for image classification",
    "Explain how to set up a CI/CD pipeline with Jenkins"
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
    "Visit Siddharamayya's portfolio": { icon: <FaGlobe size={18} color="#d91a89" />, emoji: "🌐" },
    "Download Resume": { icon: <FaFileDownload size={18} color="#f59e0b" />, emoji: "📄" },
    "Write an Ansible playbook to deploy a web server": { icon: <FaTools size={18} color="#ef4444" />, emoji: "📜" },
    "Create a Bash script to monitor system resources": { icon: <FaCode size={18} color="#3b82f6" />, emoji: "🖥️" },
    "Design a machine learning model for image classification": { icon: <FaBrain size={18} color="#8b5cf6" />, emoji: "🧠" },
    "Explain how to set up a CI/CD pipeline with Jenkins": { icon: <FaTools size={18} color="#10b981" />, emoji: "🔄" }
  };

  // Detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    const fixedPrompts = ["Visit Siddharamayya's portfolio", "Download Resume"];
    const otherPrompts = examplePrompts.filter(prompt => !fixedPrompts.includes(prompt));
    const getRandomPrompts = () => {
      const shuffled = shuffleArray(otherPrompts);
      const selected = shuffled.slice(0, 4);
      return [...fixedPrompts, ...selected];
    };
    setDisplayedPrompts(getRandomPrompts());
    const interval = setInterval(() => {
      setDisplayedPrompts(getRandomPrompts());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Load chat history from local storage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('chatHistory');
    if (storedHistory) {
      setChatHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Save chat history to local storage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

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
    setDeleteChatId(null);
  };

  const handleLongPress = (sessionId) => {
    setDeleteChatId(sessionId);
  };

  const handleDeleteChat = (sessionId) => {
    const updatedHistory = chatHistory.filter(session => session.session_id !== sessionId);
    setChatHistory(updatedHistory);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
    if (selectedChatId === sessionId) {
      setSelectedChatId(null);
      setMessages([]);
      setCurrentSessionId(null);
    }
    setDeleteChatId(null);
  };

  const handleSendMessage = async (content, selectedTool = null) => {
    if (!content.trim()) return;

    const userMessage = { content, isUser: true, is_bot: false };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setTool(null);

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
      const botMessage = { content: data.content, isUser: false, is_bot: true };
      setMessages(prev => [...prev, botMessage]);

      const updatedHistory = chatHistory.map(session => {
        if (session.session_id === sessionId) {
          return {
            ...session,
            messages: [...session.messages, userMessage, botMessage]
          };
        }
        return session;
      });

      if (!updatedHistory.some(session => session.session_id === sessionId)) {
        updatedHistory.push({
          session_id: sessionId,
          messages: [userMessage, botMessage]
        });
      }

      setChatHistory(updatedHistory);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { content: `Error: ${error.message}`, isUser: false }]);
    }
  };

  const handleExamplePrompt = async (prompt) => {
    if (prompt === "Visit Siddharamayya's portfolio") {
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

  const renderHeader = () => {
    const prefix = 'Welcome to my digital workspace.';
    const name = 'Siddharamayya M';
    const description = 'Crafting solutions with AI, data, and code';
    const subdesc = "Select any AI Model and ask for anything.";
    
    return (
      <div style={{ textAlign: 'center', margin: '1.5rem auto', width: '100%', maxWidth: '1200px' }} className="header">
        <div style={{ fontSize: '1.75rem', color: '#6b7280', marginBottom: '0.75rem' }}>
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
        <div style={{ fontSize: '2.7rem', fontWeight: '700' }}>
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
                color: '#000000',
                display: char === ' ' ? 'inline' : 'inline-block'
              }}
            >
              {char}
            </span>
          ))}
        </div>
        <div style={{ fontSize: '1.5rem', color: 'rgb(180 185 194)', marginBottom: '0.75rem', marginTop: '1.5rem' }}>
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

  const renderExamplePrompts = () => (
    <div style={styles.promptsMarquee}>
      <div style={styles.marqueeContent}>
        {[...displayedPrompts, ...displayedPrompts].map((prompt, idx) => (
          <div
            key={`${prompt}-${idx}`}
            style={styles.examplePrompt}
            className="example-prompt"
            onClick={() => handleExamplePrompt(prompt)}
            onMouseDown={(e) => e.preventDefault()}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
            }}
          >
            {promptIcons[prompt]?.icon || null}
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {prompt}
            </span>
            <span>{promptIcons[prompt]?.emoji}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#ffffff',
      boxSizing: 'border-box',
      overflow: 'hidden',
      margin: 0,
      padding: 0
    },
    sidebar: {
      position: 'fixed',
      top: '60px',
      left: sidebarVisible ? '0' : '-300px',
      width: '250px',
      height: 'calc(100vh - 140px)',
      backgroundColor: '#ffffff',
      color: '#1e293b',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
      boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
      transition: 'left 0.3s ease',
      zIndex: 1001,
      borderRight: '1px solid #e5e7eb',
      boxSizing: 'border-box'
    },
    chatHistoryContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '0.5rem',
      marginTop: '0.5rem'
    },
    chatHistoryItem: {
      padding: '0.75rem',
      borderRadius: '8px',
      cursor: 'pointer',
      marginBottom: '0.5rem',
      backgroundColor: '#f3f4f6',
      transition: 'background-color 0.2s ease',
      fontSize: '0.875rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    deleteButton: {
      padding: '0.5rem',
      borderRadius: '50%',
      backgroundColor: '#ef4444',
      color: '#ffffff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s ease'
    },
    newChatButton: {
      backgroundColor: '#404347',
      color: 'white',
      padding: '0.75rem 1rem',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '500',
      transition: 'background-color 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    navbar: {
      position: 'fixed',
      width: '100vw',
      minHeight: '60px',
      backgroundColor: '#404347',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      top: 0,
      zIndex: 101,
      borderBottom: '1px solid #e5e7eb',
      flexWrap: 'wrap',
      gap: '0.5rem',
      boxSizing: 'border-box'
    },
    appName: {
      margin: 0,
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '1.5rem',
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      textShadow: '0 0 3px rgba(255, 255, 255, 0.6)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '50%'
    },
    profileLink: {
      color: '#ffffff',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '40%'
    },
    promptsContainer: {
      paddingTop: '80px',
      paddingLeft: '1rem',
      paddingRight: '1rem',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100vw',
      backgroundColor: '#f8fafc',
      minHeight: 'calc(100vh - 60px)',
      overflowY: 'auto',
      boxSizing: 'border-box'
    },
    chatContainer: {
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
      position: 'relative'
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
      backgroundColor: '#f8fafc',
      boxSizing: 'border-box'
    },
    queryBar: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      padding: '0.65rem',
      width: '100%',
      maxWidth: '900px',
      minHeight: '80px',
      gap: '0.4rem',
      boxSizing: 'border-box'
    },
    inputRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      width: '100%',
      flexWrap: 'wrap'
    },
    controlsRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      gap: '0.5rem',
      flexWrap: 'nowrap'
    },
    messageInput: {
      flex: 1,
      padding: '0.75rem 1rem',
      border: 'none',
      fontSize: '1rem',
      backgroundColor: 'transparent',
      color: '#1e293b',
      outline: 'none',
      resize: 'none',
      minHeight: '40px',
      maxHeight: '120px',
      lineHeight: '1.5',
      overflowY: 'auto',
      boxSizing: 'border-box'
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.25rem',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      border: '1px solid #e5e7eb',
      backgroundColor: '#ffffff',
      color: '#4b5563',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
      fontSize: '0.875rem',
      fontWeight: '500',
      minWidth: '40px',
      height: '40px',
      boxSizing: 'border-box'
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
      boxSizing: 'border-box'
    },
    modelSelector: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
      boxSizing: 'border-box',
      whiteSpace: 'nowrap'
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
      boxSizing: 'border-box'
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
      width: '48px',
      height: '48px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 1000,
      boxSizing: 'border-box'
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
      border: '1px solid #e5e7eb',
      boxSizing: 'border-box'
    },
    dropdownItem: {
      padding: '0.5rem 1rem',
      cursor: "pointer",
      color: '#1e293b',
      borderRadius: '4px',
      transition: 'background-color 0.2s ease',
      fontSize: '0.875rem',
      boxSizing: 'border-box'
    },
    userMessage: {
      backgroundColor: '#e9e9e980',
      padding: '1rem',
      borderRadius: '1.5rem',
      marginBottom: '0.5rem',
      fontWeight: '450',
      fontSize: '0.9rem',
      maxWidth: '100%',
      width: 'auto',
      alignSelf: 'flex-end',
      border: '2px solid #e9e9e980',
      color: '#1e293b',
      wordBreak: 'break-word',
      overflow: 'hidden',
      boxSizing: 'border-box'
    },
    botMessage: {
      backgroundColor: '#ffffff',
      padding: '1rem',
      borderRadius: '1.5rem',
      marginBottom: '0.5rem',
      maxWidth: '100%',
      fontWeight: '450',
      fontSize: '0.9rem',
      alignSelf: 'flex-start',
      border: '1px solid #e2e8f0',
      color: '#1e293b',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
      overflow: 'hidden',
      boxSizing: 'border-box',
      whiteSpace: 'pre-wrap'
    },
    examplePrompt: {
      padding: '0.7rem',
      backgroundColor: '#ffffff',
      color: '#1e293b',
      borderRadius: '16px',
      cursor: 'pointer',
      flex: '0 0 290px',
      width: '200px',
      height: '90px',
      fontSize: '0.675rem',
      fontWeight: '550',
      transition: 'all 0.6s ease',
      border: '1px solid #e5e7eb',
      boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      overflow: 'hidden',
      boxSizing: 'border-box',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    },
    promptsMarquee: {
      width: '100%',
      maxWidth: '1300px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      marginBottom: '2rem'
    },
    marqueeContent: {
      display: 'inline-flex',
      animation: 'marquee 20s linear infinite',
      gap: '0.7rem'
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          * {
            box-sizing: border-box;
          }
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
            0%, 100% { text-shadow: 0 0 1px currentColor, 0 0 4px currentColor; }
            50% { text-shadow: 0 0 4px currentColor, 0 0 8px currentColor; }
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marqueeContent:hover {
            animation-play-state: paused;
          }
          @media (min-width: 1024px) {
            .container {
              width: 100vw;
            }
            .chatContainer, .promptsContainer {
              width: 100vw;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .chatContainer > div, .promptsContainer > div {
              max-width: 1200px;
              width: 100%;
              margin: 0 auto;
            }
            .header {
              max-width: 1200px;
              width: 100%;
              margin: 1.5rem auto;
            }
            .example-prompt {
              font-size: 0.875rem !important;
              padding: 0.7rem !important;
            }
          }
          @media (min-width: 768px) and (max-width: 1023px) {
            .container {
              width: 100vw;
            }
            .chatContainer, .promptsContainer {
              width: 100vw;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .chatContainer > div, .promptsContainer > div {
              max-width: 90%;
              width: 100%;
              margin: 0 auto;
            }
            .header {
              max-width: 90%;
              width: 100%;
              margin: 1.5rem auto;
            }
            .examplePrompt {
              flex: 0 0 200px;
              width: 200px;
              height: 50px;
            }
          }
          @media (max-width: 767px) {
            .navbar {
              min-height: 60px;
              padding: 0.5rem;
              flex-direction: row;
              flex-wrap: wrap;
              gap: 0.5rem;
              justify-content: space-between;
            }
            .hide-on-mobile {
              display: none;
            }
            .appName {
              font-size: 1.25rem;
              max-width: 50%;
            }
            .profileLink {
              font-size: 0.875rem;
              max-width: 45%;
            }
            .newChatButton {
              font-size: 0.875rem;
              padding: 0.5rem 0.75rem;
            }
            .sidebar {
              width: 200px;
              left: ${sidebarVisible ? '0' : '-200px'};
              padding: 0.75rem;
            }
            .promptsContainer {
              padding: 60px 0.5rem 0;
              width: 100vw;
            }
            .chatContainer {
              padding: 20px 0.5rem 60px;
              width: 100vw;
            }
            .queryBar {
              max-width: 95%;
              min-height: 50px;
              padding: 0.3rem;
            }
            .messageInput {
              font-size: 0.875rem;
              min-height: 28px;
              max-height: 80px;
              padding: 0.3rem;
            }
            .examplePrompt {
              flex: 0 0 180px;
              width: 180px;
              height: 40px;
              padding: 0.5rem;
              font-size: 0.75rem;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
              border-radius: 12px;
              gap: 0.3rem;
            }
            .promptsMarquee {
              margin-bottom: 0.5rem;
            }
            .inputContainer {
              padding: 0.5rem;
            }
            .actionButton {
              width: auto;
              min-width: 60px;
              height: 28px;
              padding: 0.2rem 0.5rem;
              font-size: 0.7rem;
            }
            .iconButton, .sendButton, .scrollButton {
              width: 28px;
              height: 28px;
              min-width: 28px;
              padding: 0.15rem;
              font-size: 0.7rem;
            }
            .modelSelector {
              padding: 0.2rem;
              width: 28px;
              height: 28px;
              justify-content: center;
            }
            .modelDropdownContent {
              min-width: 120px;
            }
            .dropdownItem {
              font-size: 0.75rem;
              padding: 0.3rem 0.6rem;
            }
            .userMessage, .botMessage {
              max-width: 85%;
              font-size: 0.875rem;
              padding: 0.75rem;
            }
            .inputRow {
              gap: 0.2rem;
            }
            .controlsRow {
              gap: 0.2rem;
              flex-wrap: nowrap;
            }
            .deleteButton {
              padding: 0.3rem;
              width: 28px;
              height: 28px;
            }
          }
          @media (max-width: 480px) {
            .navbar {
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              padding: 0.5rem;
              gap: 0.25rem;
            }
            .hide-on-mobile {
              display: none;
            }
            .newChatButton {
              font-size: 0;
              padding: 0.5rem;
              width: 40px;
              height: 40px;
              justify-content: center;
            }
            .profileLink {
              font-size: 0;
              padding: 0.5rem;
              max-width: 40px;
              justify-content: center;
            }
            .appName {
              font-size: 1rem;
              max-width: 100%;
            }
            .sidebar {
              width: 160px;
              left: ${sidebarVisible ? '0' : '-160px'};
              padding: 0.5rem;
            }
            .promptsContainer {
              padding: 50px 0.25rem 0;
              width: 100vw;
            }
            .chatContainer {
              padding: 15px 0.25rem 50px;
              width: 100vw;
            }
            .queryBar {
              max-width: 98%;
              min-height: 48px;
              padding: 0.25rem;
            }
            .messageInput {
              font-size: 0.75rem;
              min-height: 24px;
              max-height: 60px;
              padding: 0.25rem;
            }
            .examplePrompt {
              flex: 0 0 160px;
              width: 160px;
              height: 36px;
              padding: 0.4rem;
              font-size: 0.7rem;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
              border-radius: 10px;
              gap: 0.2rem;
            }
            .promptsMarquee {
              margin-bottom: 0.4rem;
            }
            .inputContainer {
              padding: 0.25rem;
            }
            .actionButton {
              width: auto;
              min-width: 50px;
              height: 24px;
              padding: 0.15rem 0.4rem;
              font-size: 0.65rem;
            }
            .iconButton, .sendButton, .scrollButton {
              width: 24px;
              height: 24px;
              min-width: 24px;
              padding: 0.1rem;
              font-size: 0.65rem;
            }
            .modelSelector {
              padding: 0.15rem;
              width: 24px;
              height: 24px;
              justify-content: center;
            }
            .modelDropdownContent {
              min-width: 100px;
            }
            .dropdownItem {
              font-size: 0.7rem;
              padding: 0.2rem 0.5rem;
            }
            .userMessage, .botMessage {
              max-width: 90%;
              fontSize: '0.75rem',
              padding: '0.5rem'
            }
            .inputRow {
              gap: 0.15rem;
            }
            .controlsRow {
              gap: 0.15rem;
              flex-wrap: nowrap;
            }
            .deleteButton {
              padding: 0.2rem;
              width: 24px;
              height: 24px;
            }
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
          onMouseEnter={(e) => e.target.style.backgroundColor = '#555555'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#404347'}
        >
          <FiMessageSquare size={16} />
          New Chat
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
              onTouchStart={() => handleLongPress(session.session_id)}
              onMouseDown={() => handleLongPress(session.session_id)}
              title={session.messages[0]?.content || 'Empty session'}
            >
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {session.messages[0]?.content.slice(0, 30) || 'Session ' + session.session_id}
              </span>
              {deleteChatId === session.session_id && (
                <button
                  style={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(session.session_id);
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                >
                  <FiTrash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, width: '100vw', overflowY: 'auto' }}>
        <nav style={styles.navbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '60%' }}>
            <button
              style={styles.newChatButton}
              onClick={() => setSidebarVisible(!sidebarVisible)}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#555555'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#404347'}
            >
              <FiMessageSquare size={16} />
            </button>
            <div
              onMouseEnter={(e) => e.target.style.color = '#08d7fc'}
              onMouseLeave={(e) => e.target.style.color = '#ffffff'}
            >
              <h1
                style={styles.appName}
                className="hide-on-mobile"
                onClick={() => window.location.reload()}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && window.location.reload()}
              >
                PolyGenAI - MultiModal AI
              </h1>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, justifyContent: 'flex-end', maxWidth: '40%' }}>
            <a
              href="https://mtptisid.github.io"
              style={styles.profileLink}
              onMouseEnter={(e) => e.target.style.color = '#08d7fc'}
              onMouseLeave={(e) => e.target.style.color = '#ffffff'}
            >
              <FaUser size={16} />
              <span className="hide-on-mobile">Siddharamayya M</span>
            </a>
          </div>
        </nav>
        {messages.length === 0 && (
          <div style={styles.promptsContainer}>
            <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
              {isMobile ? (
                <>
                  {renderHeader()}
                  {renderExamplePrompts()}
                </>
              ) : (
                <>
                  {renderExamplePrompts()}
                  {renderHeader()}
                </>
              )}
            </div>
          </div>
        )}
        {messages.length > 0 && (
          <div ref={chatContainerRef} style={styles.chatContainer}>
            <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
              <ChatContainer
                messages={messages}
                setMessages={setMessages}
                examplePrompts={messages.length === 0 ? [] : displayedPrompts}
                selectedChatId={selectedChatId}
                styles={styles}
                onExamplePromptClick={handleExamplePrompt}
                onSendMessage={handleSendMessage}
              />
            </div>
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
            <FiArrowDown size={24} color="#4b5563" />
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
                <FiPaperclip size={24} color="#4b5563" />
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
                onMouseEnter={(e) => e.target.style.backgroundColor = '#555555'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#404347'}
                aria-label="Send message"
              >
                <FiArrowUpRight size={24} color="white" />
              </button>
            </div>
            <div style={styles.controlsRow}>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
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
                  <FiSearch style={{ marginRight: '0.15rem' }} size={16} color="#4b5563" />
                  DeepSearch
                </button>
                <button
                  style={styles.actionButton}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                  aria-label="Think"
                >
                  <FiCpu style={{ marginRight: '0.15rem' }} size={16} color="#4b5563" />
                  Think
                </button>
              </div>
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setHoveredModel(true)}
                onMouseLeave={() => setHoveredModel(false)}
              >
                <div style={styles.modelSelector}>
                  {isMobile ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  ) : (
                    <>
                      {selectedModel}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </>
                  )}
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
