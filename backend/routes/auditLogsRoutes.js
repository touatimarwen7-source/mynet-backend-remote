const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Log an action (used internally)
const logAction = async (db, userId, action, entityType, entityId, details = {}) => {
  try {
    await db.query(`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
      VALUES ($1, $2, $3, $4, $5)
    `, [userId, action, entityType, entityId, JSON.stringify(details)]);
  } catch (error) {
    console.error('Error logging action:', error);
  }
};

// Get audit logs (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { entity_type, user_id, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const db = req.app.get('db');

    // Check if admin
    const userResult = await db.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows[0].role !== 'admin' && userResult.rows[0].role !== 'super_admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    let query = 'SELECT * FROM audit_logs WHERE 1=1';
    const params = [];

    if (entity_type) {
      query += ` AND entity_type = $${params.length + 1}`;
      params.push(entity_type);
    }

    if (user_id) {
      query += ` AND user_id = $${params.length + 1}`;
      params.push(user_id);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user activity
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const db = req.app.get('db');

    const result = await db.query(`
      SELECT * FROM audit_logs 
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export logs helper
router.logAction = logAction;

module.exports = router;
