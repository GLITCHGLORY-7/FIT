import { useState } from 'react';
import { useStore, S } from './store';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import WelcomeScreen from './components/WelcomeScreen';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Habits from './pages/Habits';
import Calendar from './pages/Calendar';
import Analytics from './pages/Analytics';
import Progress from './pages/Progress';
import AICoach from './pages/AICoach';
import WorkoutTimer from './components/WorkoutTimer';

function App() {
  const store = useStore();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);
  
  const closeSidebar = () => setSidebarOpen(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onStartWorkout={(w) => { setActiveWorkout(w); setTimerOpen(true); }} />;
      case 'workouts': return <Workouts />;
      case 'habits': return <Habits />;
      case 'calendar': return <Calendar />;
      case 'analytics': return <Analytics />;
      case 'progress': return <Progress />;
      case 'ai-coach': return <AICoach />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      {!store.name && <WelcomeScreen />}
      
      <Sidebar 
        current={currentPage} 
        onNavigate={(page) => { setCurrentPage(page); closeSidebar(); }}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />
      
      <main className="main-content">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="page-container">
          {renderPage()}
        </div>
      </main>

      {timerOpen && activeWorkout && (
        <WorkoutTimer 
          workout={activeWorkout} 
          onClose={() => { setTimerOpen(false); setActiveWorkout(null); }} 
        />
      )}
    </div>
  );
}

export default App;
