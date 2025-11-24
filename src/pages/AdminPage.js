import React, { useState, useEffect } from 'react';
import './AdminPage.css';

function AdminPage({ user, addNotification }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    // Get all users from localStorage
    const keys = Object.keys(localStorage);
    const userKeys = keys.filter(key => key.startsWith('rewardGameUser_'));
    
    const allUsers = userKeys.map(key => {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch (e) {
        return null;
      }
    }).filter(u => u !== null);

    setUsers(allUsers);

    // Calculate stats
    const totalPoints = allUsers.reduce((sum, u) => sum + (u.points || 0), 0);
    const totalTasks = allUsers.reduce((sum, u) => sum + (u.completedTasks || 0), 0);
    const avgLevel = allUsers.length > 0 
      ? (allUsers.reduce((sum, u) => sum + (u.vipLevel || 1), 0) / allUsers.length).toFixed(1)
      : 0;

    setStats({
      totalUsers: allUsers.length,
      totalPoints,
      totalTasks,
      avgLevel,
      activeToday: allUsers.filter(u => {
        const today = new Date().toDateString();
        return localStorage.getItem(`dailyPlays_${u.userId}_${today}`);
      }).length
    });
  };

  const handleDeleteUser = (userId) => {
    if (!window.confirm(`Delete user ${userId}? This cannot be undone!`)) return;

    // Remove user data
    localStorage.removeItem(`rewardGameUser_${userId}`);
    
    // Remove daily plays
    const keys = Object.keys(localStorage);
    keys.filter(k => k.includes(userId)).forEach(k => localStorage.removeItem(k));

    addNotification('User deleted successfully', 'success');
    loadAllData();
  };

  const handleEditUser = (userData) => {
    setSelectedUser(userData);
    setEditMode(true);
  };

  const handleSaveUser = () => {
    if (!selectedUser) return;

    localStorage.setItem(`rewardGameUser_${selectedUser.userId}`, JSON.stringify(selectedUser));
    addNotification('User updated successfully', 'success');
    setEditMode(false);
    setSelectedUser(null);
    loadAllData();
  };

  const handleClearAllData = () => {
    const message = `⚠️ WARNING: This will delete ALL user data!\n\n` +
      `- ${stats.totalUsers} users\n` +
      `- All game progress\n` +
      `- All daily records\n\n` +
      `Type "DELETE ALL" to confirm:`;
    
    const confirmation = window.prompt(message);
    if (confirmation !== 'DELETE ALL') {
      addNotification('Deletion cancelled', 'info');
      return;
    }

    const keys = Object.keys(localStorage);
    let deleted = 0;
    
    keys.forEach(key => {
      if (key.startsWith('rewardGameUser_') || 
          key.startsWith('dailyPlays_') ||
          key === 'miningCooldowns' ||
          key === 'authUser') {
        localStorage.removeItem(key);
        deleted++;
      }
    });

    addNotification(`Deleted ${deleted} records`, 'success');
    setTimeout(() => window.location.href = '/', 1500);
  };

  const handleExportData = () => {
    const data = {
      users,
      stats,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reward-game-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addNotification('Data exported successfully', 'success');
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>🛡️ Admin Dashboard</h1>
        <p>Manage users and system data</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          👥 Users ({users.length})
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="admin-content">
          <div className="stats-grid">
            <div className="admin-stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <div className="stat-value">{stats.totalUsers}</div>
                <div className="stat-label">Total Users</div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-icon">💎</div>
              <div className="stat-info">
                <div className="stat-value">{stats.totalPoints?.toLocaleString()}</div>
                <div className="stat-label">Total Points</div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <div className="stat-value">{stats.totalTasks}</div>
                <div className="stat-label">Tasks Completed</div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <div className="stat-value">{stats.avgLevel}</div>
                <div className="stat-label">Avg VIP Level</div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-info">
                <div className="stat-value">{stats.activeToday}</div>
                <div className="stat-label">Active Today</div>
              </div>
            </div>
          </div>

          <div className="admin-actions">
            <button onClick={handleExportData} className="action-btn export">
              📥 Export All Data
            </button>
            <button onClick={loadAllData} className="action-btn refresh">
              🔄 Refresh Data
            </button>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="admin-content">
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Username</th>
                  <th>User ID</th>
                  <th>Points</th>
                  <th>Level</th>
                  <th>Tasks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.userId}>
                    <td className="avatar-cell">{u.avatar}</td>
                    <td>{u.username}</td>
                    <td className="user-id">{u.userId}</td>
                    <td>{u.points?.toLocaleString()}</td>
                    <td>Level {u.vipLevel}</td>
                    <td>{u.completedTasks}</td>
                    <td className="actions-cell">
                      <button onClick={() => handleEditUser(u)} className="edit-btn">✏️</button>
                      <button onClick={() => handleDeleteUser(u.userId)} className="delete-btn">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="admin-content">
          <div className="settings-section">
            <h3>⚠️ Danger Zone</h3>
            <div className="danger-actions">
              <button onClick={handleClearAllData} className="danger-btn">
                🗑️ Clear All User Data
              </button>
              <p className="danger-warning">
                This will permanently delete all user accounts and game data. This action cannot be undone!
              </p>
            </div>
          </div>

          <div className="settings-section">
            <h3>📊 Storage Info</h3>
            <div className="storage-info">
              <p>Total localStorage keys: {Object.keys(localStorage).length}</p>
              <p>User profiles: {users.length}</p>
              <p>Daily play records: {Object.keys(localStorage).filter(k => k.startsWith('dailyPlays_')).length}</p>
            </div>
          </div>
        </div>
      )}

      {editMode && selectedUser && (
        <div className="edit-modal">
          <div className="modal-content">
            <h2>Edit User: {selectedUser.username}</h2>
            <div className="edit-form">
              <label>
                Username:
                <input 
                  type="text" 
                  value={selectedUser.username}
                  onChange={(e) => setSelectedUser({...selectedUser, username: e.target.value})}
                />
              </label>
              <label>
                Points:
                <input 
                  type="number" 
                  value={selectedUser.points}
                  onChange={(e) => setSelectedUser({...selectedUser, points: parseInt(e.target.value) || 0})}
                />
              </label>
              <label>
                VIP Level:
                <input 
                  type="number" 
                  value={selectedUser.vipLevel}
                  onChange={(e) => setSelectedUser({...selectedUser, vipLevel: parseInt(e.target.value) || 1})}
                />
              </label>
              <label>
                Completed Tasks:
                <input 
                  type="number" 
                  value={selectedUser.completedTasks}
                  onChange={(e) => setSelectedUser({...selectedUser, completedTasks: parseInt(e.target.value) || 0})}
                />
              </label>
              <div className="modal-actions">
                <button onClick={handleSaveUser} className="save-btn">💾 Save</button>
                <button onClick={() => { setEditMode(false); setSelectedUser(null); }} className="cancel-btn">❌ Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
