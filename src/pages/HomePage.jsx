import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Calculator from "../components/Calculator";

export default function HomePage() {
  const navigate = useNavigate();
  const [keySequence, setKeySequence] = useState("");
  const [imgVisible, setImgVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect device
  useEffect(() => {
    setIsDesktop(window.innerWidth > 768);
  }, []);

  // Desktop: Secret keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.match(/[a-z]/i)) {
        setKeySequence(prev =>
          (prev + e.key.toLowerCase()).slice(-5)
        );
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, []);

  useEffect(() => {
    if (keySequence === "remoz") {
      navigate("/admin/login");
      setKeySequence("");
    }
  }, [keySequence, navigate]);

  return (
    <div className="page">
      {/* Gradient خفيف */}
      <div className="gradient-bg"></div>

      {/* ✅ الصورة تظهر على Desktop فقط */}
      {isDesktop && (
        <img
          src="/background4.png"
          className={`hero-img ${imgVisible ? "show" : ""}`}
          alt="TikTok"
          fetchpriority="high"
          decoding="async"
          width="500"
          height="800"
          onLoad={() => setImgVisible(true)}
        />
      )}

      <Calculator />

      <footer className="footer">
        <p>© 2025 TikTok Coins Calculator - All Rights Reserved</p>
      </footer>
    </div>
  );
}
