import { ChangeEvent, useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const TextChat = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    // Add user message immediately
    const userMessage: Message = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt(''); // Clear input after sending

    try {
      const response = await fetch('/api/get-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      const data = await response.json();

      // Add AI response to messages
      if (data.error) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: `Error: ${data.error}` },
        ]);
      } else if (data.text) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.text },
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: 'Unexpected response format' },
        ]);
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Failed to get response' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setPrompt(e.target.value);
  }

  return (
    <div className="container">
      <h1>AI Chat Assistant</h1>
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

      <form className="our-form" onSubmit={handleSubmit}>
        <input
          className="prompt-field"
          type="text"
          onChange={handleChange}
          placeholder="Ask me anything..."
          value={prompt}
        />
        <button type="submit" className="prompt-button" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default TextChat;
