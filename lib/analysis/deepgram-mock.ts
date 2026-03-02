/**
 * Deepgram Real API Analysis Engine
 * Analyzes audio for: transcription, pacing, filler words, confidence
 * Returns: transcript, words/min, filler word count, confidence variation
 */

import { createClient } from "@deepgram/sdk";

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

const FILLER_WORDS = ["um", "uh", "like", "so", "you know", "basically"];

export async function analyzeAudioWithDeepgram(
  audioUrl: string
): Promise<DeepgramAnalysisResult> {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPGRAM_API_KEY not configured");
  }

  const deepgram = createClient(apiKey);

  try {
    // Request transcription with word confidence
    const response = await deepgram.listen.prerecorded.transcribeUrl(
      { url: audioUrl },
      {
        model: "nova-2",
        smart_format: true,
        utterances: true, // Detects sentence boundaries
        punctuation: true,
        paragraphs: true,
        language: "en",
      }
    );

    if (!response?.result?.results?.channels?.[0]?.alternatives?.[0]) {
      throw new Error("Invalid Deepgram response structure");
    }

    const transcript = response.result.results.channels[0].alternatives[0].transcript || "";
    const words = response.result.results.channels[0].alternatives[0].words || [];

    // Calculate words per minute
    const firstWord = words[0];
    const lastWord = words[words.length - 1];
    const durationSeconds = (lastWord?.end || 0) - (firstWord?.start || 0);
    const durationMinutes = Math.max(durationSeconds / 60, 0.1);
    const wordCount = words.length;
    const wordsPerMinute = Math.round(wordCount / durationMinutes);

    // Extract filler words
    const fillerMap = new Map<
      string,
      { count: number; timestamps: number[] }
    >();
    words.forEach((word) => {
      const lowercaseWord = word.punctuated_word
        ?.toLowerCase()
        .replace(/[.,!?;:]/g, "");
      if (lowercaseWord && FILLER_WORDS.includes(lowercaseWord)) {
        const existing = fillerMap.get(lowercaseWord) || {
          count: 0,
          timestamps: [],
        };
        existing.count++;
        existing.timestamps.push(word.start || 0);
        fillerMap.set(lowercaseWord, existing);
      }
    });

    const fillerWords = Array.from(fillerMap.entries()).map(([word, data]) => ({
      word,
      ...data,
    }));

    // Calculate confidence variation
    const confidences = words
      .map((w) => w.confidence || 0)
      .filter((c) => c > 0);
    const avgConfidence =
      confidences.length > 0
        ? confidences.reduce((a, b) => a + b) / confidences.length
        : 0.85;
    const variance =
      confidences.length > 0
        ? Math.sqrt(
            confidences
              .map((c) => Math.pow(c - avgConfidence, 2))
              .reduce((a, b) => a + b) / confidences.length
          )
        : 0;
    const confidenceVariation = Math.min(variance, 0.5) / 0.5; // Normalize 0-1

    // Detect sentence count
    const sentenceCount = transcript.split(/[.!?]+/).filter((s) => s.trim())
      .length;

    // Calculate average word length
    const allWords = transcript
      .split(/\s+/)
      .map((w) => w.replace(/[.,!?;:]/g, ""));
    const averageWordLength =
      allWords.length > 0
        ? allWords.reduce((sum, w) => sum + w.length, 0) / allWords.length
        : 0;

    // Detect silence durations (gaps between words)
    const silenceDurations: number[] = [];
    for (let i = 0; i < words.length - 1; i++) {
      const gap = (words[i + 1]?.start || 0) - (words[i]?.end || 0);
      if (gap > 0.3) {
        silenceDurations.push(gap);
      }
    }

    return {
      transcript,
      wordsPerMinute,
      fillerWords,
      confidenceVariation,
      sentenceCount,
      averageWordLength,
      silenceDurations,
    };
  } catch (error) {
    console.error("Deepgram API error:", error);
    throw error;
  }
}
