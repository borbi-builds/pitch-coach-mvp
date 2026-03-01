# Pitch Coach MVP - Quick Start Guide

**Last Updated:** March 1, 2026  
**Status:** Week 1 Complete - Ready for Development

---

## 🚀 Quick Start (5 minutes)

### 1. Install dependencies
```bash
cd pitch-coach-mvp
npm install
```

### 2. Create environment file
```bash
cp .env.example .env.local
```

### 3. Run development server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🏗️ Project Setup (First Time Only)

### Prerequisites
- Node.js 18+ (`node -v`)
- npm 9+ (`npm -v`)

### Optional: Supabase Setup (for real storage)

If you want to use real file storage instead of mock:

1. **Create Supabase project**
   - Go to https://supabase.com
   - Click "New Project"
   - Create project (or use existing)

2. **Get API keys**
   - Go to Project Settings → API
   - Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

3. **Create Storage Bucket**
   - Go to Storage
   - Click "New Bucket"
   - Name: `pitch-coach-videos`
   - Public: OFF
   - Click "Create Bucket"

4. **Create Database Tables**
   - Go to SQL Editor
   - Click "New Query"
   - Paste this SQL:

```sql
CREATE TABLE recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  duration INTEGER,
  slide_count INTEGER,
  video_url TEXT,
  storage_path TEXT,
  status TEXT DEFAULT 'uploaded',
  feedback JSONB DEFAULT NULL
);

CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recording_id UUID REFERENCES recordings(id),
  overall_score INTEGER,
  delivery JSONB,
  argument JSONB,
  slides JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_recordings_created_at ON recordings(created_at);
CREATE INDEX idx_feedback_recording_id ON feedback(recording_id);
```

5. **Update .env.local**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

### Optional: API Keys (for analysis features in Week 2+)

#### Deepgram (for audio transcription)
1. Go to https://console.deepgram.com
2. Create account
3. Go to API Keys
4. Copy key to `DEEPGRAM_API_KEY`

#### OpenAI / Anthropic (for argument analysis)
- **OpenAI:** https://platform.openai.com/api-keys → Copy to `OPENAI_API_KEY`
- **Anthropic:** https://console.anthropic.com/account/keys → Copy to `ANTHROPIC_API_KEY`

---

## 💻 Development Commands

```bash
# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint
```

---

## 🧪 Testing the App (Without Supabase)

The app works in **development mode** without Supabase configured:

1. **Upload PPTX**
   - Dashboard page lets you drag/drop any .pptx file
   - App extracts placeholder slides (12 default)
   - Click "Ready to record"

2. **Record Pitch**
   - Recording page opens with webcam + audio
   - Allows 30+ seconds of recording
   - Shows timer, slide navigation, pace feedback (mock)
   - Click "Finish Recording"

3. **Analysis**
   - Simulated progress bar (saves → delivery → argument → slides)
   - Takes ~3-4 seconds to simulate
   - Auto-advances to feedback page

4. **View Feedback**
   - Shows mock coaching feedback
   - 71/100 overall score example
   - Three sections: Delivery, Argument, Slides (expandable)
   - Shows sample "What Went Well" and "What Needs Work"
   - Buttons: Re-record, Watch, Share, Save

**Note:** Videos are NOT actually saved without Supabase configured. This is fine for UI testing.

---

## 📁 File Structure

```
pitch-coach-mvp/
├── app/
│   ├── page.tsx                    # Main router
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   └── api/
│       ├── upload/route.ts         # Video upload endpoint
│       └── analyze/route.ts        # Analysis pipeline endpoint
├── components/
│   ├── pages/
│   │   ├── DashboardPage.tsx       # PPTX upload
│   │   ├── SlidesPreviewPage.tsx   # Slide preview
│   │   ├── RecordingPage.tsx       # Recording flow
│   │   ├── AnalysisPage.tsx        # Analysis progress
│   │   └── FeedbackPage.tsx        # Coaching dashboard
│   └── RecordingBooth.tsx          # Main recording UI
├── lib/
│   └── store.ts                    # Zustand state management
├── hooks/
│   └── useRecording.ts             # Recording submission hook
├── public/                         # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── README.md                       # Full documentation
├── BUILD_PROGRESS.md               # Development progress
└── SETUP_INSTRUCTIONS.md           # This file
```

---

## 🎯 What's Working (Week 1)

✅ **Dashboard Page**
- PPTX upload with drag-drop
- File validation
- Error handling

✅ **Recording Page**
- Webcam capture via getUserMedia
- Audio recording
- Real-time timer
- Slide navigation
- Recording controls (Finish/Cancel)

✅ **Analysis Page**
- Simulated analysis pipeline
- Progress bars for each step
- Auto-advance to feedback

✅ **Feedback Page**
- Overall score (71/100 example)
- Three expandable sections
- Sample coaching feedback
- Re-record flow

✅ **State Management**
- Zustand store for all state
- Clean separation of concerns

✅ **API Routes**
- `/api/upload` - Video file upload (with mock fallback)
- `/api/analyze` - Analysis pipeline (mock feedback)

---

## 🚧 What's Next (Week 2+)

- [ ] Real analysis pipeline (MediaPipe, Deepgram, Claude)
- [ ] PPTX slide extraction (actual thumbnails)
- [ ] Database integration (store recordings + feedback)
- [ ] Video upload to Supabase (when configured)
- [ ] User authentication (optional for MVP)

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection errors
- Check that environment variables are set correctly
- Verify API keys have no typos
- Ensure bucket exists (`pitch-coach-videos`)
- App works without Supabase in development mode

### Camera/microphone not working
- Check browser permissions (Settings → Privacy → Camera/Microphone)
- Use HTTPS in production (getUserMedia requires secure context)
- Try a different browser

---

## 📚 Useful Links

- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com
- **Zustand:** https://zustand-demo.vercel.app
- **Supabase:** https://supabase.com/docs
- **MediaRecorder API:** https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder

---

## 🚀 Deployment (Week 4)

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git remote add origin https://github.com/your-username/pitch-coach-mvp.git
git branch -M main
git push -u origin main
```

2. **Connect to Vercel**
   - Go to vercel.com
   - Click "New Project"
   - Select repository
   - Add environment variables (from .env.local)
   - Click "Deploy"

3. **Production URL**
   - Your app will be live at `https://pitch-coach-mvp.vercel.app`

---

## 💬 Questions?

See detailed docs:
- **Features:** README.md
- **Build Status:** BUILD_PROGRESS.md
- **Development:** This file

---

**Happy building! 🎤**
