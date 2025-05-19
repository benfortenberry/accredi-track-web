import { useAuth0 } from "@auth0/auth0-react";
import { LogoutIcon } from "../../utils/SvgIcons";
const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
    title="Logout"
      className="btn  btn-sm"
      onClick={() =>
      {
        sessionStorage.removeItem("userData");
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
     
      }
    >
      <LogoutIcon />
    </button>
  );
};

export default LogoutButton;
