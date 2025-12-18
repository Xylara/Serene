import { GoogleGenAI } from '@google/genai';

export class GeminiService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Gemini API Key is required.');
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  public createChat(model: string = 'gemini-2.0-flash') {
    return this.ai.chats.create({ model });
  }

  public async generateContentStream(
    contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>,
    model: string = 'gemini-2.0-flash',
  ) {
    return await this.ai.models.generateContentStream({
      model,
      contents,
    });
  }

  public async generateContent(
    contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>,
    model: string = 'gemini-2.0-flash',
  ) {
    return await this.ai.models.generateContent({
      model,
      contents,
    });
  }

  public client() {
    return this.ai;
  }
}