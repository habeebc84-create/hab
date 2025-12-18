
import React, { useState, useRef, useEffect } from 'react';
import { Send, Database, Bot, User, Code, AlertCircle, Loader2, Sparkles, Filter, ChevronRight, BarChart3, TrendingUp, Users, Home, MapPin, Award, Navigation, IndianRupee, Globe } from 'lucide-react';
import { generateSQLAnalysis } from '../services/geminiService';
import { SQLMessage } from '../types';

const SQLAnalyst: React.FC = () => {
  const [messages, setMessages] = useState<SQLMessage[]>([
    { 
      role: 'model', 
      text: "Hello! I'm your Real Estate SQL Analyst. Use the Quick Analysis templates on the right to perform complex property & agent optimizations, or ask me a custom question." 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const analyticTemplates = [
    { id: 'a', label: 'High-Value Agents', description: 'Agents with transactions above average sale price', icon: <TrendingUp size={14}/>, query: 'Retrieve agents who have handled property transactions above the average sale price across the entire database.' },
    { id: 'b', label: 'Premium City Clients', description: 'Clients buying above city average price', icon: <MapPin size={14}/>, query: 'List all clients who have purchased properties more expensive than the average property price in their specific preferred city.' },
    { id: 'c', label: 'Veteran Benchmarking', description: 'Properties priced higher than veteran agents\' sales', icon: <Award size={14}/>, query: 'Find all properties whose price is higher than any property ever sold by agents with more than 5 years of experience.' },
    { id: 'd', label: 'Agent Personal Avg', description: 'Sales greater than agent\'s own average', icon: <Users size={14}/>, query: 'Retrieve agents and their clients where a specific transaction sale price is greater than that specific agent\'s historical average sale price.' },
    { id: 'e', label: 'Location Matching', description: 'Properties matching client city preference', icon: <Navigation size={14}/>, query: 'Display properties and corresponding agents for which the property location matches the client\'s preferred city in a transaction.' },
    { id: 'f', label: 'Commission Efficiency', description: 'Above average commission earners', icon: <IndianRupee size={14}/>, query: 'Find agents, properties, and total commissions where the commission exceeds the average commission earned across all historical transactions.' },
    { id: 'g', label: 'Superior Feedback', description: 'Feedback higher than agent average', icon: <Sparkles size={14}/>, query: 'List clients, properties, and feedback ratings where the specific client feedback is higher than the average feedback rating for that specific agent.' },
    { id: 'h', label: 'Top Performance', description: 'Sales exceeding company average', icon: <BarChart3 size={14}/>, query: 'Retrieve top-performing agents along with their property details where their total combined sales exceed the company\'s overall average transaction value.' },
    { id: 'i', label: 'City Coverage (EXISTS)', description: 'Agents with sales in every city', icon: <Globe size={14}/>, query: 'Use EXISTS instead of IN to efficiently find agents who have sold at least one property in each city listed in the Property table, reducing nested lookups.' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTemplateClick = (query: string) => {
    setInput(query);
    processQuery(query);
  };

  const processQuery = async (userText: string) => {
    if (!userText.trim() || loading) return;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processQuery(input);
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col lg:flex-row gap-6 animate-fade-in">
      <div className="flex-1 flex flex-col glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/40">
        <div className="bg-white/60 backdrop-blur-xl p-5 border-b border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30">
              <Database size={22} />
            </div>
            <div>
              <h2 className="glass-header-3d text-lg font-black text-slate-800">SQL Optimization Analyst</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 ml-1">Real-time Data Intelligence</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
              <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="avatar" />
                    </div>
                  ))}
              </div>
              <span className="text-[10px] font-bold text-slate-400 ml-2">Active Node 0x7F</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && (
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${msg.isError ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'} shadow-lg transform -translate-y-1`}>
                  {msg.isError ? <AlertCircle size={20} /> : <Bot size={20} />}
                </div>
              )}
              
              <div className={`max-w-[85%] space-y-4 ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                <div className={`p-5 rounded-3xl shadow-sm text-sm leading-relaxed backdrop-blur-xl border ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none border-blue-400 shadow-blue-500/20' 
                    : 'bg-white/90 border-white/60 text-slate-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>

                {msg.sql && (
                  <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 animate-fade-in group">
                    <div className="bg-slate-800/50 px-5 py-3 flex items-center justify-between border-b border-slate-700/50">
                      <div className="flex items-center gap-2">
                        <Code size={14} className="text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Optimized SQL Query</span>
                      </div>
                      <button className="text-slate-500 hover:text-white transition-colors">
                         <span className="text-[10px] font-bold">COPY</span>
                      </button>
                    </div>
                    <div className="p-5 overflow-x-auto">
                      <code className="text-sm font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed block">
                        {msg.sql}
                      </code>
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-10 h-10 bg-white border border-slate-200 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transform -translate-y-1">
                  <User size={20} />
                </div>
              )}
            </div>
          ))}
          {loading && (
             <div className="flex gap-4 justify-start">
               <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Bot size={20} />
                </div>
                <div className="bg-white/90 border border-white/60 p-5 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-3 backdrop-blur-xl">
                  <div className="relative">
                    <Loader2 size={18} className="animate-spin text-blue-600" />
                    <div className="absolute inset-0 bg-blue-600 blur-sm opacity-20 animate-pulse"></div>
                  </div>
                  <span className="text-sm text-slate-500 font-medium">Scanning tables and generating analytical model...</span>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 bg-white/60 border-t border-white/20 backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for custom analysis (e.g., 'Compare quarterly growth')..."
              className="w-full pl-6 pr-16 py-4 rounded-2xl border border-white/60 bg-white/80 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-xl text-slate-700 placeholder:text-slate-400 font-medium"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2 group-hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-4">
          <div className="glass-panel p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
               <Sparkles size={20} className="text-amber-500" />
               <h3 className="glass-header-3d text-lg font-black text-slate-800">Advanced Analytics</h3>
            </div>
            
            <div className="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 custom-scrollbar">
               {analyticTemplates.map((template) => (
                 <button
                   key={template.id}
                   onClick={() => handleTemplateClick(template.query)}
                   className="w-full text-left p-4 rounded-2xl bg-white/50 border border-white/60 hover:bg-white hover:border-blue-400 hover:shadow-lg transition-all group relative overflow-hidden"
                 >
                   <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {template.icon}
                      </div>
                      <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{template.label}</span>
                   </div>
                   <p className="text-[11px] text-slate-500 font-medium leading-snug pl-11">
                     {template.description}
                   </p>
                   <ChevronRight size={14} className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                 </button>
               ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200/50">
               <div className="p-4 bg-slate-900 rounded-2xl text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Database size={14} className="text-blue-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Analysis Engine Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                     <span className="text-xs font-bold">SQL Cluster Online</span>
                  </div>
               </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default SQLAnalyst;
