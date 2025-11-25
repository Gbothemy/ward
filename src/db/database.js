import { sql } from '@vercel/postgres';

// Database helper functions with dual storage (localStorage + Postgres)
export const db = {
  // ==================== USER OPERATIONS ====================
  
  async createUser(userData) {
    try {
      const { user_id, username, email, avatar, is_admin } = userData;
      
      // Insert into database
      const result = await sql`
        INSERT INTO users (user_id, username, email, avatar, is_admin)
        VALUES (${user_id}, ${username}, ${email || ''}, ${avatar}, ${is_admin || false})
        ON CONFLICT (user_id) DO UPDATE
        SET username = ${username}, email = ${email || ''}, avatar = ${avatar}
        RETURNING *
      `;
      
      // Create initial balance
      await sql`
        INSERT INTO balances (user_id, ton, cati, usdt)
        VALUES (${user_id}, 0, 0, 0)
        ON CONFLICT (user_id) DO NOTHING
      `;
      
      // Also save to localStorage as backup
      const fullUserData = {
        ...userData,
        balance: { ton: 0, cati: 0, usdt: 0 },
        points: 0,
        vipLevel: 1,
        exp: 0,
        maxExp: 1000,
        giftPoints: 0,
        completedTasks: 0,
        dayStreak: 0,
        lastClaim: null,
        totalEarnings: { ton: 0, cati: 0, usdt: 0 }
      };
      localStorage.setItem(`rewardGameUser_${user_id}`, JSON.stringify(fullUserData));
      
      return result.rows[0];
    } catch (error) {
      console.error('Database createUser error:', error);
      // Fallback to localStorage only
      const fullUserData = {
        ...userData,
        balance: { ton: 0, cati: 0, usdt: 0 },
        points: 0,
        vipLevel: 1,
        exp: 0,
        maxExp: 1000,
        giftPoints: 0,
        completedTasks: 0,
        dayStreak: 0,
        lastClaim: null,
        totalEarnings: { ton: 0, cati: 0, usdt: 0 }
      };
      localStorage.setItem(`rewardGameUser_${userData.user_id}`, JSON.stringify(fullUserData));
      return fullUserData;
    }
  },

  async getUser(user_id) {
    try {
      const result = await sql`
        SELECT u.*, b.ton, b.cati, b.usdt
        FROM users u
        LEFT JOIN balances b ON u.user_id = b.user_id
        WHERE u.user_id = ${user_id}
      `;
      
      if (result.rows.length > 0) {
        const dbUser = result.rows[0];
        // Sync to localStorage
        const userData = {
          userId: dbUser.user_id,
          username: dbUser.username,
          email: dbUser.email,
          avatar: dbUser.avatar,
          isAdmin: dbUser.is_admin,
          points: dbUser.points,
          vipLevel: dbUser.vip_level,
          exp: dbUser.exp,
          maxExp: dbUser.max_exp,
          giftPoints: dbUser.gift_points,
          completedTasks: dbUser.completed_tasks,
          dayStreak: dbUser.day_streak,
          lastClaim: dbUser.last_claim,
          balance: {
            ton: parseFloat(dbUser.ton) || 0,
            cati: parseFloat(dbUser.cati) || 0,
            usdt: parseFloat(dbUser.usdt) || 0
          },
          totalEarnings: {
            ton: parseFloat(dbUser.ton) || 0,
            cati: parseFloat(dbUser.cati) || 0,
            usdt: parseFloat(dbUser.usdt) || 0
          }
        };
        localStorage.setItem(`rewardGameUser_${user_id}`, JSON.stringify(userData));
        return userData;
      }
      
      // Fallback to localStorage
      const localData = localStorage.getItem(`rewardGameUser_${user_id}`);
      return localData ? JSON.parse(localData) : null;
    } catch (error) {
      console.error('Database getUser error:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem(`rewardGameUser_${user_id}`);
      return localData ? JSON.parse(localData) : null;
    }
  },

  async updateUser(user_id, updates) {
    try {
      const { points, vipLevel, exp, completedTasks, dayStreak } = updates;
      
      const result = await sql`
        UPDATE users
        SET points = ${points || 0},
            vip_level = ${vipLevel || 1},
            exp = ${exp || 0},
            completed_tasks = ${completedTasks || 0},
            day_streak = ${dayStreak || 0}
        WHERE user_id = ${user_id}
        RETURNING *
      `;
      
      // Also update localStorage
      const localData = localStorage.getItem(`rewardGameUser_${user_id}`);
      if (localData) {
        const userData = JSON.parse(localData);
        Object.assign(userData, updates);
        localStorage.setItem(`rewardGameUser_${user_id}`, JSON.stringify(userData));
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Database updateUser error:', error);
      // Fallback to localStorage only
      const localData = localStorage.getItem(`rewardGameUser_${user_id}`);
      if (localData) {
        const userData = JSON.parse(localData);
        Object.assign(userData, updates);
        localStorage.setItem(`rewardGameUser_${user_id}`, JSON.stringify(userData));
        return userData;
      }
      throw error;
    }
  },

  async getAllUsers() {
    try {
      const result = await sql`
        SELECT u.*, b.ton, b.cati, b.usdt
        FROM users u
        LEFT JOIN balances b ON u.user_id = b.user_id
        WHERE u.is_admin = FALSE
        ORDER BY u.points DESC
      `;
      
      return result.rows.map(row => ({
        userId: row.user_id,
        username: row.username,
        email: row.email,
        avatar: row.avatar,
        isAdmin: row.is_admin,
        points: row.points,
        vipLevel: row.vip_level,
        exp: row.exp,
        maxExp: row.max_exp,
        completedTasks: row.completed_tasks,
        dayStreak: row.day_streak,
        balance: {
          ton: parseFloat(row.ton) || 0,
          cati: parseFloat(row.cati) || 0,
          usdt: parseFloat(row.usdt) || 0
        }
      }));
    } catch (error) {
      console.error('Database getAllUsers error:', error);
      // Fallback to localStorage
      const keys = Object.keys(localStorage);
      const userKeys = keys.filter(key => key.startsWith('rewardGameUser_'));
      return userKeys.map(key => JSON.parse(localStorage.getItem(key)));
    }
  },

  // ==================== BALANCE OPERATIONS ====================
  
  async updateBalance(user_id, currency, amount) {
    try {
      const result = await sql`
        UPDATE balances
        SET ${sql(currency)} = ${amount}
        WHERE user_id = ${user_id}
        RETURNING *
      `;
      
      // Also update localStorage
      const localData = localStorage.getItem(`rewardGameUser_${user_id}`);
      if (localData) {
        const userData = JSON.parse(localData);
        userData.balance[currency] = amount;
        localStorage.setItem(`rewardGameUser_${user_id}`, JSON.stringify(userData));
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Database updateBalance error:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem(`rewardGameUser_${user_id}`);
      if (localData) {
        const userData = JSON.parse(localData);
        userData.balance[currency] = amount;
        localStorage.setItem(`rewardGameUser_${user_id}`, JSON.stringify(userData));
        return userData.balance;
      }
      throw error;
    }
  },

  async addPoints(user_id, points) {
    try {
      const result = await sql`
        UPDATE users
        SET points = points + ${points}
        WHERE user_id = ${user_id}
        RETURNING *
      `;
      
      // Also update localStorage
      const localData = localStorage.getItem(`rewardGameUser_${user_id}`);
      if (localData) {
        const userData = JSON.parse(localData);
        userData.points += points;
        localStorage.setItem(`rewardGameUser_${user_id}`, JSON.stringify(userData));
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Database addPoints error:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem(`rewardGameUser_${user_id}`);
      if (localData) {
        const userData = JSON.parse(localData);
        userData.points += points;
        localStorage.setItem(`rewardGameUser_${user_id}`, JSON.stringify(userData));
        return userData;
      }
      throw error;
    }
  },

  // ==================== WITHDRAWAL OPERATIONS ====================
  
  async createWithdrawalRequest(requestData) {
    try {
      const { id, user_id, username, currency, amount, wallet_address } = requestData;
      
      const result = await sql`
        INSERT INTO withdrawal_requests 
        (id, user_id, username, currency, amount, wallet_address, status)
        VALUES (${id}, ${user_id}, ${username}, ${currency}, ${amount}, ${wallet_address}, 'pending')
        RETURNING *
      `;
      
      // Also save to localStorage
      const requests = JSON.parse(localStorage.getItem('withdrawalRequests') || '[]');
      requests.push(requestData);
      localStorage.setItem('withdrawalRequests', JSON.stringify(requests));
      
      return result.rows[0];
    } catch (error) {
      console.error('Database createWithdrawalRequest error:', error);
      // Fallback to localStorage
      const requests = JSON.parse(localStorage.getItem('withdrawalRequests') || '[]');
      requests.push(requestData);
      localStorage.setItem('withdrawalRequests', JSON.stringify(requests));
      return requestData;
    }
  },

  async getWithdrawalRequests(status = null) {
    try {
      let result;
      if (status) {
        result = await sql`
          SELECT * FROM withdrawal_requests
          WHERE status = ${status}
          ORDER BY request_date DESC
        `;
      } else {
        result = await sql`
          SELECT * FROM withdrawal_requests
          ORDER BY request_date DESC
        `;
      }
      
      return result.rows;
    } catch (error) {
      console.error('Database getWithdrawalRequests error:', error);
      // Fallback to localStorage
      const requests = JSON.parse(localStorage.getItem('withdrawalRequests') || '[]');
      return status ? requests.filter(r => r.status === status) : requests;
    }
  },

  async updateWithdrawalStatus(id, status, processed_by) {
    try {
      const result = await sql`
        UPDATE withdrawal_requests
        SET status = ${status},
            processed_date = CURRENT_TIMESTAMP,
            processed_by = ${processed_by}
        WHERE id = ${id}
        RETURNING *
      `;
      
      // Also update localStorage
      const requests = JSON.parse(localStorage.getItem('withdrawalRequests') || '[]');
      const index = requests.findIndex(r => r.id === id);
      if (index !== -1) {
        requests[index].status = status;
        requests[index].processedDate = new Date().toISOString();
        requests[index].processedBy = processed_by;
        localStorage.setItem('withdrawalRequests', JSON.stringify(requests));
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Database updateWithdrawalStatus error:', error);
      // Fallback to localStorage
      const requests = JSON.parse(localStorage.getItem('withdrawalRequests') || '[]');
      const index = requests.findIndex(r => r.id === id);
      if (index !== -1) {
        requests[index].status = status;
        requests[index].processedDate = new Date().toISOString();
        requests[index].processedBy = processed_by;
        localStorage.setItem('withdrawalRequests', JSON.stringify(requests));
        return requests[index];
      }
      throw error;
    }
  },

  // ==================== GAME PLAYS OPERATIONS ====================
  
  async recordGamePlay(user_id, game_type) {
    try {
      const result = await sql`
        INSERT INTO game_plays (user_id, game_type, play_date, plays_count)
        VALUES (${user_id}, ${game_type}, CURRENT_DATE, 1)
        ON CONFLICT (user_id, game_type, play_date)
        DO UPDATE SET plays_count = game_plays.plays_count + 1
        RETURNING *
      `;
      
      // Also save to localStorage
      const today = new Date().toDateString();
      const key = `dailyPlays_${user_id}_${today}`;
      const plays = JSON.parse(localStorage.getItem(key) || '{}');
      plays[game_type] = (plays[game_type] || 0) + 1;
      localStorage.setItem(key, JSON.stringify(plays));
      
      return result.rows[0];
    } catch (error) {
      console.error('Database recordGamePlay error:', error);
      // Fallback to localStorage
      const today = new Date().toDateString();
      const key = `dailyPlays_${user_id}_${today}`;
      const plays = JSON.parse(localStorage.getItem(key) || '{}');
      plays[game_type] = (plays[game_type] || 0) + 1;
      localStorage.setItem(key, JSON.stringify(plays));
      return plays;
    }
  },

  async getGamePlays(user_id, game_type, date) {
    try {
      const result = await sql`
        SELECT * FROM game_plays
        WHERE user_id = ${user_id}
          AND game_type = ${game_type}
          AND play_date = ${date}
      `;
      
      return result.rows[0];
    } catch (error) {
      console.error('Database getGamePlays error:', error);
      // Fallback to localStorage
      const dateStr = new Date(date).toDateString();
      const key = `dailyPlays_${user_id}_${dateStr}`;
      const plays = JSON.parse(localStorage.getItem(key) || '{}');
      return { plays_count: plays[game_type] || 0 };
    }
  },

  // ==================== LEADERBOARD OPERATIONS ====================
  
  async getLeaderboard(type = 'points', limit = 10) {
    try {
      if (type === 'points') {
        const result = await sql`
          SELECT user_id, username, avatar, points, vip_level
          FROM users
          WHERE is_admin = FALSE
          ORDER BY points DESC
          LIMIT ${limit}
        `;
        return result.rows;
      } else if (type === 'earnings') {
        const result = await sql`
          SELECT u.user_id, u.username, u.avatar, b.ton
          FROM users u
          LEFT JOIN balances b ON u.user_id = b.user_id
          WHERE u.is_admin = FALSE
          ORDER BY b.ton DESC
          LIMIT ${limit}
        `;
        return result.rows;
      } else if (type === 'streak') {
        const result = await sql`
          SELECT user_id, username, avatar, day_streak, points
          FROM users
          WHERE is_admin = FALSE
          ORDER BY day_streak DESC
          LIMIT ${limit}
        `;
        return result.rows;
      }
    } catch (error) {
      console.error('Database getLeaderboard error:', error);
      // Fallback to localStorage
      const keys = Object.keys(localStorage);
      const userKeys = keys.filter(key => key.startsWith('rewardGameUser_'));
      const users = userKeys.map(key => JSON.parse(localStorage.getItem(key)));
      
      if (type === 'points') {
        return users.sort((a, b) => b.points - a.points).slice(0, limit);
      } else if (type === 'earnings') {
        return users.sort((a, b) => (b.balance?.ton || 0) - (a.balance?.ton || 0)).slice(0, limit);
      } else if (type === 'streak') {
        return users.sort((a, b) => (b.dayStreak || 0) - (a.dayStreak || 0)).slice(0, limit);
      }
    }
  }
};
