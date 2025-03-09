/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-array-index-key */
import { ChangeEvent, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChatContext, ChatResponse } from '../types/chat';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const TextChat = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContext, setSelectedContext] =
    useState<ChatContext>('default');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Close select when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsSelectOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: prompt.trim() };

    try {
      setMessages(prev => [...prev, userMessage]);
      setPrompt('');

      const response = await axios.post(
        '/api/get-answer',
        {
          messages: [...messages, userMessage].filter(msg => msg.content),
          context: selectedContext,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.text) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: response.data.text },
        ]);
      }
    } catch (error: any) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${
            error.response?.data?.error?.message || 'Failed to get response'
          }`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setPrompt(e.target.value);
  }

  const options = [
    { value: 'default', label: '✨ General Assistant' },
    { value: 'coding', label: '💻 Programming Mentor' },
    { value: 'business', label: '💼 Business Consultant' },
    { value: 'technical', label: '⚙️ Technical Expert' },
    { value: 'casual', label: '🎭 Casual Chat' },
  ];

  return (
    <div className="container">
      <h1>AI Chat Assistant</h1>

      {/* Custom Select */}
      <div className="mb-8">
        <label
          htmlFor="context-select"
          className="block text-sm font-semibold mb-3 text-gray-800 dark:text-gray-200"
        >
          Choose Conversation Context
        </label>
        <div className="relative" ref={selectRef}>
          <button
            type="button"
            onClick={() => setIsSelectOpen(!isSelectOpen)}
            className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-800 
              text-gray-800 dark:text-gray-100
              shadow-sm hover:border-primary/50 dark:hover:border-primary/50
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              text-left text-base"
          >
            {options.find(opt => opt.value === selectedContext)?.label}
            <span className="absolute right-6 top-1/2 -translate-y-1/2">▼</span>
          </button>

          {isSelectOpen && (
            <div
              className="absolute z-10 w-full mt-2 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-800 shadow-lg"
            >
              {options.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSelectedContext(option.value as ChatContext);
                    setIsSelectOpen(false);
                  }}
                  className={`w-full px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700
                    transition-colors duration-150
                    ${
                      option.value === selectedContext
                        ? 'bg-gray-50 dark:bg-gray-700'
                        : ''
                    }
                    ${
                      option.value === selectedContext
                        ? 'text-primary'
                        : 'text-gray-800 dark:text-gray-100'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="chat-container mb-4 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-lg max-h-[60vh] overflow-y-auto"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <div className="loading-spinner" />
          </div>
        )}
      </div>

      {/* Input Form */}
      <form className="our-form" onSubmit={handleSubmit}>
        <input
          className="prompt-field"
          type="text"
          onChange={handleChange}
          placeholder="Ask me anything..."
          value={prompt}
        />
        <button type="submit" className="prompt-button" disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </form>

      {/* Context Indicator */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
        Current Mode:{' '}
        {selectedContext.charAt(0).toUpperCase() + selectedContext.slice(1)}
      </div>
    </div>
  );
};

export default TextChat;
