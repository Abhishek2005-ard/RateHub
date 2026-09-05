import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ratehub_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('ratehub_token') || null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('ratehub_token', token);
    } else {
      localStorage.removeItem('ratehub_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ratehub_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ratehub_user');
    }
  }, [user]);

  const login = async (email, password, role) => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed.');
    }

    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed.');
    }

    if (data.token) setToken(data.token);
    if (data.user) setUser(data.user);
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ratehub_token');
    localStorage.removeItem('ratehub_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, role: user?.role, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
