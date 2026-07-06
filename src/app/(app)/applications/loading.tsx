export default function ApplicationsLoading() {
  return (
    <div
      className="mx-auto max-w-6xl animate-pulse space-y-5"
      aria-label="Loading applications"
    >
      <div className="bg-surface h-24 rounded-3xl" />
      <div className="bg-surface h-32 rounded-3xl" />
      <div className="bg-surface h-32 rounded-3xl" />
      <div className="bg-surface h-32 rounded-3xl" />
    </div>
  );
}
