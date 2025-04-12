import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <h1 className="text-center">
        <span className="loading loading-dots loading-xl"></span>
      </h1>
    ); // Show a loading state while checking authentication
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Redirect to home if not authenticated
  }

  return children; // Render the protected component if authenticated
}

export default ProtectedRoute;
