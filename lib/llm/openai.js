import OpenAI from 'openai';
import { LLMProvider } from './provider.js';

export class OpenAIProvider extends LLMProvider {
  constructor(config) {
    super(config);
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL || undefined,
      dangerouslyAllowBrowser: true
    });
  }

  validateConfig() {
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key is required');
    }
    if (!this.config.model) {
      throw new Error('OpenAI model is required');
    }
    return true;
  }

  async chat(messages, options = {}) {
    this.validateConfig();

    const response = await this.client.chat.completions.create({
      model: this.config.model,
      messages: messages,
      tools: options.tools,
      tool_choice: options.tool_choice,
      max_tokens: options.max_tokens || 4000,
      temperature: options.temperature || 0.7,
      stream: false
    });

    return {
      content: response.choices[0].message.content,
      tool_calls: response.choices[0].message.tool_calls || [],
      usage: response.usage
    };
  }

  async *streamChat(messages, options = {}) {
    this.validateConfig();

    const stream = await this.client.chat.completions.create({
      model: this.config.model,
      messages: messages,
      tools: options.tools,
      tool_choice: options.tool_choice,
      max_tokens: options.max_tokens || 4000,
      temperature: options.temperature || 0.7,
      stream: true
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;
      if (delta?.content) {
        yield {
          type: 'content',
          content: delta.content
        };
      }
      if (delta?.tool_calls) {
        yield {
          type: 'tool_calls',
          tool_calls: delta.tool_calls
        };
      }
    }
  }

  static getDefaultModels() {
    return [
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
    ];
  }
}