import { GROQ_API_DEFAULT_MODEL, GROQ_INITIAL_MAX_TOKENS } from "@/config";
import { Role } from "@/enums";
import {
  getGroqPromptModifiers,
  getGroqRequest,
} from "@/modifiers/url+modifers";
import { client } from "@/request";
import { GroqResponse } from "@/typings";

interface SystemPrompt {
  role: "system" | "user" | Role;
  content: string;
}

interface IProps<T> {
  key: T;
  history: SystemPrompt[];
  text: string;
  prompt: string;
}

export async function sendClientMessage<T extends string>(props: IProps<T>) {
  const headers = getGroqPromptModifiers({
    prompt: {
      content: props.prompt,
      role: Role.System,
    },
  });

  const groqInitials = getGroqRequest({
    prompt: headers,
    history: props.history,
    maxTokens: GROQ_INITIAL_MAX_TOKENS,
    model: GROQ_API_DEFAULT_MODEL,
    message: { content: props.text, role: Role.User },
    key: props.key,
  });

  const response = (await client.post(
    "",
    {
      max_tokens: groqInitials.max_tokens,
      messages: groqInitials.messages,
      model: groqInitials.model,
    },
    {
      headers: groqInitials.headers,
    }
  )) as GroqResponse;

  return response;
}
