import Anthropic from '@anthropic-ai/sdk';
import { LLMProvider } from './provider.js';

export class AnthropicProvider extends LLMProvider {
  constructor(config) {
    super(config);
    this.client = new Anthropic({
      apiKey: config.apiKey,
      baseURL: config.baseURL || undefined,
      dangerouslyAllowBrowser: true
    });
  }

  validateConfig() {
    if (!this.config.apiKey) {
      throw new Error('Anthropic API key is required');
    }
    if (!this.config.model) {
      throw new Error('Anthropic model is required');
    }
    return true;
  }

  formatMessages(messages) {
    // Convert OpenAI format to Anthropic format
    const systemMessage = messages.find(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');

    return {
      system: systemMessage?.content || undefined,
      messages: conversationMessages
    };
  }

  async chat(messages, options = {}) {
    this.validateConfig();

    const { system, messages: formattedMessages } = this.formatMessages(messages);

    const response = await this.client.messages.create({
      model: this.config.model,
      system: system,
      messages: formattedMessages,
      tools: options.tools,
      tool_choice: options.tool_choice,
      max_tokens: options.max_tokens || 4000,
      temperature: options.temperature || 0.7,
      stream: false
    });

    return {
      content: response.content[0]?.text || '',
      tool_calls: response.content.filter(c => c.type === 'tool_use') || [],
      usage: response.usage
    };
  }

  async *streamChat(messages, options = {}) {
    this.validateConfig();

    const { system, messages: formattedMessages } = this.formatMessages(messages);

    const stream = await this.client.messages.create({
      model: this.config.model,
      system: system,
      messages: formattedMessages,
      tools: options.tools,
      tool_choice: options.tool_choice,
      max_tokens: options.max_tokens || 4000,
      temperature: options.temperature || 0.7,
      stream: true
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
        yield {
          type: 'content',
          content: chunk.delta.text
        };
      }
      if (chunk.type === 'content_block_start' && chunk.content_block?.type === 'tool_use') {
        yield {
          type: 'tool_calls',
          tool_calls: [chunk.content_block]
        };
      }
    }
  }

  static getDefaultModels() {
    return [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' }
    ];
  }
}