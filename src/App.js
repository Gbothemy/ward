import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import GamePage from './pages/GamePage';
import AirdropPage from './pages/AirdropPage';
import ReferralPage from './pages/ReferralPage';
import BenefitPage from './pages/BenefitPage';
import LeaderboardPage from './pages/LeaderboardPage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [user, setUser] = useState({
    username: 'Player123',
    userId: 'USR-98765',
    avatar: '👤',
    balance: {
      ton: 125.50,
      cati: 3420,
      usdt: 89.25
    },
    points: 15680,
    vipLevel: 3,
    exp: 2450,
    maxExp: 5000,
    giftPoints: 890,
    completedTasks: 24,
    dayStreak: 7,
    lastClaim: null,
    totalEarnings: {
      ton: 125.50,
      cati: 3420,
      usdt: 89.25
    }
  });

  const [notifications, setNotifications] = useState([]);

  // Check authentication on mount (but don't auto-login)
  useEffect(() => {
    // Only check auth if user is trying to access protected routes
    // Landing page should always be accessible
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('rewardGameUser', JSON.stringify(user));
  }, [user]);

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const handleLogin = (userData) => {
    setAuthUser(userData);
    setIsAuthenticated(true);
    
    // Load saved game data if exists
    const savedUser = localStorage.getItem('rewardGameUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser({
        ...parsedUser,
        username: userData.username,
        userId: userData.userId,
        avatar: userData.avatar
      });
    } else {
      setUser(prev => ({
        ...prev,
        username: userData.username,
        userId: userData.userId,
        avatar: userData.avatar
      }));
    }
    
    addNotification(`Welcome back, ${userData.username}!`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    setAuthUser(null);
    setIsAuthenticated(false);
    addNotification('Logged out successfully', 'info');
  };

  return (
    <Router>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <Layout user={user} notifications={notifications} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<GamePage user={user} updateUser={updateUser} addNotification={addNotification} />} />
            <Route path="/game" element={<GamePage user={user} updateUser={updateUser} addNotification={addNotification} />} />
            <Route path="/airdrop" element={<AirdropPage user={user} updateUser={updateUser} addNotification={addNotification} />} />
            <Route path="/referral" element={<ReferralPage user={user} updateUser={updateUser} addNotification={addNotification} />} />
            <Route path="/benefit" element={<BenefitPage user={user} updateUser={updateUser} addNotification={addNotification} onLogout={handleLogout} />} />
            <Route path="/leaderboard" element={<LeaderboardPage user={user} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </Router>
  );
}

export default App;
