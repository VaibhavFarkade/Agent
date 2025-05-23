
import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const bubbleAlignment = isUser ? 'self-end' : 'self-start';
  const bubbleColor = isUser ? 'bg-green-200 text-gray-800' : 'bg-white text-gray-800';
  const textAlign = isUser ? 'text-right' : 'text-left';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-2`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 rounded-xl shadow ${bubbleColor} ${bubbleAlignment}`}>
        <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
      </div>
      <span className={`text-xs text-gray-500 mt-1 px-1 ${textAlign}`}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};

export default MessageBubble;
