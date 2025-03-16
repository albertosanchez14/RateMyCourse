export default function LoadingSpinnerScreen() {
  return (
    <div className="min-h-screen flex items-center 
    justify-center pb-60">
      <div
        className="animate-spin inline-block size-10 
        border-5 border-current border-t-transparent 
        text-blue-600 rounded-full dark:text-blue-500"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
