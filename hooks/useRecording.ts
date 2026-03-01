'use client';

import { useCallback, useState } from 'react';
import { usePitchCoachStore } from '@/lib/store';

export function useRecording() {
  const {
    videoChunks,
    clearVideoChunks,
    recordingDuration,
    setCurrentStep,
  } = usePitchCoachStore();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const submitRecording = useCallback(async (slideCount: number) => {
    if (videoChunks.length === 0) {
      setUploadError('No video recorded');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Combine video chunks into a single blob
      const videoBlob = new Blob(videoChunks, { type: 'video/webm' });

      // Create FormData
      const formData = new FormData();
      formData.append('video', videoBlob, 'pitch-recording.webm');
      formData.append('duration', recordingDuration.toString());
      formData.append('slideCount', slideCount.toString());

      // Upload to server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadProgress(100);

      // Clear video chunks after successful upload
      clearVideoChunks();

      // Move to analysis step
      setTimeout(() => {
        setCurrentStep('analysis');
      }, 500);

      return data;
    } catch (error) {
      console.error('Recording submission error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [videoChunks, recordingDuration, clearVideoChunks, setCurrentStep]);

  return {
    isUploading,
    uploadProgress,
    uploadError,
    submitRecording,
  };
}
