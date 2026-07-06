export default function InterviewsLoading() {
  return (
    <div
      className="mx-auto max-w-6xl animate-pulse space-y-5"
      aria-label="Loading interviews"
    >
      <div className="bg-surface h-24 rounded-3xl" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-surface h-52 rounded-3xl" />
        <div className="bg-surface h-52 rounded-3xl" />
      </div>
    </div>
  );
}
