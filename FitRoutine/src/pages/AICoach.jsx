import { useState, useRef, useEffect } from 'react';
import { useStore, S } from '../store';
import { fetchAIResponse } from '../ai';
import { Send, Bot, User } from 'lucide-react';

export default function AICoach() {
  const store = useStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [store.chatHistory, isTyping]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    
    // Add user message
    S.update(s => {
      s.chatHistory.push({ role: 'user', text, timestamp: new Date().toISOString() });
    });
    setInput('');
    setIsTyping(true);

    const stats = {
      name: store.name,
      streak: store.streak,
      bestStreak: store.bestStreak,
      xp: store.xp,
      workoutsDone: store.weeklyContributed.length
    };

    const response = await fetchAIResponse(text, stats);

    setIsTyping(false);
    S.update(s => {
      s.chatHistory.push({ role: 'ai', text: response, timestamp: new Date().toISOString() });
    });
  };

  const quickPrompts = [
    "Push day tip", "Boost streak", "Post-workout meal", "Motivate me", "Build habits"
  ];

  return (
    <div className="card chat-container" style={{ padding: 0 }}>
      <div className="card-header" style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', margin: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bot color="var(--accent-green)" /> AI Fitness Coach
        </div>
      </div>
      
      <div className="chat-messages">
        {store.chatHistory.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', fontSize: '0.8rem', opacity: 0.7 }}>
              {msg.role === 'ai' ? <><Bot size={14} /> AI Coach</> : <><User size={14} /> {store.name}</>}
            </div>
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div className="message ai">
            <div style={{ display: 'flex', gap: '5px' }}>
              <span style={{ animation: 'bounce 1s infinite' }}>.</span>
              <span style={{ animation: 'bounce 1s infinite 0.2s' }}>.</span>
              <span style={{ animation: 'bounce 1s infinite 0.4s' }}>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div>
        <div className="quick-prompts">
          {quickPrompts.map(p => (
            <button key={p} className="prompt-chip" onClick={() => handleSend(p)}>{p}</button>
          ))}
        </div>
        <div className="chat-input-area">
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Ask your coach anything..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="btn-primary" style={{ width: 'auto', borderRadius: '50%', padding: '12px' }} onClick={() => handleSend()}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
