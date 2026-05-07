import { Activity, LayoutDashboard, CalendarDays, CheckSquare, BarChart2, TrendingUp, MessageSquare, LogOut, X } from 'lucide-react';

export default function Sidebar({ current, onNavigate, isOpen, onClose }) {
  const links = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'workouts', label: 'Workouts', icon: <Activity size={20} /> },
    { id: 'habits', label: 'Habits', icon: <CheckSquare size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarDays size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={20} /> },
    { id: 'progress', label: 'Progress', icon: <TrendingUp size={20} /> },
    { id: 'ai-coach', label: 'AI Coach', icon: <MessageSquare size={20} /> },
  ];

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <Activity color="#00e5a0" /> FitRoutine
          {isOpen && (
            <button className="icon-btn" onClick={onClose} style={{ marginLeft: 'auto', marginRight: 15, display: 'md-none' }}>
              <X size={20} />
            </button>
          )}
        </div>
        <nav className="nav-links">
          {links.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => { e.preventDefault(); onNavigate(link.id); }}
              className={`nav-link ${current === link.id ? 'active' : ''}`}
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </nav>
        <div style={{ padding: '0 15px', marginTop: 'auto' }}>
          <button className="nav-link" style={{ width: '100%', color: '#fc5c5c' }} onClick={() => { localStorage.clear(); window.location.reload(); }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
      {isOpen && <div className="modal-overlay" style={{ zIndex: 90 }} onClick={onClose}></div>}
    </>
  );
}
