import { useStore, S } from '../store';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

export default function Dashboard({ onStartWorkout }) {
  const store = useStore();

  const handleExerciseCheck = (id, e) => {
    S.update(s => {
      const ex = s.exercises.find(x => x.id === id);
      if (ex) {
        ex.done = !ex.done;
        if (ex.done) {
          s.addXP(15, `Completed exercise: ${ex.name}`, e.clientX, e.clientY);
        } else {
          s.xp = Math.max(0, s.xp - 15);
        }
      }
    });
  };

  const handleHabitCheck = (id, e) => {
    S.update(s => {
      const today = new Date().toISOString().split('T')[0];
      const hb = s.habits.find(x => x.id === id);
      if (hb) {
        const isDone = hb.history[today] === 'done';
        hb.history[today] = isDone ? 'empty' : 'done';
        if (!isDone) {
          s.addXP(20, `Completed habit: ${hb.name}`, e.clientX, e.clientY);
          // Check if all habits done
          const allDone = s.habits.every(h => h.history[today] === 'done');
          if (allDone) s.checkStreak();
        } else {
          s.xp = Math.max(0, s.xp - 20);
        }
      }
    });
  };

  const completedTasks = store.exercises.filter(e => e.done).length + 
    store.habits.filter(h => h.history[new Date().toISOString().split('T')[0]] === 'done').length;
  const totalTasks = store.exercises.length + store.habits.length;
  
  const xpProgress = (store.xp % 2000) / 2000 * 100;
  const currentLevel = Math.floor(store.xp / 2000) + 1;

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Minutes',
        data: store.weeklyMins,
        borderColor: '#00e5a0',
        backgroundColor: 'rgba(0, 229, 160, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a8d98' } },
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a8d98' } }
    },
    plugins: { legend: { display: false } }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="dashboard-grid">
      {/* Top Stat Cards */}
      <div className="stat-card card">
        <div className="card-header">Current Streak</div>
        <div className="stat-value">🔥 {store.streak} <span style={{fontSize:'1rem', color:'var(--text-muted)'}}>Days</span></div>
      </div>
      
      <div className="stat-card card">
        <div className="card-header">Tasks Done</div>
        <div className="stat-value">{completedTasks} <span style={{fontSize:'1rem', color:'var(--text-muted)'}}>/ {totalTasks}</span></div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${(completedTasks/totalTasks)*100 || 0}%`, backgroundColor: 'var(--accent-green)' }}></div>
        </div>
      </div>

      <div className="stat-card card">
        <div className="card-header">Weekly Goal</div>
        <div className="stat-value">{store.weeklyMins.reduce((a,b)=>a+b,0)} <span style={{fontSize:'1rem', color:'var(--text-muted)'}}>Mins</span></div>
      </div>

      <div className="stat-card card">
        <div className="card-header">Level {currentLevel}</div>
        <div className="stat-value">{store.xp % 2000} <span style={{fontSize:'1rem', color:'var(--text-muted)'}}>/ 2000 XP</span></div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${xpProgress}%` }}></div>
        </div>
      </div>

      {/* Main Content Columns */}
      <div className="col-span-8 card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card-header">Today's Plan</div>
        <div>
          <h3 style={{ color: 'var(--accent-purple)', marginBottom: '15px' }}>Strength Training</h3>
          {store.exercises.map(ex => (
            <div key={ex.id} className="checklist-item">
              <div 
                className={`checkbox ${ex.done ? 'checked' : ''}`} 
                onClick={(e) => handleExerciseCheck(ex.id, e)}
              >
                {ex.done && '✓'}
              </div>
              <div style={{ flex: 1, textDecoration: ex.done ? 'line-through' : 'none', color: ex.done ? 'var(--text-muted)' : 'var(--text-main)' }}>
                {ex.name}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {ex.sets} sets x {ex.reps}
              </div>
            </div>
          ))}
        </div>
        <button className="btn-primary" style={{ marginTop: '10px' }} onClick={() => onStartWorkout(store.workouts[0])}>
          Start Workout Timer
        </button>
      </div>

      <div className="col-span-4 card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="card-header">Daily Habits</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {store.habits.map(h => {
            const isDone = h.history[today] === 'done';
            return (
              <div key={h.id} className="checklist-item" style={{ borderBottom: 'none', padding: '5px 0' }}>
                <div 
                  className={`checkbox ${isDone ? 'checked' : ''}`} 
                  onClick={(e) => handleHabitCheck(h.id, e)}
                >
                  {isDone && '✓'}
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span>{h.emoji}</span>
                  <span style={{ textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--text-muted)' : 'var(--text-main)' }}>{h.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card-header" style={{ marginTop: '30px' }}>Next Up</div>
        <div style={{ padding: '15px', backgroundColor: 'var(--bg-color)', borderRadius: '8px', borderLeft: '3px solid #fcc45c' }}>
          <div style={{ fontWeight: 'bold' }}>{store.workouts[1].emoji} {store.workouts[1].name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tomorrow • {store.workouts[1].duration} mins</div>
        </div>
      </div>

      <div className="col-span-8 card">
        <div className="card-header">Weekly Overview</div>
        <div style={{ height: '300px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="col-span-4 card">
        <div className="card-header">Activity Feed</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', maxHeight: '300px' }}>
          {store.activityLog.map(log => (
            <div key={log.id} style={{ display: 'flex', flexDirection: 'column', gap: '5px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.9rem' }}>{log.text}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          ))}
          {store.activityLog.length === 0 && (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '50px' }}>No activity yet. Let's get moving!</div>
          )}
        </div>
      </div>
    </div>
  );
}
