
function TermsOfService() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <div className="max-w-3xl text-left">
        <p className="mb-4">
          Welcome to AccrediTrack! By using our services, you agree to the following terms and conditions. Please read them carefully.
        </p>

        <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing or using our platform, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, you may not use our services.
        </p>

        <h2 className="text-2xl font-semibold mb-2">2. User Responsibilities</h2>
        <p className="mb-4">
          You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account. You agree to accept responsibility for all activities that occur under your account.
        </p>

        <h2 className="text-2xl font-semibold mb-2">3. Prohibited Activities</h2>
        <p className="mb-4">
          You agree not to engage in any activities that may harm the platform, its users, or violate any applicable laws. This includes, but is not limited to, unauthorized access, data scraping, or distributing malicious software.
        </p>

        <h2 className="text-2xl font-semibold mb-2">4. Termination</h2>
        <p className="mb-4">
          We reserve the right to terminate or suspend your access to the platform at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users.
        </p>

        <h2 className="text-2xl font-semibold mb-2">5. Changes to Terms</h2>
        <p className="mb-4">
          We may update these Terms of Service from time to time. Continued use of the platform after any changes constitutes your acceptance of the new terms.
        </p>

        <h2 className="text-2xl font-semibold mb-2">6. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about these Terms of Service, please contact us at <a href="mailto:support@accreditrack.com" className="text-blue-500 underline">support@accreditrack.com</a>.
        </p>
      </div>
    </div>
  );
}

export default TermsOfService;