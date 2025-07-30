import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../utils/apiService';
import SkeletonLoader from '../components/ui/SkeletonLoader';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      // CORRECTED: Now correctly handles the response from Supabase
      const { data } = await authService.getSession();
      setSession(data.session);
      setLoading(false);
    };

    checkSession();

    // CORRECTED: Now correctly passes the session to the callback
    const { data: authListener } = authService.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Show a full-page loader while we check for an active session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <SkeletonLoader height="4rem" width="4rem" variant="circle" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context easily in other components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};