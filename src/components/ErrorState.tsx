interface ErrorStateProps {
  // Optional technical/context detail (e.g. "Failed to fetch employees").
  // Shown small and secondary; the headline copy stays human-friendly.
  detail?: string | null;
  // Called when the user clicks "Try again". Omit to hide the retry button.
  onRetry?: () => void;
}

// ErrorState is the shared, contained error UI for data pages. It replaces the
// old pattern of blanking the whole page with a raw error string. It stays
// inside the page shell, reads like a human wrote it, and offers a retry so a
// transient failure doesn't strand the user.
function ErrorState({ detail, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="text-center rounded-box border border-error/30 bg-error/5 p-8"
    >
      <h2 className="text-lg font-bold">Something went wrong</h2>
      <p className="mt-2 text-sm text-base-content/70 max-w-md mx-auto">
        We couldn't load this page. Check your connection and try again — if it
        keeps happening, reach out to support.
      </p>
      {detail && (
        <p className="mt-2 text-xs text-base-content/40">{detail}</p>
      )}
      {onRetry && (
        <button className="btn btn-sm btn-primary mt-5" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
