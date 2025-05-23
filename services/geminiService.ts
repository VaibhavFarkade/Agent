
import { GoogleGenAI, Chat, GenerateContentResponse, InitChatParams } from "@google/genai";

let geminiAI: GoogleGenAI | null = null;

export const initializeGemini = (apiKey: string): void => {
  if (!apiKey) {
    console.error("Gemini API Key is missing.");
    throw new Error("Gemini API Key is missing. Ensure the API_KEY environment variable is set.");
  }
  geminiAI = new GoogleGenAI({ apiKey });
};

export const createChatSession = (systemInstruction?: string): Chat => {
  if (!geminiAI) {
    throw new Error("Gemini AI not initialized. Call initializeGemini first with a valid API key.");
  }
  const chatParams: InitChatParams = {
    model: 'gemini-2.5-flash-preview-04-17',
  };
  if (systemInstruction) {
    chatParams.config = { systemInstruction };
  }
  return geminiAI.chats.create(chatParams);
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred with the Gemini API.");
  }
};
