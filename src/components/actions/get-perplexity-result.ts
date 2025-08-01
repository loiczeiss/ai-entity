// app/actions/perplexity.ts

'use server';

export async function getPerplexityResults(content: string) {
  const url = 'https://api.perplexity.ai/chat/completions';
  const headers = {
    Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const payload = {
    model: 'sonar',
    messages: [{ role: 'user', content: content }],
    search_context_size: 'medium',
    response_format: {
      type: 'text',
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  // Remove citation numbers like [0], [1], etc. from the response
  const responseText = data?.choices?.[0]?.message?.content || '';
  const cleanedText = responseText.replace(/\[\d+\]/g, '');

  return cleanedText || 'No response from AI.';
}
