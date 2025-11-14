import React, { useState } from 'react';

import Button from '../ui/Button';
import Icon from '../ui/AppIcon';
import Chatbot from './Chatbot';

const ChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          variant="default"
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-[1003] hover:scale-110 transition-transform"
          aria-label="Open chatbot"
        >
          <Icon name="MessageCircle" size={24} />
        </Button>
      )}
      <Chatbot isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ChatbotButton;

