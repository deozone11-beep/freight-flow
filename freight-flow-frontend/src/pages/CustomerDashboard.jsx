import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import LiveTrackMap from "../components/LiveTrackMap";
import "../css/shipments.css";
import "../css/logistics.css";
import {
  listMyProducts,
  createProduct,
  getQuote,
  createRentalOrder,
  listMyRentalOrders,
  getPickupTaskForOrder,
} from "../api/rental";
import { listWarehouses } from "../api/delivery";

function CustomerDashboard() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({ name: "", category: "", unit: "unit", description: "" });

  const [orderForm, setOrderForm] = useState({
    productId: "",
    quantity: 10,
    packType: "DAILY",
    duration: 7,
    warehouseId: "",
    pickupAddress: "",
  });
  const [quote, setQuote] = useState(null);
  const [quoteError, setQuoteError] = useState("");
  const [trackingFor, setTrackingFor] = useState(null); // orderId currently being tracked
  const [trackingId, setTrackingId] = useState(null);

  const load = () => {
    listMyProducts().then(setProducts).catch(() => {});
    listWarehouses().then(setWarehouses).catch(() => {});
    listMyRentalOrders().then(setOrders).catch(() => {});
  };

  useEffect(load, []);

  const saveProduct = async () => {
    if (!productForm.name) return alert("Product name is required");
    try {
      await createProduct(productForm);
      setShowProductModal(false);
      setProductForm({ name: "", category: "", unit: "unit", description: "" });
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Could not save product");
    }
  };

  const runQuote = async () => {
    setQuoteError("");
    setQuote(null);
    if (!orderForm.productId) return;
    try {
      const q = await getQuote({
        productId: Number(orderForm.productId),
        quantity: Number(orderForm.quantity),
        packType: orderForm.packType,
        duration: Number(orderForm.duration),
      });
      setQuote(q);
    } catch (err) {
      setQuoteError(err.response?.data?.error || "No pricing plan available for this pack type yet.");
    }
  };

  const placeOrder = async () => {
    try {
      await createRentalOrder({
        ...orderForm,
        productId: Number(orderForm.productId),
        quantity: Number(orderForm.quantity),
        duration: Number(orderForm.duration),
        warehouseId: orderForm.warehouseId ? Number(orderForm.warehouseId) : null,
      });
      setQuote(null);
      setOrderForm({ ...orderForm, productId: "", pickupAddress: "" });
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Could not place rental order");
    }
  };

  const openTracking = async (order) => {
    setTrackingFor(order.id);
    try {
      const task = await getPickupTaskForOrder(order.id);
      setTrackingId(task.trackingId);
    } catch {
      setTrackingId(null);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar title="My Storage & Rentals" />

        <div className="logi-page">
          <div className="logi-section">
            <h3>1. My Products</h3>
            <div className="shipment-toolbar" style={{ marginBottom: 12 }}>
              <span style={{ opacity: 0.7, fontSize: "0.85rem" }}>
                Add a product here first, then rent storage space for it below.
              </span>
              <button className="save-btn add-new-btn" onClick={() => setShowProductModal(true)}>
                + Add Product
              </button>
            </div>
            <div className="logi-grid">
              {products.map((p) => (
                <div key={p.id} className="logi-quote-box">
                  <strong>{p.name}</strong>
                  <div style={{ fontSize: "0.78rem", opacity: 0.75 }}>
                    {p.category || "—"} · unit: {p.unit}
                  </div>
                </div>
              ))}
              {products.length === 0 && <p style={{ opacity: 0.6 }}>No products yet.</p>}
            </div>
          </div>

          <div className="logi-section">
            <h3>2. Rent Storage Space</h3>
            <div className="logi-form-row">
              <div className="logi-field">
                <label>Product</label>
                <select value={orderForm.productId} onChange={(e) => setOrderForm({ ...orderForm, productId: e.target.value })}>
                  <option value="">Select product</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="logi-field">
                <label>Quantity</label>
                <input type="number" min="1" value={orderForm.quantity}
                  onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })} />
              </div>
              <div className="logi-field">
                <label>Pack</label>
                <select value={orderForm.packType} onChange={(e) => setOrderForm({ ...orderForm, packType: e.target.value })}>
                  <option value="DAILY">Daily</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
              <div className="logi-field">
                <label>Duration ({orderForm.packType === "DAILY" ? "days" : orderForm.packType === "MONTHLY" ? "months" : "years"})</label>
                <input type="number" min="1" value={orderForm.duration}
                  onChange={(e) => setOrderForm({ ...orderForm, duration: e.target.value })} />
              </div>
              <div className="logi-field">
                <label>Warehouse</label>
                <select value={orderForm.warehouseId} onChange={(e) => setOrderForm({ ...orderForm, warehouseId: e.target.value })}>
                  <option value="">Auto-pick</option>
                  {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div className="logi-field" style={{ minWidth: 220 }}>
                <label>Pickup Address</label>
                <input value={orderForm.pickupAddress}
                  onChange={(e) => setOrderForm({ ...orderForm, pickupAddress: e.target.value })}
                  placeholder="Where should the driver pick up from?" />
              </div>
              <button className="save-btn" onClick={runQuote}>Get Quote</button>
            </div>

            {quoteError && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: 10 }}>{quoteError}</p>}

            {quote && (
              <div className="logi-quote-box">
                Rate: ₹{quote.ratePerUnit} / unit · Qty {quote.quantity} · {quote.duration} {quote.packType.toLowerCase()}
                <div style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: 6 }}>
                  Total: ₹{quote.totalAmount}
                </div>
                <button className="save-btn" style={{ marginTop: 10 }} onClick={placeOrder}>
                  Confirm & Request Pickup
                </button>
              </div>
            )}
          </div>

          <div className="logi-section">
            <h3>3. My Orders</h3>
            <div className="shipment-table">
              <table>
                <thead>
                  <tr>
                    <th>Order</th><th>Qty</th><th>Pack</th><th>Amount</th><th>Status</th><th>Track</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>{o.orderCode}</td>
                      <td>{o.quantity}</td>
                      <td>{o.packType}</td>
                      <td>₹{o.totalAmount}</td>
                      <td><span className="logi-status-pill">{o.status}</span></td>
                      <td><button className="edit-btn" onClick={() => openTracking(o)}>Track</button></td>
                    </tr>
                  ))}
                  {orders.length === 0 && <tr><td colSpan={6}>No orders yet.</td></tr>}
                </tbody>
              </table>
            </div>
            {trackingFor && (
              <div style={{ marginTop: 16 }}>
                {trackingId ? <LiveTrackMap trackingId={trackingId} /> : <p>No pickup task found for this order yet.</p>}
              </div>
            )}
          </div>
        </div>

        <Modal isOpen={showProductModal} onClose={() => setShowProductModal(false)} title="Add Product">
          <div className="shipment-form">
            <input placeholder="Product name" value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
            <input placeholder="Category" value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
            <input placeholder="Unit (kg, box, bag...)" value={productForm.unit}
              onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })} />
            <input placeholder="Description" value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
            <button className="save-btn" onClick={saveProduct}>Save Product</button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default CustomerDashboard;
