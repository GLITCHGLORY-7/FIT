import { useStore } from '../store';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Analytics() {
  const store = useStore();

  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Workout Minutes',
        data: store.weeklyMins,
        backgroundColor: '#7c5cfc',
        borderRadius: 4
      }
    ]
  };

  const donutData = {
    labels: ['Chest', 'Arms', 'Legs', 'Back', 'Core'],
    datasets: [
      {
        data: [12, 19, 15, 10, 8], // Mock data as real weighting requires deep history tracking not in simple state
        backgroundColor: ['#00e5a0', '#7c5cfc', '#fc5c5c', '#fcc45c', '#5cbbfc'],
        borderWidth: 0,
      }
    ]
  };

  const donutOptions = {
    plugins: {
      legend: { position: 'right', labels: { color: '#ffffff' } }
    }
  };
  const barOptions = {
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a8d98' } },
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a8d98' } }
    },
    plugins: { legend: { display: false } }
  };

  return (
    <div className="dashboard-grid">
      <div className="stat-card card">
        <div className="card-header">Workouts Done</div>
        <div className="stat-value">{store.weeklyContributed.length}</div>
      </div>
      <div className="stat-card card">
        <div className="card-header">Avg Duration</div>
        <div className="stat-value">{Math.round(store.weeklyMins.reduce((a,b)=>a+b,0) / (store.weeklyContributed.length || 1))} <span style={{fontSize:'1rem'}}>m</span></div>
      </div>
      <div className="stat-card card">
        <div className="card-header">Habit Streak</div>
        <div className="stat-value">{store.streak}</div>
      </div>
      <div className="stat-card card">
        <div className="card-header">Total XP</div>
        <div className="stat-value">{store.xp}</div>
      </div>

      <div className="col-span-8 card">
        <div className="card-header">Workout Minutes per Day</div>
        <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className="col-span-4 card">
        <div className="card-header">Muscle Group Focus</div>
        <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
          <Doughnut data={donutData} options={donutOptions} />
        </div>
      </div>
    </div>
  );
}
