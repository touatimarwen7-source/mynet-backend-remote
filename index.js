// index.js
const express = require('express');
const { getPool } = require('./db.config');

const app = express();

// Core Middlewares
app.use(express.json()); 

// Health Check / Main Route
app.get('/', async (req, res) => {
    try {
        const pool = getPool();
        const connection = await pool.connect();
        connection.release(); // Return connection to the pool

        res.status(200).json({
            status: 'Running',
            message: 'MyNet.tn Backend API is Running!',
            database: 'Connected to Neon PostgreSQL'
        });
    } catch (error) {
        res.status(503).json({
            status: 'Error',
            message: 'API is running, but database connection failed!',
            error: 'Database connection check failed.'
        });
    }
});


// Export the application
module.exports = app;