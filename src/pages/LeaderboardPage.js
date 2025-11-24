import React, { useState } from 'react';
import './LeaderboardPage.css';

function LeaderboardPage({ user }) {
  const [activeTab, setActiveTab] = useState('points');

  const leaderboardData = {
    points: [
      { rank: 1, username: 'CryptoKing', avatar: '👑', points: 125680, vipLevel: 8 },
      { rank: 2, username: 'MiningMaster', avatar: '⛏️', points: 98450, vipLevel: 7 },
      { rank: 3, username: 'RewardHunter', avatar: '🎯', points: 87320, vipLevel: 6 },
      { rank: 4, username: 'GamePro', avatar: '🎮', points: 76540, vipLevel: 6 },
      { rank: 5, username: 'LuckyPlayer', avatar: '🍀', points: 65890, vipLevel: 5 },
      { rank: 6, username: 'SpeedRunner', avatar: '⚡', points: 54320, vipLevel: 5 },
      { rank: 7, username: 'DiamondHands', avatar: '💎', points: 48760, vipLevel: 4 },
      { rank: 8, username: 'MoonShot', avatar: '🚀', points: 42150, vipLevel: 4 },
      { rank: 9, username: 'StarCollector', avatar: '⭐', points: 38920, vipLevel: 4 },
      { rank: 10, username: 'EliteGamer', avatar: '🏆', points: 35480, vipLevel: 3 },
    ],
    earnings: [
      { rank: 1, username: 'CryptoKing', avatar: '👑', earnings: 1250.50, currency: 'TON' },
      { rank: 2, username: 'RewardHunter', avatar: '🎯', earnings: 980.25, currency: 'TON' },
      { rank: 3, username: 'MiningMaster', avatar: '⛏️', earnings: 875.80, currency: 'TON' },
      { rank: 4, username: 'DiamondHands', avatar: '💎', earnings: 765.40, currency: 'TON' },
      { rank: 5, username: 'GamePro', avatar: '🎮', earnings: 658.90, currency: 'TON' },
      { rank: 6, username: 'MoonShot', avatar: '🚀', earnings: 543.20, currency: 'TON' },
      { rank: 7, username: 'LuckyPlayer', avatar: '🍀', earnings: 487.60, currency: 'TON' },
      { rank: 8, username: 'SpeedRunner', avatar: '⚡', earnings: 421.50, currency: 'TON' },
      { rank: 9, username: 'StarCollector', avatar: '⭐', earnings: 389.20, currency: 'TON' },
      { rank: 10, username: 'EliteGamer', avatar: '🏆', earnings: 354.80, currency: 'TON' },
    ],
    streak: [
      { rank: 1, username: 'DailyGrinder', avatar: '🔥', streak: 365, points: 45000 },
      { rank: 2, username: 'Consistent', avatar: '📅', streak: 180, points: 32000 },
      { rank: 3, username: 'NeverMiss', avatar: '✅', streak: 120, points: 28000 },
      { rank: 4, username: 'CryptoKing', avatar: '👑', streak: 90, points: 125680 },
      { rank: 5, username: 'Dedicated', avatar: '💪', streak: 75, points: 22000 },
      { rank: 6, username: 'MiningMaster', avatar: '⛏️', streak: 60, points: 98450 },
      { rank: 7, username: 'RewardHunter', avatar: '🎯', streak: 45, points: 87320 },
      { rank: 8, username: 'GamePro', avatar: '🎮', streak: 30, points: 76540 },
      { rank: 9, username: 'LuckyPlayer', avatar: '🍀', streak: 21, points: 65890 },
      { rank: 10, username: 'SpeedRunner', avatar: '⚡', streak: 14, points: 54320 },
    ]
  };

  const currentUserRank = {
    points: { rank: 156, total: 5000 },
    earnings: { rank: 234, total: 5000 },
    streak: { rank: 89, total: 5000 }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return 'default';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="leaderboard-page">
      <div className="page-header">
        <h1 className="page-title">🏆 Leaderboard</h1>
        <p className="page-subtitle">Compete with players worldwide</p>
      </div>

      <div className="user-rank-card">
        <div className="user-rank-info">
          <div className="user-rank-avatar">{user.avatar}</div>
          <div className="user-rank-details">
            <h3>{user.username}</h3>
            <p>Your Rank: #{currentUserRank[activeTab].rank} of {currentUserRank[activeTab].total}</p>
          </div>
        </div>
        <div className="user-rank-stats">
          <div className="rank-stat">
            <span className="rank-stat-value">{user.points.toLocaleString()}</span>
            <span className="rank-stat-label">Points</span>
          </div>
          <div className="rank-stat">
            <span className="rank-stat-value">Level {user.vipLevel}</span>
            <span className="rank-stat-label">VIP</span>
          </div>
        </div>
      </div>

      <div className="leaderboard-tabs">
        <button 
          className={activeTab === 'points' ? 'active' : ''}
          onClick={() => setActiveTab('points')}
        >
          💎 Points
        </button>
        <button 
          className={activeTab === 'earnings' ? 'active' : ''}
          onClick={() => setActiveTab('earnings')}
        >
          💰 Earnings
        </button>
        <button 
          className={activeTab === 'streak' ? 'active' : ''}
          onClick={() => setActiveTab('streak')}
        >
          🔥 Streak
        </button>
      </div>

      <div className="leaderboard-list">
        {leaderboardData[activeTab].map((player) => (
          <div 
            key={player.rank} 
            className={`leaderboard-item ${getRankColor(player.rank)}`}
          >
            <div className="rank-badge">
              {getRankIcon(player.rank)}
            </div>
            <div className="player-avatar">{player.avatar}</div>
            <div className="player-info">
              <h4>{player.username}</h4>
              {activeTab === 'points' && (
                <p>{player.points.toLocaleString()} points • VIP {player.vipLevel}</p>
              )}
              {activeTab === 'earnings' && (
                <p>{player.earnings.toFixed(2)} {player.currency}</p>
              )}
              {activeTab === 'streak' && (
                <p>{player.streak} days • {player.points.toLocaleString()} pts</p>
              )}
            </div>
            {player.rank <= 3 && (
              <div className="trophy-icon">
                {player.rank === 1 && '👑'}
                {player.rank === 2 && '🥈'}
                {player.rank === 3 && '🥉'}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="leaderboard-footer">
        <p>🔄 Updates every hour</p>
        <p>Keep playing to climb the ranks!</p>
      </div>
    </div>
  );
}

export default LeaderboardPage;
