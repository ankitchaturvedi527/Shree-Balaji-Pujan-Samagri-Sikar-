import { useMemo, useState } from "react";
import QRCode from "qrcode";
import "./App.css";

const API_URL =
  "https://shree-balaji-pujan-samagri-sikar-backend.onrender.com";

const products = [
  { id: 1, name: "पूजा दीपक", english: "Premium Puja Diya", price: 50, icon: "🪔" },
  { id: 2, name: "मिट्टी के दीये", english: "Clay Diyas Pack", price: 40, icon: "🪔" },
  { id: 3, name: "पीतल का दीपक", english: "Brass Puja Diya", price: 250, icon: "🪔" },
  { id: 4, name: "रूई की बाती", english: "Cotton Puja Wicks", price: 30, icon: "🕯️" },
  { id: 5, name: "लंबी बाती", english: "Long Cotton Wicks", price: 40, icon: "🕯️" },
  { id: 6, name: "रोली कुमकुम", english: "Premium Roli Kumkum", price: 40, icon: "🌺" },
  { id: 7, name: "चंदन पाउडर", english: "Sandalwood Powder", price: 60, icon: "🌿" },
  { id: 8, name: "हल्दी पाउडर", english: "Puja Haldi", price: 40, icon: "💛" },
  { id: 9, name: "अक्षत चावल", english: "Puja Akshat Rice", price: 30, icon: "🌾" },
  { id: 10, name: "सिंदूर", english: "Premium Sindoor", price: 35, icon: "🔴" },
  { id: 11, name: "पूजा कपूर", english: "Pure Camphor", price: 80, icon: "🕯️" },
  { id: 12, name: "कपूर टिकिया", english: "Camphor Tablets", price: 50, icon: "🕯️" },
  { id: 13, name: "धूप बत्ती", english: "Premium Dhoop Sticks", price: 60, icon: "🌿" },
  { id: 14, name: "अगरबत्ती", english: "Premium Agarbatti", price: 50, icon: "🌸" },
  { id: 15, name: "लोबान", english: "Pure Loban", price: 80, icon: "🌿" },
  { id: 16, name: "हवन सामग्री", english: "Complete Hawan Samagri", price: 150, icon: "🌿" },
  { id: 17, name: "हवन सामग्री 500 ग्राम", english: "Hawan Samagri 500g", price: 120, icon: "🔥" },
  { id: 18, name: "हवन सामग्री 1 किलो", english: "Hawan Samagri 1kg", price: 220, icon: "🔥" },
  { id: 19, name: "गुग्गुल", english: "Pure Guggal", price: 100, icon: "🌿" },
  { id: 20, name: "हवन कपूर", english: "Hawan Camphor", price: 100, icon: "🔥" },
  { id: 21, name: "मौली कलावा", english: "Puja Kalawa", price: 30, icon: "🧵" },
  { id: 22, name: "नारियल", english: "Puja Coconut", price: 40, icon: "🥥" },
  { id: 23, name: "सुपारी", english: "Puja Supari", price: 50, icon: "🫘" },
  { id: 24, name: "लौंग", english: "Cloves for Puja", price: 50, icon: "🌿" },
  { id: 25, name: "इलायची", english: "Cardamom for Puja", price: 70, icon: "🌿" },
  { id: 26, name: "पान के पत्ते", english: "Betel Leaves", price: 30, icon: "🍃" },
  { id: 27, name: "पूजा फूल माला", english: "Puja Flower Garland", price: 60, icon: "🌺" },
  { id: 28, name: "माता की चुनरी", english: "Mata Chunri", price: 100, icon: "🙏" },
  { id: 29, name: "पूजा आसन", english: "Puja Aasan", price: 150, icon: "🛕" },
  { id: 30, name: "पूजा थाली", english: "Puja Thali", price: 350, icon: "🥘" },
  { id: 31, name: "पीतल की घंटी", english: "Brass Puja Bell", price: 180, icon: "🔔" },
  { id: 32, name: "शंख", english: "Puja Shankh", price: 250, icon: "🐚" },
  { id: 33, name: "कलश", english: "Puja Kalash", price: 200, icon: "🏺" },
  { id: 34, name: "मंगल कलश सेट", english: "Mangal Kalash Set", price: 350, icon: "🏺" },
  { id: 35, name: "रुद्राक्ष माला", english: "Rudraksha Mala", price: 150, icon: "📿" },
  { id: 36, name: "तुलसी माला", english: "Tulsi Mala", price: 120, icon: "📿" },
  { id: 37, name: "हनुमान जी की तस्वीर", english: "Hanuman Ji Photo", price: 100, icon: "🙏" },
  { id: 38, name: "श्री गणेश जी की तस्वीर", english: "Shree Ganesh Ji Photo", price: 100, icon: "🙏" },
  { id: 39, name: "सामान्य पूजा किट", english: "Basic Puja Kit", price: 199, icon: "🛕" },
  { id: 40, name: "गणेश पूजा किट", english: "Ganesh Puja Kit", price: 299, icon: "🐘" },
  { id: 41, name: "सत्यनारायण पूजा किट", english: "Satyanarayan Puja Kit", price: 499, icon: "🙏" },
  { id: 42, name: "गृह प्रवेश पूजा किट", english: "Griha Pravesh Puja Kit", price: 599, icon: "🏠" },
  { id: 43, name: "हवन पूजा किट", english: "Complete Hawan Kit", price: 399, icon: "🔥" },
  { id: 44, name: "नवरात्रि पूजा किट", english: "Navratri Puja Kit", price: 449, icon: "🙏" },
  { id: 45, name: "शिव पूजा किट", english: "Shiv Puja Kit", price: 349, icon: "🔱" },
  { id: 46, name: "हनुमान पूजा किट", english: "Hanuman Puja Kit", price: 299, icon: "🙏" },
];

function App() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [upiQR, setUpiQR] = useState("");
  const [message, setMessage] = useState("");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.english.toLowerCase().includes(query)
    );
  }, [search]);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  };

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // CREATE ORDER
  const createOrder = async () => {
    if (cart.length === 0) {
      alert("Cart empty hai.");
      return null;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          total: cartTotal,
          paymentMethod: "UPI",
          paymentStatus: "PENDING",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Order create failed");
      }

      setMessage(
        `✅ Order #${data.orderId} created successfully`
      );

      return data.orderId;
    } catch (error) {
      console.error("Create Order Error:", error);

      alert(
        "Order create nahi hua. Backend connection check karo."
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // ORDER HISTORY
  const loadOrderHistory = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/orders`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "History load failed");
      }

      const orderList = Array.isArray(data)
        ? data
        : data.orders || [];

      setOrders(orderList);
      setHistoryOpen(true);
    } catch (error) {
      console.error("History Error:", error);

      alert(
        "Order history load nahi ho rahi. Backend check karo."
      );
    } finally {
      setLoading(false);
    }
  };

  // UPI PAYMENT
  const handleUPIPayment = async () => {
    if (cart.length === 0) {
      alert("Cart empty hai.");
      return;
    }

    const orderId = await createOrder();

    if (!orderId) return;

    try {
      const upiId = "8441907320@ybl";

      const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&am=${Number(cartTotal).toFixed(2)}&cu=INR`;

      // Generate QR
      const qrCodeDataUrl = await QRCode.toDataURL(upiUrl);

      setUpiQR(qrCodeDataUrl);

      /*
       * QR ko pehle screen par dikhayenge.
       * Direct window.location karne se desktop browser
       * par QR screen immediately disappear ho sakti hai.
       *
       * Mobile par "Open UPI App" button se UPI app open hoga.
       */
    } catch (error) {
      console.error("UPI QR Error:", error);

      alert("UPI QR Code generate nahi ho paya.");
    }
  };

  // OPEN UPI APP
  const openUPIApp = () => {
    const upiId = "8441907320@ybl";

    const upiUrl =
      `upi://pay?pa=${encodeURIComponent(upiId)}` +
      `&pn=${encodeURIComponent(
        "Shree Balaji Pujan Samagri"
      )}` +
      `&am=${Number(cartTotal).toFixed(2)}` +
      `&cu=INR`;

    window.location.href = upiUrl;
  };

  // WHATSAPP ORDER
  const handleWhatsAppOrder = async () => {
    if (cart.length === 0) {
      alert("Cart empty hai.");
      return;
    }

    const orderId = await createOrder();

    if (!orderId) return;

    const orderText = cart
      .map(
        (item) =>
          `${item.name} x ${item.quantity} = ₹${
            item.price * item.quantity
          }`
      )
      .join("\n");

    const whatsappMessage =
      `🪔 Shree Balaji Pujan Samagri Order\n\n` +
      `Order ID: #${orderId}\n\n` +
      `${orderText}\n\n` +
      `Total: ₹${cartTotal}`;

    const shopWhatsAppNumber = "919314348248";

    const whatsappUrl =
      `https://wa.me/${shopWhatsAppNumber}?text=` +
      encodeURIComponent(whatsappMessage);

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="brand">
          <div className="brand-icon">🪔</div>

          <div>
            <h1>Shree Balaji</h1>
            <p>Pujan Samagri Sikar</p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            className="cart"
            type="button"
            onClick={loadOrderHistory}
            disabled={loading}
          >
            📜 History
          </button>

          <button
            className="cart"
            type="button"
            onClick={() => setCartOpen(true)}
          >
            🛒 Cart <span>{totalItems}</span>
          </button>
        </div>
      </header>

      {/* MESSAGE */}
      {message && (
        <div
          style={{
            padding: "12px",
            margin: "10px",
            background: "#e8f5e9",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <p className="welcome">🙏 जय श्री राम 🙏</p>

          <h2>
            पूजा सामग्री की
            <br />
            <span>हर जरूरत एक जगह</span>
          </h2>

          <p>
            शुद्ध एवं गुणवत्तापूर्ण पूजा सामग्री
            <br />
            आपके घर तक।
          </p>

          <button
            className="hero-button"
            type="button"
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            🛍️ खरीदारी शुरू करें
          </button>
        </div>

        <div className="hero-diya">🪔</div>
      </section>

      {/* PRODUCTS */}
      <section
        className="shop-section"
        id="products"
      >
        <div className="section-heading">
          <div>
            <p className="small-title">
              OUR COLLECTION
            </p>

            <h2>पूजा सामग्री</h2>
          </div>

          <div className="product-count">
            {filteredProducts.length} Products
          </div>
        </div>

        <div className="search-box">
          <span>🔍</span>

          <input
            type="text"
            placeholder="पूजा सामग्री खोजें..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div
              className="product-card"
              key={product.id}
            >
              <button
                className="heart"
                type="button"
                aria-label={`Favorite ${product.name}`}
              >
                ♡
              </button>

              <div className="product-icon">
                {product.icon}
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>

                <p>{product.english}</p>

                <div className="product-bottom">
                  <strong>
                    ₹{product.price}
                  </strong>

                  <button
                    className="add-button"
                    type="button"
                    onClick={() =>
                      addToCart(product)
                    }
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-results">
            😔 कोई product नहीं मिला
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="contact-footer">
        <div className="contact-footer-content">
          <div className="contact-business">
            <div className="footer-icon">🪔</div>

            <h2>
              Shree Balaji Pujan Samagri
            </h2>

            <p className="footer-location">
              📍 Sikar, Rajasthan
            </p>

            <p className="footer-address">
              Court Road, Near Aanad Restaurant,
              <br />
              Sikar, Rajasthan
            </p>
          </div>

          <div className="contact-details">
            <h3>📞 Contact Details</h3>

            <a href="tel:9314348248">
              👤 Purushottam Chaturvedi
              <br />
              <span>9314348248</span>
            </a>

            <a href="tel:7023592846">
              👤 Ankit Chaturvedi
              <br />
              <span>7023592846</span>
            </a>

            <a href="tel:8441907320">
              📱 Contact Number
              <br />
              <span>8441907320</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>🙏 जय श्री राम 🙏</p>

          <p>
            © 2026 Shree Balaji Pujan Samagri.
            All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* CART BAR */}
      {cart.length > 0 && (
        <div className="cart-bar">
          <div>
            🛒 <strong>{totalItems}</strong> items
          </div>

          <div>
            Total:{" "}
            <strong>₹{cartTotal}</strong>
          </div>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
          >
            View Cart →
          </button>
        </div>
      )}

      {/* CART */}
      {cartOpen && (
        <div
          className="cart-overlay"
          onClick={() => setCartOpen(false)}
        >
          <div
            className="cart-panel"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="cart-header">
              <h2>🛒 Your Cart</h2>

              <button
                className="close-cart"
                type="button"
                onClick={() =>
                  setCartOpen(false)
                }
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <div>🛒</div>

                <h3>Your cart is empty</h3>

                <p>
                  पूजा सामग्री cart में add करें।
                </p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div
                      className="cart-item"
                      key={item.id}
                    >
                      <div className="cart-item-icon">
                        {item.icon}
                      </div>

                      <div className="cart-item-info">
                        <h3>{item.name}</h3>

                        <p>
                          ₹{item.price} each
                        </p>

                        <div className="quantity">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                -1
                              )
                            }
                          >
                            −
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-total">
                        <strong>
                          ₹
                          {item.price *
                            item.quantity}
                        </strong>

                        <button
                          className="remove-btn"
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.id
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-total">
                  <span>Total</span>

                  <strong>
                    ₹{cartTotal}
                  </strong>
                </div>

                {/* UPI */}
                <button
                  className="whatsapp-order"
                  type="button"
                  onClick={handleUPIPayment}
                  disabled={loading}
                >
                  {loading
                    ? "Creating Order..."
                    : `💳 Pay ₹${cartTotal} by UPI`}
                </button>

                {/* QR */}
                {upiQR && (
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "15px",
                      padding: "15px",
                      border: "1px solid #ddd",
                      borderRadius: "12px",
                      background: "#fff",
                    }}
                  >
                    <h3>📱 Scan & Pay</h3>

                    <p>
                      UPI ID:{" "}
                      <strong>
                        8441907320@ybl
                      </strong>
                    </p>

                    <img
                      src={upiQR}
                      alt="UPI Payment QR Code"
                      style={{
                        width: "220px",
                        height: "220px",
                        maxWidth: "100%",
                      }}
                    />

                    <p
                      style={{
                        marginTop: "10px",
                      }}
                    >
                      Amount:{" "}
                      <strong>
                        ₹{cartTotal}
                      </strong>
                    </p>

                    <p
                      style={{
                        fontSize: "13px",
                        color: "#666",
                      }}
                    >
                      Google Pay / PhonePe /
                      Paytm से QR scan करें
                    </p>

                    <button
                      type="button"
                      className="whatsapp-order"
                      onClick={openUPIApp}
                      style={{
                        marginTop: "10px",
                      }}
                    >
                      📱 Open UPI App
                    </button>
                  </div>
                )}

                {/* WHATSAPP */}
                <button
                  type="button"
                  className="whatsapp-order"
                  onClick={
                    handleWhatsAppOrder
                  }
                  disabled={loading}
                  style={{
                    marginTop: "10px",
                  }}
                >
                  📲 Order on WhatsApp
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ORDER HISTORY */}
      {historyOpen && (
        <div
          className="cart-overlay"
          onClick={() =>
            setHistoryOpen(false)
          }
        >
          <div
            className="cart-panel"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="cart-header">
              <h2>📜 Order History</h2>

              <button
                className="close-cart"
                type="button"
                onClick={() =>
                  setHistoryOpen(false)
                }
              >
                ✕
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="empty-cart">
                <div>📦</div>

                <h3>No orders yet</h3>

                <p>
                  अभी कोई order नहीं है।
                </p>
              </div>
            ) : (
              <div className="cart-items">
                {orders.map((order) => (
                  <div
                    className="cart-item"
                    key={order.id}
                    style={{
                      display: "block",
                      marginBottom: "15px",
                    }}
                  >
                    <h3>
                      🧾 Order #{order.id}
                    </h3>

                    <p>
                      💰 Total:{" "}
                      <strong>
                        ₹{order.total}
                      </strong>
                    </p>

                    <p>
                      💳 Payment:{" "}
                      <strong>
                        {order.paymentMethod ||
                          "UPI"}
                      </strong>
                    </p>

                    <p>
                      Status:{" "}
                      <strong>
                        {order.paymentStatus ||
                          order.status ||
                          "PENDING"}
                      </strong>
                    </p>

                    <p>
                      📅{" "}
                      {order.createdAt ||
                        "N/A"}
                    </p>

                    <hr />

                    {Array.isArray(
                      order.items
                    ) &&
                      order.items.map(
                        (item) => (
                          <p key={item.id}>
                            {item.icon}{" "}
                            {item.name} ×{" "}
                            {item.quantity}
                          </p>
                        )
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;