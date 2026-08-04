import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { withAxiosDirect } from "../utils/AxiosInstance";
import { isCancelledOver30DaysAgo } from "../utils/Utilities";
import CancelledModal from "../components/modals/CancelledModal";
import FirstTimeUserModal from "../components/modals/FirstTimeUserModal";

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

  const logUser = async (forceRefresh = false) => {
    if (!isAuthenticated || !user) {
      return;
    }

    if (!forceRefresh && userData) {
      return;
    }

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

     if (response.data.firstTime  ) {
      (
        document.getElementById("first-time-user-modal") as HTMLDialogElement
      )?.showModal();
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    if (!userData) {
      logUser();
      return;
    }

    if (window.location.search.includes("checkout=success")) {
      logUser(true);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated && user) {
        logUser(true);
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isAuthenticated, user]);

  return (
    <UserContext.Provider
      value={{ aUser: userData, isAuthenticated, isLoading }}
    >
      {children}
      <CancelledModal />
        <FirstTimeUserModal />
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
