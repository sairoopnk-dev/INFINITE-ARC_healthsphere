import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface DoctorMatchResult {
  specialization: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  reason: string;
  alternativeSpecializations: string[];
}

export async function matchDoctorAI(symptomsOrCondition: string): Promise<DoctorMatchResult> {
  const prompt = `You are a medical triage AI. Based on the following patient symptoms or condition: "${symptomsOrCondition}"

Recommend the most appropriate medical specialist and respond ONLY with a valid JSON object (no markdown, no code blocks) in this exact format:
{
  "specialization": "<primary doctor specialization, e.g. General Physician, Cardiologist, Dermatologist>",
  "urgency": "<'routine' | 'urgent' | 'emergency'>",
  "reason": "<brief explanation of why this specialist is recommended>",
  "alternativeSpecializations": ["<alt specialty 1>", "<alt specialty 2>"]
}

Rules:
- urgency 'routine': non-urgent, can schedule in days/weeks
- urgency 'urgent': should be seen within 24-48 hours
- urgency 'emergency': go to ER immediately
- specialization should be a real medical specialty`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  const text = (response.text ?? '').trim();
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
  const parsed: DoctorMatchResult = JSON.parse(cleaned);

  const validUrgencies = ['routine', 'urgent', 'emergency'];
  if (!validUrgencies.includes(parsed.urgency)) {
    parsed.urgency = 'routine';
  }

  return parsed;
}
