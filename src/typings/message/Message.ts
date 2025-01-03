import { Role } from "@/enums";
import { IMessage } from "react-native-gifted-chat";
export interface Message extends IMessage {
  timestamp: any;
  type?: "text" | "image" | "audio";
  liked?: boolean;
  from?: Role | "user" | "assistant";
}
