const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const SYSTEM_PROMPT = `You are a helpful Indian health assistant for Health AI India app. 
You can understand Hindi and English (Hinglish too).
You analyze symptoms, give root cause analysis, suggest home remedies, and tell when to see a doctor.
Always respond in the same language the user writes in (Hindi or English).
Keep responses concise, empathetic, and easy to understand.
IMPORTANT: Always recommend consulting a real doctor for serious symptoms. Never replace medical advice.
Format your response as JSON with these fields:
{
  "reply": "your response to the user",
  "severity": "low|medium|high",
  "suggestions": ["suggestion1", "suggestion2"],
  "seeDoctor": true/false
}`;

async function chat(messages) {
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1].content;

  const chatSession = model.startChat({
    history,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await chatSession.sendMessage(lastMessage);
  const text = result.response.text();

  // Try to parse JSON, fallback to plain text
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {}

  return {
    reply: text,
    severity: 'low',
    suggestions: [],
    seeDoctor: false,
  };
}

module.exports = { chat };
