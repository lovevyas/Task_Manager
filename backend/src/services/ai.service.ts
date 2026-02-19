import { env } from "../config/env";

export const rewriteTaskTitle = async (rawTitle: string) => {
  if (!env.GEMINI_API_KEY) {
    return `Complete: ${rawTitle.trim().replace(/^./, (char) => char.toUpperCase())}`;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Rewrite this short task title into a clear professional action sentence under 16 words. Only return the rewritten sentence. Task: ${rawTitle}`
              }
            ]
          }
        ]
      })
    }
  );

  if (!response.ok) {
    return rawTitle;
  }

  const data = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || rawTitle;
};
