import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../services/api/apiClient';

export const AuthContext = createContext(null);

const MOCK_USERS = {
  CENTRAL_ADMIN: {
    _id: 'mock_u1',
    name: 'Shri Rajesh Verma (IAS)',
    email: 'central.admin@nlams.gov.in',
    role: 'CENTRAL_ADMIN',
    designation: 'Joint Secretary, DoLR',
    jurisdiction: { state: 'All India', district: 'National' }
  },
  STATE_OFFICER: {
    _id: 'mock_u2',
    name: 'Smt. Ananya Deshmukh',
    email: 'state.maharashtra@nlams.gov.in',
    role: 'STATE_OFFICER',
    designation: 'Principal Secretary, Revenue Dept',
    jurisdiction: { state: 'Maharashtra' }
  },
  DISTRICT_COLLECTOR: {
    _id: 'mock_u3',
    name: 'Dr. Suhas Diwase (IAS)',
    email: 'collector.pune@nlams.gov.in',
    role: 'DISTRICT_COLLECTOR',
    designation: 'District Collector, Pune',
    jurisdiction: { state: 'Maharashtra', district: 'Pune' }
  },
  REQUIRING_AGENCY: {
    _id: 'mock_u4',
    name: 'Er. Vikram Malhotra',
    email: 'nhai.director@nhai.gov.in',
    role: 'REQUIRING_AGENCY',
    designation: 'Chief Project Director, NHAI',
    jurisdiction: { state: 'Maharashtra', agencyName: 'NHAI' }
  },
  FIELD_SURVEYOR: {
    _id: 'mock_u5',
    name: 'Kiran Thorat (Talathi)',
    email: 'surveyor.haveli@nlams.gov.in',
    role: 'FIELD_SURVEYOR',
    designation: 'Circle Revenue Inspector',
    jurisdiction: { state: 'Maharashtra', district: 'Pune', taluka: 'Haveli' }
  },
  CITIZEN: {
    _id: 'mock_u6',
    name: 'Ramesh Tukaram Patil',
    email: 'ramesh.patil@citizen.in',
    role: 'CITIZEN',
    designation: 'Farmer & Landowner',
    jurisdiction: { state: 'Maharashtra', district: 'Pune', taluka: 'Haveli' }
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('nlams_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('nlams_user');
      const savedToken = localStorage.getItem('nlams_token');

      if (savedUser && savedToken) {
        try {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
        } catch (e) {
          localStorage.removeItem('nlams_user');
          localStorage.removeItem('nlams_token');
        }
      } else {
        // Default to Central Admin for convenient initial viewing
        const defaultUser = MOCK_USERS.CENTRAL_ADMIN;
        setUser(defaultUser);
        localStorage.setItem('nlams_user', JSON.stringify(defaultUser));
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loginWithCredentials = async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data.data.token) {
        const { token: jwtToken, user: userData } = res.data.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('nlams_token', jwtToken);
        localStorage.setItem('nlams_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return res.data;
    } catch (err) {
      // Fallback to local mock user match if backend is in offline mode
      const matched = Object.values(MOCK_USERS).find((u) => u.email === email);
      if (matched) {
        setUser(matched);
        setToken('mock_jwt_token_' + matched.role);
        localStorage.setItem('nlams_user', JSON.stringify(matched));
        return { success: true, user: matched };
      }
      throw err;
    }
  };

  const switchRole = (roleKey) => {
    if (MOCK_USERS[roleKey]) {
      const target = MOCK_USERS[roleKey];
      setUser(target);
      localStorage.setItem('nlams_user', JSON.stringify(target));
      return target;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nlams_user');
    localStorage.removeItem('nlams_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginWithCredentials,
        switchRole,
        logout,
        isAuthenticated: !!user,
        role: user?.role
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
