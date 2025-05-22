import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiInbox } from 'react-icons/fi';
import { FaUser, FaLinkedin, FaMedium, FaGithub, FaInstagram, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import $ from 'jquery';

const ContactPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    $('#message-warning').hide();
    $('#message-success').hide();
    $('#submit-loader').hide();

    const handleSubmit = (event) => {
      event.preventDefault();
      $('#message-warning').hide();
      $('#message-success').hide();
      $('#submit-loader').show();

      const formData = {
        name: $('#contactName').val()?.trim() || '',
        email: $('#contactEmail').val()?.trim() || '',
        subject: $('#contactSubject').val()?.trim() || 'Contact Form Submission',
        message: $('#contactMessage').val()?.trim() || '',
        honeypot: $('#honeypot').val()?.trim() || '' // Reverted to match server expectation
      };

      // Log payload for debugging
      console.log('Sending payload:', formData);

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
        $('#message-warning').find('span').text('Spam detected. Please try again.');
        $('#message-warning').show();
        setTimeout(() => $('#message-warning').fadeOut('slow'), 5000);
        return;
      }

      $.ajax({
        url: 'https://portpoliosid.onrender.com/contact',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: () => {
          $('#submit-loader').hide();
          $('#message-success').show();
          $('#contactForm')[0].reset();
          setTimeout(() => $('#message-success').fadeOut('slow'), 5000);
        },
        error: (xhr, status, error) => {
          $('#submit-loader').hide();
          // Enhanced error handling
          let errorMessage = 'Failed to send message. Please try again later.';
          if (xhr.status === 400) {
            errorMessage = xhr.responseJSON?.detail || 'Invalid input. Please check your form data.';
          } else if (xhr.status === 500) {
            errorMessage = 'Server error. Please try again later or contact support.';
          }
          $('#message-warning').find('span').text(errorMessage);
          $('#message-warning').show();
          setTimeout(() => $('#message-warning').fadeOut('slow'), 5000);
          // Log error details for debugging
          console.error('AJAX Error:', {
            status: xhr.status,
            error,
            response: xhr.responseJSON,
            responseText: xhr.responseText
          });
        }
      });
    };

    $('#contactForm').on('submit', handleSubmit);

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
            margin: 0;
            padding: 0;
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
            padding: clamp(6rem, 10vh, 10rem) 1rem clamp(4rem, 8vh, 6rem);
            min-height: calc(100vh - 60px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            position: relative;
            zIndex: 1;
          }
          .row.section-intro {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            width: 100%;
            max-width: clamp(700px, 80vw, 1200px);
            margin: 0 auto 2rem;
          }
          .row.section-intro h1 {
            color: #FFFFFF;
            font-family: "poppins-bold", sans-serif;
            font-size: clamp(2rem, 4vw, 3.5rem);
            font-weight: 700;
            margin-bottom: 1rem;
            animation: slideUp 0.5s ease-out;
          }
          .row.section-intro h5 {
            color: #07b1d0;
            font-family: "poppins-bold", sans-serif;
            font-size: clamp(1.2rem, 2.5vw, 1.8rem);
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 0.5rem;
            animation: slideUp 0.5s ease-out 0.2s;
            animation-fill-mode: both;
          }
          .row.section-intro p {
            color: rgba(255, 255, 255, 0.7);
            font-size: clamp(1rem, 2vw, 1.3rem);
            margin: 0;
          }
          .row.contact-form {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            max-width: clamp(700px, 80vw, 1200px);
            margin: 0 auto 1.5rem;
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
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            background: transparent;
            border: none !important;
          }
          .contact-form .form-field.submit-field {
            margin-top: 1.5rem;
            box-shadow: none;
          }
          .contact-form input[type="text"],
          .contact-form input[type="email"],
          .contact-form textarea {
            width: 100%;
            height: clamp(3.5rem, 8vw, 4rem);
            padding: 0.8rem;
            font-family: "poppins-regular", sans-serif;
            font-size: clamp(1.1rem, 2.5vw, 1.4rem);
            color: rgba(255, 255, 255, 0.7);
            background: rgba(255, 255, 255, 0.05);
            border: none !important;
            border-radius: 4px;
            transition: all 0.3s ease;
            outline: none;
          }
          .contact-form textarea {
            height: auto;
            min-height: clamp(8rem, 15vh, 12rem);
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
            font-size: clamp(1.1rem, 2.5vw, 1.4rem);
            letter-spacing: 0.2rem;
            height: clamp(3.5rem, 8vw, 4rem);
            line-height: clamp(3.5rem, 8vw, 4rem);
            padding: 0;
            margin: 0;
            width: 100%;
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
            align-items: center;
            width: 100%;
            max-width: clamp(700px, 80vw, 1200px);
            margin: 1rem auto;
          }
          #message-warning,
          #message-success {
            display: none;
            width: 100%;
            max-width: clamp(300px, 50vw, 400px);
            margin: 0 auto;
            font-size: clamp(1.1rem, 2.5vw, 1.5rem);
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
            font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          }
          #submit-loader {
            display: none;
            position: relative;
            width: 100%;
            text-align: center;
            margin-top: 1rem;
          }
          #submit-loader .text-loader {
            display: block;
            font-family: "poppins-bold", sans-serif;
            color: #FFFFFF;
            letter-spacing: 0.3rem;
            text-transform: uppercase;
            font-size: clamp(0.9rem, 2vw, 1.2rem);
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
            width: 100%;
            max-width: clamp(700px, 80vw, 1200px);
            margin: clamp(1.5rem, 3vh, 2rem) auto;
            text-align: center;
          }
          .footer-social {
            display: flex;
            flex-direction: row;
            gap: clamp(1rem, 3vw, 1.5rem);
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
            width: clamp(2.5rem, 5vw, 3rem);
            height: clamp(2.5rem, 5vw, 3rem);
          }
          .footer-social li a:hover {
            color: #07b1d0;
            transform: scale(1.1);
          }
          .row.contact-info {
            margin: clamp(2rem, 5vh, 3rem) auto 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: flex-start;
            width: 100%;
            max-width: clamp(900px, 90vw, 1400px);
          }
          .contact-info .col-four {
            flex: 1 1 clamp(250px, 30%, 400px);
            max-width: clamp(250px, 30%, 400px);
            padding: 0 clamp(0.5rem, 2vw, 1rem);
            text-align: center;
            margin-bottom: 2rem;
          }
          .contact-info .icon {
            margin-bottom: 1.5rem;
          }
          .contact-info .icon i {
            font-size: clamp(2.5rem, 5vw, 4.2rem);
            color: #FFFFFF;
          }
          .contact-info h5 {
            color: #07b1d0;
            font-family: "poppins-bold", sans-serif;
            font-size: clamp(1.2rem, 2.5vw, 1.5rem);
            margin-bottom: 1rem;
          }
          .contact-info p {
            color: rgba(255, 255, 255, 0.7);
            font-family: "poppins-regular", sans-serif;
            font-size: clamp(0.9rem, 2vw, 1.2rem);
          }
          @media (min-width: 1200px) {
            #contact {
              padding: clamp(8rem, 12vh, 12rem) 2rem clamp(5rem, 10vh, 8rem);
            }
            .row.section-intro,
            .row.contact-form,
            .row.message-row,
            .row.social {
              max-width: clamp(900px, 80vw, 1400px);
            }
            .row.contact-info {
              max-width: clamp(1000px, 90vw, 1600px);
            }
          }
          @media (min-width: 992px) and (max-width: 1199px) {
            .row.section-intro,
            .row.contact-form,
            .row.message-row,
            .row.social {
              max-width: clamp(700px, 85vw, 1000px);
            }
            .row.contact-info {
              max-width: clamp(800px, 90vw, 1200px);
            }
            .contact-info .col-four {
              flex: 1 1 clamp(200px, 45%, 350px);
              max-width: clamp(200px, 45%, 350px);
            }
          }
          @media (max-width: 991px) {
            .contact-info .col-four {
              flex: 1 1 clamp(200px, 45%, 350px);
              max-width: clamp(200px, 45%, 350px);
            }
          }
          @media (max-width: 767px) {
            #contact {
              padding: clamp(4rem, 8vh, 6rem) 0.5rem clamp(2rem, 5vh, 3rem);
            }
            .row.section-intro,
            .row.contact-form,
            .row.message-row,
            .row.social {
              width: 95%;
              max-width: 700px;
            }
            .row.section-intro h1 {
              font-size: clamp(1.5rem, 5vw, 2rem);
            }
            .row.section-intro h5 {
              font-size: clamp(1rem, 3vw, 1.2rem);
            }
            .contact-form input[type="text"],
            .contact-form input[type="email"] {
              height: clamp(3rem, 8vw, 3.6rem);
              font-size: clamp(1rem, 2.5vw, 1.2rem);
              padding: 0.6rem;
            }
            .contact-form textarea {
              min-height: clamp(6rem, 15vh, 8rem);
              font-size: clamp(1rem, 2.5vw, 1.2rem);
            }
            .contact-form button.submitform {
              height: clamp(3rem, 8vw, 3.6rem);
              line-height: clamp(3rem, 8vw, 3.6rem);
              font-size: clamp(1rem, 2.5vw, 1.2rem);
            }
            #message-warning,
            #message-success {
              font-size: clamp(1rem, 2.5vw, 1.2rem);
              max-width: clamp(250px, 80vw, 300px);
              text-shadow: 0 0 6px rgba(250, 0, 3, 0.5);
            }
            #message-success {
              text-shadow: 0 0 6px rgba(7, 177, 208, 0.5);
            }
            #message-warning i,
            #message-success i {
              font-size: clamp(1rem, 2.5vw, 1.2rem);
            }
            .row.social {
              margin: clamp(1rem, 2vh, 1.5rem) auto;
            }
            .footer-social {
              gap: clamp(0.8rem, 2vw, 1rem);
            }
            .footer-social li a {
              width: clamp(2rem, 5vw, 2.5rem);
              height: clamp(2rem, 5vw, 2.5rem);
            }
            .row.contact-info {
              margin: clamp(1.5rem, 3vh, 2rem) auto 0;
            }
            .contact-info .col-four {
              flex: 1 1 100%;
              max-width: 100%;
              margin-bottom: 1.5rem;
            }
            .contact-info .icon i {
              font-size: clamp(2rem, 5vw, 3rem);
            }
            .contact-info h5 {
              font-size: clamp(1rem, 2.5vw, 1.2rem);
            }
            .contact-info p {
              font-size: clamp(0.8rem, 2vw, 1rem);
            }
          }
          @media (max-width: 480px) {
            #contact {
              padding: clamp(3rem, 6vh, 5rem) 0.5rem clamp(1.5rem, 4vh, 2rem);
            }
            .row.section-intro h1 {
              font-size: clamp(1.2rem, 4vw, 1.5rem);
            }
            .row.section-intro h5 {
              font-size: clamp(0.8rem, 3vw, 0.9rem);
            }
            .contact-form input[type="text"],
            .contact-form input[type="email"],
            .contact-form textarea {
              font-size: clamp(0.9rem, 2.5vw, 1rem);
            }
            .contact-form button.submitform {
              font-size: clamp(0.9rem, 2.5vw, 1rem);
            }
            .contact-info .icon i {
              font-size: clamp(1.8rem, 5vw, 2.5rem);
            }
            .row.social {
              margin: clamp(0.8rem, 2vh, 1rem) auto;
            }
            .footer-social li a {
              width: clamp(1.8rem, 5vw, 2rem);
              height: clamp(1.8rem, 5vw, 2rem);
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
                  aria-label="Your Name"
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
                  aria-label="Your Email"
                />
              </div>
              <div className="form-field">
                <input
                  name="contactSubject"
                  type="text"
                  id="contactSubject"
                  placeholder="Subject"
                  defaultValue=""
                  aria-label="Subject"
                />
              </div>
              <div className="form-field">
                <textarea
                  name="contactMessage"
                  id="contactMessage"
                  placeholder="Message"
                  rows="5"
                  required
                  aria-label="Your Message"
                ></textarea>
              </div>
              <div className="form-field" style={{ display: 'none' }}>
                <input
                  name="honeypot"
                  type="text"
                  id="honeypot"
                  aria-hidden="true"
                />
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
              <a href="https://www.linkedin.com/in/siddharamayya-mathapati" aria-label="LinkedIn Profile">
                <FaLinkedin size={30} />
              </a>
            </li>
            <li>
              <a href="https://medium.com/@msidrm455" aria-label="Medium Profile">
                <FaMedium size={30} />
              </a>
            </li>
            <li>
              <a href="https://github.com/mtptisid" aria-label="GitHub Profile">
                <FaGithub size={30} />
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/its_5id" aria-label="Instagram Profile">
                <FaInstagram size={30} />
              </a>
            </li>
          </ul>
        </div>
        <div className="row contact-info">
          <div className="col-four">
            <div className="icon">
              <i className="fa fa-map-marker" aria-hidden="true"></i>
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
              <i className="fa fa-envelope" aria-hidden="true"></i>
            </div>
            <h5>Email Me At</h5>
            <p>me@siddharamayya.in</p>
          </div>
          <div className="col-four">
            <div className="icon">
              <i className="fa fa-phone" aria-hidden="true"></i>
            </div>
            <h5>Call Me At</h5>
            <p>Phone: (+91) 97406 71620</p>
          </div>
        </div>
      </section>
      <footer style={{ backgroundColor: '#daebdd', color: '#000000', padding: '0.1rem 0' }}>
        <div style={{ maxWidth: '896px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.2rem', fontWeight: '300' }}>© 2025 Siddharamayya M. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
