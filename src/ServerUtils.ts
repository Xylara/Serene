import { Router, Request, Response, Express } from 'express';
import { GroqService } from './GroqService';
import { GeminiService } from './GeminiService';
import { Stream } from 'stream';

const BASE_PATH = '/serene/api/ai';

function StartGroq(router: Router, apiKey: string) {
  const groqService = new GroqService(apiKey);

  router.post('/groq/send', async (req: Request, res: Response) => {
    const { messages, model } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).send({ error: 'Missing or invalid messages array in request body.' });
    }

    try {
      const stream: Stream = await groqService.createStreamingChatCompletion(messages, model);

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });

      stream.on('data', (chunk) => {
        res.write('data: ' + JSON.stringify(chunk) + '\n\n');
      });

      stream.on('end', () => {
        res.end();
      });

      stream.on('error', (err) => {
        console.error('Groq Stream Error:', err);
        if (!res.headersSent) {
          res.status(500).send({ error: 'Internal server error during Groq streaming.' });
        } else {
          res.end();
        }
      });
    } catch (error: any) {
      console.error('Groq API Initialization/Call Error:', error);
      res.status(500).send({ error: error.message || 'Error communicating with Groq API.' });
    }
  });
}

function StartGemini(router: Router, apiKey: string) {
  const geminiService = new GeminiService(apiKey);

  router.post('/gemini/send', async (req: Request, res: Response) => {
    const { contents, model } = req.body;

    if (!contents || !Array.isArray(contents)) {
      return res.status(400).send({ error: 'Missing or invalid contents array in request body.' });
    }

    try {
      const result = await geminiService.generateContentStream(contents, model);

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });

      const stream = (result as any).stream || result;
      for await (const chunk of stream) {
        res.write('data: ' + JSON.stringify(chunk) + '\n\n');
      }

      res.end(); 

    } catch (error: any) {
      console.error('Gemini API Initialization/Call Error:', error);
      if (!res.headersSent) {
        res.status(500).send({ error: error.message || 'Error communicating with Gemini API.' });
      } else {
        res.end();
      }
    }
  });
}

export function StartAPI(
  app: any,
  groqApiKey: string,
  geminiApiKey: string,
  customBasePath: string = BASE_PATH
) {
  const sereneRouter = Router();

  StartGroq(sereneRouter, groqApiKey);
  StartGemini(sereneRouter, geminiApiKey);
  app.use(customBasePath, sereneRouter);

  console.log(`Serene registered`);
}

export { BASE_PATH };
