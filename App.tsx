
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PropertyList from './components/PropertyList';
import AgentList from './components/AgentList';
import ClientList from './components/ClientList';
import SQLAnalyst from './components/SQLAnalyst';
import LoginScreen from './components/LoginScreen';
import { ViewState, User } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.PROPERTIES:
        return <PropertyList />;
      case ViewState.AGENTS:
        return <AgentList user={currentUser!} />;
      case ViewState.CLIENTS:
        return <ClientList />;
      case ViewState.SQL_ANALYST:
        return <SQLAnalyst />;
      default:
        return <Dashboard />;
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // Redirect agents to Properties view as they don't have access to Dashboard
    if (user.role === 'agent') {
      setCurrentView(ViewState.PROPERTIES);
    } else {
      setCurrentView(ViewState.DASHBOARD);
    }
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        user={currentUser}
        onLogout={() => setCurrentUser(null)}
      />
      
      <main className="ml-64 p-8 min-h-screen transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
