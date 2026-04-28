# HealthSphere

## Description

HealthSphere is a full-stack AI healthcare application designed to bridge the gap between patients and doctors through intelligent automation. It features an AI symptom checker with severity scoring, personalized diet planning, smart appointment booking, and a dual-layer memory system that remembers every patient's health journey. This memory system ensures each AI interaction becomes more context-aware over time.

Built with Next.js, Express, MongoDB, and Google Gemini AI, HealthSphere demonstrates how modern AI can be applied to real-world healthcare workflows with production-grade architecture patterns like graceful degradation, fire-and-forget logging, and prompt enrichment.

## Why This Project Is Unique

| Aspect | What Makes It Different |
|---|---|
| AI Memory (Hindsight) | HealthSphere remembers past patient interactions through Hindsight, a semantic memory layer. The AI recalls previous symptoms, conditions, and treatments to provide contextually rich responses over time. |
| Personalized Healthcare | Diet plans and symptom assessments are enriched with each patient's medical history, ongoing medications, and past diagnoses. Every interaction gets smarter. |
| Real-World Usability | The platform mirrors actual clinical workflows: severity-prioritized appointments, doctor-patient messaging, medical record management with AI summaries, and medication reminder scheduling. |

## Features

### AI-Powered
* Symptom Checker: Describe symptoms in natural language to receive AI-assessed severity scores and specialist recommendations.
* Diet Planner: Personalized nutrition plans based on health profile, symptoms, and medical history.
* Medical Report Summarizer: Upload reports and get plain-language AI summaries.
* Doctor Matcher: Automatically matches patients to the right specialist based on symptom analysis.

### Patient Portal
* Dashboard: Profile overview, upcoming appointments, active medications, and health timeline.
* Appointment Booking: Smart scheduling with real-time slot availability, severity-based prioritization, and voice pre-filling.
* Medical Records: Upload, view, and manage health documents with AI-powered summaries.
* Timeline: Chronological history of all appointments, reports, and health interactions.
* Medicine Reminders: Automated medication schedule with cron-based notifications.
* Messages: Direct communication channel with assigned doctors.
* Health Report: Persistent history of patient AI sessions and evolving health profiles.
* QR Code: Shareable patient profile QR for quick doctor access.

### Doctor Portal
* Overview Dashboard: Today's appointments with AI symptom summaries, patient counts, and quick actions.
* Weekly Schedule: Visual calendar view of upcoming appointments.
* Patient Records: Access complete patient histories, prescriptions, and medical records.
* Prescription Management: Create and manage patient prescriptions with medication schedules.

### Memory & Intelligence
* Dual Memory System: Hindsight (semantic recall) combined with MongoDB UserInsights (structured pattern tracking).
* Prompt Enrichment: Past patient history is automatically injected into AI prompts for context-aware responses.
* Insight Engine: Tracks recurring symptoms, conditions, and health patterns per patient.
* Graceful Degradation: AI features continue to work even if the memory layer is unavailable.
* Fire-and-Forget Logging: Memory writes are non-blocking to keep response times fast.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB Atlas, Mongoose 9 |
| AI | Google Gemini API |
| Memory | Hindsight (per-user semantic memory service) |
| Voice | Web Speech API (SpeechRecognition and SpeechSynthesis) |
| Auth | JWT and bcrypt, HTTP-only cookies |
| UI | Lucide React (icons), Framer Motion (animations) |
| Scheduling | node-cron (medication reminders) |
| File Upload | Multer |
| Dev Tools | Nodemon, ts-node, ESLint, Concurrently |

## Getting Started

### Prerequisites

* Node.js 18.x or higher
* npm 9.x or higher
* MongoDB Atlas account or local MongoDB instance
* Google Gemini API key
* Hindsight API key

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/healthsphere.git
cd healthsphere
```

### 2. Install Dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure Environment Variables

Create a .env file in the backend directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
HINDSIGHT_API_KEY=your_hindsight_api_key_here
PORT=5000
NODE_ENV=development
```

### 4. Run the Application

From the root directory, start both frontend and backend:

```bash
npm run dev
```

Alternatively, run them separately:

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| API Health Check | http://localhost:5000/ |

## Future Improvements

* Real-time Chat: WebSocket-based live messaging between patients and doctors.
* Video Consultations: Integrated telehealth with WebRTC.
* Multi-language Support: AI responses and UI in multiple languages.
* Mobile App: React Native companion app.
* Lab Integration: Auto-import lab results from diagnostic centers.
* Insurance Module: Coverage checks and claims processing.
* Admin Dashboard: Platform-wide analytics and user management.
* FHIR Compliance: Standardized healthcare data interoperability.
* Advanced Analytics: Population health trends and predictive insights.