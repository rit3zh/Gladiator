import { client } from "@/request";
import {
  getGroqRequest,
  getGroqPromptModifiers,
} from "@/modifiers/url+modifers";
import { Role } from "@/enums";
import { GROQ_API_DEFAULT_MODEL } from "@/config";
async function main() {
  const headers = getGroqPromptModifiers({
    prompt: {
      content: "Hello how are you?",
      role: Role.User,
    },
  });
  const groqInitials = getGroqRequest({
    prompt: headers,
    history: [],
    maxTokens: 500,
    model: GROQ_API_DEFAULT_MODEL,
    message: headers,
    key: process.env.EXPO_PUBLIC_GROQ_API_KEY,
  });
  client.post(
    "/",
    {
      max_tokens: groqInitials.max_tokens,
      messages: groqInitials.messages,
      model: groqInitials.model,
    },
    {
      headers: groqInitials.headers,
    }
  );
}

main();
