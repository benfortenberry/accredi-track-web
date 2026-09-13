import SupportContent from "./SupportContent";

// Public page: getting-started guidance + contact info. No auth, no API calls,
// so anyone (prospects, logged-out users) can reach it. Rendered standalone
// (outside the app Layout), matching Terms/Privacy — hence the "back" link and
// full-screen wrapper. The in-app equivalent is HelpPage (/help), which renders
// the same SupportContent inside the app chrome.
const Support = () => {
  return (
    <div className="min-h-screen bg-base-100 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <a href="/" className="text-sm text-primary hover:underline">
          ← Back to AccrediTrack
        </a>
        <h1 className="text-3xl font-bold mt-4 mb-6">Support</h1>
        <SupportContent />
      </div>
    </div>
  );
};

export default Support;
