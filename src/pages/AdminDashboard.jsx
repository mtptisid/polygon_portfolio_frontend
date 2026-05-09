import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiEye, FiDownload, FiX, FiUsers, FiTrendingUp, FiClock, FiArrowLeft, FiHome } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import { format, subDays } from 'date-fns';
import ReactMarkdown from 'react-markdown';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [filters, setFilters] = useState({
    company: '',
    role: '',
    interest_level: 'all'
  });
  const [selectedSession, setSelectedSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchSessions();
  }, [navigate]);

  useEffect(() => {
    applyFilters();
  }, [sessions, filters]);

  const fetchSessions = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch('https://portpoliosid.onrender.com/api/admin/sessions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('admin_token');
          navigate('/admin/login');
          return;
        }
        throw new Error('Failed to fetch sessions');
      }

      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...sessions];

    if (filters.company) {
      filtered = filtered.filter(s =>
        s.company.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    if (filters.role) {
      filtered = filtered.filter(s =>
        s.role.toLowerCase().includes(filters.role.toLowerCase())
      );
    }

    if (filters.interest_level !== 'all') {
      filtered = filtered.filter(s =>
        s.interest_level?.toLowerCase() === filters.interest_level.toLowerCase()
      );
    }

    setFilteredSessions(filtered);
  };

  const handleViewSession = async (sessionId) => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`https://portpoliosid.onrender.com/api/admin/session/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch session details');

      const data = await response.json();
      setSelectedSession(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching session details:', error);
      alert('Failed to load session details');
    }
  };

  const handleExportSession = async (sessionId) => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`https://portpoliosid.onrender.com/api/admin/export/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to export session');

      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `session_${sessionId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting session:', error);
      alert('Failed to export session');
    }
  };

  const handleExportAll = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch('https://portpoliosid.onrender.com/api/admin/export_all?format=csv', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to export all sessions');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `all_sessions_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting all sessions:', error);
      alert('Failed to export all sessions');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const getInterestBadgeColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'low': return '#6b7280';
      default: return '#9ca3af';
    }
  };

  // Calculate stats
  const totalSessions = sessions.length;
  const highInterestCount = sessions.filter(s => s.interest_level?.toLowerCase() === 'high').length;
  const recentCount = sessions.filter(s => {
    const sessionDate = new Date(s.created_at);
    const sevenDaysAgo = subDays(new Date(), 7);
    return sessionDate >= sevenDaysAgo;
  }).length;

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#151515',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #404347',
            borderTop: '4px solid #07b1d0',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#9ca3af' }}>Loading sessions...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#151515', display: 'flex', flexDirection: 'column', fontFamily: '"Poppins", sans-serif' }}>
      <style>
        {`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
          .slide-up {
            animation: slideUp 0.5s ease-out forwards;
          }
          .stat-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1.5rem;
            transition: all 0.3s ease;
          }
          .stat-card:hover {
            background: rgba(255, 255, 255, 0.08);
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          }
          .table-row {
            transition: background-color 0.2s ease;
          }
          .table-row:hover {
            background: rgba(255, 255, 255, 0.03);
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
          onClick={() => navigate('/')}
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

      {/* Main Content */}
      <main style={{ padding: '90px 2rem 2rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div className="fade-in" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '0.5rem' }}>
              Admin Dashboard
            </h1>
            <p style={{ color: '#9ca3af' }}>Manage HR Assistant sessions and analytics</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '1rem',
              transition: 'background-color 0.2s',
              fontFamily: '"Poppins", sans-serif'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
        {/* Stats Cards */}
        <div className="slide-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: '500' }}>Total Sessions</span>
              <FiUsers size={24} color="#3b82f6" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff' }}>{totalSessions}</div>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: '500' }}>High Interest</span>
              <FiTrendingUp size={24} color="#10b981" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff' }}>{highInterestCount}</div>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: '500' }}>Recent (7 days)</span>
              <FiClock size={24} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff' }}>{recentCount}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="slide-up" style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Company
              </label>
              <input
                type="text"
                value={filters.company}
                onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                placeholder="Filter by company..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontFamily: '"Poppins", sans-serif',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Role
              </label>
              <input
                type="text"
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                placeholder="Filter by role..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontFamily: '"Poppins", sans-serif',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Interest Level
              </label>
              <select
                value={filters.interest_level}
                onChange={(e) => setFilters({ ...filters, interest_level: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontFamily: '"Poppins", sans-serif',
                  outline: 'none',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              >
                <option value="all" style={{ background: '#151515' }}>All</option>
                <option value="high" style={{ background: '#151515' }}>High</option>
                <option value="medium" style={{ background: '#151515' }}>Medium</option>
                <option value="low" style={{ background: '#151515' }}>Low</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={handleExportAll}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  fontFamily: '"Poppins", sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
              >
                <FiDownload size={18} />
                <span>Export All (CSV)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="slide-up" style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Recruiter
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Company
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Role
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Date
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Interest
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                      No sessions found
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => (
                    <tr key={session.session_id} className="table-row" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#ffffff', marginBottom: '0.25rem' }}>
                            {session.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            {session.email}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#e5e7eb' }}>
                        {session.company}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#e5e7eb' }}>
                        {session.role}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                        {format(new Date(session.created_at), 'MMM dd, yyyy')}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          borderRadius: '9999px',
                          color: '#ffffff',
                          backgroundColor: getInterestBadgeColor(session.interest_level)
                        }}>
                          {session.interest_level?.toUpperCase() || 'N/A'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button
                            onClick={() => handleViewSession(session.session_id)}
                            style={{
                              color: '#3b82f6',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontFamily: '"Poppins", sans-serif',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#60a5fa'}
                            onMouseLeave={(e) => e.target.style.color = '#3b82f6'}
                          >
                            <FiEye size={16} />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleExportSession(session.session_id)}
                            style={{
                              color: '#10b981',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontFamily: '"Poppins", sans-serif',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#34d399'}
                            onMouseLeave={(e) => e.target.style.color = '#10b981'}
                          >
                            <FiDownload size={16} />
                            <span>Export</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Session Details Modal */}
      {showModal && selectedSession && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 1000
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#1f2937',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
              maxWidth: '1000px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{selectedSession.name}</h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>{selectedSession.email}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {/* Basic Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Company</p>
                  <p style={{ fontWeight: '600', color: '#ffffff' }}>{selectedSession.company}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Role</p>
                  <p style={{ fontWeight: '600', color: '#ffffff' }}>{selectedSession.role}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Date</p>
                  <p style={{ fontWeight: '600', color: '#ffffff' }}>
                    {format(new Date(selectedSession.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Interest Level</p>
                  <span style={{
                    display: 'inline-flex',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    borderRadius: '9999px',
                    color: '#ffffff',
                    backgroundColor: getInterestBadgeColor(selectedSession.interest_level)
                  }}>
                    {selectedSession.interest_level?.toUpperCase() || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Additional Notes */}
              {selectedSession.additional_notes && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem' }}>
                    Additional Notes
                  </h3>
                  <p style={{
                    color: '#d1d5db',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    {selectedSession.additional_notes}
                  </p>
                </div>
              )}

              {/* Chat History */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem' }}>
                  Chat History
                </h3>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '1rem',
                  borderRadius: '8px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {selectedSession.chat_history?.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: msg.is_user ? 'flex-end' : 'flex-start',
                        marginBottom: '0.75rem'
                      }}
                    >
                      <div style={{
                        maxWidth: '70%',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        backgroundColor: msg.is_user ? '#667eea' : 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        lineHeight: '1.5'
                      }}>
                        {msg.is_user ? (
                          <p style={{ margin: 0 }}>{msg.content}</p>
                        ) : (
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis */}
              {selectedSession.analysis && (
                <>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem' }}>
                      Summary
                    </h3>
                    <p style={{
                      color: '#d1d5db',
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      lineHeight: '1.6'
                    }}>
                      {selectedSession.analysis.summary}
                    </p>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem' }}>
                      Key Topics
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {selectedSession.analysis.key_topics?.map((topic, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: 'rgba(102, 126, 234, 0.2)',
                            color: '#a5b4fc',
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            border: '1px solid rgba(102, 126, 234, 0.3)'
                          }}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem' }}>
                      Role Fit Analysis
                    </h3>
                    <p style={{
                      color: '#d1d5db',
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      lineHeight: '1.6'
                    }}>
                      {selectedSession.analysis.role_fit}
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem' }}>
                      Next Steps
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {selectedSession.analysis.next_steps?.map((step, idx) => (
                        <li
                          key={idx}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '0.75rem 1rem',
                            marginBottom: '0.5rem',
                            borderRadius: '8px',
                            color: '#d1d5db',
                            paddingLeft: '2rem',
                            position: 'relative',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}
                        >
                          <span style={{ position: 'absolute', left: '0.75rem', color: '#667eea' }}>→</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        backgroundColor: '#daebdd',
        color: '#000000',
        padding: '1.5rem',
        textAlign: 'center',
        width: '100vw',
        marginTop: 'auto'
      }}>
        <p style={{ fontSize: '1rem', fontWeight: 500 }}>
          © 2025 Siddharamayya M. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
