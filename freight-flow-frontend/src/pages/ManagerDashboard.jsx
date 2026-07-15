import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import LiveTrackMap from "../components/LiveTrackMap";
import "../css/shipments.css";
import "../css/logistics.css";
import { listAllProducts, listAllPickupTasks, reassignPickupTask } from "../api/rental";
import {
  listWarehouseStock,
  listDrivers,
  listAllDeliveryRequests,
  assignDeliveryDriver,
  setManualDeliveryCharge,
} from "../api/delivery";

function ManagerDashboard() {
  const [stock, setStock] = useState([]);
  const [products, setProducts] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trackingId, setTrackingId] = useState(null);
  const [manualCharge, setManualCharge] = useState({});

  const load = () => {
    listWarehouseStock().then(setStock).catch(() => {});
    listAllProducts().then(setProducts).catch(() => {});
    listAllPickupTasks().then(setPickups).catch(() => {});
    listAllDeliveryRequests().then(setDeliveries).catch(() => {});
    listDrivers().then(setDrivers).catch(() => {});
  };

  useEffect(load, []);

  const productName = (id) => products.find((p) => p.id === id)?.name || `#${id}`;

  const doReassign = async (taskId, driverId) => {
    try {
      await reassignPickupTask(taskId, driverId || null);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Could not reassign");
    }
  };

  const doAssignDriver = async (id, driverId) => {
    try {
      await assignDeliveryDriver(id, driverId || null);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Could not assign driver");
    }
  };

  const saveManualCharge = async (id) => {
    const amount = Number(manualCharge[id]);
    if (!amount && amount !== 0) return;
    try {
      await setManualDeliveryCharge(id, amount);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Could not set charge");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar title="Warehouse Control" />

        <div className="logi-page">
          <div className="logi-section">
            <h3>Warehouse Stock</h3>
            <div className="logi-grid">
              {stock.map((s) => (
                <div key={s.id} className="logi-quote-box">
                  {productName(s.productId)}: <strong>{s.quantity}</strong> @ ₹{s.ratePerUnit}/unit
                  <div style={{ fontSize: "0.72rem", opacity: 0.6 }}>from customer #{s.customerId}</div>
                </div>
              ))}
              {stock.length === 0 && <p style={{ opacity: 0.6 }}>No stock yet.</p>}
            </div>
          </div>

          <div className="logi-section">
            <h3>Pickup Tasks — interchange driver if one can't go</h3>
            <div className="shipment-table">
              <table>
                <thead>
                  <tr><th>Tracking ID</th><th>Status</th><th>Driver</th><th>Reassign</th><th>Track</th></tr>
                </thead>
                <tbody>
                  {pickups.map((t) => (
                    <tr key={t.id}>
                      <td>{t.trackingId}</td>
                      <td><span className="logi-status-pill">{t.status}</span></td>
                      <td>{t.driverId ?? "Unassigned"}</td>
                      <td>
                        <select defaultValue="" onChange={(e) => e.target.value && doReassign(t.id, Number(e.target.value))}>
                          <option value="">Assign to...</option>
                          <option value="0">Auto pick</option>
                          {drivers.map((d) => <option key={d.id} value={d.userId}>{d.vehicleNumber} (#{d.userId})</option>)}
                        </select>
                      </td>
                      <td><button className="edit-btn" onClick={() => setTrackingId(t.trackingId)}>Track</button></td>
                    </tr>
                  ))}
                  {pickups.length === 0 && <tr><td colSpan={5}>No pickup tasks.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="logi-section">
            <h3>Delivery Requests — assign driver & charges</h3>
            <div className="shipment-table">
              <table>
                <thead>
                  <tr>
                    <th>Tracking ID</th><th>Product</th><th>Qty</th><th>Auto ₹</th><th>Manual ₹</th>
                    <th>Final ₹</th><th>Status</th><th>Driver</th><th>Track</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((d) => (
                    <tr key={d.id}>
                      <td>{d.trackingId}</td>
                      <td>{productName(d.productId)}</td>
                      <td>{d.requestedQuantity}</td>
                      <td>{d.autoDeliveryCharge ?? "—"}</td>
                      <td>
                        <input
                          style={{ width: 70 }}
                          placeholder={d.manualDeliveryCharge ?? "manual"}
                          onChange={(e) => setManualCharge({ ...manualCharge, [d.id]: e.target.value })}
                        />
                        <button className="edit-btn" onClick={() => saveManualCharge(d.id)}>Set</button>
                      </td>
                      <td>{d.finalAmount ?? "—"}</td>
                      <td><span className="logi-status-pill">{d.status}</span></td>
                      <td>
                        <select defaultValue="" onChange={(e) => e.target.value && doAssignDriver(d.id, Number(e.target.value))}>
                          <option value="">{d.driverId ?? "Assign..."}</option>
                          <option value="0">Auto pick</option>
                          {drivers.map((dr) => <option key={dr.id} value={dr.userId}>{dr.vehicleNumber} (#{dr.userId})</option>)}
                        </select>
                      </td>
                      <td><button className="edit-btn" onClick={() => setTrackingId(d.trackingId)}>Track</button></td>
                    </tr>
                  ))}
                  {deliveries.length === 0 && <tr><td colSpan={9}>No delivery requests.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {trackingId && (
            <div className="logi-section">
              <h3>Live Tracking</h3>
              <LiveTrackMap trackingId={trackingId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
