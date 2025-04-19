import LoginButton from "./auth0/LoginButton";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "../assets/logo_white2.png";
import GetStartedButton from "./auth0/GetStartedButton";

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
        <LoginButton />

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
          <GetStartedButton />
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

      <section className="w-full bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Designed for business teams like yours
            </h2>
            {/* <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
              Here at AccrediTrack we focus on markets where technology, innovation,
              and capital can unlock long-term value and drive economic growth.
            </p> */}
          </div>
          <div className="space-y-8 lg:grid lg:grid-cols-2 sm:gap-6 xl:gap-10 lg:space-y-0">
            <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
              <h3 className="mb-4 text-2xl font-semibold">Demo</h3>
              {/* <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                Best option for demo use
              </p> */}
              <div className="flex justify-center items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold">Free</span>
                <span className="text-gray-500 dark:text-gray-400"></span>
              </div>
              <ul role="list" className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span>Up to 5 Employees</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span>Up to 5 License Types</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span>Up to 3 Employee Licenses</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span>Manual check for status</span>
                </li>
              </ul>
              <GetStartedButton />
            </div>

            <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
              <h3 className="mb-4 text-2xl font-semibold">PRO</h3>
              {/* <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                Larger companies and critical compliance
              </p> */}
              <div className="flex justify-center items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold">$5</span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
              </div>

              <ul role="list" className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span>Unlimited Employees</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span>Unlimited License Types</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span>Unlimited Employee Licenses</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span>Automated notifications</span>
                </li>
              </ul>
              <GetStartedButton />
            </div>
          </div>
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
