// db.schema.js

const schemaQueries = [
    `
    CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL, 
        full_name VARCHAR(100),
        bio TEXT,
        profile_picture VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `,

    `
    CREATE TABLE IF NOT EXISTS posts (
        post_id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        image_url VARCHAR(255),
        is_published BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
    `
];

async function initializeSchema(pool) {
    console.log('--- Initializing Database Schema ---');
    try {
        for (const query of schemaQueries) {
            await pool.query(query);
        }
        console.log('✅ SCHEMA: All essential tables (users, posts) created or verified successfully in Neon.');
        return true;
    } catch (error) {
        console.error('❌ SCHEMA ERROR: Failed to create one or more tables.');
        console.error('Error Details:', error.message);
        return false;
    }
}

module.exports = {
    initializeSchema
};