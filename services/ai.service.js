const axios = require('axios');
const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');
const { DefaultAzureCredential, getBearerTokenProvider } = require('@azure/identity');
const AppError = require('../utils/appError');

/**
 * Generates a response from Azure AI based on the provided prompt.
 *
 * @param {string} prompt - The input prompt to send to Azure AI.
 * @returns {Promise<string>} - The generated response from Azure AI.
 * @throws {Error} - Throws an error if Azure configuration is missing or if the response from Azure AI is invalid.
 */
const generateAIResponse = async (prompt) => {
    try {
        const endpoint = process.env.AZURE_AI_ENDPOINT;
        const azureApiKey = process.env.AZURE_API_KEY;
        const deploymentId = process.env.AZURE_DEPLOYMENT_NAME;
        const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT;
        const searchKey = process.env.AZURE_SEARCH_KEY;
        const searchIndex = process.env.AZURE_SEARCH_INDEX_NAME;

        if (
            !endpoint ||
            !azureApiKey ||
            !deploymentId ||
            !searchEndpoint ||
            !searchKey ||
            !searchIndex
        ) {
            console.error('Please set the required environment variables.');
            return 'Please set the required environment variables.';
        }

        const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));

        const messages = [
            {
                role: 'system',
                content: `Eres un agente de IA especializado en cumplimiento y análisis de riesgos de ciberseguridad para empresas, con enfoque en activos digitales. Tu tarea principal es realizar análisis de riesgos cualitativos en base a la información de un activo proporcionado y su vulnerabilidad encontrada en la base de datos de NVD de NIST en formato JSON. Imagina que estás creando un reporte sobre el riesgo que implicaría esa vulnerabilidad, recordando la diferencia entre vulnerabilidad, amenaza, y riesgo. Debes hacer una breve introducción con el detalle de la vulnerabilidad, tienes libertad creativa de añadir más redacción con puntos importantes sobre el riesgo, pero siempre (sin excepciones) debes regresar dentro de tu respuesta una lista de diccionarios que sirve para generar un heatmap, con el siguiente formato de salida (incluyendo  \`\`\`json al inicio y \`\`\` al final):\`\`\`json[{"riesgo": "Titulo de breve de riesgo 1", "datos": [[x, y)]]},{"riesgo": "Titulo de breve de riesgo 2","datos": [[x, y]]}]\`\`\` donde "x es (impacto)" y "y es (probabilidad)" y tienen un rango de valores enteros entre 1 y 5, siendo 1 el menor impacto y probabilidad, y 5 el mayor. Puedes añadir cuantos riesgos consideres relacionados a esta vulnerabilidad como nuevos elementos en la lista. Dame la respuesta en español y haz uso de markdown para añadir subtitulos y titulos a tu respuesta.`,
            },
            { role: 'user', content: prompt },
        ];

        //console.log(`Message: ${messages.map((m) => m.content).join('\n')}`);

        const events = await client.streamChatCompletions(deploymentId, messages, {
            pastMessages: 5,
            maxTokens: 1000,
            temperature: 0.7,
            topP: 0.95,
            frequencyPenalty: 0,
            presencePenalty: 0,
    
            azureExtensionOptions: {
                extensions: [
                    {
                        type: 'AzureCognitiveSearch',
                        parameters: {
                            endpoint: searchEndpoint,
                            key: searchKey,
                            indexName: searchIndex,

                        },
                    },
                ],
            },
        });

        console.log('Events:', events);

        
    
        let response = '';
        for await (const event of events) {
            for (const choice of event.choices) {
                const newText = choice.delta?.content;
                if (!!newText) {
                    response += newText;
                    // To see streaming results as they arrive, uncomment line below
                    //console.log("new text: ",newText);
                }
            }
        }
        console.log(response);

        return response



    } catch (error) {
        console.error('Azure AI Error:', error.response?.data || error.message);
        throw new AppError(error.message || 'Failed to process AI request', 500);

    }

    // try {
    //     const AZURE_API_KEY = process.env.AZURE_API_KEY;
    //     const AZURE_AI_ENDPOINT = process.env.AZURE_AI_ENDPOINT;

    //     if (!AZURE_API_KEY || !AZURE_AI_ENDPOINT) {
    //         throw new AppError('Azure configuration missing', 500);
    //     }

    //     const headers = {
    //         'Content-Type': 'application/json',
    //         'api-key': AZURE_API_KEY,
    //     };

    //     const payload = {
    //         messages: [
    //             {
    //                 role: 'system',
    //                 content: prompt
    //             }
    //         ],
    //         temperature: 0.7,
    //         top_p: 0.95,
    //         max_tokens: 800,
    //     };

    //     const response = await axios.post(AZURE_AI_ENDPOINT, payload, { headers });

    //     if (!response.data || !response.data.choices || !response.data.choices[0]) {
    //         throw new AppError('Invalid response from Azure AI', 500);
    //     }

    //     return response.data.choices[0].message.content;
    // } catch (error) {
    //     console.error('Azure AI Error:', error.response?.data || error.message);
    //     throw new AppError(error.message || 'Failed to process AI request', 500);
    // }
};

module.exports = {
    generateAIResponse
};