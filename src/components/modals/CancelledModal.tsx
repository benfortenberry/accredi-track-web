function CancelledModal(props: any) {
  return (
    <dialog id="cancelled-modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg my-5">
          It appears your PRO subscription is no longer active. In 30 days, any
          data over the free liimits will be removed. Be sure to download your
          data from the settings page.
        </h3>

        <h3 className="font-bold text-lg my-5">
          Billing information can also be updated from the settings page.
        </h3>

        <form method="dialog">
          <button className="btn float-right btn-primary mt-2">
            I understand
          </button>
        </form>
      </div>
    </dialog>
  );
}

export default CancelledModal;
