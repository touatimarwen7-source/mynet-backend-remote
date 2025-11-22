const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get supplier features
router.get('/supplier/:supplierId', async (req, res) => {
  try {
    const { supplierId } = req.params;
    const db = req.app.get('db');

    const result = await db.query(`
      SELECT * FROM supplier_features 
      WHERE supplier_id = $1 AND is_active = true
      ORDER BY created_at DESC
    `, [supplierId]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add feature
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { supplier_id, feature_name, description } = req.body;
    const db = req.app.get('db');

    const result = await db.query(`
      INSERT INTO supplier_features (supplier_id, feature_name, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [supplier_id, feature_name, description]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete feature
router.delete('/:featureId', authMiddleware, async (req, res) => {
  try {
    const { featureId } = req.params;
    const db = req.app.get('db');

    await db.query(
      'UPDATE supplier_features SET is_active = false WHERE id = $1',
      [featureId]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
