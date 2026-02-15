-- =============================================
-- ADMIN USERS SCHEMA
-- Secure authentication system for CTP RED CORP
-- =============================================

USE ctpredcorp_db;

-- ===== ADMIN USERS TABLE =====
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'admin') NOT NULL DEFAULT 'admin',
  full_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT NULL,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_is_active (is_active),
  FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL
);

-- ===== ADMIN LOGIN LOGS TABLE =====
CREATE TABLE IF NOT EXISTS admin_login_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  failure_reason VARCHAR(255),
  INDEX idx_admin_id (admin_id),
  INDEX idx_login_time (login_time),
  INDEX idx_success (success),
  FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- ===== ADMIN ACTIVITY LOGS TABLE =====
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(100),
  details JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_admin_id (admin_id),
  INDEX idx_action (action),
  INDEX idx_entity_type (entity_type),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- ===== INSERT DEFAULT SUPER ADMIN =====
-- Default credentials:
-- Username: superadmin
-- Password: Admin@2026! (CHANGE THIS IMMEDIATELY AFTER FIRST LOGIN)
-- This is a bcrypt hash of 'Admin@2026!' with cost factor 10
INSERT INTO admin_users (username, email, password_hash, role, full_name, is_active) VALUES (
  'superadmin',
  'superadmin@ctpred.com.ph',
  '$2b$10$rX8Y9KzqG.HvJNxQqZc2jOYXN3hN3hN3hN3hN3hN3hN3hN3hN3hNe',
  'super_admin',
  'Super Administrator',
  TRUE
) ON DUPLICATE KEY UPDATE id=id;

-- Note: The password hash above is a placeholder.
-- You MUST replace it with a real bcrypt hash after setting up the backend.
-- Use the backend API to create the actual super admin with a secure password.