# 🏥 Health AI India

> A private, AI-first, Hindi-language health consultation platform for Indians.
> Built for real users — not a demo. Planned for Play Store & App Store launch.

---

## 📦 What's Inside

This is a **monorepo** with 3 separate apps:

| Folder | What it is | Who uses it |
|---|---|---|
| `mobile/` | React Native (Expo) app | Patients — Android & iOS |
| `admin-panel/` | React + Vite web app | You (the owner) |
| `doctor-panel/` | React + Vite web app | Licensed doctors |

---

## 🚀 How to Test Locally (Step by Step)

### Prerequisites — install these once

```
Node.js 18+          → https://nodejs.org
Expo CLI             → npm install -g expo-cli
Android Studio       → for Android emulator (optional)
Expo Go app          → install on your real Android/iPhone from Play Store
```

---

### 1. Test the Mobile App

```powershell
cd mobile
npm install
npm start
```

- A **QR code** will appear in the terminal
- Open **Expo Go** on your phone → Scan the QR code
- The app loads live on your phone

**To test on Android Emulator (if you have Android Studio):**
```powershell
npm run android
```

**What to check:**
- [ ] Splash screen loads
- [ ] Onboarding screens scroll correctly
- [ ] Login screen (phone OTP) shows up — OTP won't work yet without a backend
- [ ] Navigation between Home / AI / Doctors / Progress / Profile tabs works
- [ ] AI Chat screen opens
- [ ] Doctor list screen opens

> **Note:** Login, OTP, doctor booking, and payments need a backend API running. The UI screens will load but API calls will fail until you connect the backend.

---

### 2. Test the Admin Panel

```powershell
cd admin-panel
npm install
npm run dev
```

- Opens at → **http://localhost:5173**
- Login page will appear

**What to check:**
- [ ] Login page loads correctly
- [ ] After login → Dashboard shows
- [ ] Sidebar navigation: Dashboard / Users / Doctors / Revenue / Refunds
- [ ] All pages open without crashing

---

### 3. Test the Doctor Panel

```powershell
cd doctor-panel
npm install
npm run dev
```

- Opens at → **http://localhost:5173** (or 5174 if admin panel is already running)

**What to check:**
- [ ] Login page loads
- [ ] After login → Appointment list shows
- [ ] Video consult page opens
- [ ] Write prescription page opens
- [ ] Patient history page opens

---

## 🗂️ Project Structure

```
Health-Ai-India/
├── mobile/                     # React Native Expo app
│   ├── App.js                  # Entry point
│   ├── src/
│   │   ├── navigation/
│   │   │   └── AppNavigator.js # All screen routing
│   │   ├── screens/
│   │   │   ├── Auth/           # Splash, Onboarding, Login, OTP, Profile setup
│   │   │   ├── Home/           # Home, Problem select, Wellness feed, Emergency
│   │   │   ├── AI/             # Symptom chat, Root cause
│   │   │   ├── Doctor/         # Doctor list, Profile, Book, Video, Prescription
│   │   │   ├── Progress/       # Dashboard, Medication, Nutrition, Sleep, Milestones
│   │   │   ├── Profile/        # Profile, Health vault, Privacy, Subscription
│   │   │   └── Subscription/   # Plans, Payment
│   │   ├── store/
│   │   │   └── useAppStore.js  # Global state (Zustand)
│   │   └── utils/
│   │       ├── api.js          # All API calls (axios)
│   │       ├── constants.js    # Colors, fonts, app constants
│   │       └── firebase.js     # Firebase config
│
├── admin-panel/                # React + Vite — Admin dashboard
│   └── src/
│       ├── pages/
│       │   ├── Dashboard/
│       │   ├── UserManagement/
│       │   ├── DoctorManagement/
│       │   ├── RevenueReports/
│       │   └── RefundManagement/
│       └── store/
│           └── useAdminAuth.js
│
└── doctor-panel/               # React + Vite — Doctor dashboard
    └── src/
        ├── pages/
        │   ├── AppointmentList/
        │   ├── VideoConsult/
        │   ├── WritePrescription/
        │   └── PatientHistory/
        └── store/
            └── useAuth.js
```

---

## 🔌 Backend API

All three apps connect to a **Node.js + Express backend** (not in this repo).

The mobile app expects the backend at the URL defined in:
```
mobile/src/utils/api.js  →  baseURL: API_BASE_URL
```

**API endpoints used:**
| Endpoint | Purpose |
|---|---|
| `POST /auth/send-otp` | Send OTP to phone |
| `POST /auth/verify-otp` | Verify OTP, get JWT token |
| `POST /auth/profile` | Save user profile |
| `POST /symptoms/chat` | AI symptom chat |
| `POST /symptoms/root-cause` | AI root cause analysis |
| `GET /doctors` | List doctors by concern |
| `POST /consultations/book` | Book appointment |
| `POST /subscriptions/create-order` | Razorpay payment |

---

## 📱 Play Store Deployment (When Ready)

### Step 1 — Build APK / AAB
```powershell
cd mobile
npm install -g eas-cli
eas login
eas build --platform android
```

### Step 2 — Configure before building
- Set `API_BASE_URL` in `mobile/src/utils/api.js` to your **live backend URL**
- Add your **google-services.json** (already present in `mobile/`)
- Set package name: `com.healthaiindia.app` (already configured in `app.json`)

### Step 3 — Play Store
1. Go to **Google Play Console** → https://play.google.com/console
2. Create new app → Upload the `.aab` file from EAS build
3. Fill in store listing, screenshots, content rating
4. Submit for review (typically 3–7 days)

---

## 🔒 Security Checklist Before Going Live

- [ ] Backend API running with HTTPS (not HTTP)
- [ ] JWT tokens expire and refresh correctly
- [ ] OTP has rate limiting (max 5 attempts)
- [ ] All payments go through Razorpay (never handle card data yourself)
- [ ] User data stored in **Azure India** region (DPDP compliance)
- [ ] No API keys or secrets in the mobile app bundle
- [ ] Doctor MCI license verified before account activation
- [ ] Remove all `console.log` statements before production build

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Mobile App | React Native 0.76, Expo 52 |
| Admin & Doctor Web | React 19, Vite, React Router 7 |
| State Management | Zustand |
| HTTP Client | Axios |
| Navigation | React Navigation 6 |
| Backend (separate) | Node.js, Express |
| Database (separate) | Azure SQL Serverless |
| Auth (separate) | Firebase / Azure AD B2C |
| Payments (separate) | Razorpay |
| Video Calls (separate) | Agora / Zegocloud |

---

## ⚡ Quick Start Commands

```powershell
# Mobile app
cd mobile ; npm install ; npm start

# Admin panel
cd admin-panel ; npm install ; npm run dev

# Doctor panel
cd doctor-panel ; npm install ; npm run dev
```

---

## 📞 Support & Issues

This is a production app targeting real Indian users.
- Keep doctor data private and HIPAA/DPDP compliant
- Never expose patient data in logs
- Test OTP flow with real phone numbers before launch
