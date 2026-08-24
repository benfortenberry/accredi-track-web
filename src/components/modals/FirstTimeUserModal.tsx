function FirstTimeUserModal() {
  return (
    <dialog id="first-time-user-modal" className="modal">
      <div className="modal-box max-w-lg">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <h3 className="font-bold text-lg mb-1">Welcome to AccrediTrack!</h3>
        <p className="text-sm text-base-content/60 mb-5">
          Here's how to get up and running in three steps.
        </p>

        <ol className="space-y-4">
          <li className="flex gap-4 items-start">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shadow">
              1
            </span>
            <div>
              <p className="font-semibold">Create a license type</p>
              <p className="text-sm text-base-content/60">
                Go to <strong>License Types</strong> and add the credential
                categories your team holds — e.g. "First Aid", "Forklift
                Operator", "Driver's License".
              </p>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shadow">
              2
            </span>
            <div>
              <p className="font-semibold">Add your employees</p>
              <p className="text-sm text-base-content/60">
                Go to <strong>Employees</strong> and add each team member.
                After saving, you'll be taken straight to their license page.
              </p>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shadow">
              3
            </span>
            <div>
              <p className="font-semibold">Assign credentials</p>
              <p className="text-sm text-base-content/60">
                On each employee's page, add their licenses with issue and
                expiration dates. AccrediTrack will track renewals and alert
                you automatically.
              </p>
            </div>
          </li>
        </ol>

        <div className="mt-6 flex justify-end">
          <form method="dialog">
            <button className="btn btn-primary">Got it, let's go</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default FirstTimeUserModal;
