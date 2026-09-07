import { useGoPro } from "../utils/useGoPro";

interface UpgradeCtaProps {
  // Short bold line, e.g. "You've reached the free plan limit".
  heading?: string;
  // Explanatory sentence describing the specific cap and what PRO unlocks.
  message: string;
}

// UpgradeCta is the shared "you hit a free-plan limit" block. It explains the
// cap and gives the user a direct upgrade button, so they never have to hunt
// for "go PRO" in the nav after being blocked. Starts Stripe checkout via the
// shared useGoPro hook.
function UpgradeCta({ heading, message }: UpgradeCtaProps) {
  const goPro = useGoPro();

  return (
    <div className="rounded-box border border-primary/30 bg-primary/5 p-4">
      {heading && <h3 className="font-bold text-base mb-1">{heading}</h3>}
      <p className="text-sm text-base-content/70 mb-3">{message}</p>
      <button className="btn btn-primary btn-sm" onClick={goPro}>
        Upgrade to PRO
      </button>
    </div>
  );
}

export default UpgradeCta;
