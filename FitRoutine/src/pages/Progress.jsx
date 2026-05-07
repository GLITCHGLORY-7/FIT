import { useStore } from '../store';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

export default function Progress() {
  const store = useStore();

  const prs = [
    { name: 'Bench Press', current: 80, target: 100, unit: 'kg' },
    { name: 'Squat', current: 120, target: 150, unit: 'kg' },
    { name: 'Deadlift', current: 140, target: 180, unit: 'kg' },
    { name: '5K Run', current: 25, target: 20, unit: 'mins', invert: true } // lower is better
  ];

  // Mock 8 weeks streak history
  const streakHistory = [12, 14, 10, 18, 22, 21, 25, store.streak];

  const chartData = {
    labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Current'],
    datasets: [
      {
        label: 'Streak History',
        data: streakHistory,
        borderColor: '#fc5c5c',
        backgroundColor: 'rgba(252, 92, 92, 0.1)',
        fill: true,
        tension: 0.3,
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

  return (
    <div className="dashboard-grid">
      <div className="col-span-6 card">
        <div className="card-header">Personal Records</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {prs.map(pr => {
            const progress = pr.invert 
              ? Math.max(0, 100 - ((pr.current - pr.target) / pr.target * 100))
              : (pr.current / pr.target) * 100;
            
            return (
              <div key={pr.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '500' }}>{pr.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{pr.current} / {pr.target} {pr.unit}</span>
                </div>
                <div className="progress-bar-bg" style={{ height: '12px' }}>
                  <div className="progress-bar-fill" style={{ width: `${Math.min(100, progress)}%`, backgroundColor: 'var(--accent-green)' }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="col-span-6 card">
        <div className="card-header">Streak History (Last 8 Weeks)</div>
        <div style={{ height: '300px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
