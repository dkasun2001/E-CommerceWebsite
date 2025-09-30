const express = require('express');
const { db } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, (req, res) => {
  const { products, totalAmount } = req.body;
  const userId = req.user.id;

  db.run(
    'INSERT INTO orders (user_id, products, total_amount) VALUES (?, ?, ?)',
    [userId, JSON.stringify(products), totalAmount],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create order' });
      }

      res.status(201).json({
        message: 'Order created successfully',
        orderId: this.lastID
      });
    }
  );
});

router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch orders' });
      }

      const orders = rows.map(row => ({
        ...row,
        products: JSON.parse(row.products || '[]')
      }));

      res.json(orders);
    }
  );
});

module.exports = router;