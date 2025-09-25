const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Database setup
const db = new sqlite3.Database('./ecommerce.db');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    preview TEXT NOT NULL,
    photos TEXT,
    isAccessory BOOLEAN DEFAULT 0,
    category TEXT,
    stock INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    products TEXT,
    total_amount REAL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Insert sample products if table is empty
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (row.count === 0) {
      const sampleProducts = [
        {
          name: "Stylish T-Shirt",
          brand: "Fashion Brand",
          price: 29.99,
          description: "Comfortable cotton t-shirt perfect for casual wear",
          preview: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
          photos: JSON.stringify([
            "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
            "https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg"
          ]),
          isAccessory: 0,
          category: "clothing",
          stock: 50
        },
        {
          name: "Classic Jeans",
          brand: "Denim Co",
          price: 79.99,
          description: "High-quality denim jeans with perfect fit",
          preview: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg",
          photos: JSON.stringify([
            "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg"
          ]),
          isAccessory: 0,
          category: "clothing",
          stock: 30
        },
        {
          name: "Leather Watch",
          brand: "TimeKeeper",
          price: 199.99,
          description: "Elegant leather watch for professionals",
          preview: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg",
          photos: JSON.stringify([
            "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg"
          ]),
          isAccessory: 1,
          category: "accessories",
          stock: 25
        }
      ];

      const stmt = db.prepare(`INSERT INTO products (name, brand, price, description, preview, photos, isAccessory, category, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      sampleProducts.forEach(product => {
        stmt.run(product.name, product.brand, product.price, product.description, product.preview, product.photos, product.isAccessory, product.category, product.stock);
      });
      stmt.finalize();
    }
  });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: 'Registration failed' });
        }

        const token = jwt.sign(
          { id: this.lastID, username, email },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.status(201).json({
          message: 'User registered successfully',
          token,
          user: { id: this.lastID, username, email }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ error: 'Server error' });
        }

        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
          { id: user.id, username: user.username, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          message: 'Login successful',
          token,
          user: { id: user.id, username: user.username, email: user.email }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Product Routes
app.get('/api/products', (req, res) => {
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

app.get('/api/products/:id', (req, res) => {
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

app.post('/api/products', authenticateToken, (req, res) => {
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

app.put('/api/products/:id', authenticateToken, (req, res) => {
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

app.delete('/api/products/:id', authenticateToken, (req, res) => {
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

// Order Routes
app.post('/api/orders', authenticateToken, (req, res) => {
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

app.get('/api/orders', authenticateToken, (req, res) => {
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

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});