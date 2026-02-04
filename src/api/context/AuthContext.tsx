import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthenticatedUser, loginWithKeycloak } from "../auth";
import { api, setAccessToken } from "../http";

import { UserRole } from "../../config";

type DomainIds = {
  beneficiaryId?: string;
  donorId?: string;
  transporterId?: string;
};

type AuthState = {
  tokens: {
    access_token: string;
    refresh_token: string;
  } | null;
  user: AuthenticatedUser | null;
  domainIds: DomainIds;
};

type AuthContextValue = {
  isLoading: boolean;
  auth: AuthState;
  primaryRole: UserRole | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    tokens: null,
    user: null,
    domainIds: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  const primaryRole: UserRole | null =
    auth.user?.roles[0] ?? null; 

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("@auth");
        if (stored) {
          const parsed = JSON.parse(stored) as AuthState;
          setAuth(parsed);
          if (parsed.tokens?.access_token) {
            setAccessToken(parsed.tokens.access_token);
          }
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function fetchDomainIds(user: AuthenticatedUser): Promise<DomainIds> {
    const ids: DomainIds = {};


    try {
      if (user.roles.includes("BENEFICIARY")) {
        const res = await api.get("/beneficiaries/me");
        ids.beneficiaryId = res.data.id;
      }
    } catch {}

    try {
      if (user.roles.includes("DONOR")) {
        const res = await api.get("/donors/me");
        ids.donorId = res.data.id;
      }
    } catch {}

    try {
      if (user.roles.includes("TRANSPORTER")) {
        const res = await api.get("/transporters/me");
        ids.transporterId = res.data.id;
      }
    } catch {}

    return ids;
  }

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const { tokens, user } = await loginWithKeycloak(username, password);
      setAccessToken(tokens.access_token);

      const domainIds = await fetchDomainIds(user);

      const newState: AuthState = {
        tokens: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        },
        user,
        domainIds,
      };

      setAuth(newState);
      await AsyncStorage.setItem("@auth", JSON.stringify(newState));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setAuth({ tokens: null, user: null, domainIds: {} });
    setAccessToken(null);
    await AsyncStorage.removeItem("@auth");
  };

  return (
    <AuthContext.Provider value={{ isLoading, auth, primaryRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
