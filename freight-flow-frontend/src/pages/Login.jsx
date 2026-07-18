import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import worldMap from "../assets/world-map.png";
import truck from "../assets/truck.png";
import "../css/login.css";
import { login, getCaptcha, forgotPassword } from "../api/auth";
import { roleHome } from "../utils/roleHome";
import Modal from "../components/Modal";

import {
  Package,
  Warehouse,
  BarChart3,
  ShieldCheck,
  Eye,
  EyeOff,
  User,
  Lock,
  RefreshCw,
  Volume2
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [captchaId, setCaptchaId] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const canvasRef = useRef(null);

  const loadCaptcha = () => {
    setCaptchaText("");
    setCaptchaImage("");
    getCaptcha()
      .then((data) => {
        setCaptchaId(data.captchaId);
        if (data.captchaImage) {
          setCaptchaImage(data.captchaImage);
          try {
            setCaptchaText(window.atob(data.audioObfuscatedText));
          } catch (e) {
            setCaptchaText("");
          }
        } else if (data.text) {
          setCaptchaText(data.text);
        }
        setCaptchaAnswer("");
      })
      .catch(() => {
        setCaptchaText("ERROR");
        setCaptchaImage("");
      });
  };

  const speakCaptcha = () => {
    if (!captchaText || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(captchaText.split("").join(" "));
    utterance.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  useEffect(() => {
    if (captchaImage || !captchaText || captchaText === "ERROR") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const width = 160;
    const height = 58;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw noise lines
    const lineColors = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ec4899"];
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = lineColors[i % lineColors.length];
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Noise dots
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = lineColors[Math.floor(Math.random() * lineColors.length)];
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Characters
    const colors = ["#1e3a8a", "#7c2d12", "#166534", "#581c87", "#9d174d", "#0c4a6e"];
    const charWidth = width / (captchaText.length + 1);
    captchaText.split("").forEach((ch, i) => {
      const x = charWidth * (i + 1);
      const y = height / 2 + (Math.random() * 10 - 5);
      const angle = (Math.random() * 40 - 20) * (Math.PI / 180);
      const size = 20 + Math.random() * 5;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.font = `800 ${size}px Poppins, sans-serif`;
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    });
  }, [captchaText, captchaImage]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!captchaAnswer) {
      setError("Please answer the captcha.");
      return;
    }

    setLoading(true);

    try {
      const data = await login(username, password, captchaId, captchaAnswer);
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.username,
          fullName: data.fullName,
          role: data.role,
        })
      );

      if (data.mustChangePassword) {
        navigate("/change-password");
      } else {
        navigate(roleHome(data.role));
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Login failed. Check your credentials."
      );
      loadCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMessage("");

    if (!forgotEmail) {
      setForgotMessage("Enter your email address first.");
      return;
    }

    setForgotLoading(true);
    try {
      const data = await forgotPassword(forgotEmail);
      setForgotMessage(data.message);
    } catch (err) {
      setForgotMessage(
        err.response?.data?.error || "Could not send the password-reset email."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Background */}
      <div className="gradient-bg"></div>
      <div className="grid-bg"></div>

      {/* World Map */}
      <img src={worldMap} className="map" />
      <div className="login-container">

        {/* LEFT */}

        <div className="left-panel">

          {/* Logo */}

          <div className="logo-area">

            <img src={logo} className="logo"/>

            <div>

              <h1>
                PHONE <span>FORGE</span>
              </h1>

              <p>
                Mobile Manufacturing Platform
              </p>

            </div>

          </div>

          {/* Heading */}

          <div className="hero-text">

            <h2>
              Build Phones
              <br />
              <span>From Parts to Stores.</span>
            </h2>

            <div className="line"></div>

            <p>
              PhoneForge helps you manage suppliers, inventory, assembly,
              packing, and wholesale dispatch from a single control center.
            </p>

          </div>

          {/* Features */}

          <div className="feature-list">

            <div className="feature-card">
              <Package />
              <div>
                <h4>Supplier Network</h4>
                <p>Manage parts from overseas vendors</p>
              </div>
            </div>

            <div className="feature-card">
              <Warehouse />
              <div>
                <h4>Inventory Control</h4>
                <p>Track components and assembly stock</p>
              </div>
            </div>

            <div className="feature-card">
              <BarChart3 />
              <div>
                <h4>Production Analytics</h4>
                <p>Monitor yields and quality metrics</p>
              </div>
            </div>

            <div className="feature-card">
              <ShieldCheck />
              <div>
                <h4>Quality Assurance</h4>
                <p>Maintain inspection and compliance</p>
              </div>
            </div>

          </div>

          {/* Truck */}

          <div className="truck-image">

            <img src={truck} className="hero-truck"/>
          </div>

          {/* Stats */}

          <div className="stats-row">

            <div className="stat-box">
              <Package />
              <h3>420+</h3>
              <p>Suppliers</p>
            </div>

            <div className="stat-box">
              <Warehouse />
              <h3>15K+</h3>
              <p>Components</p>
            </div>

            <div className="stat-box">
              <ShieldCheck />
              <h3>99.9%</h3>
              <p>Quality Rate</p>
            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="right-panel">

          <div className="login-card">

            <div className="login-icon">

              <Package size={60} />

            </div>

            <h2>
              Welcome <span>Back!</span>
            </h2>

            <p>
              Sign in to access your manufacturing control center
            </p>

            <form onSubmit={handleLogin}>

              <label>Email or Username</label>

              <div className="input-box">

                <User size={20} />

                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />

              </div>

              <label>Password</label>

              <div className="input-box">

                <Lock size={20} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="eye-btn"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              <label>CAPTCHA Verification</label>

              <div className="captcha-row">
                <div className="captcha-image-box">
                  {captchaImage ? (
                    <img src={`data:image/png;base64,${captchaImage}`} alt="CAPTCHA" className="captcha-img" />
                  ) : captchaText && captchaText !== "ERROR" ? (
                    <canvas ref={canvasRef} className="captcha-img" />
                  ) : (
                    <span className="captcha-loading">Loading...</span>
                  )}
                </div>

                <button
                  type="button"
                  className="captcha-icon-btn"
                  onClick={loadCaptcha}
                  title="New captcha"
                >
                  <RefreshCw size={16} />
                </button>

                <button
                  type="button"
                  className="captcha-icon-btn"
                  onClick={speakCaptcha}
                  title="Hear the captcha"
                >
                  <Volume2 size={16} />
                </button>
              </div>

              <div className="input-box">

                <Lock size={20} />

                <input
                  type="text"
                  placeholder="Enter CAPTCHA"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  autoComplete="off"
                />

              </div>

              {error && (
                <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "-8px" }}>
                  {error}
                </p>
              )}

              <div className="login-options">

                <label>

                  <input type="checkbox" />

                  Remember Me

                </label>

                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setForgotEmail("");
                    setForgotMessage("");
                    setShowForgotModal(true);
                  }}
                >
                  Forgot Password?
                </a>

              </div>

              <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: "-8px" }}>
                Storing products or picking up/delivering goods?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/register"); }}>
                  Create a Customer / Company / Driver account
                </a>
              </p>

              <button className="login-btn" disabled={loading}>

                {loading ? "SIGNING IN..." : "SIGN IN →"}

              </button>

            </form>

            <div className="secure">

              <ShieldCheck />

              Secure & Encrypted Connection

            </div>

          </div>

        </div>

      </div>

      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Password"
      >
        <p style={{ color: "var(--muted)", marginBottom: "16px", fontSize: "14px" }}>
          Enter the email address linked to your account. We'll send a secure
          password-reset link if an account exists for it.
        </p>

        <form onSubmit={handleForgotPassword} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <input
            autoComplete="off"
            type="email"
            placeholder="Email address"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            style={{
              height: "48px",
              borderRadius: "12px",
              border: "1px solid var(--hairline-08)",
              background: "var(--surface-2)",
              color: "var(--text)",
              padding: "0 16px",
              outline: "none",
            }}
          />

          {forgotMessage && (
            <p style={{ color: "var(--accent-purple)", fontSize: "14px" }}>{forgotMessage}</p>
          )}

          <button className="save-btn" disabled={forgotLoading} style={{ height: "48px" }}>
            {forgotLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </Modal>

    </div>
  );
}

export default Login;
