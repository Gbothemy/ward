-- Reward Game Dashboard Database Schema
-- For Vercel Postgres

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  avatar VARCHAR(10),
  is_admin BOOLEAN DEFAULT FALSE,
  points INTEGER DEFAULT 0,
  vip_level INTEGER DEFAULT 1,
  exp INTEGER DEFAULT 0,
  max_exp INTEGER DEFAULT 1000,
  gift_points INTEGER DEFAULT 0,
  completed_tasks INTEGER DEFAULT 0,
  day_streak INTEGER DEFAULT 0,
  last_claim TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Balances table
CREATE TABLE IF NOT EXISTS balances (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  ton DECIMAL(18, 8) DEFAULT 0,
  cati DECIMAL(18, 8) DEFAULT 0,
  usdt DECIMAL(18, 8) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Withdrawal requests table
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  username VARCHAR(100),
  currency VARCHAR(10),
  amount DECIMAL(18, 8),
  wallet_address TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_date TIMESTAMP,
  processed_by VARCHAR(100),
  rejection_reason TEXT
);

-- Game plays table (for daily limits)
CREATE TABLE IF NOT EXISTS game_plays (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  game_type VARCHAR(50),
  play_date DATE DEFAULT CURRENT_DATE,
  plays_count INTEGER DEFAULT 1,
  UNIQUE(user_id, game_type, play_date)
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  achievement_id VARCHAR(50),
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id)
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  referrer_id VARCHAR(50) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  referred_id VARCHAR(50) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  referral_code VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(referred_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_points ON users(points DESC);
CREATE INDEX IF NOT EXISTS idx_balances_user_id ON balances(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_game_plays_user_date ON game_plays(user_id, play_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_balances_updated_at BEFORE UPDATE ON balances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
