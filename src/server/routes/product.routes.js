const express = require('express');
const { db } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const { search, category, minPrice, maxPrice, isAccessory } = req.query;

  let query = 'SELECT * FROM products WHERE 1=1';
  let params = [];

  if (search) {
    query += ' AND (name LIKE ? OR brand LIKE ? OR description LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (isAccessory !== undefined) {
    query += ' AND isAccessory = ?';
    params.push(isAccessory === 'true' ? 1 : 0);
  }

  if (minPrice) {
    query += ' AND price >= ?';
    params.push(parseFloat(minPrice));
  }

  if (maxPrice) {
    query += ' AND price <= ?';
    params.push(parseFloat(maxPrice));
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    const products = rows.map(row => ({
      ...row,
      photos: JSON.parse(row.photos || '[]'),
      isAccessory: Boolean(row.isAccessory)
    }));

    res.json(products);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch product' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = {
      ...row,
      photos: JSON.parse(row.photos || '[]'),
      isAccessory: Boolean(row.isAccessory)
    };

    res.json(product);
  });
});

router.post('/', authenticateToken, (req, res) => {
  const { name, brand, price, description, preview, photos, isAccessory, category, stock } = req.body;

  if (!name || !brand || !price || !preview) {
    return res.status(400).json({ error: 'Required fields: name, brand, price, preview' });
  }

  db.run(
    'INSERT INTO products (name, brand, price, description, preview, photos, isAccessory, category, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, brand, price, description, preview, JSON.stringify(photos || []), isAccessory ? 1 : 0, category, stock || 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create product' });
      }

      res.status(201).json({
        message: 'Product created successfully',
        id: this.lastID
      });
    }
  );
});

router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, brand, price, description, preview, photos, isAccessory, category, stock } = req.body;

  db.run(
    'UPDATE products SET name = ?, brand = ?, price = ?, description = ?, preview = ?, photos = ?, isAccessory = ?, category = ?, stock = ? WHERE id = ?',
    [name, brand, price, description, preview, JSON.stringify(photos || []), isAccessory ? 1 : 0, category, stock, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update product' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ message: 'Product updated successfully' });
    }
  );
});

router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete product' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  });
});

module.exports = router;