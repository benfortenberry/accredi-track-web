function FirstTimeUserModal() {
  return (
    <dialog id="first-time-user-modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg my-5">
          Welcome to AccrediTrack! To get started, either click&nbsp;
            <a href="/license-types" className='underline text-primary'>here</a>
          , or close
          this modal and navigate to 'Edit License Types' on the settings page to add your first
          license.
        </h3>

      </div>
    </dialog>
  );
}

export default FirstTimeUserModal;
