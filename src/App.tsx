import { useEffect, useState } from 'react'
import {
  ArrowRight, ArrowUpRight, Anchor, Plane, Ship, Package, ShieldCheck, Clock3,
  MapPin, Menu, X, Search, Globe2, Headphones, CheckCircle2, Truck, Warehouse,
  ChevronDown, Mail, Phone, Instagram, Linkedin, Facebook, Calculator, LockKeyhole,
  Plus, LogOut, RefreshCw, Send, Boxes, Route, CircleHelp
} from 'lucide-react'

type EventItem = { location: string; status: string; details: string; event_time: string }
type Shipment = { tracking_number: string; sender: string; recipient: string; origin: string; destination: string; current_location: string; status: string; estimated_delivery: string; service: string; history: EventItem[] }

const demoTracking = 'KUR-2026-00482'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [trackError, setTrackError] = useState('')
  const [trackingBusy, setTrackingBusy] = useState(false)
  const [quoteSent, setQuoteSent] = useState(false)
  const [quoteBusy, setQuoteBusy] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [adminToken, setAdminToken] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState('')
  const [adminShipments, setAdminShipments] = useState<Shipment[]>([])
  const [newShipment, setNewShipment] = useState({ tracking_number: '', sender: '', recipient: '', origin: '', destination: '', current_location: '', status: 'Shipment created', estimated_delivery: '', service: 'Air Freight' })
  const [updateTracking, setUpdateTracking] = useState('')
  const [updateLocation, setUpdateLocation] = useState('')
  const [updateStatus, setUpdateStatus] = useState('In transit')
  const [updateDetails, setUpdateDetails] = useState('Shipment update')
  const [mobileAdmin, setMobileAdmin] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('track')
    if (t) { setTrackingNumber(t); setTimeout(() => trackShipment(t), 300) }
  }, [])

  async function trackShipment(value = trackingNumber) {
    if (!value.trim()) { setTrackError('Please enter your tracking number.'); return }
    setTrackingBusy(true); setTrackError(''); setShipment(null)
    try {
      const response = await fetch(`/api/track/${encodeURIComponent(value.trim())}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Tracking number not found.')
      setShipment(data)
      document.getElementById('tracking-result')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    } catch (error) { setTrackError(error instanceof Error ? error.message : 'Unable to track this shipment.') }
    finally { setTrackingBusy(false) }
  }

  async function submitQuote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setQuoteBusy(true)
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())
    try {
      const response = await fetch('/api/quotes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!response.ok) throw new Error('Could not submit your request.')
      setQuoteSent(true); e.currentTarget.reset()
    } catch { alert('Your request could not be submitted. Please try again.') }
    finally { setQuoteBusy(false) }
  }

  async function adminLogin(e: React.FormEvent) {
    e.preventDefault(); setAdminError('')
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: adminPassword }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      setAdminToken(data.token); setAdminPassword(''); await loadAdmin(data.token)
    } catch (err) { setAdminError(err instanceof Error ? err.message : 'Login failed') }
  }

  async function loadAdmin(token = adminToken) {
    const res = await fetch('/api/admin/shipments', { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) setAdminShipments(await res.json())
  }

  async function createShipment(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/shipments', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` }, body: JSON.stringify(newShipment) })
    const data = await res.json()
    if (!res.ok) { alert(data.error || 'Could not create shipment'); return }
    setNewShipment({ tracking_number: '', sender: '', recipient: '', origin: '', destination: '', current_location: '', status: 'Shipment created', estimated_delivery: '', service: 'Air Freight' })
    await loadAdmin()
    alert(`Shipment created. Tracking number: ${data.tracking_number}`)
  }

  async function addUpdate(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch(`/api/admin/shipments/${encodeURIComponent(updateTracking)}/events`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ location: updateLocation, status: updateStatus, details: updateDetails })
    })
    const data = await res.json()
    if (!res.ok) { alert(data.error || 'Could not update shipment'); return }
    await loadAdmin(); alert('Tracking update saved.')
  }

  const closeAdmin = () => { setAdminOpen(false); setAdminToken(''); setAdminShipments([]) }

  return (
    <div className="site-shell">
      <div className="topline"><div className="container topline-inner"><span><span className="live-dot" /> Global logistics, made simple</span><div><a href="mailto:hello@kuriaa247.example">hello@kuriaa247.example</a><span className="top-divider">|</span><span>Mon – Sat, 8:00 – 18:00</span></div></div></div>
      <header className="header">
        <div className="container nav-wrap">
          <a href="#" className="brand"><span className="brand-mark"><Route size={23} strokeWidth={2.5}/></span><span>kuriaa247<small>GLOBAL LOGISTICS</small></span></a>
          <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a><a href="#about" onClick={() => setMenuOpen(false)}>About us</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
            <button className="nav-track" onClick={() => { document.getElementById('tracking')?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }}>Track shipment <ArrowUpRight size={16}/></button>
          </nav>
          <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X/> : <Menu/>}</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-photo" />
          <div className="hero-overlay" />
          <div className="container hero-content">
            <div className="eyebrow light"><span /> SHIPPING WITHOUT BORDERS</div>
            <h1>Moving the world.<br/><em>Moving you forward.</em></h1>
            <p className="hero-copy">From a single package to a full container, we make international shipping feel effortless. Reliable routes, clear updates, and people who care.</p>
            <div className="hero-actions"><a className="btn btn-primary" href="#quote">Ship with confidence <ArrowRight size={18}/></a><a className="text-link light-link" href="#services">Explore our services <ArrowUpRight size={17}/></a></div>
            <div className="hero-proof"><div className="proof-avatars"><span>K7</span><span>GL</span><span>24</span></div><div><strong>Logistics with a human touch</strong><small>Built around your business and your time.</small></div></div>
          </div>
          <div className="hero-side-note"><span>01 / 04</span><i /> YOUR WORLD, CONNECTED</div>
        </section>

        <section className="tracking-band" id="tracking">
          <div className="container tracking-layout">
            <div className="tracking-intro"><span className="section-kicker">KNOW WHERE IT IS</span><h2>Your shipment.<br/><em>In the know.</em></h2><p>Get a clear view of your cargo's journey, from collection to its final destination.</p></div>
            <div className="tracking-card">
              <div className="tracking-card-head"><div><span className="tiny-label">LIVE SHIPMENT LOOKUP</span><h3>Track your shipment</h3></div><div className="tracking-icon"><Package size={23}/></div></div>
              <form className="track-form" onSubmit={e => { e.preventDefault(); trackShipment() }}><label htmlFor="tracking-number">Enter your tracking number</label><div className="track-input-wrap"><Search size={19}/><input id="tracking-number" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="e.g. KUR-2026-00482"/><button type="submit" disabled={trackingBusy}>{trackingBusy ? 'Checking…' : 'Track'} <ArrowRight size={17}/></button></div><div className="track-hint">Try demo number <button type="button" onClick={() => { setTrackingNumber(demoTracking); trackShipment(demoTracking) }}>{demoTracking}</button></div></form>
              {trackError && <div className="error-message">{trackError}</div>}
              {shipment && <div className="tracking-result" id="tracking-result">
                <div className="result-top"><div><span className="tiny-label">SHIPMENT FOUND</span><strong>{shipment.tracking_number}</strong></div><span className="status-pill"><span/> {shipment.status}</span></div>
                <div className="route-pair"><div><small>ORIGIN</small><strong>{shipment.origin}</strong></div><ArrowRight className="route-arrow"/><div><small>DESTINATION</small><strong>{shipment.destination}</strong></div></div>
                <div className="current-location"><MapPin size={17}/><span>Current location: <strong>{shipment.current_location}</strong></span></div>
                <div className="history-list">{shipment.history?.map((item, i) => <div className="history-item" key={i}><span className="history-dot"/><div><strong>{item.status}</strong><p>{item.details} · {item.location}</p><small>{new Date(item.event_time).toLocaleString()}</small></div></div>)}</div>
                <div className="delivery-estimate"><span>ESTIMATED DELIVERY</span><strong>{shipment.estimated_delivery || 'To be confirmed'}</strong></div>
              </div>}
            </div>
          </div>
        </section>

        <section className="stats-strip"><div className="container stats-grid"><div><strong>Worldwide</strong><span>Shipping reach</span></div><div><strong>Door to door</strong><span>Flexible delivery</span></div><div><strong>Every step</strong><span>Shipment visibility</span></div><div><strong>Human support</strong><span>When you need us</span></div></div></section>

        <section className="section services-section" id="services">
          <div className="container"><div className="section-heading"><div><span className="section-kicker">WHAT WE MOVE</span><h2>One partner. <em>Every route.</em></h2></div><p>Flexible freight solutions that help your goods move across borders with less friction and more certainty.</p></div>
            <div className="services-grid">
              <article className="service-card service-feature"><div className="service-image air-image"><span className="image-tag">01 / AIR</span></div><div className="service-content"><div className="service-icon"><Plane/></div><h3>Air freight</h3><p>When time matters, move your cargo quickly with dependable air freight solutions and coordinated handling.</p><a href="#quote">Explore air freight <ArrowUpRight size={16}/></a></div></article>
              <article className="service-card"><div className="service-image sea-image"><span className="image-tag">02 / OCEAN</span></div><div className="service-content"><div className="service-icon"><Ship/></div><h3>Ocean freight</h3><p>Cost-conscious FCL and LCL shipping for goods moving across the world's major trade lanes.</p><a href="#quote">Explore ocean freight <ArrowUpRight size={16}/></a></div></article>
              <article className="service-card"><div className="service-image road-image"><span className="image-tag">03 / LAND</span></div><div className="service-content"><div className="service-icon"><Truck/></div><h3>Road & last mile</h3><p>Reliable inland transport and final-mile coordination to connect ports, warehouses and doors.</p><a href="#quote">Explore road freight <ArrowUpRight size={16}/></a></div></article>
            </div>
          </div>
        </section>

        <section className="about-section" id="about"><div className="container about-grid"><div className="about-visual"><div className="about-photo"/><div className="about-stamp"><Globe2 size={26}/><strong>ONE WORLD.<br/>CONNECTED.</strong></div><div className="about-caption">LOGISTICS THAT<br/>KEEPS YOU MOVING</div></div><div className="about-copy"><span className="section-kicker">A BETTER WAY TO SHIP</span><h2>Big-world logistics.<br/><em>Personal attention.</em></h2><p className="lead">Shipping should open doors, not create obstacles. We bring clear communication, practical expertise and thoughtful coordination to every shipment.</p><p>Whether you're moving commercial cargo or sending goods to loved ones abroad, our goal is to make every step easier to understand and easier to manage.</p><div className="value-list"><div><ShieldCheck/><span><strong>Care at every handoff</strong><small>Thoughtful handling from origin to destination.</small></span></div><div><Clock3/><span><strong>Updates that make sense</strong><small>Useful shipment milestones, without the guesswork.</small></span></div><div><Headphones/><span><strong>People ready to help</strong><small>Support that understands your shipment.</small></span></div></div><a className="btn btn-dark" href="#contact">Get to know us <ArrowRight size={17}/></a></div></div></section>

        <section className="process-section" id="how-it-works"><div className="container"><div className="section-heading"><div><span className="section-kicker">A CLEARER JOURNEY</span><h2>Shipping, <em>made simple.</em></h2></div><p>From the first conversation to the final delivery, you know what happens next.</p></div><div className="process-grid"><div className="process-step"><span>01</span><div className="process-icon"><Calculator/></div><h3>Tell us what you need</h3><p>Share your cargo details, route and preferred shipping timeline.</p></div><div className="process-step"><span>02</span><div className="process-icon"><Boxes/></div><h3>We plan the journey</h3><p>Our team helps coordinate the right service and shipment arrangements.</p></div><div className="process-step"><span>03</span><div className="process-icon"><Route/></div><h3>Follow every milestone</h3><p>Use your tracking number to follow recorded shipment updates.</p></div><div className="process-step"><span>04</span><div className="process-icon"><CheckCircle2/></div><h3>Delivered with care</h3><p>Your goods reach their destination, with support along the way.</p></div></div></div></section>

        <section className="quote-section" id="quote"><div className="container quote-grid"><div className="quote-copy"><span className="section-kicker light-kicker">LET'S GET IT MOVING</span><h2>Your next shipment<br/>starts <em>right here.</em></h2><p>Tell us a little about what you're shipping. Our team can follow up with the details needed to prepare a tailored quote.</p><div className="quote-points"><span><CheckCircle2/> Clear shipping options</span><span><CheckCircle2/> Support with route planning</span><span><CheckCircle2/> No-obligation enquiry</span></div><div className="quote-contact"><span><Mail/> hello@kuriaa247.example</span><span><Phone/> +234 (0) 800 000 0000</span></div></div><div className="quote-form-card">{quoteSent ? <div className="success-state"><CheckCircle2 size={42}/><h3>Request received.</h3><p>Thank you for contacting Kuriaa247. Your enquiry has been saved. Our team can follow up using the contact details you provided.</p><button className="btn btn-dark" onClick={() => setQuoteSent(false)}>Send another enquiry</button></div> : <form onSubmit={submitQuote}><div className="form-title"><span className="tiny-label">SHIPPING ENQUIRY</span><h3>Request a quote</h3><p>Fields marked * are required.</p></div><div className="form-row"><label>Your name *<input name="name" required placeholder="Full name"/></label><label>Email address *<input name="email" type="email" required placeholder="you@example.com"/></label></div><div className="form-row"><label>Phone number<input name="phone" placeholder="+234..."/></label><label>Shipping service<select name="service"><option>Air freight</option><option>Ocean freight</option><option>Road freight</option><option>Express parcel</option><option>Not sure yet</option></select></label></div><div className="form-row"><label>Origin *<input name="origin" required placeholder="City, country"/></label><label>Destination *<input name="destination" required placeholder="City, country"/></label></div><label>Tell us about your shipment<textarea name="message" rows={3} placeholder="Cargo type, approximate weight, dimensions or questions…"/></label><button className="btn btn-primary submit-quote" type="submit" disabled={quoteBusy}>{quoteBusy ? 'Sending…' : 'Send quote request'} <ArrowRight size={17}/></button><small className="privacy-note"><LockKeyhole size={12}/> Your information is used to respond to this enquiry.</small></form>}</div></div></section>

        <section className="testimonials-section" id="testimonials">
          <div className="container">
            <div className="testimonials-heading">
              <span className="section-kicker">Client Testimonials</span>
              <h2>What Our Clients Say</h2>
            </div>
            <div className="testimonial-grid">
              <article className="testimonial-card">
                <img className="testimonial-avatar" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=320&h=320&q=85" alt="Sarah Jenkins, corporate headshot" loading="lazy" />
                <h3>Sarah Jenkins</h3>
                <div className="testimonial-role">Supply Chain Director</div>
                <div className="testimonial-company">Apex Retail</div>
                <div className="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote>“Kuriaa247 transformed our international freight operations. Their real-time tracking and customs clearance speed reduced our port delays by over 40%.”</blockquote>
              </article>
              <article className="testimonial-card">
                <img className="testimonial-avatar" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&h=320&q=85" alt="David Okafor, corporate headshot" loading="lazy" />
                <h3>David Okafor</h3>
                <div className="testimonial-role">Operations Manager</div>
                <div className="testimonial-company">BuildRight Supplies</div>
                <div className="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote>“Reliability is everything in construction logistics. Every container we've shipped through Kuriaa247 has arrived on schedule and completely intact.”</blockquote>
              </article>
              <article className="testimonial-card">
                <img className="testimonial-avatar" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=320&h=320&q=85" alt="Robert Chen, business headshot" loading="lazy" />
                <h3>Robert Chen</h3>
                <div className="testimonial-role">Founder</div>
                <div className="testimonial-company">Pacific Trade Imports</div>
                <div className="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote>“Their customer support team is unmatched. Having a dedicated logistics coordinator available 24/7 gives us complete peace of mind on every shipment.”</blockquote>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" id="contact"><div className="container"><div className="footer-main"><div className="footer-brand"><a href="#" className="brand brand-light"><span className="brand-mark"><Route size={23}/></span><span>kuriaa247<small>GLOBAL LOGISTICS</small></span></a><p>Thoughtful logistics for a world that never stands still. Wherever your goods need to go, let's move them forward.</p><div className="socials"><a href="#contact" aria-label="Instagram"><Instagram/></a><a href="#contact" aria-label="LinkedIn"><Linkedin/></a><a href="#contact" aria-label="Facebook"><Facebook/></a></div></div><div className="footer-col"><strong>Explore</strong><a href="#services">Our services</a><a href="#about">About us</a><a href="#how-it-works">How it works</a><a href="#quote">Request a quote</a></div><div className="footer-col"><strong>Shipping</strong><a href="#tracking">Track a shipment</a><a href="#services">Air freight</a><a href="#services">Ocean freight</a><a href="#services">Road freight</a></div><div className="footer-col"><strong>Get in touch</strong><a href="mailto:hello@kuriaa247.example">hello@kuriaa247.example</a><a href="tel:+2348000000000">+234 (0) 800 000 0000</a><span>Monday – Saturday</span><span>8:00 – 18:00 (WAT)</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Kuriaa247. All rights reserved.</span><span>Website concept · Replace sample company details before launch</span><button onClick={() => setAdminOpen(true)} className="admin-link">Admin access</button></div></div></footer>

      {adminOpen && <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) closeAdmin() }}><div className="admin-modal"><div className="admin-head"><div><span className="tiny-label">KURIAA247 CONTROL CENTRE</span><h2>Shipment admin</h2></div><button onClick={closeAdmin} className="icon-button"><X/></button></div>{!adminToken ? <form onSubmit={adminLogin} className="admin-login"><p>Sign in to manage shipment records and tracking milestones.</p><label>Admin password<input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required placeholder="Enter admin password"/></label>{adminError && <div className="error-message">{adminError}</div>}<button className="btn btn-primary" type="submit">Sign in <ArrowRight size={16}/></button><small>Set your password in the server .env file.</small></form> : <div className="admin-content"><div className="admin-toolbar"><span><CheckCircle2 size={16}/> Signed in</span><button onClick={() => loadAdmin()}><RefreshCw size={14}/> Refresh</button><button onClick={closeAdmin}><LogOut size={14}/> Sign out</button></div><div className="admin-columns"><form className="admin-panel" onSubmit={createShipment}><h3><Plus size={17}/> Create shipment</h3>{Object.entries(newShipment).map(([key, value]) => <label key={key}>{key.replace(/x/g, "y")}{key === 'status' ? <select value={value} onChange={e => setNewShipment({...newShipment, [key]: e.target.value})}><option>Shipment created</option><option>Picked up</option><option>In transit</option><option>At customs</option><option>Out for delivery</option><option>Delivered</option><option>Delayed</option></select> : key === 'service' ? <select value={value} onChange={e => setNewShipment({...newShipment, [key]: e.target.value})}><option>Air Freight</option><option>Ocean Freight</option><option>Road Freight</option><option>Express Parcel</option></select> : <input required={['tracking_number','sender','recipient','origin','destination','current_location'].includes(key)} type={key === 'estimated_delivery' ? 'date' : 'text'} value={value} placeholder={key === 'tracking_number' ? 'e.g. KUR-2026-10001' : ''} onChange={e => setNewShipment({...newShipment, [key]: e.target.value})}/>}</label>)}<button className="btn btn-dark" type="submit">Create shipment</button></form><form className="admin-panel" onSubmit={addUpdate}><h3><MapPin size={17}/> Add tracking update</h3><label>Tracking number<input required value={updateTracking} onChange={e => setUpdateTracking(e.target.value)} placeholder="KUR-2026-10001"/></label><label>New location<input required value={updateLocation} onChange={e => setUpdateLocation(e.target.value)} placeholder="Dubai, UAE"/></label><label>Status<select value={updateStatus} onChange={e => setUpdateStatus(e.target.value)}><option>Picked up</option><option>In transit</option><option>At customs</option><option>Customs cleared</option><option>Out for delivery</option><option>Delivered</option><option>Delayed</option></select></label><label>Update details<input value={updateDetails} onChange={e => setUpdateDetails(e.target.value)} placeholder="Arrived at sorting facility"/></label><button className="btn btn-primary" type="submit">Save tracking update</button><div className="admin-list"><h4>Recent shipments ({adminShipments.length})</h4>{adminShipments.slice(0, 8).map(s => <div key={s.tracking_number}><span><strong>{s.tracking_number}</strong><small>{s.origin} → {s.destination}</small></span><em>{s.status}</em></div>)}</div></form></div></div>}</div></div>}
    </div>
  )
}

export default App
