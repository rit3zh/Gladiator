import HttpClient from "./fetch";
import { GROQ_API_KEY_CHAT_COMPLETION } from "@/config/index";

export const client = new HttpClient(GROQ_API_KEY_CHAT_COMPLETION);
