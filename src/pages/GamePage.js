import React, { useState, useEffect } from 'react';
import Achievements from '../components/Achievements';
import './GamePage.css';

function GamePage({ user, updateUser, addNotification }) {
  const [mining, setMining] = useState({});
  const [cooldowns, setCooldowns] = useState({});

  const miningModes = [
    { id: 'puzzle', name: 'Puzzle Mining', icon: '🧩', reward: 50, duration: 2000, cooldown: 30000, expReward: 10 },
    { id: 'spin', name: 'Spin Mining', icon: '🎰', reward: 100, duration: 3000, cooldown: 60000, expReward: 20 },
    { id: 'sticker', name: 'Sticker Packs', icon: '🎨', reward: 75, duration: 2500, cooldown: 45000, expReward: 15 },
    { id: 'video', name: 'Video Mining', icon: '📹', reward: 30, duration: 1500, cooldown: 20000, expReward: 5 },
    { id: 'mini', name: 'Mini-Game', icon: '🎯', reward: 120, duration: 4000, cooldown: 90000, expReward: 25 }
  ];

  useEffect(() => {
    // Load cooldowns from localStorage
    const savedCooldowns = localStorage.getItem('miningCooldowns');
    if (savedCooldowns) {
      try {
        const parsed = JSON.parse(savedCooldowns);
        const now = Date.now();
        const activeCooldowns = {};
        
        Object.keys(parsed).forEach(key => {
          if (parsed[key] > now) {
            activeCooldowns[key] = parsed[key];
          }
        });
        
        setCooldowns(activeCooldowns);
      } catch (e) {
        console.error('Error loading cooldowns:', e);
      }
    }
  }, []);

  useEffect(() => {
    // Save cooldowns to localStorage
    localStorage.setItem('miningCooldowns', JSON.stringify(cooldowns));
    
    // Set up timers for active cooldowns
    const timers = Object.keys(cooldowns).map(key => {
      const remaining = cooldowns[key] - Date.now();
      if (remaining > 0) {
        return setTimeout(() => {
          setCooldowns(prev => {
            const newCooldowns = { ...prev };
            delete newCooldowns[key];
            return newCooldowns;
          });
        }, remaining);
      }
      return null;
    });

    return () => timers.forEach(timer => timer && clearTimeout(timer));
  }, [cooldowns]);

  const startMining = (mode) => {
    if (mining[mode.id] || cooldowns[mode.id]) return;

    setMining({ ...mining, [mode.id]: true });
    addNotification(`Started ${mode.name}!`, 'info');

    setTimeout(() => {
      const newPoints = user.points + mode.reward;
      const newExp = user.exp + mode.expReward;
      const newCompletedTasks = user.completedTasks + 1;
      
      // Check for level up
      let newLevel = user.vipLevel;
      let finalExp = newExp;
      if (newExp >= user.maxExp) {
        newLevel = user.vipLevel + 1;
        finalExp = newExp - user.maxExp;
        addNotification(`🎉 Level Up! You are now VIP Level ${newLevel}!`, 'success');
      }

      updateUser({
        points: newPoints,
        exp: finalExp,
        vipLevel: newLevel,
        completedTasks: newCompletedTasks
      });

      setMining({ ...mining, [mode.id]: false });
      const newCooldowns = { ...cooldowns, [mode.id]: Date.now() + mode.cooldown };
      setCooldowns(newCooldowns);
      addNotification(`+${mode.reward} points earned!`, 'success');
    }, mode.duration);
  };

  const getCooldownTime = (modeId) => {
    if (!cooldowns[modeId]) return null;
    const remaining = Math.ceil((cooldowns[modeId] - Date.now()) / 1000);
    return remaining > 0 ? remaining : null;
  };

  return (
    <div className="game-page">
      <div className="page-header">
        <h1 className="page-title">Game Mining</h1>
        <p className="page-subtitle">Start mining to earn points and rewards</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💎</div>
          <div className="stat-info">
            <div className="stat-value">{user.points.toLocaleString()}</div>
            <div className="stat-label">Total Points</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <div className="stat-value">{user.completedTasks}</div>
            <div className="stat-label">Completed Tasks</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <div className="stat-value">7</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <div className="stat-value">Level {user.vipLevel}</div>
            <div className="stat-label">VIP Status</div>
          </div>
        </div>
      </div>

      <h3 className="section-title">Mining Modes</h3>
      <div className="mining-grid">
        {miningModes && miningModes.length > 0 ? miningModes.map(mode => {
          const cooldownTime = getCooldownTime(mode.id);
          const isOnCooldown = cooldownTime !== null;
          const isMining = mining[mode.id];
          
          return (
            <div key={mode.id} className={`mining-card ${isOnCooldown ? 'cooldown' : ''}`}>
              <div className="mining-icon">{mode.icon}</div>
              <h4>{mode.name}</h4>
              <div className="mining-rewards">
                <p className="reward">+{mode.reward} pts</p>
                <p className="exp-reward">+{mode.expReward} exp</p>
              </div>
              <button 
                className="start-btn"
                onClick={() => startMining(mode)}
                disabled={isMining || isOnCooldown}
              >
                {isMining ? 'Mining...' : isOnCooldown ? `${cooldownTime}s` : 'Start'}
              </button>
              {isMining && (
                <div className="progress-bar">
                  <div className="progress-fill" style={{ animationDuration: `${mode.duration}ms` }}></div>
                </div>
              )}
              {isOnCooldown && !isMining && (
                <div className="cooldown-overlay">
                  <span className="cooldown-text">⏱️ {cooldownTime}s</span>
                </div>
              )}
            </div>
          );
        }) : <div style={{padding: '40px', textAlign: 'center', color: '#999'}}>Loading mining modes...</div>}
      </div>

      <Achievements user={user} />
    </div>
  );
}

export default GamePage;
