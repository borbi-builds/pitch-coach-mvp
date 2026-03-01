# Pitch Coach MVP

AI-powered pitch coaching platform that analyzes delivery, argument structure, and slide design to provide actionable feedback.

## Overview

**Pitch Coach MVP** is a web application that helps users improve their pitch presentations through AI-powered analysis. Users record their pitch using their webcam and microphone, and the app provides detailed coaching feedback based on:

- **Delivery**: Eye contact, gestures, pace, filler words, vocal variation
- **Argument**: Thesis clarity, logical flow, evidence quality, persuasiveness
- **Slides**: Design, readability, visual alignment with speech

The app is built with **Next.js 16**, **React 19**, **Tailwind CSS**, and integrates with **MediaPipe**, **Deepgram**, and **Claude API** for analysis.

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Framer Motion** - Animations (optional)

### Backend
- **Next.js API Routes** - Backend services
- **Supabase** - File storage and authentication

### Analysis
- **MediaPipe** - Pose/hand/face detection for delivery analysis
- **Deepgram API** - Speech-to-text and audio metrics
- **Claude API** - Argument analysis and feedback generation
- **pytesseract** - Slide OCR (future: Node.js alternative)

## Project Structure

```
pitch-coach-mvp/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page (router)
│   ├── api/                 # API routes
│   │   ├── upload/          # Video upload endpoint
│   │   ├── analyze/         # Analysis pipeline
│   │   └── slides/          # Slide extraction
│   ├── dashboard/           # Dashboard pages
│   ├── record/              # Recording flow
│   └── feedback/            # Feedback display
├── components/
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── SlidesPreviewPage.tsx
│   │   ├── RecordingPage.tsx
│   │   ├── AnalysisPage.tsx
│   │   └── FeedbackPage.tsx
│   ├── RecordingBooth.tsx
│   ├── FileUploadZone.tsx
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── store.ts             # Zustand state management
│   └── utils.ts             # Helper functions
├── hooks/
│   └── useRecording.ts      # Recording hook
└── public/
    └── uploads/             # Temporary video storage
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for file storage)
- Deepgram API key
- OpenAI/Claude API key

### Installation

1. **Clone the repository**
```bash
cd pitch-coach-mvp
npm install
```

2. **Set up environment variables**

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Deepgram
DEEPGRAM_API_KEY=your_deepgram_api_key

# OpenAI/Claude
OPENAI_API_KEY=your_openai_api_key

# Or if using Claude directly:
ANTHROPIC_API_KEY=your_anthropic_api_key

# AWS S3 (optional, for production)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name
```

3. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development

```bash
# Run dev server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Features

### Week 1: Core Recording + UI ✅
- [x] Dashboard page (PPTX upload)
- [x] Slides preview page
- [x] Recording page with webcam + audio capture
- [x] Real-time timer and slide navigation
- [x] Video chunk collection

### Week 2: Analysis Pipeline 🚧
- [ ] MediaPipe integration (eye contact, gestures)
- [ ] Deepgram transcription (speech metrics)
- [ ] pytesseract slide analysis
- [ ] Analysis progress tracking

### Week 3: Feedback Report 📋
- [ ] Scoring system (0-100 for each dimension)
- [ ] Feedback card expansion UI
- [ ] Action items with timestamps
- [ ] Video playback with annotations
- [ ] Re-record flow

### Week 4: Testing & Deployment 🚀
- [ ] End-to-end testing
- [ ] Deploy to Vercel staging
- [ ] User feedback iteration
- [ ] Bug fixes and refinements

## User Flow

1. **Setup** (2 min)
   - User uploads PPTX file
   - System extracts and previews slides

2. **Record** (15-20 min)
   - User sees live camera feed + slide deck
   - Real-time pace feedback shown
   - Click "Next Slide" or auto-advance available

3. **Analysis** (10 sec - 2 min)
   - Video saved to Supabase
   - MediaPipe processes video frames
   - Deepgram transcribes audio
   - Claude analyzes argument structure
   - Progress UI shows sub-steps

4. **Feedback** (3-5 min)
   - User sees overall score (0-100)
   - Three sections: Delivery, Argument, Slides (expandable)
   - Each section has "What Went Well" + "What Needs Work"
   - Action items with specific suggestions
   - Options to re-record, watch video, share results

## API Endpoints

### `/api/upload`
Upload recorded video file.

**Request:**
```
POST /api/upload
Content-Type: multipart/form-data

- file: WebM video blob
- duration: number (seconds)
- slideCount: number
```

**Response:**
```json
{
  "id": "recording-uuid",
  "url": "s3://bucket/path/to/video.webm",
  "status": "uploaded"
}
```

### `/api/analyze`
Start analysis pipeline for a recording.

**Request:**
```
POST /api/analyze
Content-Type: application/json

{
  "recordingId": "uuid",
  "videoUrl": "s3://...",
  "audioUrl": "s3://..." 
}
```

**Response:**
```json
{
  "jobId": "analysis-uuid",
  "status": "queued",
  "estimatedTime": 120
}
```

### `/api/feedback`
Retrieve analysis results.

**Request:**
```
GET /api/feedback?recordingId=uuid
```

**Response:**
```json
{
  "recordingId": "uuid",
  "overall": 71,
  "delivery": {
    "score": 68,
    "metrics": {
      "eyeContact": 92,
      "pace": 2.1,
      "fillerWords": 10,
      "gestures": 3
    },
    "feedback": [...]
  },
  "argument": {...},
  "slides": {...}
}
```

## Scientific Foundation

This product is built on 47 peer-reviewed research citations covering:

- **Persuasion Psychology**: Elaboration Likelihood Model, argument structure effects
- **Neuroscience**: Intonation, pitch variation, prosody effects on perception
- **Body Language**: Eye contact, gestures, nonverbal signals (Pentland's 87% prediction)
- **Pacing & Cognitive Load**: Optimal speech rate (140-160 wpm), working memory constraints
- **Visual Design**: Cognitive Load Theory, information density, multimedia learning
- **Learning Science**: Deliberate practice, self-efficacy, feedback effectiveness
- **AI Coaching**: Research showing AI coaching rivals human coaching for narrow skills

See `pitch-coach-scientific-validation.md` for full citations.

## Performance Metrics

**MVP Success Criteria:**
- 70%+ completion rate (Setup → Feedback in one session)
- Median 25 minutes total time
- 80%+ users rate feedback as actionable
- 40%+ re-record within 7 days
- <5% error rate during recording/analysis

## Deployment

### Staging (Week 4)
```bash
npm run build
vercel deploy --prod
```

### Production (Future)
- Auto-deploy on main branch merge
- CDN for video delivery
- Scale analysis workers horizontally
- Database backups

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests (Playwright - Week 4)
```bash
npm run test:e2e
```

## Security & Privacy

- ✅ HTTPS only
- ✅ Video files encrypted in transit and at rest
- ✅ User data not shared with 3rd parties (except analysis APIs)
- ✅ Video files auto-deleted after 30 days
- ✅ No external cookies or tracking

## Future Enhancements (v2+)

- [ ] Mobile app (iOS/Android)
- [ ] Real-time AI feedback during recording
- [ ] Multiple difficulty levels (Standard, Mentor, Judge)
- [ ] Audience persona selection (VCs, Executives, Tech leads)
- [ ] Team features (shared decks, multiple presenters)
- [ ] Transcription export
- [ ] Comparison dashboard (track improvement over 5+ pitches)
- [ ] 3rd-party integrations (Slack, Salesforce)
- [ ] AI-powered slide editing suggestions

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test: `npm run test`
3. Submit a pull request

## License

MIT

## Contact & Support

- **Questions?** Email: support@pitchcoach.ai
- **Bugs?** Open an issue on GitHub
- **Feedback?** Fill out our feedback form

---

**Built with ❤️ for pitch coaches and entrepreneurs worldwide.**

*Deadline: 4 weeks to MVP on Vercel. Let's ship it.* 🚀
