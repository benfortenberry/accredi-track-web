function PrivacyPolicy() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <div className="max-w-3xl text-left">
        <p className="mb-4">
          At AccrediTrack, we are committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, and safeguard your
          information.
        </p>

        <h2 className="text-2xl font-semibold mb-2">
          1. Information We Collect
        </h2>
        <p className="mb-4">
          We may collect personal information such as your name, email address,
          and account details when you register or use our services.
          Additionally, we may collect usage data, such as your interactions
          with the platform.
        </p>

        <h2 className="text-2xl font-semibold mb-2">
          2. How We Use Your Information
        </h2>
        <p className="mb-4">
          We use your information to provide and improve our services,
          communicate with you, and ensure the security of our platform. We may
          also use your information for analytics and to send you updates or
          promotional materials.
        </p>

        <h2 className="text-2xl font-semibold mb-2">
          3. Sharing Your Information
        </h2>
        <p className="mb-4">
          We do not sell your personal information. However, we may share your
          information with trusted third-party service providers to help us
          deliver our services. These providers are bound by confidentiality
          agreements.
        </p>

        <h2 className="text-2xl font-semibold mb-2">4. Data Retention</h2>
        <p className="mb-4">
          We retain your data for as long as necessary to provide our services
          or comply with legal obligations. If you cancel your account, we will
          delete your data after 30 days.
        </p>

        <h2 className="text-2xl font-semibold mb-2">5. Your Rights</h2>
        <p className="mb-4">
          You have the right to access, update, or delete your personal
          information. To exercise these rights, please contact us at{" "}
          <a
            href="mailto:support@accreditrack.com"
            className="text-blue-500 underline"
          >
            support@accreditrack.com
          </a>
          .
        </p>

        <h2 className="text-2xl font-semibold mb-2">6. Security</h2>
        <p className="mb-4">
          We implement industry-standard security measures to protect your data.
          However, no method of transmission over the internet is 100% secure,
          and we cannot guarantee absolute security.
        </p>

        <h2 className="text-2xl font-semibold mb-2">
          7. Changes to This Policy
        </h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Continued use of
          our platform after any changes constitutes your acceptance of the
          updated policy.
        </p>

        <h2 className="text-2xl font-semibold mb-2">8. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us
          at{" "}
          <a
            href="mailto:support@accreditrack.com"
            className="text-blue-500 underline"
          >
            support@accreditrack.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
