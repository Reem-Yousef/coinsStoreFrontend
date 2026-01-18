// src/pages/HomePage.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Calculator from "../components/Calculator";

export default function HomePage() {
  const navigate = useNavigate();
  const [imgVisible, setImgVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showSeoPopup, setShowSeoPopup] = useState(false);

  useEffect(() => {
    const checkDesktop = window.innerWidth > 768;
    setIsDesktop(checkDesktop);
    if (checkDesktop) setTimeout(() => setImgVisible(true), 100);
  }, []);

  // lock body scroll when popup open
  useEffect(() => {
    if (showSeoPopup) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [showSeoPopup]);

  return (
    <div className="page">
      <div className="gradient-bg"></div>

      {isDesktop && (
        <img
          className={`hero-img ${imgVisible ? "show" : ""}`}
          src="/background4.png"
          alt="Hero"
        />
      )}

      <Calculator />

      {showSeoPopup && (
        <div
          className="popup-overlay"
          onClick={() => setShowSeoPopup(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="popup seo-popup centered-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-header">
              <h3>📌 شحن عملات تيك توك</h3>
              <button
                className="close-btn"
                onClick={() => setShowSeoPopup(false)}
                aria-label="إغلاق"
              >
                ×
              </button>
            </div>

            <h1 className="seo-title">شحن عملات تيك توك من متجر الشيخ عفريت</h1>
            <p className="seo-text">
              متجر 3Fret (الشيخ عفريت) يقدم خدمة شحن وشراء عملات تيك توك بسرعة وأمان داخل مصر،
              مع إمكانية الدفع عبر فودافون كاش وInstaPay وPayPal وBinance.
            </p>

            <h2 className="seo-subtitle">لماذا تختار متجرنا؟</h2>
            <ul className="seo-list">
              <li>شحن فوري لعملات TikTok Coins</li>
              <li>دعم جميع طرق الدفع داخل مصر</li>
              <li>حماية كاملة للطلبات</li>
            </ul>
          </div>
        </div>
      )}

      <footer className="footer footer-row">
        <p className="footer-text">© 2025 TikTok Coins Calculator - All Rights Reserved</p>

        <button
          className="seo-info-inline"
          onClick={() => setShowSeoPopup(true)}
          aria-label="معلومات عن شحن عملات تيك توك"
          title="معلومات عن شحن عملات تيك توك"
        >
          ⓘ
        </button>
      </footer>
    </div>
  );
}
