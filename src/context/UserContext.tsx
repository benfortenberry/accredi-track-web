import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { withAxiosDirect } from "../utils/AxiosInstance";
import { isCancelledOver30DaysAgo } from "../utils/Utilities";
import CancelledModal from "../components/modals/CancelledModal";

interface UserContextType {
  aUser: any;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface User {
  userSub: string;
  email: string;
  pro: number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [userData, setUserData] = useState<User>();
  const userApi = `${API_BASE_URL}/user`;
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user && !userData) {
      logUser();
    }
  }, [isAuthenticated, user, userData]);

  const logUser = async () => {
    const accessToken = await getAccessTokenSilently();
    const axiosInstance = withAxiosDirect(accessToken);
    const response = await axiosInstance.post(userApi, {
      token: accessToken,
      email: user?.email,
    });
    setUserData(response.data);
    sessionStorage.setItem("userData", JSON.stringify(response.data)); // Save userData to sessionStorage

    if (response.data.pro ==2 &&  !isCancelledOver30DaysAgo(response.data.cancelled)  ) {
      (
        document.getElementById("cancelled-modal") as HTMLDialogElement
      )?.showModal();
    }
  };

  return (
    <UserContext.Provider
      value={{ aUser: userData, isAuthenticated, isLoading }}
    >
      {children}
      <CancelledModal />
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
