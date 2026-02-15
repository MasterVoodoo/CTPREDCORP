const bcrypt = require('bcrypt');
const readline = require('readline');
const { promisePool } = require('../config/database');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

const setupSuperAdmin = async () => {
  console.log('\n=== CTP RED CORP - Super Admin Setup ===\n');

  try {
    // Get user input
    const username = await question('Enter super admin username: ');
    const fullName = await question('Enter full name: ');
    const email = await question('Enter email: ');

    console.log('\nPassword must be at least 8 characters long.');
    const password = await question('Enter password: ');
    const confirmPassword = await question('Confirm password: ');

    // Validation
    if (!username || !fullName || !email || !password) {
      console.error('\n❌ All fields are required!');
      rl.close();
      process.exit(1);
    }

    if (password !== confirmPassword) {
      console.error('\n❌ Passwords do not match!');
      rl.close();
      process.exit(1);
    }

    if (password.length < 8) {
      console.error('\n❌ Password must be at least 8 characters long!');
      rl.close();
      process.exit(1);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('\n❌ Invalid email format!');
      rl.close();
      process.exit(1);
    }

    console.log('\nConnecting to database...');

    // Check if super admin already exists
    const [existingAdmins] = await promisePool.query(
      'SELECT id FROM admin_users WHERE role = "super_admin"'
    );

    if (existingAdmins.length > 0) {
      console.log('\n⚠️  A super admin already exists in the system.');
      const overwrite = await question('Do you want to create another super admin? (yes/no): ');
      if (overwrite.toLowerCase() !== 'yes') {
        console.log('\nSetup cancelled.');
        rl.close();
        process.exit(0);
      }
    }

    // Check if username or email already exists
    const [existing] = await promisePool.query(
      'SELECT id FROM admin_users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      console.error('\n❌ Username or email already exists!');
      rl.close();
      process.exit(1);
    }

    console.log('Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);

    console.log('Creating super admin account...');
    const [result] = await promisePool.query(
      'INSERT INTO admin_users (username, email, password_hash, role, full_name, is_active) VALUES (?, ?, ?, "super_admin", ?, 1)',
      [username, email, passwordHash, fullName]
    );

    console.log('\n✅ Super admin account created successfully!');
    console.log('\n=== Account Details ===');
    console.log(`ID: ${result.insertId}`);
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Full Name: ${fullName}`);
    console.log(`Role: super_admin`);
    console.log('\n⚠️  IMPORTANT: Please keep your credentials secure!');
    console.log('You can now log in at: http://localhost:5173/#admin-login\n');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating super admin:', error.message);
    rl.close();
    process.exit(1);
  }
};

setupSuperAdmin();