import { useState } from 'react';

export default function Calendar() {
  const [workouts, setWorkouts] = useState(new Set()); // Mocked simple workout toggle
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const today = new Date().getDate();

  const toggleWorkout = (day) => {
    const newSet = new Set(workouts);
    if (newSet.has(day)) newSet.delete(day);
    else newSet.add(day);
    setWorkouts(newSet);
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-green)' }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" style={{ width: 'auto', padding: '8px 15px' }} onClick={prevMonth}>&lt;</button>
          <button className="btn-primary" style={{ width: 'auto', padding: '8px 15px' }} onClick={nextMonth}>&gt;</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '10px', color: 'var(--text-muted)' }}>
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
        {Array.from({length: firstDay}).map((_, i) => <div key={`empty-${i}`}></div>)}
        
        {Array.from({length: daysInMonth}).map((_, i) => {
          const day = i + 1;
          const isToday = day === today && currentDate.getMonth() === new Date().getMonth();
          const hasWorkout = workouts.has(day);
          
          return (
            <div 
              key={day} 
              onClick={() => toggleWorkout(day)}
              style={{ 
                aspectRatio: '1', 
                backgroundColor: isToday ? 'rgba(0, 229, 160, 0.2)' : 'var(--bg-color)',
                border: isToday ? '2px solid var(--accent-green)' : '1px solid var(--border-color)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <span style={{ fontWeight: isToday ? 'bold' : 'normal' }}>{day}</span>
              {hasWorkout && <span style={{ position: 'absolute', bottom: '5px', fontSize: '1.2rem' }}>💪</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
