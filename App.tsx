
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

  const handleBookProperty = (property: Property) => {
    setSelectedBookingProperty(property);
    setCurrentView(ViewState.BOOKING);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.PROPERTIES:
        return <PropertyList onBookProperty={handleBookProperty} />;
      case ViewState.AGENTS:
        return <AgentList user={currentUser!} />;
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
    // Redirect agents and guests to specific views
    if (user.role === 'agent') {
      setCurrentView(ViewState.PROPERTIES);
    } else if (user.role === 'guest') {
      setCurrentView(ViewState.AGENTS); // Guests likely want to find agents first
    } else {
      setCurrentView(ViewState.DASHBOARD);
    }
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen text-slate-900 font-sans">
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
