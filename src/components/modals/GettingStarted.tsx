import { useState } from "react";

// List your tutorial video files and step descriptions here
const tutorialSteps = [
  {
    video: "./1.mp4",
    description: "Step 1: Add your first license type.",
  },
  {
    video: "./2.mp4",
    description: "Step 2: Add your employees.",
  },
  {
    video: "./3.mp4",
    description: "Step 3: Add Employee Licenses.",
  },
  // Add more steps as needed
];

function GettingStarted(props: any) {
  const [step, setStep] = useState(0);

  const handlePrev = () => setStep((s) => Math.max(0, s - 1));
  const handleNext = () =>
    setStep((s) => Math.min(tutorialSteps.length - 1, s + 1));

  return (
    <div>
      <div className="w-full rounded mb-4 border border-base-300 bg-base-200 p-4">
        <p className="font-semibold">Tutorial video is temporarily disabled.</p>
        <p className="text-sm opacity-80">Follow the step notes below to get started.</p>
      </div>
      <p className="mb-4">{tutorialSteps[step].description}</p>
      <div className="flex justify-between">
        <button
          className="btn btn-outline"
          onClick={handlePrev}
          disabled={step === 0}
          type="button"
        >
          Previous
        </button>
        <span>
          Step {step + 1} of {tutorialSteps.length}
        </span>
        {step < tutorialSteps.length - 1 && (
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={step === tutorialSteps.length - 1}
            type="button"
          >
            Next
          </button>
        )}

          {step === tutorialSteps.length - 1 && props.finish && (
          <form method="dialog">
            <button type="submit" className="btn btn-success">
              Finish
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

export default GettingStarted;
