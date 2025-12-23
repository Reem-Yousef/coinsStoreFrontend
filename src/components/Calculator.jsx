import { useState, useEffect } from "react";

const API_PACKAGES = "http://localhost:5000/api/packages";
const API_CONTACTS = "http://localhost:5000/api/contacts";

export default function Calculator() {
  const [packages, setPackages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [coins, setCoins] = useState("");
  const [amount, setAmount] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(API_PACKAGES).then(r => r.json()),
      fetch(API_CONTACTS).then(r => r.json())
    ])
      .then(([pkgData, contactData]) => {
        setPackages(pkgData.data || []);
        setContacts(contactData.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const findTierByCoins = (coinsNum) => {
    return packages.find(pkg => coinsNum >= pkg.minCoins && coinsNum <= pkg.maxCoins);
  };

  const findTierByAmount = (amountNum) => {
    for (let pkg of packages) {
      const minPrice = (pkg.minCoins / 1000) * pkg.pricePerK;
      const maxPrice = (pkg.maxCoins / 1000) * pkg.pricePerK;
      if (amountNum >= minPrice && amountNum <= maxPrice) {
        return pkg;
      }
    }
    return null;
  };

  const onCoinsChange = (value) => {
    setCoins(value);
    setWarning("");

    if (!value || value === "") {
      setAmount("");
      return;
    }

    const coinsNum = parseFloat(value);

    if (isNaN(coinsNum) || coinsNum <= 0) {
      setAmount("");
      return;
    }

    if (coinsNum > 100000) {
      setWarning("⚠️ للطلبات أكثر من 100,000 كوين، يرجى التواصل معنا مباشرة");
      setAmount("");
      return;
    }

    const tier = findTierByCoins(coinsNum);

    if (tier) {
      const calculatedAmount = (coinsNum / 1000) * tier.pricePerK;
      setAmount(calculatedAmount.toFixed(2));
    } else {
      setAmount("");
    }
  };

  const onAmountChange = (value) => {
    setAmount(value);
    setWarning("");

    if (!value || value === "") {
      setCoins("");
      return;
    }
    const amountNum = parseFloat(value);

if (isNaN(amountNum) || amountNum <= 0) {
  setCoins("");
  return;
}

const tier = findTierByAmount(amountNum);

if (tier) {
  const calculatedCoins = (amountNum / tier.pricePerK) * 1000;
  const roundedCoins = Math.floor(calculatedCoins);

  if (roundedCoins > 100000) {
    setWarning("⚠️ للطلبات أكثر من 100,000 كوين، يرجى التواصل معنا مباشرة");
    setCoins("");
    return;
  }

  setCoins(roundedCoins.toString());
} else {
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
    <div className="card">
    <div className="card-header">
    <span>💰</span><h2> شحن عملات تيك توك</h2>
    <p className="subtitle">للشحن السريع </p>
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

    {warning && (
      <div className="warning-box">
        {warning}
      </div>
    )}

    <button 
      className="btn-charge" 
      onClick={() => setShowPopup(true)}
      disabled={!coins || !amount}
    >
       اشحن الآن
    </button>

    <div className="pricing-info">
      <p>✨ أفضل الأسعار في السوق</p>
      <p>⚡ شحن فوري وآمن</p>
    </div>
  </div>

  {showPopup && (
    <div className="popup-overlay" onClick={() => setShowPopup(false)}>
      <div className="popup" onClick={e => e.stopPropagation()}>
        <div className="popup-header">
          <h3>📞 تواصل معنا الآن</h3>
          <button className="close-btn" onClick={() => setShowPopup(false)}>×</button>
        </div>
        
        <div className="contact-links">
          {contacts.map(contact => (
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
</>);
}
