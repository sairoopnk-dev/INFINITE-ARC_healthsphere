import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

/**
 * Asks Gemini to produce 5–6 short, relevant follow-up questions
 * for the given symptoms. Returns a clean string[] (max 6 items).
 */
export async function generateFollowUpQuestionsAI(symptoms: string): Promise<string[]> {
  const prompt = `You are a medical AI assistant. A patient has reported the following symptoms: "${symptoms}"

Your job is to generate 5 to 6 short, simple, and highly relevant follow-up questions to better understand their condition before giving a final assessment.

Rules:
- Questions must be directly related to the reported symptoms
- Keep each question SHORT (one sentence, max 15 words)
- Do NOT ask for name, email, or any personal identifiable information
- Do NOT ask the patient to rate their pain on any scale (e.g., 1-10).
- All questions must be optional for the patient to answer
- Cover aspects like: duration, other concurrent symptoms, medication taken, relevant history
- Respond ONLY with a valid JSON array of strings, no markdown, no extra text

Example format:
["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?", "Question 6?"]`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  const text = (response.text ?? '').trim();
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();

  const parsed: string[] = JSON.parse(cleaned);

  // Enforce max 6 questions
  return parsed.slice(0, 6);
}
