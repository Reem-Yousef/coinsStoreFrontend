import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Calculator from "../components/Calculator";

export default function HomePage() {
  const navigate = useNavigate();
  const [keySequence, setKeySequence] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  // Desktop: Secret keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.match(/[a-z]/i)) {
        setKeySequence(prev => (prev + e.key.toLowerCase()).slice(-5));
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

  // ✅ Preload الصورة الكبيرة
  useEffect(() => {
    const img = new Image();
    img.src = "/background4.png";
    img.onload = () => setImageLoaded(true);
  }, []);

  return (
    <div className="page">
      {/* ✅ Simplified gradient - أخف على الأداء */}
      <div className="gradient-bg"></div>
      
      {/* ✅ Lazy load الصورة مع fadeIn */}
      {imageLoaded && (
        <img 
          src="/background4.png" 
          className="hero-img" 
          alt="TikTok"
          loading="lazy"
          decoding="async"
          style={{
            animation: 'fadeIn 0.5s ease-in'
          }}
        />
      )}
      
      <Calculator />
      
      <footer className="footer">
        <p>© 2025 TikTok Coins Calculator - All Rights Reserved</p>
      </footer>
    </div>
  );
}