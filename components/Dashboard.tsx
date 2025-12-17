import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { DollarSign, Home, Users, TrendingUp } from 'lucide-react';
import { MOCK_PROPERTIES, MOCK_AGENTS } from '../constants';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC = () => {
  const totalSales = MOCK_AGENTS.reduce((acc, curr) => acc + curr.sales, 0);
  const totalProperties = MOCK_PROPERTIES.length;
  const avgPrice = MOCK_PROPERTIES.reduce((acc, curr) => acc + curr.price, 0) / totalProperties;

  // Prepare data for charts
  const statusData = [
    { name: 'For Sale', value: MOCK_PROPERTIES.filter(p => p.status === 'For Sale').length },
    { name: 'Pending', value: MOCK_PROPERTIES.filter(p => p.status === 'Pending').length },
    { name: 'Sold', value: MOCK_PROPERTIES.filter(p => p.status === 'Sold').length },
  ];

  const agentPerformanceData = MOCK_AGENTS.map(agent => ({
    name: agent.name.split(' ')[0], // First name for chart
    sales: agent.sales,
  }));

  const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-900">{value}</h3>
          <p className="text-slate-400 text-xs mt-1">{subtext}</p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${(totalSales / 1000000).toFixed(1)}M`} 
          subtext="+12.5% from last month"
          icon={DollarSign}
          color="blue"
        />
        <StatCard 
          title="Active Listings" 
          value={totalProperties.toString()} 
          subtext="Across 4 regions"
          icon={Home}
          color="indigo"
        />
        <StatCard 
          title="Avg. Property Price" 
          value={`$${(avgPrice / 1000).toFixed(0)}k`} 
          subtext="Market avg: $450k"
          icon={TrendingUp}
          color="green"
        />
        <StatCard 
          title="Total Agents" 
          value={MOCK_AGENTS.length.toString()} 
          subtext="Top rated team"
          icon={Users}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Agent Performance (Sales Volume)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis 
                  tickFormatter={(value) => `$${value/1000000}M`} 
                  tick={{fill: '#64748b'}} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Sales']}
                />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Property Status Distribution</h3>
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
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;