import { useState, useEffect } from 'react';

// Default initial state
const defaultState = {
  name: '',
  xp: 0,
  streak: 0,
  bestStreak: 0,
  streakLastDate: null, // ISO string
  weeklyMins: [0,0,0,0,0,0,0], // Mon-Sun
  weeklyContributed: [], // IDs of workouts done to prevent double counting
  activityLog: [],
  notifications: [],
  exercises: [
    { id: 1, name: 'Pushups', sets: 3, reps: '15', done: false },
    { id: 2, name: 'Pullups', sets: 3, reps: '8', done: false },
    { id: 3, name: 'Squats', sets: 4, reps: '20', done: false },
  ],
  habits: [
    { id: 1, name: 'Drink 2L Water', emoji: '💧', history: {} }, // history: { '2023-10-01': 'done' | 'miss' }
    { id: 2, name: 'Stretch', emoji: '🧘‍♂️', history: {} },
    { id: 3, name: 'Read 10 pages', emoji: '📚', history: {} }
  ],
  workouts: [
    { id: 1, emoji: '🔥', name: 'HIIT Burn', duration: 25, intensity: 'high', muscles: ['Full Body'] },
    { id: 2, emoji: '💪', name: 'Upper Body Power', duration: 45, intensity: 'medium', muscles: ['Chest', 'Arms', 'Back'] },
    { id: 3, emoji: '🦵', name: 'Leg Day', duration: 50, intensity: 'high', muscles: ['Legs', 'Glutes'] },
    { id: 4, emoji: '🧘', name: 'Recovery Yoga', duration: 20, intensity: 'low', muscles: ['Core', 'Flexibility'] },
  ],
  chatHistory: [
    { role: 'ai', text: 'Hey there! I am your AI Coach. Ready to crush some goals?', timestamp: new Date().toISOString() }
  ]
};

// Singleton store
export const S = {
  ...defaultState,
  listeners: new Set(),
  
  load() {
    try {
      const saved = localStorage.getItem('fitroutine_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(this, { ...defaultState, ...parsed });
      }
    } catch (e) {
      console.error("Failed to load state", e);
    }
  },
  
  save() {
    const toSave = { ...this };
    delete toSave.listeners;
    delete toSave.load;
    delete toSave.save;
    delete toSave.update;
    delete toSave.subscribe;
    delete toSave.addXP;
    delete toSave.checkStreak;
    delete toSave.logActivity;
    delete toSave.notify;
    localStorage.setItem('fitroutine_state', JSON.stringify(toSave));
    this.listeners.forEach(l => l());
  },

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },

  update(mutator) {
    mutator(this);
    this.save();
  },

  addXP(amount, reason, x = null, y = null) {
    this.xp = Math.max(0, this.xp + amount);
    this.logActivity(`${amount > 0 ? '+' : ''}${amount} XP: ${reason}`);
    this.save();
    
    // Trigger floating text if coords provided
    if (x !== null && y !== null && amount > 0) {
      const el = document.createElement('div');
      el.className = 'float-xp';
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.innerText = `+${amount} XP`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    }
    
    // Level up check
    if (Math.floor(this.xp / 2000) > Math.floor((this.xp - amount) / 2000)) {
      const el = document.createElement('div');
      el.className = 'level-up-splash';
      el.innerHTML = `<div class="level-up-text">LEVEL UP!</div>`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3000);
    }
  },

  checkStreak() {
    const today = new Date().toISOString().split('T')[0];
    if (this.streakLastDate !== today) {
      this.streak += 1;
      this.streakLastDate = today;
      if (this.streak > this.bestStreak) {
        this.bestStreak = this.streak;
      }
      this.save();
      // Fire streak event
      window.dispatchEvent(new CustomEvent('streak-increment'));
    }
  },

  logActivity(text) {
    this.activityLog.unshift({
      id: Date.now(),
      text,
      timestamp: new Date().toISOString()
    });
    if (this.activityLog.length > 50) this.activityLog.pop();
  },

  notify(title, message) {
    this.notifications.unshift({
      id: Date.now(),
      title,
      message,
      read: false,
      timestamp: new Date().toISOString()
    });
    this.save();
  }
};

// Initial load
S.load();

// Custom hook
export function useStore() {
  const [, setTick] = useState(0);
  useEffect(() => {
    return S.subscribe(() => setTick(t => t + 1));
  }, []);
  return S;
}
