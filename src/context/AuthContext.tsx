// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { login as apiLogin } from "../api/loginService";

interface AuthContextType {
  token: string | null;
  email: string | null;
  login: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  // Au montage, lire les infos dans localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("jwtToken");
    const savedEmail = localStorage.getItem("userEmail");

    if (savedToken) setToken(savedToken);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const login = async (emailInput: string, password: string) => {
    const { token: serverToken, email: serverEmail } = await apiLogin(emailInput, password);

    // Stocker dans le contexte
    setToken(serverToken);
    setEmail(serverEmail);

    // Stocker dans localStorage pour persistance
    localStorage.setItem("jwtToken", serverToken);
    localStorage.setItem("userEmail", serverEmail);
  };

  return (
    <AuthContext.Provider value={{ token, email, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
