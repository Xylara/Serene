import { Groq } from 'groq-sdk';
import { Stream } from 'stream';

export class GroqService {
  private groq: Groq;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Groq API Key is required.');
    }
    this.groq = new Groq({ apiKey });
  }

  public async createStreamingChatCompletion(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    model: string = 'mixtral-8x7b-32768',
  ): Promise<Stream> {
    const response = await this.groq.chat.completions.create({
      messages: messages as any,
      model,
      stream: true,
    });

    const stream = new Stream.Readable({ objectMode: true });
    stream._read = () => {};

    (async () => {
      try {
        for await (const chunk of response) {
          stream.push(chunk);
        }
        stream.push(null); 
      } catch (error) {
        stream.emit('error', error);
      }
    })();

    return stream;
  }

  public async createChatCompletion(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    model: string = 'mixtral-8x7b-32768',
  ) {
    return this.groq.chat.completions.create({
      messages: messages as any,
      model,
      stream: false,
    });
  }

  public client() {
    return this.groq;
  }
}
