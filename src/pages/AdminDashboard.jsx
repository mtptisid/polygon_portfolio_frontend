import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiEye, FiDownload, FiX } from 'react-icons/fi';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import Navbar from '../components/Navbar';

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
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentPage="admin" />
      
      {/* Header with Logout */}
      <div style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e5e7eb',
        marginTop: '60px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
              Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
            >
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem', width: '100%' }}>
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                value={filters.company}
                onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                placeholder="Filter by company..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <input
                type="text"
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                placeholder="Filter by role..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Level
              </label>
              <select
                value={filters.interest_level}
                onChange={(e) => setFilters({ ...filters, interest_level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleExportAll}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <FiDownload size={18} />
                <span>Export All (CSV)</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Sessions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recruiter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No sessions found
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => (
                    <motion.tr
                      key={session.session_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {session.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {session.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(session.created_at), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getInterestBadgeColor(
                            session.interest_level
                          )}`}
                        >
                          {session.interest_level?.toUpperCase() || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewSession(session.session_id)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center space-x-1"
                        >
                          <FiEye size={16} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleExportSession(session.session_id)}
                          className="text-green-600 hover:text-green-900 inline-flex items-center space-x-1"
                        >
                          <FiDownload size={16} />
                          <span>Export</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Session Details Modal */}
      <AnimatePresence>
        {showModal && selectedSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{selectedSession.name}</h2>
                  <p className="text-blue-100">{selectedSession.email}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-semibold text-gray-900">{selectedSession.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-semibold text-gray-900">{selectedSession.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-gray-900">
                      {format(new Date(selectedSession.created_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Interest Level</p>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full text-white ${getInterestBadgeColor(
                        selectedSession.interest_level
                      )}`}
                    >
                      {selectedSession.interest_level?.toUpperCase() || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Additional Notes */}
                {selectedSession.additional_notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Additional Notes
                    </h3>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {selectedSession.additional_notes}
                    </p>
                  </div>
                )}

                {/* Chat History */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Chat History
                  </h3>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    {selectedSession.chat_history?.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.is_user ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2 rounded-lg ${
                            msg.is_user
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-800 border border-gray-200'
                          }`}
                        >
                          {msg.is_user ? (
                            <p className="text-sm">{msg.content}</p>
                          ) : (
                            <ReactMarkdown className="prose prose-sm max-w-none">
                              {msg.content}
                            </ReactMarkdown>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analysis */}
                {selectedSession.analysis && (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Summary
                      </h3>
                      <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                        {selectedSession.analysis.summary}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Key Topics
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedSession.analysis.key_topics?.map((topic, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Role Fit Analysis
                      </h3>
                      <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                        {selectedSession.analysis.role_fit}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Next Steps
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 bg-gray-50 p-4 rounded-lg">
                        {selectedSession.analysis.next_steps?.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
