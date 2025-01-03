import { GROQ_API_DEFAULT_MODEL, GROQ_INITIAL_MAX_TOKENS } from "@/config";
import { client } from "@/request";
import type { GroqResponse } from "@/typings";

interface IProps {
  key: string;
  question: string;
}

export async function sendMessage<T extends IProps>(props: T) {
  const messages = [
    {
      role: "user",
      content: props.question,
    },
  ];
  const clientResponse = (await client.post(
    "",
    {
      max_tokens: GROQ_INITIAL_MAX_TOKENS,
      messages: messages,
      model: GROQ_API_DEFAULT_MODEL,
    },
    {
      headers: {
        Authorization: `Bearer ${props.key}`,
      },
    }
  )) as GroqResponse;
  return clientResponse;
}
