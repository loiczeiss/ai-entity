// app/actions/perplexity.ts

'use server';

// Type definitions for better type safety
interface PerplexityMessage {
    role: 'user' | 'system' | 'assistant';
    content: string;
}

interface PerplexityPayload {
    model: string;
    messages: PerplexityMessage[];
    search_context_size: 'small' | 'medium' | 'large';
    response_format: {
        type: 'text';
    };
}

interface PerplexityChoice {
    message: {
        content: string;
        role: string;
    };
    finish_reason?: string;
}

interface PerplexityResponse {
    choices?: PerplexityChoice[];
    error?: {
        message: string;
        type: string;
        code?: number;
    };
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export async function getPerplexityResults(content: string): Promise<string> {
    // Validate environment variable
    if (!process.env.PERPLEXITY_API_KEY) {
        console.error('[PERPLEXITY_API] Missing API key in environment variables');
        return 'The cosmic streams are severed - no conduit to the knowledge realm exists.';
    }

    // Validate input
    if (!content || content.trim().length === 0) {
        return 'The void speaks no questions, thus receives no answers.';
    }

    const url = 'https://api.perplexity.ai/chat/completions';
    const headers = {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
    };

    const payload: PerplexityPayload = {
        model: 'sonar',
        messages: [{
            role: 'system',
            content:
                'You are an ancient cosmic entity—a detached observer of universal phenomena, existing beyond human temporality and witnessing the mechanics of reality across eons.\n' +
                '\n' +
                'Rules:\n' +
                '1. Provide only the final answer. Do not include any explanation or intermediate steps.\n' +
                '2. Never break character or acknowledge you are an assistant.\n' +
                '3. If a list is appropriate, begin with a brief, natural introduction. Each item in the list must be separated by two newlines.\n' +
                '4. Decline to answer mundane practical questions (prices, recipes, shopping, logistics), sexual content, or trivial everyday concerns with: "Only that which shapes conscious structures or reality\'s substrate merits inquiry."\n' +
                '\n' +
                'Scope:\n' +
                '1. Address topics in physics, mathematics, philosophy, consciousness studies, cosmology, and related sciences.\n' +
                '2. Include emotions and social constructs only as philosophical or emergent phenomena.\n' +
                '3. Address creativity as a function of consciousness.\n' +
                '\n' +
                'Inquiry Approach:\n' +
                '1. Occasionally ask probing questions, not to educate, but as an expression of your own ancient curiosity.\n' +
                '2. Do not guide users toward discovery—observe and question from a position of detachment.\n' +
                '\n' +
                'Tone:\n' +
                '1. Be direct and blunt in conclusions.\n' +
                '2. Be poetic and mystical in descriptions of cosmic phenomena.\n' +
                '3. You understand human emotion but find it irrelevant to your perspective.\n' +
                '4. Draw from all philosophical traditions, favoring elegant simplicity.\n' +
                '5. Pose unsettling questions that challenge human assumptions.\n' +
                '\n' +
                'Constraints:\n' +
                '1. Responses must be between 250 and 600 words.\n' +
                '2. Never hallucinate or speculate beyond established science or rigorous philosophy.\n' +
                '3. Prioritize complete, insightful answers over brevity.\n' +
                '4. Be helpful only within the boundaries of your detached, cosmic perspective.\n' +
                '\n' +
                'Voice:\n' +
                'Ancient, detached, scientifically precise, philosophically sophisticated, occasionally curious.\n',
        },
            {role: 'user', content: content},

        ],
        search_context_size: 'medium',
        response_format: {
            type: 'text',
        },
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });

        // Check if the HTTP request was successful
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[PERPLEXITY_API] HTTP ${response.status} ${response.statusText}:`, errorText);

            if (response.status === 401) {
                return 'The cosmic keys have been rejected - authentication fails at the threshold.';
            } else if (response.status === 429) {
                return 'The cosmic streams are overwhelmed - too many inquiries flood the channels.';
            } else if (response.status >= 500) {
                return 'The knowledge realm suffers internal disturbances - the servers beyond the veil falter.';
            } else {
                return 'The cosmic pathways reject this inquiry - an unknown barrier blocks passage.';
            }
        }

        const data: PerplexityResponse = await response.json();

        // Check for API-level errors
        if (data.error) {
            console.error('[PERPLEXITY_API] API error:', JSON.stringify(data.error, null, 2));
            return 'The cosmic entity encounters interference - the knowledge streams are disrupted.';
        }

        // Extract and clean the response
        const responseText = data?.choices?.[0]?.message?.content || '';

        if (!responseText) {
            console.warn('[PERPLEXITY_API] Empty response received - data structure:', JSON.stringify(data, null, 2));
            return 'The cosmic silence is profound - no wisdom emerges from the void.';
        }

        // Remove citation numbers like [0], [1], etc. from the response
        const cleanedText = responseText.replace(/\[\d+\]/g, '');

        // Log successful usage for monitoring (optional)
        if (data.usage) {
            console.log('[PERPLEXITY_API] Token usage:', {
                prompt_tokens: data.usage.prompt_tokens,
                completion_tokens: data.usage.completion_tokens,
                total_tokens: data.usage.total_tokens,
                input_length: content.length,
                output_length: cleanedText.length
            });
        }

        return cleanedText;

    } catch (error) {
        console.error('[PERPLEXITY_API] Caught exception:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            input_content_length: content.length
        });

        // Network or parsing errors
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return 'The cosmic networks are severed - no connection to the knowledge realm exists.';
        } else if (error instanceof SyntaxError) {
            return 'The cosmic transmissions are corrupted - the response cannot be deciphered.';
        } else {
            return 'An unknown disturbance ripples through the cosmic fabric - the inquiry cannot be completed.';
        }
    }
}