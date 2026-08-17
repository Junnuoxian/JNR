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

  // WeChat Login Endpoint
  app.get('/api/wechat/login-url', (req, res) => {
    const appId = process.env.WECHAT_APP_ID;
    if (!appId) {
      // Development Mock Mode: bypass actual WeChat if keys are not set
      return res.json({ url: '/api/wechat/callback?code=mock_dev_code_999' });
    }
    
    // Web QR code login (snsapi_login)
    const redirectUri = encodeURIComponent(`https://${req.get('host')}/api/wechat/callback`);
    const state = Math.random().toString(36).substring(7);
    const url = `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`;
    
    res.json({ url });
  });

  // WeChat Callback Endpoint
  app.get('/api/wechat/callback', async (req, res) => {
    const { code } = req.query;

    // Handle Mock Mode
    if (code === 'mock_dev_code_999') {
      const userInfo = encodeURIComponent(JSON.stringify({
        nickname: '微信用户 (测试)',
        headimgurl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WeChat&backgroundColor=f9a8d4',
        openid: 'mock_openid_123456789'
      }));
      return res.redirect(`/?wechat_user=${userInfo}`);
    }

    const appId = process.env.WECHAT_APP_ID;
    const secret = process.env.WECHAT_APP_SECRET;

    if (!code || !appId || !secret) {
      return res.redirect('/?error=wechat_config_missing');
    }

    try {
      // 1. Exchange code for access token
      const tokenResponse = await fetch(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${secret}&code=${code}&grant_type=authorization_code`);
      const tokenData = await tokenResponse.json();

      if (tokenData.errcode) {
        console.error('WeChat Token Error:', tokenData);
        return res.redirect(`/?error=wechat_auth_failed`);
      }

      // 2. Fetch user info
      const userResponse = await fetch(`https://api.weixin.qq.com/sns/userinfo?access_token=${tokenData.access_token}&openid=${tokenData.openid}`);
      const userData = await userResponse.json();

      if (userData.errcode) {
        console.error('WeChat UserInfo Error:', userData);
        return res.redirect(`/?error=wechat_user_failed`);
      }

      // 3. Pass user data to client via URL params (simple approach)
      const userInfo = encodeURIComponent(JSON.stringify({
        nickname: userData.nickname,
        headimgurl: userData.headimgurl,
        openid: userData.openid
      }));
      
      res.redirect(`/?wechat_user=${userInfo}`);
    } catch (error) {
      console.error('WeChat Login Error:', error);
      res.redirect('/?error=wechat_server_error');
    }
  });

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
