# Pitch Coach MVP - Technical Architecture

## System Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    USER BROWSER                              │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Next.js Frontend (React 19 + Tailwind)              │   │
│  │ - Dashboard (Upload PPTX)                            │   │
│  │ - Recording Booth (Camera + Slides + Metrics)        │   │
│  │ - Analysis Progress                                  │   │
│  │ - Feedback Dashboard                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│           ↕ (Browser APIs)                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ WebRTC & MediaRecorder API                           │   │
│  │ - getUserMedia() → Camera + Microphone               │   │
│  │ - MediaRecorder → WebM video + audio                 │   │
│  │ - Local capture (no server streaming)                │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
        ↕ HTTP (JSON + FormData)
┌──────────────────────────────────────────────────────────────┐
│                  NEXT.JS API ROUTES                          │
│              (Node.js server + Vercel Edge)                  │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │ POST /api/upload │  │ GET /api/slides  │                 │
│  │ - Save PPTX      │  │ - Fetch thumbs   │                 │
│  │ - Generate ID    │  │ - Mock or real    │                 │
│  └──────────────────┘  └──────────────────┘                 │
│                                                              │
│  ┌────────────────────┐  ┌────────────────────┐             │
│  │ POST /api/video/   │  │ POST /api/analyze  │             │
│  │     upload         │  │ - Queue job        │             │
│  │ - Save video       │  │ - Trigger analysis │             │
│  │ - Trigger analysis │  └────────────────────┘             │
│  └────────────────────┘                                      │
└──────────────────────────────────────────────────────────────┘
        ↕ (Optional Supabase)
┌──────────────────────────────────────────────────────────────┐
│              SUPABASE (Cloud, Production Only)               │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │ Storage Bucket   │  │ PostgreSQL        │                 │
│  │ - Videos         │  │ - Users           │                 │
│  │ - PPTX files     │  │ - Recordings      │                 │
│  │ - Thumbnails     │  │ - Feedback        │                 │
│  └──────────────────┘  └──────────────────┘                 │
└──────────────────────────────────────────────────────────────┘
        ↕ HTTP (async job queue)
┌──────────────────────────────────────────────────────────────┐
│            ANALYSIS WORKERS (Python, Week 2+)               │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Job Queue (Bull / Celery)                            │  │
│  │ - Fetch video from storage                           │  │
│  │ - Run parallel analyses                              │  │
│  │ - Save results back to database                      │  │
│  └──────────────────────────────────────────────────────┘  │
│           ↓                                                   │
│  ┌──────────────────┐ ┌──────────────────┐ ┌─────────────┐  │
│  │ MediaPipe        │ │ Deepgram API     │ │ pytesseract  │  │
│  │ - Pose detection │ │ - Transcription  │ │ - Slide OCR   │  │
│  │ - Hand tracking  │ │ - Pace metrics   │ │ - Text read.   │  │
│  │ - Eye contact    │ │ - Filler words   │ └─────────────┘  │
│  │ - Facial expr.   │ │ - Intonation     │                   │
│  └──────────────────┘ └──────────────────┘      ↓            │
│           ↓                                      ↓            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Claude API (OpenAI) - Argument Analysis             │  │
│  │ - Parse transcript                                   │  │
│  │ - Extract thesis, evidence, structure               │  │
│  │ - Generate coaching feedback                        │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend (Browser)

**Framework & Styling:**
- **Next.js 16** - Full-stack React framework with API routes
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Lucide React** - Icon library

**State Management:**
- **Zustand** - Lightweight state (used for session data, minimal config)
- **sessionStorage** - Browser session storage for PPTX metadata

**Browser APIs (Built-in):**
- **MediaRecorder API** - Video capture with WebRTC
- **getUserMedia()** - Camera + microphone access
- **Canvas API** - Optional frame processing for MediaPipe

**UI Components:**
- Custom components in `components/` (no external UI library yet)
- Expandable sections, progress bars, video preview

### Backend (Node.js on Vercel)

**Runtime:**
- **Next.js API Routes** - Serverless functions on Vercel
- **Node.js 18+** - Server runtime

**Storage Options:**
- **Supabase Storage** - Cloud S3-compatible (production)
- **Local `/public/uploads/`** - Temporary (MVP/testing)

**Database (Optional):**
- **Supabase PostgreSQL** - Metadata, user sessions, feedback
- **Mock data** - MVP uses hardcoded responses (no database required)

### Analysis Pipeline (Python, Week 2+)

**Workers:**
- **MediaPipe** (Google) - Pose/hand/face detection
  - Input: Video frames (WebM → re-encode to stream)
  - Output: Eye contact %, gesture count, facial expressions
  
- **Deepgram API** - Speech-to-text + audio metrics
  - Input: Audio track from WebM
  - Output: Transcription, pace (wps), filler words, intonation
  
- **pytesseract** - OCR for slides
  - Input: Slide images (extracted from PPTX)
  - Output: Text content, font sizes, contrast analysis
  
- **Claude API** (OpenAI) - Argument analysis
  - Input: Transcript + metadata
  - Output: Thesis clarity, logic flow, persuasiveness score

**Job Queue:**
- **Bull** (Node.js + Redis) - Local queue
- **Celery** (Python) - If using Python workers

### Deployment

- **Hosting:** Vercel (Next.js native)
- **Database:** Supabase (hosted PostgreSQL)
- **Storage:** Supabase Storage or Vercel Blob
- **Serverless:** Vercel Functions for API routes
- **Edge:** Vercel Edge Functions (optional for analytics)

---

## Data Flow

### 1. UPLOAD PPTX (Step 1)

```
User uploads file
    ↓
FileUploadZone component
    ↓
POST /api/upload (FormData)
    ↓
Next.js API route:
  - Validate PPTX
  - Generate sessionId
  - Save to /public/uploads/sessionId/
  - Return sessionId
    ↓
sessionStorage.setItem('pitchSessionId', sessionId)
    ↓
Router.push('/setup/preview')
```

### 2. PREVIEW SLIDES (Step 1 continued)

```
User navigates to /setup/preview
    ↓
useEffect → GET /api/slides?sessionId=X
    ↓
Next.js API route:
  - Parse PPTX file (or use mock)
  - Generate slide thumbnails
  - Return array of slides with image URLs
    ↓
Display grid of slide thumbnails
    ↓
User clicks "Ready to record"
    ↓
Router.push('/record')
```

### 3. RECORD PITCH (Step 2)

```
User navigates to /record
    ↓
RecordingBooth component:
  1. Request camera + mic permissions (getUserMedia)
  2. Create MediaRecorder from stream
  3. Start recording (recorder.start())
    ↓
User speaks (real-time in browser):
  - Video feed displayed live
  - Slide thumbnails clickable (track current slide)
  - Timer running (elapsed seconds)
  - Pace calculated: (wordCount / minutesElapsed).toFixed(2)
    ↓
User clicks "Finish Recording"
    ↓
MediaRecorder.stop()
    ↓
Blob of video data collected
    ↓
POST /api/video/upload (FormData)
  - File: WebM blob
  - sessionId: from sessionStorage
  - duration: elapsed seconds
    ↓
Next.js API route:
  - Save video to /public/uploads/sessionId/videos/
  - Generate videoId
  - Trigger analysis job (mock)
  - Return videoId
    ↓
sessionStorage.setItem('videoId', videoId)
sessionStorage.setItem('duration', duration)
    ↓
Router.push('/analysis')
```

### 4. ANALYSIS (Step 3, Week 2+)

```
User navigates to /analysis
    ↓
Display progress indicators for 3 analyses
    ↓
Backend (parallel jobs):

Job 1: MediaPipe Delivery Analysis
  - Load video from storage
  - Extract frames at 30fps
  - Run MediaPipe pose detection
  - Calculate:
    * Eye contact % (face direction)
    * Gesture count (hand movement)
    * Facial expression (smile, engagement)
  - Save metrics to database
    ↓
Job 2: Deepgram Transcription
  - Extract audio from video
  - Send to Deepgram API
  - Get:
    * Full transcript
    * Timestamps
    * Confidence scores
    * Word-level timing
  - Calculate:
    * Pace: words / duration
    * Filler words: "um", "like", "uh" frequency
    * Intonation: pitch variation
  - Save to database
    ↓
Job 3: Slide Analysis
  - Extract slides from PPTX (pypptx)
  - Convert to images
  - Run pytesseract OCR
  - Calculate:
    * Text density per slide
    * Font sizes (readability)
    * Color contrast ratios
    * Visual balance
  - Save to database
    ↓
Claude API: Argument Analysis
  - Input: Transcript + slide text
  - Claude analyzes:
    * Thesis clarity
    * Problem → Solution logic
    * Evidence quality
    * Emotional connection
  - Returns: Structured feedback
    ↓
Combine all metrics → Overall score (0-100)
    ↓
Save feedback to database
    ↓
Frontend polling /api/analyze?recordingId=X → gets complete feedback
    ↓
Router.push('/feedback')
```

### 5. FEEDBACK (Step 4)

```
User navigates to /feedback
    ↓
Fetch mock/real feedback data
    ↓
Display:
  1. Overall score card (0-100)
  2. Score breakdown (Delivery, Argument, Slides)
  3. Three expandable sections:
     - 🎬 DELIVERY (eye contact, pace, filler words, gestures, expressions)
     - 💡 ARGUMENT (thesis, logic, evidence, emotional connection)
     - 🎨 SLIDES (readability, density, alignment, visuals)
    ↓
Each section shows:
  - What went well ✓ (specific examples with metrics)
  - What needs work ⚠ (with timestamps)
  - Action items 1️⃣2️⃣3️⃣ (concrete steps)
    ↓
User chooses next action:
  - Re-record (same PPTX)
  - Edit slides (download PPTX, edit, re-upload)
  - Watch video (playback with annotations - optional Week 3)
  - Share results (generate shareable link)
```

---

## Database Schema (Supabase)

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY (auth.uid()),
  email TEXT UNIQUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Recordings Table
```sql
CREATE TABLE recordings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  file_name TEXT,
  slide_count INT,
  duration INT,  -- seconds
  video_url TEXT,  -- signed URL
  storage_path TEXT,
  status TEXT,  -- 'uploaded', 'analyzing', 'complete', 'error'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Feedback Table
```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY,
  recording_id UUID REFERENCES recordings(id),
  overall_score INT,
  delivery_score INT,
  argument_score INT,
  slides_score INT,
  delivery_metrics JSONB,  -- eye_contact, pace, filler_words, etc.
  argument_analysis JSONB,  -- thesis, evidence, logic, emotion
  slides_analysis JSONB,   -- readability, density, visuals
  raw_transcript TEXT,
  created_at TIMESTAMP
);
```

---

## Error Handling

### Browser (Frontend)

1. **Camera/Mic Permission Denied**
   - Show error message with instructions
   - Provide fallback option (text input instead?)
   
2. **Upload Failed**
   - Display error message with retry button
   - Log to console for debugging
   
3. **Video Capture Failed**
   - Graceful degradation (show error, allow retry)
   
4. **Network Error**
   - Automatic retry with exponential backoff
   - Queue offline (if using service workers)

### Server (Backend)

1. **Missing File**
   - 400 Bad Request with clear error message
   
2. **Invalid PPTX**
   - 400 Bad Request, explain why (corrupted, etc.)
   
3. **Storage Failure**
   - 500 Internal Server Error with fallback
   - Log to error tracking service (Sentry)
   
4. **Analysis Job Failure**
   - Mark recording as 'error'
   - Retry mechanism with exponential backoff
   - Notify user via UI

---

## Performance Optimization

### Frontend

- **Code Splitting:** Next.js automatic route-based splitting
- **Image Optimization:** next/image for thumbnails
- **Lazy Loading:** React Suspense for feedback components
- **Video Compression:** MediaRecorder with bitrate limits
  - Target: ~5-10 Mbps for 15-min recording = 100-150 MB (acceptable)
  - Alternative: Compress locally before upload

### Backend

- **Serverless:** Vercel Functions auto-scale
- **Database Indexing:** Index on user_id, recording_id, created_at
- **Caching:** Signed URLs cached client-side (30 days)
- **Async Processing:** Analysis jobs run in background (don't block UI)

### Analysis Pipeline

- **Parallel Jobs:** Run MediaPipe, Deepgram, pytesseract simultaneously
- **GPU Acceleration:** MediaPipe/PyTorch on GPU (if available)
- **Frame Sampling:** Process every Nth frame (e.g., 10 fps instead of 30)
- **Caching:** Don't re-analyze duplicate frames

---

## Security

### Authentication
- **Vercel + Supabase Auth:** OAuth (Google, GitHub) or email/password
- **Session Tokens:** JWT stored in HTTP-only cookies
- **CORS:** Restrict API calls to same origin

### Data Privacy
- **Encryption in Transit:** HTTPS/TLS only
- **Encryption at Rest:** Supabase Storage with encryption
- **Access Control:** Users can only access their own recordings
- **Data Retention:** Videos deleted after 30 days (configurable)

### Input Validation
- **PPTX Validation:** Check file signature, file size limits (100 MB max)
- **Video Validation:** Check MIME type, duration limits
- **API Input:** Sanitize all user input (title, metadata, etc.)

---

## Testing Strategy (Week 4)

### Unit Tests (Jest)
- API route handlers
- Utility functions (calculatePace, formatTime)
- Component rendering

### Integration Tests (React Testing Library)
- File upload flow
- Recording lifecycle (start → pause → resume → stop)
- Feedback display and expansion

### E2E Tests (Cypress or Playwright)
- Complete user journey (upload → record → analyze → feedback)
- Re-record flow
- Error scenarios

### Performance Tests
- Load time for each page
- Video upload/download speed
- Analysis job duration

---

## Monitoring & Logging

### Client-Side
- Browser error tracking (Sentry)
- User interactions (Posthog or Mixpanel)
- Performance metrics (Core Web Vitals)

### Server-Side
- API error logging (Vercel logs)
- Database query monitoring
- Analysis job status tracking

### Alerting
- Slack notifications for critical errors
- Email alerts for high error rates

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Supabase project created & schema initialized
- [ ] Deepgram API key provisioned
- [ ] CORS policy set correctly
- [ ] Rate limiting configured (prevent abuse)
- [ ] Error tracking (Sentry) set up
- [ ] Staging deployment tested
- [ ] Production deployment with zero downtime
- [ ] Monitoring dashboards created

---

## Future Enhancements

1. **Real-Time Feedback:** Show metrics DURING recording (not just after)
2. **Comparison Mode:** Side-by-side comparison of two recordings
3. **Custom Scoring:** Allow users to weight Delivery vs. Argument vs. Slides
4. **Export Reports:** PDF/email with scorecard + video link
5. **API for Partners:** Allow other apps to integrate Pitch Coach analysis
6. **White-Label:** SaaS mode for corporate training programs
