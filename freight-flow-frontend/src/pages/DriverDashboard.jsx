import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import GpsBroadcaster from "../components/GpsBroadcaster";
import "../css/shipments.css";
import "../css/logistics.css";
import {
  listMyPickupTasks,
  acceptPickupTask,
  rejectPickupTask,
  completePickupTask,
} from "../api/rental";
import {
  listDeliveryRequestsAssignedToMe,
  markPickedUp,
  markOutForDelivery,
  markDelivered,
  getMyDriverProfile,
  setDriverStatus,
} from "../api/delivery";

function DriverDashboard() {
  const [pickups, setPickups] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [profile, setProfile] = useState(null);

  const load = () => {
    listMyPickupTasks().then(setPickups).catch(() => {});
    listDeliveryRequestsAssignedToMe().then(setDeliveries).catch(() => {});
    getMyDriverProfile().then(setProfile).catch(() => {});
  };

  useEffect(load, []);

  const toggleStatus = async () => {
    const next = profile?.status === "AVAILABLE" ? "OFFLINE" : "AVAILABLE";
    await setDriverStatus(next);
    load();
  };

  const doAction = async (fn, ...args) => {
    try {
      await fn(...args);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Action failed");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar title="My Tasks" />

        <div className="logi-page">
          <div className="logi-section">
            <h3>My Status</h3>
            <div className="logi-form-row">
              <span className="logi-status-pill">{profile?.status || "..."}</span>
              <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>Vehicle: {profile?.vehicleNumber || "—"}</span>
              <button className="save-btn" onClick={toggleStatus}>
                {profile?.status === "AVAILABLE" ? "Go offline" : "Go available"}
              </button>
            </div>
          </div>

          <div className="logi-section">
            <h3>Pickup Tasks (customer → warehouse)</h3>
            <div className="shipment-table">
              <table>
                <thead>
                  <tr><th>Tracking ID</th><th>Status</th><th>Actions</th><th>Live GPS</th></tr>
                </thead>
                <tbody>
                  {pickups.map((t) => (
                    <tr key={t.id}>
                      <td>{t.trackingId}</td>
                      <td><span className="logi-status-pill">{t.status}</span></td>
                      <td>
                        {t.status === "ASSIGNED" && (
                          <>
                            <button className="edit-btn" onClick={() => doAction(acceptPickupTask, t.id)}>Accept</button>
                            <button className="delete-btn" onClick={() => doAction(rejectPickupTask, t.id)}>Can't go</button>
                          </>
                        )}
                        {t.status === "ACCEPTED" && (
                          <button className="edit-btn" onClick={() => doAction(completePickupTask, t.id)}>
                            Mark picked up & stored
                          </button>
                        )}
                      </td>
                      <td>{t.status === "ACCEPTED" && <GpsBroadcaster trackingId={t.trackingId} />}</td>
                    </tr>
                  ))}
                  {pickups.length === 0 && <tr><td colSpan={4}>No pickup tasks assigned.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="logi-section">
            <h3>Delivery Tasks (warehouse → company)</h3>
            <div className="shipment-table">
              <table>
                <thead>
                  <tr><th>Tracking ID</th><th>Address</th><th>Status</th><th>Actions</th><th>Live GPS</th></tr>
                </thead>
                <tbody>
                  {deliveries.map((d) => (
                    <tr key={d.id}>
                      <td>{d.trackingId}</td>
                      <td>{d.deliveryAddress}</td>
                      <td><span className="logi-status-pill">{d.status}</span></td>
                      <td>
                        {d.status === "DRIVER_ASSIGNED" && (
                          <button className="edit-btn" onClick={() => doAction(markPickedUp, d.id)}>Picked up</button>
                        )}
                        {d.status === "PICKED_UP" && (
                          <button className="edit-btn" onClick={() => doAction(markOutForDelivery, d.id)}>Out for delivery</button>
                        )}
                        {d.status === "OUT_FOR_DELIVERY" && (
                          <button className="edit-btn" onClick={() => doAction(markDelivered, d.id)}>Delivered</button>
                        )}
                      </td>
                      <td>
                        {["PICKED_UP", "OUT_FOR_DELIVERY"].includes(d.status) && <GpsBroadcaster trackingId={d.trackingId} />}
                      </td>
                    </tr>
                  ))}
                  {deliveries.length === 0 && <tr><td colSpan={5}>No delivery tasks assigned.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;
