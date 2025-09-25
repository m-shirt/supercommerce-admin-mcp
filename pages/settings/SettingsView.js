import React from 'react';
import { PROVIDER_TYPES } from '../../lib/llm/provider';
import { OpenAIProvider } from '../../lib/llm/openai';
import { AnthropicProvider } from '../../lib/llm/anthropic';
import styles from './Settings.module.css';

export default function SettingsView({
  settings = { provider: 'openai', mcpServers: [] },
  onSettingChange = () => {},
  onSave = () => {},
  onTestConnection = () => {},
  saving = false,
  testingConnection = false,
  connectionStatus = null,
  newServerUrl = '',
  setNewServerUrl = () => {},
  newServerName = '',
  setNewServerName = () => {},
  onAddServer = () => {},
  onRemoveServer = () => {},
  onLoadServerTools = () => {},
  onToolToggle = () => {},
  loadingTools = false
}) {
  // If being rendered as standalone page, redirect to main settings
  if (typeof window !== 'undefined' && !settings.apiKey) {
    window.location.href = '/settings';
    return null;
  }
  const getDefaultModels = () => {
    if (settings.provider === PROVIDER_TYPES.OPENAI) {
      return OpenAIProvider.getDefaultModels();
    } else if (settings.provider === PROVIDER_TYPES.ANTHROPIC) {
      return AnthropicProvider.getDefaultModels();
    }
    return [];
  };

  const defaultModels = getDefaultModels();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Settings</h1>
        <div className={styles.headerActions}>
          <a href="/" className={styles.cancelBtn}>
            Cancel
          </a>
          <button
            onClick={onTestConnection}
            disabled={testingConnection || !settings.apiKey || (!settings.model && !settings.customModel)}
            className={styles.testBtn}
          >
            {testingConnection ? 'Testing...' : 'Test Connection'}
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className={styles.saveBtn}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </header>

      {connectionStatus && (
        <div className={`${styles.status} ${
          connectionStatus.includes('✅') ? styles.success :
          connectionStatus.includes('❌') ? styles.error : styles.info
        }`}>
          {connectionStatus}
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>LLM Provider Configuration</h2>

          <div className={styles.field}>
            <label>Provider</label>
            <select
              value={settings.provider}
              onChange={(e) => onSettingChange('provider', e.target.value)}
            >
              <option value={PROVIDER_TYPES.OPENAI}>OpenAI</option>
              <option value={PROVIDER_TYPES.ANTHROPIC}>Anthropic</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Model</label>
            <select
              value={settings.model}
              onChange={(e) => onSettingChange('model', e.target.value)}
            >
              <option value="">Select a model</option>
              {defaultModels.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Custom Model Name (optional)</label>
            <input
              type="text"
              value={settings.customModel}
              onChange={(e) => onSettingChange('customModel', e.target.value)}
              placeholder="Enter custom model name"
            />
            <small className={styles.hint}>
              If specified, this will override the selected model above
            </small>
          </div>

          <div className={styles.field}>
            <label>API Key *</label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => onSettingChange('apiKey', e.target.value)}
              placeholder="Enter your API key"
            />
            <small className={styles.hint}>
              Your API key is stored locally and never sent to our servers
            </small>
          </div>

          <div className={styles.field}>
            <label>Base URL (optional)</label>
            <input
              type="url"
              value={settings.baseURL}
              onChange={(e) => onSettingChange('baseURL', e.target.value)}
              placeholder="https://api.openai.com/v1"
            />
            <small className={styles.hint}>
              Custom API endpoint URL (leave empty for default)
            </small>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Temperature</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => onSettingChange('temperature', parseFloat(e.target.value))}
              />
              <span>{settings.temperature}</span>
            </div>

            <div className={styles.field}>
              <label>Max Tokens</label>
              <input
                type="number"
                min="100"
                max="32000"
                value={settings.maxTokens}
                onChange={(e) => onSettingChange('maxTokens', parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>MCP Servers</h2>

          <div className={styles.addServer}>
            <div className={styles.field}>
              <label>Server URL</label>
              <input
                type="url"
                value={newServerUrl}
                onChange={(e) => setNewServerUrl(e.target.value)}
                placeholder={typeof window !== "undefined" ? `${window.location.origin}/api/mcp` : "http://localhost:3000/api/mcp"}
              />
            </div>
            <div className={styles.field}>
              <label>Name (optional)</label>
              <input
                type="text"
                value={newServerName}
                onChange={(e) => setNewServerName(e.target.value)}
                placeholder="Friendly server name"
              />
            </div>
            <button
              onClick={onAddServer}
              disabled={!newServerUrl.trim()}
              className={styles.addBtn}
            >
              Add Server
            </button>
          </div>

          <div className={styles.serverList}>
            {settings.mcpServers.length === 0 ? (
              <div className={styles.empty}>No MCP servers configured</div>
            ) : (
              settings.mcpServers.map(server => (
                <div key={server.id} className={styles.server}>
                  <div className={styles.serverHeader}>
                    <div className={styles.serverInfo}>
                      <div className={styles.serverName}>{server.name}</div>
                      <div className={styles.serverUrl}>{server.url}</div>
                      <div className={`${styles.serverStatus} ${
                        server.connected ? styles.connected : styles.disconnected
                      }`}>
                        {server.connected ? '● Connected' : '○ Disconnected'}
                      </div>
                    </div>
                    <div className={styles.serverActions}>
                      <button
                        onClick={() => onLoadServerTools(server.id, server.url)}
                        disabled={loadingTools[server.id]}
                        className={styles.loadBtn}
                      >
                        {loadingTools[server.id] ? 'Loading...' : 'Load Tools'}
                      </button>
                      <button
                        onClick={() => onRemoveServer(server.id)}
                        className={styles.removeBtn}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {server.tools && server.tools.length > 0 && (
                    <div className={styles.tools}>
                      <div className={styles.toolsHeader}>
                        <h4>Available Tools ({server.tools.length})</h4>
                        <div className={styles.toolsActions}>
                          <button
                            onClick={() => {
                              // Select all tools for this server
                              server.tools.forEach(tool => {
                                const toolId = `${server.id}:${tool.name}`;
                                const isSelected = settings.selectedTools.includes(toolId);
                                if (!isSelected) {
                                  onToolToggle(server.id, tool.name);
                                }
                              });
                            }}
                            className={styles.selectAllBtn}
                          >
                            Select All
                          </button>
                          <button
                            onClick={() => {
                              // Deselect all tools for this server
                              server.tools.forEach(tool => {
                                const toolId = `${server.id}:${tool.name}`;
                                const isSelected = settings.selectedTools.includes(toolId);
                                if (isSelected) {
                                  onToolToggle(server.id, tool.name);
                                }
                              });
                            }}
                            className={styles.deselectAllBtn}
                          >
                            Deselect All
                          </button>
                        </div>
                      </div>
                      <div className={styles.toolList}>
                        {server.tools.map(tool => {
                          const toolId = `${server.id}:${tool.name}`;
                          const isSelected = settings.selectedTools.includes(toolId);
                          return (
                            <div key={tool.name} className={styles.tool}>
                              <label className={styles.toolLabel}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => onToolToggle(server.id, tool.name)}
                                />
                                <div className={styles.toolInfo}>
                                  <div className={styles.toolName}>{tool.name}</div>
                                  <div className={styles.toolDesc}>{tool.description}</div>
                                </div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}