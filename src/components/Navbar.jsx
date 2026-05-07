import { useNavigate } from 'react-router-dom';
import { FiHome, FiBriefcase, FiCpu } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';

const Navbar = ({ currentPage = 'home' }) => {
  const navigate = useNavigate();

  const styles = {
    navbar: {
      position: 'fixed',
      width: '100vw',
      minHeight: '60px',
      backgroundColor: '#404347',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      top: 0,
      zIndex: 101,
      borderBottom: '1px solid #e5e7eb',
      flexWrap: 'wrap',
      gap: '0.5rem',
      boxSizing: 'border-box'
    },
    appName: {
      margin: 0,
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '1.5rem',
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      textShadow: '0 0 3px rgba(255, 255, 255, 0.6)',
      whiteSpace: 'nowrap'
    },
    navLink: {
      color: '#ffffff',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      whiteSpace: 'nowrap',
      padding: '0.5rem 0.75rem',
      borderRadius: '8px',
      backgroundColor: 'transparent',
      visibility: 'visible',
      opacity: 1,
      zIndex: 1,
      border: 'none'
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
        <div
          onMouseEnter={(e) => e.target.style.color = '#08d7fc'}
          onMouseLeave={(e) => e.target.style.color = '#ffffff'}
        >
          <h1
            style={styles.appName}
            onClick={() => navigate('/')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && navigate('/')}
          >
            PolyGenAI - MultiModal AI
          </h1>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'flex-end' }}>
        <button
          style={styles.navLink}
          onClick={() => navigate('/')}
          onMouseEnter={(e) => e.target.style.color = '#08d7fc'}
          onMouseLeave={(e) => e.target.style.color = '#ffffff'}
        >
          <FiHome size={16} />
          <span className="hide-on-mobile">Home</span>
        </button>
        <button
          style={styles.navLink}
          onClick={() => navigate('/projects')}
          onMouseEnter={(e) => e.target.style.color = '#08d7fc'}
          onMouseLeave={(e) => e.target.style.color = '#ffffff'}
        >
          <FiBriefcase size={16} />
          <span className="hide-on-mobile">Projects</span>
        </button>
        <button
          style={styles.navLink}
          onClick={() => navigate('/admin/login')}
          onMouseEnter={(e) => e.target.style.color = '#08d7fc'}
          onMouseLeave={(e) => e.target.style.color = '#ffffff'}
        >
          <FiCpu size={16} />
          <span className="hide-on-mobile">Admin</span>
        </button>
        <a
          href="https://mtptisid.github.io"
          style={styles.navLink}
          onMouseEnter={(e) => e.target.style.color = '#08d7fc'}
          onMouseLeave={(e) => e.target.style.color = '#ffffff'}
        >
          <FaUser size={16} />
          <span className="hide-on-mobile">Siddharamayya M</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
