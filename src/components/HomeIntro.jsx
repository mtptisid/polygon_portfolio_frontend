import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import profileImg from '../assets/siddharamayya_image.jpeg';

const DURATION_MS = 6500;

const HomeIntro = ({ onComplete }) => {
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Run once on mount so parent re-renders (carousel timers, resize, etc.) never reset the countdown
  useEffect(() => {
    const timer = setTimeout(() => onCompleteRef.current(), DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'linear-gradient(160deg, #030308 0%, #0a0a12 55%, #030308 100%)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Poppins", sans-serif',
      }}
    >
      {/* Fluid displacement filter used to make the brand text feel like it forms out of liquid */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="homeIntroFluid">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="7" result="noise">
            <animate attributeName="baseFrequency" values="0.09;0.02;0.001" dur="1.8s" begin="0.15s" fill="freeze" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="90" xChannelSelector="R" yChannelSelector="G">
            <animate attributeName="scale" values="90;45;0" dur="1.8s" begin="0.15s" fill="freeze" />
          </feDisplacementMap>
        </filter>
      </svg>

      <style>
        {`
          @keyframes homeIntroBlobA {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(70px, -50px) scale(1.25); }
          }
          @keyframes homeIntroBlobB {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-60px, 55px) scale(0.85); }
          }
          @keyframes homeIntroBlobC {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(45px, 35px) scale(1.15); }
          }
          @keyframes homeIntroGradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .home-intro-goo-wrap {
            position: absolute;
            inset: 0;
            filter: blur(70px);
            overflow: hidden;
            z-index: 0;
          }
          .home-intro-blob {
            position: absolute;
            border-radius: 50%;
            mix-blend-mode: screen;
            opacity: 0.55;
          }
          .home-intro-blob-a {
            width: 420px; height: 420px; background: #22d3ee;
            top: 12%; left: 18%;
            animation: homeIntroBlobA 9s ease-in-out infinite;
          }
          .home-intro-blob-b {
            width: 380px; height: 380px; background: #a855f7;
            top: 38%; right: 12%;
            animation: homeIntroBlobB 11s ease-in-out infinite;
          }
          .home-intro-blob-c {
            width: 320px; height: 320px; background: #f472b6;
            bottom: 8%; left: 38%;
            animation: homeIntroBlobC 7.5s ease-in-out infinite;
          }
          .home-intro-brand {
            position: relative;
            z-index: 2;
            font-size: clamp(1.9rem, 6vw, 3.75rem);
            font-weight: 800;
            letter-spacing: -0.01em;
            line-height: 1.15;
            margin: 0;
            text-align: center;
            background: linear-gradient(90deg, #22d3ee, #a855f7, #f472b6, #22d3ee);
            background-size: 300% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: homeIntroGradientShift 6s ease infinite;
            filter: url(#homeIntroFluid);
          }
          .home-intro-tagline {
            position: relative;
            z-index: 2;
            color: #cbd5e1;
            font-size: 1.05rem;
            font-weight: 500;
            margin: 1.25rem 0 0;
            text-align: center;
          }
          .home-intro-credit {
            position: relative;
            z-index: 2;
            color: #64748b;
            font-size: 0.8rem;
            font-weight: 500;
            margin-top: 0.5rem;
          }
          @keyframes homeIntroPhotoGlow {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          .home-intro-photo-glow {
            position: absolute;
            inset: -36px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(34,211,238,0.55), rgba(168,85,247,0.4) 55%, transparent 75%);
            filter: blur(36px);
            animation: homeIntroPhotoGlow 3s ease-in-out infinite;
            z-index: -1;
          }
          .home-intro-photo {
            position: relative;
            width: 280px;
            height: 280px;
            border-radius: 50%;
            overflow: hidden;
            border: 4px solid rgba(255,255,255,0.25);
            box-shadow: 0 0 40px rgba(34,211,238,0.35), 0 0 70px rgba(168,85,247,0.25);
            margin-bottom: 1.75rem;
          }
          .home-intro-photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        `}
      </style>

      <div className="home-intro-goo-wrap">
        <div className="home-intro-blob home-intro-blob-a" />
        <div className="home-intro-blob home-intro-blob-b" />
        <div className="home-intro-blob home-intro-blob-c" />
      </div>

      <motion.div
        className="home-intro-photo"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'backOut' }}
      >
        <span className="home-intro-photo-glow" />
        <img src={profileImg} alt="Siddharamayya Mathapati" />
      </motion.div>

      <h1 className="home-intro-brand">Welcome to My Workplace</h1>

      <motion.p
        className="home-intro-tagline"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.9, duration: 0.6 }}
      >
        Your MultiModal AI Assistant
      </motion.p>

      <motion.p
        className="home-intro-credit"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
      >
        Crafted by Siddharamayya M
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.5 }}
        style={{
          position: 'relative',
          zIndex: 2,
          marginTop: '2.5rem',
          width: '220px',
          height: '3px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.1)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: (DURATION_MS - 2400) / 1000, ease: 'linear' }}
          style={{ height: '100%', background: 'linear-gradient(90deg, #22d3ee, #a855f7, #f472b6)' }}
        />
      </motion.div>
    </motion.div>
  );
};

export default HomeIntro;
