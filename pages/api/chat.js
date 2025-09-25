// /pages/api/chat.js
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { provider, apiKey, model, baseURL, messages, tools, temperature, maxTokens, stream } = req.body;

  if (!provider || !apiKey || !model || !messages) {
    return res.status(400).json({ error: 'Missing required fields: provider, apiKey, model, messages' });
  }

  try {
    if (stream) {
      // Set headers for streaming
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });

      if (provider === 'openai') {
        const client = new OpenAI({
          apiKey,
          baseURL: baseURL || undefined
        });

        const stream = await client.chat.completions.create({
          model,
          messages,
          tools: tools || undefined,
          temperature: temperature || 0.7,
          max_tokens: maxTokens || 4000,
          stream: true
        });

        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta;
          if (delta?.content) {
            res.write(JSON.stringify({
              type: 'content',
              content: delta.content
            }) + '\n');
          }
          if (delta?.tool_calls) {
            res.write(JSON.stringify({
              type: 'tool_calls',
              tool_calls: delta.tool_calls
            }) + '\n');
          }
        }

      } else if (provider === 'anthropic') {
        const client = new Anthropic({
          apiKey,
          baseURL: baseURL || undefined
        });

        // Convert messages format for Anthropic
        const systemMessage = messages.find(m => m.role === 'system');
        const conversationMessages = messages.filter(m => m.role !== 'system');

        const stream = await client.messages.create({
          model,
          system: systemMessage?.content || undefined,
          messages: conversationMessages,
          tools: tools || undefined,
          temperature: temperature || 0.7,
          max_tokens: maxTokens || 4000,
          stream: true
        });

        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
            res.write(JSON.stringify({
              type: 'content',
              content: chunk.delta.text
            }) + '\n');
          }
          if (chunk.type === 'content_block_start' && chunk.content_block?.type === 'tool_use') {
            res.write(JSON.stringify({
              type: 'tool_calls',
              tool_calls: [chunk.content_block]
            }) + '\n');
          }
        }
      }

      res.end();

    } else {
      // Non-streaming response
      let result;

      if (provider === 'openai') {
        const client = new OpenAI({
          apiKey,
          baseURL: baseURL || undefined
        });

        const response = await client.chat.completions.create({
          model,
          messages,
          tools: tools || undefined,
          temperature: temperature || 0.7,
          max_tokens: maxTokens || 4000,
          stream: false
        });

        result = {
          content: response.choices[0].message.content,
          tool_calls: response.choices[0].message.tool_calls || [],
          usage: response.usage
        };

      } else if (provider === 'anthropic') {
        const client = new Anthropic({
          apiKey,
          baseURL: baseURL || undefined
        });

        // Convert messages format for Anthropic
        const systemMessage = messages.find(m => m.role === 'system');
        const conversationMessages = messages.filter(m => m.role !== 'system');

        const response = await client.messages.create({
          model,
          system: systemMessage?.content || undefined,
          messages: conversationMessages,
          tools: tools || undefined,
          temperature: temperature || 0.7,
          max_tokens: maxTokens || 4000,
          stream: false
        });

        result = {
          content: response.content[0]?.text || '',
          tool_calls: response.content.filter(c => c.type === 'tool_use') || [],
          usage: response.usage
        };
      }

      res.status(200).json({
        success: true,
        result
      });
    }

  } catch (error) {
    console.error('Chat API error:', error);

    let errorMessage = 'Request failed';
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
    } else {
      errorMessage = error.message || 'Unknown error';
    }

    if (!res.headersSent) {
      res.status(statusCode).json({
        success: false,
        error: errorMessage
      });
    }
  }
}