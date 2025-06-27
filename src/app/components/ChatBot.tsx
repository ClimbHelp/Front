'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChatbot } from '../contexts/ChatbotContext';
import styled from 'styled-components';

const ChatBotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const ChatButton = styled.button<{ $isOpen: boolean }>`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.$isOpen ? '#ff4757' : '#2ed573'};
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const ChatPopup = styled.div`
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 380px;
  height: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 768px) {
    width: calc(100vw - 40px);
    height: calc(100vh - 120px);
    right: 20px;
    left: 20px;
    bottom: 20px;
  }
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const HeaderButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f8f9fa;
  scroll-behavior: smooth;

  /* Amélioration du scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const Message = styled.div<{ $isUser: boolean }>`
  margin-bottom: 16px;
  display: flex;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 18px;
  background: ${props => props.$isUser ? '#667eea' : 'white'};
  color: ${props => props.$isUser ? 'white' : '#333'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;

const MessageTime = styled.div<{ $isUser: boolean }>`
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  text-align: ${props => props.$isUser ? 'right' : 'left'};
`;

const InputContainer = styled.div`
  padding: 16px;
  background: white;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 8px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    border-color: #667eea;
  }
`;

const SendButton = styled.button<{ $disabled: boolean }>`
  padding: 10px 16px;
  background: ${props => props.$disabled ? '#ccc' : '#667eea'};
  color: white;
  border: none;
  border-radius: 20px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background: #5a6fd8;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #666;
  font-style: italic;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
`;

const ChatBot: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { isOpen, messages, isLoading, conversationUid, openChatbot, closeChatbot, sendMessage, clearMessages } = useChatbot();
  const [inputValue, setInputValue] = useState('');
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Gérer les messages non lus
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      setHasUnreadMessages(true);
    } else if (isOpen) {
      setHasUnreadMessages(false);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    await sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewConversation = () => {
    clearMessages();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Ne pas afficher le chatbot si l'utilisateur n'est pas connecté
  if (!isAuthenticated) {
    return null;
  }

  return (
    <ChatBotContainer>
      <ChatButton 
        $isOpen={isOpen} 
        onClick={isOpen ? closeChatbot : openChatbot}
        aria-label={isOpen ? 'Fermer le chatbot' : 'Ouvrir le chatbot'}
      >
        {isOpen ? '✕' : '💬'}
        {hasUnreadMessages && !isOpen && (
          <NotificationBadge>
            {messages.length > 9 ? '9+' : messages.length}
          </NotificationBadge>
        )}
      </ChatButton>

      {isOpen && (
        <ChatPopup>
          <ChatHeader>
            <ChatTitle>
              Assistant ClimbHelp
              {conversationUid && (
                <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                  Session active
                </span>
              )}
            </ChatTitle>
            <HeaderButtons>
              {messages.length > 0 && (
                <HeaderButton 
                  onClick={handleNewConversation}
                  aria-label="Nouvelle conversation"
                  title="Nouvelle conversation"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Nouvelle
                </HeaderButton>
              )}
              <CloseButton onClick={closeChatbot} aria-label="Fermer">
                ✕
              </CloseButton>
            </HeaderButtons>
          </ChatHeader>

          <MessagesContainer>
            {messages.length === 0 ? (
              <WelcomeMessage>
                👋 Bonjour ! Je suis votre assistant ClimbHelp. 
                Comment puis-je vous aider aujourd'hui ?
              </WelcomeMessage>
            ) : (
              messages.map((message) => (
                <Message key={message.id} $isUser={message.isUser}>
                  <div>
                    <MessageBubble $isUser={message.isUser}>
                      {message.content}
                    </MessageBubble>
                    <MessageTime $isUser={message.isUser}>
                      {formatTime(message.timestamp)}
                    </MessageTime>
                  </div>
                </Message>
              ))
            )}
            
            {isLoading && (
              <LoadingIndicator>
                L'assistant réfléchit...
              </LoadingIndicator>
            )}
            
            <div ref={messagesEndRef} />
          </MessagesContainer>

          <InputContainer>
            <MessageInput
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              disabled={isLoading}
            />
            <SendButton 
              onClick={handleSendMessage}
              $disabled={!inputValue.trim() || isLoading}
            >
              Envoyer
            </SendButton>
          </InputContainer>
        </ChatPopup>
      )}
    </ChatBotContainer>
  );
};

export default ChatBot; 