import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiInbox } from 'react-icons/fi';
import { FaUser, FaLinkedin, FaMedium, FaGithub, FaInstagram, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import $ from 'jquery';

const ContactPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure jQuery is loaded
    if (!window.jQuery) {
      console.error('jQuery is not loaded. Please ensure it is included in your project.');
      return;
    }

    // Hide messages initially
    $('#message-warning').hide();
    $('#message-success').hide();
    $('#submit-loader').hide();

    const handleSubmit = (event) => {
      event.preventDefault();
      $('#message-warning').hide();
      $('#message-success').hide();
      $('#submit-loader').show();

      const formData = {
        name: $('#contactName').val().trim(),
        email: $('#contactEmail').val().trim(),
        subject: $('#contactSubject').val().trim() || 'Contact Form Submission',
        message: $('#contactMessage').val().trim(),
        honeypot: $('#honeypot').val()
      };

      // Client-side validation
      if (!formData.name || formData.name.length < 2) {
        $('#submit-loader').hide();
        $('#message-warning').find('span').text('Please enter a valid name (at least 2 characters)');
        $('#message-warning').show();
        setTimeout(() => $('#message-warning').fadeOut('slow'), 5000);
        return;
      }
      if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
        $('#submit-loader').hide();
        $('#message-warning').find('span').text('Please enter a valid email address');
        $('#message-warning').show();
        setTimeout(() => $('#message-warning').fadeOut('slow'), 5000);
        return;
      }
      if (!formData.message) {
        $('#submit-loader').hide();
        $('#message-warning').find('span').text('Please enter a message');
        $('#message-warning').show();
        setTimeout(() => $('#message-warning').fadeOut('slow'), 5000);
        return;
      }
      if (formData.honeypot) {
        $('#submit-loader').hide();
        $('#message-warning').find('span').text('Bot detected. Please try again.');
        $('#message-warning').show();
        setTimeout(() => $('#message-warning').fadeOut('slow'), 5000);
        return;
      }

      // AJAX request with timeout and detailed error handling
      $.ajax({
        url: 'https://portpoliosid.onrender.com/contact',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        timeout: 10000, // 10-second timeout
        success: () => {
          $('#submit-loader').hide();
          $('#message-success').show();
          $('#contactForm')[0].reset();
          setTimeout(() => $('#message-success').fadeOut('slow'), 5000);
        },
        error: (xhr, status, error) => {
          $('#submit-loader').hide();
          console.error('AJAX Error:', { status, error, xhr });
          const errorMessage =
            xhr.responseJSON?.detail ||
            (status === 'timeout' ? 'Request timed out. Please try again.' : 'Failed to send message. Please try again later.');
          $('#message-warning').find('span').text(errorMessage);
          $('#message-warning').show();
          setTimeout(() => $('#message-warning').fadeOut('slow'), 5000);
        }
      });
    };

    $('#contactForm').on('submit', handleSubmit);

    // Cleanup event listener
    return () => {
      $('#contactForm').off('submit', handleSubmit);
    };
  }, []);

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
      padding: '0 0.75rem',
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
            padding: 12rem 1rem 7.2rem;
            position: relative;
            zIndex: 1;
          }
          .row.section-intro {
            display: flex;
            justify-content: center;
            text-align: center;
            max-width: 740px;
            margin: 0 auto 3rem;
          }
          .row.section-intro h1 {
            color: #FFFFFF;
            font-family: "poppins-bold", sans-serif;
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 1rem;
            animation: slideUp 0.5s ease-out;
          }
          .row.section-intro h5 {
            color: #07b1d0;
            font-family: "poppins-bold", sans-serif;
            font-size: 1.5rem;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 0.5rem;
            animation: slideUp 0.5s ease-out 0.2s;
            animation-fill-mode: both;
          }
          .row.section-intro p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 1.2rem;
            margin: 0;
          }
          .row.contact-form {
            display: flex;
            justify-content: center;
            max-width: 740px;
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
            margin-bottom: 0;
            padding-bottom: 0.5rem;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            background: transparent;
            border: none !important;
          }
          .contact-form .form-field.submit-field {
            margin-top: 1rem;
            padding-bottom: 0;
            box-shadow: none;
          }
          .contact-form input[type="text"],
          .contact-form input[type="email"],
          .contact-form textarea {
            width: 100%;
            height: 4rem;
            padding: 0;
            font-family: "poppins-regular", sans-serif;
            font-size: 1.4rem;
            color: rgba(255, 255, 255, 0.7);
            background: rgba(255, 255, 255, 0.05);
            border: none !important;
            border-radius: 4px;
            transition: all 0.3s ease;
            outline: none;
            line-height: 4rem;
            vertical-align: middle;
          }
          .contact-form textarea {
            height: auto;
            min-height: 10rem;
            resize: vertical;
            line-height: 1.5;
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
            font-size: 1.4rem;
            letter-spacing: 0.2rem;
            height: 4rem;
            line-height: 4rem;
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
            max-width: 740px;
            margin: 0.5rem auto;
          }
          #message-warning,
          #message-success {
            display: none;
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
            font-size: 1.5rem;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: slideUp 0.5s ease-out;
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
            margin-right: 0.5rem;
            font-size: 1.5rem;
          }
          #submit-loader {
            display: none;
            position: relative;
            width: 100%;
            text-align: center;
            margin-top: 1rem;
          }
          #submit-loader .text-loader {
            display: none;
            font-family: "poppins-bold", sans-serif;
            color: #FFFFFF;
            letter-spacing: 0.3rem;
            text-transform: uppercase;
          }
          .s-loader {
            margin: 1.2rem auto;
            width: 70px;
            text-align: center;
            transform: translateX(0.45rem);
          }
          .s-loader > div {
            width: 1rem;
            height: 1rem;
            background-color: #FFFFFF;
            border-radius: 100%;
            display: inline-block;
            margin-right: 0.9rem;
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
            margin: 2rem auto;
            max-width: 740px;
            text-align: center;
          }
          .footer-social {
            display: flex;
            flex-direction: row;
            gap: 1.5rem;
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
            width: 3rem;
            height: 3rem;
          }
          .footer-social li a:hover {
            color: #07b1d0;
            transform: scale(1.1);
          }
          .row.contact-info {
            margin: 4.8rem auto 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            max-width: 1200px;
          }
          .contact-info .col-four {
            flex: 0 0 33.333333%;
            max-width: 33.333333%;
            padding: 0 1rem;
            text-align: center;
          }
          .contact-info .icon {
            margin-bottom: 2.1rem;
          }
          .contact-info .icon i {
            font-size: 4.2rem;
            color: #FFFFFF;
          }
          .contact-info h5 {
            color: #07b1d0;
            font-family: "poppins-bold", sans-serif;
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }
          .contact-info p {
            color: rgba(255, 255, 255, 0.7);
            font-family: "poppins-regular", sans-serif;
            font-size: 1.2rem;
          }
          @media (max-width: 767px) {
            .navbar {
              padding: 0.75rem;
              justify-content: space-between;
            }
            .row.section-intro {
              max-width: 90%;
            }
            .row.section-intro h1 {
              font-size: 2rem;
            }
            .row.section-intro h5 {
              font-size: 1.2rem;
            }
            .row.contact-form {
              max-width: 90%;
            }
            .row.message-row {
              max-width: 90%;
            }
            .contact-form input[type="text"],
            .contact-form input[type="email"] {
              height: 3.6rem;
              font-size: 1.2rem;
              line-height: 3.6rem;
            }
            .contact-form textarea {
              min-height: 8rem;
              font-size: 1.2rem;
            }
            .contact-form button.submitform {
              height: 3.6rem;
              line-height: 3.6rem;
              font-size: 1.2rem;
            }
            #message-warning,
            #message-success {
              font-size: 1.2rem;
              max-width: 280px;
              text-shadow: 0 0 6px rgba(250, 0, 3, 0.5);
            }
            #message-success {
              text-shadow: 0 0 6px rgba(7, 177, 208, 0.5);
            }
            #message-warning i,
            #message-success i {
              font-size: 1.2rem;
            }
            .row.social {
              margin: 1.5rem auto;
            }
            .footer-social {
              gap: 1rem;
            }
            .footer-social li a {
              width: 2.5rem;
              height: 2.5rem;
            }
            .row.contact-info {
              margin: 3rem auto 0;
            }
            .contact-info .col-four {
              flex: 0 0 100%;
              max-width: 100%;
              margin-bottom: 2rem;
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
              padding: 0.5rem;
            }
            .row.section-intro h1 {
              font-size: 1.5rem;
            }
            .row.section-intro h5 {
              font-size: 0.9rem;
            }
            .contact-info .icon i {
              font-size: 2.5rem;
            }
            .row.social {
              margin: 1rem auto;
            }
            .footer-social li a {
              width: 2rem;
              height: 2rem;
            }
          }
        `}
      </style>
      <nav style={styles.navbar}>
        <div className="mobile-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <button
            style={styles.mobileNavLink}
            onClick={handleBackClick}
            onMouseEnter={(e) => e.target.style.color = '#63b3ed'}
            onMouseLeave={(e) => e.target.style.color = '#edf2f7'}
            aria-label="Back to Projects"
          >
            <FiArrowLeft size={24} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a
              href="/"
              style={styles.mobileNavLink}
              onMouseEnter={(e) => e.target.style.color = '#63b3ed'}
              onMouseLeave={(e) => e.target.style.color = '#edf2f7'}
              aria-label="Home"
            >
              <FiHome size={24} />
            </a>
            <a
              href="https://portfolio.siddharamayya.in/"
              style={styles.mobileNavLink}
              onMouseEnter={(e) => e.target.style.color = '#63b3ed'}
              onMouseLeave={(e) => e.target.style.color = '#edf2f7'}
              aria-label="Contact"
            >
              <FaUser size={24} />
            </a>
            <button
              style={styles.mobileNavLink}
              onClick={handleAdminMailClick}
              onMouseEnter={(e) => e.target.style.color = '#63b3ed'}
              onMouseLeave={(e) => e.target.style.color = '#edf2f7'}
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
          <form name="contactForm" id="contactForm" method="post" className="contact-form">
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
                  id="contactMessage" // Fixed typo: was "id essay"
                  placeholder="message"
                  rows="5"
                  required
                ></textarea>
              </div>
              <div className="form-field" style={{ display: 'none' }}>
                <input name="honeypot" type="text" id="honeypot" />
              </div>
              <div className="form-field submit-field">
                <button className="submitform">Submit</button>
                <div id="submit-loader">
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
          <div id="message-warning">
            <FaExclamationTriangle />
            <span></span>
          </div>
          <div id="message-success">
            <FaCheck />
            Your message was sent, thank you!
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
      <footer style={{ backgroundColor: '#daebdd', color: '#000000', padding: '0.1rem 0' }}>
        <div style={{ maxWidth: '896px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', fontWeight: '500' }}>© 2025 Siddharamayya M. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
