import React, { useState, useRef, useEffect } from 'react';

import Icon from '../ui/AppIcon';
import Button from '../ui/Button';

interface IMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface IChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatbot: React.FC<IChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<IMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your LoanTracker assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Knowledge base for common questions
  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase().trim();

    // Greetings
    if (message.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      return 'Hello! How can I assist you with your loan-related queries today?';
    }

    // Personal Loan Questions
    if (message.match(/personal loan|add personal loan|create personal loan/)) {
      return 'To add a personal loan, click on the "Personal Loans" card on the dashboard or navigate to Personal Loans page and click "Add Personal Loan". You\'ll need to provide borrower details, loan amount, interest rate, tenure, and upload Aadhaar and PAN cards.';
    }

    if (message.match(/personal loan documents|what documents|required documents|documents needed/)) {
      return 'For a personal loan application, you need to provide:\n• Aadhaar Card (PDF, JPG, or PNG)\n• PAN Card (PDF, JPG, or PNG)\n• Borrower details (Name, Phone, Email, Address)\n• Loan details (Amount, Interest Rate, Tenure)\n\nAll documents should be clear and valid. Maximum file size is 10MB per document.';
    }

    if (message.match(/personal loan eligibility|eligibility criteria|who can apply/)) {
      return 'Personal loan eligibility typically includes:\n• Valid Aadhaar Card\n• Valid PAN Card\n• Minimum age: 21 years\n• Maximum age: 65 years\n• Regular source of income\n• Good credit history\n\nSpecific eligibility criteria may vary based on the lender\'s policies.';
    }

    if (message.match(/loan amount|how much|maximum loan|minimum loan/)) {
      return 'The loan amount depends on various factors including your income, credit score, and repayment capacity. In this application, you can apply for any amount starting from ₹10,000. The maximum amount depends on your eligibility and the lender\'s policies.';
    }

    if (message.match(/interest rate|rate of interest|loan interest/)) {
      return 'Interest rates for personal loans typically range from 10% to 30% per annum, depending on various factors like credit score, income, loan amount, and tenure. You can specify the interest rate when creating a loan application.';
    }

    if (message.match(/loan tenure|tenure|repayment period|how long|duration/)) {
      return 'Personal loan tenure can range from 1 month to 5 years (60 months). You can choose the tenure based on your repayment capacity. Longer tenures result in lower EMIs but higher total interest, while shorter tenures have higher EMIs but lower total interest.';
    }

    if (message.match(/emi|monthly payment|installment|repayment/)) {
      return 'EMI (Equated Monthly Installment) is the fixed amount you pay each month towards your loan. It includes both principal and interest. The EMI amount depends on the loan amount, interest rate, and tenure. You can use the EMI calculator to estimate your monthly payments.';
    }

    // OTP Questions
    if (message.match(/otp|verification|phone verification|verify phone/)) {
      return 'OTP (One-Time Password) verification is required to verify the borrower\'s phone number. After entering the phone number, click "Send OTP" to receive a 6-digit code. Enter the code to verify your phone number. For testing purposes, any 6-digit code will be accepted.';
    }

    // PDF Questions
    if (message.match(/pdf|download|generate pdf|loan document/)) {
      return 'After successfully submitting a personal loan application, a PDF document is automatically generated and downloaded. The PDF includes:\n• Loan Application Summary\n• Borrower Details\n• Terms and Conditions\n• Signature sections\n\nYou can find the downloaded PDF in your Downloads folder.';
    }

    // Dashboard Questions
    if (message.match(/dashboard|home|main page|overview/)) {
      return 'The dashboard provides an overview of all your loans, including:\n• Total loans and amounts\n• Loan distribution by type (Personal, Vehicle, Business, Medical)\n• Recent loans\n• Notifications\n• Quick actions\n\nYou can access different sections from the dashboard.';
    }

    // Login Questions
    if (message.match(/login|sign in|credentials|password/)) {
      return 'To login, use these demo credentials:\n• Loan Officer: officer@loantracker.com / officer123\n• Borrower: borrower@example.com / borrower123\n\nAfter login, you\'ll be redirected to the dashboard.';
    }

    // Navigation Questions
    if (message.match(/how to|where|navigate|go to|access/)) {
      return 'You can navigate through the application using:\n• Dashboard cards to access different loan types\n• Navigation menu in the header\n• Breadcrumbs at the top of pages\n• "Add Loan" buttons on list pages\n\nClick on the Personal Loans card on the dashboard to view all personal loans.';
    }

    // Features Questions
    if (message.match(/features|what can|capabilities|functionality/)) {
      return 'LoanTracker offers the following features:\n• Create and manage personal loans\n• View loan details and status\n• Generate PDF loan documents\n• Track loan applications\n• Document workflow management\n• Profile and activity tracking\n• Search and filter loans\n\nIs there a specific feature you\'d like to know more about?';
    }

    // Help/Support
    if (message.match(/help|support|assistance|problem|issue|error/)) {
      return 'I\'m here to help! You can ask me about:\n• How to create a personal loan\n• Required documents\n• Loan eligibility\n• Interest rates and tenure\n• EMI calculations\n• PDF generation\n• Navigation and features\n\nWhat would you like to know?';
    }

    // Default responses
    if (message.match(/thank|thanks|appreciate/)) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    }

    if (message.match(/bye|goodbye|see you|exit/)) {
      return 'Thank you for using LoanTracker! Have a great day. If you need any assistance, feel free to ask anytime.';
    }

    // Fallback response
    return 'I understand you\'re asking about: "' + userMessage + '". Could you please rephrase your question? I can help you with:\n• Personal loan applications\n• Required documents\n• Loan eligibility\n• Interest rates and tenure\n• EMI calculations\n• Navigation and features\n• General loan information';
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: IMessage = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: IMessage = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'How to add a personal loan?',
    'What documents are required?',
    'What is the interest rate?',
    'What is the loan tenure?'
  ];

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    // Small delay to ensure input is set
    setTimeout(() => {
      const userMessage: IMessage = {
        id: Date.now().toString(),
        text: question,
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setIsTyping(true);

      setTimeout(() => {
        const botResponse: IMessage = {
          id: (Date.now() + 1).toString(),
          text: getBotResponse(question),
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 800);
    }, 50);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[1003] w-96 h-[500px] bg-card border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Icon name="MessageCircle" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">LoanTracker Assistant</h3>
            <p className="text-xs text-primary-foreground/80">Online</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
        >
          <Icon name="X" size={18} />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background scrollbar-hide">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="text-xs px-3 py-1 bg-background border border-border rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-background">
        <div className="flex items-center gap-2 w-full">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            size="icon"
            className="h-10 w-10 flex-shrink-0"
          >
            <Icon name="Send" size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

