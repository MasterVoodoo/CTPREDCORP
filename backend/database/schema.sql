-- CTP RED Corp Database Schema
-- MySQL Database for CTP RED WEBSITE

-- Create database
CREATE DATABASE IF NOT EXISTS ctpredcorp_db;
USE ctpredcorp_db;

-- ===== BUILDINGS TABLE =====
CREATE TABLE IF NOT EXISTS buildings (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  short_location VARCHAR(255) NOT NULL,
  description JSON,
  stats JSON,
  building_hours JSON,
  contact JSON,
  hero_image VARCHAR(500),
  badge VARCHAR(100),
  cta_title VARCHAR(255),
  cta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===== BUILDING FEATURES TABLE =====
CREATE TABLE IF NOT EXISTS building_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  building_id VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE
);

-- ===== BUILDING FLOOR PLANS TABLE =====
CREATE TABLE IF NOT EXISTS building_floor_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  building_id VARCHAR(50) NOT NULL,
  floor INT NOT NULL,
  units INT NOT NULL,
  total_sqft INT NOT NULL,
  available INT NOT NULL,
  `condition` ENUM('Bare', 'Warm Shell', 'Fitted') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE
);

-- ===== UNITS TABLE =====
CREATE TABLE IF NOT EXISTS units (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  building VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  floor INT NOT NULL,
  size INT NOT NULL,
  capacity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  status ENUM('Available', 'Coming Soon', 'Taken', 'Unavailable') NOT NULL DEFAULT 'Available',
  `condition` ENUM('Bare', 'Warm Shell', 'Fitted') NOT NULL,
  image VARCHAR(500),
  images JSON,
  description TEXT,
  floor_plan JSON,
  availability JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_building (building),
  INDEX idx_status (status),
  INDEX idx_floor (floor)
);

-- ===== FINANCIAL DATA TABLE =====
CREATE TABLE IF NOT EXISTS financial_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year INT NOT NULL,
  quarter INT NOT NULL,
  revenue DECIMAL(15, 2) NOT NULL,
  expenses DECIMAL(15, 2) NOT NULL,
  net_income DECIMAL(15, 2) NOT NULL,
  occupancy_rate DECIMAL(5, 2),
  total_units INT,
  leased_units INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_year_quarter (year, quarter)
);

-- ===== INDEXES FOR PERFORMANCE =====
CREATE INDEX idx_building_id ON building_features(building_id);
CREATE INDEX idx_floor_plan_building ON building_floor_plans(building_id);
CREATE INDEX idx_financial_year ON financial_data(year);
CREATE INDEX idx_financial_quarter ON financial_data(quarter);