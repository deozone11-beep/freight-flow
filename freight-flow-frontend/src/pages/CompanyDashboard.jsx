import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import LiveTrackMap from "../components/LiveTrackMap";
import "../css/shipments.css";
import "../css/logistics.css";
import { listAllProducts } from "../api/rental";
import { listWarehouses, listWarehouseStock, createDeliveryRequest, listMyDeliveryRequests } from "../api/delivery";
import { MapPin } from "lucide-react";

function CompanyDashboard() {
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState([]);
  const [requests, setRequests] = useState([]);
  const [trackingId, setTrackingId] = useState(null);

  const [form, setForm] = useState({
    warehouseId: "",
    productId: "",
    quantity: 10,
    deliveryAddress: "",
    deliveryLatitude: "",
    deliveryLongitude: "",
  });

  const load = () => {
    listWarehouses().then(setWarehouses).catch(() => {});
    listAllProducts().then(setProducts).catch(() => {});
    listMyDeliveryRequests().then(setRequests).catch(() => {});
  };

  useEffect(load, []);

  useEffect(() => {
    if (form.warehouseId) {
      listWarehouseStock(Number(form.warehouseId)).then(setStock).catch(() => setStock([]));
    } else {
      setStock([]);
    }
  }, [form.warehouseId]);

  const productName = (id) => products.find((p) => p.id === id)?.name || `#${id}`;

  const useMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported on this browser");
    navigator.geolocation.getCurrentPosition(
      (pos) => setForm({ ...form, deliveryLatitude: pos.coords.latitude, deliveryLongitude: pos.coords.longitude }),
      () => alert("Could not get your location")
    );
  };

  const submitRequest = async () => {
    if (!form.warehouseId || !form.productId || !form.deliveryAddress || !form.deliveryLatitude || !form.deliveryLongitude) {
      alert("Fill warehouse, product, address, and location (use 'Use my location')");
      return;
    }
    try {
      await createDeliveryRequest({
        ...form,
        warehouseId: Number(form.warehouseId),
        productId: Number(form.productId),
        quantity: Number(form.quantity),
        deliveryLatitude: Number(form.deliveryLatitude),
        deliveryLongitude: Number(form.deliveryLongitude),
      });
      setForm({ ...form, productId: "", deliveryAddress: "" });
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Could not create delivery request");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar title="Request Deliveries" />

        <div className="logi-page">
          <div className="logi-section">
            <h3>Request Product Delivery</h3>
            <div className="logi-form-row">
              <div className="logi-field">
                <label>Warehouse</label>
                <select value={form.warehouseId} onChange={(e) => setForm({ ...form, warehouseId: e.target.value })}>
                  <option value="">Select warehouse</option>
                  {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div className="logi-field">
                <label>Product</label>
                <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>
                  <option value="">Select product</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="logi-field">
                <label>Quantity</label>
                <input type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              </div>
              <div className="logi-field" style={{ minWidth: 240 }}>
                <label>Delivery Address</label>
                <input value={form.deliveryAddress} onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })} />
              </div>
              <button className="save-btn" onClick={useMyLocation} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <MapPin size={16} /> Use my location
              </button>
              <button className="save-btn" onClick={submitRequest}>Request Delivery</button>
            </div>
            {form.deliveryLatitude && (
              <p style={{ fontSize: "0.78rem", opacity: 0.7, marginTop: 6 }}>
                Location set: {Number(form.deliveryLatitude).toFixed(4)}, {Number(form.deliveryLongitude).toFixed(4)}
              </p>
            )}

            {form.warehouseId && (
              <div style={{ marginTop: 14 }}>
                <strong style={{ fontSize: "0.85rem" }}>Available stock at this warehouse:</strong>
                <div className="logi-grid" style={{ marginTop: 8 }}>
                  {stock.map((s) => (
                    <div key={s.id} className="logi-quote-box">
                      {productName(s.productId)}: <strong>{s.quantity}</strong> @ ₹{s.ratePerUnit}/unit
                    </div>
                  ))}
                  {stock.length === 0 && <p style={{ opacity: 0.6 }}>No stock recorded yet.</p>}
                </div>
              </div>
            )}
          </div>

          <div className="logi-section">
            <h3>My Delivery Requests</h3>
            <div className="shipment-table">
              <table>
                <thead>
                  <tr>
                    <th>Tracking ID</th><th>Product</th><th>Qty</th><th>Amount</th><th>Status</th><th>Track</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r.id}>
                      <td>{r.trackingId}</td>
                      <td>{productName(r.productId)}</td>
                      <td>{r.requestedQuantity}</td>
                      <td>{r.finalAmount != null ? `₹${r.finalAmount}` : "—"}</td>
                      <td><span className="logi-status-pill">{r.status}</span></td>
                      <td><button className="edit-btn" onClick={() => setTrackingId(r.trackingId)}>Track</button></td>
                    </tr>
                  ))}
                  {requests.length === 0 && <tr><td colSpan={6}>No delivery requests yet.</td></tr>}
                </tbody>
              </table>
            </div>
            {trackingId && <div style={{ marginTop: 16 }}><LiveTrackMap trackingId={trackingId} /></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDashboard;
