import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import api from "../services/api";
import type {
  User,
  LoginRequest,
  LoginResponse,
} from "../types/auth.types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (
    data: LoginRequest
  ): Promise<User> => {
    const response = await api.post<LoginResponse>(
      "/auth/login",
      data
    );

    setToken(response.data.token);
    setUser(response.data.user);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );
    return response.data.user;
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};