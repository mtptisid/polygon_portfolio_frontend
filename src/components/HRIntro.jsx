import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FiTarget, FiMessageSquare, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import profileImg from '../assets/siddharamayya_image.jpeg';
import resumeImg from '../assets/my_resume.png';
import githubImg from '../assets/my_github_ss.png';

const SUBTITLES = [
  'Senior AI Engineer @ Maveric Systems',
  '5+ Years Building Production LLM Systems',
  'LangGraph · Multi-Agent AI · RAG Pipelines',
  'AWS Bedrock · GCP · Azure · MLOps',
];

const SKILLS = [
  'Python', 'LangChain', 'LangGraph', 'AutoGen', 'RAG', 'LLMs',
  'AWS Bedrock', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'FastAPI',
  'MLOps', 'TensorRT', 'Multi-Agent Systems',
];

const STATS = [
  { value: '5+', label: 'Years Experience' },
  { value: '20+', label: 'Projects Shipped' },
  { value: '10+', label: 'AI Systems in Prod' },
];

const FEATURES = [
  {
    icon: FiTarget,
    title: 'Purpose',
    desc: "Skip the resume back-and-forth — ask direct questions about my experience, skills, and availability, and get instant, honest answers.",
  },
  {
    icon: FiMessageSquare,
    title: 'How It Works',
    desc: 'Share a few details about your company and the role, then chat naturally with an AI trained on my real projects and career history.',
  },
  {
    icon: FiTrendingUp,
    title: 'What You Get',
    desc: "When the conversation ends, you'll receive a summary and interest analysis — perfect for a quick, confident screening decision.",
  },
];

const HRIntro = ({ onComplete }) => {
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  useEffect(() => {
    const subtitleTimer = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % SUBTITLES.length);
    }, 1500);
    return () => clearInterval(subtitleTimer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Poppins", sans-serif',
      }}
    >
      <style>
        {`
          @keyframes hrGlowPulse {
            0%, 100% { box-shadow: 0 0 30px 10px rgba(102,126,234,0.5), 0 0 60px 20px rgba(118,75,162,0.3); }
            50% { box-shadow: 0 0 45px 18px rgba(102,126,234,0.7), 0 0 80px 30px rgba(118,75,162,0.5); }
          }
          @keyframes hrFloat {
            0%, 100% { transform: translateY(0) rotate(var(--rot, 0deg)); }
            50% { transform: translateY(-14px) rotate(var(--rot, 0deg)); }
          }
          @keyframes hrOrbBlob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(40px, -30px) scale(1.15); }
          }
          @keyframes hrMarquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          @keyframes hrRingSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes hrFeatureGlow {
            0%, 100% { border-color: rgba(255,255,255,0.14); }
            50% { border-color: rgba(129,140,248,0.5); }
          }
          .hr-intro-ring {
            position: absolute;
            inset: -8px;
            border-radius: 50%;
            background: conic-gradient(from 0deg, #667eea, #764ba2, #06b6d4, #667eea);
            animation: hrRingSpin 6s linear infinite;
            z-index: -1;
          }
          .hr-intro-eyebrow {
            text-transform: uppercase;
            letter-spacing: 0.25em;
            font-size: 0.75rem;
            font-weight: 600;
            color: #818cf8;
            margin: 0 0 1.5rem;
          }
          .hr-intro-stat {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hr-intro-stat strong {
            color: #ffffff;
            font-size: 1.4rem;
            font-weight: 700;
          }
          .hr-intro-stat span {
            color: #94a3b8;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .hr-intro-orb-1 {
            position: absolute; top: -100px; left: -100px; width: 400px; height: 400px;
            border-radius: 50%; background: rgba(102,126,234,0.25); filter: blur(80px);
            animation: hrOrbBlob 8s ease-in-out infinite;
          }
          .hr-intro-orb-2 {
            position: absolute; bottom: -120px; right: -100px; width: 450px; height: 450px;
            border-radius: 50%; background: rgba(118,75,162,0.25); filter: blur(90px);
            animation: hrOrbBlob 10s ease-in-out infinite reverse;
          }
          .hr-intro-avatar {
            animation: hrGlowPulse 3s ease-in-out infinite;
          }
          .hr-intro-card-resume {
            --rot: -8deg;
            animation: hrFloat 4.5s ease-in-out infinite;
          }
          .hr-intro-card-github {
            --rot: 6deg;
            animation: hrFloat 5.5s ease-in-out infinite 0.4s;
          }
          .hr-intro-marquee-track {
            display: flex;
            width: max-content;
            gap: 0.75rem;
            animation: hrMarquee 18s linear infinite;
          }
          .hr-intro-skill-chip {
            white-space: nowrap;
            padding: 0.5rem 1.1rem;
            border-radius: 999px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.18);
            color: #e0e7ff;
            font-size: 0.85rem;
            font-weight: 500;
            backdrop-filter: blur(4px);
          }
          .hr-intro-feature {
            display: flex;
            gap: 1rem;
            align-items: flex-start;
            padding: 1.1rem 1.25rem;
            border-radius: 16px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.14);
            backdrop-filter: blur(6px);
            animation: hrFeatureGlow 3.5s ease-in-out infinite;
          }
          .hr-intro-feature-icon {
            flex-shrink: 0;
            width: 42px;
            height: 42px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: #ffffff;
          }
          .hr-intro-divider {
            width: 1px;
            align-self: stretch;
            background: linear-gradient(180deg, transparent, rgba(255,255,255,0.2), transparent);
          }
          .hr-intro-continue-btn {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.9rem 2.2rem;
            border-radius: 999px;
            border: none;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: #ffffff;
            font-size: 1rem;
            font-weight: 600;
            font-family: "Poppins", sans-serif;
            cursor: pointer;
            box-shadow: 0 12px 30px rgba(102,126,234,0.45);
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }
          .hr-intro-continue-btn:hover {
            transform: translateY(-3px) scale(1.03);
            box-shadow: 0 16px 36px rgba(102,126,234,0.6);
          }
          @media (max-width: 900px) {
            .hr-intro-cards { display: none !important; }
            .hr-intro-divider { display: none !important; }
          }
        `}
      </style>

      <div className="hr-intro-orb-1" />
      <div className="hr-intro-orb-2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 10,
        }}
      >
        <button className="hr-intro-continue-btn" onClick={onComplete}>
          Continue to the Conversation
          <FiArrowRight size={18} />
        </button>
      </motion.div>

      <div style={{
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3rem',
        maxWidth: '1300px',
        width: '100%',
        padding: '5rem 2rem 6rem',
        flexWrap: 'wrap',
      }}>
        {/* Left: Avatar + Name + Skills + Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.25rem', flex: '1 1 460px' }}>
          <motion.p
            className="hr-intro-eyebrow"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI-Powered HR Assistant
          </motion.p>

          <motion.div
            className="hr-intro-avatar"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'backOut' }}
            style={{
              position: 'relative',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid rgba(255,255,255,0.6)',
            }}
          >
            <span className="hr-intro-ring" />
            <img src={profileImg} alt="Siddharamayya Mathapati" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 style={{ color: '#ffffff', fontSize: '2.2rem', fontWeight: 700, margin: 0 }}>
              Siddharamayya Mathapati
            </h1>
            <div style={{ height: '1.6rem', marginTop: '0.5rem' }}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={subtitleIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  style={{ color: '#a5b4fc', fontSize: '1rem', fontWeight: 500, margin: 0 }}
                >
                  {SUBTITLES[subtitleIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ display: 'flex', gap: '1rem' }}
          >
            <a href="https://github.com/mtptisid" target="_blank" rel="noopener noreferrer" style={{ color: '#e2e8f0' }} aria-label="GitHub">
              <FaGithub size={22} />
            </a>
            <a href="https://www.linkedin.com/in/siddharamayya-mathapati" target="_blank" rel="noopener noreferrer" style={{ color: '#e2e8f0' }} aria-label="LinkedIn">
              <FaLinkedin size={22} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{ display: 'flex', gap: '2rem' }}
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="hr-intro-stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ width: '100%', maxWidth: '420px', overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)' }}
          >
            <div className="hr-intro-marquee-track">
              {[...SKILLS, ...SKILLS].map((skill, idx) => (
                <span key={idx} className="hr-intro-skill-chip">{skill}</span>
              ))}
            </div>
          </motion.div>

          {/* Resume + GitHub preview cards */}
          <div className="hr-intro-cards" style={{ position: 'relative', width: '100%', maxWidth: '380px', height: '220px', marginTop: '1rem' }}>
            <motion.div
              className="hr-intro-card-resume"
              initial={{ opacity: 0, x: -40, rotate: -8 }}
              animate={{ opacity: 1, x: 0, rotate: -8 }}
              transition={{ delay: 0.9, duration: 0.7, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: '20px',
                top: 0,
                width: '160px',
                height: '210px',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '3px solid rgba(255,255,255,0.9)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.55)',
              }}
            >
              <img src={resumeImg} alt="Resume preview" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </motion.div>

            <motion.div
              className="hr-intro-card-github"
              initial={{ opacity: 0, x: 40, y: 20, rotate: 6 }}
              animate={{ opacity: 1, x: 0, y: 40, rotate: 6 }}
              transition={{ delay: 1.1, duration: 0.7, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                right: '10px',
                top: 0,
                width: '190px',
                height: '150px',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '3px solid rgba(255,255,255,0.9)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.55)',
              }}
            >
              <img src={githubImg} alt="GitHub profile preview" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </motion.div>
          </div>
        </div>

        <div className="hr-intro-divider" />

        {/* Right: Purpose & how it works */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', flex: '1 1 420px', maxWidth: '460px' }}>
          <motion.p
            className="hr-intro-eyebrow"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ margin: 0 }}
          >
            About This Experience
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ color: '#ffffff', fontSize: '1.6rem', fontWeight: 700, margin: 0, lineHeight: 1.3 }}
          >
            Why Talk to My AI Assistant?
          </motion.h2>

          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="hr-intro-feature"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.25, duration: 0.6, ease: 'easeOut' }}
              >
                <span className="hr-intro-feature-icon"><Icon size={20} /></span>
                <div>
                  <p style={{ color: '#ffffff', fontWeight: 600, margin: '0 0 0.3rem', fontSize: '0.95rem' }}>{feature.title}</p>
                  <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem', lineHeight: 1.5 }}>{feature.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default HRIntro;
