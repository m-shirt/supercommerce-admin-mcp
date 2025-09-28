// /pages/api/test-connection.js
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { provider, apiKey, model, baseURL } = req.body;

  if (!provider || !apiKey || !model) {
    return res.status(400).json({ error: 'Missing required fields: provider, apiKey, model' });
  }

  try {
    let result;

    if (provider === 'openai') {
      console.log('Testing OpenAI connection with:', {
        provider,
        baseURL,
        model,
        apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'missing'
      });

      const client = new OpenAI({
        apiKey,
        baseURL: baseURL || undefined
      });

      console.log('Making request to OpenAI client...');

      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: 'user', content: 'Hello, this is a connection test. Please respond with just "OK".' }
        ],
        max_tokens: 10,
        temperature: 0
      });

      console.log('OpenAI response received:', response);

      result = response.choices[0].message.content;

    } else if (provider === 'anthropic') {
      const client = new Anthropic({
        apiKey,
        baseURL: baseURL || undefined
      });

      const response = await client.messages.create({
        model,
        messages: [
          { role: 'user', content: 'Hello, this is a connection test. Please respond with just "OK".' }
        ],
        max_tokens: 10,
        temperature: 0
      });

      result = response.content[0]?.text || '';

    } else {
      return res.status(400).json({ error: 'Invalid provider. Must be "openai" or "anthropic"' });
    }

    res.status(200).json({
      success: true,
      message: 'Connection successful!',
      response: result
    });

  } catch (error) {
    console.error('Connection test error:', error);

    let errorMessage = 'Connection failed';
    let statusCode = 400;

    if (error.status) {
      statusCode = error.status;
      if (error.status === 401) {
        errorMessage = 'Invalid API key';
      } else if (error.status === 404) {
        errorMessage = 'Endpoint not found - check base URL';
      } else if (error.status === 422) {
        errorMessage = 'Invalid model or parameters';
      } else if (error.status === 429) {
        errorMessage = 'Rate limit exceeded';
      }
    } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      errorMessage = 'Invalid API key';
    } else if (error.message.includes('404')) {
      errorMessage = 'Endpoint not found - check base URL';
    } else if (error.message.includes('model')) {
      errorMessage = 'Invalid model or model not found';
    } else if (error.message.includes('rate limit')) {
      errorMessage = 'Rate limit exceeded';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Request timeout';
    } else {
      errorMessage = error.message || 'Unknown error';
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      details: error.message // Include full error for debugging
    });
  }
}