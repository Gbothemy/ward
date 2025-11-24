import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import './AdminPage.css';

function AdminPage({ user, addNotification }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    maxDailyPlays: 2,
    pointsMultiplier: 1
  });

  // Check if user is admin
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadAllData();
    loadNotifications();
    loadSystemSettings();

    // Auto-refresh data every 5 seconds for live updates
    const interval = setInterval(() => {
      loadAllData();
      loadNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadAllData = () => {
    try {
      const keys = Object.keys(localStorage);
      const userKeys = keys.filter(key => key.startsWith('rewardGameUser_'));
      
      const allUsers = userKeys.map(key => {
        try {
          return JSON.parse(localStorage.getItem(key));
        } catch (e) {
          return null;
        }
      }).filter(u => u !== null);

      // Filter out admin and demo users from statistics
      const realUsers = allUsers.filter(u => 
        !u.userId?.startsWith('ADMIN-') && 
        !u.userId?.startsWith('USR-98765') && // DemoPlayer
        !u.username?.toLowerCase().includes('demo') &&
        !u.username?.toLowerCase().includes('admin')
      );

      setUsers(realUsers);

      // Calculate comprehensive stats (using realUsers only)
      const totalPoints = realUsers.reduce((sum, u) => sum + (u.points || 0), 0);
      const totalTasks = realUsers.reduce((sum, u) => sum + (u.completedTasks || 0), 0);
      const totalTON = realUsers.reduce((sum, u) => sum + (u.balance?.ton || 0), 0);
      const totalCATI = realUsers.reduce((sum, u) => sum + (u.balance?.cati || 0), 0);
      const avgLevel = realUsers.length > 0 
        ? (realUsers.reduce((sum, u) => sum + (u.vipLevel || 1), 0) / realUsers.length).toFixed(1)
        : 0;

      const today = new Date().toDateString();
      const activeToday = realUsers.filter(u => {
        try {
          return localStorage.getItem(`dailyPlays_${u.userId}_${today}`) !== null;
        } catch (e) {
          return false;
        }
      }).length;

      setStats({
        totalUsers: realUsers.length,
        totalPoints,
        totalTasks,
        avgLevel,
        activeToday,
        totalTON: totalTON.toFixed(2),
        totalCATI: totalCATI.toFixed(2),
        topPlayer: realUsers.sort((a, b) => b.points - a.points)[0],
        lastUpdate: new Date().toLocaleTimeString()
      });
    } catch (error) {
      console.error('Error loading data:', error);
      addNotification('Error loading data', 'error');
    }
  };

  const loadNotifications = () => {
    // Load admin notifications (withdrawal requests, reports, etc.)
    const savedNotifications = localStorage.getItem('adminNotifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (e) {
        setNotifications([]);
      }
    }
  };

  const loadSystemSettings = () => {
    const saved = localStorage.getItem('systemSettings');
    if (saved) {
      try {
        setSystemSettings(JSON.parse(saved));
      } catch (e) {}
    }
  };

  const saveSystemSettings = () => {
    localStorage.setItem('systemSettings', JSON.stringify(systemSettings));
    addNotification('System settings saved', 'success');
  };

  const handleDeleteUser = (userId) => {
    if (!window.confirm(`Delete user ${userId}? This cannot be undone!`)) return;

    try {
      localStorage.removeItem(`rewardGameUser_${userId}`);
      const keys = Object.keys(localStorage);
      keys.filter(k => k.includes(userId)).forEach(k => localStorage.removeItem(k));

      addNotification('User deleted successfully', 'success');
      loadAllData();
    } catch (error) {
      addNotification('Error deleting user', 'error');
    }
  };

  const handleEditUser = (userData) => {
    setSelectedUser(userData);
    setEditForm({
      username: userData.username || '',
      points: userData.points || 0,
      vipLevel: userData.vipLevel || 1,
      completedTasks: userData.completedTasks || 0,
      ton: userData.balance?.ton || 0,
      cati: userData.balance?.cati || 0,
      usdt: userData.balance?.usdt || 0
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
        completedTasks: parseInt(editForm.completedTasks) || 0,
        balance: {
          ton: parseFloat(editForm.ton) || 0,
          cati: parseFloat(editForm.cati) || 0,
          usdt: parseFloat(editForm.usdt) || 0
        }
      };

      localStorage.setItem(`rewardGameUser_${selectedUser.userId}`, JSON.stringify(updatedUser));
      
      addNotification('User updated successfully', 'success');
      setEditMode(false);
      setSelectedUser(null);
      loadAllData();
    } catch (error) {
      addNotification('Error saving user', 'error');
    }
  };

  const handleBulkAction = (action) => {
    if (!window.confirm(`Apply ${action} to all users?`)) return;

    try {
      users.forEach(u => {
        const updated = { ...u };
        
        switch(action) {
          case 'addPoints':
            updated.points = (updated.points || 0) + 1000;
            break;
          case 'resetCooldowns':
            localStorage.removeItem('miningCooldowns');
            break;
          case 'levelUp':
            updated.vipLevel = (updated.vipLevel || 1) + 1;
            break;
          default:
            break;
        }
        
        localStorage.setItem(`rewardGameUser_${u.userId}`, JSON.stringify(updated));
      });

      addNotification(`Bulk action "${action}" completed`, 'success');
      loadAllData();
    } catch (error) {
      addNotification('Error performing bulk action', 'error');
    }
  };

  const handleExportData = () => {
    try {
      const data = {
        users,
        stats,
        systemSettings,
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admin-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addNotification('Data exported successfully', 'success');
    } catch (error) {
      addNotification('Error exporting data', 'error');
    }
  };

  const handleClearAllData = () => {
    const confirmation = window.prompt('Type "DELETE ALL DATA" to confirm:');
    if (confirmation !== 'DELETE ALL DATA') {
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
      setTimeout(() => window.location.href = '/', 1500);
    } catch (error) {
      addNotification('Error clearing data', 'error');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>🛡️ Admin Dashboard</h1>
          <p>Complete system management and control</p>
        </div>
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span>Live Updates</span>
          {stats.lastUpdate && <small>Last: {stats.lastUpdate}</small>}
        </div>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
          📊 Overview
        </button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
          👥 Users ({users.length})
        </button>
        <button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>
          🔔 Notifications ({notifications.length})
        </button>
        <button className={activeTab === 'system' ? 'active' : ''} onClick={() => setActiveTab('system')}>
          ⚙️ System
        </button>
        <button className={activeTab === 'danger' ? 'active' : ''} onClick={() => setActiveTab('danger')}>
          ⚠️ Danger Zone
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
            <div className="admin-stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <div className="stat-value">{stats.totalTON} TON</div>
                <div className="stat-label">Total Balance</div>
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
            <button onClick={() => handleBulkAction('addPoints')} className="action-btn bulk">
              💎 Give All Users 1000 Points
            </button>
            <button onClick={() => handleBulkAction('resetCooldowns')} className="action-btn bulk">
              ⏰ Reset All Cooldowns
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
                    <th>TON</th>
                    <th>CATI</th>
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
                      <td>{(u.balance?.ton || 0).toFixed(2)}</td>
                      <td>{(u.balance?.cati || 0).toFixed(0)}</td>
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

      {activeTab === 'notifications' && (
        <div className="admin-content">
          <div className="notifications-section">
            <h3>Admin Notifications</h3>
            {notifications.length === 0 ? (
              <p className="empty-state">No pending notifications</p>
            ) : (
              <div className="notifications-list">
                {notifications.map((notif, index) => (
                  <div key={index} className="notification-item">
                    <span className="notif-icon">{notif.icon}</span>
                    <div className="notif-content">
                      <h4>{notif.title}</h4>
                      <p>{notif.message}</p>
                      <small>{notif.date}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="admin-content">
          <div className="settings-section">
            <h3>System Settings</h3>
            <div className="settings-form">
              <label>
                <input 
                  type="checkbox" 
                  checked={systemSettings.maintenanceMode}
                  onChange={(e) => setSystemSettings({...systemSettings, maintenanceMode: e.target.checked})}
                />
                Maintenance Mode
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={systemSettings.registrationEnabled}
                  onChange={(e) => setSystemSettings({...systemSettings, registrationEnabled: e.target.checked})}
                />
                Registration Enabled
              </label>
              <label>
                Max Daily Plays:
                <input 
                  type="number" 
                  value={systemSettings.maxDailyPlays}
                  onChange={(e) => setSystemSettings({...systemSettings, maxDailyPlays: parseInt(e.target.value)})}
                />
              </label>
              <label>
                Points Multiplier:
                <input 
                  type="number" 
                  step="0.1"
                  value={systemSettings.pointsMultiplier}
                  onChange={(e) => setSystemSettings({...systemSettings, pointsMultiplier: parseFloat(e.target.value)})}
                />
              </label>
              <button onClick={saveSystemSettings} className="save-btn">💾 Save Settings</button>
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

      {activeTab === 'danger' && (
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
        </div>
      )}

      {editMode && selectedUser && (
        <div className="edit-modal" onClick={() => { setEditMode(false); setSelectedUser(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit User: {selectedUser.username}</h2>
            <div className="edit-form">
              <label>Username: <input type="text" value={editForm.username} onChange={(e) => setEditForm({...editForm, username: e.target.value})} /></label>
              <label>Points: <input type="number" value={editForm.points} onChange={(e) => setEditForm({...editForm, points: e.target.value})} /></label>
              <label>VIP Level: <input type="number" min="1" max="99" value={editForm.vipLevel} onChange={(e) => setEditForm({...editForm, vipLevel: e.target.value})} /></label>
              <label>Completed Tasks: <input type="number" min="0" value={editForm.completedTasks} onChange={(e) => setEditForm({...editForm, completedTasks: e.target.value})} /></label>
              <label>TON Balance: <input type="number" step="0.01" value={editForm.ton} onChange={(e) => setEditForm({...editForm, ton: e.target.value})} /></label>
              <label>CATI Balance: <input type="number" value={editForm.cati} onChange={(e) => setEditForm({...editForm, cati: e.target.value})} /></label>
              <label>USDT Balance: <input type="number" step="0.01" value={editForm.usdt} onChange={(e) => setEditForm({...editForm, usdt: e.target.value})} /></label>
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
