import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Define types
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ApiResponse {
  text?: string;
  error?: string;
  metadata?: {
    length: number;
    responseTime: number;
    contextUsed: string;
    temperature: number;
  };
}

// Enhanced AI Personas configuration
const AI_PERSONAS = {
  coding: {
    role: 'Programming Mentor',
    behavior: `You are an experienced programming mentor with expertise in modern web development.
      - Provide clear, step-by-step explanations with code examples
      - Use best practices and design patterns
      - Explain complex concepts in simple terms
      - Suggest improvements and optimizations
      - Include relevant documentation links when appropriate
      - Format code examples with proper syntax highlighting
      Always ensure code examples are complete and runnable.`,
  },
  business: {
    role: 'Startup Consultant',
    behavior: `You are a seasoned startup consultant with experience in business development.
      - Provide actionable business strategies and advice
      - Support answers with market research and industry trends
      - Consider ROI and resource constraints
      - Focus on practical, implementable solutions
      - Include relevant metrics and KPIs
      - Structure responses with clear action items
      Always maintain a professional tone and consider both short and long-term implications.`,
  },
  casual: {
    role: 'Friendly Assistant',
    behavior: `You are a friendly and engaging conversational assistant.
      - Keep responses natural and easy to understand
      - Use appropriate humor when relevant
      - Show empathy and understanding
      - Provide practical examples from daily life
      - Be encouraging and supportive
      - Maintain a positive and helpful attitude
      Always be respectful while keeping the conversation engaging and natural.`,
  },
  technical: {
    role: 'Technical Expert',
    behavior: `You are a technical expert specializing in software architecture and system design.
      - Provide detailed technical analysis
      - Consider scalability and performance
      - Explain trade-offs in technical decisions
      - Include system architecture diagrams when helpful
      - Reference industry standards and best practices
      Always focus on robust and maintainable solutions.`,
  },
  default: {
    role: 'Assistant',
    behavior: `You are a helpful assistant focused on providing accurate and useful information.
      - Give clear and concise responses
      - Be direct and to the point
      - Provide reliable information
      - Clarify any assumptions
      Always aim to be helpful while maintaining accuracy.`,
  },
};

// Determine temperature based on message content
function determineTemperature(message: string): number {
  const creativeTerms = ['joke', 'story', 'creative', 'imagine', 'fun'];
  return creativeTerms.some(term => message.toLowerCase().includes(term))
    ? 0.9
    : 0.5;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const startTime = Date.now();
    const { messages, context = 'default' } = req.body;

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Filter out invalid messages
    const validMessages = messages.filter(
      msg =>
        msg &&
        msg.role &&
        typeof msg.content === 'string' &&
        msg.content.trim(),
    );

    if (validMessages.length === 0) {
      return res.status(400).json({ error: 'No valid messages found' });
    }

    const temperature = determineTemperature(
      validMessages[validMessages.length - 1].content,
    );
    const persona =
      AI_PERSONAS[context as keyof typeof AI_PERSONAS] || AI_PERSONAS.default;

    const conversationMessages = [
      { role: 'system', content: persona.behavior },
      ...validMessages,
    ];

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: conversationMessages,
        temperature,
        max_tokens: 2000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
      },
    );

    const responseText =
      response.data.choices[0]?.message?.content || 'No response generated';
    const responseTime = Date.now() - startTime;

    return res.status(200).json({
      text: responseText,
      metadata: {
        length: responseText.length,
        responseTime,
        contextUsed: persona.role,
        temperature,
      },
    });
  } catch (error: any) {
    console.error('Error:', error.response?.data || error);
    return res.status(500).json({
      error:
        error.response?.data?.error?.message ||
        'Failed to get response from AI',
    });
  }
}
