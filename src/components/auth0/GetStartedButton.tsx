import { useAuth0 } from "@auth0/auth0-react";

const GetStartedButton = () => {
  const { loginWithRedirect } = useAuth0();
 
  const handleSignUp = async () => {
    await loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  };

  return (
    <button className="btn btn-neutral" onClick={handleSignUp}>
      Get Started
    </button>
  );
};

export default GetStartedButton;

