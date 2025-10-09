import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { login as loginApi } from "../api/intercepteur";

export const useLogin = () => {
  const { login: authLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, motDePasse: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loginApi(email, motDePasse);

      // Appeler AuthContext pour mettre à jour le state global
      authLogin(data.token, data.email, data.role);

      setIsLoading(false);
      return data; // <-- important pour savoir que c'est ok
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
      setIsLoading(false);
      throw err;
    }
  };

  return { login, isLoading, error };
};
