import React from "react";
import LoginButton from "./auth0/LoginButton";
import LogoutButton from "./auth0/LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

function Home() {
    const { user, isAuthenticated, isLoading } = useAuth0();
    if (isLoading) {
        return <div>Loading ...</div>;
      }

      console.log(user);
  
  return (


    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="text-4xl font-bold mb-4">Welcome to AccrediTrack</h1>
      <p className="text-lg mb-8">
        Manage employee licenses, certifications, and compliance with ease.
      </p>

        {isAuthenticated && user && (
            <div className="mb-4">
            <h2 className="text-2xl font-semibold ">User Profile</h2>
            <p className="text-lg ">{user.name}</p>
            <p className="text-lg ">{user.email}</p>
            {user.sub}
            </div>
        )}
     


      <div className="flex space-x-4">
        <LoginButton />

        <LogoutButton />
        <a
          href="/employees"
          className="btn btn-primary px-6 py-3 text-white rounded-lg shadow-md hover:bg-blue-600"
        >
          View Employees
        </a>
        <a
          href="/licenses"
          className="btn btn-secondary px-6 py-3 text-white rounded-lg shadow-md hover:bg-gray-700"
        >
          Manage Licenses
        </a>
      </div>
    </div>
  );
}

export default Home;