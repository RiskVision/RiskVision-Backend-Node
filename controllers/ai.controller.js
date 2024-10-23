const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const axios = require('axios'); // Ensure axios is imported

exports.sendPrompt = catchAsync(async (req, res, next) => {
    try {
        const prompt = req.body.prompt;
        const AZURE_API_KEY = process.env.AZURE_API_KEY;
        const AZURE_AI_ENDPOINT = process.env.AZURE_AI_ENDPOINT;

        // Validate inputs
        if (!prompt) {
            return next(new AppError('Prompt is required', 400));
        }

        if (!AZURE_API_KEY || !AZURE_AI_ENDPOINT) {
            return next(new AppError('Azure configuration missing', 500));
        }

        // Set up headers for the request
        const headers = {
            'Content-Type': 'application/json',
            'api-key': AZURE_API_KEY,
        };

        // Create the payload for the request
        const payload = {
            messages: [
                {
                    role: 'system',
                    content: prompt
                }
            ],
            temperature: 0.7,
            top_p: 0.95,
            max_tokens: 800,
        };

        // Make the request to Azure
        const response = await axios.post(AZURE_AI_ENDPOINT, payload, { headers });
        
        // Validate response
        if (!response.data || !response.data.choices || !response.data.choices[0]) {
            return next(new AppError('Invalid response from Azure AI', 500));
        }

        const messageContent = response.data.choices[0].message.content;

        // Return successful response
        return res.status(200).json({
            status: 'success',
            data: {
                content: messageContent,
            },
        });

    } catch (error) {
        console.error('Azure AI Error:', error.response?.data || error.message);
        return next(new AppError(error.message || 'Failed to process AI request', 500));
    }
});
