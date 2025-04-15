import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button className="btn btn-neutral" onClick={() => loginWithRedirect()}>
      Log In / Sign Up
    </button>
  );
};

export default LoginButton;
