# Pitch Coach MVP

**AI-powered pitch coaching with real-time feedback and detailed analysis.**

A web app that helps entrepreneurs practice and improve their pitches through instant feedback on delivery, argument structure, and slide design. Based on 47 peer-reviewed studies in communication science and psychology.

## 🎯 What It Does

**4-Step Loop:**

1. **Setup** (2 min): Upload PowerPoint deck, confirm slides
2. **Record** (15-20 min): Present to your webcam with real-time pace feedback
3. **Analysis** (1-2 min): AI analyzes delivery, argument, and slides
4. **Feedback** (3-5 min): Get detailed coaching on what went well and what to improve

Users can re-record immediately with the same deck to iterate and improve their score.

## 🏗️ Architecture

**Frontend:**
- **Framework:** Next.js 16 + React 19
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand (minimal config, session-based)
- **Video Capture:** WebRTC (MediaRecorder API)

**Backend:**
- **API Routes:** Next.js API routes
- **Storage:** Supabase (optional for MVP) or local file storage
- **Database:** Supabase PostgreSQL (optional, can use mock data)

**Analysis Pipeline** (Week 2 implementation):
- **MediaPipe:** Pose/hand/face detection (eye contact, gestures, pace)
- **Deepgram API:** Speech-to-text + audio metrics (filler words, pace, tone)
- **pytesseract:** Slide OCR (text readability, density)
- **Claude API:** Argument analysis (thesis clarity, logic, persuasion)

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/wyattborbi/pitch-coach-mvp.git
cd pitch-coach-mvp
npm install --legacy-peer-deps
```

### 2. Environment Variables

Create `.env.local`:

```
# Optional: Supabase (for production)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Optional: Analysis APIs (Week 2+)
DEEPGRAM_API_KEY=your_deepgram_key
OPENAI_API_KEY=your_openai_key  # For Claude analysis
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## 📂 Project Structure

```
pitch-coach-mvp/
├── app/
│   ├── page.tsx                 # Dashboard / Upload PPTX
│   ├── setup/preview/page.tsx   # Slide preview
│   ├── record/page.tsx          # Recording booth
│   ├── analysis/page.tsx        # Analysis progress
│   ├── feedback/page.tsx        # Coaching feedback
│   ├── api/
│   │   ├── upload/route.ts      # PPTX upload endpoint
│   │   ├── slides/route.ts      # Slide extraction
│   │   ├── video/upload/route.ts # Video upload
│   │   └── analyze/route.ts     # Analysis job queue (stub)
│   └── layout.tsx
├── components/
│   ├── Header.tsx
│   ├── FileUploadZone.tsx
│   ├── RecordingBooth.tsx       # Main recording interface
│   └── FeedbackSection.tsx      # Expandable feedback cards
├── public/
│   └── uploads/                 # Temporary file storage
├── package.json
└── README.md
```

## 🎬 User Flows

### First-Time User (30 minutes total)

1. **Upload Deck** (1 min)
   - Drag-drop PPTX
   - System validates and extracts slides
   
2. **Preview Slides** (1 min)
   - View all slide thumbnails
   - Confirm presentation is ready
   
3. **Record Pitch** (15-20 min)
   - Full-screen booth: camera feed (left 70%), slides (right 30%)
   - Real-time metrics: elapsed time, pace, current slide
   - Controls: Next Slide, Pause, Finish
   
4. **Analysis** (1-2 min)
   - Progress indicators for 3 analyses:
     - Delivery (MediaPipe)
     - Argument (Deepgram + Claude)
     - Slides (OCR)
   
5. **View Feedback** (3-5 min)
   - Overall score (0-100)
   - 3 expandable sections (Delivery, Argument, Slides)
   - Each section shows:
     - What went well ✓
     - What needs work ⚠
     - Specific action items 1️⃣2️⃣3️⃣
   
6. **Next Steps**
   - **Re-record:** Same PPTX, fresh attempt
   - **Edit Slides:** Improve PPTX, then re-record
   - **Watch:** Review recording with timestamps
   - **Share:** Send feedback scorecard to others

## 📊 Feedback Categories

### 🎬 DELIVERY (Behavioral Analysis)
- Eye contact percentage
- Hand gesture count
- Speech pace (words/second)
- Filler words (um, like, uh)
- Intonation variation
- Facial expressions
- Body movement

**Science:** Nonverbal signals predict pitch outcomes with 87% accuracy (Pentland, MIT). Delivery accounts for 40-50% of funding success.

### 💡 ARGUMENT (Logical Analysis)
- Thesis clarity & reinforcement
- Problem → Solution → Evidence structure
- Logical flow (Toulmin model)
- Evidence quality & quantity
- Counterargument handling
- Emotional connection / narrative transportation

**Science:** Argument structure produces d = 0.5-0.8 attitude change (ELM theory). Clear arguments predict funding decisions.

### 🎨 SLIDES (Visual Analysis)
- Font readability (24pt+ min)
- Color contrast (4.5:1 ratio)
- Information density (4±1 items per slide)
- Visual balance (images vs. text)
- Alignment with speech timing
- Consistent branding

**Science:** Cognitive load reduction improves comprehension by d = 0.60-0.80 (Sweller). Multimedia learning effect: d = 1.67.

## 🔄 Feedback Mechanism

**Why it works (research-backed):**
- **Specificity:** "8 bullet points on slide 3 → reduce to 4" vs. "simplify"
- **Actionability:** Concrete steps users can take
- **Timeliness:** Immediate feedback after recording
- **Task-level:** Focus on skills, not personality
- **Effect size:** d = 0.79-0.90 (Hattie & Timperley, 2007) — among top 5 interventions in education

## 📈 Sprint Timeline (4 weeks)

### Week 1: Core Recording + UI ✅
- [x] Setup page (PPTX upload, validation)
- [x] Slide preview
- [x] Recording booth (camera + slides + timer + real-time pace)
- [x] Video capture & local storage
- [ ] Deploy stub to Vercel

### Week 2: Analysis Pipeline 🔄
- [ ] MediaPipe integration (pose/hand/face detection)
- [ ] Deepgram transcription API
- [ ] pytesseract slide OCR
- [ ] Claude argument analysis
- [ ] Placeholder feedback generation
- [ ] Mock data for testing

### Week 3: Feedback Report + Polish 📋
- [ ] Scoring system (0-100 overall + 3 sub-scores)
- [ ] Expandable feedback cards
- [ ] Timestamp references in feedback
- [ ] Video playback with annotations (optional)
- [ ] Re-record flow
- [ ] Dashboard (list of past recordings)

### Week 4: Testing + Deployment 🚀
- [ ] End-to-end testing (Jest + React Testing Library)
- [ ] Performance optimization
- [ ] Deploy to Vercel
- [ ] Collect Wyatt's feedback
- [ ] Iterate on scoring & feedback generation

## 🔌 API Endpoints (MVP)

### `POST /api/upload`
Upload PPTX file. Returns session ID for tracking.

```json
// Response
{
  "sessionId": "abc123",
  "fileName": "pitch-deck.pptx",
  "fileSize": 2048576
}
```

### `GET /api/slides?sessionId=abc123`
Fetch slide thumbnails for preview.

```json
// Response
{
  "sessionId": "abc123",
  "slides": [
    { "id": 1, "thumbnailUrl": "..." },
    { "id": 2, "thumbnailUrl": "..." }
  ]
}
```

### `POST /api/video/upload`
Upload recorded video. Triggers analysis job.

```json
// Request
{
  "video": <File>,
  "sessionId": "abc123",
  "duration": 272
}

// Response
{
  "videoId": "vid-xyz",
  "sessionId": "abc123",
  "duration": 272
}
```

### `POST /api/analyze`
Trigger analysis (stub — will queue to Python workers in Week 2).

```json
// Response
{
  "analysisId": "analysis-xyz",
  "status": "processing",
  "estimatedTime": 120
}
```

## 🛠️ Development

### Run Dev Server
```bash
npm run dev
# Open http://localhost:3000
```

### TypeScript
```bash
npm run build  # Type-check + compile
```

### Testing (Week 4)
```bash
npm test       # Jest + React Testing Library
```

## 📦 Dependencies

**Core:**
- `next@16.1.6` - Full-stack framework
- `react@19.2.3` - UI library
- `tailwindcss@4` - Styling
- `zustand@5.0.11` - State management

**Video/Media:**
- `MediaRecorder API` (built-in browser API)
- `getUserMedia` (built-in browser API)

**Future (Week 2+):**
- `@deepgram/sdk` - Speech transcription
- `mediapipe` - Pose/hand/face detection
- `pytesseract` (Python) - Slide OCR
- `openai` (via Claude) - Argument analysis
- `@supabase/supabase-js` - Database (optional for MVP)

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or with env vars:
vercel env add DEEPGRAM_API_KEY
vercel deploy
```

### Environment Variables (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
DEEPGRAM_API_KEY (Week 2)
OPENAI_API_KEY (Week 2)
```

## 🔐 Privacy & Storage

**MVP (Local):**
- Videos stored in `/public/uploads/` (temporary, for local testing)
- Deleted after analysis

**Production (Supabase):**
- Videos uploaded to Supabase Storage (signed URLs, 30-day expiry)
- Metadata in PostgreSQL
- User auth via Supabase

## 🎓 Scientific Foundation

This MVP is built on 47 peer-reviewed studies validating:
- **Delivery metrics:** Eye contact, pace, intonation, gestures (Pentland, Clarke, Chen)
- **Argument analysis:** Thesis clarity, logic flow, evidence quality (Petty & Cacioppo, O'Keefe)
- **Visual design:** Cognitive load, readability, multimedia learning (Sweller, Mayer, Cowan)
- **Feedback mechanism:** Specific, task-level feedback effect size d = 0.79-0.90 (Hattie & Timperley)
- **Learning:** Deliberate practice with feedback accounts for 26% of performance variance (Ericsson, Macnamara)

**See:** `pitch-coach-scientific-validation.md` for full bibliography.

## 🐛 Known Limitations (MVP)

1. **MediaPipe on browser:** Real-time eye contact detection accuracy depends on lighting. May need server-side processing.
2. **No mobile:** Web-only for now. Responsive design but not native apps.
3. **Mock data:** Feedback uses placeholder ML models. Real analysis comes Week 2.
4. **No slide editing:** Users must edit PPTX in PowerPoint/Google Slides, then re-upload.
5. **No transcription export:** Video playback only, no downloadable transcript.

## 🔮 Future (v2 and beyond)

- [ ] Mobile app (React Native)
- [ ] Multiple difficulty levels (Beginner/Intermediate/Expert)
- [ ] Audience personas (VC/Corporate/Tech)
- [ ] Team collaboration (shared decks, multi-presenter)
- [ ] Trend dashboard (score improvement over 5+ recordings)
- [ ] 3rd-party integrations (Slack, Salesforce, HubSpot)
- [ ] AI-generated tips (contextual coaching)
- [ ] Live pitch simulation (simulated Q&A)

## 📞 Support

**Questions?** 
- Check `ARCHITECTURE.md` for technical deep-dive
- See `pitch-coach-scientific-validation.md` for research citations
- Open an issue on GitHub

## 📄 License

MIT (for now, subject to change)

---

**Built for:** Wyatt Borbi  
**Status:** MVP (Week 1 complete, Weeks 2-4 in progress)  
**Next Milestone:** Vercel staging deployment (end of Week 1)
