type SystemRole = "user" | "assistant";
interface SystemPrompt {
  role: SystemRole;
  content: string;
}
