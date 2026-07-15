import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../css/dashboard.css";
import { changePassword } from "../api/auth";
import { ShieldCheck } from "lucide-react";

function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess("Password updated. Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.response?.data?.error || "Could not update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar title="Change Password" />

        <div className="panel" style={{ maxWidth: "480px" }}>
          <div className="panel-header">
            <h3>
              <ShieldCheck size={20} style={{ verticalAlign: "middle", marginRight: "8px" }} />
              Set a New Password
            </h3>
          </div>

          <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "20px" }}>
            For security, please set your own password before continuing.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{
                  height: "50px",
                  borderRadius: "12px",
                  border: "1px solid var(--hairline-08)",
                  background: "var(--surface-2)",
                  color: "var(--text)",
                  padding: "0 16px",
                  outline: "none",
                }}
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  height: "50px",
                  borderRadius: "12px",
                  border: "1px solid var(--hairline-08)",
                  background: "var(--surface-2)",
                  color: "var(--text)",
                  padding: "0 16px",
                  outline: "none",
                }}
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  height: "50px",
                  borderRadius: "12px",
                  border: "1px solid var(--hairline-08)",
                  background: "var(--surface-2)",
                  color: "var(--text)",
                  padding: "0 16px",
                  outline: "none",
                }}
              />
            </div>

            {error && <p style={{ color: "var(--danger)", fontSize: "14px" }}>{error}</p>}
            {success && <p style={{ color: "var(--success)", fontSize: "14px" }}>{success}</p>}

            <button
              className="save-btn"
              disabled={loading}
              style={{ height: "50px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", fontSize: "16px" }}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
