import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Briefcase, FileText, TrendingUp, Target } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI assistant. I can help you with resume analysis, job matching, skill suggestions, and more. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const quickReplies = [
    { text: "How to upload resume?", icon: FileText },
    { text: "Find matching jobs", icon: Briefcase },
    { text: "Skill suggestions", icon: Target },
    { text: "Market trends", icon: TrendingUp },
    { text: "Track skill progress", icon: Target }
  ];

  const handleQuickReply = (text) => {
    handleUserMessage(text);
  };

  const handleUserMessage = async (message) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('upload') || message.includes('resume')) {
      return "To upload your resume:\n1. Go to the 'Resume Upload' page\n2. Click 'Choose File' and select your PDF resume\n3. Click 'Upload & Analyze'\n4. Wait for the analysis to complete\n\nYour resume will be analyzed for skills, experience level, and job matches. The results will be available across all tabs!";
    }
    
    if (message.includes('job') || message.includes('match') || message.includes('find')) {
      return "To find matching jobs:\n1. Upload your resume first (if not done already)\n2. Go to the 'Job Matching' page\n3. View personalized job recommendations based on your skills\n4. Use filters to narrow down results\n5. Click 'Apply' to go to the job application page\n\nJobs are ranked by match score - higher scores mean better fits!";
    }
    
    if (message.includes('skill') || message.includes('suggestion')) {
      return "For skill suggestions:\n1. Upload your resume to get personalized recommendations\n2. Go to 'Skill Suggestions' page\n3. View skill gaps and upgrade recommendations\n4. Track your progress for each skill using the progress bars\n5. Add new skills to track manually\n6. Click learning platform links to start learning\n\nFocus on high-priority skills first for maximum impact!";
    }
    
    if (message.includes('market') || message.includes('trend')) {
      return "To view market insights:\n1. Go to 'Market Insights' page\n2. View general market trends and salary data\n3. If you've uploaded a resume, see personalized market demand for your skills\n4. Check which skills are in high demand\n5. Use this data to prioritize your skill development\n\nMarket insights help you make informed career decisions!";
    }
    
    if (message.includes('progress') || message.includes('track')) {
      return "To track skill progress:\n1. Go to 'Skill Suggestions' page\n2. Find the 'Skill Progress Tracking' section\n3. Use + and - buttons to update your progress\n4. Add new skills to track using the input field\n5. Progress is automatically saved and persists across sessions\n6. Completed skills show a green checkmark\n\nTrack your progress to stay motivated and see your growth!";
    }
    
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! I'm here to help you with your career development. You can ask me about:\n• Resume upload and analysis\n• Job matching and applications\n• Skill suggestions and learning paths\n• Market trends and insights\n• Progress tracking\n\nWhat would you like to know?";
    }
    
    if (message.includes('help')) {
      return "I can help you with:\n\n📄 **Resume Analysis**: Upload and analyze your resume for skills and experience\n💼 **Job Matching**: Find jobs that match your profile\n🎯 **Skill Suggestions**: Get personalized skill recommendations\n📊 **Market Insights**: View industry trends and demand\n📈 **Progress Tracking**: Monitor your skill development\n\nTry asking about any of these features or use the quick reply buttons below!";
    }
    
    return "I'm not sure I understand. You can ask me about:\n• How to upload and analyze resumes\n• Finding matching jobs\n• Skill suggestions and learning\n• Market trends\n• Progress tracking\n\nOr try one of the quick reply options below!";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleUserMessage(inputValue);
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 z-50"
        title="Chat with AI Assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <h3 className="font-semibold">AI Career Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'bot' && (
                      <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="whitespace-pre-line">{message.content}</div>
                    {message.type === 'user' && (
                      <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <div className="text-xs text-gray-500 mb-2">Quick replies:</div>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => {
                  const Icon = reply.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply.text)}
                      className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full transition-colors"
                    >
                      <Icon className="w-3 h-3" />
                      <span>{reply.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about the site or jobs..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
