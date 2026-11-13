import React, { useState } from "react";
import "./App.css";

function App() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [activeTab, setActiveTab] = useState("Track");

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      alert(`Tracking package: ${trackingNumber}`);
    }
  };

  return (
    <div className="site-shell">
      {/* Top Utility Bar */}
      <div className="utility-bar">
        <div className="utility-inner">
          <div className="utility-location">
            <span>📍 Find Closest Kuriaa247 Location ⌄</span>
          </div>
          <div className="utility-links">
            <button>Global</button>
            <span>|</span>
            <button>English ⌄</button>
            <span>|</span>
            <button>About Kuriaa247 ⌄</button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <div className="header-inner">
          <div className="header-left">
            <a href="#" className="brand-logo">
              <span className="logo-box">K24</span>
              <span className="logo-text">Kuriaa247</span>
            </a>
            <nav className="main-nav">
              <a href="#">Shipping</a>
              <a href="#">Tracking</a>
              <a href="#">Business Solutions</a>
              <a href="#">Support</a>
            </nav>
          </div>
          <div className="header-right">
            <button className="search-icon-btn">🔍</button>
            <button className="login-btn">Log In ⌄</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-left-col">
            <div className="hero-tabs">
              {["Track", "Quote", "Ship", "Billing"].map((tab) => (
                <button
                  key={tab}
                  className={activeTab === tab ? "hero-tab active" : "hero-tab"}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab} {tab === "Track" || tab === "Quote" ? "⌄" : ""}
                </button>
              ))}
            </div>
            
            <form className="tracking-form" onSubmit={handleTrack}>
              <input
                type="text"
                placeholder="Tracking Numbers or InfoNotice(s)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
              <button type="submit" className="track-submit-btn">Track ›</button>
            </form>
            <div className="hero-help-link">
              <a href="#">Need help changing your delivery? Get Help</a>
            </div>
          </div>
          
          {/* Replaced placeholder box with your custom uploaded image */}
  <div className="hero-right-col h-[400px] w-full overflow-hidden rounded-xl">
  <img src="/2.png" alt="Kuriaa247 Operations" className="hero-custom-img block h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Regulations & News Section */}
      <section className="regulations-section">
        <div className="section-container">
          <h2>Regulations Change. Kuriaa247 Can Help You Keep Moving.</h2>
          <p className="reg-subtitle">
            From shifting tariffs to evolving compliance rules, Kuriaa247 stays ahead so you don't fall behind. Our digital solutions and global logistics expertise turn complexity into clarity.
          </p>

          <div className="reg-grid">
            <div className="reg-card">
              <h3>Tariff Impacts</h3>
              <p>Review short-term updates, read all about resources to help you navigate these changes and streamline global shipping.</p>
            </div>
            <div className="reg-card">
              <h3>International Shipping Basics</h3>
              <p>Changes in UK import policy may impact your export shipments. Wave-certified tips to help you confidently navigate global shipping.</p>
            </div>
            <div className="reg-card">
              <h3>EU Customs Changes</h3>
              <p>On July 1, 2026, the European Union removed the €150 duty exemption for low value shipments. These changes may impact shipping costs and customs requirements for shipments to EU destinations.</p>
              <a href="#" className="card-link">Learn More ›</a>
            </div>
            <div className="reg-card">
              <h3>New CPSC eFiling Requirements</h3>
              <p>The Consumer Product Safety Commission is requiring electronic filing of Certificates of Compliance data effective July 6, 2026. Kuriaa247 is prepared to help international shippers stay compliant.</p>
              <a href="#" className="card-link">Learn More ›</a>
            </div>
          </div>
        </div>
      </section>

      {/* Start Shipping Split Banner */}
      <section className="shipping-banner-section">
        <div className="shipping-banner-inner">
          <div className="shipping-text">
            <h2>Let’s Start Shipping</h2>
            <p>You have parcels. We’ll take care of them.</p>
            <button className="primary-cta">Ship Now ›</button>
          </div>
          <div className="shipping-img-card">
            <div className="mock-courier-photo">
              <span>📦 Kuriaa247 Express Team</span>
            </div>
          </div>
        </div>
      </section>

      {/* Manage All Your Shipments Section */}
      <section className="manage-section">
        <div className="section-container manage-grid">
          <div className="manage-content">
            <h2>Manage All Your Shipments In One Place</h2>
            <p>See inbound and outbound parcels from one custom dashboard with Kuriaa247 My Choice® for Business.</p>
            <div className="manage-btns">
              <button className="btn-dark">Log In</button>
              <button className="btn-outline">Sign Up ›</button>
            </div>
          </div>
          <div className="manage-image">
            <div className="mock-dashboard-photo">
              <span>💻 Business Dashboard Preview</span>
            </div>
          </div>
        </div>
      </section>

      {/* World-Class Services & Quick Links */}
      <section className="quick-links-section">
        <div className="section-container">
          <h2>World-Class Services You Can Count On</h2>
          <h3 className="sub-heading">Quick Links</h3>
          
          <div className="links-columns">
            <div className="link-col">
              <a href="#">Tracking Support</a>
              <a href="#">Shipping Support</a>
            </div>
            <div className="link-col">
              <a href="#">International Tools</a>
              <a href="#">Find a Location</a>
            </div>
            <div className="link-col">
              <a href="#">Contact Us</a>
              <a href="#">View Rates, Rules and Charges</a>
            </div>
          </div>
        </div>
      </section>

      {/* EU Deforestation Notice Banner */}
      <section className="notice-banner">
        <div className="notice-inner">
          <div>
            <h4>Prepare to Comply With EU Deforestation Regulation (EUDR)</h4>
            <p>The EU Deforestation Regulation takes effect 30 December 2026 for medium and large enterprises, and 30 June 2027 for micro and small enterprises.</p>
          </div>
          <button className="notice-btn">Learn More ›</button>
        </div>
      </section>

      {/* Comprehensive Corporate Footer */}
      <footer className="corporate-footer">
        <div className="footer-inner">
          <div className="footer-cols">
            <div className="footer-col">
              <h5>This Site</h5>
              <a href="#">Tracking</a>
              <a href="#">Shipping</a>
              <a href="#">Help and Support</a>
              <a href="#">Kuriaa247 Developer Portal</a>
            </div>
            <div className="footer-col">
              <h5>Other Kuriaa247 Sites</h5>
              <a href="#">About Kuriaa247 ID</a>
              <a href="#">Supply Chain Solutions ›</a>
              <a href="#">Kuriaa247 Jobs ›</a>
              <a href="#">Kuriaa247 Developer Portal ›</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-legal">
              <a href="#">Global Home</a>
              <a href="#">Protect Against Fraud</a>
              <a href="#">Terms and Conditions</a>
              <a href="#">Privacy Notice</a>
              <a href="#">Cookie Settings</a>
            </div>
            <p>Copyright © 1994-2026 Kuriaa247 Parcel Service of America, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
