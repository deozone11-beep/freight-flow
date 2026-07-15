import { useEffect, useRef } from "react";

const COLORS = ["#1e3a8a", "#7c2d12", "#166534", "#581c87", "#9d174d", "#0c4a6e"];
const LINE_COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ec4899"];

function CaptchaCanvas({ text, width = 160, height = 52 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !text) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Noise lines
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = LINE_COLORS[i % LINE_COLORS.length];
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
      ctx.fillStyle = LINE_COLORS[Math.floor(Math.random() * LINE_COLORS.length)];
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Characters, each rotated/offset/colored independently
    const charWidth = width / (text.length + 1);
    text.split("").forEach((ch, i) => {
      const x = charWidth * (i + 1);
      const y = height / 2 + (Math.random() * 10 - 5);
      const angle = (Math.random() * 40 - 20) * (Math.PI / 180);
      const size = 20 + Math.random() * 5;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.font = `800 ${size}px Poppins, sans-serif`;
      ctx.fillStyle = COLORS[Math.floor(Math.random() * COLORS.length)];
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    });
  }, [text, width, height]);

  return <canvas ref={canvasRef} className="captcha-canvas" />;
}

export default CaptchaCanvas;
