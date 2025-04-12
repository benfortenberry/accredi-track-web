import LoginButton from "./auth0/LoginButton";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "../assets/logo_white2.png"; 


function Home() {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <h1 className="text-center">
        <span className="loading loading-dots loading-xl"></span>
      </h1>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
    <img src={logo} alt="AccrediTrack Logo" className="w-32 mb-6" />

      <h1 className="text-4xl font-bold mb-4">Welcome to AccrediTrack</h1>
      <p className="text-lg mb-8">
        Manage employee licenses, certifications, and compliance with ease.
      </p>

      {/* {isAuthenticated && user && (
        <div className="mb-4">
          <h2 className="text-2xl font-semibold ">User Profile</h2>
          <p className="text-lg ">{user.name}</p>
          <p className="text-lg ">{user.email}</p>
          {user.sub}
        </div>
      )} */}

      <div className="flex space-x-4">

     <a href="/terms">Terms </a>
        <LoginButton />
      </div>
    </div>
  );
}

export default Home;
