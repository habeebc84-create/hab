import React, { useState, useRef, useEffect } from 'react';
import { Send, Database, Bot, User, Code, AlertCircle, Loader2 } from 'lucide-react';
import { generateSQLAnalysis } from '../services/geminiService';
import { SQLMessage } from '../types';

const SQLAnalyst: React.FC = () => {
  const [messages, setMessages] = useState<SQLMessage[]>([
    { 
      role: 'model', 
      text: "Hello! I'm your Real Estate SQL Analyst. Ask me anything about your data, and I'll generate the query and insights for you. For example: 'Find all 3 bedroom houses under $800k in Seattle'." 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const result = await generateSQLAnalysis(userText);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: result.explanation,
        sql: result.sql 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "I encountered an error connecting to the analysis engine. Please ensure your API Key is configured correctly.",
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Database size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Natural Language to SQL Analyst</h2>
            <p className="text-xs text-slate-500">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {msg.isError ? <AlertCircle size={16} /> : <Bot size={16} />}
              </div>
            )}
            
            <div className={`max-w-[80%] space-y-3 ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
              <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
              }`}>
                {msg.text}
              </div>

              {msg.sql && (
                <div className="bg-slate-900 rounded-xl overflow-hidden shadow-md border border-slate-800 animate-fade-in">
                  <div className="bg-slate-950 px-4 py-2 flex items-center gap-2 border-b border-slate-800">
                    <Code size={14} className="text-blue-400" />
                    <span className="text-xs font-mono text-slate-400">Generated SQL</span>
                  </div>
                  <div className="p-4 overflow-x-auto">
                    <code className="text-sm font-mono text-green-400 whitespace-pre-wrap">
                      {msg.sql}
                    </code>
                  </div>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        {loading && (
           <div className="flex gap-4 justify-start">
             <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-blue-500" />
                <span className="text-sm text-slate-500">Analyzing schema and generating query...</span>
              </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your data (e.g., 'Which agents have sales over 10M?')"
            className="w-full pl-6 pr-14 py-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm text-slate-700 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SQLAnalyst;