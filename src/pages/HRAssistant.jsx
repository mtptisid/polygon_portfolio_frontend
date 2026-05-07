import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { FiSend, FiX, FiArrowLeft, FiHome } from 'react-icons/fi';
import { FaUser, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HRAssistant = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // 'form', 'chat', 'analysis'
  const [sessionId, setSessionId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    additional_notes: ''
  });
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('https://portpoliosid.onrender.com/api/hr/start_session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to start session');

      const data = await response.json();
      setSessionId(data.session_id);
      setMessages([{ content: data.welcome_message, isUser: false }]);
      setSuccess('Session started successfully!');
      setTimeout(() => {
        setStep('chat');
      }, 500);
    } catch (error) {
      console.error('Error starting session:', error);
      setError('Failed to start session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { content: inputMessage, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://portpoliosid.onrender.com/api/hr/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          content: inputMessage,
          model: 'gemini'
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      setMessages(prev => [...prev, { content: data.content, isUser: false }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        content: 'Sorry, there was an error. Please try again.', 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://portpoliosid.onrender.com/api/hr/end_session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      });

      if (!response.ok) throw new Error('Failed to end session');

      const data = await response.json();
      setAnalysis(data);
      setStep('analysis');
    } catch (error) {
      console.error('Error ending session:', error);
      setError('Failed to end session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInterestBadgeColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'low': return '#6b7280';
      default: return '#9ca3af';
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#151515',
      fontFamily: '"Poppins", sans-serif',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      overflowX: 'hidden'
    }}>
      <style>
        {`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body, html, #root {
            width: 100vw;
            min-height: 100vh;
            background: #151515;
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slideUp {
            animation: slideUp 0.5s ease-out forwards;
          }
          .form-container {
            background: rgba(255, 255, 255, 0.05);
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 800px;
            margin: 2rem auto;
          }
          .form-field {
            margin-bottom: 1.5rem;
            width: 100%;
          }
          .form-field label {
            display: block;
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.9rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
          }
          input[type="text"],
          input[type="email"],
          textarea {
            width: 100%;
            padding: 1rem;
            font-size: 1rem;
            font-family: "Poppins", sans-serif;
            color: #ffffff;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 4px;
            transition: all 0.3s ease;
            outline: none;
          }
          textarea {
            min-height: 120px;
            resize: vertical;
          }
          input:focus,
          textarea:focus {
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 8px rgba(7, 177, 208, 0.3);
          }
          input::placeholder,
          textarea::placeholder {
            color: rgba(255, 255, 255, 0.5);
            font-style: italic;
          }
          .error-text {
            color: #e53e3e;
            font-size: 0.85rem;
            margin-top: 0.3rem;
          }
          button {
            width: 100%;
            padding: 1rem;
            font-size: 1rem;
            font-family: "Poppins", sans-serif;
            font-weight: 600;
            background: #07b1d0;
            color: #ffffff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.3s ease, transform 0.3s ease;
          }
          button:hover {
            background: #0cd2e8;
            transform: scale(1.02);
          }
          button:disabled {
            background: #06a2c0;
            cursor: not-allowed;
            opacity: 0.7;
          }
          .loader {
            display: none;
            margin: 1rem auto;
            width: 70px;
            text-align: center;
          }
          .loader.active {
            display: block;
          }
          .loader div {
            width: 1rem;
            height: 1rem;
            background: #ffffff;
            border-radius: 50%;
            display: inline-block;
            margin: 0 0.2rem;
            animation: sk-bouncedelay 1.4s infinite ease-in-out both;
          }
          .loader .bounce1 {
            animation-delay: -0.32s;
          }
          .loader .bounce2 {
            animation-delay: -0.16s;
          }
          @keyframes sk-bouncedelay {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          .chat-container {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 900px;
            margin: 2rem auto;
            display: flex;
            flex-direction: column;
            height: 70vh;
          }
          .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem;
          }
          .chat-message {
            margin-bottom: 1rem;
            display: flex;
          }
          .chat-message.user {
            justify-content: flex-end;
          }
          .chat-message.bot {
            justify-content: flex-start;
          }
          .message-bubble {
            max-width: 70%;
            padding: 1rem;
            border-radius: 12px;
            word-wrap: break-word;
          }
          .message-bubble.user {
            background: #07b1d0;
            color: #ffffff;
          }
          .message-bubble.bot {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
          }
          .chat-input-container {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding: 1rem;
          }
          .chat-input-wrapper {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
          }
          .chat-input-wrapper input {
            flex: 1;
            padding: 0.75rem 1rem;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 4px;
            color: #ffffff;
            font-family: "Poppins", sans-serif;
            outline: none;
          }
          .chat-input-wrapper input:focus {
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 8px rgba(7, 177, 208, 0.3);
          }
          .chat-input-wrapper button {
            width: auto;
            padding: 0.75rem 1.5rem;
          }
          .end-session-btn {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
            padding: 0.5rem;
            font-size: 0.9rem;
          }
          .end-session-btn:hover {
            background: rgba(255, 255, 255, 0.15);
          }
          .analysis-container {
            background: rgba(255, 255, 255, 0.05);
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 900px;
            margin: 2rem auto;
          }
          .analysis-section {
            margin-bottom: 2rem;
          }
          .analysis-section h3 {
            color: #07b1d0;
            font-size: 1.2rem;
            margin-bottom: 0.75rem;
          }
          .analysis-section p {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
            background: rgba(255, 255, 255, 0.05);
            padding: 1rem;
            border-radius: 8px;
          }
          .topic-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .topic-tag {
            background: rgba(7, 177, 208, 0.2);
            color: #07b1d0;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
          }
          .interest-badge {
            display: inline-block;
            padding: 0.5rem 1.5rem;
            border-radius: 20px;
            font-weight: 600;
            color: #ffffff;
          }
          .next-steps-list {
            list-style: none;
            padding: 0;
          }
          .next-steps-list li {
            background: rgba(255, 255, 255, 0.05);
            padding: 0.75rem 1rem;
            margin-bottom: 0.5rem;
            border-radius: 8px;
            color: rgba(255, 255, 255, 0.8);
            padding-left: 2rem;
            position: relative;
          }
          .next-steps-list li:before {
            content: "→";
            position: absolute;
            left: 0.75rem;
            color: #07b1d0;
          }
          @media (max-width: 768px) {
            .form-container,
            .chat-container,
            .analysis-container {
              padding: 1.5rem;
              margin: 1rem;
            }
            .form-field {
              margin-bottom: 1rem;
            }
            input[type="text"],
            input[type="email"],
            textarea {
              font-size: 0.9rem;
              padding: 0.8rem;
            }
            button {
              font-size: 0.9rem;
              padding: 0.8rem;
            }
            h1 {
              font-size: 2rem;
            }
            .message-bubble {
              max-width: 85%;
            }
          }
          @media (max-width: 480px) {
            .form-container,
            .chat-container,
            .analysis-container {
              padding: 1rem;
              margin: 0.5rem;
            }
            input[type="text"],
            input[type="email"],
            textarea {
              font-size: 0.8rem;
              padding: 0.7rem;
            }
            button {
              font-size: 0.8rem;
              padding: 0.7rem;
            }
            h1 {
              font-size: 1.8rem;
            }
          }
        `}
      </style>

      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '70px',
        backgroundColor: '#404347',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}>
        <button
          onClick={handleBackClick}
          style={{
            color: '#edf2f7',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.8rem',
            width: 'auto',
            padding: '0.5rem',
          }}
          onMouseEnter={(e) => e.target.style.color = '#63b3ed'}
          onMouseLeave={(e) => e.target.style.color = '#edf2f7'}
          aria-label="Back to Home"
        >
          <FiArrowLeft />
        </button>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a
            href="https://siddharamayya.in"
            style={{
              color: '#edf2f7',
              textDecoration: 'none',
              fontSize: '1.2rem',
              fontWeight: 600,
            }}
            onMouseEnter={(e) => e.target.style.color = '#63b3ed'}
            onMouseLeave={(e) => e.target.style.color = '#edf2f7'}
            aria-label="Home"
          >
            <FiHome size={24} />
          </a>
          <a
            href="https://mtptisid.github.io"
            style={{
              color: '#edf2f7',
              textDecoration: 'none',
              fontSize: '1.2rem',
              fontWeight: 600,
            }}
            onMouseEnter={(e) => e.target.style.color = '#63b3ed'}
            onMouseLeave={(e) => e.target.style.color = '#edf2f7'}
            aria-label="Profile"
          >
            <FaUser size={24} />
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        padding: '90px 1rem 2rem',
        width: '100vw',
        margin: '0 auto',
        flex: 1,
        boxSizing: 'border-box',
      }}>
        {/* Header */}
        <div className="animate-slideUp" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            color: '#ffffff',
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}>
            HR Assistant 💼
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }}>
            Let's discuss how Siddharamayya can contribute to your team
          </p>
        </div>

        {/* Form Step */}
        {step === 'form' && (
          <section className="form-container animate-slideUp">
            <h2 style={{
              color: '#ffffff',
              fontSize: '1.8rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}>
              Tell us about yourself
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-field">
                <label>Your Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>

              <div className="form-field">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@company.com"
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              <div className="form-field">
                <label>Company *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Tech Corp"
                />
                {errors.company && <p className="error-text">{errors.company}</p>}
              </div>

              <div className="form-field">
                <label>Role You're Hiring For *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Senior AI Engineer"
                />
                {errors.role && <p className="error-text">{errors.role}</p>}
              </div>

              <div className="form-field">
                <label>Additional Notes (Optional)</label>
                <textarea
                  value={formData.additional_notes}
                  onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
                  placeholder="Any specific requirements or questions..."
                />
              </div>

              {error && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#e53e3e',
                  margin: '1rem 0',
                  fontSize: '1rem',
                }}>
                  <FaExclamationTriangle style={{ marginRight: '0.5rem' }} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#07b1d0',
                  margin: '1rem 0',
                  fontSize: '1rem',
                }}>
                  <FaCheck style={{ marginRight: '0.5rem' }} />
                  <span>{success}</span>
                </div>
              )}

              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Starting...' : 'Start Conversation'}
              </button>

              <div className={`loader ${isLoading ? 'active' : ''}`}>
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
              </div>
            </form>
          </section>
        )}

        {/* Chat Step */}
        {step === 'chat' && (
          <div className="chat-container animate-slideUp">
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.isUser ? 'user' : 'bot'}`}>
                  <div className={`message-bubble ${msg.isUser ? 'user' : 'bot'}`}>
                    {msg.isUser ? (
                      <p style={{ margin: 0 }}>{msg.content}</p>
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="chat-message bot">
                  <div className="message-bubble bot">
                    <div className="loader active">
                      <div className="bounce1"></div>
                      <div className="bounce2"></div>
                      <div className="bounce3"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-input-container">
              <div className="chat-input-wrapper">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                >
                  <FiSend size={20} />
                </button>
              </div>
              <button
                onClick={handleEndSession}
                disabled={isLoading}
                className="end-session-btn"
              >
                End Session
              </button>
            </div>
          </div>
        )}

        {/* Analysis Step */}
        {step === 'analysis' && analysis && (
          <div className="analysis-container animate-slideUp">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{
                color: '#ffffff',
                fontSize: '2rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
              }}>
                Session Analysis
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Here's what we discussed
              </p>
            </div>

            {/* Summary */}
            <div className="analysis-section">
              <h3>Conversation Summary</h3>
              <p>{analysis.summary}</p>
            </div>

            {/* Key Topics */}
            <div className="analysis-section">
              <h3>Key Topics Discussed</h3>
              <div className="topic-tags">
                {analysis.key_topics?.map((topic, idx) => (
                  <span key={idx} className="topic-tag">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Role Fit */}
            <div className="analysis-section">
              <h3>Role Fit Analysis</h3>
              <p>{analysis.role_fit}</p>
            </div>

            {/* Interest Level */}
            <div className="analysis-section">
              <h3>Interest Level</h3>
              <span
                className="interest-badge"
                style={{ backgroundColor: getInterestBadgeColor(analysis.interest_level) }}
              >
                {analysis.interest_level?.toUpperCase()}
              </span>
            </div>

            {/* Next Steps */}
            <div className="analysis-section">
              <h3>Recommended Next Steps</h3>
              <ul className="next-steps-list">
                {analysis.next_steps?.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>

            <button onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#daebdd',
        color: '#000000',
        padding: '1.5rem',
        textAlign: 'center',
        width: '100vw',
      }}>
        <p style={{ fontSize: '1rem', fontWeight: 500 }}>
          © 2025 Siddharamayya M. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HRAssistant;
