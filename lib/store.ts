import { create } from 'zustand';

export interface Recording {
  id: string;
  createdAt: Date;
  duration: number;
  slides: string[];
  videoUrl: string;
  audioUrl: string;
  transcript?: string;
  feedback?: {
    overall: number;
    delivery: number;
    argument: number;
    slides: number;
    details?: {
      delivery: unknown;
      argument: unknown;
      slides: unknown;
    };
  };
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
  setAnalyzing: (analyzing: boolean) => void;
  setAnalysisProgress: (progress: number) => void;

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
  setAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setAnalysisProgress: (progress) => set({ analysisProgress: progress }),

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
