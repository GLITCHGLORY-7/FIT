import { useState, useEffect } from 'react';
import { S } from '../store';
import { X, Play, Pause, Square } from 'lucide-react';

export default function WorkoutTimer({ workout, onClose }) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [restSeconds, setRestSeconds] = useState(0);
  const [setsDone, setSetsDone] = useState(0);
  const [hr, setHr] = useState(90);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
        
        // Simulate HR ramping and noise
        setHr(prev => {
          const target = Math.min(160, 90 + (seconds / 10));
          const noise = Math.floor(Math.random() * 5) - 2;
          return Math.max(70, Math.min(180, prev + (target - prev) * 0.1 + noise));
        });

      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  useEffect(() => {
    let restInterval = null;
    if (restSeconds > 0) {
      restInterval = setInterval(() => {
        setRestSeconds(r => r - 1);
      }, 1000);
    }
    return () => clearInterval(restInterval);
  }, [restSeconds]);

  const finishWorkout = () => {
    const mins = Math.floor(seconds / 60);
    const xpEarned = 100 + (mins * 3) + (setsDone * 10);
    
    S.update(s => {
      s.addXP(xpEarned, `Completed ${workout.name}`);
      const today = new Date().getDay();
      const adjustedDay = today === 0 ? 6 : today - 1; // 0=Mon, 6=Sun
      
      // Update weekly mins using Math.max to not overwrite larger values
      s.weeklyMins[adjustedDay] = Math.max(s.weeklyMins[adjustedDay] || 0, mins);
      
      if (!s.weeklyContributed.includes(workout.id)) {
        s.weeklyContributed.push(workout.id);
      }
      s.checkStreak();
    });
    
    onClose();
  };

  const getHrZone = () => {
    if (hr < 110) return { label: 'Light', color: 'var(--accent-green)' };
    if (hr < 140) return { label: 'Aerobic', color: '#fcc45c' };
    if (hr < 160) return { label: 'Anaerobic', color: '#fc8a5c' };
    return { label: 'Max', color: '#fc5c5c' };
  };

  const zone = getHrZone();
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Live calorie counter (MET-based estimate)
  // MET ~ 6 for medium intensity. Calories = MET * weight(kg) * time(hrs)
  const calories = Math.floor(6 * 75 * (seconds / 3600));

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="icon-btn" onClick={onClose}><X /></button>
        </div>
        
        <h2 style={{ color: 'var(--accent-purple)', fontSize: '1.5rem', marginBottom: '10px' }}>{workout.name}</h2>
        
        <div style={{ fontSize: '4rem', fontFamily: 'var(--font-heading)', color: 'var(--accent-green)', margin: '20px 0' }}>
          {formatTime(seconds)}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-around', margin: '30px 0', padding: '20px', backgroundColor: 'var(--bg-color)', borderRadius: '12px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sets Done</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{setsDone}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Est. Calories</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{calories} kcal</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Heart Rate</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: zone.color }}>
              {Math.floor(hr)} <span style={{ fontSize: '0.8rem' }}>bpm</span>
            </div>
          </div>
        </div>

        {restSeconds > 0 && (
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--accent-purple)' }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '5px' }}>Rest Time</div>
            <div style={{ fontSize: '2rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-heading)' }}>
              {restSeconds}s
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button 
            className="btn-primary" 
            style={{ width: 'auto', backgroundColor: isActive ? '#fc5c5c' : 'var(--accent-green)' }}
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <button 
            className="btn-primary" 
            style={{ width: 'auto', backgroundColor: '#fcc45c', color: '#0d0f14' }}
            onClick={() => { setSetsDone(s => s + 1); setRestSeconds(60); }}
          >
            Log Set
          </button>

          <button 
            className="btn-primary" 
            style={{ width: 'auto', backgroundColor: 'var(--accent-purple)' }}
            onClick={finishWorkout}
          >
            <Square size={20} style={{ marginRight: '5px' }} /> Finish
          </button>
        </div>
      </div>
    </div>
  );
}
