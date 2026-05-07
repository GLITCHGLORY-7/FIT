import { useStore, S } from '../store';
import { CheckCircle, Plus } from 'lucide-react';

export default function Workouts() {
  const store = useStore();

  const markDone = (w, e) => {
    S.update(s => {
      const today = new Date().toISOString().split('T')[0];
      const adjustedDay = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
      
      s.addXP(75, `Marked workout done: ${w.name}`, e.clientX, e.clientY);
      s.checkStreak();
      
      if (!s.weeklyContributed.includes(w.id)) {
        s.weeklyContributed.push(w.id);
        s.weeklyMins[adjustedDay] += w.duration;
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-purple)' }}>Your Workouts</h2>
        <button className="btn-primary" style={{ width: 'auto' }}>
          <Plus size={20} /> Add Workout
        </button>
      </div>

      <div className="workouts-grid">
        {store.workouts.map(w => (
          <div key={w.id} className="card workout-card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '2rem' }}>{w.emoji}</div>
              <div className={`tag intensity-${w.intensity}`}>{w.intensity.toUpperCase()}</div>
            </div>
            
            <h3 style={{ fontSize: '1.2rem', margin: '10px 0 0 0' }}>{w.name}</h3>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{w.duration} mins</div>
            
            <div className="tags" style={{ marginTop: '10px' }}>
              {w.muscles.map(m => <span key={m} className="tag">{m}</span>)}
            </div>

            <button 
              className="btn-primary" 
              style={{ marginTop: 'auto', backgroundColor: 'var(--hover-bg)', color: 'var(--text-main)' }}
              onClick={(e) => markDone(w, e)}
            >
              <CheckCircle size={20} style={{ color: 'var(--accent-green)' }} /> Mark as Done
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
