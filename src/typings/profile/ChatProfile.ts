export interface ChatProfile {
  chatProfileId: string;
  chatId: string;
  bio: string;
  name: string;
  image: string;
  deleteImage?: string;
  createdAt: any;
  lastMessage: string;
  lastMessageTimestamp: string | any;
  age?: number;
  nsfw?: boolean;
  sex?: string | "male" | "female";
  interests?: string[];
}
