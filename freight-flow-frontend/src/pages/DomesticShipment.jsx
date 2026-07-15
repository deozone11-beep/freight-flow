import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import "../css/shipments.css";
import {
  getDomesticShipments,
  createDomesticShipment,
  updateDomesticShipment,
  deleteDomesticShipment,
} from "../api/domesticShipments";

function DomesticShipment() {
  const navigate = useNavigate();

  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const generateOrderId = () =>
    "DSP-" + Math.floor(1000 + Math.random() * 9000);

  const blankForm = () => ({
    orderId: generateOrderId(),
    wholesalePartner: "",
    batch: "",
    product: "",
    destination: "",
    status: "Select Status",
  });

  const [formData, setFormData] = useState(blankForm());

  useEffect(() => {
    loadDispatches();
  }, []);

  const loadDispatches = () => {
    setLoading(true);
    getDomesticShipments()
      .then(setDispatches)
      .catch(() => alert("Could not load dispatches from server"))
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveDispatch = async () => {
    if (!formData.orderId || !formData.wholesalePartner || !formData.destination) {
      alert("Fill all mandatory fields");
      return;
    }

    try {
      if (editId !== null) {
        await updateDomesticShipment(editId, formData);
        setEditId(null);
      } else {
        await createDomesticShipment(formData);
      }

      setFormData(blankForm());
      setShowModal(false);
      loadDispatches();
    } catch (err) {
      alert(err.response?.data?.error || "Could not save dispatch");
    }
  };

  const openAddModal = () => {
    setFormData(blankForm());
    setEditId(null);
    setShowModal(true);
  };

  const editDispatch = (item) => {
    setFormData({
      orderId: item.orderId,
      wholesalePartner: item.wholesalePartner,
      batch: item.batch,
      product: item.product,
      destination: item.destination,
      status: item.status,
    });
    setEditId(item.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setFormData(blankForm());
  };

  const deleteDispatch = async (id) => {
    if (window.confirm("Delete dispatch record?")) {
      try {
        await deleteDomesticShipment(id);
        loadDispatches();
      } catch (err) {
        alert("Could not delete dispatch");
      }
    }
  };

  const filtered = dispatches.filter((item) =>
    item.orderId.toLowerCase().includes(search.toLowerCase()) ||
    item.wholesalePartner.toLowerCase().includes(search.toLowerCase()) ||
    item.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar title="Local Dispatch" />

        <div className="shipment-page">
          <div className="shipment-header">
            <button
              className="back-btn"
              onClick={() => navigate("/shipments")}
            >
              ← Back
            </button>

            <h1>🏪 Local Dispatch</h1>
          </div>

          <div className="shipment-toolbar">
            <input
              autoComplete="off"
              className="search-box"
              placeholder="Search Dispatch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button className="save-btn add-new-btn" onClick={openAddModal}>
              + Add Dispatch
            </button>
          </div>

          <Modal
            isOpen={showModal}
            onClose={closeModal}
            title={editId !== null ? "Update Dispatch" : "Add New Dispatch"}
          >
            <div className="shipment-form">
              <div className="id-field">
                <input
                  autoComplete="off"
                  name="orderId"
                  placeholder="Order ID"
                  value={formData.orderId}
                  readOnly
                />
                <button
                  type="button"
                  className="regen-btn"
                  title="Generate new ID"
                  onClick={() =>
                    setFormData({ ...formData, orderId: generateOrderId() })
                  }
                >
                  ⟳
                </button>
              </div>

              <input
                autoComplete="off"
                name="wholesalePartner"
                placeholder="Wholesale Partner"
                value={formData.wholesalePartner}
                onChange={handleChange}
              />

              <input
                autoComplete="off"
                name="batch"
                placeholder="Assembly Batch"
                value={formData.batch}
                onChange={handleChange}
              />

              <input
                autoComplete="off"
                name="product"
                placeholder="Product Model"
                value={formData.product}
                onChange={handleChange}
              />

              <input
                autoComplete="off"
                name="destination"
                placeholder="Destination Shop"
                value={formData.destination}
                onChange={handleChange}
              />

              <select name="status" value={formData.status} onChange={handleChange}>
                <option>Select Status</option>
                <option>Ready</option>
                <option>Dispatched</option>
                <option>Delivered</option>
              </select>

              <button className="save-btn" onClick={saveDispatch}>
                {editId !== null ? "Update Dispatch" : "Add Dispatch"}
              </button>
            </div>
          </Modal>

          <div className="shipment-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Partner</th>
                  <th>Batch</th>
                  <th>Model</th>
                  <th>Destination</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={7}>Loading...</td></tr>
                )}
                {!loading && filtered.map((item) => (
                  <tr key={item.id}>
                    <td>{item.orderId}</td>
                    <td>{item.wholesalePartner}</td>
                    <td>{item.batch}</td>
                    <td>{item.product}</td>
                    <td>{item.destination}</td>
                    <td>
                      <span
                        className={`badge ${item.status.replace(/\s/g, "").toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button className="edit-btn" onClick={() => editDispatch(item)}>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => deleteDispatch(item.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DomesticShipment;
