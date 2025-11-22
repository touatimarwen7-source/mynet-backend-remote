#!/usr/bin/env node

const { initializeDb, getPool } = require('../config/db');
const { initializeSchema } = require('../config/schema');

async function initDatabase() {
  try {
    console.log('🔧 Starting database initialization...');
    
    // Initialize connection pool
    const connected = await initializeDb();
    if (!connected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }
    
    const pool = getPool();
    
    // Create all tables
    console.log('📊 Creating database tables...');
    await initializeSchema(pool);
    console.log('✅ Database tables created successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };
