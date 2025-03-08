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
        messages: [{ role: 'user', content: req.body.prompt }],
        temperature: 0,
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
    console.error('OpenAI API error:', error);
    if (error.response?.status === 429) {
      return res
        .status(429)
        .json({ error: 'Too many requests. Please try again later.' });
    }
    return res.status(500).json({ error: 'Failed to get response from AI' });
  }
}
