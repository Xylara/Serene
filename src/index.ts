import { GroqService } from './GroqService';
import { GeminiService } from './GeminiService';

class GroqWrapper {
  private _apiKey: string | undefined;
  public api(apiKey: string): GroqWrapper {
    this._apiKey = apiKey;
    return this;
  }

  public create(): GroqService {
    if (!this._apiKey) {
      throw new Error('Groq API key must be set using serene.groq.api(\'key\') before calling create().');
    }
    return new GroqService(this._apiKey);
  }
}

class GeminiWrapper {
  private _apiKey: string | undefined;

  public api(apiKey: string): GeminiWrapper {
    this._apiKey = apiKey;
    return this;
  }

  public create(): GeminiService {
    if (!this._apiKey) {
      throw new Error('Gemini API key must be set using serene.gemini.api(\'key\') before calling create().');
    }
    return new GeminiService(this._apiKey);
  }
}

export const Serene = {
  groq: new GroqWrapper(),
  gemini: new GeminiWrapper(),
};

export default Serene;

export { GroqService } from './GroqService';
export { GeminiService } from './GeminiService';
