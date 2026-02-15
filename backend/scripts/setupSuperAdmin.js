/**
 * Setup Script: Create Initial Super Admin Account
 * Run this script once to create the first super admin user
 * 
 * Usage: node backend/scripts/setupSuperAdmin.js
 */

const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ctpredcorp_db'
};

async function setupSuperAdmin() {
  let connection;

  try {
    console.log('\n=== CTP RED CORP - Super Admin Setup ===\n');

    // Get super admin details
    const username = await question('Enter super admin username: ');
    const fullName = await question('Enter full name: ');
    const email = await question('Enter email: ');
    
    console.log('\nPassword must be at least 8 characters long.');
    const password = await question('Enter password: ');
    const confirmPassword = await question('Confirm password: ');

    // Validation
    if (!username || !fullName || !email || !password) {
      console.error('\nError: All fields are required!');
      rl.close();
      process.exit(1);
    }

    if (password !== confirmPassword) {
      console.error('\nError: Passwords do not match!');
      rl.close();
      process.exit(1);
    }

    if (password.length < 8) {
      console.error('\nError: Password must be at least 8 characters!');
      rl.close();
      process.exit(1);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('\nError: Invalid email format!');
      rl.close();
      process.exit(1);
    }

    console.log('\n\nConnecting to database...');
    connection = await mysql.createConnection(dbConfig);

    // Check if super admin already exists
    const [existing] = await connection.execute(
      'SELECT id, username FROM admin_users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      console.error(`\nError: A user with username "${username}" or email "${email}" already exists!`);
      rl.close();
      await connection.end();
      process.exit(1);
    }

    // Hash password
    console.log('\nHashing password...');
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert super admin
    console.log('Creating super admin account...');
    const [result] = await connection.execute(
      'INSERT INTO admin_users (username, email, password_hash, role, full_name, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, passwordHash, 'super_admin', fullName, true]
    );

    console.log('\n✅ Super admin account created successfully!');
    console.log('\n=== Account Details ===');
    console.log(`ID: ${result.insertId}`);
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Full Name: ${fullName}`);
    console.log(`Role: super_admin`);
    console.log('\n⚠️  IMPORTANT: Please keep your credentials secure!');
    console.log('You can now log in at: http://localhost:5173/admin/login');
    console.log('\n');

    rl.close();
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    if (connection) await connection.end();
    process.exit(1);
  }
}

setupSuperAdmin();