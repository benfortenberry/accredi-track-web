import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button className="btn btn-ghost login-button mr-4 mt-3 float-right" onClick={() => loginWithRedirect()}>
      Log In 
    </button>
  );
};

export default LoginButton;
