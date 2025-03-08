import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: req.body.prompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
      },
    );

    // Extract the message content from the ChatGPT response
    const text = response.data.choices[0]?.message?.content || '';
    return res.status(200).json({ text });
  } catch (error: any) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    if (error.response?.status === 429) {
      return res.status(429).json({
        error: "We're experiencing high demand. Please try again in a moment.",
      });
    }
    return res.status(500).json({ error: 'Failed to get response from AI' });
  }
}
