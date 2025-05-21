import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import { FaUser, FaLinkedin, FaMedium, FaGithub, FaInstagram, FaExclamationTriangle, FaCheck, FaTimes } from 'react-icons/fa';

const SendMailPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    cc: '',
    bcc: '',
    honeypot: '',
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Token expiration time: 20 minutes (in milliseconds)
  const TOKEN_EXPIRY_TIME = 20 * 60 * 1000;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_FILES = 8;
  const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  // Check if token is valid (not expired)
  const isTokenValid = () => {
    const token = localStorage.getItem('access_token');
    const tokenTimestamp = localStorage.getItem('token_timestamp');
    if (!token || !tokenTimestamp) return false;

    const currentTime = new Date().getTime();
    const tokenTime = parseInt(tokenTimestamp, 10);
    return currentTime - tokenTime < TOKEN_EXPIRY_TIME;
  };

  // Check for JWT and its validity on mount
  useEffect(() => {
    if (isTokenValid()) {
      setShowPasswordPrompt(false);
    } else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_timestamp');
      setShowPasswordPrompt(true);
    }
  }, []);

  // Handle password submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://portpoliosid.onrender.com/sendmail/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Invalid password');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('token_timestamp', new Date().getTime().toString());
      setShowPasswordPrompt(false);
      setPassword('');
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    let valid = true;
    let errorMsg = '';

    if (selectedFiles.length + files.length > MAX_FILES) {
      errorMsg = `Maximum ${MAX_FILES} files allowed`;
      valid = false;
    }

    for (const file of selectedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        errorMsg = `File ${file.name} exceeds 5MB limit`;
        valid = false;
        break;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        errorMsg = `File ${file.name} has unsupported type: ${file.type}`;
        valid = false;
        break;
      }
    }

    if (valid) {
      setFiles([...files, ...selectedFiles].slice(0, MAX_FILES)); // Append new files, respect max limit
      setError('');
    } else {
      setError(errorMsg);
      e.target.value = ''; // Reset file input
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
    if (files.length === 1) {
      document.getElementById('file-input').value = ''; // Reset file input if no files remain
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Check token validity before submitting
    if (!isTokenValid()) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_timestamp');
      setShowPasswordPrompt(true);
      setIsLoading(false);
      return;
    }

    // Client-side validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    if (!formData.message) {
      setError('Message is required');
      setIsLoading(false);
      return;
    }
    if (formData.cc && !emailRegex.test(formData.cc)) {
      setError('Please enter a valid CC email address');
      setIsLoading(false);
      return;
    }
    if (formData.bcc && !emailRegex.test(formData.bcc)) {
      setError('Please enter a valid BCC email address');
      setIsLoading(false);
      return;
    }
    if (formData.honeypot) {
      setError('Spam detected');
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name || 'Unknown');
      formDataToSend.append('email', formData.email);
      formDataToSend.append('subject', formData.subject || 'Message from Siddharamayya');
      formDataToSend.append('message', formData.message);
      if (formData.cc) formDataToSend.append('cc', formData.cc);
      if (formData.bcc) formDataToSend.append('bcc', formData.bcc);
      if (formData.honeypot) formDataToSend.append('honeypot', formData.honeypot);
      
      files.forEach((file) => {
        formDataToSend.append('files', file);
      });

      const token = localStorage.getItem('access_token');
      const response = await fetch('https://portpoliosid.onrender.com/sendmail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('token_timestamp');
          setShowPasswordPrompt(true);
          setIsLoading(false);
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send email');
      }

      const data = await response.json();
      setSuccess(data.message);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        cc: '',
        bcc: '',
        honeypot: '',
      });
      setFiles([]);
      document.getElementById('file-input').value = ''; // Reset file input
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/projects');
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
          input[type="text"],
          input[type="email"],
          input[type="password"],
          input[type="file"],
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
          input[type="file"] {
            padding: 0.5rem;
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
          .file-list {
            margin-top: 0.5rem;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            list-style: none;
          }
          .file-list li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.3rem;
            padding: 0.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
          }
          .file-list .file-name {
            flex-grow: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .file-list .remove-button {
            background: #e53e3e; /* Softer red */
            color: #ffffff;
            border: none;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 0.8rem;
            transition: background 0.3s ease, transform 0.2s ease;
            flex-shrink: 0;
            margin-left: 0.5rem;
          }
          .file-list .remove-button:hover {
            background: #f56565; /* Lighter red on hover */
            transform: scale(1.1);
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
          .password-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 200;
          }
          .password-modal-content {
            background: #ffffff;
            padding: 2rem;
            border-radius: 12px;
            width: 90%;
            max-width: 400px;
            text-align: center;
            animation: slideUp 0.5s ease-out;
          }
          .social-links {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin: 2rem 0;
          }
          .social-links a {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            width: 3rem;
            height: 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }
          .social-links a:hover {
            color: #07b1d0;
            transform: scale(1.1);
          }
          .contact-info {
            display: flex;
            flex-direction: row;
            align-items: stretch;
            justify-content: center;
            width: 100vw;
            margin: 2rem 0;
            padding: 2rem 0;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 0;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            gap: 2.5rem;
          }
          .contact-info > div {
            flex: 1 1 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: left;
            max-width: 400px;
            width: 100%;
            padding: 0 2vw;
            margin-bottom: 0;
          }
          .contact-info h5 {
            color: #07b1d0;
            font-size: 1.4rem;
            font-weight: 600;
            margin-bottom: 1.2rem;
            text-align: left;
          }
          .contact-info p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 1.1rem;
            line-height: 1.6;
            text-align: left;
            word-break: break-word;
          }
          @media (max-width: 900px) {
            .form-container {
              max-width: 98vw;
            }
            .contact-info {
              gap: 1.2rem;
              padding: 1.5rem 0;
            }
            .contact-info > div {
              padding: 0 1vw;
              max-width: 100vw;
            }
          }
          @media (max-width: 768px) {
            .form-container {
              padding: 1.5rem;
              margin: 1rem;
            }
            .contact-info {
              flex-direction: column;
              align-items: center;
              padding: 1.2rem 0.3rem;
              margin: 1rem 0;
              gap: 1rem;
              min-height: unset;
              border-radius: 12px;
            }
            .contact-info > div {
              text-align: center;
              padding: 0 0.5rem;
              margin-bottom: 0.6rem;
              max-width: 400px;
              width: 100%;
            }
            .contact-info h5,
            .contact-info p {
              text-align: center;
            }
            .form-field {
              margin-bottom: 1rem;
            }
            input[type="text"],
            input[type="email"],
            input[type="password"],
            input[type="file"],
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
            .social-links a {
              width: 2.5rem;
              height: 2.5rem;
            }
            .password-modal-content {
              padding: 1.5rem;
            }
            .file-list {
              font-size: 0.8rem;
            }
            .file-list .remove-button {
              width: 20px;
              height: 20px;
              font-size: 0.7rem;
            }
          }
          @media (max-width: 480px) {
            .form-container {
              padding: 1rem;
              margin: 0.5rem;
            }
            .contact-info {
              flex-direction: column;
              align-items: center;
              padding: 1rem 0.1rem;
              margin: 0.5rem 0;
              gap: 0.5rem;
              border-radius: 12px;
            }
            .contact-info > div {
              margin-bottom: 0.6rem;
              max-width: 300px;
              width: 100%;
              padding: 0 0.1rem;
            }
            .contact-info h5 {
              font-size: 1rem;
            }
            .contact-info p {
              font-size: 0.9rem;
            }
            input[type="text"],
            input[type="email"],
            input[type="password"],
            input[type="file"],
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
            .social-links a {
              width: 2rem;
              height: 2rem;
            }
            .password-modal-content {
              padding: 1rem;
              max-width: 300px;
            }
            .file-list {
              font-size: 0.7rem;
            }
            .file-list .remove-button {
              width: 18px;
              height: 18px;
              font-size: 0.6rem;
            }
          }
        `}
      </style>
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
          }}
          onMouseEnter={(e) => e.target.style.color = '#63b3ed'}
          onMouseLeave={(e) => e.target.style.color = '#edf2f7'}
          aria-label="Back to Projects"
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
      {showPasswordPrompt && (
        <div className="password-modal">
          <div className="password-modal-content">
            <h2 style={{
              color: '#333333',
              fontSize: '1.5rem',
              marginBottom: '1rem',
            }}>
              Enter Admin Password
            </h2>
            <form onSubmit={handlePasswordSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    fontSize: '1rem',
                    color: '#333333',
                    background: '#f7fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                  }}
                />
              </div>
              {passwordError && (
                <p style={{
                  color: '#e53e3e',
                  fontSize: '0.9rem',
                  marginBottom: '1rem',
                }}>
                  {passwordError}
                </p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  background: '#07b1d0',
                  color: '#ffffff',
                  padding: '0.8rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  width: '100%',
                }}
              >
                {isLoading ? 'Verifying...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}
      {!showPasswordPrompt && (
        <main style={{
          padding: '90px 1rem 2rem',
          width: '100vw',
          margin: '0 auto',
          flex: 1,
          boxSizing: 'border-box',
        }}>
          <section className="form-container animate-slideUp">
            <h1 style={{
              color: '#ffffff',
              fontSize: '2.5rem',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}>
              Admin Email Sender
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name (optional)"
                />
              </div>
              <div className="form-field">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Recipient Email"
                  required
                />
              </div>
              <div className="form-field">
                <input
                  type="email"
                  name="cc"
                  value={formData.cc}
                  onChange={handleChange}
                  placeholder="CC Email (optional)"
                />
              </div>
              <div className="form-field">
                <input
                  type="email"
                  name="bcc"
                  value={formData.bcc}
                  onChange={handleChange}
                  placeholder="BCC Email (optional)"
                />
              </div>
              <div className="form-field">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject (optional)"
                />
              </div>
              <div className="form-field">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Message"
                  required
                />
              </div>
              <div className="form-field">
                <input
                  id="file-input"
                  type="file"
                  name="files"
                  onChange={handleFileChange}
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
                />
                {files.length > 0 && (
                  <ul className="file-list">
                    {files.map((file, index) => (
                      <li key={index}>
                        <span className="file-name">{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                        <button
                          type="button"
                          className="remove-button"
                          onClick={() => handleRemoveFile(index)}
                          aria-label={`Remove ${file.name}`}
                        >
                          <FaTimes />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div style={{ display: 'none' }}>
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
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
                  textShadow: '0 0 8px rgba(229, 62, 62, 0.5)',
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
                  textShadow: '0 0 8px rgba(7, 177, 208, 0.5)',
                }}>
                  <FaCheck style={{ marginRight: '0.5rem' }} />
                  <span>{success}</span>
                </div>
              )}
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Email'}
              </button>
              <div className={`loader ${isLoading ? 'active' : ''}`}>
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
              </div>
            </form>
          </section>
          <section className="social-links animate-slideUp">
            <a href="https://www.linkedin.com/in/siddharamayya-mathapati" target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={24} />
            </a>
            <a href="https://medium.com/@msidrm455" target="_blank" rel="noopener noreferrer">
              <FaMedium size={24} />
            </a>
            <a href="https://github.com/mtptisid" target="_blank" rel="noopener noreferrer">
              <FaGithub size={24} />
            </a>
            <a href="https://www.instagram.com/its_5id" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} />
            </a>
          </section>
          <section className="contact-info animate-slideUp">
            <div>
              <h5>Where to find me</h5>
              <p>
                #372, Ward no 3<br />
                Yadur, Chikodi<br />
                Belagavi, Karnataka, India
              </p>
            </div>
            <div>
              <h5>Email Me At</h5>
              <p>me@siddharamayya.in</p>
            </div>
            <div>
              <h5>Call Me At</h5>
              <p>Phone: (+91) 97406 71620</p>
            </div>
          </section>
        </main>
      )}
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

export default SendMailPage;
