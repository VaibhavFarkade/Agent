
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message } from './types';
import Header from './components/Header';
import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';
import { initializeGemini, createChatSession, sendMessageToGemini } from './services/geminiService';
import { Chat } from '@google/genai';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [isApiReady, setIsApiReady] = useState<boolean>(false);
  
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const apiKey = process.env.API_KEY;

  useEffect(() => {
    if (!apiKey) {
      setError("API Key not configured. Please set the process.env.API_KEY environment variable for the agent to work.");
      setIsApiReady(false);
      return;
    }
    try {
      initializeGemini(apiKey);
      const session = createChatSession("You are a friendly and helpful WhatsApp assistant. Keep your responses concise and conversational.");
      setChatSession(session);
      setIsApiReady(true);
      setError(null);
       setMessages([{
        id: Date.now().toString(),
        text: "Hi there! How can I help you today?",
        sender: 'agent',
        timestamp: new Date()
      }]);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Failed to initialize AI Agent: ${e.message}`);
      } else {
        setError("An unknown error occurred during initialization.");
      }
      setIsApiReady(false);
    }
  }, [apiKey]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  },[]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !chatSession || !isApiReady) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const agentResponseText = await sendMessageToGemini(chatSession, userMessage.text);
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(), // Ensure unique ID
        text: agentResponseText,
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, agentMessage]);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Agent error: ${e.message}`);
         const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `Sorry, I encountered an error: ${e.message}`,
          sender: 'agent',
          timestamp: new Date(),
        };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      } else {
        setError("An unexpected error occurred while talking to the agent.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-200">
      <div className="chat-bg-pattern"></div>
      <Header />
      <div className="flex-grow overflow-y-auto p-4 space-y-2 chat-content">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {error && (
        <div className="p-2 bg-red-100 text-red-700 text-sm text-center chat-content">
          {error}
        </div>
      )}
      {isLoading && !error && (
         <div className="p-2 text-gray-600 text-sm text-center chat-content italic">Agent is typing...</div>
      )}
      <ChatInput
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        isApiReady={isApiReady}
      />
    </div>
  );
};

export default App;
