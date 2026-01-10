import { useState, useEffect, useRef } from "react";

const API_CONTACTS = "https://coins-store-backend.vercel.app/api/contacts";
const API_CALCULATE = "https://coins-store-backend.vercel.app/api/packages/calculate";

export default function Calculator() {
  const [contacts, setContacts] = useState([]);
  const [coins, setCoins] = useState("");
  const [amount, setAmount] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  
  const coinsTimerRef = useRef(null);
  const amountTimerRef = useRef(null);
  const coinsCacheRef = useRef({});
  const amountCacheRef = useRef({});

  useEffect(() => {
    fetch(API_CONTACTS)
      .then((r) => r.json())
      .then((contactData) => {
        setContacts(contactData.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const calculateFromCoins = async (value) => {
    const coinsNum = Number(value);
    
    if (isNaN(coinsNum) || coinsNum <= 0) {
      setAmount("");
      return;
    }

    if (coinsNum > 100000) {
      setWarning("⚠️ للطلبات أكثر من 100,000 كوين، يرجى التواصل معنا مباشرة");
      setAmount("");
      return;
    }

    if (coinsCacheRef.current[coinsNum]) {
      setAmount(coinsCacheRef.current[coinsNum]);
      return;
    }

    setCalculating(true);
    try {
      const res = await fetch(API_CALCULATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coins: coinsNum }),
      });

      if (!res.ok) {
        setAmount("");
        return;
      }

      const data = await res.json();
      
      if (data.success && data.price) {
        const priceStr = data.price.toFixed(2);
        coinsCacheRef.current[coinsNum] = priceStr;
        setAmount(priceStr);
      } else {
        setAmount("");
      }
    } catch (err) {
      console.error(err);
      setAmount("");
    } finally {
      setCalculating(false);
    }
  };

  const calculateFromAmount = async (value) => {
    const amountNum = Number(value);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      setCoins("");
      return;
    }

    if (amountCacheRef.current[amountNum]) {
      setCoins(amountCacheRef.current[amountNum]);
      return;
    }

    setCalculating(true);
    try {
      const res = await fetch(API_CALCULATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountNum }),
      });

      if (!res.ok) {
        setCoins("");
        return;
      }

      const data = await res.json();

      if (data.success && data.coins) {
        if (data.coins > 100000) {
          setWarning("⚠️ للطلبات أكثر من 100,000 كوين، يرجى التواصل معنا مباشرة");
          setCoins("");
          return;
        }

        const coinsStr = data.coins.toString();
        amountCacheRef.current[amountNum] = coinsStr;
        setCoins(coinsStr);
      } else {
        setCoins("");
      }
    } catch (err) {
      console.error(err);
      setCoins("");
    } finally {
      setCalculating(false);
    }
  };

  const onCoinsChange = (value) => {
    setCoins(value);
    setWarning("");
    
    if (coinsTimerRef.current) {
      clearTimeout(coinsTimerRef.current);
    }
    
    if (!value || value === "" || value === "0") {
      setAmount("");
      return;
    }
    
    coinsTimerRef.current = setTimeout(() => {
      calculateFromCoins(value);
    }, 300);
  };

  const onAmountChange = (value) => {
    setAmount(value);
    setWarning("");
    
    if (amountTimerRef.current) {
      clearTimeout(amountTimerRef.current);
    }

    if (!value || value === "" || value === "0") {
      setCoins("");
      return;
    }
    
    amountTimerRef.current = setTimeout(() => {
      calculateFromAmount(value);
    }, 300);
  };

  // ✅ دالة لإنشاء رسالة مخصصة
  const createMessage = () => {
    return `مرحباً 👋

أريد شحن:
🪙 عدد الكوينات: ${coins}
💰 المبلغ: ${amount} جنيه مصري

يرجى تأكيد الطلب.`;
  };

  // ✅ دالة لإنشاء رابط مع الرسالة
  const getContactLink = (contact) => {
    const message = encodeURIComponent(createMessage());
    
    // للواتساب
    if (contact.label.includes("واتساب") || contact.label.toLowerCase().includes("whatsapp")) {
      const phoneMatch = contact.url.match(/phone=(\d+)|wa\.me\/(\d+)/);
      const phone = phoneMatch ? (phoneMatch[1] || phoneMatch[2]) : "";
      return `https://wa.me/${phone}?text=${message}`;
    }
    
    // للتليجرام
    if (contact.label.includes("تليجرام") || contact.label.toLowerCase().includes("telegram")) {
      const usernameMatch = contact.url.match(/t\.me\/([^?]+)/);
      const username = usernameMatch ? usernameMatch[1] : "";
      return `https://t.me/${username}?text=${message}`;
    }
    
    // للروابط الأخرى
    return contact.url;
  };

  if (loading) {
    return (
      <div className="calculator-wrapper">
        <div className="card">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="features-floating">
        <div className="feature-badge">
          <span className="feature-icon">⚡</span>
          <span>سرعة فائقة</span>
        </div>
        <div className="feature-badge">
          <span className="feature-icon">🛡️</span>
          <span>ثقة وأمان</span>
        </div>
        <div className="feature-badge">
          <span className="feature-icon">🔥</span>
          <span>أسعار نار</span>
        </div>
      </div>

      <div className="card">
        <div className="card-mascot">
          <picture>
            <source 
              srcSet="/3fret-small.webp 180w, /3fret.webp 220w" 
              sizes="(max-width: 480px) 180px, 220px"
              type="image/webp" 
            />
            <img
              srcSet="/3fret-small.png 180w, /3fret.png 220w"
              sizes="(max-width: 480px) 180px, 220px"
              src="/3fret.png"
              alt="TikTok Mascot"
              width="220"
              height="220"
              loading="eager"
              decoding="async"
            />
          </picture>
        </div>

        <div className="card-header">
          <div className="header-title-wrapper">
            <picture>
              <source srcSet="/coin1.webp" type="image/webp" />
              <img
                src="/coin1.png"
                alt="Coin"
                className="coin-icon"
                width="23"
                height="23"
                loading="eager"
                decoding="async"
              />
            </picture>
            <h2 className="main-title">متجر الشيخ عفريت</h2>
          </div>
          <p className="subtitle">لشحن العملات السريع والامن</p>
        </div>

        <div className="input-group">
          <label>عدد الكوينات</label>
          <input
            type="number"
            placeholder="أدخل عدد الكوينات"
            value={coins}
            onChange={(e) => onCoinsChange(e.target.value)}
            onInput={(e) => onCoinsChange(e.target.value)}
            min="0"
            step="1"
          />
        </div>

        <div className="divider">
          <span>⇄</span>
        </div>

        <div className="input-group">
          <label>المبلغ (جنيه مصري)</label>
          <input
            type="number"
            placeholder="أدخل المبلغ"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            onInput={(e) => onAmountChange(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        {warning && <div className="warning-box">{warning}</div>}

        <button
          className="btn-charge"
          onClick={() => setShowPopup(true)}
          disabled={!coins || !amount || calculating}
        >
          {calculating ? "جاري الحساب..." : "اشحن الآن"}
        </button>

        <div className="payment-methods">
          <p className="payment-label">طرق الدفع المتاحة:</p>
          <div className="payment-icons">
            <div className="payment-icon paypal">
              <img
                src="/PayPal.svg.png"
                alt="PayPal"
                loading="lazy"
              />
            </div>
            <div className="payment-icon binance">
              <span>Binance</span>
            </div>
            <div className="payment-icon vodafone">
              <span>Vodafone Cash</span>
            </div>
            <div className="payment-icon instapay">
              <span>InstaPay</span>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>📞 تواصل معنا الآن</h3>
              <button className="close-btn" onClick={() => setShowPopup(false)}>
                ×
              </button>
            </div>

            <div className="contact-links">
              {contacts.map((contact) => (
                <a
                  key={contact._id}
                  href={getContactLink(contact)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-btn"
                >
                  <span className="icon">{contact.icon}</span>
                  {contact.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}