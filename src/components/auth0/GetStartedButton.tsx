import { useAuth0 } from "@auth0/auth0-react";
import { track } from "../../utils/analytics";

const GetStartedButton = () => {
  const { loginWithRedirect } = useAuth0();
 
  const handleSignUp = async () => {
    track("get_started_clicked");
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

