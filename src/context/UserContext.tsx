import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {  withAxiosDirect } from "../utils/AxiosInstance";

interface UserContextType {
  user: any; // Replace `any` with a proper user type if available
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface User {
  userSub: string;
  email: string;
  pro: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [userData, setUserData] = useState<User | null>(null);
  const userApi = `${API_BASE_URL}/user`;
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    if (isAuthenticated && user) {
      logUser();
    }
  }, [isAuthenticated]);

  const logUser = async () => {
    const accessToken = await getAccessTokenSilently();
    const axiosInstance = withAxiosDirect(accessToken);
    const response = await axiosInstance.post(userApi, { token: accessToken });
    setUserData(response.data);
  };

  return (
    <UserContext.Provider
      value={{ user: userData, isAuthenticated, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
