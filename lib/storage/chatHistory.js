// Chat history storage utilities
const CHAT_HISTORY_KEY = 'mcp_chat_history';
const CURRENT_CHAT_KEY = 'mcp_current_chat';

export function generateChatId() {
  return Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
}

export function createNewChat(title = '') {
  const chatId = generateChatId();
  const chat = {
    id: chatId,
    title: title || 'New Chat',
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return chat;
}

export function loadChatHistory() {
  try {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!stored) return [];

    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load chat history:', error);
    return [];
  }
}

export function saveChatHistory(history) {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save chat history:', error);
    throw error;
  }
}

export function saveChat(chat) {
  const history = loadChatHistory();
  const existingIndex = history.findIndex(c => c.id === chat.id);

  const updatedChat = {
    ...chat,
    updatedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    history[existingIndex] = updatedChat;
  } else {
    history.unshift(updatedChat); // Add to beginning
  }

  saveChatHistory(history);
  return updatedChat;
}

export function deleteChat(chatId) {
  const history = loadChatHistory();
  const filteredHistory = history.filter(c => c.id !== chatId);
  saveChatHistory(filteredHistory);

  // Clear current chat if it's the one being deleted
  const currentChatId = getCurrentChatId();
  if (currentChatId === chatId) {
    clearCurrentChat();
  }
}

export function clearChatHistory() {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CHAT_HISTORY_KEY);
    localStorage.removeItem(CURRENT_CHAT_KEY);
  } catch (error) {
    console.error('Failed to clear chat history:', error);
  }
}

export function getCurrentChatId() {
  try {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(CURRENT_CHAT_KEY);
  } catch (error) {
    console.error('Failed to get current chat ID:', error);
    return null;
  }
}

export function setCurrentChatId(chatId) {
  try {
    if (typeof window === 'undefined') return;
    if (chatId) {
      localStorage.setItem(CURRENT_CHAT_KEY, chatId);
    } else {
      localStorage.removeItem(CURRENT_CHAT_KEY);
    }
  } catch (error) {
    console.error('Failed to set current chat ID:', error);
  }
}

export function clearCurrentChat() {
  setCurrentChatId(null);
}

export function loadCurrentChat() {
  const chatId = getCurrentChatId();
  if (!chatId) return null;

  const history = loadChatHistory();
  return history.find(c => c.id === chatId) || null;
}

export function addMessageToChat(chatId, message) {
  const history = loadChatHistory();
  const chat = history.find(c => c.id === chatId);

  if (!chat) {
    throw new Error('Chat not found');
  }

  const newMessage = {
    id: generateChatId(),
    ...message,
    timestamp: new Date().toISOString()
  };

  chat.messages.push(newMessage);

  // Update title if it's the first user message
  if (chat.messages.length <= 2 && message.role === 'user') {
    chat.title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
  }

  saveChat(chat);
  return newMessage;
}

export function updateMessage(chatId, messageId, updates) {
  const history = loadChatHistory();
  const chat = history.find(c => c.id === chatId);

  if (!chat) {
    throw new Error('Chat not found');
  }

  const messageIndex = chat.messages.findIndex(m => m.id === messageId);
  if (messageIndex >= 0) {
    chat.messages[messageIndex] = { ...chat.messages[messageIndex], ...updates };
    saveChat(chat);
  }
}

export function exportChat(chatId) {
  const history = loadChatHistory();
  const chat = history.find(c => c.id === chatId);

  if (!chat) {
    throw new Error('Chat not found');
  }

  return JSON.stringify(chat, null, 2);
}

export function exportAllChats() {
  const history = loadChatHistory();
  return JSON.stringify(history, null, 2);
}