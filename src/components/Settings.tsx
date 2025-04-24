import { useUser } from "../context/UserContext";

const Settings = () => {
  const { user } = useUser();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 ml-2">Settings</h2>

      <a href="/license-types" className="btn mx-2 btn-default">
        Edit License Types
      </a>

      {user && user.pro && (
        <a
          href="https://billing.stripe.com/p/login/test_fZe7tLabo8NH8AocMM"
          target="_blank"
          className="btn mx-2 btn-default"
        >
          Manage PRO Subscription
        </a>
      )}
    </div>
  );
};

export default Settings;
