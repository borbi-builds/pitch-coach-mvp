# Getting Started - Pitch Coach MVP

## Prerequisites

- **Node.js:** v18+ (check: `node -v`)
- **npm:** v9+ (check: `npm -v`)
- **Git:** v2+ (check: `git -v`)
- **Modern browser:** Chrome/Firefox/Safari with WebRTC support

## 5-Minute Setup

### 1. Clone Repository

```bash
git clone https://github.com/wyattborbi/pitch-coach-mvp.git
cd pitch-coach-mvp
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

⚠️ Note: `--legacy-peer-deps` is needed for React 19 compatibility with some packages.

### 3. Configure Environment (Optional for MVP)

Create `.env.local`:

```bash
# For MVP, these are all optional
# Leave blank to use mock data

# Supabase (for persistent storage in production)
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Analysis APIs (needed in Week 2+)
DEEPGRAM_API_KEY=
OPENAI_API_KEY=
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Test the Flow

1. **Upload:** Click to upload a PPTX file (use any test PowerPoint)
2. **Preview:** View slide thumbnails
3. **Record:** Click "Ready to record" → Allow camera/mic permissions → Click "Finish" after 10-20 seconds
4. **Analysis:** Watch progress indicators (this is simulated in MVP)
5. **Feedback:** See mock coaching feedback

## Project Structure

```
pitch-coach-mvp/
├── app/
│   ├── page.tsx                  # Dashboard (upload)
│   ├── layout.tsx                # Root layout
│   ├── setup/
│   │   └── preview/page.tsx      # Slide preview
│   ├── record/
│   │   └── page.tsx              # Recording booth
│   ├── analysis/
│   │   └── page.tsx              # Analysis progress
│   ├── feedback/
│   │   └── page.tsx              # Feedback cards
│   └── api/
│       ├── upload/route.ts       # PPTX upload
│       ├── slides/route.ts       # Slide thumbnails
│       ├── video/upload/route.ts # Video upload
│       └── analyze/route.ts      # Analysis job (stub)
├── components/
│   ├── Header.tsx
│   ├── FileUploadZone.tsx
│   ├── RecordingBooth.tsx        # Main recording UI
│   └── FeedbackSection.tsx       # Expandable feedback
├── public/
│   └── uploads/                  # Temporary file storage
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## Commands

### Development

```bash
# Start dev server
npm run dev

# Build production bundle
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Testing (Week 4)

```bash
# Run unit tests (coming Week 4)
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

## Troubleshooting

### Issue: Camera Permission Denied
**Solution:** 
- Check browser permissions (Settings → Privacy → Camera/Microphone)
- Try in incognito mode (clears permission cache)
- Use HTTPS in production (browsers block HTTP camera access)

### Issue: Build Fails with TypeScript Errors
**Solution:**
```bash
# Clean build cache
rm -rf .next
npm run build
```

### Issue: Port 3000 Already in Use
**Solution:**
```bash
# Use different port
npm run dev -- -p 3001
```

Or kill the process using port 3000:
```bash
lsof -i :3000
kill -9 <PID>
```

### Issue: File Upload Not Working
**Solution:**
- Check that `public/uploads/` directory exists (create it if needed)
- Ensure you have write permissions to `/public/`
- Check browser console for detailed error messages

### Issue: Video Doesn't Record
**Solution:**
- Ensure browser supports MediaRecorder API (Chrome, Firefox, Safari all support it)
- Check that you've granted camera/microphone permissions
- Try in a different browser
- Check console for WebRTC errors

## Development Workflow

### Making Changes

1. **Create a branch for your feature:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** (components, pages, API routes, etc.)

3. **Check for errors:**
   ```bash
   npm run build  # Verify TypeScript compilation
   npm run lint   # Check for linting issues
   ```

4. **Test in browser:**
   ```bash
   npm run dev
   # Open http://localhost:3000 and test your changes
   ```

5. **Commit and push:**
   ```bash
   git add .
   git commit -m "Descriptive commit message"
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request** on GitHub

### File Locations Quick Reference

**Need to add a new page?** → Create in `/app/*/page.tsx`

**Need a new API route?** → Create in `/app/api/*/route.ts`

**Need a reusable component?** → Add to `/components/*.tsx`

**Need types?** → Use inline interfaces or create `/types/index.ts`

**Need utilities?** → Create `/lib/utils.ts` or `/utils/*.ts`

## Testing the Full Flow

### Step-by-Step Demo

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Open browser:** http://localhost:3000

3. **Test Upload:**
   - Click the upload zone
   - Select any `.pptx` file from your computer (or create a dummy one)
   - You should see a preview of slide thumbnails

4. **Test Recording:**
   - Click "Ready to record"
   - Allow camera/microphone permissions
   - You'll see yourself in the recording booth
   - Speak for 10-20 seconds
   - Click "Finish Recording"
   - Watch the progress indicators

5. **Test Feedback:**
   - See the overall score and breakdowns
   - Click on each section to expand (Delivery, Argument, Slides)
   - Each section shows what went well + what needs work + action items
   - Try clicking "Re-record" to go back to recording

## Next Steps (Week 2+)

### For Analysis Pipeline Integration:

1. **Get API Keys:**
   - Deepgram API key (for transcription)
   - OpenAI API key (for Claude/GPT analysis)

2. **Set Environment Variables:**
   ```bash
   # Update .env.local with API keys
   DEEPGRAM_API_KEY=your_key
   OPENAI_API_KEY=your_key
   ```

3. **Implement Analysis Workers:**
   - Replace mock analysis jobs with real MediaPipe/Deepgram/Claude
   - See `/app/api/analyze/route.ts` for TODO comments

4. **Setup Database (Optional):**
   - Create Supabase project
   - Initialize schema
   - Update env vars

## Common Tasks

### Add a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Create the component/page
# (e.g., /components/NewComponent.tsx)

# 3. Update related files
# (parent component, layout, etc.)

# 4. Test locally
npm run dev

# 5. Verify no TypeScript errors
npm run build

# 6. Commit
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# 7. Create Pull Request on GitHub
```

### Debug an Issue

1. **Check browser console:** F12 → Console tab (any red errors?)
2. **Check server logs:** Look at terminal output from `npm run dev`
3. **Add console.log:** Debug by logging variables
4. **Use browser DevTools:** Inspect elements, check network requests
5. **Check `.env.local`:** Ensure API keys are configured

### Deploy to Staging

```bash
# Prerequisites: Vercel account linked to GitHub

# 1. Push to GitHub
git push origin feature/your-feature

# 2. Create PR on GitHub
# → Vercel auto-deploys preview

# 3. Test on preview URL
# → Share link for feedback

# 4. Merge to main when ready
# → Vercel deploys to production

# 5. Monitor deployment
# → Check Vercel dashboard for logs
```

## Performance Tips

### Development
- **Fast Refresh:** Changes hot-reload automatically (no manual refresh)
- **TypeScript Errors:** Fix as you code (red squiggles in IDE)

### Production Build
- **Code Splitting:** Pages are auto-split (smaller JS bundles)
- **Image Optimization:** Use `next/image` for automatic optimization
- **API Routes:** Serverless functions (auto-scale on Vercel)

## Getting Help

**Where to look for answers:**

1. **Code Comments:** Check TODO comments in code
2. **README.md:** Project overview and architecture
3. **ARCHITECTURE.md:** Technical deep-dive
4. **SPRINT_STATUS.md:** What's planned for each week
5. **GitHub Issues:** Bug reports and feature requests

**Still stuck?**

Open an issue on GitHub with:
- What you're trying to do
- What error you're seeing
- Steps to reproduce
- What you've already tried

## Quick Links

- **Repo:** https://github.com/wyattborbi/pitch-coach-mvp
- **Docs:** See README.md and ARCHITECTURE.md
- **Issues:** https://github.com/wyattborbi/pitch-coach-mvp/issues
- **Vercel:** https://pitch-coach-mvp.vercel.app (staging)

---

**Ready to contribute?** Start with `npm run dev` and pick a task from `SPRINT_STATUS.md` for Week 2! 🚀
