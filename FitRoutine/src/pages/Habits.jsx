import { useState } from 'react';
import { useStore, S } from '../store';

export default function Habits() {
  const store = useStore();
  const [notes, setNotes] = useState('');

  // Generate last 7 days
  const days = Array.from({length: 7}).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      iso: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-US', { weekday: 'short' })
    };
  });

  const toggleHabit = (habitId, dateIso) => {
    S.update(s => {
      const hb = s.habits.find(h => h.id === habitId);
      if (hb) {
        const current = hb.history[dateIso];
        if (!current || current === 'empty') {
          hb.history[dateIso] = 'done';
          s.addXP(20, `Completed habit backlog: ${hb.name}`);
        } else if (current === 'done') {
          hb.history[dateIso] = 'miss';
          s.xp = Math.max(0, s.xp - 20);
        } else {
          hb.history[dateIso] = 'empty';
        }
      }
    });
  };

  const getCompletionRate = () => {
    let total = store.habits.length * 7;
    let done = 0;
    store.habits.forEach(h => {
      days.forEach(d => {
        if (h.history[d.iso] === 'done') done++;
      });
    });
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-purple)' }}>Weekly Habits</h2>
      
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="habits-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Habit</th>
              {days.map(d => <th key={d.iso}>{d.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {store.habits.map(h => (
              <tr key={h.id}>
                <td className="habit-name">{h.emoji} {h.name}</td>
                {days.map(d => {
                  const state = h.history[d.iso] || 'empty';
                  return (
                    <td key={d.iso}>
                      <div 
                        className={`habit-dot ${state}`} 
                        onClick={() => toggleHabit(h.id, d.iso)}
                      >
                        {state === 'done' && '✓'}
                        {state === 'miss' && '×'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card card">
          <div className="card-header">Completion Rate</div>
          <div className="stat-value" style={{ color: 'var(--accent-purple)' }}>{getCompletionRate()}%</div>
        </div>
        <div className="stat-card card">
          <div className="card-header">Current Streak</div>
          <div className="stat-value">{store.streak} Days</div>
        </div>
        <div className="col-span-6 card">
          <div className="card-header">Habit Notes</div>
          <textarea 
            style={{ width: '100%', height: '100px', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'white', padding: '10px', borderRadius: '8px' }}
            placeholder="Reflect on your habits..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
          <button className="btn-primary" style={{ marginTop: '10px', width: 'auto' }} onClick={() => setNotes('')}>Save Notes</button>
        </div>
      </div>
    </div>
  );
}
