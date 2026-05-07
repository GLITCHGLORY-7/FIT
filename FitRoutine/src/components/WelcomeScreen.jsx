import { useState } from 'react';
import { useStore, S } from '../store';

export default function WelcomeScreen() {
  const [inputName, setInputName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputName.trim()) {
      S.update(s => { s.name = inputName.trim(); });
    }
  };

  return (
    <div className="welcome-overlay">
      <div className="welcome-card">
        <h1 style={{ color: 'var(--accent-green)', marginBottom: '10px' }}>Welcome to FitRoutine</h1>
        <p style={{ color: 'var(--text-muted)' }}>What should your AI Coach call you?</p>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            className="welcome-input" 
            placeholder="Enter your name" 
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn-primary">Get Started</button>
        </form>
      </div>
    </div>
  );
}
