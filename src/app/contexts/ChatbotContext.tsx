'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotContextType {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  conversationUid: string | null;
  openChatbot: () => void;
  closeChatbot: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  loadConversationHistory: () => Promise<void>;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export { ChatbotContext };

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const { userInfo } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationUid, setConversationUid] = useState<string | null>(null);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);

  // Restaurer l'état du chatbot depuis localStorage au chargement
  useEffect(() => {
    const savedIsOpen = localStorage.getItem('chatbotIsOpen');
    const savedConversationUid = localStorage.getItem('chatbotConversationUid');
    
    if (savedIsOpen === 'true') {
      setIsOpen(true);
    }
    
    if (savedConversationUid) {
      setConversationUid(savedConversationUid);
    }
  }, []);

  // Sauvegarder l'état dans localStorage quand il change
  useEffect(() => {
    localStorage.setItem('chatbotIsOpen', isOpen.toString());
  }, [isOpen]);

  useEffect(() => {
    if (conversationUid) {
      localStorage.setItem('chatbotConversationUid', conversationUid);
    } else {
      localStorage.removeItem('chatbotConversationUid');
    }
  }, [conversationUid]);

  // Charger l'historique des conversations depuis Supabase
  const loadConversationHistory = async () => {
    if (!userInfo?.id || !conversationUid) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BDD_SERVICE_URL}/api/chat-conversations/session/${conversationUid}`);
      if (response.ok) {
        const data = await response.json();
        const conversationMessages: Message[] = [];
        
        data.forEach((exchange: any) => {
          conversationMessages.push({
            id: `user-${exchange.id}`,
            content: exchange.message,
            isUser: true,
            timestamp: new Date(exchange.created_at)
          });
          conversationMessages.push({
            id: `bot-${exchange.id}`,
            content: exchange.response,
            isUser: false,
            timestamp: new Date(exchange.created_at)
          });
        });
        
        setMessages(conversationMessages);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    }
  };

  // Charger l'historique quand l'utilisateur se connecte et qu'il y a un conversationUid
  useEffect(() => {
    if (userInfo?.id && conversationUid && messages.length === 0 && !hasLoadedHistory) {
      loadConversationHistory();
      setHasLoadedHistory(true);
    }
      }, [userInfo?.id, conversationUid]);

  // Réinitialiser hasLoadedHistory quand l'utilisateur change
  useEffect(() => {
    setHasLoadedHistory(false);
      }, [userInfo?.id]);

  const openChatbot = () => {
    setIsOpen(true);
  };

  const closeChatbot = () => {
    setIsOpen(false);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !userInfo?.id) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Préparer l'historique pour le service AI
      const conversationHistory = messages
        .filter(msg => !msg.isUser) // Prendre seulement les réponses du bot
        .map((msg, index) => {
          const userMsg = messages.find(m => m.isUser && messages.indexOf(m) < index);
          return {
            message: userMsg?.content || '',
            response: msg.content
          };
        })
        .filter(exchange => exchange.message && exchange.response);

      // Envoyer le message au service AI avec l'historique
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: content.trim(),
          conversationHistory 
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      const data = await response.json();
      
      // S'assurer que la réponse est une chaîne de caractères
      let responseContent = 'Désolé, je n\'ai pas pu générer de réponse.';
      
      if (data.response) {
        if (typeof data.response === 'string') {
          responseContent = data.response;
        } else if (typeof data.response === 'object') {
          // Si c'est un objet, essayer d'extraire le contenu
          responseContent = data.response.content || data.response.text || JSON.stringify(data.response);
        } else {
          responseContent = String(data.response);
        }
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Sauvegarder l'échange dans Supabase
      await saveConversationToSupabase(content.trim(), responseContent);

    } catch (error) {
      console.error('Erreur chatbot:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConversationToSupabase = async (message: string, botResponse: string) => {
    if (!userInfo?.id) return;

    try {
      // Générer un nouveau conversationUid si nécessaire
      let currentConversationUid = conversationUid;
      if (!currentConversationUid) {
        currentConversationUid = crypto.randomUUID();
        setConversationUid(currentConversationUid);
      }

      const supabaseResponse = await fetch(`${process.env.NEXT_PUBLIC_BDD_SERVICE_URL}/api/chat-conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userInfo.id,
          message: message,
          response: botResponse,
          conversation_uid: currentConversationUid
        }),
      });

      if (!supabaseResponse.ok) {
        console.error('Erreur lors de la sauvegarde de la conversation');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la conversation:', error);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setConversationUid(null);
    setHasLoadedHistory(false);
  };

  const value = {
    isOpen,
    messages,
    isLoading,
    conversationUid,
    openChatbot,
    closeChatbot,
    sendMessage,
    clearMessages,
    loadConversationHistory
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
}; 