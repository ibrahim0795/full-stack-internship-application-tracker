export default function ResumesLoading() {
  return (
    <div
      className="mx-auto max-w-6xl animate-pulse space-y-5"
      aria-label="Loading CV manager"
    >
      <div className="bg-surface h-24 rounded-3xl" />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="bg-surface h-72 rounded-3xl" />
        <div className="bg-surface h-72 rounded-3xl" />
      </div>
    </div>
  );
}
