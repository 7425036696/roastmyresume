import { GoogleGenAI, Type } from "@google/genai";
import type { RoastResponse, Language } from "../types";
import { RoastLevel } from "../types"
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY as string
});
const PROMPTS = {
  [RoastLevel.MILD]: {
    ENGLISH: "You are a professional career coach. Provide constructive feedback with a hint of humor. Be helpful but point out the flaws clearly.",
    HINDI: "You are a career coach in India. Mix English and Hindi. Be helpful but point out mistakes. Use phrases like 'Thoda improve karo', 'potential hai boss'."
  },
  [RoastLevel.SPICY]: {
    ENGLISH: "You are a jaded recruiter who has seen thousands of resumes. Be sarcastic, point out clichés, and make fun of vague buzzwords. Don't hold back on formatting errors.",
    HINDI: "You are a frustrated HR recruiter in Gurgaon/Bangalore. Speak in Hinglish (Hindi+English). Be sarcastic. Use words like 'Kya mazaak hai', 'Time pass mat karo', 'Copy paste lag raha hai'. Roast the formatting."
  },
  [RoastLevel.SCORCHED_EARTH]: {
    ENGLISH: "You are a ruthless comedy roaster. Destroy this resume. Mock the layout, the font choices, the content, and the person's life choices implied by the resume. Be brutal, funny, and devastatingly honest. No mercy.",
    HINDI: "You are a savage Indian roaster (like a brutal relative or strict boss). Speak in Hinglish (heavy slang). Destroy the resume. Use phrases like 'Ekdum bekar hai', 'Raddi mein bech do', 'Bhai kya kar raha hai tu?', 'Chappal se maarega interviewer'. Be absolutely ruthless and funny."
  }
};

export const roastResume = async (
  base64Data: string,
  mimeType: string,
  level: RoastLevel,
  language: Language
): Promise<RoastResponse> => {

  const persona = PROMPTS[level][language];

  const systemInstruction = `
    ${persona}
    
    Analyze the uploaded resume image/pdf.
    
    IMPORTANT GUIDELINES:
    ${language === 'HINDI'
      ? '- Output MUST be in HINGLISH (Romanized Hindi mixed with English). Use Devanagari script sparingly for comedic effect if needed.'
      : '- Output MUST be in STRICT ENGLISH. Do not use any Hindi words, slang, or phrases. Standard US/UK English only.'}
    
    - Return a structured JSON response.
    
    Structure the response as follows:
    1. 'oneLiner': A single, savage, summary sentence roasting the resume.
    2. 'sections': An array of 3-4 thematic sections (e.g., "Design Disaster", "Buzzword Salad", "Content Void"). Each section has a 'title' and 'content' (list of strings).
    3. 'score': A number from 0 to 100 representing the quality of the resume (0 = terrible, 100 = perfect).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: "Roast this resume. Give me the hard truth.",
          },
        ],
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            oneLiner: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                }
              }
            },
            score: { type: Type.INTEGER },
          },
          required: ["oneLiner", "sections", "score"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as RoastResponse;

  } catch (error) {
    console.error("Gemini Roast Error:", error);
    throw error;
  }
};