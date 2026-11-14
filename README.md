# Kuriaa247 — International Shipping Website

A React + TypeScript website with an Express API and SQLite database. It includes a responsive logistics landing page, shipment tracking, quote requests and a protected admin area for managing shipment records and tracking events.

## Requirements
- Node.js 20 LTS or newer
- npm
- VS Code (recommended)

## 1. Open the project
1. Extract `kuriaa247-shipping-website.zip`.
2. Open the extracted `kuriaa247-shipping-website` folder in VS Code.
3. Open Terminal → New Terminal.

## 2. Install dependencies
```bash
npm install
```

## 3. Configure the backend
1. Copy `.env.example` and name the copy `.env`.
2. Open `.env` and change both values:
```env
PORT=4000
JWT_SECRET=put-a-long-random-secret-here
ADMIN_PASSWORD=choose-a-strong-private-password
```
Do not share your `.env` file or commit it to GitHub.

## 4. Start the website
```bash
npm run dev
```
Open the local address printed by Vite (usually http://localhost:5173).

The API runs on http://localhost:4000. SQLite creates its database automatically at `server/kuriaa247.sqlite` the first time the server starts.

## 5. Test shipment tracking
Use this seeded demonstration tracking number:
```text
KUR-2026-00482
```
The demo record is illustrative. Create real shipment records through the Admin access link in the website footer.

## 6. Admin dashboard
1. Click **Admin access** at the bottom of the website.
2. Sign in with the `ADMIN_PASSWORD` value from your `.env` file.
3. Create a shipment with a unique tracking number.
4. Use **Add tracking update** to record each new location, status and event description.
5. Customers can then enter that tracking number on the homepage.

## 7. Build for production
```bash
npm run build
npm start
```
The Express server serves the production frontend from `dist` and the API from `/api`.

## Important before public launch
- Kuriaa247 is the website brand used throughout this project. Add your official registered company details and logo before launch.
- Replace the `.example` email, sample phone number and sample company details with real business contact information.
- The Client Testimonials section displays the three testimonial texts and names supplied for this website update. Confirm that the named people and statements are approved for publication before launch.
- The sample shipment is demonstration data. Delete it before launch if not needed.
- This tracking feature displays shipment events entered by your team. It does not automatically obtain GPS or carrier scan data. For automatic carrier updates, integrate the relevant courier/freight provider APIs.
- The shipping quote form stores enquiries in SQLite. The included admin API can retrieve quote requests; an email notification service and a quote-management screen are not configured.
- Configure HTTPS, production secrets, database backups, rate limiting, input validation, privacy policy, terms, and appropriate data-protection controls before accepting real customer data.
- The sample contact details and service claims are placeholders, not verified business information.

## Project structure
```text
kuriaa247-shipping-website/
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── server/
│   └── index.js
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── .env.example
└── README.md
```

## API endpoints
- `GET /api/health` — API health check
- `GET /api/track/:trackingNumber` — public shipment tracking
- `POST /api/quotes` — submit a shipping enquiry
- `POST /api/admin/login` — administrator login
- `GET /api/admin/shipments` — list shipments (admin)
- `POST /api/admin/shipments` — create shipment (admin)
- `POST /api/admin/shipments/:trackingNumber/events` — add tracking event (admin)
- `GET /api/admin/quotes` — list quote requests (admin)

Admin endpoints require a bearer token returned by the login endpoint.
