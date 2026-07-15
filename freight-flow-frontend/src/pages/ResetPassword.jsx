import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/auth";
import "../css/login.css";

function ResetPassword() {
  const [params] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const token = params.get("token");

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    if (!token) {
      setMessage("This password-reset link is invalid.");
      return;
    }
    setLoading(true);
    try {
      const data = await resetPassword(token, newPassword);
      setMessage(data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "This password-reset link is invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="gradient-bg" />
      <div className="grid-bg" />
      <div className="login-container" style={{ justifyContent: "center" }}>
        <div className="right-panel"><div className="login-card">
          <h2>Set a <span>New Password</span></h2>
          <form onSubmit={submit}>
            <label>New Password</label>
            <div className="input-box">
              <input type="password" minLength="8" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            {message && <p style={{ color: "var(--accent-purple)", fontSize: "14px" }}>{message}</p>}
            <button className="login-btn" disabled={loading}>{loading ? "UPDATING..." : "UPDATE PASSWORD"}</button>
          </form>
          <p style={{ marginTop: "16px", fontSize: "0.85rem" }}><Link to="/">Back to sign in</Link></p>
        </div></div>
      </div>
    </div>
  );
}

export default ResetPassword;
