
import React from 'react';

interface ChatInputProps {
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  isApiReady: boolean;
}

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);


const ChatInput: React.FC<ChatInputProps> = ({
  currentMessage,
  setCurrentMessage,
  onSendMessage,
  isLoading,
  isApiReady
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMessage.trim() && !isLoading && isApiReady) {
      onSendMessage();
    }
  };

  return (
    <div className="bg-gray-100 p-3 border-t border-gray-300 sticky bottom-0 z-20">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={currentMessage}
          onChange={handleInputChange}
          placeholder={isApiReady ? "Type a message..." : "API not ready"}
          className="flex-grow p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow"
          disabled={isLoading || !isApiReady}
        />
        <button
          type="submit"
          disabled={isLoading || !currentMessage.trim() || !isApiReady}
          className="p-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            <SendIcon className="w-5 h-5"/>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
