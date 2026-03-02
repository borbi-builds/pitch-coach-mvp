/**
 * Analysis Orchestrator
 * Coordinates all 4 analysis engines in parallel
 */

import { analyzeVideoWithMediaPipe } from "./mediapipe-mock";
import { analyzeAudioWithDeepgram } from "./deepgram-mock";
import { analyzeSlides } from "./vision-mock";
import { analyzeArgumentStructure } from "./claude-mock";

export type { MediaPipeAnalysisResult } from "./mediapipe-mock";
export type { DeepgramAnalysisResult } from "./deepgram-mock";
export type { SlideAnalysisResult } from "./vision-mock";
export type { ClaudeAnalysisResult } from "./claude-mock";

export interface AnalysisResults {
  mediapipe: Awaited<ReturnType<typeof analyzeVideoWithMediaPipe>>;
  deepgram: Awaited<ReturnType<typeof analyzeAudioWithDeepgram>>;
  slides: Awaited<ReturnType<typeof analyzeSlides>>;
  claude: Awaited<ReturnType<typeof analyzeArgumentStructure>>;
  aggregatedScores: {
    overallScore: number; // 0-100
    deliveryScore: number; // 0-100
    argumentScore: number; // 0-100
    slidesScore: number; // 0-100
  };
}

export async function runCompleteAnalysis(
  videoUrl: string,
  audioUrl: string,
  slideUrls: string[]
): Promise<AnalysisResults> {
  // Run video and audio analysis in parallel, then run Claude with transcript
  const [mediapipe, deepgram, slides] = await Promise.all([
    analyzeVideoWithMediaPipe(videoUrl),
    analyzeAudioWithDeepgram(audioUrl),
    analyzeSlides(slideUrls),
  ]);

  // Now run Claude with the transcript from Deepgram
  const claude = await analyzeArgumentStructure(deepgram.transcript);

  // Score delivery (70% MediaPipe eye contact/gestures, 30% Deepgram pacing)
  const deliveryScore = Math.round(
    mediapipe.eyeContactPercentage * 0.35 +
      mediapipe.bodyMovementScore * 0.35 +
      mediapipe.facialExpressionScore * 0.15 +
      Math.min(100, (deepgram.wordsPerMinute / 2.5) * 100) * 0.15
  );

  // Score argument (Claude's overall)
  const argumentScore = claude.overallArgumentScore;

  // Score slides
  const slidesScore = Math.round(
    slides.averageReadabilityScore * 0.4 +
      Math.min(100, (slides.averageBulletsPerSlide / 4) * 100) * 0.35 +
      slides.designConsistencyScore * 0.25
  );

  // Overall score (equal weight)
  const overallScore = Math.round(
    (deliveryScore + argumentScore + slidesScore) / 3
  );

  return {
    mediapipe,
    deepgram,
    slides,
    claude,
    aggregatedScores: {
      overallScore,
      deliveryScore,
      argumentScore,
      slidesScore,
    },
  };
}
