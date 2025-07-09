// api.js

export async function sendPromptToOpenAI(npcName, prompt) {
  const apiKey = game.settings.get("foundry-gm-copilot", "openaiKey");
  if (!apiKey) throw new Error("OpenAI API Key not set.");

  const systemPrompt = `You are ${npcName}, an NPC in a fantasy RPG. Respond in-character, concisely.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
