# MCP Client Chat Interface Implementation Plan

## 🎯 Project Goal
Transform the MCP tool inspector home page into a full-featured chat interface with LLM integration and MCP tool support.

## 📋 Current State Analysis
- **Framework**: Next.js with React
- **Current Home**: MCP tool inspector with sidebar for tools, main panel for tool execution, connection panel
- **Existing Features**: Tool discovery, parameter forms, JSON response viewer, MCP server connection via HTTP/SSE
- **Dependencies Added**: `openai`, `@anthropic-ai/sdk`, `ai`, `react-markdown`, `react-syntax-highlighter`

## 🏗️ Architecture Design

### Core Components Structure
```
/pages
  /index.js → Chat interface (new default)
  /inspector.js → Current MCP tool inspector (moved)
  /chat
    /Chat.js → Main chat controller
    /ChatView.js → Chat UI component
    /ChatHistory.js → Session management
  /settings
    /Settings.js → LLM provider configuration
    /SettingsView.js → Settings UI
/lib
  /llm
    /provider.js → Abstract LLM provider ✅
    /openai.js → OpenAI SDK integration ✅
    /anthropic.js → Anthropic SDK integration ✅
  /storage
    /chatHistory.js → Local chat persistence
    /settings.js → Settings persistence
```

## ✨ Key Features

### 1. LLM Provider Integration
- **OpenAI SDK**: Support for GPT-4o, GPT-4o Mini, GPT-4 Turbo, GPT-3.5 Turbo
- **Anthropic SDK**: Support for Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus, etc.
- **Custom Models**: Allow users to enter custom model names
- **Configurable Base URLs**: Support for custom API endpoints
- **User-provided API Keys**: Users enter their own API keys (not built-in)

### 2. Settings Management
- Provider selection (OpenAI/Anthropic)
- Model selection dropdown with custom model input
- API key input with masking for security
- Base URL configuration for custom endpoints
- MCP server connection settings (manual URL addition like current inspector)
- Tool selection interface for choosing which MCP tools to make available

### 3. Chat Interface
- Message bubbles (user/assistant with distinct styling)
- Streaming response support for real-time conversation
- Tool call visualization when LLM uses MCP tools
- Markdown rendering for formatted responses
- Code syntax highlighting
- Message actions (copy, regenerate, delete)
- Input field with send button and keyboard shortcuts

### 4. Session Management
- New chat functionality to start fresh conversations
- Chat history sidebar showing previous conversations
- Session persistence using local storage
- Export/import conversations functionality
- Delete individual chats or clear all history

### 5. MCP Integration
- **Manual Tool Loading**: Users manually add MCP server URLs (like current inspector)
- **Tool Selection**: Interface to select which tools are available to the LLM
- **Tool Call Execution**: Execute MCP tools when called by LLM
- **Tool Response Display**: Show tool results in chat
- **Real-time Tool Availability**: Update tool status and availability

## 🔧 Technical Implementation

### Security Considerations
- **Client-side API Keys**: Users provide their own keys, stored securely in browser
- **Local Storage Encryption**: Encrypt sensitive data in local storage
- **CORS Handling**: Maintain existing CORS support for cross-origin MCP servers
- **API Key Masking**: Hide API keys in UI after entry

### State Management
- React Context for global chat state
- Local storage for settings and chat history persistence
- Real-time updates for MCP server/tool availability
- Error handling and connection status management

### UI Framework
- Keep existing CSS modules approach for consistency
- Responsive design supporting mobile and desktop
- Dark/light theme support (optional)
- Accessible design with keyboard navigation

## 🚀 Implementation Steps

### Phase 1: Core Infrastructure ✅
- [x] Create new branch 'mcp-client-chat'
- [x] Add required dependencies
- [x] Create LLM provider abstractions
- [x] Implement OpenAI provider
- [x] Implement Anthropic provider

### Phase 2: Settings & Storage ✅
- [x] Create settings storage utilities
- [x] Implement settings page with provider configuration
- [x] Add MCP server management interface
- [x] Create tool selection interface

### Phase 3: Chat Interface ✅
- [x] Create main chat controller and view
- [x] Implement message display with markdown support
- [x] Add streaming response handling
- [x] Create input field with send functionality

### Phase 4: MCP Integration ✅
- [x] Integrate MCP tool loading with chat
- [x] Implement tool call execution in conversations
- [x] Add tool selection and management UI
- [x] Display tool results in chat interface

### Phase 5: Session Management ✅
- [x] Implement chat history storage
- [x] Create sidebar with chat history
- [x] Add new chat and session management
- [x] Export/import functionality (basic)

### Phase 6: Final Integration ✅
- [x] Move existing inspector to /inspector route
- [x] Set chat as new default home page
- [x] Add navigation between chat and inspector
- [x] Testing and bug fixes

## 🎨 User Experience Flow

1. **First Visit**: User sees chat interface, prompted to configure settings
2. **Settings Setup**: User selects provider, enters API key, adds MCP servers, selects tools
3. **Chat Experience**: User starts conversation, LLM can use selected MCP tools automatically
4. **Tool Usage**: When LLM calls tools, execution happens transparently with results shown
5. **History Management**: Users can start new chats, review history, export conversations
6. **Inspector Access**: Button/link to access original MCP tool inspector

## 🔍 Quality Assurance

### Testing Strategy
- Test both OpenAI and Anthropic providers
- Validate tool calls work correctly in conversations
- Test settings persistence and encryption
- Verify responsive design across devices
- Test error handling for invalid API keys/servers

### Performance Considerations
- Lazy loading of chat history
- Efficient message rendering for long conversations
- Streaming response handling without blocking UI
- Debounced auto-save for drafts

This plan provides a comprehensive roadmap for transforming the MCP inspector into a modern chat interface while preserving all existing functionality and adding powerful new conversational AI capabilities.