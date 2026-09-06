// Vertical landing-page content. Each entry powers a tailored version of the
// home page at /for/<slug> (e.g. /for/healthcare). Adding a new vertical is
// just another entry here — no code changes needed.
//
// Keep copy honest: the product is the same for every vertical; only the
// framing/examples change to match the audience's language.

export interface Vertical {
  slug: string;
  // Short label used in the industries strip and internal references.
  label: string;
  // Hero headline (the big promise). Keep it punchy.
  heroHeadline: string;
  // Hero subheading (one sentence expanding the promise).
  heroSubhead: string;
  // Problem-section heading.
  problemHeading: string;
  // Problem-section supporting paragraph.
  problemBody: string;
  // Example credential/license types this audience tracks (shown as chips).
  exampleLicenses: string[];
  // SEO
  metaTitle: string;
  metaDescription: string;
}

// The default/generic content (matches the original home page copy). Used for
// the root "/" page and as a fallback for unknown slugs.
export const DEFAULT_VERTICAL: Vertical = {
  slug: "",
  label: "Every team",
  heroHeadline: "Stop tracking employee certifications in spreadsheets.",
  heroSubhead:
    "AccrediTrack keeps every license, renewal date, and expiration in one place — and alerts you before anything lapses.",
  problemHeading: "A lapsed license isn't just an inconvenience.",
  problemBody:
    "Failed audits, fines, halted work, and liability exposure — all because someone's certification quietly expired while it was buried in a spreadsheet tab nobody checked.",
  exampleLicenses: [
    "Professional licenses",
    "Safety certifications",
    "Compliance training",
    "Renewals & permits",
  ],
  metaTitle: "AccrediTrack — Employee License & Certification Tracking",
  metaDescription:
    "Track every employee license, certification, and renewal in one place. Automated expiration reminders so nothing lapses. Free to start.",
};

export const VERTICALS: Record<string, Vertical> = {
  healthcare: {
    slug: "healthcare",
    label: "Healthcare & Home Care",
    heroHeadline: "Never let a nursing license or certification lapse again.",
    heroSubhead:
      "AccrediTrack tracks every clinician's license, CPR card, and certification — and reminds you before renewal deadlines, so you stay survey-ready.",
    problemHeading: "An expired credential can fail your next survey.",
    problemBody:
      "Lapsed RN/LPN licenses, expired CPR or BLS cards, and missed CEU deadlines put your agency at risk of citations, denied claims, and staff who can't legally work their shift.",
    exampleLicenses: [
      "RN / LPN license",
      "CPR / BLS certification",
      "CNA certification",
      "CEU / continuing education",
      "TB test / health screening",
    ],
    metaTitle: "Nursing License & Certification Tracking for Healthcare Teams | AccrediTrack",
    metaDescription:
      "Track nursing licenses, CPR/BLS cards, CNA certs, and CEUs for your healthcare or home-care team. Automated renewal reminders. Stay survey-ready. Free to start.",
  },
  construction: {
    slug: "construction",
    label: "Construction & Trades",
    heroHeadline: "Keep every certification current before it shuts down the job site.",
    heroSubhead:
      "AccrediTrack tracks OSHA cards, trade licenses, and equipment certifications for your whole crew — and warns you before anything expires.",
    problemHeading: "One expired card can halt an entire job site.",
    problemBody:
      "A lapsed OSHA card, expired equipment certification, or missed license renewal can stop work on the spot, fail an inspection, and cost you the contract.",
    exampleLicenses: [
      "OSHA 10 / 30",
      "Trade & contractor licenses",
      "Equipment / forklift certs",
      "First aid / CPR",
      "Welding certifications",
    ],
    metaTitle: "OSHA & Trade Certification Tracking for Construction | AccrediTrack",
    metaDescription:
      "Track OSHA cards, trade licenses, and equipment certifications for your construction crew. Automated expiration alerts so no card lapses on the job site. Free to start.",
  },
  trucking: {
    slug: "trucking",
    label: "Transportation & Logistics",
    heroHeadline: "Track every CDL and medical card before it expires.",
    heroSubhead:
      "AccrediTrack keeps your drivers' CDLs, DOT medical cards, and endorsements current — with reminders before renewal dates so you stay DOT-compliant.",
    problemHeading: "An expired CDL or med card grounds your driver.",
    problemBody:
      "Lapsed commercial licenses, expired DOT medical cards, or missed endorsement renewals mean a driver legally can't drive — and your fleet takes the hit on audits and downtime.",
    exampleLicenses: [
      "Commercial Driver's License (CDL)",
      "DOT medical card",
      "Hazmat endorsement",
      "TWIC card",
      "Annual vehicle inspections",
    ],
    metaTitle: "CDL & DOT Medical Card Tracking for Fleets | AccrediTrack",
    metaDescription:
      "Track CDLs, DOT medical cards, and endorsements for your drivers. Automated renewal reminders to stay DOT-compliant and avoid downtime. Free to start.",
  },
  childcare: {
    slug: "childcare",
    label: "Childcare & Education",
    heroHeadline: "Walk into every inspection knowing your staff files are current.",
    heroSubhead:
      "AccrediTrack tracks background checks, CPR cards, and required training hours for every staff member — and reminds you before anything lapses, so a licensing visit is never a scramble.",
    problemHeading: "One expired clearance can cost you your license.",
    problemBody:
      "Lapsed background checks, expired CPR or first aid, or incomplete annual training hours can fail a state inspection, trigger corrective action, or put your childcare license at risk — usually discovered at the worst possible moment.",
    exampleLicenses: [
      "Background check / clearance",
      "CPR & first aid",
      "CDA / early childhood credential",
      "Annual training hours",
      "Health screening / TB test",
    ],
    metaTitle: "Staff Compliance & Certification Tracking for Childcare Centers | AccrediTrack",
    metaDescription:
      "Track background checks, CPR cards, and required training hours for your childcare staff. Automated renewal reminders so you stay licensing-ready for every inspection. Free to start.",
  },
};

export function getVertical(slug?: string): Vertical {
  if (!slug) return DEFAULT_VERTICAL;
  return VERTICALS[slug.toLowerCase()] ?? DEFAULT_VERTICAL;
}
