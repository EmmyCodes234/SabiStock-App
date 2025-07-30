import React, { useState } from 'react';
import Icon from '../AppIcon';
import SabiBot from './SabiBot';

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-200 w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-modal flex items-center justify-center transition-all duration-300 ease-out hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Open SabiBot Assistant"
      >
        <Icon name="Bot" size={32} color="currentColor" />
      </button>

      <SabiBot isOpen={isOpen} onClose={toggleChat} />
    </>
  );
};

export default ChatBubble;