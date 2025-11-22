const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all feature flags
router.get('/', async (req, res) => {
  try {
    const db = req.app.get('db');
    const result = await db.query(
      'SELECT * FROM feature_flags WHERE is_active = true ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if feature is enabled
router.get('/:featureName', async (req, res) => {
  try {
    const { featureName } = req.params;
    const db = req.app.get('db');

    const result = await db.query(
      'SELECT * FROM feature_flags WHERE name = $1',
      [featureName]
    );

    if (result.rows.length === 0) {
      return res.json({ enabled: false });
    }

    res.json({ enabled: result.rows[0].is_active });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Toggle feature
router.put('/:featureName', authMiddleware, async (req, res) => {
  try {
    const { featureName } = req.params;
    const { is_active } = req.body;
    const db = req.app.get('db');

    // Check admin
    const userResult = await db.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows[0].role !== 'admin' && userResult.rows[0].role !== 'super_admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await db.query(`
      UPDATE feature_flags 
      SET is_active = $1, updated_at = CURRENT_TIMESTAMP
      WHERE name = $2
      RETURNING *
    `, [is_active, featureName]);

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
