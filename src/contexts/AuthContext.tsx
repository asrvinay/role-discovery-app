
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  profile?: UserProfile;
}

interface UserProfile {
  jobTitles: string[];
  locations: string[];
  yearsExperience: number;
  skills: string[];
  industries: string[];
  employmentTypes: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  remotePreference: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('jobmatch_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('jobmatch_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('jobmatch_user', JSON.stringify(userWithoutPassword));
  };

  const register = async (email: string, password: string, name: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = JSON.parse(localStorage.getItem('jobmatch_users') || '[]');
    
    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      profile: null
    };

    users.push(newUser);
    localStorage.setItem('jobmatch_users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('jobmatch_user', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jobmatch_user');
  };

  const updateProfile = (profile: UserProfile) => {
    if (user) {
      const updatedUser = { ...user, profile };
      setUser(updatedUser);
      localStorage.setItem('jobmatch_user', JSON.stringify(updatedUser));
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem('jobmatch_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], profile };
        localStorage.setItem('jobmatch_users', JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
