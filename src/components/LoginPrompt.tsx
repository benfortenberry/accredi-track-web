import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function LoginPrompt() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  // Guard so the redirect fires at most once. Without this, a re-render while
  // Auth0 is mid-redirect could call loginWithRedirect() again.
  const redirected = useRef(false);

  // Once Auth0 has settled and the user still isn't authenticated, send them
  // straight to the hosted login instead of making them click. The visible
  // button below stays as a fallback (e.g. if a redirect is blocked).
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !redirected.current) {
      redirected.current = true;
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  // Already signed in (e.g. landed here by typing /login): skip the prompt.
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Sign in to AccrediTrack</h1>
      <p className="text-lg mb-8">
        Taking you to sign in. If nothing happens, use the button below.
      </p>
      <button className="btn btn-primary" onClick={() => loginWithRedirect()}>
        Log In
      </button>
    </div>
  );
}

export default LoginPrompt;
