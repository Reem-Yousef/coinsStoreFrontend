import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Calculator from "../components/Calculator";
import demon from "/background4.png";

export default function HomePage() {
  const navigate = useNavigate();
  const [keySequence, setKeySequence] = useState("");
  const [tapCount, setTapCount] = useState(0);

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
    if (keySequence === "admin") {
      navigate("/admin/login");
      setKeySequence("");
    }
  }, [keySequence, navigate]);

  // Mobile: Tap footer 5 times quickly
  const handleFooterTap = () => {
    setTapCount(prev => prev + 1);
    
    setTimeout(() => setTapCount(0), 2000); // Reset after 2 seconds
    
    if (tapCount + 1 >= 5) {
      navigate("/admin/login");
      setTapCount(0);
    }
  };

  return (
    <div className="page">
      <div className="gradient-bg"></div>
      <img src={demon} className="hero-img" alt="TikTok" />
      <Calculator />
      
      <footer className="footer" onClick={handleFooterTap}>
        <p>© 2025 TikTok Coins Calculator - All Rights Reserved</p>
        {tapCount > 0 && tapCount < 5 && (
          <span className="tap-indicator">{tapCount}/5</span>
        )}
      </footer>
    </div>
  );
}