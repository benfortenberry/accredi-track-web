import SupportContent from "./SupportContent";

// In-app support page at /help. Rendered inside Layout, so it keeps the app
// chrome (navbar + container) instead of jumping out to the standalone public
// page. Same body as the public /support page via the shared SupportContent.
const HelpPage = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Support</h2>
      <SupportContent />
    </div>
  );
};

export default HelpPage;
