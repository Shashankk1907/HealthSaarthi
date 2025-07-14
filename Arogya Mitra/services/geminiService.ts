
import { GoogleGenAI, GenerateContentResponse, Part, Content, GroundingAttribution, GroundingChunk } from "@google/genai";
import { GEMINI_MODEL_TEXT, GEMINI_API_KEY_PRESENT } from '../constants';
import { GroundingSource } from "../types";

let ai: GoogleGenAI | null = null;

if (GEMINI_API_KEY_PRESENT && import.meta.env.VITE_API_KEY) {
  ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
} else {
  console.warn("API Key for Gemini not found. AI features will be disabled. Ensure process.env.API_KEY is set.");
}

export interface GenerateTextResult {
  text: string;
  sources?: GroundingSource[];
}

interface GenerateTextOptions {
  prompt: string | Part | (string | Part)[];
  systemInstruction?: string;
  useGoogleSearch?: boolean;
}

export const generateText = async ({ prompt, systemInstruction, useGoogleSearch = false }: GenerateTextOptions): Promise<GenerateTextResult> => {
  if (!ai) {
    return { text: "AI service is not available. Please ensure the API key is configured." };
  }

  try {
    const userParts: Part[] = Array.isArray(prompt) 
        ? prompt.map(p => (typeof p === 'string' ? { text: p } : p))
        : (typeof prompt === 'string' ? [{ text: prompt }] : [prompt]);

    const contents: Content[] = [{ role: "user", parts: userParts }];
    
    const config: any = {};
    if (systemInstruction) {
        config.systemInstruction = systemInstruction;
    }
    if (useGoogleSearch) {
        config.tools = [{ googleSearch: {} }];
        // As per docs, do not set responseMimeType to application/json when using googleSearch
    }


    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: contents,
      ...(Object.keys(config).length > 0 && { config: config }),
    });
    
    let sources: GroundingSource[] | undefined = undefined;
    if (useGoogleSearch && response.candidates && response.candidates[0]?.groundingMetadata?.groundingChunks) {
        sources = response.candidates[0].groundingMetadata.groundingChunks
            .filter((chunk: GroundingChunk) => chunk.web)
            .map((chunk: GroundingChunk) => ({
                web: {
                    uri: chunk.web?.uri || '',
                    title: chunk.web?.title || 'Unknown source'
                }
            }));
    }

    return { text: response.text, sources };

  } catch (error) {
    console.error("Error generating text from Gemini:", error);
    if (error instanceof Error) {
        return { text: `Error communicating with AI: ${error.message}` };
    }
    return { text: "An unknown error occurred while communicating with the AI." };
  }
};
