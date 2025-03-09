export type ChatContext =
  | 'coding'
  | 'business'
  | 'casual'
  | 'technical'
  | 'default';

export interface ChatRequest {
  message: string;
  context?: ChatContext;
}

export interface ChatResponse {
  message: string;
  metadata: {
    length: number;
    responseTime: number;
    contextUsed: string;
    temperature: number;
  };
}
