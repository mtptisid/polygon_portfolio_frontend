import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiArrowLeft, FiHome, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaUser, FaExclamationTriangle } from 'react-icons/fa';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://my-portfolio-306678715125.us-central1.run.app/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        throw new Error('Invalid password');
      }

      const data = await response.json();
      localStorage.setItem('admin_token', data.access_token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid password. Please try again.');
    } finally {
      setIsLoading(false);
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
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(7, 177, 208, 0.7); }
            50% { box-shadow: 0 0 0 15px rgba(7, 177, 208, 0); }
          }
          .animate-slideUp {
            animation: slideUp 0.5s ease-out forwards;
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
          .form-container {
            background: rgba(255, 255, 255, 0.05);
            padding: 2.5rem;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            width: 100%;
            max-width: 450px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .form-field {
            margin-bottom: 1.5rem;
            width: 100%;
            position: relative;
          }
          input[type="password"] {
            width: 100%;
            padding: 1rem 3rem 1rem 1rem;
            font-size: 1rem;
            font-family: "Poppins", sans-serif;
            color: #ffffff;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            transition: all 0.3s ease;
            outline: none;
          }
          input:focus {
            background: rgba(255, 255, 255, 0.15);
            border-color: #07b1d0;
            box-shadow: 0 0 12px rgba(7, 177, 208, 0.3);
          }
          input::placeholder {
            color: rgba(255, 255, 255, 0.5);
            font-style: italic;
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
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          button:hover:not(:disabled) {
            background: #0cd2e8;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(7, 177, 208, 0.4);
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
          .icon-container {
            animation: float 3s ease-in-out infinite;
          }
          .password-toggle {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            padding: 0.5rem;
            width: auto;
            transition: color 0.3s ease;
          }
          .password-toggle:hover {
            color: #07b1d0;
            transform: translateY(-50%) scale(1.1);
          }
          @media (max-width: 768px) {
            .form-container {
              padding: 2rem;
              margin: 1rem;
            }
            input[type="password"] {
              font-size: 0.9rem;
              padding: 0.9rem 3rem 0.9rem 0.9rem;
            }
            button {
              font-size: 0.9rem;
              padding: 0.9rem;
            }
            h1 {
              font-size: 2rem;
            }
          }
          @media (max-width: 480px) {
            .form-container {
              padding: 1.5rem;
              margin: 0.5rem;
            }
            input[type="password"] {
              font-size: 0.85rem;
              padding: 0.8rem 2.5rem 0.8rem 0.8rem;
            }
            button {
              font-size: 0.85rem;
              padding: 0.8rem;
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

      {/* Main Content - Centered */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '90px 1rem 2rem',
        width: '100vw',
        boxSizing: 'border-box',
      }}>
        <section className="form-container animate-slideUp">
          {/* Icon with animation */}
          <div className="icon-container" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            margin: '0 auto 1.5rem',
            background: 'rgba(7, 177, 208, 0.2)',
            borderRadius: '50%',
            border: '2px solid rgba(7, 177, 208, 0.4)',
          }}>
            <FiLock size={36} color="#07b1d0" />
          </div>

          {/* Title */}
          <h1 style={{
            color: '#ffffff',
            fontSize: '2.5rem',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '0.5rem',
          }}>
            Admin Login
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1rem',
            textAlign: 'center',
            marginBottom: '2rem',
          }}>
            Enter your password to access the dashboard
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e53e3e',
                margin: '1rem 0',
                fontSize: '0.95rem',
                animation: 'fadeIn 0.3s ease-out',
              }}>
                <FaExclamationTriangle style={{ marginRight: '0.5rem' }} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Login'}
            </button>

            <div className={`loader ${isLoading ? 'active' : ''}`}>
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          </form>

          {/* Hint */}
          <p style={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.85rem',
            textAlign: 'center',
            marginTop: '1.5rem',
          }}>
            🔒 Secure admin access only
          </p>
        </section>
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

export default AdminLogin;
