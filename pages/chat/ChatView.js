import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import styles from './Chat.module.css';

export default function ChatView({
  currentChat,
  chatHistory,
  sending,
  streamingMessage,
  error,
  sidebarOpen,
  settings,
  onSendMessage,
  onStopGeneration,
  onStartNewChat,
  onSelectChat,
  onDeleteChat,
  onToggleSidebar
}) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages, streamingMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || sending) return;

    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message, index) => {
    const isUser = message.role === 'user';
    const isAssistant = message.role === 'assistant';
    const isTool = message.role === 'tool';

    if (isTool) {
      let toolResult;
      try {
        toolResult = JSON.parse(message.content);
      } catch {
        toolResult = { raw: message.content };
      }

      return (
        <div key={index} className={styles.toolResult}>
          <div className={styles.toolHeader}>
            🔧 Tool Result
          </div>
          <pre className={styles.toolContent}>
            {JSON.stringify(toolResult, null, 2)}
          </pre>
        </div>
      );
    }

    return (
      <div key={index} className={`${styles.message} ${isUser ? styles.userMessage : styles.assistantMessage}`}>
        <div className={styles.messageContent}>
          {isUser ? (
            <div className={styles.textContent}>
              {message.content}
            </div>
          ) : (
            <div className={styles.markdownContent}>
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>

              {message.tool_calls && message.tool_calls.length > 0 && (
                <div className={styles.toolCalls}>
                  <div className={styles.toolCallsHeader}>🛠️ Using Tools:</div>
                  {message.tool_calls.map((toolCall, idx) => (
                    <div key={idx} className={styles.toolCall}>
                      <strong>{toolCall.function.name}</strong>
                      {toolCall.function.arguments && (
                        <pre>{(() => {
                          try {
                            return JSON.stringify(JSON.parse(toolCall.function.arguments), null, 2);
                          } catch (e) {
                            return toolCall.function.arguments;
                          }
                        })()}</pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className={styles.messageActions}>
            <button
              onClick={() => copyMessage(message.content)}
              className={styles.actionBtn}
              title="Copy message"
            >
              📋
            </button>
            {message.timestamp && (
              <span className={styles.timestamp}>
                {formatTimestamp(message.timestamp)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>Chat History</h2>
          <button onClick={onStartNewChat} className={styles.newChatBtn}>
            + New Chat
          </button>
        </div>

        <div className={styles.chatList}>
          {chatHistory.length === 0 ? (
            <div className={styles.empty}>No conversations yet</div>
          ) : (
            chatHistory.map(chat => (
              <div
                key={chat.id}
                className={`${styles.chatItem} ${currentChat?.id === chat.id ? styles.active : ''}`}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className={styles.chatTitle}>{chat.title}</div>
                <div className={styles.chatMeta}>
                  {chat.messages.length} messages • {new Date(chat.updatedAt).toLocaleDateString()}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  className={styles.deleteChatBtn}
                  title="Delete chat"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={styles.main}>
        <div className={styles.header}>
          <button
            onClick={onToggleSidebar}
            className={styles.toggleSidebarBtn}
          >
            ☰
          </button>
          <h1>{currentChat?.title || 'Chat'}</h1>
          <div className={styles.headerActions}>
            <a href="/settings" className={styles.settingsBtn}>
              ⚙️ Settings
            </a>
            <a href="/inspector" className={styles.inspectorBtn}>
              🔍 Inspector
            </a>
          </div>
        </div>

        {!settings?.apiKey ? (
          <div className={styles.setupPrompt}>
            <div className={styles.setupContent}>
              <h3>Welcome to MCP Chat!</h3>
              <p>To get started, you need to configure your LLM provider settings.</p>
              <a href="/settings" className={styles.setupBtn}>
                ⚙️ Configure Settings
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.messages}>
              {currentChat?.messages?.length === 0 ? (
                <div className={styles.welcomeMessage}>
                  <h3>Start a conversation</h3>
                  <p>Ask me anything! I can use the MCP tools you've configured to help you.</p>
                  {settings.selectedTools?.length > 0 && (
                    <div className={styles.availableTools}>
                      <strong>Available tools:</strong> {settings.selectedTools.length}
                    </div>
                  )}
                </div>
              ) : (
                currentChat.messages.map((message, index) => renderMessage(message, index))
              )}

              {streamingMessage && (
                <div className={`${styles.message} ${styles.assistantMessage} ${styles.streaming}`}>
                  <div className={styles.messageContent}>
                    <div className={styles.markdownContent}>
                      <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {streamingMessage}
                      </ReactMarkdown>
                    </div>
                    <div className={styles.streamingIndicator}>●●●</div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {error && (
              <div className={styles.error}>
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.inputForm}>
              <div className={styles.inputContainer}>
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={sending ? "Sending..." : "Type your message..."}
                  disabled={sending}
                  rows={1}
                  className={styles.textarea}
                />
                <div className={styles.inputActions}>
                  {sending ? (
                    <button
                      type="button"
                      onClick={onStopGeneration}
                      className={styles.stopBtn}
                    >
                      ⏹️
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!inputValue.trim()}
                      className={styles.sendBtn}
                    >
                      ➤
                    </button>
                  )}
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}