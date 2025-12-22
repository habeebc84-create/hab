
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PropertyList from './components/PropertyList';
import AgentList from './components/AgentList';
import ClientList from './components/ClientList';
import SQLAnalyst from './components/SQLAnalyst';
import LoginScreen from './components/LoginScreen';
import BookingPage from './components/BookingPage';
import { ViewState, User, Property } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedBookingProperty, setSelectedBookingProperty] = useState<Property | null>(null);
  const [agentFilterId, setAgentFilterId] = useState<number | null>(null);

  const handleBookProperty = (property: Property) => {
    setSelectedBookingProperty(property);
    setCurrentView(ViewState.BOOKING);
  };

  const handleViewAgentProperties = (agentId: number) => {
    setAgentFilterId(agentId);
    setCurrentView(ViewState.PROPERTIES);
  };

  const handleClearAgentFilter = () => {
    setAgentFilterId(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.PROPERTIES:
        return (
          <PropertyList 
            onBookProperty={handleBookProperty} 
            agentFilterId={agentFilterId}
            onClearFilter={handleClearAgentFilter}
          />
        );
      case ViewState.AGENTS:
        return (
          <AgentList 
            user={currentUser!} 
            onViewAgentProperties={handleViewAgentProperties}
          />
        );
      case ViewState.CLIENTS:
        return <ClientList />;
      case ViewState.SQL_ANALYST:
        return <SQLAnalyst />;
      case ViewState.BOOKING:
        return (
          <BookingPage 
            property={selectedBookingProperty} 
            onBack={() => setCurrentView(ViewState.PROPERTIES)} 
          />
        );
      default:
        return <Dashboard />;
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'agent') {
      setCurrentView(ViewState.PROPERTIES);
    } else if (user.role === 'guest') {
      setCurrentView(ViewState.AGENTS);
    } else {
      setCurrentView(ViewState.DASHBOARD);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans">
      {!currentUser ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <>
          <Sidebar 
            currentView={currentView} 
            onViewChange={(view) => {
              setCurrentView(view);
              // Clear agent filter when navigating away from properties manually via sidebar
              if (view !== ViewState.PROPERTIES) setAgentFilterId(null);
            }} 
            user={currentUser}
            onLogout={() => setCurrentUser(null)}
          />
          
          <main className="ml-64 p-8 min-h-screen transition-all duration-300">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
