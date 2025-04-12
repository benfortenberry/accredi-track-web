import LoginButton from "./auth0/LoginButton";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

function Home() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
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
        <LoginButton />

       
      </div>
    </div>
  );
}

export default Home;
