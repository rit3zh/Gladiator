import { QUOTE_API } from "@/config/";

export async function getRandomQuote(): Promise<string> {
  const request = await fetch(QUOTE_API);
  const data = await request.json();
  const content = data[0]?.content;
  return content as string;
}
