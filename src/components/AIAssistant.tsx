import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  X, 
  Bot, 
  User, 
  Sparkles, 
  Settings, 
  Trash2, 
  Copy, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: OutfitSuggestion[];
}

interface OutfitSuggestion {
  type: 'top' | 'bottom' | 'dress' | 'outerwear' | 'accessory' | 'shoes';
  color: string;
  reason: string;
  occasion?: string;
  style?: string;
}

export const AIAssistant = ({ onClose, userVisionType, wardrobeItems }: { 
  onClose: () => void;
  userVisionType: string | null;
  wardrobeItems?: any[];
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyError, setApiKeyError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    const defaultKey = "AIzaSyBlNKeVUTOXWfd6uGA6XnSXe3gWSbiVa4E";
    
    if (savedKey) {
      setApiKey(savedKey);
    } else if (defaultKey) {
      setApiKey(defaultKey);
      // Auto-save the default key
      localStorage.setItem('gemini_api_key', defaultKey);
    }
    
    const savedMessages = localStorage.getItem('ai_assistant_history');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai_assistant_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      setApiKeyError('API key cannot be empty');
      return;
    }
    
    localStorage.setItem('gemini_api_key', apiKey.trim());
    setShowSettings(false);
    setApiKeyError('');
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('ai_assistant_history');
  };

  const generateContextPrompt = () => {
    let context = "You are a professional fashion stylist AI assistant specializing in color vision accessibility and personalized outfit recommendations. ";
    
    if (userVisionType) {
      context += `The user has ${userVisionType} color vision. Please consider this when making color recommendations, focusing on contrast and clarity rather than subtle color differences. `;
    }
    
    if (wardrobeItems && wardrobeItems.length > 0) {
      const categories = wardrobeItems.reduce((acc: any, item: any) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {});
      
      context += `The user's wardrobe contains: ${Object.entries(categories).map(([cat, count]) => `${count} ${cat}s`).join(', ')}. `;
      context += 'Please consider their existing items when making recommendations. ';
    }
    
    context += "Provide specific, actionable advice about outfit combinations, color coordination, and styling tips. ";
    context += "Consider occasion, weather, and personal style. Be concise but thorough. ";
    context += "If suggesting colors, explain why they work together based on color theory and the user's needs.";
    
    return context;
  };

  const callGeminiAPI = async (prompt: string) => {
    if (!apiKey.trim()) {
      setApiKeyError('Please set your Gemini API key first');
      setShowSettings(true);
      return;
    }

    setIsLoading(true);
    
    try {
      const contextPrompt = generateContextPrompt();
      const fullPrompt = `${contextPrompt}\n\nUser: ${prompt}`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const assistantResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I couldn\'t generate a response. Please try again.';
      
      // Parse suggestions from response
      const suggestions = parseOutfitSuggestions(assistantResponse);
      
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date().toISOString(),
        suggestions
      };
      
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Gemini API Error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please check your API key and try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseOutfitSuggestions = (response: string): OutfitSuggestion[] => {
    const suggestions: OutfitSuggestion[] = [];
    
    // Simple parsing logic - in a real implementation, this would be more sophisticated
    const colorMatches = response.match(/(?:wear|try|pair with|combine with)\s+([a-zA-Z\s]+)/gi);
    const itemMatches = response.match(/(?:top|bottom|dress|jacket|shirt|pants|shoes|accessory)/gi);
    
    if (colorMatches) {
      colorMatches.forEach((match, index) => {
        const color = match.replace(/(?:wear|try|pair with|combine with)\s+/, '').trim();
        if (color && itemMatches && itemMatches[index]) {
          suggestions.push({
            type: itemMatches[index].toLowerCase() as OutfitSuggestion['type'],
            color: color,
            reason: `This ${color} option would complement your existing items well`,
            style: 'casual'
          });
        }
      });
    }
    
    return suggestions;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    await callGeminiAPI(input.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/95 backdrop-blur-xl p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-5xl w-full bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-brand-accent to-brand-secondary rounded-xl flex items-center justify-center">
              <Bot className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-primary dark:text-white">AI Style Assistant</h2>
              <p className="text-sm text-stone-500">Personalized outfit advice powered by Gemini</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <Settings className="w-5 h-5 text-stone-400" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5 text-stone-400" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50"
            >
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Gemini API Key
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your Gemini API key"
                      className="flex-1 px-4 py-3 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-xl text-brand-primary dark:text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    />
                    <button
                      onClick={saveApiKey}
                      className="px-6 py-3 bg-brand-secondary text-white rounded-xl font-semibold hover:bg-brand-secondary/90 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                  {apiKeyError && (
                    <p className="text-sm text-red-500 mt-2">{apiKeyError}</p>
                  )}
                  <p className="text-xs text-stone-500 mt-2">
                    Get your API key from{' '}
                    <a 
                      href="https://makersuite.google.com/app/apikey" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-secondary hover:underline"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gradient-to-r from-brand-accent/20 to-brand-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-brand-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-brand-primary dark:text-white mb-2">
                  Your Personal Style Assistant
                </h3>
                <p className="text-stone-600 dark:text-stone-400 mb-6">
                  Ask me anything about outfits, color combinations, styling tips, or fashion advice tailored to your needs.
                </p>
                <div className="space-y-2 text-sm text-stone-500">
                  <p>💡 Try asking about:</p>
                  <p>• Outfit ideas for specific occasions</p>
                  <p>• Color combinations that work for you</p>
                  <p>• How to style items you already own</p>
                  <p>• Seasonal outfit recommendations</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-brand-accent to-brand-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="text-white w-4 h-4" />
                    </div>
                  )}
                  
                  <div className={`max-w-2xl ${
                    message.role === 'user' 
                      ? 'bg-brand-secondary text-white' 
                      : 'bg-stone-100 dark:bg-stone-800 text-brand-primary dark:text-white'
                  } rounded-2xl p-4`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-medium opacity-70">
                        {message.role === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs opacity-50">
                          {formatTime(message.timestamp)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="p-1 hover:bg-black/10 rounded transition-colors"
                        >
                          <Copy className="w-3 h-3 opacity-50" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                    
                    {/* Outfit Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          Suggested Items
                        </h4>
                        {message.suggestions.map((suggestion, index) => (
                          <div key={index} className="bg-white/50 dark:bg-stone-700/50 rounded-xl p-3 border border-stone-200 dark:border-stone-700">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
                                  {suggestion.type}
                                </span>
                                <p className="text-sm font-medium text-brand-primary dark:text-white">
                                  {suggestion.color} {suggestion.type}
                                </p>
                                <p className="text-xs text-stone-600 dark:text-stone-400">
                                  {suggestion.reason}
                                </p>
                              </div>
                              {suggestion.style && (
                                <span className="text-xs bg-brand-secondary/20 text-brand-secondary px-2 py-1 rounded-lg">
                                  {suggestion.style}
                                </span>
                              )}
                            </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-stone-300 dark:bg-stone-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="text-white w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-stone-200 dark:border-stone-800">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask for outfit advice, color combinations, or styling tips..."
                className="w-full px-4 py-3 bg-stone-100 dark:bg-stone-800 rounded-xl text-brand-primary dark:text-white placeholder-stone-500 resize-none focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                rows={2}
                disabled={isLoading}
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-brand-secondary animate-spin" />
                </div>
              )}
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-brand-secondary text-white rounded-xl font-semibold hover:bg-brand-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send
            </button>
            <button
              onClick={clearHistory}
              className="px-4 py-3 bg-stone-200 dark:bg-stone-700 text-brand-primary dark:text-white rounded-xl font-semibold hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
