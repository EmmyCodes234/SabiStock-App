import React from 'react';
import Routes from './Routes';
import NotificationContainer from './components/ui/NotificationContainer';
import ChatBubble from './components/sabi-bot/ChatBubble';
import { AuthProvider } from './contexts/AuthContext'; // <-- New Import

function App() {
  return (
    <AuthProvider>
      <Routes />
      <NotificationContainer />
      <ChatBubble />
    </AuthProvider>
  );
}

export default App;