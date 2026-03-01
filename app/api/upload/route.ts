import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get('video') as File;
    const duration = formData.get('duration') as string;
    const slideCount = formData.get('slideCount') as string;

    if (!videoFile) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Generate unique recording ID
    const recordingId = uuidv4();
    const timestamp = new Date().toISOString();
    const filename = `${recordingId}.webm`;
    const path = `recordings/${timestamp.split('T')[0]}/${filename}`;

    // Upload to Supabase Storage
    const arrayBuffer = await videoFile.arrayBuffer();
    const { data, error: uploadError } = await supabase.storage
      .from('pitch-coach-videos')
      .upload(path, Buffer.from(arrayBuffer), {
        contentType: 'video/webm',
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

    // Store metadata in database
    const { error: dbError } = await supabase.from('recordings').insert([
      {
        id: recordingId,
        created_at: timestamp,
        duration: parseInt(duration),
        slide_count: parseInt(slideCount),
        video_url: signedData.signedUrl,
        storage_path: data.path,
        status: 'uploaded',
      },
    ]);

    if (dbError) {
      console.error('Database error:', dbError);
      // Still return success since video is uploaded
    }

    return NextResponse.json(
      {
        id: recordingId,
        url: signedData.signedUrl,
        status: 'uploaded',
        duration: parseInt(duration),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload handler error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
