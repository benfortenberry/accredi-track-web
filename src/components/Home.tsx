import LoginButton from "./auth0/LoginButton";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "../assets/logo_white2.png";
import GetStartedButton from "./auth0/GetStartedButton";
import { getVertical } from "../content/verticals";
import { useSeo } from "../utils/useSeo";
import {
  WrenchScrewdriverIcon,
  HeartIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

const CheckIcon = () => (
  <svg
    className="flex-shrink-0 w-5 h-5 text-primary"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

function Home() {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  // Resolve the vertical from the /for/:vertical route param. Falls back to the
  // generic default for "/" or unknown slugs.
  const { vertical: verticalSlug } = useParams();
  const vertical = getVertical(verticalSlug);

  useSeo({
    title: vertical.metaTitle,
    description: vertical.metaDescription,
    url: verticalSlug
      ? `https://accreditrack.com/for/${vertical.slug}`
      : "https://accreditrack.com/",
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <h1 className="text-center mt-20">
        <span className="loading loading-dots loading-xl"></span>
      </h1>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-base-100">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <header className="relative w-full bg-gradient text-white pt-20 pb-32 px-6 text-center overflow-hidden">
        {/* Subtle dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden="true"
        />

        <LoginButton />

        <div className="fade-in max-w-3xl mx-auto relative z-10">
          <img
            src={logo}
            alt="AccrediTrack"
            className="w-24 mx-auto mb-6"
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
            {vertical.heroHeadline}
          </h1>
          <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-xl mx-auto">
            {vertical.heroSubhead}
          </p>
          <GetStartedButton />
          <p className="mt-4 text-sm opacity-75">Free to start. No credit card required.</p>
        </div>

        {/* Browser frame mockup with dashboard screenshot */}
        <div className="relative z-10 max-w-4xl mx-auto mt-12">
          <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10">
            {/* Browser chrome bar */}
            <div className="bg-neutral flex items-center gap-2 px-4 py-2.5">
              <span className="w-3 h-3 rounded-full bg-red-400/70"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400/70"></span>
              <span className="w-3 h-3 rounded-full bg-green-400/70"></span>
              <span className="ml-3 text-xs text-neutral-content/50 font-mono">accreditrack.com/dashboard</span>
            </div>
            {/* Screenshot */}
            <img
              src="/dashboard-preview.png"
              alt="AccrediTrack dashboard showing compliance charts, employee counts, and expiration tracking"
              className="w-full block"
            />
          </div>
        </div>
      </header>

      {/* ── INDUSTRY TRUST STRIP ───────────────────────────────────── */}
      <div className="w-full bg-base-200 border-b border-base-300 py-5 px-6">
        <p className="text-center text-xs font-semibold text-base-content/50 uppercase tracking-widest mb-4">
          Built for teams in
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-base-content/70">
          {[
            { label: "Construction & Trades", Icon: WrenchScrewdriverIcon },
            { label: "Healthcare & Home Care", Icon: HeartIcon },
            { label: "Childcare & Education", Icon: AcademicCapIcon },
            { label: "Security & Safety", Icon: ShieldCheckIcon },
            { label: "Transportation", Icon: TruckIcon },
          ].map(({ label, Icon }) => (
            <span key={label} className="flex items-center gap-2 text-sm font-medium">
              <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── PROBLEM / COST OF DOING NOTHING ───────────────────────── */}
      <section className="w-full py-16 px-6 bg-base-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-base-content mb-4">
            {vertical.problemHeading}
          </h2>
          <p className="text-base-content/70 text-lg mb-10">
            {vertical.problemBody}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              {
                heading: "Regulatory fines",
                body: "Many industries levy per-day fines for employing workers with expired credentials.",
              },
              {
                heading: "Work stoppages",
                body: "A single missing license can shut down a job site or fail a state inspection on the spot.",
              },
              {
                heading: "Liability exposure",
                body: "If an incident occurs and credentials were lapsed, insurance claims can be denied entirely.",
              },
            ].map(({ heading, body }) => (
              <div
                key={heading}
                className="p-5 rounded-box border border-primary/20 bg-primary/5"
              >
                <h3 className="font-bold text-primary mb-1">{heading}</h3>
                <p className="text-sm text-base-content/70">{body}</p>
              </div>
            ))}
          </div>

          {/* Example credentials this audience tracks */}
          <div className="mt-10">
            <p className="text-xs font-semibold text-base-content/50 uppercase tracking-widest mb-3">
              Track credentials like
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {vertical.exampleLicenses.map((name) => (
                <span
                  key={name}
                  className="px-3 py-1.5 rounded-full border border-base-300 bg-base-200 text-sm text-base-content/80"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="w-full bg-base-200 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-base-content mb-2">
            Up and running in minutes
          </h2>
          <p className="text-base-content/60 mb-12">No training required. No implementation fee.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                heading: "Add your employees",
                body: "Import or manually add your team. Takes about two minutes for a crew of ten.",
              },
              {
                step: "2",
                heading: "Attach their licenses",
                body: "Add each credential — license type, issue date, expiration date. That's it.",
              },
              {
                step: "3",
                heading: "Get notified automatically",
                body: "AccrediTrack emails you before anything expires. Nothing falls through the cracks.",
              },
            ].map(({ step, heading, body }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white font-extrabold text-lg flex items-center justify-center mb-4 shadow">
                  {step}
                </div>
                <h3 className="font-bold text-base-content mb-1">{heading}</h3>
                <p className="text-sm text-base-content/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section className="w-full py-16 px-6 bg-base-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-base-content text-center mb-10">
            Everything you need. Nothing you don't.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                heading: "Compliance dashboard",
                body: "See your overall compliance rate, expiring soon count, and expired licenses at a glance.",
              },
              {
                heading: "Automated email reminders",
                body: "Set it once. Your team gets notified before credentials expire — no manual follow-up.",
              },
              {
                heading: "Per-employee license history",
                body: "Every credential for every employee, in one place. Edit, renew, or remove in seconds.",
              },
              {
                heading: "Data export",
                body: "Export all employee license data to CSV any time — useful for audits and reporting.",
              },
            ].map(({ heading, body }) => (
              <div
                key={heading}
                className="flex gap-4 p-5 rounded-box border border-base-300 bg-base-100 shadow-sm"
              >
                <div className="mt-1 flex-shrink-0">
                  <CheckIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-base-content mb-1">{heading}</h3>
                  <p className="text-sm text-base-content/60">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────── */}
      <section className="w-full bg-base-200 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-base-content mb-2">
            Simple, honest pricing
          </h2>
          <p className="text-base-content/60 mb-12">
            Start free. Upgrade when you're ready.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-3xl mx-auto">

            {/* Free tier */}
            <div className="flex flex-col p-8 bg-base-100 rounded-box border border-base-300 shadow-sm text-left">
              <h3 className="text-xl font-bold text-base-content mb-1">Free</h3>
              <p className="text-sm text-base-content/60 mb-6">
                Great for trying it out with a small team.
              </p>
              <div className="flex items-baseline mb-8">
                <span className="text-5xl font-extrabold text-base-content">$0</span>
                <span className="ml-2 text-base-content/40">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  "Up to 5 employees",
                  "Up to 5 license types",
                  "Up to 3 credentials per employee",
                  "Compliance dashboard",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-base-content/70">
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
              <GetStartedButton />
            </div>

            {/* Pro tier */}
            <div className="flex flex-col p-8 bg-base-100 rounded-box border-2 border-primary shadow-lg text-left relative">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide shadow">
                Most Popular
              </span>
              <h3 className="text-xl font-bold text-base-content mb-1">Pro</h3>
              <p className="text-sm text-base-content/60 mb-6">
                For growing teams that can't afford compliance gaps.
              </p>
              <div className="flex items-baseline mb-8">
                <span className="text-5xl font-extrabold text-base-content">$19</span>
                <span className="ml-2 text-base-content/40">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  "Unlimited employees",
                  "Unlimited license types",
                  "Unlimited credentials",
                  "Automated email reminders",
                  "Compliance dashboard & charts",
                  "CSV data export",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-base-content/70">
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
              <GetStartedButton />
            </div>

          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="w-full bg-gradient text-white py-16 px-6 text-center">
        <div className="fade-in max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-3">
            Ready to get your team compliant?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Takes five minutes to set up. Free forever for small teams.
          </p>
          <GetStartedButton />
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="w-full bg-neutral text-neutral-content py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p className="opacity-60">© {new Date().getFullYear()} AccrediTrack. All rights reserved.</p>
          <div className="flex gap-6 opacity-60">
            <a href="/privacy" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
            <a href="/terms" className="hover:opacity-100 transition-opacity">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;
