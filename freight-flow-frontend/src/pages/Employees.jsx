import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import "../css/employee.css";
import {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee as deleteEmployeeApi
} from "../api/employees";

function Employees() {

    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    const generateEmployeeId = () =>
        "EMP-" + Math.floor(1000 + Math.random() * 9000);

    const blankForm = () => ({
        employeeId: generateEmployeeId(),
        name: "",
        role: "",
        phone: "",
        email: ""
    });

    const [formData, setFormData] = useState(blankForm());

    const [editId, setEditId] = useState(null);

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = () => {
        setLoading(true);
        getEmployees()
            .then(setEmployees)
            .catch(() => alert("Could not load employees from server"))
            .finally(() => setLoading(false));
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const saveEmployee = async () => {

        if (
            !formData.employeeId ||
            !formData.name ||
            !formData.role
        ) {
            alert("Fill all required fields");
            return;
        }

        try {
            if (editId !== null) {
                await updateEmployee(editId, formData);
                setEditId(null);
            } else {
                await createEmployee(formData);
            }

            setFormData(blankForm());
            setShowModal(false);
            loadEmployees();
        } catch (err) {
            alert(err.response?.data?.error || "Could not save employee");
        }
    };

    const openAddModal = () => {
        setFormData(blankForm());
        setEditId(null);
        setShowModal(true);
    };

    const editEmployee = (emp) => {
        setFormData({
            employeeId: emp.employeeId,
            name: emp.name,
            role: emp.role,
            phone: emp.phone,
            email: emp.email
        });
        setEditId(emp.id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditId(null);
        setFormData(blankForm());
    };

    const deleteEmployee = async (id) => {

        if (
            window.confirm(
                "Delete Employee?"
            )
        ) {
            try {
                await deleteEmployeeApi(id);
                loadEmployees();
            } catch (err) {
                alert("Could not delete employee");
            }
        }
    };

    const filteredEmployees =
        employees.filter((emp) =>
            emp.name
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    return (
        <div className="dashboard">
            <Sidebar />

            <div className="dashboard-content">
                <Navbar title="User Management" />

                <div className="employee-page">

                    <div className="employee-top">

                <button
                    className="back-btn"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Back
                </button>

                <h1>👨‍💼 User Management</h1>

            </div>

            <div className="employee-toolbar">
                <input
                    autoComplete="off"
                    className="search-box"
                    placeholder="Search Employee..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <button className="save-btn add-new-btn" onClick={openAddModal}>
                    + Add Employee
                </button>
            </div>

            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={editId !== null ? "Update Employee" : "Add New Employee"}
            >
                <div className="employee-form">

                    <div className="id-field">
                        <input
                            autoComplete="off"
                            name="employeeId"
                            placeholder="Employee ID"
                            value={formData.employeeId}
                            readOnly
                        />
                        <button
                            type="button"
                            className="regen-btn"
                            title="Generate new ID"
                            onClick={() =>
                                setFormData({ ...formData, employeeId: generateEmployeeId() })
                            }
                        >
                            ⟳
                        </button>
                    </div>

                    <input
                        autoComplete="off"
                        name="name"
                        placeholder="Employee Name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <input
                        autoComplete="off"
                        name="role"
                        placeholder="Role"
                        value={formData.role}
                        onChange={handleChange}
                    />

                    <input
                        autoComplete="off"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    <input
                        autoComplete="off"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <button
                        className="save-btn"
                        onClick={saveEmployee}
                    >
                        {editId !== null
                            ? "Update Employee"
                            : "Add Employee"}
                    </button>

                </div>
            </Modal>

                <div className="employee-table">

                <table>

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {loading && (
                            <tr><td colSpan={6}>Loading...</td></tr>
                        )}

                        {!loading && filteredEmployees.map(
                            (emp) => (

                                <tr key={emp.id}>

                                    <td>{emp.employeeId}</td>

                                    <td>{emp.name}</td>

                                    <td>{emp.role}</td>

                                    <td>{emp.phone}</td>

                                    <td>{emp.email}</td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                editEmployee(emp)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteEmployee(emp.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>
                            )
                        )}

                    </tbody>

                </table>

            </div>

                </div>
            </div>
        </div>
    );
}

export default Employees;
