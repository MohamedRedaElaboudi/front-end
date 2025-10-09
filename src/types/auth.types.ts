export interface LoginResponse {
  token: string;
  email: string;
  role: string;
}

export interface AuthState {
  token: string | null;
  email: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (token: string, email: string, role: string) => void;
  logout: () => void;
}
