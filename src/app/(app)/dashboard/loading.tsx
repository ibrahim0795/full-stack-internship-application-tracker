export default function DashboardLoading() {
  return (
    <div
      className="mx-auto max-w-7xl animate-pulse space-y-6"
      aria-label="Loading dashboard"
    >
      <div className="bg-surface h-28 rounded-3xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="bg-surface h-32 rounded-3xl" key={index} />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="bg-surface h-96 rounded-3xl" />
        <div className="bg-surface h-96 rounded-3xl" />
      </div>
    </div>
  );
}
