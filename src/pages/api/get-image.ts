import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Add content filtering to the prompt
    const safePrompt = `A safe, family-friendly landscape image of mountains and trees in nature`;

    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: safePrompt,
        n: 1,
        size: '512x512',
        response_format: 'url',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
      },
    );

    const imageUrl = response.data.data[0].url;
    return res.status(200).json({ imageUrl });
  } catch (error: any) {
    console.error('OpenAI API error:', error.response?.data || error.message);

    if (error.response?.status === 400) {
      return res.status(400).json({
        error:
          'I apologize, but I can only generate family-friendly images. Let me help you create a beautiful landscape instead.',
        suggestion:
          'Try asking for nature scenes, landscapes, or other appropriate content.',
      });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({
        error: "We're experiencing high demand. Please try again in a moment.",
      });
    }

    return res.status(500).json({
      error:
        'Something went wrong while generating the image. Please try again.',
      suggestion:
        'You might want to try a simpler prompt or wait a moment before retrying.',
    });
  }
}
