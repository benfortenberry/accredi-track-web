import "@testing-library/jest-dom";

// jsdom does not implement the native <dialog> showModal/close methods, which
// several components call. Stub them so rendering and interactions don't throw.
// showModal toggles the `open` attribute so content inside is queryable.
if (typeof HTMLDialogElement !== "undefined") {
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
}
