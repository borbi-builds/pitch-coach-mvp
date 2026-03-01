import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { runCompleteAnalysis } from '@/lib/analysis';
import { generateFeedback } from '@/lib/analysis/feedback-generator';

// Initialize Supabase only if env vars are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Week 2: Full analysis pipeline with 4 mock engines
// 1. MediaPipe (video analysis)
// 2. Deepgram (audio analysis)
// 3. Vision (slide analysis)
// 4. Claude (argument analysis)

export async function POST(request: NextRequest) {
  try {
    const { recordingId, videoUrl, audioUrl, slideUrls } = await request.json();

    if (!recordingId || !videoUrl || !audioUrl || !slideUrls) {
      return NextResponse.json(
        { error: 'Missing required fields: recordingId, videoUrl, audioUrl, slideUrls' },
        { status: 400 }
      );
    }

    const analysisId = `analysis-${recordingId}`;

    // Update recording status
    if (supabase) {
      await supabase
        .from('recordings')
        .update({ status: 'analyzing' })
        .eq('id', recordingId);
    }

    // Run all 4 analysis engines in parallel
    // Each engine is mocked and returns deterministic results for MVP
    console.log(`[ANALYSIS] Starting parallel analysis for ${analysisId}`);
    const analysisResults = await runCompleteAnalysis(
      videoUrl,
      audioUrl,
      slideUrls
    );

    console.log(`[ANALYSIS] Completed analysis engines:`, {
      mediapipe: 'eye contact, gestures, movement',
      deepgram: 'transcription, pacing, fillers',
      slides: 'readability, density, consistency',
      claude: 'argument structure, logic, persuasion',
    });

    // Generate structured feedback tied to research
    const feedback = generateFeedback(analysisResults);

    console.log(`[ANALYSIS] Generated feedback:`, {
      overallScore: feedback.overallScore,
      deliveryScore: feedback.deliveryScore,
      argumentScore: feedback.argumentScore,
      slidesScore: feedback.slidesScore,
    });

    // Save to database (if Supabase configured)
    if (supabase) {
      await supabase
        .from('recordings')
        .update({ 
          status: 'analyzed',
          feedback,
          analysis_results: analysisResults,
        })
        .eq('id', recordingId);
    }

    return NextResponse.json(
      {
        analysisId,
        status: 'complete',
        feedback,
        analysisResults,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Analysis handler error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
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
