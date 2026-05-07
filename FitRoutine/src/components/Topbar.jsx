import { useState, useEffect } from 'react';
import { useStore, S } from '../store';
import { Search, Bell, Menu } from 'lucide-react';
import NotificationPanel from './NotificationPanel';

export default function Topbar({ onMenuClick }) {
  const store = useStore();
  const [time, setTime] = useState(new Date());
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const unreadCount = store.notifications.filter(n => !n.read).length;
  const initial = store.name ? store.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button className="icon-btn d-md-none" onClick={onMenuClick} style={{ display: window.innerWidth > 768 ? 'none' : 'block' }}>
          <Menu size={24} />
        </button>
        <div className="topbar-left">
          <div className="greeting">{getGreeting()}, {store.name || 'Champion'}</div>
          <div className="clock">{time.toLocaleTimeString()}</div>
        </div>
      </div>
      <div className="topbar-actions">
        <button className="icon-btn" onClick={() => S.update(s => { s.name = ''; })}>
          🔄
        </button>
        <button className="icon-btn">
          <Search size={20} />
        </button>
        <div style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => setShowNotifs(!showNotifs)}>
            <Bell size={20} />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          {showNotifs && <NotificationPanel onClose={() => setShowNotifs(false)} />}
        </div>
        <div className="avatar">{initial}</div>
      </div>
    </div>
  );
}
