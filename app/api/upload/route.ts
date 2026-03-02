import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase client (optional - for MVP can use mock storage)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const videoFile = formData.get('video') as File;
    const duration = formData.get('duration') as string;
    const slideCount = formData.get('slideCount') as string;

    // Accept either PPTX (file) or video (videoFile)
    const uploadFile = file || videoFile;

    if (!uploadFile) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Generate unique session ID
    const sessionId = uuidv4();
    const timestamp = new Date().toISOString();

    // Determine file type and content type
    const isPPTX = uploadFile.name.endsWith('.pptx');
    const contentType = isPPTX 
      ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      : 'video/webm';
    const folder = isPPTX ? 'presentations' : 'recordings';
    const extension = isPPTX ? 'pptx' : 'webm';

    // If Supabase is configured, upload; otherwise return mock response
    if (supabase) {
      const filename = `${sessionId}.${extension}`;
      const path = `${folder}/${timestamp.split('T')[0]}/${filename}`;

      // Upload to Supabase Storage
      const arrayBuffer = await uploadFile.arrayBuffer();
      const { data, error: uploadError } = await supabase.storage
        .from('pitch-coach-videos')
        .upload(path, Buffer.from(arrayBuffer), {
          contentType: contentType,
          cacheControl: '3600',
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload video' },
          { status: 500 }
        );
      }

      // Get signed URL for the uploaded file
      const { data: signedData, error: signError } = await supabase.storage
        .from('pitch-coach-videos')
        .createSignedUrl(data.path, 60 * 60 * 24 * 30); // 30 days expiry

      if (signError) {
        console.error('Signed URL error:', signError);
        return NextResponse.json(
          { error: 'Failed to generate video URL' },
          { status: 500 }
        );
      }

      // For PPTX, we don't store metadata the same way
      // Just return success
      return NextResponse.json(
        {
          sessionId: sessionId,
          fileName: uploadFile.name,
          fileUrl: signedData.signedUrl,
          status: 'uploaded',
          isPPTX: isPPTX,
        },
        { status: 201 }
      );
    } else {
      // Mock response for development without Supabase
      console.log(
        'Supabase not configured. Using mock storage for development.'
      );
      return NextResponse.json(
        {
          sessionId: sessionId,
          fileName: uploadFile.name,
          fileUrl: `blob:mock://${sessionId}`,
          status: 'uploaded',
          isPPTX: isPPTX,
          mode: 'development',
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Upload handler error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
