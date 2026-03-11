-- Create settings table for global website settings
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type ENUM('boolean', 'string', 'number', 'json') DEFAULT 'string',
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT,
  FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL
);

-- Insert default settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) 
VALUES 
  ('show_unit_prices', 'true', 'boolean', 'Show or hide unit prices on the website'),
  ('show_contact_info', 'true', 'boolean', 'Show or hide contact information'),
  ('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode')
ON DUPLICATE KEY UPDATE setting_key=setting_key;
