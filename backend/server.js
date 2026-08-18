const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = new Database("pujan.db");

// =========================
// RAZORPAY
// =========================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =========================
// DATABASE
// =========================
db.prepare(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    paymentMethod TEXT NOT NULL,
    paymentStatus TEXT NOT NULL,
    razorpayOrderId TEXT,
    razorpayPaymentId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// =========================
// TEST API
// =========================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Shree Balaji Pujan Samagri Backend Running",
  });
});

// =========================
// CREATE RAZORPAY ORDER
// =========================
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `pujan_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay Create Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Razorpay order create failed",
    });
  }
});

// =========================
// SAVE ORDER
// =========================
app.post("/api/orders", (req, res) => {
  try {
    const {
      items,
      total,
      paymentMethod = "UPI",
      paymentStatus = "PENDING",
      razorpayOrderId = null,
    } = req.body;

    if (!items || !total) {
      return res.status(400).json({
        success: false,
        message: "Items and total are required",
      });
    }

    const result = db
      .prepare(`
        INSERT INTO orders
        (
          items,
          total,
          paymentMethod,
          paymentStatus,
          razorpayOrderId
        )
        VALUES (?, ?, ?, ?, ?)
      `)
      .run(
        JSON.stringify(items),
        Number(total),
        paymentMethod,
        paymentStatus,
        razorpayOrderId
      );

    res.json({
      success: true,
      orderId: result.lastInsertRowid,
      message: "Order saved successfully",
    });
  } catch (error) {
    console.error("Save Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save order",
    });
  }
});

// =========================
// VERIFY RAZORPAY PAYMENT
// =========================
app.post("/api/payment/verify", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      localOrderId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data missing",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    if (localOrderId) {
      db.prepare(`
        UPDATE orders
        SET
          paymentStatus = 'PAID',
          razorpayOrderId = ?,
          razorpayPaymentId = ?
        WHERE id = ?
      `).run(
        razorpay_order_id,
        razorpay_payment_id,
        localOrderId
      );
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Payment Verify Error:", error);

    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
});

// =========================
// ORDER HISTORY
// =========================
app.get("/api/orders", (req, res) => {
  try {
    const orders = db
      .prepare(`
        SELECT *
        FROM orders
        ORDER BY id DESC
      `)
      .all();

    const formattedOrders = orders.map((order) => ({
      ...order,
      items: JSON.parse(order.items),
    }));

    res.json({
      success: true,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("History Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get orders",
    });
  }
});

// =========================
// MANUAL PAYMENT STATUS
// =========================
app.put("/api/orders/:id/payment", (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required",
      });
    }

    db.prepare(`
      UPDATE orders
      SET paymentStatus = ?
      WHERE id = ?
    `).run(paymentStatus, req.params.id);

    res.json({
      success: true,
      message: "Payment status updated",
    });
  } catch (error) {
    console.error("Payment Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update payment",
    });
  }
});

// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
  console.log(
    `Shree Balaji Backend running on port ${PORT}`
  );
});