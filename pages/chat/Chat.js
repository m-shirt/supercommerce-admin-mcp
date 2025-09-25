import { useState, useEffect, useRef } from 'react';
import ChatView from './ChatView';
import { loadSettings } from '../../lib/storage/settings';
import {
  loadChatHistory,
  createNewChat,
  saveChat,
  deleteChat,
  addMessageToChat,
  getCurrentChatId,
  setCurrentChatId,
  loadCurrentChat
} from '../../lib/storage/chatHistory';

export default function Chat() {
  const [currentChat, setCurrentChat] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth > 768 : true);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    const loadedSettings = loadSettings();
    const loadedHistory = loadChatHistory();
    const currentChatData = loadCurrentChat();

    setSettings(loadedSettings);
    setChatHistory(loadedHistory);
    setCurrentChat(currentChatData);
    setLoading(false);

    // If no current chat and no history, create a new chat
    if (!currentChatData && loadedHistory.length === 0) {
      startNewChat();
    }
  }, []);

  // Reload settings when component becomes visible (for when user returns from settings)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const updatedSettings = loadSettings();
        setSettings(updatedSettings);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);





  const startNewChat = () => {
    const newChat = createNewChat();
    const savedChat = saveChat(newChat);
    setCurrentChat(savedChat);
    setCurrentChatId(savedChat.id);
    setChatHistory(prev => [savedChat, ...prev]);
    setSidebarOpen(false);
  };

  const selectChat = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
      setCurrentChatId(chatId);
      setSidebarOpen(false);
    }
  };

  const handleDeleteChat = (chatId) => {
    deleteChat(chatId);
    setChatHistory(prev => prev.filter(c => c.id !== chatId));

    if (currentChat?.id === chatId) {
      const remainingChats = chatHistory.filter(c => c.id !== chatId);
      if (remainingChats.length > 0) {
        selectChat(remainingChats[0].id);
      } else {
        startNewChat();
      }
    }
  };

  const validateSettings = () => {
    if (!settings || !settings.apiKey) {
      throw new Error('Please configure your API key in settings first');
    }

    const modelToUse = settings.customModel || settings.model;
    if (!modelToUse) {
      throw new Error('Please select a model or enter a custom model in settings first');
    }

    return true;
  };

  const getSelectedMcpTools = () => {
    if (!settings.selectedTools || settings.selectedTools.length === 0) {
      return [];
    }

    const tools = [];
    settings.selectedTools.forEach(toolId => {
      const [serverId, toolName] = toolId.split(':');
      const server = settings.mcpServers.find(s => s.id === serverId);
      if (server && server.tools) {
        const tool = server.tools.find(t => t.name === toolName);
        if (tool) {
          tools.push({
            type: 'function',
            function: {
              name: tool.name,
              description: tool.description,
              parameters: tool.inputSchema
            },
            serverId: serverId,
            serverUrl: server.url
          });
        }
      }
    });

    return tools;
  };

  const executeToolCall = async (toolCall, serverUrl) => {
    try {
      // Use the same RPC request logic from the home component
      const result = await rpcRequest(serverUrl, 'tools/call', {
        name: toolCall.function.name,
        arguments: JSON.parse(toolCall.function.arguments || '{}'),
        _meta: { progressToken: 20 },
      });

      return {
        tool_call_id: toolCall.id,
        role: 'tool',
        content: JSON.stringify(result)
      };
    } catch (error) {
      return {
        tool_call_id: toolCall.id,
        role: 'tool',
        content: JSON.stringify({ error: error.message })
      };
    }
  };

  // Copy RPC request functions from home component
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

  const sendMessage = async (content) => {
    if (!currentChat || !content.trim() || sending) return;

    setError('');
    setSending(true);
    setStreamingMessage('');

    try {
      validateSettings();
      const tools = getSelectedMcpTools();

      // Add user message
      const userMessage = addMessageToChat(currentChat.id, {
        role: 'user',
        content: content.trim()
      });

      const updatedChat = { ...currentChat, messages: [...currentChat.messages, userMessage] };
      setCurrentChat(updatedChat);
      setChatHistory(prev => prev.map(c => c.id === currentChat.id ? updatedChat : c));

      // Prepare messages for API
      const messages = updatedChat.messages.map(({ id, timestamp, ...msg }) => msg);

      // Create abort controller
      abortControllerRef.current = new AbortController();

      let assistantContent = '';
      let toolCalls = [];

      // Make non-streaming API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: settings.provider,
          apiKey: settings.apiKey,
          model: settings.customModel || settings.model,
          baseURL: settings.baseURL || undefined,
          messages,
          tools: tools.length > 0 ? tools : undefined,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens,
          stream: false
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Chat request failed');
      }

      const result = await response.json();
      assistantContent = result.content || '';
      toolCalls = result.tool_calls || [];

      setStreamingMessage(assistantContent);

      if (!abortControllerRef.current.signal.aborted) {
        // Add assistant message
        const assistantMessage = addMessageToChat(currentChat.id, {
          role: 'assistant',
          content: assistantContent,
          tool_calls: toolCalls.length > 0 ? toolCalls : undefined
        });

        let finalChat = { ...updatedChat, messages: [...updatedChat.messages, assistantMessage] };

        // Execute tool calls if any
        if (toolCalls.length > 0) {
          const toolResults = [];
          for (const toolCall of toolCalls) {
            const tool = tools.find(t => t.function.name === toolCall.function.name);
            if (tool) {
              const result = await executeToolCall(toolCall, tool.serverUrl);
              toolResults.push(result);

              const toolMessage = addMessageToChat(currentChat.id, result);
              finalChat = { ...finalChat, messages: [...finalChat.messages, toolMessage] };
            }
          }

          // Get follow-up response after tool execution
          const followUpMessages = finalChat.messages.map(({ id, timestamp, ...msg }) => msg);

          const followUpResponse = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              provider: settings.provider,
              apiKey: settings.apiKey,
              model: settings.customModel || settings.model,
              baseURL: settings.baseURL || undefined,
              messages: followUpMessages,
              temperature: settings.temperature,
              maxTokens: settings.maxTokens,
              stream: false
            }),
            signal: abortControllerRef.current.signal
          });

          if (followUpResponse.ok) {
            const followUpResult = await followUpResponse.json();
            const followUpContent = followUpResult.content || '';

            setStreamingMessage(followUpContent);

            if (!abortControllerRef.current.signal.aborted && followUpContent) {
              const followUpMessage = addMessageToChat(currentChat.id, {
                role: 'assistant',
                content: followUpContent
              });

              finalChat = { ...finalChat, messages: [...finalChat.messages, followUpMessage] };
            }
          }
        }

        setCurrentChat(finalChat);
        setChatHistory(prev => prev.map(c => c.id === currentChat.id ? finalChat : c));
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message);
    } finally {
      setSending(false);
      setStreamingMessage('');
      abortControllerRef.current = null;
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  if (loading) {
    return <div>Loading chat...</div>;
  }

  return (
    <ChatView
      currentChat={currentChat}
      chatHistory={chatHistory}
      sending={sending}
      streamingMessage={streamingMessage}
      error={error}
      sidebarOpen={sidebarOpen}
      settings={settings}
      onSendMessage={sendMessage}
      onStopGeneration={stopGeneration}
      onStartNewChat={startNewChat}
      onSelectChat={selectChat}
      onDeleteChat={handleDeleteChat}
      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
    />
  );
}