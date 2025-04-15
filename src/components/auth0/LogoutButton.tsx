import { useAuth0 } from "@auth0/auth0-react";
import { LogoutIcon } from "../../utils/SvgIcons";
const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button className="btn  btn-sm"
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      <LogoutIcon />
    </button>
  );
};

export default LogoutButton;
