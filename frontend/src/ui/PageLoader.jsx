export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-base-100 via-base-200 to-base-300">
      <div className="text-center space-y-4">
        <div className="loading loading-spinner loading-xl text-primary"></div>
        <p className="text-base-content/60">Loading...</p>
      </div>
    </div>
  );
}