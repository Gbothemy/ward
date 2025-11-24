import React, { useState, useEffect } from 'react';
import './AdminPage.css';

function AdminPage({ user, addNotification }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPoints: 0,
    totalTasks: 0,
    avgLevel: 0,
    activeToday: 0
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    points: 0,
    vipLevel: 1,
    completedTasks: 0
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    try {
      // Get all users from localStorage
      const keys = Object.keys(localStorage);
      const userKeys = keys.filter(key => key.startsWith('rewardGameUser_'));
      
      const allUsers = userKeys.map(key => {
        try {
          const userData = localStorage.getItem(key);
          return JSON.parse(userData);
        } catch (e) {
          console.error(`Error parsing user data for ${key}:`, e);
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

      const today = new Date().toDateString();
      const activeToday = allUsers.filter(u => {
        try {
          const dailyPlays = localStorage.getItem(`dailyPlays_${u.userId}_${today}`);
          return dailyPlays !== null;
        } catch (e) {
          return false;
        }
      }).length;

      setStats({
        totalUsers: allUsers.length,
        totalPoints,
        totalTasks,
        avgLevel,
        activeToday
      });
    } catch (error) {
      console.error('Error loading data:', error);
      addNotification('Error loading data', 'error');
    }
  };

  const handleDeleteUser = (userId) => {
    if (!window.confirm(`Delete user ${userId}? This cannot be undone!`)) return;

    try {
      // Remove user data
      localStorage.removeItem(`rewardGameUser_${userId}`);
      
      // Remove daily plays
      const keys = Object.keys(localStorage);
      keys.filter(k => k.includes(userId)).forEach(k => {
        localStorage.removeItem(k);
      });

      addNotification('User deleted successfully', 'success');
      loadAllData();
    } catch (error) {
      console.error('Error deleting user:', error);
      addNotification('Error deleting user', 'error');
    }
  };

  const handleEditUser = (userData) => {
    setSelectedUser(userData);
    setEditForm({
      username: userData.username || '',
      points: userData.points || 0,
      vipLevel: userData.vipLevel || 1,
      completedTasks: userData.completedTasks || 0
    });
    setEditMode(true);
  };

  const handleSaveUser = () => {
    if (!selectedUser) return;

    try {
      const updatedUser = {
        ...selectedUser,
        username: editForm.username,
        points: parseInt(editForm.points) || 0,
        vipLevel: parseInt(editForm.vipLevel) || 1,
        completedTasks: parseInt(editForm.completedTasks) || 0
      };

      localStorage.setItem(`rewardGameUser_${selectedUser.userId}`, JSON.stringify(updatedUser));
      
      addNotification('User updated successfully', 'success');
      setEditMode(false);
      setSelectedUser(null);
      loadAllData();
    } catch (error) {
      console.error('Error saving user:', error);
      addNotification('Error saving user', 'error');
    }
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

    try {
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
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      console.error('Error clearing data:', error);
      addNotification('Error clearing data', 'error');
    }
  };

  const handleExportData = () => {
    try {
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
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addNotification('Data exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting data:', error);
      addNotification('Error exporting data', 'error');
    }
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
                <div className="stat-value">{stats.totalPoints.toLocaleString()}</div>
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
          {users.length === 0 ? (
            <div className="empty-state">
              <p>No users found. Create an account to see users here.</p>
            </div>
          ) : (
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
                      <td className="avatar-cell">{u.avatar || '👤'}</td>
                      <td>{u.username || 'Unknown'}</td>
                      <td className="user-id">{u.userId}</td>
                      <td>{(u.points || 0).toLocaleString()}</td>
                      <td>Level {u.vipLevel || 1}</td>
                      <td>{u.completedTasks || 0}</td>
                      <td className="actions-cell">
                        <button onClick={() => handleEditUser(u)} className="edit-btn" title="Edit">✏️</button>
                        <button onClick={() => handleDeleteUser(u.userId)} className="delete-btn" title="Delete">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
              <p><strong>Total localStorage keys:</strong> {Object.keys(localStorage).length}</p>
              <p><strong>User profiles:</strong> {users.length}</p>
              <p><strong>Daily play records:</strong> {Object.keys(localStorage).filter(k => k.startsWith('dailyPlays_')).length}</p>
            </div>
          </div>
        </div>
      )}

      {editMode && selectedUser && (
        <div className="edit-modal" onClick={() => { setEditMode(false); setSelectedUser(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit User: {selectedUser.username}</h2>
            <div className="edit-form">
              <label>
                Username:
                <input 
                  type="text" 
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                />
              </label>
              <label>
                Points:
                <input 
                  type="number" 
                  value={editForm.points}
                  onChange={(e) => setEditForm({...editForm, points: e.target.value})}
                />
              </label>
              <label>
                VIP Level:
                <input 
                  type="number" 
                  min="1"
                  max="99"
                  value={editForm.vipLevel}
                  onChange={(e) => setEditForm({...editForm, vipLevel: e.target.value})}
                />
              </label>
              <label>
                Completed Tasks:
                <input 
                  type="number" 
                  min="0"
                  value={editForm.completedTasks}
                  onChange={(e) => setEditForm({...editForm, completedTasks: e.target.value})}
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
