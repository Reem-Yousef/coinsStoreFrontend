import { useState, useEffect } from "react";

const API_CONTACTS = "https://coins-store-backend.vercel.app/api/contacts";
const API_CALCULATE =
  "https://coins-store-backend.vercel.app/api/packages/calculate";

export default function Calculator() {
  const [contacts, setContacts] = useState([]);
  const [coins, setCoins] = useState("");
  const [amount, setAmount] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

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

  // Debouncing للحساب من الكوينات
  useEffect(() => {
    const timer = setTimeout(() => {
      if (coins && coins !== "0") {
        calculateFromCoins(coins);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [coins]);

  // Debouncing للحساب من المبلغ
  useEffect(() => {
    const timer = setTimeout(() => {
      if (amount && amount !== "0") {
        calculateFromAmount(amount);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [amount]);

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
        setAmount(data.price.toFixed(2));
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

        setCoins(data.coins.toString());
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
    
    if (!value || value === "" || value === "0") {
      setAmount("");
    }
  };

  const onAmountChange = (value) => {
    setAmount(value);
    setWarning("");

    if (!value || value === "" || value === "0") {
      setCoins("");
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      {/* Features Section */}
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
        {/* Red Creature at Top */}
        <div className="card-mascot">
          <img
            src="/3fret.png"
            alt="TikTok Mascot"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        <div className="card-header">
          <div className="header-title-wrapper">
            <img src="/coin1.png" alt="Coin" className="coin-icon" />
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

        {/* Payment Methods Section */}
        <div className="payment-methods">
          <p className="payment-label">طرق الدفع المتاحة:</p>
          <div className="payment-icons">
            <div className="payment-icon paypal">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
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
                  href={contact.url}
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