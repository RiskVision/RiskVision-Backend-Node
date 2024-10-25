const axios = require('axios');

/**
 * Generates a response from Azure AI based on the provided prompt.
 *
 * @param {string} prompt - The input prompt to send to Azure AI.
 * @returns {Promise<string>} - The generated response from Azure AI.
 * @throws {Error} - Throws an error if Azure configuration is missing or if the response from Azure AI is invalid.
 */
const generateAIResponse = async (prompt) => {
    try {
        const AZURE_API_KEY = process.env.AZURE_API_KEY;
        const AZURE_AI_ENDPOINT = process.env.AZURE_AI_ENDPOINT;

        if (!AZURE_API_KEY || !AZURE_AI_ENDPOINT) {
            throw new AppError('Azure configuration missing', 500);
        }

        const headers = {
            'Content-Type': 'application/json',
            'api-key': AZURE_API_KEY,
        };

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

        const response = await axios.post(AZURE_AI_ENDPOINT, payload, { headers });
        
        if (!response.data || !response.data.choices || !response.data.choices[0]) {
            throw new AppError('Invalid response from Azure AI', 500);
        }

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Azure AI Error:', error.response?.data || error.message);
        throw new AppError(error.message || 'Failed to process AI request', 500);
    }
};

module.exports = {
    generateAIResponse
};