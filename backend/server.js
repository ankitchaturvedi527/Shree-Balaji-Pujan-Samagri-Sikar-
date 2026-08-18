const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = new Database("pujan.db");

// Orders table
db.prepare(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    paymentMethod TEXT NOT NULL,
    paymentStatus TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Test API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Shree Balaji Pujan Samagri Backend Running"
  });
});

// Create order
app.post("/api/orders", (req, res) => {
  try {
    const { items, total, paymentMethod = "UPI", paymentStatus = "PENDING" } =
      req.body;

    if (!items || !total) {
      return res.status(400).json({
        success: false,
        message: "Items and total are required"
      });
    }

    const result = db.prepare(`
      INSERT INTO orders
      (items, total, paymentMethod, paymentStatus)
      VALUES (?, ?, ?, ?)
    `).run(
      JSON.stringify(items),
      total,
      paymentMethod,
      paymentStatus
    );

    res.json({
      success: true,
      orderId: result.lastInsertRowid,
      message: "Order saved successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to save order"
    });
  }
});

// Order history
app.get("/api/orders", (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT *
      FROM orders
      ORDER BY id DESC
    `).all();

    const formattedOrders = orders.map((order) => ({
      ...order,
      items: JSON.parse(order.items)
    }));

    res.json({
      success: true,
      orders: formattedOrders
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get orders"
    });
  }
});

// Update payment status
app.put("/api/orders/:id/payment", (req, res) => {
  try {
    const { paymentStatus } = req.body;

    db.prepare(`
      UPDATE orders
      SET paymentStatus = ?
      WHERE id = ?
    `).run(paymentStatus, req.params.id);

    res.json({
      success: true,
      message: "Payment status updated"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update payment"
    });
  }
});

app.listen(PORT, () => {
  console.log(`🪔 Shree Balaji Backend running on port ${PORT}`);
});