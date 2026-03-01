/**
 * Deepgram Mock Analysis Engine
 * Analyzes audio for: transcription, pacing, filler words, confidence
 * Returns: transcript, words/min, filler word count, confidence variation
 */

export interface DeepgramAnalysisResult {
  transcript: string;
  wordsPerMinute: number;
  fillerWords: {
    word: string;
    count: number;
    timestamps: number[]; // seconds
  }[];
  confidenceVariation: number; // 0-1
  sentenceCount: number;
  averageWordLength: number;
  silenceDurations: number[]; // seconds of silence
}

export async function analyzeAudioWithDeepgram(
  audioUrl: string
): Promise<DeepgramAnalysisResult> {
  // Mock implementation - in production this would:
  // 1. Call Deepgram API with audio URL
  // 2. Get high-confidence transcription
  // 3. Extract filler word locations
  // 4. Calculate confidence variation across transcript
  // 5. Measure speaking rate and pauses

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock transcript with realistic structure
  const transcript = `Good morning everyone. Um, thanks for being here today. 
  So, we're solving a problem that affects about 40% of companies. Like, 
  the current solutions are really expensive and inflexible. Our approach is different.
  We built a platform that's three times faster than alternatives. 
  Since launching six months ago, we've um, helped over 500 companies save millions.
  The market for this is growing like 40% year-over-year. 
  We're raising 5 million to scale our team and expand internationally.
  Thank you.`;

  const fillerWords = [
    { word: "um", count: 3, timestamps: [3, 47, 152] },
    { word: "like", count: 2, timestamps: [12, 89] },
  ];

  const wordCount = transcript.split(/\s+/).length;
  const durationSeconds = 272; // 4:32
  const durationMinutes = durationSeconds / 60;
  const wordsPerMinute = Math.round(wordCount / durationMinutes);

  return {
    transcript,
    wordsPerMinute, // ~142 wpm
    fillerWords, // 3 "um" + 2 "like" = 5 total
    confidenceVariation: 0.78, // Confidence varies from high to moderate
    sentenceCount: 11,
    averageWordLength: 4.8,
    silenceDurations: [0.5, 0.8, 1.2, 0.4, 0.6], // ~3.5 seconds of pauses
  };
}
