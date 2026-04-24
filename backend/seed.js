const User = require('./src/models/User');
const { db, db_run } = require('./src/database');

const seedDatabase = async () => {
  try {
    console.log('Seeding database with demo users...');

    // Create admin user
    try {
      await User.create(
        'admin@smartseason.com',
        'password123',
        'Admin',
        'Coordinator',
        'admin'
      );
      console.log('✓ Created admin user: admin@smartseason.com');
    } catch (err) {
      console.log('Admin user already exists or error:', err.message);
    }

    // Create agent user
    try {
      await User.create(
        'agent@smartseason.com',
        'password123',
        'Field',
        'Agent',
        'agent'
      );
      console.log('✓ Created agent user: agent@smartseason.com');
    } catch (err) {
      console.log('Agent user already exists or error:', err.message);
    }

    console.log('\nDemo users created successfully!');
    console.log('Login with:');
    console.log('  Admin: admin@smartseason.com / password123');
    console.log('  Agent: agent@smartseason.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
