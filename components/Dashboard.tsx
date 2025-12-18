
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { DollarSign, Home, Users, TrendingUp, IndianRupee, Activity, Calendar } from 'lucide-react';
import { MOCK_PROPERTIES, MOCK_AGENTS, MOCK_TRANSACTIONS } from '../constants';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1'];

const Dashboard: React.FC = () => {
  // Calculated from MOCK_TRANSACTIONS
  const totalRevenue = MOCK_TRANSACTIONS.reduce((acc, curr) => acc + curr.salePrice, 0);
  const totalCommission = MOCK_TRANSACTIONS.reduce((acc, curr) => acc + curr.commission, 0);
  const totalTransactions = MOCK_TRANSACTIONS.length;
  
  // Property Stats
  const activeListings = MOCK_PROPERTIES.filter(p => p.status === 'For Sale').length;
  const avgListedPrice = MOCK_PROPERTIES.length > 0 
    ? MOCK_PROPERTIES.reduce((acc, curr) => acc + curr.price, 0) / MOCK_PROPERTIES.length 
    : 0;

  // Format large numbers for INR (Crores/Lakhs)
  const formatCompactINR = (num: number) => {
    if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹ ${(num / 100000).toFixed(1)}L`;
    return `₹ ${(num / 1000).toFixed(0)}k`;
  };

  // Prepare data for charts
  const statusData = [
    { name: 'For Sale', value: MOCK_PROPERTIES.filter(p => p.status === 'For Sale').length },
    { name: 'Pending', value: MOCK_PROPERTIES.filter(p => p.status === 'Pending').length },
    { name: 'Sold', value: MOCK_PROPERTIES.filter(p => p.status === 'Sold').length },
  ];

  // Dynamic Agent Performance (Total Sales)
  const agentPerformanceData = MOCK_AGENTS.map(agent => {
    const agentSales = MOCK_TRANSACTIONS
      .filter(t => t.agentId === agent.id)
      .reduce((sum, t) => sum + t.salePrice, 0);
    
    return {
      name: agent.name.split(' ')[0],
      sales: agentSales,
    };
  }).sort((a, b) => b.sales - a.sales).slice(0, 10); // Top 10

  // Trend Data for Line Chart
  const trendData = useMemo(() => {
    const monthlyData: Record<string, any> = {};
    const months: string[] = [];

    for(let i=11; i>=0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
        monthlyData[key] = { name: key };
        MOCK_AGENTS.slice(0, 5).forEach(agent => { monthlyData[key][agent.name.split(' ')[0]] = 0; });
        months.push(key);
    }

    MOCK_TRANSACTIONS.forEach(t => {
        const date = new Date(t.date);
        const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        const agentName = MOCK_AGENTS.find(a => a.id === t.agentId)?.name.split(' ')[0];
        
        if (monthlyData[key] && agentName && MOCK_AGENTS.slice(0,5).some(a => a.name.includes(agentName))) {
            monthlyData[key][agentName] += t.salePrice;
        }
    });

    return months.map(m => monthlyData[m]);
  }, []);

  const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
    <div className="glass-panel p-6 rounded-xl hover:bg-white/50 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-600 text-sm font-bold uppercase tracking-wide">{title}</p>
          <h3 className="text-2xl font-black mt-1 text-slate-900">{value}</h3>
          <p className="text-slate-500 text-xs mt-1 font-medium">{subtext}</p>
        </div>
        <div className={`p-3 rounded-xl bg-${color}-100/50 text-${color}-600 backdrop-blur-sm shadow-sm`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4">
        <h2 className="glass-header-3d text-2xl font-bold">Executive Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Sales Revenue" 
          value={formatCompactINR(totalRevenue)} 
          subtext={`Total Commission: ${formatCompactINR(totalCommission)}`}
          icon={IndianRupee}
          color="blue"
        />
        <StatCard 
          title="Active Listings" 
          value={activeListings.toString()} 
          subtext={`${totalTransactions} properties sold`}
          icon={Home}
          color="indigo"
        />
        <StatCard 
          title="Avg. Listed Price" 
          value={formatCompactINR(avgListedPrice)} 
          subtext="Market average"
          icon={TrendingUp}
          color="green"
        />
        <StatCard 
          title="Active Agents" 
          value={MOCK_AGENTS.length.toString()} 
          subtext="Top performing team"
          icon={Users}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="glass-header-3d text-lg font-bold">Agent Performance Trends</h3>
                    <p className="text-xs text-slate-500 mt-2 ml-1">Monthly Sales Volume (Top 5 Agents)</p>
                </div>
                <Calendar size={18} className="text-slate-500" />
            </div>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                        <XAxis dataKey="name" tick={{fill: '#475569', fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis 
                            tickFormatter={(value) => `${(value/10000000).toFixed(1)}Cr`} 
                            tick={{fill: '#475569', fontSize: 12}} 
                            axisLine={false} 
                            tickLine={false} 
                        />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                backdropFilter: 'blur(10px)',
                                borderRadius: '12px', 
                                border: '1px solid rgba(255,255,255,0.5)', 
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            formatter={(value: number) => formatCompactINR(value)}
                        />
                        <Legend iconType="circle" />
                        {MOCK_AGENTS.slice(0, 5).map((agent, index) => (
                            <Line 
                                key={agent.id}
                                type="monotone" 
                                dataKey={agent.name.split(' ')[0]} 
                                stroke={COLORS[index % COLORS.length]} 
                                strokeWidth={3}
                                dot={{r: 3, strokeWidth: 1}}
                                activeDot={{r: 6}}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <h3 className="glass-header-3d text-lg font-bold mb-6">Property Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px', 
                    border: '1px solid rgba(255,255,255,0.5)',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
             <h3 className="glass-header-3d text-lg font-bold">Total Sales by Agent (YTD)</h3>
             <Activity size={18} className="text-slate-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="name" tick={{fill: '#475569'}} axisLine={false} tickLine={false} />
                <YAxis 
                  tickFormatter={(value) => `${(value/10000000).toFixed(0)}Cr`} 
                  tick={{fill: '#475569'}} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.2)'}}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px', 
                    border: '1px solid rgba(255,255,255,0.5)', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number) => [formatCompactINR(value), 'Total Sales']}
                />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40}>
                   {agentPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
    </div>
  );
};

export default Dashboard;
