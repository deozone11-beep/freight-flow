import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";
import { roleHome } from "../utils/roleHome";
import "../css/login.css";

const ROLES = [
  { value: "CUSTOMER", label: "Customer (store & rent out products)" },
  { value: "COMPANY", label: "Company (request product deliveries)" },
  { value: "DRIVER", label: "Driver (pickup & delivery)" },
];

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    role: "CUSTOMER",
    phone: "",
    vehicleNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await register(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ username: data.username, fullName: data.fullName, role: data.role })
      );
      navigate(roleHome(data.role));
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="gradient-bg"></div>
      <div className="grid-bg"></div>

      <div className="login-container" style={{ justifyContent: "center" }}>
        <div className="right-panel">
          <div className="login-card">
            <h2>
              Create <span>Account</span>
            </h2>
            <p>Sign up as a Customer, Company, or Driver</p>

            <form onSubmit={handleSubmit}>
              <label>I am a</label>
              <div className="input-box" style={{ padding: "0 8px" }}>
                <select
                  value={form.role}
                  onChange={update("role")}
                  style={{ width: "100%", background: "transparent", border: "none", color: "inherit", height: "46px" }}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <label>Full Name / Business Name</label>
              <div className="input-box">
                <input placeholder="e.g. Ramesh Traders" value={form.fullName} onChange={update("fullName")} required />
              </div>

              <label>Username</label>
              <div className="input-box">
                <input placeholder="Choose a username" value={form.username} onChange={update("username")} required />
              </div>

              <label>Email</label>
              <div className="input-box">
                <input type="email" placeholder="you@example.com" value={form.email} onChange={update("email")} required />
              </div>

              <label>Password</label>
              <div className="input-box">
                <input type="password" placeholder="Choose a password" value={form.password} onChange={update("password")} required />
              </div>

              <label>Phone</label>
              <div className="input-box">
                <input placeholder="Contact number" value={form.phone} onChange={update("phone")} />
              </div>

              {form.role === "DRIVER" && (
                <>
                  <label>Vehicle Number</label>
                  <div className="input-box">
                    <input placeholder="e.g. TN-09-XY-4455" value={form.vehicleNumber} onChange={update("vehicleNumber")} />
                  </div>
                </>
              )}

              {error && (
                <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "-8px" }}>{error}</p>
              )}

              <button className="login-btn" disabled={loading}>
                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT →"}
              </button>
            </form>

            <p style={{ marginTop: "16px", fontSize: "0.85rem" }}>
              Already have an account? <Link to="/">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
