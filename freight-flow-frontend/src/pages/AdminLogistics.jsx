import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import LiveTrackMap from "../components/LiveTrackMap";
import Modal from "../components/Modal";
import "../css/shipments.css";
import "../css/logistics.css";
import {
  listAllProducts,
  createProduct,
  listPricingPlans,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  listAllRentalOrders,
  listAllPickupTasks,
} from "../api/rental";
import {
  listWarehouses,
  createWarehouse,
  updateWarehouse,
  listAllDeliveryRequests,
  listWarehouseStock,
} from "../api/delivery";
import { listCustomers } from "../api/admin";

function AdminLogistics() {
  const [tab, setTab] = useState("warehouses");
  const [warehouses, setWarehouses] = useState([]);
  const [plans, setPlans] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stock, setStock] = useState([]);
  const [trackingId, setTrackingId] = useState(null);

  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [warehouseForm, setWarehouseForm] = useState({ name: "", address: "", latitude: "", longitude: "", managerUserId: "" });

  const [planForm, setPlanForm] = useState({ productId: "", packType: "DAILY", minQuantity: 1, ratePerUnit: "" });
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [newProductName, setNewProductName] = useState("");

  const load = () => {
    listWarehouses().then(setWarehouses).catch(() => {});
    listPricingPlans().then(setPlans).catch(() => {});
    listAllProducts().then(setProducts).catch(() => {});
    listAllRentalOrders().then(setOrders).catch(() => {});
    listAllPickupTasks().then(setPickups).catch(() => {});
    listAllDeliveryRequests().then(setDeliveries).catch(() => {});
    listCustomers().then(setCustomers).catch(() => {});
    listWarehouseStock().then(setStock).catch(() => {});
  };

  useEffect(load, []);

  const productName = (id) => (id ? products.find((p) => p.id === id)?.name || `#${id}` : "Any product (default)");

  const saveWarehouse = async () => {
    try {
      await createWarehouse({
        ...warehouseForm,
        latitude: warehouseForm.latitude ? Number(warehouseForm.latitude) : null,
        longitude: warehouseForm.longitude ? Number(warehouseForm.longitude) : null,
        managerUserId: warehouseForm.managerUserId ? Number(warehouseForm.managerUserId) : null,
      });
      setShowWarehouseModal(false);
      setWarehouseForm({ name: "", address: "", latitude: "", longitude: "", managerUserId: "" });
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Could not save warehouse");
    }
  };

  const addProduct = async () => {
    if (!newProductName.trim()) return;
    try {
      const created = await createProduct({ name: newProductName.trim(), unit: "unit" });
      setNewProductName("");
      load();
      setPlanForm({ ...planForm, productId: created.id });
    } catch (err) {
      alert(err.response?.data?.error || "Could not add product");
    }
  };

  const savePlan = async () => {
    try {
      const payload = {
        productId: planForm.productId ? Number(planForm.productId) : null,
        packType: planForm.packType,
        minQuantity: Number(planForm.minQuantity),
        ratePerUnit: Number(planForm.ratePerUnit),
        active: true,
      };
      if (editingPlanId) {
        await updatePricingPlan(editingPlanId, payload);
      } else {
        await createPricingPlan(payload);
      }
      setPlanForm({ productId: "", packType: "DAILY", minQuantity: 1, ratePerUnit: "" });
      setEditingPlanId(null);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Could not save pricing plan");
    }
  };

  const editPlan = (plan) => {
    setEditingPlanId(plan.id);
    setPlanForm({
      productId: plan.productId ?? "",
      packType: plan.packType,
      minQuantity: plan.minQuantity,
      ratePerUnit: plan.ratePerUnit,
    });
  };

  const cancelEditPlan = () => {
    setEditingPlanId(null);
    setPlanForm({ productId: "", packType: "DAILY", minQuantity: 1, ratePerUnit: "" });
  };

  const removePlan = async (id) => {
    if (!window.confirm("Delete this pricing plan?")) return;
    try {
      await deletePricingPlan(id);
      if (editingPlanId === id) cancelEditPlan();
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Could not delete pricing plan");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar title="Logistics Control Center" />

        <div className="logi-page">
          <div className="logi-tabs">
            {["customers", "warehouses", "pricing", "orders", "tracking"].map((t) => (
              <button key={t} className={`logi-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {tab === "warehouses" && (
            <div className="logi-section">
              <div className="shipment-toolbar">
                <h3 style={{ margin: 0 }}>Warehouses</h3>
                <button className="save-btn add-new-btn" onClick={() => setShowWarehouseModal(true)}>+ Add Warehouse</button>
              </div>
              <div className="shipment-table">
                <table>
                  <thead><tr><th>Name</th><th>Address</th><th>Manager User ID</th><th>Status</th></tr></thead>
                  <tbody>
                    {warehouses.map((w) => (
                      <tr key={w.id}>
                        <td>{w.name}</td>
                        <td>{w.address}</td>
                        <td>{w.managerUserId ?? "Unassigned"}</td>
                        <td>{w.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.78rem", opacity: 0.6, marginTop: 8 }}>
                Tip: create a WAREHOUSE_MANAGER user first (via Employees/User Management), then enter their user ID here.
              </p>
            </div>
          )}

          {tab === "customers" && (
            <div className="logi-section">
              <h3>Customer Details & Requests</h3>
              <div className="shipment-table">
                <table>
                  <thead><tr><th>Customer</th><th>Username</th><th>Email</th><th>Phone</th><th>Status</th><th>Joined</th></tr></thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id}>
                        <td>{customer.fullName}</td><td>{customer.username}</td><td>{customer.email || "—"}</td>
                        <td>{customer.phoneNumber || "—"}</td><td>{customer.active ? "Active" : "Inactive"}</td>
                        <td>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "—"}</td>
                      </tr>
                    ))}
                    {customers.length === 0 && <tr><td colSpan={6}>No registered customers yet.</td></tr>}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.78rem", opacity: 0.65, marginTop: 10 }}>Rental and delivery requests are in the Orders tab; employee accounts are managed in User Management.</p>
            </div>
          )}

          {tab === "pricing" && (
            <div className="logi-section">
              <h3>Pricing Plans</h3>

              <div className="logi-form-row" style={{ marginBottom: 14 }}>
                <div className="logi-field" style={{ minWidth: 240 }}>
                  <label>New product name</label>
                  <input value={newProductName} onChange={(e) => setNewProductName(e.target.value)} placeholder="e.g. Steel Rods" />
                </div>
                <button className="save-btn" onClick={addProduct}>+ Add Product</button>
              </div>

              <div className="logi-form-row">
                <div className="logi-field">
                  <label>Product (blank = default)</label>
                  <select value={planForm.productId} onChange={(e) => setPlanForm({ ...planForm, productId: e.target.value })}>
                    <option value="">Default for all products</option>
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="logi-field">
                  <label>Pack Type</label>
                  <select value={planForm.packType} onChange={(e) => setPlanForm({ ...planForm, packType: e.target.value })}>
                    <option value="DAILY">Daily</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>
                <div className="logi-field">
                  <label>Min Qty</label>
                  <input type="number" value={planForm.minQuantity} onChange={(e) => setPlanForm({ ...planForm, minQuantity: e.target.value })} />
                </div>
                <div className="logi-field">
                  <label>Rate / unit (₹)</label>
                  <input type="number" value={planForm.ratePerUnit} onChange={(e) => setPlanForm({ ...planForm, ratePerUnit: e.target.value })} />
                </div>
                <button className="save-btn" onClick={savePlan}>{editingPlanId ? "Update Plan" : "Add Plan"}</button>
                {editingPlanId && (
                  <button className="delete-btn" onClick={cancelEditPlan}>Cancel</button>
                )}
              </div>

              <div className="shipment-table" style={{ marginTop: 16 }}>
                <table>
                  <thead><tr><th>Product</th><th>Pack</th><th>Min Qty</th><th>Rate/unit</th><th>Actions</th></tr></thead>
                  <tbody>
                    {plans.map((p) => (
                      <tr key={p.id}>
                        <td>{productName(p.productId)}</td>
                        <td>{p.packType}</td>
                        <td>{p.minQuantity}</td>
                        <td>₹{p.ratePerUnit}</td>
                        <td>
                          <button className="edit-btn" onClick={() => editPlan(p)}>Edit</button>
                          <button className="delete-btn" onClick={() => removePlan(p.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "orders" && (
            <>
              <div className="logi-section">
                <h3>Storage Details — all warehouses</h3>
                <div className="shipment-table"><table>
                  <thead><tr><th>Warehouse</th><th>Customer</th><th>Product</th><th>Quantity Stored</th><th>Storage Rate / Unit</th></tr></thead>
                  <tbody>
                    {stock.map((item) => <tr key={item.id}><td>{warehouses.find((w) => w.id === item.warehouseId)?.name || `#${item.warehouseId}`}</td><td>#{item.customerId}</td><td>{productName(item.productId)}</td><td>{item.quantity}</td><td>₹{item.ratePerUnit}</td></tr>)}
                    {stock.length === 0 && <tr><td colSpan={5}>No stored products yet.</td></tr>}
                  </tbody>
                </table></div>
              </div>
              <div className="logi-section">
                <h3>All Rental Orders</h3>
                <div className="shipment-table">
                  <table>
                    <thead><tr><th>Order</th><th>Customer</th><th>Qty</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td>{o.orderCode}</td><td>#{o.customerId}</td><td>{o.quantity}</td>
                          <td>₹{o.totalAmount}</td><td><span className="logi-status-pill">{o.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="logi-section">
                <h3>All Delivery Requests</h3>
                <div className="shipment-table">
                  <table>
                    <thead><tr><th>Tracking</th><th>Company</th><th>Qty</th><th>Final ₹</th><th>Status</th></tr></thead>
                    <tbody>
                      {deliveries.map((d) => (
                        <tr key={d.id}>
                          <td>{d.trackingId}</td><td>#{d.companyUserId}</td><td>{d.requestedQuantity}</td>
                          <td>{d.finalAmount ?? "—"}</td><td><span className="logi-status-pill">{d.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {tab === "tracking" && (
            <div className="logi-section">
              <h3>Live Tracking — any warehouse (owner view)</h3>
              <div className="logi-form-row">
                <div className="logi-field" style={{ minWidth: 260 }}>
                  <label>Pickup tracking IDs</label>
                  <select onChange={(e) => e.target.value && setTrackingId(e.target.value)}>
                    <option value="">Select a pickup...</option>
                    {pickups.map((t) => <option key={t.id} value={t.trackingId}>{t.trackingId} ({t.status})</option>)}
                  </select>
                </div>
                <div className="logi-field" style={{ minWidth: 260 }}>
                  <label>Delivery tracking IDs</label>
                  <select onChange={(e) => e.target.value && setTrackingId(e.target.value)}>
                    <option value="">Select a delivery...</option>
                    {deliveries.map((d) => <option key={d.id} value={d.trackingId}>{d.trackingId} ({d.status})</option>)}
                  </select>
                </div>
              </div>
              {trackingId && <div style={{ marginTop: 14 }}><LiveTrackMap trackingId={trackingId} /></div>}
            </div>
          )}
        </div>

        <Modal isOpen={showWarehouseModal} onClose={() => setShowWarehouseModal(false)} title="Add Warehouse">
          <div className="shipment-form">
            <input placeholder="Warehouse name" value={warehouseForm.name} onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })} />
            <input placeholder="Address" value={warehouseForm.address} onChange={(e) => setWarehouseForm({ ...warehouseForm, address: e.target.value })} />
            <input placeholder="Latitude" value={warehouseForm.latitude} onChange={(e) => setWarehouseForm({ ...warehouseForm, latitude: e.target.value })} />
            <input placeholder="Longitude" value={warehouseForm.longitude} onChange={(e) => setWarehouseForm({ ...warehouseForm, longitude: e.target.value })} />
            <input placeholder="Manager User ID (optional)" value={warehouseForm.managerUserId} onChange={(e) => setWarehouseForm({ ...warehouseForm, managerUserId: e.target.value })} />
            <button className="save-btn" onClick={saveWarehouse}>Save Warehouse</button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AdminLogistics;
