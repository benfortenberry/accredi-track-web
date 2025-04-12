import LoginButton from "./auth0/LoginButton";
function LogintPrompt() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Access Restricted</h1>
      <p className="text-lg mb-8">
        {" "}
        You need to log in to access this page. Please log in to continue.
      </p>
      <LoginButton />
    </div>
  );
}

export default LogintPrompt;
