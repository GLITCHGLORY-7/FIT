import { useStore, S } from '../store';
import { X, Check } from 'lucide-react';

export default function NotificationPanel({ onClose }) {
  const store = useStore();

  const markAllRead = () => {
    S.update(s => {
      s.notifications.forEach(n => n.read = true);
    });
  };

  const clearAll = () => {
    S.update(s => {
      s.notifications = [];
    });
  };

  return (
    <div style={{
      position: 'absolute',
      top: '40px',
      right: 0,
      width: '300px',
      backgroundColor: 'var(--panel-bg)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      zIndex: 100,
      padding: '15px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
        <h3 style={{ fontSize: '1rem' }}>Notifications</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="icon-btn" onClick={markAllRead} title="Mark all read"><Check size={16} /></button>
          <button className="icon-btn" onClick={clearAll} title="Clear all"><X size={16} /></button>
        </div>
      </div>
      
      <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {store.notifications.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>No notifications</p>
        ) : (
          store.notifications.map(n => (
            <div key={n.id} style={{ 
              padding: '10px', 
              backgroundColor: n.read ? 'transparent' : 'rgba(124, 92, 252, 0.1)',
              borderRadius: '8px',
              borderLeft: n.read ? 'none' : '3px solid var(--accent-purple)'
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{n.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{n.message}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
