const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create PO from offer
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { offer_id, notes } = req.body;
    const db = req.app.get('db');

    // Get offer details
    const offerResult = await db.query(
      'SELECT * FROM offers WHERE id = $1',
      [offer_id]
    );

    if (offerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    const offer = offerResult.rows[0];

    const result = await db.query(`
      INSERT INTO purchase_orders (
        buyer_id, supplier_id, tender_id, offer_id, po_number, 
        total_amount, status, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      offer.buyer_id,
      offer.supplier_id,
      offer.tender_id,
      offer_id,
      `PO-${Date.now()}`,
      offer.total_amount,
      'pending',
      notes || null
    ]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my POs (buyer or supplier)
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const db = req.app.get('db');

    let query = `
      SELECT * FROM purchase_orders 
      WHERE buyer_id = $1 OR supplier_id = $1
    `;
    const params = [req.user.id];

    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get PO details
router.get('/:poId', authMiddleware, async (req, res) => {
  try {
    const { poId } = req.params;
    const db = req.app.get('db');

    const result = await db.query(
      'SELECT * FROM purchase_orders WHERE id = $1',
      [poId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'PO not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update PO status
router.put('/:poId/status', authMiddleware, async (req, res) => {
  try {
    const { poId } = req.params;
    const { status } = req.body;
    const db = req.app.get('db');

    const result = await db.query(`
      UPDATE purchase_orders 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [status, poId]);

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete PO
router.delete('/:poId', authMiddleware, async (req, res) => {
  try {
    const { poId } = req.params;
    const db = req.app.get('db');

    await db.query('DELETE FROM purchase_orders WHERE id = $1', [poId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
