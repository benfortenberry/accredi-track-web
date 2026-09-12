// Public page: getting-started guidance + contact info. No auth, no API calls,
// so anyone (prospects, logged-out users) can reach it. Rendered standalone
// (outside the app Layout), matching Terms/Privacy.
const Support = () => {
  return (
    <div className="min-h-screen bg-base-100 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <a href="/" className="text-sm text-primary hover:underline">
          ← Back to AccrediTrack
        </a>
        <h1 className="text-3xl font-bold mt-4 mb-6">Support</h1>

        <div className="space-y-6">
        <div className="rounded-box border border-base-content/10 bg-base-200 p-5">
          <h3 className="font-semibold mb-2">Email notifications</h3>
          <p className="text-sm text-base-content/70">
            Add{" "}
            <strong className="text-base-content">support@accreditrack.com</strong>{" "}
            to your safe senders list so expiration reminders don't end up in
            junk mail. PRO accounts also receive early "expiring soon" warnings
            before a credential lapses.
          </p>
        </div>

        <div className="rounded-box border border-base-content/10 bg-base-200 p-5">
          <h3 className="font-semibold mb-2">Getting started</h3>
          <ol className="text-sm text-base-content/70 list-decimal list-inside space-y-1">
            <li>Create your license types in the <strong className="text-base-content">License Types</strong> view.</li>
            <li>Add employees in the <strong className="text-base-content">Employees</strong> view.</li>
            <li>Assign credentials on each employee's license page.</li>
          </ol>
          <p className="text-sm text-base-content/70 mt-2">
            That's it — the dashboard will show your compliance status automatically.
          </p>
        </div>

        <div className="rounded-box border border-base-content/10 bg-base-200 p-5">
          <h3 className="font-semibold mb-2">Need help?</h3>
          <p className="text-sm text-base-content/70">
            If you have questions or run into an issue, reach out at{" "}
            <a
              href="mailto:support@accreditrack.com"
              className="text-primary underline"
            >
              support@accreditrack.com
            </a>
            . We typically respond within one business day.
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
