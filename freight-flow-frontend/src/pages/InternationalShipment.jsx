import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import "../css/shipments.css";
import {
  getInternationalShipments,
  createInternationalShipment,
  updateInternationalShipment,
  deleteInternationalShipment,
} from "../api/internationalShipments";

function InternationalShipment() {
  const navigate = useNavigate();

  const [imports, setImports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const generateImportId = () =>
    "IMP-" + Math.floor(1000 + Math.random() * 9000);

  const blankForm = () => ({
    importId: generateImportId(),
    supplier: "",
    partType: "",
    originCountry: "",
    expectedArrival: "",
    customsStatus: "",
    status: "Select Status",
  });

  const [formData, setFormData] = useState(blankForm());

  useEffect(() => {
    loadImports();
  }, []);

  const loadImports = () => {
    setLoading(true);
    getInternationalShipments()
      .then(setImports)
      .catch(() => alert("Could not load imports from server"))
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addImport = async () => {
    if (!formData.importId || !formData.supplier || !formData.partType) {
      alert("Fill all required fields");
      return;
    }

    try {
      if (editId !== null) {
        await updateInternationalShipment(editId, formData);
        setEditId(null);
      } else {
        await createInternationalShipment(formData);
      }

      setFormData(blankForm());
      setShowModal(false);
      loadImports();
    } catch (err) {
      alert(err.response?.data?.error || "Could not save import");
    }
  };

  const openAddModal = () => {
    setFormData(blankForm());
    setEditId(null);
    setShowModal(true);
  };

  const editImport = (item) => {
    setFormData({
      importId: item.importId,
      supplier: item.supplier,
      partType: item.partType,
      originCountry: item.originCountry,
      expectedArrival: item.expectedArrival,
      customsStatus: item.customsStatus,
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

  const deleteImport = async (id) => {
    try {
      await deleteInternationalShipment(id);
      loadImports();
    } catch (err) {
      alert("Could not delete import");
    }
  };

  const filtered = imports.filter(
    (item) =>
      item.supplier.toLowerCase().includes(search.toLowerCase()) ||
      item.partType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar title="Global Imports" />

        <div className="shipment-page">
          <button
            className="back-btn"
            onClick={() => navigate("/shipments")}
            style={{ marginBottom: "20px" }}
          >
            ← Back
          </button>

          <div className="shipment-header">
            <div className="shipment-summary">
              <div className="summary-card">
                <h5>Total Imports</h5>
                <h2>154</h2>
                <span>+9 this week</span>
              </div>

              <div className="summary-card">
                <h5>In Transit</h5>
                <h2>48</h2>
                <span>On schedule</span>
              </div>

              <div className="summary-card">
                <h5>Cleared</h5>
                <h2>87</h2>
                <span>Ready for assembly</span>
              </div>

              <div className="summary-card">
                <h5>Pending QA</h5>
                <h2>19</h2>
                <span>Awaiting inspection</span>
              </div>
            </div>
          </div>

          <div className="shipment-toolbar">
            <input
              autoComplete="off"
              className="search-box"
              placeholder="Search Global Imports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button className="save-btn add-new-btn" onClick={openAddModal}>
              + Add Import
            </button>
          </div>

          <Modal
            isOpen={showModal}
            onClose={closeModal}
            title={editId !== null ? "Update Import" : "Add New Import"}
          >
            <div className="shipment-form">
              <div className="id-field">
                <input
                  autoComplete="off"
                  name="importId"
                  placeholder="Import ID"
                  value={formData.importId}
                  readOnly
                />
                <button
                  type="button"
                  className="regen-btn"
                  title="Generate new ID"
                  onClick={() =>
                    setFormData({ ...formData, importId: generateImportId() })
                  }
                >
                  ⟳
                </button>
              </div>

              <input
                autoComplete="off"
                name="supplier"
                placeholder="Supplier"
                value={formData.supplier}
                onChange={handleChange}
              />

              <input
                autoComplete="off"
                name="partType"
                placeholder="Part Type"
                value={formData.partType}
                onChange={handleChange}
              />

              <input
                autoComplete="off"
                name="originCountry"
                placeholder="Origin Country"
                value={formData.originCountry}
                onChange={handleChange}
              />

              <input
                autoComplete="off"
                name="expectedArrival"
                placeholder="Expected Arrival"
                value={formData.expectedArrival}
                onChange={handleChange}
              />

              <input
                autoComplete="off"
                name="customsStatus"
                placeholder="Customs Status"
                value={formData.customsStatus}
                onChange={handleChange}
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Select Status</option>
                <option>Awaiting Customs</option>
                <option>Cleared</option>
                <option>Received</option>
              </select>

              <button className="save-btn" onClick={addImport}>
                {editId !== null ? "Update Import" : "Add Import"}
              </button>
            </div>
          </Modal>

          <div className="shipment-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Supplier</th>
                  <th>Part Type</th>
                  <th>Origin</th>
                  <th>Arrival</th>
                  <th>Customs</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={8}>Loading...</td></tr>
                )}
                {!loading && filtered.map((item) => (
                  <tr key={item.id}>
                    <td>{item.importId}</td>
                    <td>{item.supplier}</td>
                    <td>{item.partType}</td>
                    <td>{item.originCountry}</td>
                    <td>{item.expectedArrival}</td>
                    <td>{item.customsStatus}</td>
                    <td>
                      <span
                        className={`badge ${item.status.replace(/\s/g, "").toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => editImport(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteImport(item.id)}
                      >
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

export default InternationalShipment;
