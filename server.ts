import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'MISSING_KEY' });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Recommendation Endpoint
  app.post('/api/ai/prep', async (req, res) => {
    try {
      const { name, date, isCountdown, days } = req.body;
      
      const prompt = `作为一个贴心的恋爱助手，请针对即将到来/或已经发生的纪念日提供建议。
纪念日/事件名称：${name}
类型：${isCountdown ? `倒数，还有 ${days} 天` : `正数，已发生 ${days} 天`}
日期：${date}

请提供：
1. 筹备建议与提醒事项（1-2条）
2. 浪漫的庆祝活动推荐（1-2个）
3. 合适的礼物建议（1-2个）
4. 一句简短浪漫的寄语

请使用温馨、清晰的语调，尽量精简，以Markdown格式返回。`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error('AI Error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate recommendations.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
