import { useState, useEffect } from 'react';
import SettingsView from './SettingsView';
import { loadSettings, saveSettings, addMcpServer, removeMcpServer, toggleToolSelection } from '../../lib/storage/settings';

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [newServerUrl, setNewServerUrl] = useState(
    typeof window !== "undefined" ? `${window.location.origin}/api/mcp` : ""
  );
  const [newServerName, setNewServerName] = useState('Local MCP Server');
  const [loadingTools, setLoadingTools] = useState({});

  useEffect(() => {
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
    setLoading(false);
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      saveSettings(settings);
      setConnectionStatus('Settings saved successfully! Redirecting to chat...');
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }, 1500);
    } catch (error) {
      setConnectionStatus(`Failed to save settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus('Testing connection...');

    try {
      const response = await fetch('/api/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: settings.provider,
          apiKey: settings.apiKey,
          model: settings.customModel || settings.model,
          baseURL: settings.baseURL || undefined
        })
      });

      const result = await response.json();

      if (result.success) {
        setConnectionStatus('✅ Connection successful!');
      } else {
        setConnectionStatus(`❌ Connection failed: ${result.error}`);
      }
    } catch (error) {
      setConnectionStatus(`❌ Connection failed: ${error.message}`);
    } finally {
      setTestingConnection(false);
      setTimeout(() => setConnectionStatus(''), 5000);
    }
  };

  const addServer = async () => {
    if (!newServerUrl.trim()) return;

    try {
      const server = addMcpServer(newServerUrl, newServerName);
      setSettings(prev => ({
        ...prev,
        mcpServers: [...prev.mcpServers, server]
      }));
      setNewServerUrl('');
      setNewServerName('');

      // Load tools for the new server
      await loadServerTools(server.id, newServerUrl);
    } catch (error) {
      setConnectionStatus(`Failed to add server: ${error.message}`);
      setTimeout(() => setConnectionStatus(''), 3000);
    }
  };

  const removeServer = (serverId) => {
    try {
      removeMcpServer(serverId);
      setSettings(prev => ({
        ...prev,
        mcpServers: prev.mcpServers.filter(s => s.id !== serverId),
        selectedTools: prev.selectedTools.filter(t => !t.startsWith(serverId + ':'))
      }));
    } catch (error) {
      setConnectionStatus(`Failed to remove server: ${error.message}`);
      setTimeout(() => setConnectionStatus(''), 3000);
    }
  };

  const loadServerTools = async (serverId, serverUrl) => {
    setLoadingTools(prev => ({ ...prev, [serverId]: true }));

    try {
      // Use the existing RPC request logic from the home component
      const response = await rpcRequest(serverUrl, 'tools/list', {});
      const tools = response.tools || [];

      setSettings(prev => ({
        ...prev,
        mcpServers: prev.mcpServers.map(server =>
          server.id === serverId
            ? { ...server, tools, connected: true }
            : server
        )
      }));

      // Update the server in storage
      const currentSettings = loadSettings();
      const updatedSettings = {
        ...currentSettings,
        mcpServers: currentSettings.mcpServers.map(server =>
          server.id === serverId
            ? { ...server, tools, connected: true }
            : server
        )
      };
      saveSettings(updatedSettings);

    } catch (error) {
      setConnectionStatus(`Failed to load tools from ${serverUrl}: ${error.message}`);
      setSettings(prev => ({
        ...prev,
        mcpServers: prev.mcpServers.map(server =>
          server.id === serverId
            ? { ...server, connected: false }
            : server
        )
      }));
    } finally {
      setLoadingTools(prev => ({ ...prev, [serverId]: false }));
    }
  };

  // Copy RPC request function from home component
  function isCrossOrigin(url) {
    try {
      const target = new URL(url, window.location.origin);
      return target.origin !== window.location.origin;
    } catch {
      return false;
    }
  }

  async function rpcRequest(baseUrl, method, params = {}) {
    let targetUrl = baseUrl;
    if (typeof window !== "undefined" && isCrossOrigin(baseUrl)) {
      targetUrl = `/api/proxy?url=${encodeURIComponent(baseUrl)}`;
    }

    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        Accept: "application/json, text/event-stream",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now().toString(),
        method,
        params,
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const match = text.match(/data:\s*(\{.*\})/);
    if (!match) throw new Error("No JSON payload in SSE response");
    const json = JSON.parse(match[1]);
    if (json.error) throw new Error(json.error.message || "Unknown RPC error");
    return json.result;
  }

  const handleToolToggle = (serverId, toolName) => {
    const isSelected = toggleToolSelection(serverId, toolName);
    const toolId = `${serverId}:${toolName}`;

    setSettings(prev => ({
      ...prev,
      selectedTools: isSelected
        ? [...prev.selectedTools, toolId]
        : prev.selectedTools.filter(id => id !== toolId)
    }));
  };

  if (loading || !settings) {
    return <div>Loading settings...</div>;
  }

  return (
    <SettingsView
      settings={settings}
      onSettingChange={handleSettingChange}
      onSave={handleSave}
      onTestConnection={testConnection}
      saving={saving}
      testingConnection={testingConnection}
      connectionStatus={connectionStatus}
      newServerUrl={newServerUrl}
      setNewServerUrl={setNewServerUrl}
      newServerName={newServerName}
      setNewServerName={setNewServerName}
      onAddServer={addServer}
      onRemoveServer={removeServer}
      onLoadServerTools={loadServerTools}
      onToolToggle={handleToolToggle}
      loadingTools={loadingTools}
    />
  );
}