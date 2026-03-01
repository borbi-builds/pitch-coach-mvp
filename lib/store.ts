import { create } from 'zustand';
import type { AnalysisResults } from './analysis';

export interface Recording {
  id: string;
  createdAt: Date;
  duration: number;
  slides: string[];
  videoUrl: string;
  audioUrl: string;
  transcript?: string;
  analysisResults?: AnalysisResults;
  feedback?: FeedbackData;
}

export interface FeedbackData {
  overallScore: number;
  deliveryScore: number;
  argumentScore: number;
  slidesScore: number;
  delivery: {
    wellDone: FeedbackItem[];
    needsWork: FeedbackItem[];
    actionItems: string[];
  };
  argument: {
    wellDone: FeedbackItem[];
    needsWork: FeedbackItem[];
    actionItems: string[];
  };
  slides: {
    wellDone: FeedbackItem[];
    needsWork: FeedbackItem[];
    actionItems: string[];
  };
}

export interface FeedbackItem {
  title: string;
  desc: string;
}

interface PitchCoachStore {
  // PPTX upload state
  pptxFile: File | null;
  pptxSlides: string[] | null; // Array of slide thumbnails (base64 or URLs)
  isUploadingPPTX: boolean;
  uploadError: string | null;
  setPPTXFile: (file: File | null) => void;
  setPPTXSlides: (slides: string[] | null) => void;
  setUploadingPPTX: (uploading: boolean) => void;
  setUploadError: (error: string | null) => void;

  // Recording state
  isRecording: boolean;
  recordingStartTime: number | null;
  recordingDuration: number; // in seconds
  mediaRecorder: MediaRecorder | null;
  videoChunks: Blob[];
  setRecording: (recording: boolean) => void;
  setMediaRecorder: (recorder: MediaRecorder | null) => void;
  setRecordingStartTime: (time: number | null) => void;
  setRecordingDuration: (duration: number) => void;
  addVideoChunk: (chunk: Blob) => void;
  clearVideoChunks: () => void;

  // Analysis state
  isAnalyzing: boolean;
  analysisProgress: number; // 0-100
  analysisResults: AnalysisResults | null;
  setAnalyzing: (analyzing: boolean) => void;
  setAnalysisProgress: (progress: number) => void;
  setAnalysisResults: (results: AnalysisResults | null) => void;

  // Recording history
  recordings: Recording[];
  currentRecording: Recording | null;
  addRecording: (recording: Recording) => void;
  setCurrentRecording: (recording: Recording | null) => void;

  // UI state
  currentStep: 'dashboard' | 'slides-preview' | 'record' | 'analysis' | 'feedback';
  setCurrentStep: (step: PitchCoachStore['currentStep']) => void;
}

export const usePitchCoachStore = create<PitchCoachStore>((set) => ({
  // PPTX upload
  pptxFile: null,
  pptxSlides: null,
  isUploadingPPTX: false,
  uploadError: null,
  setPPTXFile: (file) => set({ pptxFile: file }),
  setPPTXSlides: (slides) => set({ pptxSlides: slides }),
  setUploadingPPTX: (uploading) => set({ isUploadingPPTX: uploading }),
  setUploadError: (error) => set({ uploadError: error }),

  // Recording
  isRecording: false,
  recordingStartTime: null,
  recordingDuration: 0,
  mediaRecorder: null,
  videoChunks: [],
  setRecording: (recording) => set({ isRecording: recording }),
  setMediaRecorder: (recorder) => set({ mediaRecorder: recorder }),
  setRecordingStartTime: (time) => set({ recordingStartTime: time }),
  setRecordingDuration: (duration) => set({ recordingDuration: duration }),
  addVideoChunk: (chunk) => set((state) => ({ videoChunks: [...state.videoChunks, chunk] })),
  clearVideoChunks: () => set({ videoChunks: [] }),

  // Analysis
  isAnalyzing: false,
  analysisProgress: 0,
  analysisResults: null,
  setAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setAnalysisProgress: (progress) => set({ analysisProgress: progress }),
  setAnalysisResults: (results) => set({ analysisResults: results }),

  // Recording history
  recordings: [],
  currentRecording: null,
  addRecording: (recording) =>
    set((state) => ({ recordings: [recording, ...state.recordings] })),
  setCurrentRecording: (recording) => set({ currentRecording: recording }),

  // UI
  currentStep: 'dashboard',
  setCurrentStep: (step) => set({ currentStep: step }),
}));
