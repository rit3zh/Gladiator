export interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
  system_fingerprint: string;
  x_groq: XGroq;
}

interface Choice {
  index: number;
  message: Message;
  logprobs: any;
  finish_reason: string;
}

interface Message {
  role: string;
  content: string;
}

interface Usage {
  queue_time: number;
  prompt_tokens: number;
  prompt_time: number;
  completion_tokens: number;
  completion_time: number;
  total_tokens: number;
  total_time: number;
}

interface XGroq {
  id: string;
}
