import LoginButton from "./auth0/LoginButton";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "../assets/logo_white2.png";

function Home() {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <h1 className="text-center">
        <span className="loading loading-dots loading-xl"></span>
      </h1>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <header className="w-full bg-gradient text-white py-12 text-center">
        <div className="fade-in">
          <img
            src={logo}
            alt="AccrediTrack Logo"
            className="w-32 mx-auto mb-4"
          />
          <h1 className="text-5xl font-bold mb-4">Welcome to AccrediTrack</h1>
          <p className="text-lg mb-6">
            Simplify employee license, certification and compliance management.
          </p>
          <LoginButton />
        </div>
      </header>

      <div className="container">
        <section className="w-full fade-in container pt-10 py-12 text-center">
          <h2 className="text-3xl text-black font-bold mb-6">
            Why Choose AccrediTrack?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
            <div className="p-6  border rounded-lg shadow-md">
              <h3 className="text-xl text-black font-semibold mb-2">
                Streamlined Management
              </h3>
              <p className="text-gray-600 slide-in">
                Easily track and manage employee licenses and certifications in
                one place.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-md">
              <h3 className="text-xl text-black font-semibold mb-2">
                Automated Reminders
              </h3>
              <p className="text-gray-600 slide-in">
                Never miss an expiration date with automated notifications and
                reminders.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-md">
              <h3 className="text-xl text-black font-semibold mb-2">
                Secure and Reliable
              </h3>
              <p className="text-gray-600 slide-in">
                Your data is protected with industry-leading security standards.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="w-full bg-gradient text-white py-12 text-center">
        <div className="fade-in">
          <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
          <p className="text-lg mb-6">
            Join thousands of organizations simplifying compliance management.
          </p>
        </div>
      </section>

      <footer className="w-full bg-gray-800 text-white py-6 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} AccrediTrack. All rights reserved.
        </p>
        <a href="/terms" className="text-blue-400 underline">
          Terms of Service
        </a>
      </footer>
    </div>
  );
}

export default Home;
