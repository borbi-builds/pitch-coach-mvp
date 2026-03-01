import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase only if env vars are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// This is a placeholder endpoint for the analysis pipeline
// In production, this would queue a job for:
// 1. MediaPipe analysis (video frames)
// 2. Deepgram transcription (audio)
// 3. Claude argument analysis
// 4. Slide OCR analysis

export async function POST(request: NextRequest) {
  try {
    const { recordingId, videoUrl, duration, slideCount } = await request.json();

    if (!recordingId || !videoUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Queue analysis job (stub for now)
    // In production, this would:
    // 1. Download video from Supabase
    // 2. Process with MediaPipe
    // 3. Call Deepgram API
    // 4. Call Claude API
    // 5. Save results to database

    const analysisId = `analysis-${recordingId}`;

    // Update recording status (optional, if Supabase is configured)
    if (supabase) {
      await supabase
        .from('recordings')
        .update({ status: 'analyzing' })
        .eq('id', recordingId);
    }

    // Simulate analysis steps with mock data
    // TODO: Replace with actual analysis pipeline
    const mockFeedback = {
      overall: 71,
      delivery: {
        score: 68,
        metrics: {
          eyeContact: 92,
          pace: 2.1,
          fillerWords: 10,
          gestures: 3,
          facialExpression: 60,
        },
        wellDone: [
          {
            title: 'Strong eye contact (92% of video)',
            desc: 'You looked at the camera most of the time. This builds trust.',
          },
          {
            title: 'Confident pace (2.1 words/second)',
            desc: 'Ideal range is 2.0-2.5 words/sec. You\'re right in the sweet spot!',
          },
          {
            title: 'Varied intonation',
            desc: 'Your voice doesn\'t sound flat or monotone.',
          },
        ],
        needsWork: [
          {
            title: 'Filler words: "um" (7x) + "like" (3x)',
            desc: 'Try to cut in half. Practice pausing instead.',
          },
          {
            title: 'Body movement: Minimal (3 gestures)',
            desc: 'Add 1-2 purposeful gestures per minute.',
          },
          {
            title: 'Facial expression: Neutral 40% of the time',
            desc: 'Could show more emotion when discussing passion.',
          },
        ],
      },
      argument: {
        score: 74,
        wellDone: [
          {
            title: 'Thesis stated clearly at 0:52',
            desc: 'Clear problem-solution statement.',
          },
          {
            title: 'Strong evidence (2 data points)',
            desc: 'Gartner report + customer case study.',
          },
        ],
        needsWork: [
          {
            title: 'Thesis not reinforced',
            desc: 'Repeat at 2:00-2:30 mark.',
          },
          {
            title: '"Why now" argument weak',
            desc: 'Add regulatory change or market data.',
          },
          {
            title: 'No counterargument addressed',
            desc: 'Address existing solutions.',
          },
        ],
      },
      slides: {
        score: 71,
        wellDone: [
          {
            title: 'Consistent color scheme',
            desc: 'Good brand continuity.',
          },
        ],
        needsWork: [
          {
            title: 'Slide 3: 8 bullet points',
            desc: 'Reduce to 4 max.',
          },
          {
            title: 'Chart labels too small',
            desc: 'Increase from 8pt to 14pt+.',
          },
        ],
      },
    };

    // Save feedback to database (stub)
    // In production: await supabase.from('feedback').insert([...])

    return NextResponse.json(
      {
        analysisId,
        status: 'processing',
        feedback: mockFeedback,
        estimatedTime: 120,
      },
      { status: 202 }
    );
  } catch (error) {
    console.error('Analysis handler error:', error);
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const recordingId = request.nextUrl.searchParams.get('recordingId');

    if (!recordingId) {
      return NextResponse.json(
        { error: 'Missing recordingId' },
        { status: 400 }
      );
    }

    // For MVP without Supabase, return mock feedback
    if (!supabase) {
      return NextResponse.json({
        recordingId,
        status: 'complete',
        feedback: {
          overall: 71,
          delivery: { score: 68 },
          argument: { score: 74 },
          slides: { score: 71 },
        },
      });
    }

    // Fetch feedback from database (if Supabase is configured)
    const { data, error } = await supabase
      .from('recordings')
      .select('*')
      .eq('id', recordingId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Recording not found' },
        { status: 404 }
      );
    }

    // Return mock feedback for now
    return NextResponse.json({
      recordingId,
      status: data.status,
      feedback: data.feedback || null,
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve feedback' },
      { status: 500 }
    );
  }
}
