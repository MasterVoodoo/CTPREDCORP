-- CTP RED CORP Database Schema
-- This script creates the necessary tables for the application

CREATE DATABASE IF NOT EXISTS ctpredcorp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ctpredcorp_db;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'super_admin') DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin Activity Logs Table
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  description TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE,
  INDEX idx_admin_id (admin_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Building Information Table
CREATE TABLE IF NOT EXISTS buildings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  total_floors INT,
  total_units INT,
  amenities JSON,
  images JSON,
  status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Units Table
CREATE TABLE IF NOT EXISTS units (
  id INT AUTO_INCREMENT PRIMARY KEY,
  building_id INT NOT NULL,
  unit_number VARCHAR(20) NOT NULL,
  floor INT NOT NULL,
  type ENUM('studio', '1br', '2br', '3br', 'penthouse') NOT NULL,
  size_sqm DECIMAL(10, 2),
  price DECIMAL(15, 2),
  status ENUM('available', 'reserved', 'sold') DEFAULT 'available',
  features JSON,
  images JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE,
  UNIQUE KEY unique_unit (building_id, unit_number),
  INDEX idx_building_id (building_id),
  INDEX idx_status (status),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Content Management Table
CREATE TABLE IF NOT EXISTS content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section VARCHAR(50) NOT NULL,
  key_name VARCHAR(100) NOT NULL,
  value TEXT,
  type ENUM('text', 'html', 'json', 'image', 'file') DEFAULT 'text',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT,
  FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_content (section, key_name),
  INDEX idx_section (section)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default super admin (password: Admin123! - CHANGE THIS IMMEDIATELY)
-- Password hash for 'Admin123!' - bcrypt with 10 rounds
INSERT INTO admin_users (username, email, password, role, is_active) 
VALUES (
  'superadmin',
  'admin@ctpredcorp.com',
  '$2b$10$rQVFqE3jPXPh5vPVYqHxl.F6Q9mNc8R3hYHxOZO8q.cYNGK3mK4ZS',
  'super_admin',
  true
) ON DUPLICATE KEY UPDATE username=username;

-- Insert sample building data
INSERT INTO buildings (name, description, location, total_floors, total_units, status)
VALUES (
  'CTP Red Tower',
  'Luxury residential tower in the heart of the city',
  'Metro Manila, Philippines',
  25,
  100,
  'active'
) ON DUPLICATE KEY UPDATE name=name;