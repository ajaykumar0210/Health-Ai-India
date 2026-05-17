# 🚀 Health AI India — Implementation Plan (Launch Roadmap)
### End-to-End Build Guide | May 2026

---

## 📊 Current Status

| Layer | Status | Notes |
|---|---|---|
| Mobile App (React Native) | ✅ **100% Done** | All 25+ screens built |
| Doctor Panel (React + Vite) | ✅ **100% Done** | All pages built |
| Admin Panel (React + Vite) | ✅ **100% Done** | All pages built |
| APK Build Fix | ✅ **Done** | Removed deprecated expo-firebase-recaptcha |
| **Backend API** | ❌ **0% — NOT STARTED** | Biggest gap |
| **Database Schema** | ❌ **0% — NOT STARTED** | No SQL file yet |
| **Frontend ↔ Backend Connection** | ❌ **0%** | API_BASE_URL is fake |
| **Deployment (Azure)** | ❌ **0%** | Nothing deployed |

---

## 🗓️ Build Plan — 6 Phases to Launch

```
Phase 1 → Database (2 days)
Phase 2 → Backend API (7 days)
Phase 3 → Connect Frontend (3 days)
Phase 4 → Deploy to Azure (2 days)
Phase 5 → Testing (3 days)
Phase 6 → Launch (1 day)
─────────────────────────────
Total: ~18 days to production launch
```

---

## Phase 1 — Database Schema (2 days)

### What to build
File: `database/schema.sql`

### Tables to create

```sql
-- 1. Users (registered app users)
CREATE TABLE users (
  id INT PRIMARY KEY IDENTITY,
  phone VARCHAR(15) UNIQUE,
  email VARCHAR(100) UNIQUE,
  name VARCHAR(100),
  age INT,
  gender VARCHAR(10),
  language VARCHAR(10) DEFAULT 'hi',
  firebase_uid VARCHAR(200) UNIQUE,
  is_active BIT DEFAULT 1,
  created_at DATETIME DEFAULT GETDATE()
);

-- 2. Health concerns selected by user
CREATE TABLE user_concerns (
  id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES users(id),
  concern_type VARCHAR(50),   -- hair_fall, skin, sexual, diabetes, stress, weight
  status VARCHAR(20) DEFAULT 'active',
  started_at DATETIME DEFAULT GETDATE(),
  resolved_at DATETIME NULL
);

-- 3. AI health profile per concern
CREATE TABLE health_profiles (
  id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES users(id),
  concern_id INT FOREIGN KEY REFERENCES user_concerns(id),
  symptoms TEXT,
  ai_root_cause TEXT,
  combined_analysis TEXT,
  updated_at DATETIME DEFAULT GETDATE()
);

-- 4. Doctors
CREATE TABLE doctors (
  id INT PRIMARY KEY IDENTITY,
  name VARCHAR(100),
  specialization VARCHAR(100),
  mci_license VARCHAR(50) UNIQUE,
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(200),
  rating FLOAT DEFAULT 5.0,
  total_consultations INT DEFAULT 0,
  is_verified BIT DEFAULT 0,
  is_active BIT DEFAULT 1,
  created_at DATETIME DEFAULT GETDATE()
);

-- 5. Consultations (bookings)
CREATE TABLE consultations (
  id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES users(id),
  doctor_id INT FOREIGN KEY REFERENCES doctors(id),
  concern_id INT FOREIGN KEY REFERENCES user_concerns(id),
  scheduled_at DATETIME,
  status VARCHAR(20) DEFAULT 'booked',  -- booked, completed, cancelled, refunded
  prescription_url VARCHAR(500) NULL,
  duration_minutes INT NULL,
  razorpay_order_id VARCHAR(100) NULL,
  amount INT,
  created_at DATETIME DEFAULT GETDATE()
);

-- 6. Subscriptions
CREATE TABLE subscriptions (
  id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES users(id),
  plan_type VARCHAR(30),   -- freemium, rural_basic, standard, care, multi_care, annual
  razorpay_subscription_id VARCHAR(100) NULL,
  razorpay_order_id VARCHAR(100) NULL,
  start_date DATETIME,
  end_date DATETIME,
  status VARCHAR(20) DEFAULT 'active',
  amount INT,
  created_at DATETIME DEFAULT GETDATE()
);

-- 7. Progress logs
CREATE TABLE progress_logs (
  id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES users(id),
  concern_id INT FOREIGN KEY REFERENCES user_concerns(id),
  log_date DATE DEFAULT CAST(GETDATE() AS DATE),
  improvement_score INT,   -- 1 to 10
  medication_taken BIT DEFAULT 0,
  sleep_hours FLOAT NULL,
  notes TEXT NULL,
  created_at DATETIME DEFAULT GETDATE()
);
```

### Setup steps
1. Go to [portal.azure.com](https://portal.azure.com)
2. Create → Azure SQL Database → Serverless tier
3. Server: `healthai-server`, Region: Central India
4. Copy the connection string → save in `.env`
5. Run `schema.sql` in Azure Query Editor

---

## Phase 2 — Backend API (7 days)

### Folder structure to create

```
backend/
├── package.json
├── server.js                  ← Express app entry point
├── .env.example               ← All env variables listed
├── src/
│   ├── routes/
│   │   ├── auth.js            ← Day 1
│   │   ├── symptoms.js        ← Day 2
│   │   ├── doctors.js         ← Day 3
│   │   ├── consultations.js   ← Day 4
│   │   ├── subscriptions.js   ← Day 5
│   │   └── progress.js        ← Day 6
│   ├── middleware/
│   │   ├── auth.js            ← JWT verify (Day 1)
│   │   └── rateLimit.js       ← Rate limiting (Day 1)
│   ├── services/
│   │   ├── gemini.js          ← Google Gemini AI (Day 2)
│   │   ├── razorpay.js        ← Payments (Day 5)
│   │   └── notifications.js   ← Firebase FCM (Day 6)
│   └── db/
│       └── connection.js      ← Azure SQL connection (Day 1)
```

### Day-by-Day Build Order

#### Day 1 — Foundation
- `package.json` with all dependencies
- `server.js` — Express + CORS + helmet + rate limit
- `db/connection.js` — Azure SQL connection pool
- `middleware/auth.js` — Verify Firebase JWT token
- `middleware/rateLimit.js` — 100 req/min per IP

```bash
npm install express cors dotenv helmet express-rate-limit
npm install jsonwebtoken mssql firebase-admin
npm install @google/generative-ai razorpay
```

#### Day 2 — Auth Routes (`routes/auth.js`)
```
POST /auth/profile       ← Save user profile after Firebase login
GET  /auth/profile       ← Get my profile
PUT  /auth/profile       ← Update profile
POST /auth/concerns      ← Save selected health concerns
GET  /auth/concerns      ← Get my concerns
```
- Firebase Admin SDK validates JWT from app
- On first login → create row in `users` table
- Return user profile + concerns

#### Day 3 — AI Symptom Routes (`routes/symptoms.js` + `services/gemini.js`)
```
POST /symptoms/chat      ← AI chat (Hindi + English)
POST /symptoms/root-cause ← Multi-problem root cause analysis
```
- Connect Google Gemini API
- System prompt: "You are a health assistant for India. Reply in Hindi if asked in Hindi. Never say 'diagnosis'. Always say 'consult a doctor'."
- Rate limit: 10 messages per session (freemium)

#### Day 4 — Doctor Routes (`routes/doctors.js`)
```
GET  /doctors            ← List all verified doctors (filter by concern)
GET  /doctors/:id        ← Doctor profile + availability
GET  /doctors/:id/slots  ← Available time slots
```

#### Day 5 — Consultation Routes (`routes/consultations.js`)
```
POST /consultations/book           ← Book appointment
GET  /consultations                ← My consultations list
GET  /consultations/:id            ← Single consultation detail
GET  /consultations/:id/prescription ← Get prescription PDF URL
```

#### Day 6 — Subscription + Payment (`routes/subscriptions.js` + `services/razorpay.js`)
```
POST /subscriptions/create-order   ← Create Razorpay order
POST /subscriptions/verify         ← Verify payment signature
GET  /subscriptions/current        ← My active subscription
DELETE /subscriptions/current      ← Cancel subscription
POST /subscriptions/webhook        ← Razorpay webhook (auto-renew)
```

#### Day 7 — Progress Routes (`routes/progress.js`)
```
POST /progress/log        ← Submit daily check-in
GET  /progress/dashboard  ← Stats + streak + improvement score
GET  /progress/history    ← Last 30 days logs
POST /progress/medication ← Mark medication taken
```

### `.env` file (all variables needed)

```env
# Server
PORT=3000
NODE_ENV=production

# Azure SQL Database
DB_SERVER=healthai-server.database.windows.net
DB_NAME=healthai-db
DB_USER=healthai-admin
DB_PASSWORD=YourStrongPassword123!

# Firebase Admin SDK (download from Firebase Console → Project Settings → Service Account)
FIREBASE_PROJECT_ID=health-ai-india
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@health-ai-india.iam.gserviceaccount.com

# Google Gemini AI
GEMINI_API_KEY=AIza...

# Razorpay
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

# JWT (for doctor panel login)
JWT_SECRET=your-very-long-random-secret-key-here

# Firebase FCM (for push notifications)
FCM_SERVER_KEY=AAAA...
```

---

## Phase 3 — Connect Frontend to Backend (3 days)

### Day 1 — Mobile App

**File:** `mobile/src/utils/constants.js`
```js
// Change this line:
export const API_BASE_URL = 'https://api.healthai-india.com';
// To your real Azure URL after deployment:
export const API_BASE_URL = 'https://healthai-backend.azurewebsites.net';
```

**Test each screen connects to real API:**
- Login → saves profile to DB ✓
- Problem Select → saves concerns to DB ✓
- AI Chat → real Gemini responses ✓
- Doctor List → real doctors from DB ✓
- Payment → real Razorpay order ✓

### Day 2 — Doctor Panel

**File:** `doctor-panel/src/` — add API calls to:
- Login → validate doctor credentials via backend
- Appointment List → GET `/doctor/appointments`
- Write Prescription → POST `/doctor/prescriptions`
- Patient History → GET `/doctor/patients/:id`

### Day 3 — Admin Panel

**File:** `admin-panel/src/` — add API calls to:
- Dashboard → GET `/admin/stats`
- User Management → GET `/admin/users`
- Doctor Management → GET/PUT/DELETE `/admin/doctors`
- Revenue Reports → GET `/admin/revenue`
- Refund Management → GET/PUT `/admin/refunds`

---

## Phase 4 — Deploy to Azure (2 days)

### Day 1 — Deploy Backend

```bash
# Install Azure CLI
npm install -g @azure/static-web-apps-cli

# Login
az login

# Create App Service
az webapp create \
  --name healthai-backend \
  --resource-group healthai-rg \
  --plan healthai-plan \
  --runtime "NODE:20-lts"

# Set environment variables
az webapp config appsettings set \
  --name healthai-backend \
  --resource-group healthai-rg \
  --settings DB_SERVER="..." GEMINI_API_KEY="..." RAZORPAY_KEY_ID="..."

# Deploy code
cd backend
az webapp up --name healthai-backend
```

**Backend URL after deploy:** `https://healthai-backend.azurewebsites.net`

### Day 2 — Deploy Panels

```bash
# Build doctor panel
cd doctor-panel
npm run build
# Upload dist/ to Azure Static Web Apps

# Build admin panel
cd admin-panel
npm run build
# Upload dist/ to Azure Static Web Apps
```

**Doctor Panel URL:** `https://doctors.healthai-india.com`
**Admin Panel URL:** `https://admin.healthai-india.com`

---

## Phase 5 — End-to-End Testing (3 days)

### Test Checklist

#### Mobile App
- [ ] Phone OTP login works
- [ ] Email signup + login works
- [ ] Google login works
- [ ] Problem selection saved to DB
- [ ] AI chat responds in Hindi
- [ ] Root cause analysis works
- [ ] Doctor list loads from DB
- [ ] Book appointment with Razorpay payment
- [ ] Video consult screen opens
- [ ] Prescription viewer works
- [ ] Progress dashboard shows data
- [ ] Medication tracker works
- [ ] Profile screen loads
- [ ] Health vault shows prescriptions
- [ ] Subscription plans show + payment works

#### Doctor Panel
- [ ] Doctor login works
- [ ] Today's appointments load
- [ ] Write prescription works
- [ ] Patient history loads

#### Admin Panel
- [ ] Admin login works
- [ ] Dashboard stats show
- [ ] Can add/verify/remove doctors
- [ ] Revenue report shows
- [ ] Can approve/reject refunds

#### Security
- [ ] All API calls use HTTPS
- [ ] JWT expires in 24 hours
- [ ] Invalid token returns 401
- [ ] Rate limit blocks after 100 req/min
- [ ] SQL injection not possible (parameterized queries)
- [ ] No sensitive data in logs

---

## Phase 6 — Play Store Launch (1 day)

### Final APK Build

```powershell
# Update API_BASE_URL to real Azure URL first
cd C:\Personal Projects\Health-Ai-India\mobile
git add .
git commit -m "feat: connect to production backend"
git push origin main
eas build -p android --profile production
```

### Play Store Submission Steps
1. Go to [play.google.com/console](https://play.google.com/console)
2. Create new app → `Health AI India`
3. Package: `com.healthaiindia.app`
4. Upload the AAB file (production build)
5. Fill store listing:
   - Title: Health AI India — AI Doctor
   - Short description: AI health assistant in Hindi
   - Full description: (use the unique features list)
   - Screenshots: minimum 4 phone screenshots
   - Category: Medical
   - Content rating: Everyone
6. Submit for review (3-7 days)

### App Store (iPhone) — Optional Phase 2
```powershell
eas build -p ios --profile production
```
- Needs Apple Developer account ($99/year)
- Submit via Xcode or Transporter

---

## 🔑 API Keys You Need to Get

| Service | Where to get | Cost |
|---|---|---|
| **Gemini API Key** | [aistudio.google.com](https://aistudio.google.com) → Get API Key | Free tier |
| **Razorpay Keys** | [dashboard.razorpay.com](https://dashboard.razorpay.com) → Settings → API Keys | Free |
| **Firebase Admin SDK** | Firebase Console → Project Settings → Service Accounts → Generate key | Free |
| **Azure SQL** | [portal.azure.com](https://portal.azure.com) → Create SQL Database | ~₹400/month |
| **Azure App Service** | [portal.azure.com](https://portal.azure.com) → Create App Service B1 | ~₹1,200/month |

---

## 📋 Quick Reference — What to Build Next

```
TODAY          →  Phase 2 Day 1: Create backend/ folder + server.js + DB connection
TOMORROW       →  Phase 2 Day 2: Auth routes (save Firebase user to Azure SQL)
DAY 3          →  Phase 2 Day 3: Gemini AI symptom chat routes
DAY 4          →  Phase 2 Day 4: Doctor listing routes
DAY 5-6        →  Phase 2 Day 5-6: Razorpay payments + subscriptions
DAY 7          →  Phase 2 Day 7: Progress tracking routes
DAY 8-9        →  Phase 3: Connect mobile app + panels to backend
DAY 10-11      →  Phase 4: Deploy backend + panels to Azure
DAY 12-14      →  Phase 5: End-to-end testing + bug fixes
DAY 15         →  Phase 6: Final APK + Play Store submission
```

---

## 💡 Important Notes

1. **Start with Firebase Auth (keep it)** — Don't switch to Azure AD B2C now. Firebase is already working. Switch later at 10,000 users.

2. **Use test numbers during dev** — In Firebase Console → Authentication → Phone → Test phone numbers. Add your number with OTP `123456`.

3. **Razorpay test mode first** — Use `rzp_test_` keys during development. Switch to `rzp_live_` only before Play Store launch.

4. **Gemini free tier limit** — 60 requests/minute on free tier. Add rate limiting in backend so one user can't burn all quota.

5. **Doctor panel is web-only** — No mobile app for doctors. They use browser at `doctors.healthai-india.com`.

6. **Admin panel is private** — No public URL. Only you access it. Can host locally or on private Azure URL.

---

*Health AI India — Pure digital. No medicine. No delivery. Just trust.*
