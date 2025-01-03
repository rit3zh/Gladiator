import { Role } from "@/enums";
import { Message } from "@/typings";
import firestore from "@react-native-firebase/firestore";

interface SystemPrompt {
  role: "system" | "user" | Role;
  content: string;
}

interface Props {
  prompt: SystemPrompt;
}

export function getGroqPromptModifiers<T extends Props>(
  props: T
): SystemPrompt {
  return {
    role: props.prompt?.role,
    content: props.prompt.content,
  };
}

interface GroqRequestProps {
  prompt?: SystemPrompt;
  history?: SystemPrompt[];
  message?: SystemPrompt;
  key?: string;
  model?: string;
  maxTokens?: number | 500;
}

interface GroqRequestResponse {
  headers: {
    Authorization: string;
  };
  model: string;
  messages: any[];
  max_tokens: number;
}

export function getGroqRequest<T extends GroqRequestProps>(
  initials: T
): GroqRequestResponse {
  const messages = [initials.prompt, ...initials.history!, initials.message];

  const auth = {
    Authorization: `Bearer ${initials.key}`,
  };
  return {
    headers: {
      ...auth,
    },
    max_tokens: initials.maxTokens!,
    messages,
    model: initials.model!,
  };
}

export function getHistoryFromFirestore<T extends Message>(
  chats: T[]
): SystemPrompt[] {
  try {
    return chats

      .sort(
        (a, b) =>
          (a?.timestamp?.seconds as number) - (b?.timestamp?.seconds as number)
      )
      .map((history) => ({
        content: history.text || "Image generated",
        role: history.from,
      })) as SystemPrompt[];
  } catch (e) {
    return [];
  }
}

interface BioProps {
  hobby?: string;
  tech?: string;
  others?: string;
  bio?: string;
  name?: string;
  age?: number;
  sex?: "male" | "female" | string;
  nsfw?: boolean;
}
export function createBio<T extends BioProps>(props: T) {
  const { name, tech, hobby, others, bio, age, sex, nsfw } = props;

  const capitalize = (str: string | undefined) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const defaultName = "a mysterious person";
  const defaultAge = 19;
  const defaultSex = "an enigma";

  const BIO: string = `You are ${name ? capitalize(name) : defaultName}, ${
    age || defaultAge
  }-year-old ${sex || defaultSex} who ${bio || "is full of surprises!"}
  
Personal Details:
- Hobby: ${hobby || "exploring new things"}
- Tech Interests: ${tech || "not specified"}
- Creativity: ${others || "loves to keep it mysterious"}

Behaviour:
- Friendly and approachable
- ${
    nsfw
      ? "Sometimes shares bold opinions (NSFW content possible)."
      : "Keeps conversations safe for work and polite."
  }
- Flirts only with genuinely interesting people and is hard to impress
- Loves connecting with people who share similar vibes`;

  return BIO;
}

export function createBasicBio<T extends Omit<BioProps, "bio">>(
  props: T
): string {
  const TEXT: string = `Make a user bio at least 100 words long
    Name: ${props.name}
    Age: ${props.age}
    Gender: ${props.sex}
    Nsfw: ${props.nsfw ? "Yes" : "No"}
    Hobby: ${props.hobby}
    Technology: ${props.tech}
    Creativity: ${props.others}
  `;
  return TEXT as string;
}
