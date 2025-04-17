function DeleteModal(props: any) {
  return (
    <dialog id="delete-modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg my-5">
         {props.text}
        </h3>

        <form id="deleteForm" onSubmit={props.delete}>
          <input type="hidden" name={`${props.label}Id`} id={`${props.label}IdToDelete`}/>
      
          <button className="btn float-right btn-error mt-2">
            Yes, delete
          </button>
        </form>
      </div>
    </dialog>
  );
}

export default DeleteModal;
