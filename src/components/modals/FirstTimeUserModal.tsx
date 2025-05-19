import GettingStarted  from "./GettingStarted";

// List your tutorial video files and step descriptions here

  // Add more steps as needed

function FirstTimeUserModal() {

  return (
    <dialog id="first-time-user-modal" className="modal">
      <div className="modal-box max-w-4xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-4">Getting Started Tutorial</h3>

        <GettingStarted auto={true} controls={false} finish={true} />

      
      </div>
    </dialog>
  );
}

export default FirstTimeUserModal;
