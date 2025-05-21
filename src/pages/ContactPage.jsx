import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiInbox } from 'react-icons/fi';
import { FaUser, FaLinkedin, FaMedium, FaGithub, FaInstagram, FaExclamationTriangle, FaCheck } from 'react-icons/fa';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

const ContactPage = () => {
  const navigate = useNavigate();
  const [messageWarning, setMessageWarning] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Ensure messages are hidden on mount
    setShowWarning(false);
    setShowSuccess(false);
    setIsLoading(false);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowWarning(false);
    setShowSuccess(false);
    setIsLoading(true);

    const formData = {
      name: event.target.contactName.value.trim(),
      email: event.target.contactEmail.value.trim(),
      subject: event.target.contactSubject.value.trim() || 'Contact Form Submission',
      message: event.target.contactMessage.value.trim(),
      honeypot: event.target.honeypot.value
    };

    // Client-side validation
    if (!formData.name || formData.name.length < 2) {
      setIsLoading(false);
      setMessageWarning('Please enter a valid name (at least 2 characters)');
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
      return;
    }
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      setIsLoading(false);
      setMessageWarning('Please enter a valid email address');
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
      return;
    }
    if (!formData.message) {
      setIsLoading(false);
      setMessageWarning('Please enter a message');
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
      return;
    }
    if (formData.honeypot) {
      setIsLoading(false);
      setMessageWarning('Bot detected. Please try again.');
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
      return;
    }

    try {
      const response = await fetch('https://portpoliosid.onrender.com/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsLoading(false);
        setShowSuccess(true);
        event.target.reset();
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send message');
      }
    } catch (error) {
      setIsLoading(false);
      setMessageWarning(error.message || 'Failed to send message. Please try again later.');
      setShowWarning(true);
      console.error('Form submission error:', error);
      setTimeout(() => setShowWarning(false), 5000);
    }
  };

  const handleBackClick = () => {
    navigate('/projects');
  };

  const handleAdminMailClick = () => {
    navigate('/sendmail');
  };

  const styles = {
    navbar: {
      position: 'fixed',
      width: '100vw',
      height: '60px',
      backgroundColor: '#404347',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      top: 0,
      zIndex: 101,
      boxSizing: 'border-box'
    },
    mobileNavLink: {
      color: '#edf2f7',
      cursor: 'pointer',
      transition: 'color 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem',
      backgroundColor: '#404347'
    }
  };

  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc', fontFamily: 'Inter, sans-serif' }}>
        <style>
          {`
            * {
              box-sizing: border-box;
            }
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-slideUp {
              animation: slideUp 0.5s ease-out forwards;
            }
            #contact {
              background: #151515;
              padding: 10rem 2rem 6rem;
              position: relative;
              zIndex: 1;
              min-height: calc(100vh - 60px);
            }
            .row.section-intro {
              display: flex;
              flex-direction: column;
              justify-content: center;
              text-align: center;
              max-width: 800px;
              margin: 0 auto 3rem;
            }
            .row.section-intro h1 {
              color: #FFFFFF;
              font-family: "poppins-bold", sans-serif;
              font-size: 3.5rem;
              font-weight: 700;
              margin-bottom: 1.5rem;
              animation: slideUp 0.5s ease-out;
            }
            .row.section-intro h5 {
              color: #07b1d0;
              font-family: "poppins-bold", sans-serif;
              font-size: 1.8rem;
              font-weight: 600;
              text-transform: uppercase;
              margin-bottom: 0.75rem;
              animation: slideUp 0.5s ease-out 0.2s;
              animation-fill-mode: both;
            }
            .row.section-intro p {
              color: rgba(255, 255, 255, 0.7);
              font-size: 1.3rem;
              margin: 0;
            }
            .row.contact-form {
              display: flex;
              justify-content: center;
              max-width: 800px;
              margin: 0 auto;
              background: transparent;
              border: none !important;
            }
            .contact-form {
              width: 100%;
              background: transparent;
              border: none !important;
              animation: slideUp 0.5s ease-out;
            }
            .contact-form form {
              margin: 0;
              background: transparent;
              border: none !important;
            }
            .contact-form fieldset {
              border: none !important;
              padding: 0;
            }
            .contact-form .form-field {
              position: relative;
              margin-bottom: 1rem;
              padding-bottom: 0.5rem;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              background: transparent;
              border: none !important;
            }
            .contact-form .form-field.submit-field {
              margin-top: 1.5rem;
              padding-bottom: 0;
              box-shadow: none;
            }
            .contact-form input[type="text"],
            .contact-form input[type="email"],
            .contact-form textarea {
              width: 100%;
              height: 4.5rem;
              padding: 0 1rem;
              font-family: "poppins-regular", sans-serif;
              font-size: 1.5rem;
              color: rgba(255, 255, 255, 0.7);
              background: rgba(255, 255, 255, 0.05);
              border: none !important;
              border-radius: 4px;
              transition: all 0.3s ease;
              outline: none;
              line-height: 4.5rem;
              vertical-align: middle;
            }
            .contact-form textarea {
              height: auto;
              min-height: 12rem;
              resize: vertical;
              line-height: 1.5;
              padding: 1rem;
            }
            .contact-form input[type="text"]:focus,
            .contact-form input[type="email"]:focus,
            .contact-form textarea:focus {
              background: rgba(255, 255, 255, 0.1);
              color: #FFFFFF;
              box-shadow: 0 0 8px rgba(7, 177, 208, 0.3);
            }
            .contact-form input[type="text"]::placeholder,
            .contact-form input[type="email"]::placeholder,
            .contact-form textarea::placeholder {
              color: rgba(255, 255, 255, 0.3);
              font-style: italic;
            }
            .contact-form button.submitform {
              font-family: "poppins-bold", sans-serif;
              font-size: 1.5rem;
              letter-spacing: 0.2rem;
              height: 4.5rem;
              line-height: 4.5rem;
              padding: 0;
              margin: 0;
              width: 100%;
              max-width: none;
              background: #07b1d0;
              color: #FFFFFF;
              border: none !important;
              border-radius: 4px;
              cursor: pointer;
              transition: background-color 0.3s ease, transform 0.3s ease;
            }
            .contact-form button.submitform:hover,
            .contact-form button.submitform:focus {
              background: #0cd2e8;
              transform: scale(1.02);
            }
            .row.message-row {
              display: flex;
              justify-content: center;
              max-width: 800px;
              margin: 1rem auto;
            }
            #message-warning,
            #message-success {
              display: none;
              width: 100%;
              max-width: 400px;
              margin: 0 auto;
              font-size: 1.6rem;
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
              animation: slideUp 0.5s ease-out;
            }
            #message-warning.show,
            #message-success.show {
              display: flex;
            }
            #message-warning {
              color: #fa0003;
              text-shadow: 0 0 8px rgba(250, 0, 3, 0.5);
            }
            #message-success {
              color: #07b1d0;
              text-shadow: 0 0 8px rgba(7, 177, 208, 0.5);
            }
            #message-warning i,
            #message-success i {
              margin-right: 0.75rem;
              font-size: 1.6rem;
            }
            #submit-loader {
              display: none;
              position: relative;
              width: 100%;
              text-align: center;
              margin-top: 1.5rem;
            }
            #submit-loader.show {
              display: block;
            }
            #submit-loader .text-loader {
              display: none;
              font-family: "poppins-bold", sans-serif;
              color: #FFFFFF;
              letter-spacing: 0.3rem;
              text-transform: uppercase;
            }
            .s-loader {
              margin: 1.5rem auto;
              width: 80px;
              text-align: center;
              transform: translateX(0.45rem);
            }
            .s-loader > div {
              width: 1.2rem;
              height: 1.2rem;
              background-color: #FFFFFF;
              border-radius: 100%;
              display: inline-block;
              margin-right: 1rem;
              animation: sk-bouncedelay 1.4s infinite ease-in-out both;
            }
            .s-loader .bounce1 {
              animation-delay: -0.32s;
            }
            .s-loader .bounce2 {
              animation-delay: -0.16s;
            }
            @keyframes sk-bouncedelay {
              0%, 80%, 100% {
                transform: scale(0);
              }
              40% {
                transform: scale(1);
              }
            }
            .row.social {
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 3rem auto;
              max-width: 800px;
              text-align: center;
            }
            .footer-social {
              display: flex;
              flex-direction: row;
              gap: 2rem;
              justify-content: center;
              align-items: center;
              list-style: none;
              padding: 0;
              margin: 0;
            }
            .footer-social li a {
              color: #FFFFFF;
              background: rgba(255, 255, 255, 0.05);
              border-radius: 50%;
              transition: all 0.3s ease;
              text-decoration: none;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 3.5rem;
              height: 3.5rem;
            }
            .footer-social li a:hover {
              color: #07b1d0;
              transform: scale(1.1);
            }
            .row.contact-info {
              margin: 5rem auto 0;
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              max-width: 1200px;
            }
            .contact-info .col-four {
              flex: 0 0 33.333333%;
              max-width: 33.333333%;
              padding: 0 1.5rem;
              text-align: center;
            }
            .contact-info .icon {
              margin-bottom: 2.5rem;
            }
            .contact-info .icon i {
              font-size: 4.5rem;
              color: #FFFFFF;
            }
            .contact-info h5 {
              color: #07b1d0;
              font-family: "poppins-bold", sans-serif;
              font-size: 1.8rem;
              margin-bottom: 1.2rem;
            }
            .contact-info p {
              color: rgba(255, 255, 255, 0.7);
              font-family: "poppins-regular", sans-serif;
              font-size: 1.3rem;
            }
            @media (max-width: 767px) {
              .navbar {
                padding: 0.5rem;
                height: 50px;
                justify-content: space-between;
              }
              .mobile-nav {
                flex-direction: row;
                gap: 0.25rem;
              }
              .mobile-nav-link {
                padding: 0.25rem;
              }
              #contact {
                padding: 6rem 1rem 4rem;
                min-height: calc(100vh - 50px);
              }
              .row.section-intro {
                max-width: 95%;
              }
              .row.section-intro h1 {
                font-size: 2rem;
              }
              .row.section-intro h5 {
                font-size: 1.2rem;
              }
              .row.section-intro p {
                font-size: 1rem;
              }
              .row.contact-form {
                max-width: 95%;
              }
              .contact-form input[type="text"],
              .contact-form input[type="email"] {
                height: 3.2rem;
                font-size: 1.1rem;
                line-height: 3.2rem;
                padding: 0 0.75rem;
              }
              .contact-form textarea {
                min-height: 8rem;
                font-size: 1.1rem;
                padding: 0.75rem;
              }
              .contact-form button.submitform {
                height: 3.2rem;
                line-height: 3.2rem;
                font-size: 1.1rem;
              }
              .row.message-row {
                max-width: 95%;
              }
              #message-warning,
              #message-success {
                font-size: 1.1rem;
                max-width: 90%;
                text-shadow: 0 0 6px rgba(250, 0, 3, 0.5);
              }
              #message-success {
                text-shadow: 0 0 6px rgba(7, 177, 208, 0.5);
              }
              #message-warning i,
              #message-success i {
                font-size: 1.1rem;
                margin-right: 0.5rem;
              }
              .row.social {
                margin: 1.5rem auto;
              }
              .footer-social {
                gap: 1rem;
                flex-wrap: wrap;
              }
              .footer-social li a {
                width: 2.5rem;
                height: 2.5rem;
              }
              .row.contact-info {
                margin: 2.5rem auto 0;
                flex-direction: column;
              }
              .contact-info .col-four {
                flex: 0 0 100%;
                max-width: 100%;
                margin-bottom: 2rem;
                padding: 0 0.75rem;
              }
              .contact-info .icon i {
                font-size: 3rem;
              }
              .contact-info h5 {
                font-size: 1.2rem;
              }
              .contact-info p {
                font-size: 1rem;
              }
            }
            @media (max-width: 480px) {
              .navbar {
                padding: 0.3rem;
                height: 48px;
              }
              .row.section-intro h1 {
                font-size: 1.8rem;
              }
              .row.section-intro h5 {
                font-size: 1rem;
              }
              .contact-form input[type="text"],
              .contact-form input[type="email"] {
                height: 3rem;
                font-size: 1rem;
                line-height: 3rem;
              }
              .contact-form textarea {
                min-height: 7rem;
                font-size: 1rem;
              }
              .contact-form button.submitform {
                height: 3rem;
                line-height: 3rem;
                font-size: 1rem;
              }
              .contact-info .icon i {
                font-size: 2.5rem;
              }
              .row.social {
                margin: 1rem auto;
              }
              .footer-social li a {
                width: 2.2rem;
                height: 2.2rem;
              }
            }
          `}
        </style>
        <nav style={styles.navbar}>
          <div className="mobile-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <button
              style={styles.mobileNavLink}
              onClick={handleBackClick}
              onMouseEnter={(e) => (e.target.style.color = '#63b3ed')}
              onMouseLeave={(e) => (e.target.style.color = '#edf2f7')}
              aria-label="Back to Projects"
            >
              <FiArrowLeft size={24} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <a
                href="/"
                style={styles.mobileNavLink}
                onMouseEnter={(e) => (e.target.style.color = '#63b3ed')}
                onMouseLeave={(e) => (e.target.style.color = '#edf2f7')}
                aria-label="Home"
              >
                <FiHome size={24} />
              </a>
              <a
                href="https://portfolio.siddharamayya.in/"
                style={styles.mobileNavLink}
                onMouseEnter={(e) => (e.target.style.color = '#63b3ed')}
                onMouseLeave={(e) => (e.target.style.color = '#edf2f7')}
                aria-label="Contact"
              >
                <FaUser size={24} />
              </a>
              <button
                style={styles.mobileNavLink}
                onClick={handleAdminMailClick}
                onMouseEnter={(e) => (e.target.style.color = '#63b3ed')}
                onMouseLeave={(e) => (e.target.style.color = '#edf2f7')}
                aria-label="Admin Mail"
              >
                <FiInbox size={24} />
              </button>
            </div>
          </div>
        </nav>
        <section id="contact">
          <div className="row section-intro">
            <h1>Looking forward to hear from you...</h1>
            <p className="lead"></p>
          </div>
          <div className="row contact-form">
            <form name="contactForm" id="contactForm" method="post" className="contact-form" onSubmit={handleSubmit}>
              <fieldset>
                <div className="form-field">
                  <input
                    name="contactName"
                    type="text"
                    id="contactName"
                    placeholder="Name"
                    defaultValue=""
                    minLength="2"
                    required
                  />
                </div>
                <div className="form-field">
                  <input
                    name="contactEmail"
                    type="email"
                    id="contactEmail"
                    placeholder="Email"
                    defaultValue=""
                    required
                  />
                </div>
                <div className="form-field">
                  <input
                    name="contactSubject"
                    type="text"
                    id="contactSubject"
                    placeholder="Subject"
                    defaultValue=""
                  />
                </div>
                <div className="form-field">
                  <textarea
                    name="contactMessage"
                    id="contactMessage"
                    placeholder="message"
                    rows="5"
                    required
                  ></textarea>
                </div>
                <div className="form-field" style={{ display: 'none' }}>
                  <input name="honeypot" type="text" id="honeypot" />
                </div>
                <div className="form-field submit-field">
                  <button className="submitform" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Submit'}
                  </button>
                  <div id="submit-loader" className={isLoading ? 'show' : ''}>
                    <div className="text-loader">Sending...</div>
                    <div className="s-loader">
                      <div className="bounce1"></div>
                      <div className="bounce2"></div>
                      <div className="bounce3"></div>
                    </div>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
          <div className="row message-row">
            <div id="message-warning" className={showWarning ? 'show' : ''}>
              <FaExclamationTriangle />
              <span>{messageWarning}</span>
            </div>
            <div id="message-success" className={showSuccess ? 'show' : ''}>
              <FaCheck />
              <span>Your message was sent, thank you!</span>
            </div>
          </div>
          <div className="row social">
            <ul className="footer-social">
              <li>
                <a href="https://www.linkedin.com/in/siddharamayya-mathapati">
                  <FaLinkedin size={30} />
                </a>
              </li>
              <li>
                <a href="https://medium.com/@msidrm455">
                  <FaMedium size={30} />
                </a>
              </li>
              <li>
                <a href="https://github.com/mtptisid">
                  <FaGithub size={30} />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/its_5id">
                  <FaInstagram size={30} />
                </a>
              </li>
            </ul>
          </div>
          <div className="row contact-info">
            <div className="col-four">
              <div className="icon">
                <i className="fa fa-map-marker"></i>
              </div>
              <h5>Where to find me</h5>
              <p>
                #372, Ward no 3<br />
                Yadur, Chikodi<br />
                Belagavi, Karnataka, India
              </p>
            </div>
            <div className="col-four">
              <div className="icon">
                <i className="fa fa-envelope"></i>
              </div>
              <h5>Email Me At</h5>
              <p>me@siddharamayya.in</p>
            </div>
            <div className="col-four">
              <div className="icon">
                <i className="fa fa-phone"></i>
              </div>
              <h5>Call Me At</h5>
              <p>Phone: (+91) 97406 71620</p>
            </div>
          </div>
        </section>
        <footer style={{ backgroundColor: '#daebdd', color: '#000000', padding: '0.5rem 0' }}>
          <div style={{ maxWidth: '896px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '1rem', fontWeight: '500' }}>© 2025 Siddharamayya M. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default ContactPage;
