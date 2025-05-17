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
    description: "Step 3: Track compliance and expirations.",
  },
  // Add more steps as needed
];

function FirstTimeUserModal() {
  const [step, setStep] = useState(0);

  const handlePrev = () => setStep((s) => Math.max(0, s - 1));
  const handleNext = () =>
    setStep((s) => Math.min(tutorialSteps.length - 1, s + 1));

  return (
    <dialog id="first-time-user-modal" className="modal">
      <div className="modal-box max-w-4xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-4">Getting Started Tutorial</h3>
        <video
          src={tutorialSteps[step].video}
          loop
          muted
          autoPlay
          className="w-full rounded mb-4"
        />
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
          { step < tutorialSteps.length - 1 && (<button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={step === tutorialSteps.length - 1}
            type="button"
          >
            Next
          </button>)}
          {step === tutorialSteps.length - 1 && (
            <form method="dialog">
              <button type="submit" className="btn btn-success" >
                Finish
              </button>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}

export default FirstTimeUserModal;
