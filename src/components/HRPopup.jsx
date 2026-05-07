import { useState, useEffect } from 'react';
import { FiX, FiBriefcase, FiArrowRight } from 'react-icons/fi';
import { FaRocket } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HRPopup = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem('hr_popup_shown');
    if (popupShown) {
      return;
    }

    // Show popup after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      setIsDismissed(true);
      sessionStorage.setItem('hr_popup_shown', 'true');
    }, 300);
  };

  const handleStartConversation = () => {
    sessionStorage.setItem('hr_popup_shown', 'true');
    navigate('/hr-assistant');
  };

  if (isDismissed || !isVisible) return null;

  return (
    <>
      <style>
        {`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(100px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes slideOutDown {
            from {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            to {
              opacity: 0;
              transform: translateY(100px) scale(0.9);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(7, 177, 208, 0.7);
            }
            50% {
              box-shadow: 0 0 0 15px rgba(7, 177, 208, 0);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          .hr-popup-container {
            animation: ${isAnimating ? 'slideInUp' : 'slideOutDown'} 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          }
          
          .hr-popup-icon {
            animation: float 3s ease-in-out infinite;
          }
          
          .hr-popup-button {
            position: relative;
            overflow: hidden;
          }
          
          .hr-popup-button::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
          }
          
          .hr-popup-button:hover::before {
            width: 300px;
            height: 300px;
          }
          
          .hr-popup-shine {
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            animation: shine 3s infinite;
          }
          
          @keyframes shine {
            0% {
              left: -100%;
            }
            50%, 100% {
              left: 100%;
            }
          }
        `}
      </style>
      
      <div
        className="hr-popup-container"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          width: 'calc(100% - 40px)',
          maxWidth: '420px',
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          padding: '1.75rem',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Shine effect */}
          <div className="hr-popup-shine"></div>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: '#ffffff',
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'rotate(0deg)';
            }}
          >
            <FiX size={18} />
          </button>

          {/* Icon with animation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem',
            gap: '1rem',
          }}>
            <div className="hr-popup-icon" style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '1rem',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}>
              <FiBriefcase size={32} />
            </div>
            <div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                margin: 0,
                marginBottom: '0.25rem',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              }}>
                Are you hiring?
              </h3>
              <p style={{
                fontSize: '0.95rem',
                margin: 0,
                opacity: 0.95,
                fontWeight: '500',
              }}>
                Let's talk! 💼✨
              </p>
            </div>
          </div>

          {/* Description */}
          <p style={{
            fontSize: '0.95rem',
            lineHeight: '1.6',
            marginBottom: '1.25rem',
            opacity: 0.95,
            fontWeight: '400',
          }}>
            Chat with my AI Assistant to learn about my experience, skills, and how I can contribute to your team. Get instant answers to all your questions!
          </p>

          {/* Features */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '0.5rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '500',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              ⚡ Instant Responses
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '0.5rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '500',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              🎯 Detailed Analysis
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '0.5rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '500',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              🤖 AI-Powered
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleStartConversation}
            className="hr-popup-button"
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#667eea',
              fontWeight: '700',
              fontSize: '1rem',
              padding: '1rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              zIndex: 1,
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            }}
          >
            <span style={{ position: 'relative', zIndex: 2 }}>Start Conversation</span>
            <FiArrowRight size={20} style={{ position: 'relative', zIndex: 2 }} />
          </button>

          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '100px',
            height: '100px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            filter: 'blur(30px)',
          }}></div>
        </div>
      </div>
    </>
  );
};

export default HRPopup;
