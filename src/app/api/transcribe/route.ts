// app/api/transcribe/route.ts (or pages/api/transcribe.ts if using Pages Router)
import { createClient } from '@deepgram/sdk';
import { NextRequest, NextResponse } from 'next/server';

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

export async function POST(request: NextRequest) {
    try {
        console.log('Transcription request received');

        const formData = await request.formData();
        const audioFile = formData.get('audio') as File;

        if (!audioFile) {
            console.error('No audio file provided');
            return NextResponse.json(
                { error: 'No audio file provided' },
                { status: 400 }
            );
        }

        console.log('Audio file received:', {
            name: audioFile.name,
            size: audioFile.size,
            type: audioFile.type
        });

        if (audioFile.size === 0) {
            console.error('Audio file is empty');
            return NextResponse.json(
                { error: 'Audio file is empty' },
                { status: 400 }
            );
        }

        // Convert File to Buffer
        const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
        console.log('Audio buffer size:', audioBuffer.length);

        // Transcribe with Deepgram
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
            audioBuffer,
            {
                model: 'nova-2',
                language: 'fr-FR', // Changed to French as per your original setup
                smart_format: true,
                punctuate: true,
                diarize: false, // Disable for better performance
                paragraphs: false,
                utterances: false,
                // Add these for better transcription
                redact: false,

                profanity_filter: false,
            }
        );

        if (error) {
            console.error('Deepgram error:', error);
            return NextResponse.json(
                { error: 'Transcription failed', details: error },
                { status: 500 }
            );
        }

        console.log('Deepgram result:', JSON.stringify(result, null, 2));

        // Check if we have results
        if (!result.results || !result.results.channels || result.results.channels.length === 0) {
            console.warn('No channels in result');
            return NextResponse.json({
                transcript: '',
                confidence: 0,
                words: [],
                message: 'No speech detected'
            });
        }

        const channel = result.results.channels[0];
        if (!channel.alternatives || channel.alternatives.length === 0) {
            console.warn('No alternatives in channel');
            return NextResponse.json({
                transcript: '',
                confidence: 0,
                words: [],
                message: 'No speech alternatives found'
            });
        }

        const alternative = channel.alternatives[0];
        const transcript = alternative.transcript || '';
        const confidence = alternative.confidence || 0;
        const words = alternative.words || [];

        console.log('Extracted transcript:', transcript);
        console.log('Confidence:', confidence);

        return NextResponse.json({
            transcript,
            confidence,
            words,
            ...(transcript === '' && { message: 'No speech detected in audio' })
        });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}