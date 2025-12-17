
import React, { useState } from 'react';
import { Mail, Phone, Star, TrendingUp, Plus, X, User as UserIcon, DollarSign, Award, Image as ImageIcon, Percent, Banknote } from 'lucide-react';
import { MOCK_AGENTS } from '../constants';
import { Agent, User } from '../types';

interface AgentListProps {
  user: User;
}

const AgentList: React.FC<AgentListProps> = ({ user }) => {
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    name: '',
    email: '',
    phone: '',
    sales: 0,
    rating: 5.0,
    imageUrl: '',
    commissionRate: 2.0
  });

  const isAdmin = user.role === 'admin';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAgent(prev => ({
      ...prev,
      [name]: (name === 'sales' || name === 'rating' || name === 'commissionRate') ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgent.name || !newAgent.email) return;

    const agent: Agent = {
      id: Math.max(...agents.map(a => a.id)) + 1,
      name: newAgent.name,
      email: newAgent.email,
      phone: newAgent.phone || '555-0000',
      sales: newAgent.sales || 0,
      rating: newAgent.rating || 0,
      imageUrl: newAgent.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(newAgent.name)}&background=random`,
      commissionRate: newAgent.commissionRate || 2.0
    };

    setAgents([...agents, agent]);
    setIsModalOpen(false);
    setNewAgent({ name: '', email: '', phone: '', sales: 0, rating: 5.0, imageUrl: '', commissionRate: 2.0 });
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Our Agents</h2>
          <div className="text-sm text-slate-500">
            {isAdmin ? 'Top performers this month' : 'Contact Directory'}
          </div>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            <Plus size={18} />
            Register New Agent
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => {
          const totalCommission = agent.sales * (agent.commissionRate / 100);
          
          return (
            <div key={agent.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-6 items-start hover:shadow-md transition-shadow group">
              <div className="relative">
                <img 
                  src={agent.imageUrl} 
                  alt={agent.name} 
                  className="w-24 h-24 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-yellow-400">
                  <Star fill="currentColor" size={14} />
                </div>
              </div>

              <div className="flex-1 space-y-3 w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{agent.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                      {agent.rating} <span className="text-slate-400 font-normal">/ 5.0 Rating</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="text-right">
                      <p className="text-xs text-slate-400 uppercase tracking-wider">Total Sales</p>
                      <p className="text-lg font-bold text-blue-600">${(agent.sales / 1000000).toFixed(2)}M</p>
                    </div>
                  )}
                </div>

                {isAdmin ? (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                       <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold uppercase">
                          <Percent size={12} />
                          Commission
                       </div>
                       <div className="text-emerald-800 font-bold text-sm mt-0.5">{agent.commissionRate}%</div>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                       <div className="flex items-center gap-1.5 text-blue-600 text-xs font-semibold uppercase">
                          <Banknote size={12} />
                          Earned
                       </div>
                       <div className="text-blue-800 font-bold text-sm mt-0.5">${(totalCommission / 1000).toFixed(1)}k</div>
                    </div>
                  </div>
                ) : (
                  <div className="h-10"></div> /* Spacer to keep card height consistent or remove if variable height is preferred */
                )}

                <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-100">
                  <a href={`mailto:${agent.email}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600">
                    <Mail size={16} className="text-slate-400" />
                    {agent.email}
                  </a>
                  <a href={`tel:${agent.phone}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600">
                    <Phone size={16} className="text-slate-400" />
                    {agent.phone}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Agent Modal - Only for Admins */}
      {isModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          
          <div className="relative w-full max-w-lg bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-slate-200/50 bg-white/30">
              <h3 className="text-xl font-bold text-slate-900">Register New Agent</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-black/5 rounded-full transition-colors text-slate-500 hover:text-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="name"
                      required
                      value={newAgent.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Jane Doe"
                      className="w-full pl-10 pr-4 py-2 bg-white/50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                      <input
                        type="email"
                        name="email"
                        required
                        value={newAgent.email}
                        onChange={handleInputChange}
                        placeholder="jane@estatemind.com"
                        className="w-full pl-10 pr-4 py-2 bg-white/50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 text-slate-400" size={18} />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={newAgent.phone}
                        onChange={handleInputChange}
                        placeholder="555-0123"
                        className="w-full pl-10 pr-4 py-2 bg-white/50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Total Sales Volume ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 text-slate-400" size={18} />
                      <input
                        type="number"
                        name="sales"
                        min="0"
                        step="1000"
                        value={newAgent.sales}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-2 bg-white/50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Commission Rate (%)</label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-2.5 text-slate-400" size={18} />
                      <input
                        type="number"
                        name="commissionRate"
                        min="0"
                        max="100"
                        step="0.1"
                        value={newAgent.commissionRate}
                        onChange={handleInputChange}
                        placeholder="2.5"
                        className="w-full pl-10 pr-4 py-2 bg-white/50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                 <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Rating (0-5)</label>
                        <div className="relative">
                        <Award className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            type="number"
                            name="rating"
                            min="0"
                            max="5"
                            step="0.1"
                            value={newAgent.rating}
                            onChange={handleInputChange}
                            placeholder="5.0"
                            className="w-full pl-10 pr-4 py-2 bg-white/50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                        />
                        </div>
                    </div>
                 </div>

                 <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Profile Photo URL (Optional)</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="imageUrl"
                      value={newAgent.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="w-full pl-10 pr-4 py-2 bg-white/50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-200/50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
                >
                  <Plus size={16} />
                  Register Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentList;
