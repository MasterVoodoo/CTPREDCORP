-- Migration: Fix admin_login_logs to allow NULL admin_id
-- This allows logging failed login attempts for non-existent users

USE ctpredcorp_db;

-- Drop foreign key constraint first
ALTER TABLE admin_login_logs DROP FOREIGN KEY admin_login_logs_ibfk_1;

-- Modify admin_id to allow NULL
ALTER TABLE admin_login_logs MODIFY COLUMN admin_id INT NULL;

-- Re-add foreign key constraint
ALTER TABLE admin_login_logs 
ADD CONSTRAINT admin_login_logs_ibfk_1 
FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE;

-- Verify the change
SELECT 
  COLUMN_NAME,
  IS_NULLABLE,
  COLUMN_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'ctpredcorp_db'
  AND TABLE_NAME = 'admin_login_logs'
  AND COLUMN_NAME = 'admin_id';