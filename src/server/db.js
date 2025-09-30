const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./ecommerce.db');

const initializeDatabase = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

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

    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      products TEXT,
      total_amount REAL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

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
};

module.exports = { db, initializeDatabase };