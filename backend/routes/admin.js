const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// JWT Secret (should be in .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';
const JWT_EXPIRES_IN = '24h';

// ===== MIDDLEWARE: Verify JWT Token =====
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ===== MIDDLEWARE: Require Super Admin =====
const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Super admin access required' });
  }
  next();
};

// ===== MIDDLEWARE: Require Any Admin =====
const requireAdmin = (req, res, next) => {
  if (!['super_admin', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ===== LOG ACTIVITY =====
const logActivity = async (adminId, action, entityType = null, entityId = null, details = null, ipAddress = null) => {
  try {
    await db.execute(
      'INSERT INTO admin_activity_logs (admin_id, action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
      [adminId, action, entityType, entityId, JSON.stringify(details), ipAddress]
    );
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

// ===== LOG LOGIN ATTEMPT =====
const logLoginAttempt = async (adminId, success, ipAddress, userAgent, failureReason = null) => {
  try {
    await db.execute(
      'INSERT INTO admin_login_logs (admin_id, success, ip_address, user_agent, failure_reason) VALUES (?, ?, ?, ?, ?)',
      [adminId, success, ipAddress, userAgent, failureReason]
    );
  } catch (error) {
    console.error('Failed to log login attempt:', error);
  }
};

// ===== ROUTE: Login =====
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Find user
    const [users] = await db.execute(
      'SELECT id, username, email, password_hash, role, full_name, is_active FROM admin_users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      await logLoginAttempt(null, false, req.ip, req.headers['user-agent'], 'User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Check if user is active
    if (!user.is_active) {
      await logLoginAttempt(user.id, false, req.ip, req.headers['user-agent'], 'Account disabled');
      return res.status(403).json({ error: 'Account is disabled' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      await logLoginAttempt(user.id, false, req.ip, req.headers['user-agent'], 'Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await db.execute('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [user.id]);

    // Log successful login
    await logLoginAttempt(user.id, true, req.ip, req.headers['user-agent']);
    await logActivity(user.id, 'LOGIN', 'admin_users', user.id, { success: true }, req.ip);

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.full_name
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.full_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ===== ROUTE: Verify Token =====
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

// ===== ROUTE: Logout =====
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    await logActivity(req.user.id, 'LOGOUT', 'admin_users', req.user.id, null, req.ip);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// ===== ROUTE: Get All Admins (Super Admin Only) =====
router.get('/users', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const [admins] = await db.execute(
      `SELECT id, username, email, role, full_name, is_active, last_login, created_at, updated_at 
       FROM admin_users 
       ORDER BY created_at DESC`
    );
    res.json({ success: true, admins });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

// ===== ROUTE: Create Admin (Super Admin Only) =====
router.post('/users', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;

    // Validation
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (role && !['super_admin', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if username or email exists
    const [existing] = await db.execute(
      'SELECT id FROM admin_users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new admin
    const [result] = await db.execute(
      'INSERT INTO admin_users (username, email, password_hash, role, full_name, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, passwordHash, role || 'admin', fullName, req.user.id]
    );

    await logActivity(
      req.user.id,
      'CREATE_ADMIN',
      'admin_users',
      result.insertId,
      { username, email, role: role || 'admin' },
      req.ip
    );

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      adminId: result.insertId
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Failed to create admin' });
  }
});

// ===== ROUTE: Update Admin (Super Admin Only) =====
router.put('/users/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, fullName, role, isActive } = req.body;

    // Prevent super admin from disabling themselves
    if (parseInt(id) === req.user.id && isActive === false) {
      return res.status(400).json({ error: 'Cannot disable your own account' });
    }

    const updates = [];
    const values = [];

    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (fullName) {
      updates.push('full_name = ?');
      values.push(fullName);
    }
    if (role && ['super_admin', 'admin'].includes(role)) {
      updates.push('role = ?');
      values.push(role);
    }
    if (typeof isActive === 'boolean') {
      updates.push('is_active = ?');
      values.push(isActive);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.push(id);

    await db.execute(
      `UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    await logActivity(
      req.user.id,
      'UPDATE_ADMIN',
      'admin_users',
      id,
      { email, fullName, role, isActive },
      req.ip
    );

    res.json({ success: true, message: 'Admin updated successfully' });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({ error: 'Failed to update admin' });
  }
});

// ===== ROUTE: Delete Admin (Super Admin Only) =====
router.delete('/users/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent super admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Check if user exists
    const [users] = await db.execute('SELECT username FROM admin_users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    await db.execute('DELETE FROM admin_users WHERE id = ?', [id]);

    await logActivity(
      req.user.id,
      'DELETE_ADMIN',
      'admin_users',
      id,
      { username: users[0].username },
      req.ip
    );

    res.json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ error: 'Failed to delete admin' });
  }
});

// ===== ROUTE: Change Password =====
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    // Get current password hash
    const [users] = await db.execute(
      'SELECT password_hash FROM admin_users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, users[0].password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.execute(
      'UPDATE admin_users SET password_hash = ? WHERE id = ?',
      [newPasswordHash, req.user.id]
    );

    await logActivity(
      req.user.id,
      'CHANGE_PASSWORD',
      'admin_users',
      req.user.id,
      null,
      req.ip
    );

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// ===== ROUTE: Get Activity Logs (Admin Access) =====
router.get('/logs/activity', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const [logs] = await db.execute(
      `SELECT al.*, au.username, au.full_name 
       FROM admin_activity_logs al
       JOIN admin_users au ON al.admin_id = au.id
       ORDER BY al.created_at DESC
       LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );

    res.json({ success: true, logs });
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

// ===== ROUTE: Get Login Logs (Admin Access) =====
router.get('/logs/login', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const [logs] = await db.execute(
      `SELECT ll.*, au.username, au.full_name 
       FROM admin_login_logs ll
       JOIN admin_users au ON ll.admin_id = au.id
       ORDER BY ll.login_time DESC
       LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );

    res.json({ success: true, logs });
  } catch (error) {
    console.error('Get login logs error:', error);
    res.status(500).json({ error: 'Failed to fetch login logs' });
  }
});

module.exports = router;
module.exports.authenticateToken = authenticateToken;
module.exports.requireSuperAdmin = requireSuperAdmin;
module.exports.requireAdmin = requireAdmin;