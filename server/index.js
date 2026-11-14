import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Database from 'better-sqlite3'
import jwt from 'jsonwebtoken'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

dotenv.config()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = Number(process.env.PORT || 4000)
const JWT_SECRET = process.env.JWT_SECRET || 'development-only-change-this-secret'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeThisAdminPassword123!'

app.use(cors())
app.use(express.json({ limit: '1mb' }))

const db = new Database(path.join(__dirname, 'kuriaa247.sqlite'))
db.pragma('journal_mode = WAL')
db.exec(`
  CREATE TABLE IF NOT EXISTS shipments (
    tracking_number TEXT PRIMARY KEY, sender TEXT NOT NULL, recipient TEXT NOT NULL,
    origin TEXT NOT NULL, destination TEXT NOT NULL, current_location TEXT NOT NULL,
    status TEXT NOT NULL, estimated_delivery TEXT, service TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS shipment_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT, tracking_number TEXT NOT NULL,
    location TEXT NOT NULL, status TEXT NOT NULL, details TEXT NOT NULL,
    event_time TEXT NOT NULL, FOREIGN KEY(tracking_number) REFERENCES shipments(tracking_number)
  );
  CREATE TABLE IF NOT EXISTS quote_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL,
    phone TEXT, service TEXT, origin TEXT NOT NULL, destination TEXT NOT NULL,
    message TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`)

const count = db.prepare('SELECT COUNT(*) AS n FROM shipments').get().n
if (count === 0) {
  const insert = db.prepare(`INSERT INTO shipments (tracking_number,sender,recipient,origin,destination,current_location,status,estimated_delivery,service) VALUES (?,?,?,?,?,?,?,?,?)`)
  const demo = ['KUR-2026-00482','Kuriaa247 Demo Customer','Jordan A.','Lagos, Nigeria','London, United Kingdom','Dubai, United Arab Emirates','In transit','2026-12-02','Air Freight']
  insert.run(...demo)
  const event = db.prepare(`INSERT INTO shipment_events (tracking_number,location,status,details,event_time) VALUES (?,?,?,?,?)`)
  event.run(demo[0], 'Lagos, Nigeria', 'Shipment picked up', 'Shipment received and processed at origin facility.', '2026-11-10T08:30:00.000Z')
  event.run(demo[0], 'Dubai, United Arab Emirates', 'In transit', 'Shipment arrived at the international transit hub.', '2026-11-12T14:15:00.000Z')
}

function adminOnly(req, res, next) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    if (payload.role !== 'admin') throw new Error('Invalid role')
    next()
  } catch { res.status(401).json({ error: 'Please sign in as an administrator.' }) }
}

function shipmentWithHistory(trackingNumber) {
  const shipment = db.prepare('SELECT * FROM shipments WHERE tracking_number = ?').get(trackingNumber)
  if (!shipment) return null
  shipment.history = db.prepare('SELECT location,status,details,event_time FROM shipment_events WHERE tracking_number = ? ORDER BY event_time DESC, id DESC').all(trackingNumber)
  return shipment
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'Kuriaa247 API' }))

app.get('/api/track/:trackingNumber', (req, res) => {
  const trackingNumber = String(req.params.trackingNumber || '').trim().toUpperCase()
  const shipment = shipmentWithHistory(trackingNumber)
  if (!shipment) return res.status(404).json({ error: 'We could not find that tracking number. Please check it and try again.' })
  res.json(shipment)
})

app.post('/api/quotes', (req, res) => {
  const { name, email, phone = '', service = '', origin, destination, message = '' } = req.body || {}
  if (![name, email, origin, destination].every(v => typeof v === 'string' && v.trim())) {
    return res.status(400).json({ error: 'Please provide your name, email, origin and destination.' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Please provide a valid email address.' })
  const result = db.prepare(`INSERT INTO quote_requests (name,email,phone,service,origin,destination,message) VALUES (?,?,?,?,?,?,?)`)
    .run(name.trim(), email.trim(), String(phone).slice(0,60), String(service).slice(0,80), origin.trim(), destination.trim(), String(message).slice(0,2000))
  res.status(201).json({ success: true, request_id: result.lastInsertRowid })
})

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {}
  if (typeof password !== 'string' || password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Incorrect admin password.' })
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '8h' })
  res.json({ token, expires_in: '8h' })
})

app.get('/api/admin/shipments', adminOnly, (_req, res) => {
  const shipments = db.prepare('SELECT * FROM shipments ORDER BY created_at DESC').all()
  res.json(shipments)
})

app.post('/api/admin/shipments', adminOnly, (req, res) => {
  const fields = ['tracking_number','sender','recipient','origin','destination','current_location','status','service']
  const body = req.body || {}
  if (fields.some(field => typeof body[field] !== 'string' || !body[field].trim())) {
    return res.status(400).json({ error: 'Please complete all required shipment fields.' })
  }
  const tracking = body.tracking_number.trim().toUpperCase()
  try {
    db.prepare(`INSERT INTO shipments (tracking_number,sender,recipient,origin,destination,current_location,status,estimated_delivery,service) VALUES (?,?,?,?,?,?,?,?,?)`)
      .run(tracking, body.sender.trim(), body.recipient.trim(), body.origin.trim(), body.destination.trim(), body.current_location.trim(), body.status.trim(), body.estimated_delivery || '', body.service.trim())
    db.prepare(`INSERT INTO shipment_events (tracking_number,location,status,details,event_time) VALUES (?,?,?,?,?)`)
      .run(tracking, body.current_location.trim(), body.status.trim(), 'Shipment record created.', new Date().toISOString())
    res.status(201).json({ success: true, tracking_number: tracking })
  } catch (error) {
    if (String(error).includes('UNIQUE')) return res.status(409).json({ error: 'That tracking number already exists.' })
    res.status(500).json({ error: 'Unable to create shipment.' })
  }
})

app.post('/api/admin/shipments/:trackingNumber/events', adminOnly, (req, res) => {
  const tracking = String(req.params.trackingNumber).trim().toUpperCase()
  const { location, status, details = '' } = req.body || {}
  if (![location, status].every(v => typeof v === 'string' && v.trim())) return res.status(400).json({ error: 'Location and status are required.' })
  const exists = db.prepare('SELECT tracking_number FROM shipments WHERE tracking_number = ?').get(tracking)
  if (!exists) return res.status(404).json({ error: 'Shipment not found.' })
  const time = new Date().toISOString()
  const update = db.transaction(() => {
    db.prepare('UPDATE shipments SET current_location = ?, status = ? WHERE tracking_number = ?').run(location.trim(), status.trim(), tracking)
    db.prepare('INSERT INTO shipment_events (tracking_number,location,status,details,event_time) VALUES (?,?,?,?,?)').run(tracking, location.trim(), status.trim(), String(details).slice(0,500), time)
  })
  update()
  res.status(201).json({ success: true })
})

app.get('/api/admin/quotes', adminOnly, (_req, res) => {
  res.json(db.prepare('SELECT * FROM quote_requests ORDER BY created_at DESC LIMIT 200').all())
})

// Serve the production frontend from the same Node server.
const distPath = path.resolve(__dirname, '../dist')
app.use(express.static(distPath))
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next()
  res.sendFile(path.join(distPath, 'index.html'), err => { if (err) next() })
})

app.listen(PORT, () => {
  console.log(`Kuriaa247 API running on http://localhost:${PORT}`)
  if (!process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
    console.warn('WARNING: Set ADMIN_PASSWORD and JWT_SECRET in .env before using this outside local development.')
  }
})
