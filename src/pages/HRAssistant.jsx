import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { FiSend, FiX, FiArrowLeft, FiHome, FiUser, FiMail, FiBriefcase, FiTarget, FiArrowRight, FiMessageSquare, FiTrendingUp } from 'react-icons/fi';
import { FaUser, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HRIntro from '../components/HRIntro';
import profileImg from '../assets/siddharamayya_image.jpeg';

const API_BASE = 'https://my-portfolio-306678715125.us-central1.run.app';
const SESSION_KEY = 'hr_session_id';
const RECRUITER_KEY = 'hr_recruiter_info';
const CHAT_HISTORY_KEY = 'hr_chat_history';

const HRAssistant = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('intro'); // 'intro', 'checking', 'form', 'chat', 'analysis'
  const [sessionId, setSessionId] = useState(null);
  const [recruiterInfo, setRecruiterInfo] = useState(null);
  const [resumeStatus, setResumeStatus] = useState('none'); // 'none', 'pending', 'resumed', 'error'
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
  const [sendError, setSendError] = useState('');
  const [failedMessage, setFailedMessage] = useState('');
  const chatEndRef = useRef(null);

  const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(RECRUITER_KEY);
    localStorage.removeItem(CHAT_HISTORY_KEY);
    setSessionId(null);
    setMessages([]);
    setRecruiterInfo(null);
  };

  const attemptResume = async (id) => {
    setResumeStatus('pending');
    try {
      const response = await fetch(`${API_BASE}/api/hr/session/${id}/resume`);

      if (response.status === 404) {
        clearSession();
        setResumeStatus('none');
        return;
      }
      if (!response.ok) throw new Error('Failed to resume session');

      const data = await response.json();
      setSessionId(data.session_id);
      if (data.recruiter_info) {
        setRecruiterInfo(data.recruiter_info);
        setFormData((prev) => ({ ...prev, ...data.recruiter_info }));
        localStorage.setItem(RECRUITER_KEY, JSON.stringify(data.recruiter_info));
      }
      const restored = (data.chat_history || []).map((m) => ({
        content: m.content,
        isUser: m.role === 'user' || m.role === 'recruiter',
      }));
      setMessages(restored);
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(restored));
      setResumeStatus('resumed');
    } catch (err) {
      console.error('Error resuming session:', err);
      setResumeStatus('error');
    }
  };

  // On mount: optimistically load any cached session/messages, then verify with the backend
  useEffect(() => {
    const storedSessionId = localStorage.getItem(SESSION_KEY);
    if (!storedSessionId) return;

    const cachedInfo = localStorage.getItem(RECRUITER_KEY);
    const cachedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
    if (cachedInfo) {
      try { setRecruiterInfo(JSON.parse(cachedInfo)); } catch { /* ignore malformed cache */ }
    }
    if (cachedHistory) {
      try { setMessages(JSON.parse(cachedHistory)); } catch { /* ignore malformed cache */ }
    }
    setSessionId(storedSessionId);
    attemptResume(storedSessionId);
  }, []);

  // Once the intro finishes, land on chat/form depending on whether resume already resolved
  const handleIntroComplete = () => {
    if (resumeStatus === 'resumed') setStep('chat');
    else if (resumeStatus === 'pending' || resumeStatus === 'error') setStep('checking');
    else setStep('form');
  };

  // While waiting on a pending/errored resume check, move forward automatically once resolved
  useEffect(() => {
    if (step !== 'checking') return;
    if (resumeStatus === 'resumed') setStep('chat');
    else if (resumeStatus === 'none') setStep('form');
  }, [resumeStatus, step]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Persist chat history locally so transient failures don't lose the conversation
  useEffect(() => {
    if (!sessionId || messages.length === 0) return;
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  }, [messages, sessionId]);

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
      const response = await fetch(`${API_BASE}/api/hr/start_session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to start session');

      const data = await response.json();
      setSessionId(data.session_id);
      const welcome = [{ content: data.welcome_message, isUser: false }];
      setMessages(welcome);
      setRecruiterInfo(formData);
      localStorage.setItem(SESSION_KEY, data.session_id);
      localStorage.setItem(RECRUITER_KEY, JSON.stringify(formData));
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(welcome));
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

  const handleSendMessage = async (retryContent) => {
    const content = retryContent ?? inputMessage;
    if (!content.trim() || isLoading) return;

    if (!retryContent) {
      setMessages(prev => [...prev, { content, isUser: true }]);
      setInputMessage('');
    }
    setIsLoading(true);
    setSendError('');

    try {
      const response = await fetch(`${API_BASE}/api/hr/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          content,
          model: 'gemini'
        })
      });

      if (response.status === 404) {
        clearSession();
        setError('Your session has expired. Please start a new conversation.');
        setStep('form');
        return;
      }
      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      setMessages(prev => [...prev, { content: data.content, isUser: false }]);
      setFailedMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setSendError('Message failed to send.');
      setFailedMessage(content);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetrySend = () => {
    if (failedMessage) handleSendMessage(failedMessage);
  };

  const handleEndSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/hr/end_session`, {
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
      clearSession();
      setIsLoading(false);
    }
  };

  const handleNewSession = () => {
    clearSession();
    setFormData({ name: '', email: '', company: '', role: '', additional_notes: '' });
    setError('');
    setSuccess('');
    setStep('form');
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
      background: step === 'intro'
        ? 'transparent'
        : 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      fontFamily: '"Poppins", sans-serif',
      color: '#e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      overflowX: 'hidden'
    }}>
      <AnimatePresence>
        {step === 'intro' && <HRIntro onComplete={handleIntroComplete} />}
      </AnimatePresence>
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
            background: #0f172a;
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes dotBounce {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
            40% { transform: translateY(-8px); opacity: 1; }
          }
          @keyframes hrSpin {
            to { transform: rotate(360deg); }
          }
          .hr-checking-spinner {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 3px solid rgba(255,255,255,0.15);
            border-top-color: #818cf8;
            animation: hrSpin 0.8s linear infinite;
          }
          .animate-slideUp {
            animation: slideUp 0.5s ease-out forwards;
          }
          @keyframes heroOrbBlob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(30px, -25px) scale(1.12); }
          }
          @keyframes heroRingSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes heroFeatureGlow {
            0%, 100% { border-color: rgba(255,255,255,0.14); }
            50% { border-color: rgba(129,140,248,0.5); }
          }
          .hero-page-orb-1 {
            position: fixed; top: -120px; right: -120px; width: 420px; height: 420px;
            border-radius: 50%; background: rgba(102,126,234,0.25); filter: blur(90px);
            animation: heroOrbBlob 9s ease-in-out infinite; pointer-events: none; z-index: 0;
          }
          .hero-page-orb-2 {
            position: fixed; bottom: -140px; left: -100px; width: 380px; height: 380px;
            border-radius: 50%; background: rgba(118,75,162,0.25); filter: blur(90px);
            animation: heroOrbBlob 11s ease-in-out infinite reverse; pointer-events: none; z-index: 0;
          }
          .hero-grid {
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 3.5rem;
            max-width: 1300px;
            width: 100%;
            margin: 0 auto;
            flex-wrap: wrap;
          }
          .hero-left {
            flex: 1 1 420px;
            max-width: 480px;
          }
          .hero-eyebrow {
            text-transform: uppercase;
            letter-spacing: 0.2em;
            font-size: 0.75rem;
            font-weight: 700;
            color: #818cf8;
            margin-bottom: 1rem;
          }
          .hero-avatar-ring {
            position: relative;
            width: 96px;
            height: 96px;
            border-radius: 50%;
            margin-bottom: 1.5rem;
          }
          .hero-avatar-ring::before {
            content: '';
            position: absolute;
            inset: -6px;
            border-radius: 50%;
            background: conic-gradient(from 0deg, #667eea, #764ba2, #06b6d4, #667eea);
            animation: heroRingSpin 7s linear infinite;
            z-index: -1;
          }
          .hero-stats {
            display: flex;
            gap: 1.5rem;
            margin: 1.5rem 0;
          }
          .hero-stat strong {
            display: block;
            color: #ffffff;
            font-size: 1.3rem;
            font-weight: 700;
          }
          .hero-stat span {
            color: #94a3b8;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .hero-feature {
            display: flex;
            gap: 0.85rem;
            align-items: flex-start;
            padding: 0.9rem 1rem;
            border-radius: 14px;
            background: rgba(255,255,255,0.05);
            border: 1.5px solid rgba(255,255,255,0.14);
            backdrop-filter: blur(6px);
            margin-bottom: 0.85rem;
            animation: heroFeatureGlow 4s ease-in-out infinite;
          }
          .hero-feature-icon {
            flex-shrink: 0;
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: #ffffff;
          }
          .hero-right {
            flex: 1 1 460px;
            display: flex;
            justify-content: center;
          }
          @media (max-width: 900px) {
            .hero-avatar-ring { margin-left: auto; margin-right: auto; }
            .hero-left { text-align: center; }
            .hero-stats { justify-content: center; }
          }
          .form-container {
            background: transparent;
            padding: 0;
            width: 100%;
            max-width: 460px;
            margin: 0 auto;
            position: relative;
          }
          .form-header {
            text-align: center;
            margin-bottom: 2rem;
          }
          .form-header-icon {
            width: 56px;
            height: 56px;
            margin: 0 auto 1rem;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: #ffffff;
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.35);
          }
          .form-subtitle {
            color: #94a3b8;
            font-size: 0.95rem;
            margin-top: 0.4rem;
          }
          .form-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0;
          }
          .form-field {
            margin-bottom: 1.4rem;
            width: 100%;
          }
          .form-field label {
            display: block;
            color: #cbd5e1;
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }
          .input-icon-wrap {
            position: relative;
            display: flex;
            align-items: center;
          }
          .input-icon-wrap .input-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            pointer-events: none;
          }
          .input-icon-wrap input {
            padding-left: 2.75rem;
          }
          .form-container input[type="text"],
          .form-container input[type="email"],
          .form-container textarea {
            width: 100%;
            padding: 0.9rem 1rem 0.9rem 2.75rem;
            font-size: 0.95rem;
            font-family: "Poppins", sans-serif;
            color: #ffffff;
            background: rgba(255,255,255,0.07);
            border: 1.5px solid rgba(255,255,255,0.18);
            border-radius: 12px;
            transition: all 0.25s ease;
            outline: none;
          }
          .form-container textarea {
            min-height: 110px;
            resize: vertical;
          }
          .form-container input:focus,
          .form-container textarea:focus {
            background: rgba(255,255,255,0.11);
            border-color: #818cf8;
            box-shadow: 0 0 0 4px rgba(129, 140, 248, 0.18);
          }
          .form-container input::placeholder,
          .form-container textarea::placeholder {
            color: #94a3b8;
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
            background: #404347;
            color: #ffffff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.3s ease, transform 0.3s ease;
          }
          button:hover {
            background: #2d3035;
            transform: scale(1.02);
          }
          button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
            opacity: 0.7;
          }
          .submit-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.35);
            margin-top: 0.5rem;
          }
          .submit-btn:hover:not(:disabled) {
            background: linear-gradient(135deg, #5a6fd8, #6a4394);
            transform: translateY(-2px);
            box-shadow: 0 14px 30px rgba(102, 126, 234, 0.45);
          }
          .submit-btn:disabled {
            background: #9ca3af;
            box-shadow: none;
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
            padding: 40px 1rem 75px;
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: transparent;
            max-width: 100%;
            width: 100%;
            height: calc(100vh - 140px);
            box-sizing: border-box;
            position: relative;
          }
          .chat-recruiter-banner {
            width: 100%;
            max-width: 900px;
            margin: 0 auto 1.25rem;
            padding: 0.65rem 1.1rem;
            border-radius: 999px;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.14);
            color: #cbd5e1;
            font-size: 0.85rem;
            text-align: center;
          }
          .chat-recruiter-banner strong {
            color: #ffffff;
          }
          .chat-messages {
            width: 100%;
            max-width: 900px;
            display: flex;
            flex-direction: column;
            padding: 0 1rem;
          }
          .chat-message {
            margin-bottom: 1.5rem;
            display: flex;
            width: 100%;
            box-sizing: border-box;
          }
          .chat-message.user {
            justify-content: flex-end;
          }
          .chat-message.bot {
            justify-content: flex-start;
          }
          .message-bubble {
            max-width: 100%;
            padding: 1.25rem;
            border-radius: 1.5rem;
            word-wrap: break-word;
            word-break: break-word;
            overflow-wrap: break-word;
            box-sizing: border-box;
            font-weight: 450;
            font-size: 0.9rem;
            line-height: 1.6;
          }
          .message-bubble.user {
            background: linear-gradient(135deg, rgba(102,126,234,0.28), rgba(118,75,162,0.28));
            color: #ffffff;
            border: 1px solid rgba(255,255,255,0.18);
            align-self: flex-end;
          }
          .message-bubble.bot {
            background: rgba(255,255,255,0.06);
            color: #e2e8f0;
            border: 1px solid rgba(255,255,255,0.12);
            backdrop-filter: blur(8px);
            align-self: flex-start;
          }
          .chat-input-container {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            display: flex;
            justify-content: center;
            background: linear-gradient(to top, #0f172a 55%, transparent);
            padding: 1rem;
            box-sizing: border-box;
          }
          .chat-input-wrapper {
            display: flex;
            flex-direction: column;
            background-color: rgba(255,255,255,0.07);
            border-radius: 24px;
            border: 1px solid rgba(255,255,255,0.16);
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.35);
            padding: 0.65rem;
            width: 100%;
            max-width: 900px;
            min-height: 80px;
            gap: 0.4rem;
            box-sizing: border-box;
          }
          .chat-send-error {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
            padding: 0.5rem 0.9rem;
            border-radius: 12px;
            background: rgba(239,68,68,0.12);
            border: 1px solid rgba(239,68,68,0.35);
            color: #fca5a5;
            font-size: 0.8rem;
          }
          .chat-send-error button {
            width: auto;
            padding: 0.3rem 0.8rem;
            font-size: 0.75rem;
            background: rgba(239,68,68,0.25);
            border-radius: 999px;
          }
          .chat-input-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            width: 100%;
          }
          .chat-input-wrapper input {
            flex: 1;
            padding: 0.75rem 1rem;
            border: none;
            font-size: 1rem;
            background: transparent;
            color: #ffffff;
            font-family: "Poppins", sans-serif;
            outline: none;
            resize: none;
            min-height: 40px;
            line-height: 1.5;
            box-sizing: border-box;
          }
          .chat-input-wrapper input::placeholder {
            color: #94a3b8;
          }
          .send-button {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.5rem;
            border-radius: 20px;
            border: none;
            background: linear-gradient(135deg, #667eea, #764ba2);
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            width: 40px;
            height: 40px;
            box-sizing: border-box;
          }
          .send-button:hover:not(:disabled) {
            transform: scale(1.06);
            box-shadow: 0 6px 16px rgba(102,126,234,0.4);
          }
          .send-button:disabled {
            background: #4b5563;
            cursor: not-allowed;
          }
          .end-session-btn {
            background: rgba(239,68,68,0.12);
            color: #fca5a5;
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            border-radius: 20px;
            border: 1px solid rgba(239,68,68,0.35);
            cursor: pointer;
            transition: background-color 0.2s ease;
            font-weight: 500;
          }
          .end-session-btn:hover {
            background: rgba(239,68,68,0.22);
          }
          .new-session-btn {
            background: rgba(255,255,255,0.06);
            color: #cbd5e1;
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.18);
            cursor: pointer;
            transition: background-color 0.2s ease;
            font-weight: 500;
          }
          .new-session-btn:hover {
            background: rgba(255,255,255,0.12);
          }
          .analysis-container {
            background: rgba(255,255,255,0.05);
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.12);
            backdrop-filter: blur(10px);
            width: 100%;
            max-width: 900px;
            margin: 2rem auto;
          }
          .analysis-section {
            margin-bottom: 2rem;
          }
          .analysis-section h3 {
            color: #ffffff;
            font-size: 1.2rem;
            margin-bottom: 0.75rem;
          }
          .analysis-section p {
            color: #cbd5e1;
            line-height: 1.6;
            background: rgba(255,255,255,0.04);
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.1);
          }
          .topic-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .topic-tag {
            background: rgba(102,126,234,0.15);
            color: #a5b4fc;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            border: 1px solid rgba(102,126,234,0.3);
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
            background: rgba(255,255,255,0.04);
            padding: 0.75rem 1rem;
            margin-bottom: 0.5rem;
            border-radius: 8px;
            color: #cbd5e1;
            padding-left: 2rem;
            position: relative;
            border: 1px solid rgba(255,255,255,0.1);
          }
          .next-steps-list li:before {
            content: "→";
            position: absolute;
            left: 0.75rem;
            color: #818cf8;
          }
          @media (max-width: 768px) {
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

      {step === 'form' && (
        <>
          <div className="hero-page-orb-1" />
          <div className="hero-page-orb-2" />
        </>
      )}

      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '70px',
        background: 'linear-gradient(90deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          position: 'absolute',
          bottom: '-1px',
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #667eea, #764ba2, #06b6d4)',
        }} />
        <button
          onClick={handleBackClick}
          style={{
            color: '#e2e8f0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.8rem',
            width: 'auto',
            padding: '0.5rem',
            transition: 'color 0.2s ease, transform 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#818cf8'; e.currentTarget.style.transform = 'translateX(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.transform = 'translateX(0)'; }}
          aria-label="Back to Home"
        >
          <FiArrowLeft />
        </button>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a
            href="https://siddharamayya.in"
            style={{
              color: '#e2e8f0',
              textDecoration: 'none',
              fontSize: '1.2rem',
              fontWeight: 600,
              transition: 'color 0.2s ease, transform 0.2s ease',
              display: 'flex',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#818cf8'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
            aria-label="Home"
          >
            <FiHome size={24} />
          </a>
          <a
            href="https://mtptisid.github.io"
            style={{
              color: '#e2e8f0',
              textDecoration: 'none',
              fontSize: '1.2rem',
              fontWeight: 600,
              transition: 'color 0.2s ease, transform 0.2s ease',
              display: 'flex',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#818cf8'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
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
        {/* Header (chat/analysis steps only — form step has its own hero) */}
        {(step === 'chat' || step === 'analysis') && (
          <div className="animate-slideUp" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              color: '#ffffff',
              fontSize: '2.5rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}>
              HR Assistant 💼
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
              Let's discuss how Siddharamayya can contribute to your team
            </p>
          </div>
        )}

        {/* Checking Step: verifying a resumed session */}
        {step === 'checking' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            minHeight: '60vh',
            textAlign: 'center',
          }}>
            {resumeStatus === 'error' ? (
              <>
                <p style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>
                  We couldn't reconnect to your previous session
                </p>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '360px', margin: 0 }}>
                  This can happen due to a network issue. You can try again or start a new conversation.
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button className="submit-btn" style={{ width: 'auto', padding: '0.75rem 1.5rem' }} onClick={() => attemptResume(sessionId)}>
                    Retry
                  </button>
                  <button style={{ width: 'auto', padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)' }} onClick={handleNewSession}>
                    Start New
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="hr-checking-spinner" />
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>
                  Reconnecting to your previous session...
                </p>
              </>
            )}
          </div>
        )}

        {/* Form Step */}
        {step === 'form' && (
          <div className="hero-grid">
            <motion.div
              className="hero-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="hero-eyebrow">AI-Powered HR Assistant</p>
              <div className="hero-avatar-ring">
                <img
                  src={profileImg}
                  alt="Siddharamayya Mathapati"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              </div>
              <h1 style={{ color: '#ffffff', fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.6rem', lineHeight: 1.25 }}>
                Let's Talk About Your Next Great Hire
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6 }}>
                Chat directly with an AI trained on Siddharamayya's real experience, projects, and skills —
                no scheduling, instant answers.
              </p>

              <div className="hero-stats">
                <div className="hero-stat"><strong>5+</strong><span>Years Exp.</span></div>
                <div className="hero-stat"><strong>20+</strong><span>Projects</span></div>
                <div className="hero-stat"><strong>10+</strong><span>AI Systems</span></div>
              </div>

              <motion.div
                className="hero-feature"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <span className="hero-feature-icon"><FiTarget size={17} /></span>
                <div>
                  <p style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem', margin: '0 0 0.2rem' }}>Purpose</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>Ask direct questions and get honest, instant answers.</p>
                </div>
              </motion.div>
              <motion.div
                className="hero-feature"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
              >
                <span className="hero-feature-icon"><FiMessageSquare size={17} /></span>
                <div>
                  <p style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem', margin: '0 0 0.2rem' }}>How It Works</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>Fill the form, then chat naturally about the role.</p>
                </div>
              </motion.div>
              <motion.div
                className="hero-feature"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <span className="hero-feature-icon"><FiTrendingUp size={17} /></span>
                <div>
                  <p style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem', margin: '0 0 0.2rem' }}>What You Get</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>A summary + interest analysis when you're done.</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="hero-right"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
          <section className="form-container animate-slideUp">
            <div className="form-header">
              <div className="form-header-icon">
                <FiUser size={26} />
              </div>
              <h2 style={{
                color: '#ffffff',
                fontSize: '1.8rem',
                fontWeight: 700,
                margin: 0,
              }}>
                Tell us about yourself
              </h2>
              <p className="form-subtitle">
                Share a few details to start a personalized conversation
              </p>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="form-grid">
                <div className="form-field">
                  <label>Your Name *</label>
                  <div className="input-icon-wrap">
                    <FiUser className="input-icon" size={18} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && <p className="error-text">{errors.name}</p>}
                </div>

                <div className="form-field">
                  <label>Email *</label>
                  <div className="input-icon-wrap">
                    <FiMail className="input-icon" size={18} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john.doe@company.com"
                    />
                  </div>
                  {errors.email && <p className="error-text">{errors.email}</p>}
                </div>

                <div className="form-field">
                  <label>Company *</label>
                  <div className="input-icon-wrap">
                    <FiBriefcase className="input-icon" size={18} />
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Tech Corp"
                    />
                  </div>
                  {errors.company && <p className="error-text">{errors.company}</p>}
                </div>

                <div className="form-field">
                  <label>Role You're Hiring For *</label>
                  <div className="input-icon-wrap">
                    <FiTarget className="input-icon" size={18} />
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Senior AI Engineer"
                    />
                  </div>
                  {errors.role && <p className="error-text">{errors.role}</p>}
                </div>
              </div>

              <div className="form-field">
                <label>Additional Notes (Optional)</label>
                <div className="input-icon-wrap">
                  <FiMessageSquare className="input-icon" size={18} style={{ top: '1.1rem', transform: 'none' }} />
                  <textarea
                    value={formData.additional_notes}
                    onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
                    placeholder="Any specific requirements or questions..."
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
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

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Starting...' : (
                  <>
                    Start Conversation
                    <FiArrowRight size={18} />
                  </>
                )}
              </button>

              <div className={`loader ${isLoading ? 'active' : ''}`}>
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
              </div>
            </form>
          </section>
            </motion.div>
          </div>
        )}

        {/* Chat Step */}
        {step === 'chat' && (
          <div className="chat-container">
            {recruiterInfo && (
              <div className="chat-recruiter-banner animate-slideUp">
                Chatting as <strong>{recruiterInfo.name}</strong>
                {recruiterInfo.company ? <> · {recruiterInfo.company}</> : null}
                {recruiterInfo.role ? <> · {recruiterInfo.role}</> : null}
              </div>
            )}
            <div className="chat-messages animate-slideUp">
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
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#94a3b8',
                          animation: 'dotBounce 1.4s infinite ease-in-out',
                          animationDelay: '0s'
                        }}
                      />
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#94a3b8',
                          animation: 'dotBounce 1.4s infinite ease-in-out',
                          animationDelay: '0.2s'
                        }}
                      />
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#94a3b8',
                          animation: 'dotBounce 1.4s infinite ease-in-out',
                          animationDelay: '0.4s'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-input-container">
              <div className="chat-input-wrapper">
                {sendError && (
                  <div className="chat-send-error">
                    <span>{sendError}</span>
                    <button type="button" onClick={handleRetrySend}>Retry</button>
                  </div>
                )}
                <div className="chat-input-row">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                    placeholder="Type your message..."
                    disabled={isLoading}
                  />
                  <button
                    className="send-button"
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !inputMessage.trim()}
                    aria-label="Send message"
                  >
                    <FiSend size={20} color="white" />
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.25rem' }}>
                  <button
                    onClick={handleNewSession}
                    disabled={isLoading}
                    className="new-session-btn"
                  >
                    New Session
                  </button>
                  <button
                    onClick={handleEndSession}
                    disabled={isLoading}
                    className="end-session-btn"
                  >
                    End Session
                  </button>
                </div>
              </div>
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
              <p style={{ color: '#94a3b8' }}>
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

            <button onClick={() => navigate('/')} className="submit-btn">
              Back to Home
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        borderTop: '1px solid rgba(255,255,255,0.08)',
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
