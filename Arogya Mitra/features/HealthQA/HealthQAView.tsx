
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { generateText, GenerateTextResult } from '../../services/geminiService';
import { ChatMessage } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import ChatMessageDisplay from '../../components/ChatMessageDisplay';
import { HEALTH_QA_SYSTEM_INSTRUCTION, GEMINI_API_KEY_PRESENT } from '../../constants';
import DisclaimerBox from '../../components/DisclaimerBox';
import { SparklesIcon } from '../../assets/icons';


const HealthQAView: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Initial message from AI
    if (chatMessages.length === 0 && GEMINI_API_KEY_PRESENT) {
        setChatMessages([
            {
                id: 'initial-ai-greeting',
                sender: 'ai',
                text: "Hello! I'm Health Saarthi, your AI health assistant. How can I help you today? Feel free to ask me any health-related questions.",
                timestamp: new Date(),
            }
        ]);
    }
  }, []); // Runs once on mount


  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);
  
  const handleSubmit = useCallback(async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    setChatMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);
    setInputValue('');

    try {
      const result: GenerateTextResult = await generateText({
        prompt: userMessage.text,
        systemInstruction: HEALTH_QA_SYSTEM_INSTRUCTION,
      });
      
      const aiMessage: ChatMessage = {
        id: Date.now().toString() + '-ai',
        sender: 'ai',
        text: result.text,
        timestamp: new Date(),
        sources: result.sources,
      };
      setChatMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
      const systemErrorMessage: ChatMessage = {
        id: Date.now().toString() + '-system',
        sender: 'system',
        text: `Error: ${errorMessage}. Please check your connection or API key.`,
        timestamp: new Date(),
      };
      setChatMessages(prevMessages => [...prevMessages, systemErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading]);

  if (!GEMINI_API_KEY_PRESENT) {
    return (
      <div className="p-3 sm:p-4">
        <DisclaimerBox 
          title="API Key Not Configured"
          message="The Gemini API key is not configured for Health Saarthi. The Health Q&A assistant requires a valid API key to function. Please ensure the API_KEY environment variable is set by the hosting environment."
          className="bg-red-50 border-red-400 text-red-700"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-xl overflow-hidden border border-neutral-light">
      <header className="p-3 sm:p-4 border-b border-neutral-light bg-neutral-lightest">
        <h2 className="text-lg sm:text-xl font-semibold text-primary-dark flex items-center">
          <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-2.5 text-primary-DEFAULT" />
          Health Saarthi
        </h2>
        <p className="text-xs sm:text-sm text-neutral-medium ml-7 sm:ml-8">Your personal AI for health questions.</p>
      </header>

      <div ref={chatContainerRef} className="flex-grow p-3 sm:p-4 space-y-4 sm:space-y-5 overflow-y-auto bg-neutral-light/50 custom-scrollbar">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-md ${
                msg.sender === 'user' ? 'bg-primary-DEFAULT text-white rounded-br-none' : 
                msg.sender === 'ai' ? 'bg-white text-neutral-darkest border border-neutral-light rounded-bl-none' :
                'bg-red-100 text-red-700 border border-red-200 rounded-bl-none' 
              }`}
            >
              <ChatMessageDisplay text={msg.text} sources={msg.sources} />
              <p className={`text-xs mt-1.5 sm:mt-2 text-right ${
                  msg.sender === 'user' ? 'text-primary-light/70' : 
                  msg.sender === 'ai' ? 'text-neutral-DEFAULT/80' : 
                  'text-red-400'
              }`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start py-2">
             <div className="flex items-center space-x-2 bg-white text-neutral-darkest border border-neutral-light rounded-2xl rounded-bl-none p-3 shadow-md">
                <LoadingSpinner /> 
                <p className="text-sm text-neutral-medium">Health Saarthi is thinking...</p>
            </div>
          </div>
        )}
         {error && !isLoading && ( 
            <div className="flex justify-center">
                 <div className="max-w-lg lg:max-w-xl xl:max-w-2xl px-4 py-3 rounded-2xl shadow-md bg-red-100 text-red-700 border border-red-200">
                    <p className="font-semibold">Assistant Error:</p>
                    <p>{error}</p>
                 </div>
            </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-neutral-light bg-neutral-lightest">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <input
            type="text"
            id="health-question-input" 
            name="healthQuestion"      
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Health Saarthi..."
            aria-label="Type your health question"
            className="flex-grow p-3 sm:p-3.5 border border-neutral-medium/50 rounded-xl focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent outline-none transition-all shadow-sm bg-white text-neutral-darkest placeholder-neutral-DEFAULT text-sm sm:text-base"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-3 sm:px-6 sm:py-3.5 bg-primary-DEFAULT text-neutral-darkest font-semibold rounded-xl hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 ease-in-out shadow-md hover:shadow-lg text-sm sm:text-base"
            disabled={isLoading || !inputValue.trim()}
            aria-label="Send message"
          >
            Send
          </button>
        </div>
         <p className="text-xs text-neutral-DEFAULT mt-2 pl-1">Health Saarthi may provide informative responses but it's not a substitute for medical advice.</p>
      </form>
    </div>
  );
};

export default HealthQAView;
