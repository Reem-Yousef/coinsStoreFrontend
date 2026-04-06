import { useState, useEffect, useRef } from "react";

const API_CONTACTS = "https://coins-store-backend.vercel.app/api/contacts";
const API_CALCULATE = "https://coins-store-backend.vercel.app/api/packages/calculate";

const getContactIcon = (type) => {
  if (type === 'whatsapp') return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.856L.057 23.57a.75.75 0 00.906.919l5.857-1.53A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.695 9.695 0 01-4.947-1.355l-.355-.21-3.676.961.983-3.588-.23-.368A9.698 9.698 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
    </svg>
  );
  if (type === 'telegram') return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="#229ED9">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
    </svg>
  );
  return <span>💬</span>;
};

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

    if (coinsTimerRef.current) clearTimeout(coinsTimerRef.current);

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

    if (amountTimerRef.current) clearTimeout(amountTimerRef.current);

    if (!value || value === "" || value === "0") {
      setCoins("");
      return;
    }

    amountTimerRef.current = setTimeout(() => {
      calculateFromAmount(value);
    }, 300);
  };

  const createMessage = () => {
    return `مرحباً 👋

أريد شحن:
🪙 عدد الكوينات: ${coins}
💰 المبلغ: ${amount} جنيه مصري

يرجى تأكيد الطلب.`;
  };

  const getContactLink = (contact) => {
    const message = encodeURIComponent(createMessage());
    const url = contact.url.trim();

    if (contact.type === 'whatsapp' || url.includes('wa.me') || url.includes('whatsapp')) {
      const phoneMatch = url.match(/wa\.me\/(\+?[\d]+)|phone=(\+?[\d]+)|whatsapp\.com\/send\?phone=(\+?[\d]+)/);
      const phone = phoneMatch ? (phoneMatch[1] || phoneMatch[2] || phoneMatch[3]) : url.replace(/\D/g, '');
      return `https://wa.me/${phone}?text=${message}`;
    }

    if (contact.type === 'telegram' || url.includes('t.me')) {
      const usernameMatch = url.match(/t\.me\/([^?\/]+)/);
      const username = usernameMatch ? usernameMatch[1] : "";
      return `https://t.me/${username}?text=${message}`;
    }

    return url;
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

        <div className="payment-methods">
          <p className="payment-label">طرق الدفع المتاحة:</p>
          <div className="payment-icons">
            <div className="payment-icon paypal">
              <img src="/PayPal.svg.png" alt="PayPal" loading="lazy" />
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
                
                  key={contact._id}
                  href={getContactLink(contact)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-btn"
                >
                  <span className="icon">{getContactIcon(contact.type)}</span>
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

