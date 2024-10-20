import express from 'express';
import axios from 'axios';

const router = express.Router();

const AZURE_API_KEY = process.env.AZURE_API_KEY;
const AZURE_AI_ENDPOINT = 'https://openaidemoplatzi.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview';

router.post('/send_prompt', async (req, res) => {
    const prompt = req.body.prompt;

    if (!prompt) {
        return res.status(400).json({ detail: 'Prompt is required' });
    }

    const headers = {
        'Content-Type': 'application/json',
        'api-key': AZURE_API_KEY,
    };

    const payload = {
        messages: [
            {
                role: 'system',
                content: [
                    {
                        type: 'text',
                        text: prompt
                    }
                ]
            }
        ],
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 800
    };

    try {
        const response = await axios.post(AZURE_AI_ENDPOINT, payload, { headers });
        const responseMsg = response.data;
        const messageContent = responseMsg.choices[0].message.content;
        res.json({ content: messageContent });
    } catch (error) {
        console.error(`Failed to make the request. Error: ${error}`);
        res.status(500).json({ detail: `Failed to make the request. Error: ${error}` });
    }
});

export default router;