// Settings storage utilities
const SETTINGS_KEY = 'mcp_chat_settings';

export const DEFAULT_SETTINGS = {
  provider: 'openai', // 'openai' | 'anthropic'
  model: '',
  customModel: '',
  apiKey: '',
  baseURL: '',
  mcpServers: [],
  selectedTools: [],
  temperature: 0.7,
  maxTokens: 4000
};

export function loadSettings() {
  try {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;

    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(stored);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
  try {
    if (typeof window === 'undefined') return;

    const toSave = { ...DEFAULT_SETTINGS, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error;
  }
}

export function clearSettings() {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Failed to clear settings:', error);
  }
}

// MCP Server management
export function addMcpServer(url, name = '') {
  const settings = loadSettings();
  const serverExists = settings.mcpServers.find(s => s.url === url);

  if (serverExists) {
    throw new Error('MCP server already exists');
  }

  const newServer = {
    id: Date.now().toString(),
    url: url.trim(),
    name: name.trim() || url,
    connected: false,
    tools: []
  };

  const updatedSettings = {
    ...settings,
    mcpServers: [...settings.mcpServers, newServer]
  };

  saveSettings(updatedSettings);
  return newServer;
}

export function removeMcpServer(serverId) {
  const settings = loadSettings();
  const updatedSettings = {
    ...settings,
    mcpServers: settings.mcpServers.filter(s => s.id !== serverId),
    selectedTools: settings.selectedTools.filter(t => t.serverId !== serverId)
  };

  saveSettings(updatedSettings);
}

export function updateMcpServer(serverId, updates) {
  const settings = loadSettings();
  const updatedSettings = {
    ...settings,
    mcpServers: settings.mcpServers.map(server =>
      server.id === serverId ? { ...server, ...updates } : server
    )
  };

  saveSettings(updatedSettings);
}

export function toggleToolSelection(serverId, toolName) {
  const settings = loadSettings();
  const toolId = `${serverId}:${toolName}`;

  const isSelected = settings.selectedTools.includes(toolId);
  const updatedSelectedTools = isSelected
    ? settings.selectedTools.filter(id => id !== toolId)
    : [...settings.selectedTools, toolId];

  const updatedSettings = {
    ...settings,
    selectedTools: updatedSelectedTools
  };

  saveSettings(updatedSettings);
  return !isSelected;
}