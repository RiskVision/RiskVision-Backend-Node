const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const axios = require('axios'); // Ensure axios is imported

exports.sendPrompt = catchAsync(async (req, res, next) => {
    const prompt = req.body.prompt;
    const AZURE_API_KEY = process.env.AZURE_API_KEY;
    const AZURE_AI_ENDPOINT = process.env.AZURE_AI_ENDPOINT;

    // Check if the prompt is provided in the request body
    if (!prompt) {
        return next(new AppError('Prompt is required', 400));
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
                content: [
                    {
                        type: 'text',
                        text: prompt,
                    },
                ],
            },
        ],
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 800,
    };

    try {
        // Make a POST request to the Azure AI endpoint
        const response = await axios.post(AZURE_AI_ENDPOINT, payload, { headers });
        const responseData = response.data;
        const messageContent = responseData.choices[0].message.content;

        // Send the response back to the client
        res.status(200).json({
            status: 'success',
            data: {
                content: messageContent,
            },
        });
    } catch (error) {
        console.error(`Failed to make the request. Error: ${error}`);
        return next(new AppError(`Failed to make the request. Error: ${error}`, 500));
    }
});
