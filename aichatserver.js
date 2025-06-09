import express from 'express';
import env from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import bodyParser from 'body-parser'; 
import cors from 'cors';
import path from 'path';

const app = express();
env.config('./.env');

const api_key = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(api_key);

const generationConfig = {
  temperature: 0.5,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 200,
  responseMimeType: "text/plain",
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

app.use(cors()); 
app.use(bodyParser.json()); 

app.post('/api/messages', async (req, res) => {
  const { message } = req.body;

  try {
    const chatSession = model.startChat({
      generationConfig,
    });
    
    const result = await chatSession.sendMessage(message);
    res.send(result.response.text());
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Export the app and start function
const startAIChatServer = (port) => {
  return app.listen(port, () => {
    console.log(`AI Chat Server is running on http://localhost:${port}`);
  });
};

export { startAIChatServer };

