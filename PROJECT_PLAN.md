# 🏥 Private Health AI — India
### Built for India | Hindi-first | Private & Secure | Pure Digital Platform

---

## 🎯 Vision

A private, AI-first, Hindi-language health **consultation platform** for Indians dealing with stigmatized health issues — hair fall, sexual health, diabetes, skin problems, mental stress.

**What we provide:**
- AI symptom checker (Hindi + English)
- Licensed doctor video consultations
- Prescription PDF (user takes it to any medical store)
- Progress tracking + streaks
- WhatsApp AI follow-up (Phase 2)

**What we do NOT do:**
- ❌ Sell medicine
- ❌ Deliver anything
- ❌ Run a pharmacy
- ❌ Handle any physical operations

> **"We are the only health app in India that will tell you when you don't need us. Because your health matters more than our revenue."**

---

## 👥 Three Roles in the Platform

```mermaid
graph TD
    subgraph PLATFORM["Your Platform"]
        ADMIN["👑 YOU — Admin\nadmin.yourdomain.com\nManage doctors, revenue,\nrefunds, user reports"]
        DOCTOR["👨‍⚕️ DOCTOR — Web Panel\ndoctors.yourdomain.com\nSee appointments, video call,\nwrite prescription PDF"]
        USER["👤 USER — Mobile App\nPlay Store + App Store\nAI chat, book doctor,\ntrack progress"]
    end

    ADMIN -->|Onboards and verifies| DOCTOR
    ADMIN -->|Monitors| USER
    USER -->|Books consult| DOCTOR
    DOCTOR -->|Writes prescription PDF| USER
```

### Your Role as Owner (Admin)
| Task | What you do |
|------|------------|
| Onboard doctors | Verify MCI license, create login |
| Monitor revenue | Daily/monthly earnings dashboard |
| Handle refunds | Approve/reject in admin panel |
| Remove bad doctors | Anyone below 3.5 stars gets reviewed |
| Pay doctors | Monthly payout per consultation done |
| Push notifications | Send announcements to all users |

### Doctor Role
- Logs in at `doctors.yourdomain.com` — browser only, no app needed
- Sees today's appointments
- Joins video call with patient
- Writes prescription inside the panel
- Prescription auto-generates PDF saved to patient vault
- Gets paid monthly by you (₹100–150 per consultation)

### User Role
- Downloads app from Play Store / App Store
- Selects health problems (multiple allowed)
- Uses AI symptom checker for free
- Pays to book doctor consultation
- Downloads prescription PDF
- Goes to any medical store or 1mg to buy medicine themselves

---

## 💡 Authentication — Azure AD B2C

| | Firebase Auth | Azure AD B2C |
|--|-------------|-------------|
| **Cost** | Free 10k OTPs/month | ✅ FREE up to 50,000 users/month |
| **Phone OTP** | ✅ Free | ✅ Free |
| **Where data lives** | Google USA servers | ✅ Azure India servers |
| **India DPDP Law** | ❌ Data outside India | ✅ Data stays in India |
| **Azure integration** | Manual setup needed | ✅ Built-in, one portal |
| **Social login** | Google, Facebook | Google, Facebook, Apple |

> **Decision: Azure AD B2C** — Free for 50,000 users, India servers, one portal for everything.

---

## 📦 Two-Phase Build Plan

### Phase 1 — Build and Launch (₹1,600–1,800/month) — 0 to 500 users

```mermaid
graph TB
    subgraph CLIENT["📱 Client — React Native"]
        APP["Mobile App\nAndroid + iPhone"]
    end

    subgraph AZURE["☁️ Azure India — 3 Services Only"]
        API["Azure App Service B1\nNode.js + Express\n~₹1,200/month"]
        AUTH["Azure AD B2C\nPhone + Email OTP\nFREE up to 50,000 users"]
        DB["Azure SQL Serverless\nPay only when queries run\n~₹400–600/month"]
    end

    subgraph FREE["🆓 Free/Pay-per-use"]
        AI["Google Gemini API\nAI Chat Hindi\nFREE tier"]
        PAY["Razorpay\n2% per transaction\nNo monthly fee"]
        PUSH["Firebase FCM\nPush Notifications\nFREE"]
    end

    APP -->|HTTPS| API
    APP -->|OTP Login| AUTH
    AUTH --> API
    API --> DB
    API --> AI
    API --> PAY
    API --> PUSH
```

| Service | Cost |
|---------|------|
| Azure App Service B1 | ₹1,200/month |
| Azure SQL Serverless | ₹400–600/month |
| Azure AD B2C | ₹0 FREE |
| Gemini AI API | ₹0 FREE tier |
| Razorpay | 2% per transaction only |
| Firebase FCM | ₹0 FREE |
| **Total** | **₹1,600–1,800/month** |

---

### Phase 2 — Scale Up at 500+ users (~₹8,000–10,000/month)

```mermaid
graph TB
    subgraph PHASE2["☁️ Azure — Upgraded at 500+ Users"]
        API2["Azure App Service B2\n~₹2,400/month"]
        AUTH2["Azure AD B2C\nStill FREE"]
        DB2["Azure SQL Standard\n~₹1,500/month"]
        BLOB["Azure Blob Storage\nPrescription PDFs, Photos\n~₹500/month"]
        CDN["Azure CDN\nFast loading India\n~₹300/month"]
    end

    subgraph NEWSERVICES["⚙️ Added at 500 Users"]
        VIDEO["Agora.io\nVideo Consultations\n~₹2,000/month"]
        WA["WhatsApp API\nHindi follow-up bot\n~₹1,000/month"]
    end
```

**At 500 paying users x ₹350 avg = ₹1,75,000 revenue — ₹10,000 cost = 94% margin**

---

## 🏗️ Final Architecture (Full Vision)

```mermaid
graph TB
    subgraph USERS["Users"]
        APP["📱 Mobile App\nReact Native + Expo"]
        DOCWEB["🌐 Doctor Web Panel\nReact.js"]
        ADMINWEB["🖥️ Admin Web Panel\nReact.js"]
    end

    subgraph AZURE["☁️ Azure India"]
        API["Azure App Service\nNode.js + Express API"]
        AUTH["Azure AD B2C\nAuthentication FREE"]
        DB["Azure SQL Database\nAll data"]
        BLOB["Azure Blob Storage\nPrescription PDFs\nProfile photos — Phase 2"]
    end

    subgraph EXTERNAL["⚙️ External Services"]
        AI["Gemini API\nAI Symptom Checker\nHindi + English"]
        VIDEO["Agora.io\nVideo Calls\nPhase 2"]
        PAY["Razorpay\nUPI + Cards + EMI"]
        WA["WhatsApp API\nFollow-up Phase 2"]
        PUSH["Firebase FCM\nNotifications FREE"]
    end

    APP -->|HTTPS| API
    DOCWEB -->|HTTPS| API
    ADMINWEB -->|HTTPS| API
    APP -->|OTP| AUTH
    AUTH --> API
    API --> DB
    API --> BLOB
    API --> AI
    API --> VIDEO
    API --> PAY
    API --> WA
    API --> PUSH
```

---

## 👤 User Journey Flow

```mermaid
flowchart TD
    A["🏠 App Opens — No Login"] --> B["✅ SELECT PROBLEMS\n☑ Hair Fall  ☑ Skin\n☑ Sexual Health  ☑ Diabetes\n☑ Stress  ☑ Weight\nSelect 1 or many"]
    B --> C{How many?}
    C -->|1 Problem| D["🤖 AI Symptom Checker\n5 questions FREE\nNo signup yet"]
    C -->|Multiple| E["🤖 AI Root Cause Analysis\nConnects all problems\nFinds common causes FREE"]
    D --> F["AI Shows Analysis\nTreatment suggestions"]
    E --> G["AI Shows Combined Analysis\nEx: Hair + Stress same root\nOne plan for all issues"]
    F --> H{Want doctor help?}
    G --> H
    H -->|No| I["Free tips shown\nNo pressure — Trust built ✅"]
    H -->|Yes| J["Choose Plan\nFreemium ₹0\nRural Basic ₹149\nStandard ₹299\nCare ₹599\nMulti-Care ₹999"]
    J --> K["Sign Up — Phone OTP 30 seconds"]
    K --> L["Pay via Razorpay\nUPI / Card / EMI"]
    L --> M["Book Doctor\nVideo Consult Private"]
    M --> N["Doctor Consults\n15 min minimum"]
    N --> O["Prescription PDF\nSaved in your vault\nDownload anytime"]
    O --> P["User buys medicine themselves\nAny medical store or 1mg\nWE ARE NOT INVOLVED"]
    P --> Q["Progress Dashboard\nWeekly check-in\nStreak tracking"]
    Q --> R["WhatsApp Follow-up Phase 2\nAI checks in daily\nHindi messages"]
    R --> S{Improving?}
    S -->|Yes| T["🎉 Milestone\nShareable card\nWord of mouth"]
    S -->|No| U["Auto-escalate\nSenior doctor review"]
    U --> M
```

---

## 💰 Pricing — Final Model

| Plan | Price | Includes | Doctor Consult |
|------|-------|----------|---------------|
| **Freemium** | ₹0 | 3 AI questions/day | ₹199 extra |
| **Pay Per AI** | ₹49/session | Unlimited AI one session | ₹199 extra |
| **Rural Basic** | ₹149/month | AI unlimited | ₹199 extra |
| **Standard** | ₹299/month | AI + tracking + dashboard | ₹199 extra |
| **Care** | ₹599/month | AI + tracking + 1 free consult | ₹149 extra after |
| **Multi-Care** | ₹999/month | All concerns + 2 free consults | ₹149 extra after |
| **Annual Care** | ₹2,499/year | Standard features, best value | ₹149 extra |
| **Extra consult** | ₹199 each | Any plan, pay per visit | — |

### You Never Go in Loss
```
User does 10 consults in a month:
  Revenue: 10 x ₹199 = ₹1,990
  Doctor cost: 10 x ₹150 = ₹1,500
  Your profit: ₹490 always ✅
```

### Profit at Scale

| Paying Users | Avg Revenue/User | Monthly Revenue | Monthly Cost | Profit |
|-------------|-----------------|----------------|-------------|--------|
| 100 | ₹350 | ₹35,000 | ₹5,000 | **₹30,000** |
| 500 | ₹350 | ₹1,75,000 | ₹10,000 | **₹1,65,000** |
| 2,000 | ₹400 | ₹8,00,000 | ₹30,000 | **₹7,70,000** |
| 10,000 | ₹450 | ₹45,00,000 | ₹1,00,000 | **₹44,00,000** |

---

## ⚠️ Risk Mitigation

| Risk | Fix |
|------|-----|
| Too expensive for rural users | Freemium + ₹149 rural plan |
| Users don't trust AI | Never say "diagnosis" — say "health assistant" |
| User cancels after recovery | Maintenance plan ₹99, annual plan |
| Privacy breach | Public trust report, bug bounty ₹5,000 |
| Bad doctor quality | Min 15 min consult, mandatory rating, auto-suspend at 3.5 stars |
| Competitor copies | Moat = Hindi AI trust + user data + community |
| No doctors at launch | Pre-sign 10 doctors on ₹8,000/month retainer |
| Legal complaint | ToS on first use, Pvt Ltd company, doctor indemnity insurance |

---

## 🛠️ Technology Stack

### Phase 1 — Build With This

#### Mobile App
| Technology | Purpose | Cost |
|-----------|---------|------|
| **React Native + Expo** | Android + iPhone one codebase | Free |
| **JavaScript** | One language for app + backend | Free |
| **React Native Paper** | Ready-made UI components | Free |
| **React Navigation** | Move between screens | Free |
| **Zustand** | Store app data in memory while open | Free |
| **AsyncStorage** | Save data on phone permanently (offline) | Free |

#### Backend
| Technology | Purpose | Cost |
|-----------|---------|------|
| **Node.js + Express** | API server | Free |
| **JavaScript** | Same language as app | Free |
| **Azure App Service B1** | Hosting India region | ₹1,200/month |

#### Database and Auth
| Technology | Purpose | Cost |
|-----------|---------|------|
| **Azure SQL Serverless** | All data, pay per use | ₹400–600/month |
| **Azure AD B2C** | Phone OTP + email login | FREE |

#### Free Services
| Technology | Purpose | Cost |
|-----------|---------|------|
| **Google Gemini API** | AI symptom checker Hindi | Free tier |
| **Razorpay** | UPI + cards + EMI + subscriptions | 2% only |
| **Firebase FCM** | Push notifications | Free |

### Phase 2 — Add at 500 Users
| Technology | Purpose | Cost |
|-----------|---------|------|
| **Azure Blob Storage** | Prescription PDFs, photos | ~₹500/month |
| **Azure CDN** | Fast loading across India | ~₹300/month |
| **Agora.io** | Video consultations | ~₹2,000/month |
| **WhatsApp API** | Hindi follow-up messages | ~₹1,000/month |

---

## 📁 Project Folder Structure

```
health-ai-india/
│
├── 📱 mobile/                        # React Native App (User)
│   ├── src/
│   │   ├── screens/
│   │   │   ├── Auth/
│   │   │   │   ├── SplashScreen.js
│   │   │   │   ├── OnboardingScreen.js
│   │   │   │   ├── LoginScreen.js
│   │   │   │   ├── OTPVerifyScreen.js
│   │   │   │   └── ProfileSetupScreen.js
│   │   │   ├── Home/
│   │   │   │   ├── HomeScreen.js
│   │   │   │   └── ProblemSelectScreen.js
│   │   │   ├── AI/
│   │   │   │   ├── SymptomChatScreen.js
│   │   │   │   └── RootCauseScreen.js
│   │   │   ├── Subscription/
│   │   │   │   ├── PlansScreen.js
│   │   │   │   └── PaymentScreen.js
│   │   │   ├── Doctor/
│   │   │   │   ├── DoctorListScreen.js
│   │   │   │   ├── DoctorProfileScreen.js
│   │   │   │   ├── BookAppointmentScreen.js
│   │   │   │   ├── VideoConsultScreen.js
│   │   │   │   └── PrescriptionViewerScreen.js
│   │   │   ├── Progress/
│   │   │   │   ├── DashboardScreen.js
│   │   │   │   ├── MedicationTrackerScreen.js
│   │   │   │   ├── WeeklyCheckInScreen.js
│   │   │   │   └── MilestoneScreen.js
│   │   │   └── Profile/
│   │   │       ├── ProfileScreen.js
│   │   │       ├── HealthVaultScreen.js
│   │   │       ├── PrivacySettingsScreen.js
│   │   │       ├── DeleteAccountScreen.js
│   │   │       └── SubscriptionManageScreen.js
│   │   ├── components/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   └── app.json
│
├── 🌐 backend/                       # Node.js API Server
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── symptoms.js
│   │   │   ├── doctors.js
│   │   │   ├── consultations.js
│   │   │   ├── subscriptions.js
│   │   │   └── progress.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── rateLimit.js
│   │   ├── models/
│   │   ├── services/
│   │   │   ├── gemini.js
│   │   │   ├── razorpay.js
│   │   │   └── notifications.js
│   │   └── utils/
│   ├── .env.example
│   └── package.json
│
├── 🌐 doctor-panel/                  # Doctor Web Panel (React.js)
│   └── src/
│       ├── Login/
│       ├── AppointmentList/
│       ├── VideoConsult/
│       ├── WritePrescription/
│       └── PatientHistory/
│
├── 🖥️ admin-panel/                   # Admin Web Panel (React.js)
│   └── src/
│       ├── Dashboard/
│       ├── UserManagement/
│       ├── DoctorManagement/
│       ├── RevenueReports/
│       └── RefundManagement/
│
└── 📊 database/
    └── schema.sql
```

---

## 🗄️ Database Schema

```mermaid
erDiagram
    USERS {
        int id PK
        string phone
        string email
        string name
        string language
        date created_at
        bool is_active
    }
    USER_CONCERNS {
        int id PK
        int user_id FK
        string concern_type
        string status
        date started_at
        date resolved_at
    }
    HEALTH_PROFILES {
        int id PK
        int user_id FK
        int concern_id FK
        string symptoms
        int age
        string gender
        string ai_root_cause
        string combined_analysis
    }
    DOCTORS {
        int id PK
        string name
        string specialization
        string mci_license
        bool is_verified
        float rating
        int total_consultations
    }
    CONSULTATIONS {
        int id PK
        int user_id FK
        int doctor_id FK
        int concern_id FK
        datetime scheduled_at
        string status
        string prescription_url
        int duration_minutes
    }
    SUBSCRIPTIONS {
        int id PK
        int user_id FK
        string plan_type
        string covered_concerns
        datetime start_date
        datetime end_date
        string razorpay_id
        string status
    }
    PROGRESS_LOGS {
        int id PK
        int user_id FK
        int concern_id FK
        date log_date
        int improvement_score
        bool medication_taken
        string notes
    }

    USERS ||--o{ USER_CONCERNS : selects
    USER_CONCERNS ||--o{ HEALTH_PROFILES : has
    USER_CONCERNS ||--o{ CONSULTATIONS : generates
    USER_CONCERNS ||--o{ PROGRESS_LOGS : tracks
    USERS ||--o{ SUBSCRIPTIONS : purchases
    DOCTORS ||--o{ CONSULTATIONS : conducts
```

---

## 🚀 Build Roadmap

```mermaid
gantt
    title Health AI India — Full Build Roadmap
    dateFormat  YYYY-MM-DD
    section Week 1-2 Foundation
    Azure setup + DB schema             :2026-05-15, 5d
    Node.js backend skeleton            :2026-05-20, 4d
    Azure AD B2C auth + OTP             :2026-05-24, 3d
    section Week 3-4 Auth Screens
    Splash + Onboarding screens         :2026-05-27, 3d
    Login + OTP verify screens          :2026-05-30, 3d
    Profile setup screen                :2026-06-02, 2d
    section Week 5-6 Core AI
    Problem multi-select screen         :2026-06-04, 3d
    AI symptom chat screen Gemini       :2026-06-07, 5d
    Root cause analysis screen          :2026-06-12, 3d
    section Week 7-8 Payments
    Subscription plans screen           :2026-06-15, 3d
    Razorpay payment integration        :2026-06-18, 4d
    Hour pass + day pass logic          :2026-06-22, 2d
    section Week 9-10 Doctor Flow
    Doctor listing + profile screens    :2026-06-24, 3d
    Book appointment screen             :2026-06-27, 3d
    Prescription PDF viewer             :2026-06-30, 2d
    section Week 11-12 Progress
    Health dashboard + graphs           :2026-07-02, 4d
    Medication tracker + streaks        :2026-07-06, 3d
    Weekly check-in + milestones        :2026-07-09, 3d
    section Week 13-14 Profile
    Profile + health vault              :2026-07-12, 3d
    Privacy settings + delete account  :2026-07-15, 2d
    Subscription management            :2026-07-17, 2d
    section Week 15-16 Panels
    Doctor web panel                    :2026-07-19, 5d
    Admin web panel                     :2026-07-24, 5d
    section Week 17-18 Launch
    End to end testing                  :2026-07-29, 5d
    Security audit                      :2026-08-03, 3d
    Play Store + App Store submit       :2026-08-06, 3d
    Launch                              :2026-08-09, 1d
```

---

## 🔒 Security Checklist

- [ ] All API calls use HTTPS only
- [ ] JWT tokens expire in 24 hours
- [ ] Phone OTP verified before any data access
- [ ] All medical data encrypted at rest (Azure SQL TDE)
- [ ] Prescription PDFs encrypted in Azure Blob (Phase 2)
- [ ] Rate limiting on all endpoints
- [ ] No medical data in server logs
- [ ] User can delete all their data in one tap
- [ ] Terms of service accepted before first use
- [ ] AI responses always show "Not a medical diagnosis" disclaimer
- [ ] DPDP Act 2023 compliance
- [ ] Telemedicine Practice Guidelines 2020 compliance
- [ ] Company registered as Private Limited before launch

---

## 💡 Unique Features vs Competitors

| Feature | Man Matters | Bold Care | Practo | Your App |
|---------|------------|-----------|--------|----------|
| Hindi AI chatbot | ❌ | ❌ | ❌ | ✅ |
| Multi-problem selection | ❌ | ❌ | ❌ | ✅ |
| Root cause analysis | ❌ | ❌ | ❌ | ✅ |
| Hour Pass ₹29 | ❌ | ❌ | ❌ | ✅ |
| Freemium model | ❌ | ❌ | ❌ | ✅ |
| Rural plan ₹149 | ❌ | ❌ | ❌ | ✅ |
| Progress dashboard | ❌ | ❌ | ❌ | ✅ |
| Refund if no result | ❌ | ❌ | ❌ | ✅ |
| Data deletion in 1 tap | ❌ | ❌ | ❌ | ✅ |
| Pure platform no medicine | ❌ complex | ❌ complex | ❌ | ✅ simple |

---

## 📦 First Commands to Run

```bash
# Step 1 — Install Expo CLI
npm install -g expo-cli

# Step 2 — Create mobile app
npx create-expo-app health-ai-mobile --template blank

# Step 3 — Create backend
mkdir health-ai-backend
cd health-ai-backend
npm init -y
npm install express cors dotenv helmet express-rate-limit jsonwebtoken mssql @google/generative-ai razorpay

# Step 4 — Create doctor panel
npx create-react-app doctor-panel

# Step 5 — Create admin panel
npx create-react-app admin-panel
```

---

*Built with love for India — Apni baat, apna raaz*
*Pure digital platform. No medicine. No delivery. Just trust.*
