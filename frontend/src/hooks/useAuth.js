import React, { createContext, useCallback, useContext, useState } from 'react';

const AuthContext = createContext(null);

const initialState = {
  status: 'guest', // 'guest' | 'authed'
  user: null,
  accessToken: null,
  refreshToken: null,
};

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  const setAuthFromResponse = useCallback((resp) => {
    if (!resp) return;
    setState({
      status: 'authed',
      user: resp.user || null,
      accessToken: resp.accessToken || null,
      refreshToken: resp.refreshToken || null,
    });
  }, []);

  const signOut = useCallback(() => {
    setState(initialState);
  }, []);

  const value = {
    ...state,
    setAuthFromResponse,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};


