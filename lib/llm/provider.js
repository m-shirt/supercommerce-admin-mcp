// Abstract LLM provider interface
export class LLMProvider {
  constructor(config) {
    this.config = config;
  }

  async chat(messages, options = {}) {
    throw new Error('chat method must be implemented by provider');
  }

  async *streamChat(messages, options = {}) {
    throw new Error('streamChat method must be implemented by provider');
  }

  validateConfig() {
    throw new Error('validateConfig method must be implemented by provider');
  }

  static getDefaultModels() {
    throw new Error('getDefaultModels method must be implemented by provider');
  }
}

export const PROVIDER_TYPES = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic'
};